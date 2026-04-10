'use client';
import { useState, useEffect, useCallback } from 'react';

// ─── STATIC FALLBACK DATA (shown before first n8n run) ────────────────────────
const STATIC_PROFILES = [
  {
    id: 'recepcionista', icon: '📋', label: 'Recepcionista / Asistente',
    badge: 'PRIORIDAD MÁXIMA', badgeColor: 'green',
    dolor: 'Caos diario — confirmar citas por WhatsApp, buscar historiales en carpetas físicas, manejar llamadas mientras registra pacientes. Sobrecargadas de tareas que consumen toda la jornada.',
    mensaje: 'ASHIRA no te quita el trabajo — te quita el caos. Tus citas organizadas, los historiales en un clic, sin buscar papeles.',
    canal: 'Instagram Reels, Stories "un día en la vida"',
    cta: 'Etiqueta a la recepcionista de tu consultorio',
    por_que: 'Puede convencer al médico desde adentro. Es el champion interno más accesible.'
  },
  {
    id: 'medico', icon: '🩺', label: 'Médico independiente',
    badge: 'ALTA PRIORIDAD', badgeColor: 'blue',
    dolor: 'Administra solo. Todo recae en él: citas, historiales, cobros. Pierde tiempo en administrativo que debería invertir en pacientes.',
    mensaje: 'Tu tiempo vale más que buscar papeles. ASHIRA hace lo administrativo para que tú te concentres en lo que importa.',
    canal: 'Instagram posts educativos, DM directo',
    cta: '¿Cuántas horas pierdes a la semana en esto?',
    por_que: 'Decide solo y rápido. No necesita aprobación. Una sola venta.'
  },
  {
    id: 'director', icon: '🏥', label: 'Director / Gerente de clínica',
    badge: 'ALTA PRIORIDAD', badgeColor: 'blue',
    dolor: 'Coordinar múltiples médicos, turnos, agendas cruzadas, facturación. La desorganización le cuesta pacientes y dinero.',
    mensaje: 'Centraliza tu clínica completa en una sola plataforma. Tus médicos coordinados, tus citas sin cruces.',
    canal: 'Instagram contenido de liderazgo, demo presencial',
    cta: 'Demo personalizada por videollamada',
    por_que: 'Un director convierte toda la clínica. Una venta = múltiples usuarios activos.'
  },
  {
    id: 'paciente', icon: '👤', label: 'Paciente (canal indirecto)',
    badge: 'ESTRATÉGICO', badgeColor: 'mint',
    dolor: 'No tiene acceso a su propio historial médico entre consultas. Si cambia de médico, pierde el historial.',
    mensaje: 'Imagina tener toda tu historia médica en tu teléfono, disponible cuando la necesites.',
    canal: 'Instagram posts dirigidos al paciente, portal ASHIRA',
    cta: '¿Tu médico ya usa ASHIRA? Pídele que lo implemente.',
    por_que: 'Un paciente que pide ASHIRA a su médico convierte 10x más que cualquier anuncio.'
  },
  {
    id: 'especialista', icon: '🔬', label: 'Especialista en clínica',
    badge: 'PRIORIDAD MEDIA', badgeColor: 'amber',
    dolor: 'Comparte infraestructura con otros. Necesita que su agenda no se cruce y que sus historiales sean suyos.',
    mensaje: 'Tu consultorio, tu agenda, tus pacientes — todo tuyo, aunque compartas el espacio.',
    canal: 'Instagram contenido de "libertad profesional"',
    cta: '¿Sabías que puedes tener tu propio sistema aunque uses un consultorio ajeno?',
    por_que: 'Puede ser el primero en una clínica y generar adopción en cascada.'
  }
];

const TREND_CONFIG = {
  mejorando: { label: 'Mejorando ↑', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  estancado: { label: 'Estancado →', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  retrocediendo: { label: 'Retrocediendo ↓', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
};

const BADGE_COLORS = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  mint: 'bg-teal-100 text-teal-800 border-teal-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200'
};

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function Collapsible({ icon, title, badge, badgeColor, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-elegant rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors">
        <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <div className="font-bold text-sm tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{title}</div>
          {badge && <span className={`tag border mt-1.5 inline-block ${BADGE_COLORS[badgeColor] || BADGE_COLORS.blue}`}>{badge}</span>}
        </div>
        <span className="transition-transform duration-300 text-blue-500 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div className={`collapsible-content ${open ? 'open' : ''}`}>
        <div className="px-5 pb-5 border-t border-gray-50 pt-4">{children}</div>
      </div>
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1.5 rounded-md font-medium transition-all"
      style={{ background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(74,125,232,0.05)', color: copied ? '#059669' : '#4A7DE8', border: `1px solid ${copied ? 'rgba(16,185,129,0.2)' : 'rgba(74,125,232,0.1)'}` }}>
      {copied ? '✓ Copiado' : '⎘ Copiar'}
    </button>
  );
}

function StrategyCard({ strategy }) {
  if (!strategy || !strategy.accion) return null;
  return (
    <div className="rounded-xl p-4 mb-3 border border-gray-100 bg-white">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-gray-800 leading-relaxed flex-1">{strategy.accion}</p>
        {strategy.formato && (
          <span className="tag bg-blue-50 text-blue-700 border-blue-200 border flex-shrink-0">{strategy.formato}</span>
        )}
      </div>
      {strategy.metrica && (
        <p className="text-xs text-gray-500 italic">📊 {strategy.metrica}</p>
      )}
    </div>
  );
}

function AIStrategySection({ label, strategies, icon }) {
  if (!strategies || strategies.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{icon} {label}</p>
      {strategies.map((s, i) => <StrategyCard key={i} strategy={s} />)}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card-elegant rounded-2xl p-5 bg-white animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Panorama', icon: '📡' },
  { id: 'profiles', label: 'Perfiles', icon: '👥' },
  { id: 'strategies', label: 'Estrategias IA', icon: '🤖' },
  { id: 'content', label: 'Contenido', icon: '🎬' },
  { id: 'hashtags', label: 'Hashtags', icon: '#' },
  { id: 'history', label: 'Historial', icon: '📈' }
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MarketingSection() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketing-intel');
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date().toLocaleString('es-VE'));
    } catch (e) {
      setData({ hasData: false, error: 'Error conectando con la base de datos' });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const trend = data?.trend ? TREND_CONFIG[data.trend] : null;

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="card-elegant rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-black tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
              Inteligencia de Marketing
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Actualizado automáticamente Lun/Mié/Vie 8am • Powered by Sonda Labs + Claude Haiku
            </p>
          </div>
          <div className="flex items-center gap-3">
            {trend && (
              <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${trend.bg} ${trend.text} ${trend.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${trend.dot} animate-pulse`} />
                {trend.label}
              </span>
            )}
            <button onClick={loadData} disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50">
              {loading ? '...' : '↻ Actualizar'}
            </button>
          </div>
        </div>

        {data?.analysis_date && (
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>📅 Último análisis: <strong className="text-gray-600">{data.analysis_date}</strong></span>
            <span>🤖 {data.model_version}</span>
            <span>💰 ${data.analysis_cost_usd?.toFixed(4)} por análisis</span>
            <span>📊 {data.snapshots_count} snapshots</span>
          </div>
        )}

        {!data?.hasData && !loading && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            ⚡ {data?.message || 'Ejecuta el workflow de n8n para generar el primer análisis automático.'}
            <div className="mt-1 font-mono text-amber-600">n8n → ASHIRA Sonda Intelligence → Execute</div>
          </div>
        )}
      </div>

      {/* AI Competitive Summary */}
      {data?.hasData && data.competitive_summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Insight principal', key: 'insight_principal', icon: '💡', color: 'blue' },
            { label: 'Oportunidad detectada', key: 'oportunidad_detectada', icon: '🎯', color: 'green' },
            { label: 'Amenaza principal', key: 'amenaza_principal', icon: '⚠️', color: 'amber' }
          ].map(item => (
            <div key={item.key} className={`card-elegant rounded-2xl p-4 bg-white border-l-4 ${item.color === 'blue' ? 'border-blue-500' : item.color === 'green' ? 'border-emerald-500' : 'border-amber-500'}`}>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
              <p className="text-sm font-medium text-gray-800 leading-snug">
                {data.competitive_summary[item.key] || '—'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-[#4A7DE8] text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? <LoadingState /> : (
        <div className="fade-in">

          {/* PANORAMA */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="card-elegant rounded-2xl p-5 bg-white">
                <p className="section-title mb-3">Benchmarking de seguidores (datos Sonda Labs)</p>
                <div className="space-y-3">
                  {[
                    { name: '@docsiapp', followers: '12.8K', pct: 100, color: '#1e40af', note: 'Crecimiento: 0' },
                    { name: '@hipocrates.salud', followers: '4.9K', pct: 38, color: '#0f766e', note: 'Engagement: 3.43%' },
                    { name: '@docguia.inc', followers: '4.5K', pct: 35, color: '#7c3aed', note: 'Best post: 69L / 26C' },
                    { name: '@ashira_soft', followers: '242', pct: 2, color: '#4A7DE8', note: '← TÚ — Oportunidad enorme' }
                  ].map(acc => (
                    <div key={acc.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-700">{acc.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{acc.note}</span>
                          <span className="text-xs font-black text-gray-900">{acc.followers}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${acc.pct}%`, background: acc.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-elegant rounded-2xl p-5 bg-white border-l-4 border-yellow-400">
                <p className="section-title mb-2">🏆 Post más exitoso de la competencia (últimos 30 días)</p>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag bg-purple-100 text-purple-800 border-purple-200 border">@docguia.inc</span>
                    <span className="tag bg-yellow-100 text-yellow-800 border-yellow-200 border">Técnica: Etiquetado</span>
                  </div>
                  <p className="text-sm text-gray-800 italic mb-3">
                    "Etiqueta a tu ginecólogo de confianza o envíale este post. Merece trabajar con herramientas del siglo 21 🫡"
                  </p>
                  <div className="flex gap-4 text-xs">
                    <span className="font-bold text-gray-700">❤️ 69 likes</span>
                    <span className="font-bold text-gray-700">💬 26 comentarios</span>
                    <span className="font-bold text-gray-700">👁️ 912 vistas</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    ✅ Funcionó porque habla al PACIENTE (no al médico) y le pide que actúe. Esta es la base de la Estrategia de Pacientes de ASHIRA.
                  </p>
                </div>
              </div>

              <div className="card-elegant rounded-2xl p-5 bg-white">
                <p className="section-title mb-3">💡 La oportunidad real</p>
                <div className="space-y-3">
                  {[
                    { icon: '🚀', text: 'Ningún competidor publica contenido dirigido a recepcionistas — nicho libre para ASHIRA.' },
                    { icon: '📉', text: '@docsiapp tiene 12.8K seguidores pero crecimiento CERO. Su estrategia está fallando.' },
                    { icon: '🔑', text: 'ASHIRA es el único con portal de pacientes en el sector. Diferenciador que nadie puede copiar rápido.' },
                    { icon: '🎯', text: 'Los leads desaparecen porque llegan sin confianza previa. El contenido construye esa confianza antes del DM.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50">
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERFILES */}
          {activeTab === 'profiles' && (
            <div className="space-y-3">
              <div className="card-elegant rounded-2xl p-4 bg-white mb-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                  ASHIRA no vende solo a médicos. Hay <strong>5 perfiles</strong> que pueden adoptar, recomendar o exigir ASHIRA en su entorno clínico. Cada uno necesita un mensaje diferente.
                </p>
              </div>
              {STATIC_PROFILES.map(p => (
                <Collapsible key={p.id} icon={p.icon} title={p.label} badge={p.badge} badgeColor={p.badgeColor}>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-xs font-bold text-red-600 mb-1">😤 Dolor principal</p>
                      <p className="text-sm text-gray-700">{p.dolor}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 mb-1">💬 Mensaje clave</p>
                      <p className="text-sm text-gray-800 italic">"{p.mensaje}"</p>
                      <div className="mt-2 flex justify-end"><CopyBtn text={p.mensaje} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-500 mb-1">📱 Canal ideal</p>
                        <p className="text-xs text-gray-700">{p.canal}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs font-bold text-gray-500 mb-1">📣 CTA</p>
                        <p className="text-xs text-gray-700">{p.cta}</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 bg-blue-50/50 p-2 rounded-lg italic">⭐ {p.por_que}</p>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}

          {/* ESTRATEGIAS IA */}
          {activeTab === 'strategies' && (
            <div className="space-y-4">
              {!data?.hasData ? (
                <div className="card-elegant rounded-2xl p-8 bg-white text-center">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Las estrategias IA aparecerán aquí
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Cuando n8n ejecute el primer análisis (Lunes, Miércoles o Viernes a las 8am), Claude Haiku generará estrategias personalizadas basadas en datos reales de Sonda Labs.
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 font-mono">
                    n8n → ASHIRA Sonda Intelligence → Manual Execution
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.changes_vs_previous?.length > 0 && (
                    <div className="card-elegant rounded-2xl p-4 bg-white border-l-4 border-blue-500">
                      <p className="section-title mb-2">🆕 Cambios vs análisis anterior</p>
                      <ul className="space-y-1">
                        {data.changes_vs_previous.map((c, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 flex-shrink-0">→</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {[
                    { key: 'strategy_recepcionista', label: 'Recepcionista / Asistente', icon: '📋' },
                    { key: 'strategy_medico_independiente', label: 'Médico independiente', icon: '🩺' },
                    { key: 'strategy_director_clinica', label: 'Director de clínica', icon: '🏥' },
                    { key: 'strategy_paciente', label: 'Paciente (canal indirecto)', icon: '👤' },
                    { key: 'strategy_especialista', label: 'Especialista en clínica', icon: '🔬' }
                  ].map(seg => (
                    <Collapsible key={seg.key} icon={seg.icon} title={seg.label}>
                      <AIStrategySection
                        label={seg.label}
                        icon={seg.icon}
                        strategies={data[seg.key]}
                      />
                    </Collapsible>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTENIDO */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Static content pillars */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { pct: '30%', label: 'Dolor', desc: 'Situaciones del día a día. Sin mencionar ASHIRA.', color: 'bg-red-500' },
                  { pct: '25%', label: 'Educación', desc: 'Posiciona a ASHIRA como experto del sector.', color: 'bg-blue-500' },
                  { pct: '25%', label: 'Prueba social', desc: 'Casos reales. SafeCare como referencia principal.', color: 'bg-emerald-500' },
                  { pct: '20%', label: 'Comunidad', desc: 'Posts de etiquetado. "Los médicos del siglo 21."', color: 'bg-teal-500' }
                ].map(p => (
                  <div key={p.label} className="card-elegant rounded-2xl p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${p.color} flex-shrink-0`} />
                      <span className="font-black text-lg text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{p.pct}</span>
                      <span className="font-bold text-sm text-gray-700">{p.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>

              {/* AI content recommendations */}
              {data?.hasData && data.content_recommendations?.length > 0 && (
                <div className="card-elegant rounded-2xl p-5 bg-white">
                  <p className="section-title mb-3">🤖 Recomendaciones IA de contenido</p>
                  <div className="space-y-3">
                    {data.content_recommendations.map((rec, i) => (
                      <div key={i} className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="tag bg-blue-100 text-blue-800 border-blue-200 border">{rec.formato}</span>
                          <span className="tag bg-purple-100 text-purple-800 border-purple-200 border">{rec.segmento}</span>
                          <span className="font-bold text-sm text-gray-800">{rec.titulo}</span>
                        </div>
                        {rec.caption_ejemplo && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-600 italic">"{rec.caption_ejemplo}"</p>
                            <div className="mt-2 flex justify-end"><CopyBtn text={rec.caption_ejemplo} /></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content insight from AI */}
              {data?.hasData && data.content_insights?.mejor_post_competencia && (
                <div className="card-elegant rounded-2xl p-5 bg-white border-l-4 border-yellow-400">
                  <p className="section-title mb-3">🏆 Best post de competencia — análisis IA</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="tag bg-purple-100 text-purple-800 border-purple-200 border">{data.content_insights.mejor_post_competencia.cuenta}</span>
                    </div>
                    <p className="text-xs text-gray-500"><strong>Por qué funcionó:</strong> {data.content_insights.mejor_post_competencia.por_que_funciono}</p>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 mb-1">💡 Cómo adaptarlo para ASHIRA:</p>
                      <p className="text-sm text-gray-800">{data.content_insights.mejor_post_competencia.adaptar_para_ashira}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Frequency guide */}
              <div className="card-elegant rounded-2xl p-5 bg-white">
                <p className="section-title mb-3">📅 Frecuencia recomendada</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Lunes: Carrusel educativo', 'Martes: Story encuesta', 'Miércoles: Reel dolor', 'Jueves: Prueba social', 'Viernes: Post etiquetado', 'Sábado: Reel humor', 'Diario: 1 Story mínimo', 'DMs: <5 min respuesta'].map((item, i) => (
                    <div key={i} className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HASHTAGS */}
          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              {[
                {
                  label: 'Sector y especialidad (alto alcance)',
                  tags: ['#MédicosVenezuela', '#SaludDigital', '#MedicinaVenezuela', '#Medicos', '#GestionMedica', '#SoftwareMedico', '#Telemedicina', '#InnovacionMedica', '#MedicinaModerna'],
                  color: 'bg-blue-100 text-blue-800 border-blue-200'
                },
                {
                  label: 'Producto y funcionalidad (alta especificidad)',
                  tags: ['#GestionClinica', '#AgendaDigital', '#HistoriaClinica', '#PortalDePaciente', '#SoftwareSalud', '#ProductividadMedica', '#GestionConsultorio', '#AgendasMedicas'],
                  color: 'bg-purple-100 text-purple-800 border-purple-200'
                },
                {
                  label: 'Venezolanos y comunidad (baja competencia)',
                  tags: ['#ConsultorioVenezuela', '#ClinicaPrivada', '#MedicoVenezolano', '#SaludPrivadaVenezuela', '#TecnologiaMedica', '#DigitalizacionMedica', '#ConsultorioDigital', '#ASHIRASalud'],
                  color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }
              ].map(group => (
                <div key={group.label} className="card-elegant rounded-2xl p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="section-title">{group.label}</p>
                    <CopyBtn text={group.tags.join(' ')} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map(tag => (
                      <button key={tag} onClick={() => navigator.clipboard.writeText(tag)}
                        className={`tag border cursor-copy hover:opacity-80 transition-opacity ${group.color}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {data?.hasData && data.hashtag_strategy?.length > 0 && (
                <div className="card-elegant rounded-2xl p-5 bg-white border-l-4 border-blue-500">
                  <p className="section-title mb-3">🤖 Hashtags recomendados por IA (este período)</p>
                  <div className="flex flex-wrap gap-2">
                    {data.hashtag_strategy.map((tag, i) => (
                      <span key={i} className="tag bg-blue-50 text-blue-700 border-blue-200 border">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-elegant rounded-2xl p-4 bg-white">
                <p className="section-title mb-2">📏 Estrategia de uso</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2"><span className="text-blue-500">→</span> Por Reel: 5-8 hashtags (2 de cada grupo)</div>
                  <div className="flex items-start gap-2"><span className="text-blue-500">→</span> Por Post: 8-12 hashtags (mezcla de los 3 grupos)</div>
                  <div className="flex items-start gap-2"><span className="text-blue-500">→</span> Por Story: 2-3 hashtags relevantes al tema</div>
                  <div className="flex items-start gap-2"><span className="text-blue-500">→</span> Nunca repetir exactamente el mismo set dos veces seguidas</div>
                </div>
              </div>
            </div>
          )}

          {/* HISTORIAL */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {!data?.hasData || !data.history?.length ? (
                <div className="card-elegant rounded-2xl p-8 bg-white text-center">
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    El historial se construirá aquí
                  </h3>
                  <p className="text-sm text-gray-500">
                    Después de 3 análisis (1.5 semanas), verás la evolución de tendencias, costos y cambios de estrategia.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {data.history.map((h, i) => {
                      const tc = TREND_CONFIG[h.trend] || TREND_CONFIG.estancado;
                      return (
                        <div key={i} className="card-elegant rounded-2xl p-5 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-gray-800">{h.date}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
                              {tc.label}
                            </span>
                          </div>
                          {h.summary?.insight_principal && (
                            <p className="text-sm text-gray-600 italic">"{h.summary.insight_principal}"</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>💰 ${h.cost?.toFixed(4)}</span>
                            {i === 0 && <span className="text-blue-500 font-bold">← Más reciente</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="card-elegant rounded-2xl p-5 bg-white">
                    <p className="section-title mb-3">📊 KPIs objetivo</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { val: '+50/sem', label: 'Seguidores nuevos' },
                        { val: '500+', label: 'Vistas por Reel' },
                        { val: '5+', label: 'DMs / semana' },
                        { val: '20+', label: 'Leads / mes' },
                        { val: '25%', label: 'DM → Trial' },
                        { val: '10+', label: 'Registros / mes' }
                      ].map(k => (
                        <div key={k.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                          <div className="text-lg font-black text-blue-600" style={{ fontFamily: 'var(--font-display)' }}>{k.val}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
