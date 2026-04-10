import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET() {
  try {
    const { data: analysis, error } = await supabase
      .from('marketing_analysis')
      .select('*')
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const { data: history } = await supabase
      .from('marketing_analysis')
      .select('analysis_date, trend, tokens_used, analysis_cost_usd, competitive_summary')
      .order('analysis_date', { ascending: false })
      .limit(3);

    const { data: snapshots } = await supabase
      .from('sonda_snapshots')
      .select('snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1);

    if (!analysis) {
      return Response.json({
        hasData: false,
        message: 'No hay análisis aún. Ejecuta el workflow de n8n para generar el primero.',
        snapshots_count: 0,
        history: []
      });
    }

    function safeJson(v, f) {
      if (!v) return f;
      if (typeof v === 'object') return v;
      try { return JSON.parse(v); } catch { return f; }
    }

    return Response.json({
      hasData: true,
      analysis_date: analysis.analysis_date,
      trend: analysis.trend,
      tokens_used: analysis.tokens_used,
      analysis_cost_usd: analysis.analysis_cost_usd,
      model_version: analysis.model_version,
      competitive_summary: safeJson(analysis.competitive_summary, {}),
      strategy_recepcionista: safeJson(analysis.strategy_recepcionista, []),
      strategy_medico_independiente: safeJson(analysis.strategy_medico_independiente, []),
      strategy_director_clinica: safeJson(analysis.strategy_director_clinica, []),
      strategy_paciente: safeJson(analysis.strategy_paciente, []),
      strategy_especialista: safeJson(analysis.strategy_especialista, []),
      content_recommendations: safeJson(analysis.content_recommendations, []),
      content_insights: safeJson(analysis.content_insights, {}),
      hashtag_strategy: safeJson(analysis.hashtag_strategy, []),
      changes_vs_previous: safeJson(analysis.changes_vs_previous, []),
      snapshots_count: snapshots?.length || 0,
      history: (history || []).map(h => ({
        date: h.analysis_date,
        trend: h.trend,
        cost: h.analysis_cost_usd,
        summary: safeJson(h.competitive_summary, {})
      }))
    });
  } catch (err) {
    return Response.json({ hasData: false, error: err.message }, { status: 500 });
  }
}
