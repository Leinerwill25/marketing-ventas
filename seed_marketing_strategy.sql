-- SCRIPT DE INICIALIZACIÓN DE ESTRATEGIA ASHIRA (SEED DATA)
-- Ejecuta este script en el SQL Editor de Supabase

BEGIN;

-- 1. Insertar un Snapshot inicial (Sonda Snapshot)
-- Esto representa los datos crudos extraídos de Instagram
INSERT INTO public.sonda_snapshots (
  id,
  snapshot_date,
  days_range,
  accounts,
  metrics,
  posts,
  hashtags,
  api_status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE,
  30,
  '[
    {"username": "@docsiapp", "followers": 12800},
    {"username": "@hipocrates.slud", "followers": 4900},
    {"username": "@docguia.inc", "followers": 4500},
    {"username": "@ashira_soft", "followers": 242}
  ]'::jsonb,
  '{"status": "captured"}'::jsonb,
  '[
    {"account": "@docguia.inc", "likes": 69, "comments": 26, "caption": "Etiqueta a tu ginecólogo de confianza..."}
  ]'::jsonb,
  '["#MédicosVenezuela", "#SaludDigital", "#GestionMedica"]'::jsonb,
  '{"status": 200}'::jsonb
);

-- 2. Insertar el Análisis de Marketing (La Estrategia de la Page)
INSERT INTO public.marketing_analysis (
  analysis_date,
  snapshot_id,
  trend,
  model_version,
  competitive_summary,
  strategy_recepcionista,
  strategy_medico_independiente,
  strategy_director_clinica,
  strategy_paciente,
  strategy_especialista,
  content_recommendations,
  content_insights,
  hashtag_strategy,
  changes_vs_previous
) VALUES (
  CURRENT_DATE,
  '11111111-1111-1111-1111-111111111111',
  'mejorando',
  'claude-3-5-sonnet-seed',
  '{
    "insight_principal": "Nadie le está hablando a las RECEPCIONISTAS. Son ellas quienes sufren el caos de las carpetas físicas.",
    "oportunidad_detectada": "ASHIRA es el único con portal de pacientes + soporte a clínicas domiciliarias.",
    "amenaza_principal": "Crecimiento estancado en canales tradicionales por saturación de contenido genérico."
  }'::jsonb,
  '[
    {
      "accion": "Control total de la agenda en 1 clic.",
      "formato": "Reels / Storytime",
      "metrica": "Engagement de recepcionistas"
    }
  ]'::jsonb,
  '[
    {
      "accion": "Enfócate en curar, nosotros en los datos.",
      "formato": "LinkedIn / Posts",
      "metrica": "DMs de médicos"
    }
  ]'::jsonb,
  '[
    {
      "accion": "Auditoría real de cada consulta.",
      "formato": "Demo / Webinar",
      "metrica": "Solicitudes de demo"
    }
  ]'::jsonb,
  '[
    {
      "accion": "Tu salud en tu móvil. Siempre.",
      "formato": "Ads Consumidor",
      "metrica": "Registros en portal"
    }
  ]'::jsonb,
  '[
    {
      "accion": "Formularios a medida para tu rama económica.",
      "formato": "Congresos / DM",
      "metrica": "Conversión nicho"
    }
  ]'::jsonb,
  '[
    {
      "titulo": "El Laberinto de Papel",
      "formato": "Reel",
      "segmento": "Recepcionista",
      "caption_ejemplo": "¿Cuánto tiempo pierdes buscando una historia física? 😫"
    },
    {
      "titulo": "La Recepcionista Ninja",
      "formato": "Reel",
      "segmento": "Comunidad",
      "caption_ejemplo": "POV: Tu doctor instaló ASHIRA y tu vida cambió. 💃"
    }
  ]'::jsonb,
  '{
    "mejor_post_competencia": {
      "cuenta": "@docguia.inc",
      "por_que_funciono": "Habló al PACIENTE en lugar de al médico.",
      "adaptar_para_ashira": "Crear el post: Etiqueta a tu doctor para que te dé tus resultados por ASHIRA."
    }
  }'::jsonb,
  '["#MédicosVenezuela", "#SaludDigital", "#SoftwareMedico", "#ASHIRASalud"]'::jsonb,
  '["Migración de estrategia estática a dinámica", "Vinculación con Supabase"]'::jsonb
);

-- 3. Insertar KPIs iniciales para la gráfica
INSERT INTO public.ashira_kpis (
  recorded_date,
  ashira_followers,
  docsiapp_followers,
  hipocrates_followers,
  docguia_followers,
  trending_hashtags
) VALUES 
(CURRENT_DATE - INTERVAL '14 days', 210, 12800, 4850, 4400, '["#Salud"]'),
(CURRENT_DATE - INTERVAL '7 days', 230, 12800, 4880, 4450, '["#Medicina"]'),
(CURRENT_DATE, 242, 12800, 4900, 4500, '["#SaludDigital"]');

COMMIT;
