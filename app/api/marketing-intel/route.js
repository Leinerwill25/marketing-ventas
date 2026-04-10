import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function safeJson(v, f) {
  if (!v) return f;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return f; }
}

// GET /api/marketing-intel → análisis más reciente + lista de todos
// GET /api/marketing-intel?id=UUID → análisis específico
// GET /api/marketing-intel?compare=UUID&with=UUID → comparar dos análisis
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const specificId = searchParams.get('id');
    const compareId = searchParams.get('compare');
    const withId = searchParams.get('with');

    // Modo comparación explícita de dos análisis
    if (compareId && withId) {
      const [{ data: a1 }, { data: a2 }] = await Promise.all([
        supabase.from('marketing_analysis').select('*').eq('id', compareId).single(),
        supabase.from('marketing_analysis').select('*').eq('id', withId).single()
      ]);
      if (!a1 || !a2) return Response.json({ error: 'Análisis no encontrado' }, { status: 404 });
      return Response.json({ mode: 'compare', analysis1: parseAnalysis(a1), analysis2: parseAnalysis(a2) });
    }

    // Obtener lista de todos los análisis para el selector
    const { data: allAnalyses } = await supabase
      .from('marketing_analysis')
      .select('id, analysis_date, trend, tokens_used, analysis_cost_usd, segment_statuses, competitive_summary')
      .order('analysis_date', { ascending: false })
      .limit(50);

    // Análisis específico o el más reciente
    let targetId = specificId;
    if (!targetId && allAnalyses?.length > 0) {
      targetId = allAnalyses[0].id;
    }

    if (!targetId) {
      return Response.json({
        hasData: false,
        message: 'No hay análisis aún. Ejecuta el workflow de n8n para generar el primero.',
        analyses_list: [],
        snapshots_count: 0
      });
    }

    const { data: analysis, error } = await supabase
      .from('marketing_analysis')
      .select('*')
      .eq('id', targetId)
      .single();

    if (error) throw error;

    // Obtener el análisis anterior para comparativa automática
    const { data: prevAnalysis } = await supabase
      .from('marketing_analysis')
      .select('*')
      .lt('analysis_date', analysis.analysis_date)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();

    const { data: snapshots } = await supabase
      .from('sonda_snapshots')
      .select('snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1);

    return Response.json({
      hasData: true,
      ...parseAnalysis(analysis),
      previous_analysis: prevAnalysis ? parseAnalysis(prevAnalysis) : null,
      analyses_list: (allAnalyses || []).map(a => ({
        id: a.id,
        date: a.analysis_date,
        trend: a.trend,
        cost: a.analysis_cost_usd,
        segment_statuses: safeJson(a.segment_statuses, {}),
        insight: safeJson(a.competitive_summary, {}).insight_principal || '—'
      })),
      snapshots_count: snapshots?.length || 0
    });

  } catch (err) {
    console.error('Marketing Intel API error:', err);
    return Response.json({ hasData: false, error: err.message }, { status: 500 });
  }
}

function parseAnalysis(a) {
  return {
    id: a.id,
    analysis_date: a.analysis_date,
    trend: a.trend,
    tokens_used: a.tokens_used,
    analysis_cost_usd: a.analysis_cost_usd,
    model_version: a.model_version,
    competitive_summary: safeJson(a.competitive_summary, {}),
    segment_statuses: safeJson(a.segment_statuses, {}),
    comparison_analysis: safeJson(a.comparison_analysis, {}),
    kpi_delta: safeJson(a.kpi_delta, {}),
    strategy_recepcionista: safeJson(a.strategy_recepcionista, []),
    strategy_medico_independiente: safeJson(a.strategy_medico_independiente, []),
    strategy_director_clinica: safeJson(a.strategy_director_clinica, []),
    strategy_paciente: safeJson(a.strategy_paciente, []),
    strategy_especialista: safeJson(a.strategy_especialista, []),
    content_recommendations: safeJson(a.content_recommendations, []),
    content_insights: safeJson(a.content_insights, {}),
    hashtag_strategy: safeJson(a.hashtag_strategy, []),
    changes_vs_previous: safeJson(a.changes_vs_previous, [])
  };
}
