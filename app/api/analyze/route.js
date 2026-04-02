// ASHIRA Sales Intelligence — API Route v2
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLAYBOOK = {
  stages: [
    { id: 'bienvenida', label: 'Bienvenida', keywords: ['información', 'hola', 'buenas', 'qué es', 'cómo funciona', 'me interesa', 'quisiera saber', 'vi el anuncio', 'me apareció'] },
    { id: 'calificacion', label: 'Calificación', keywords: ['consultorio', 'clínica', 'médico', 'doctor', 'enfermera', 'trabajamos', 'tenemos', 'somos', 'soy', 'recepcionista', 'asistente'] },
    { id: 'dolor', label: 'Amplificación de dolor', keywords: ['problema', 'difícil', 'complicado', 'caos', 'perdemos', 'busco', 'no encontramos', 'tardamos', 'se pierde', 'desorden'] },
    { id: 'precio', label: 'Presentación de precio', keywords: ['precio', 'costo', 'cuánto', 'cobran', 'vale', 'caro', 'presupuesto', 'económico', 'inversión', 'plan', 'planes'] },
    { id: 'social_proof', label: 'Prueba social', keywords: ['han usado', 'clientes', 'referencia', 'alguien', 'conocen', 'quién lo usa', 'ejemplo', 'caso'] },
    { id: 'urgencia', label: 'Urgencia', keywords: ['cuándo', 'disponible', 'empezar', 'inicio', 'pronto', 'ahora', 'hoy', 'esta semana'] },
    { id: 'cierre', label: 'Cierre', keywords: ['registro', 'registrarme', 'probar', 'empezar', 'link', 'cómo entro', 'cómo accedo', 'me anoto', 'quiero entrar'] },
    { id: 'objecion_precio', label: 'Objeción: Precio', keywords: ['muy caro', 'no tengo presupuesto', 'costoso', 'mucho dinero', 'no puedo pagar', 'reducir', 'descuento'] },
    { id: 'objecion_tiempo', label: 'Objeción: No tengo tiempo', keywords: ['no tengo tiempo', 'muy ocupado', 'no hay tiempo', 'complicado aprender', 'difícil', 'no podría'] },
    { id: 'objecion_sistema', label: 'Objeción: Ya uso otro sistema', keywords: ['ya uso', 'excel', 'whatsapp', 'otro sistema', 'tenemos uno', 'ya tenemos', 'funcionamos así'] },
    { id: 'objecion_datos', label: 'Objeción: Seguridad de datos', keywords: ['seguro', 'seguridad', 'datos', 'privacidad', 'confidencial', 'hackear', 'confiable', 'protegido'] },
    { id: 'objecion_pensandolo', label: 'Objeción: Lo pienso', keywords: ['lo pienso', 'te aviso', 'después', 'luego', 'veo', 'lo consulto', 'lo analizo', 'no sé'] },
    { id: 'reactivacion', label: 'Reactivación', keywords: ['sigo aquí', 'olvidé', 'estaba ocupado', 'volviendo', 'retomando'] },
  ],
  techniques: {
    bienvenida: { name: 'Espejo de dolor + CTA', tag: 'BIENVENIDA' },
    calificacion: { name: 'SPIN Lite — Diagnóstico', tag: 'CALIFICACIÓN' },
    dolor: { name: 'Costo de inacción', tag: 'AMPLIFICACIÓN' },
    precio: { name: 'Sándwich', tag: 'PRECIO' },
    social_proof: { name: 'Feel-Felt-Found', tag: 'PRUEBA SOCIAL' },
    urgencia: { name: 'Amarre + urgencia real', tag: 'URGENCIA' },
    cierre: { name: 'Cierre asuntivo', tag: 'CIERRE' },
    objecion_precio: { name: 'Feel-Felt-Found + Reencuadre', tag: 'OBJECIÓN: PRECIO' },
    objecion_tiempo: { name: 'FAB — Inversión de objeción', tag: 'OBJECIÓN: TIEMPO' },
    objecion_sistema: { name: 'FAB — Gap invisible', tag: 'OBJECIÓN: SISTEMA' },
    objecion_datos: { name: 'Validar + prueba técnica', tag: 'OBJECIÓN: DATOS' },
    objecion_pensandolo: { name: 'Descubrir objeción real', tag: 'OBJECIÓN: DUDA' },
    reactivacion: { name: 'Reciprocidad + reapertura', tag: 'REACTIVACIÓN' },
  }
};

function scoreMessage(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const stage of PLAYBOOK.stages) {
    let score = 0;
    for (const kw of stage.keywords) {
      if (lower.includes(kw)) score += 15;
    }
    if (score > 0) scores[stage.id] = score;
  }

  // Sentiment bonuses
  if (/\?/.test(message)) {
    Object.keys(scores).forEach(k => scores[k] = (scores[k] || 0) + 5);
  }
  const negWords = ['no ', 'pero ', 'sin embargo', 'aunque'];
  if (negWords.some(w => lower.includes(w))) {
    ['objecion_precio', 'objecion_tiempo', 'objecion_sistema', 'objecion_datos', 'objecion_pensandolo']
      .forEach(k => scores[k] = (scores[k] || 0) + 8);
  }
  if (message.length < 30) scores['bienvenida'] = (scores['bienvenida'] || 0) + 10;
  if (message.length > 150) {
    ['dolor', 'objecion_precio', 'objecion_datos'].forEach(k => scores[k] = (scores[k] || 0) + 5);
  }

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => ({
      id,
      label: PLAYBOOK.stages.find(s => s.id === id)?.label,
      score,
      technique: PLAYBOOK.techniques[id],
    }));

  return sorted;
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY no configurada. Agrégala en Vercel → Settings → Environment Variables.' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    if (!message?.trim()) return Response.json({ error: 'Mensaje vacío' }, { status: 400 });

    const localScores = scoreMessage(message);

    const systemPrompt = `Eres el asistente de ventas de ASHIRA, una plataforma SaaS de gestión médica venezolana.

Tu trabajo: analizar un mensaje de un prospecto y sugerir las 3 mejores respuestas del playbook de ventas de ASHIRA.

El playbook incluye estas técnicas:
- Sándwich (Beneficio→Precio→Beneficio→Pregunta)
- FAB (Feature→Advantage→Benefit)  
- SPIN Lite (preguntas de diagnóstico)
- Feel-Felt-Found (para objeciones)
- Sí Escalonado (micro-compromisos)
- Challenger (insight inesperado)
- Reciprocidad (da valor primero)
- Cierre Alternativo (no si/no sino cuál)
- Amarre (bonus por actuar hoy)

Contexto ASHIRA:
- SaaS médico para Venezuela
- Gestión de citas, historiales, coordinación de equipos
- Trial 15 días gratis: https://ashira.click/register
- Cliente referencia: SafeCare (servicio médico a domicilio en Venezuela)
- Colores marca: azul eléctrico #4A7DE8, menta #7FFFD4
- Segmentos: médicos independientes, clínicas privadas pequeñas

IMPORTANTE: Responde SOLO con JSON válido, sin texto adicional, sin markdown.

Formato exacto:
{
  "stage": "nombre de la etapa de ventas detectada",
  "stage_confidence": 85,
  "sentiment": "positivo|neutro|negativo|con_objecion",
  "urgency_level": 3,
  "responses": [
    {
      "rank": 1,
      "technique": "nombre de la técnica",
      "technique_tag": "TAG CORTO",
      "score": 92,
      "reasoning": "Por qué esta técnica es ideal para este mensaje (1-2 oraciones)",
      "message": "Mensaje completo listo para copiar y pegar, en español venezolano, con emojis apropiados"
    },
    {
      "rank": 2,
      "technique": "nombre",
      "technique_tag": "TAG",
      "score": 78,
      "reasoning": "razón",
      "message": "mensaje completo"
    },
    {
      "rank": 3,
      "technique": "nombre",
      "technique_tag": "TAG",
      "score": 65,
      "reasoning": "razón",
      "message": "mensaje completo"
    }
  ],
  "key_signals": ["señal 1", "señal 2", "señal 3"],
  "next_step": "Acción concreta recomendada después de enviar la respuesta #1"
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1800,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Analiza este mensaje del prospecto:\n\n"${message}"\n\nScores del análisis local: ${JSON.stringify(localScores)}\n\nGenera las 3 mejores respuestas del playbook ASHIRA.` }],
    });

    const raw = response.content[0].text.trim();
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(clean);
    
    // Cost calculation ($3/M input, $15/M output)
    const inputCost = (response.usage.input_tokens / 1000000) * 3;
    const outputCost = (response.usage.output_tokens / 1000000) * 15;

    return Response.json({
      ...result,
      local_scores: localScores,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        input_cost: inputCost,
        output_cost: outputCost,
        total_cost: inputCost + outputCost
      }
    });
  } catch (err) {
    console.error('ASHIRA Analyze Error:', err);
    let errorMsg = 'Error al analizar el mensaje.';
    if (err.status === 401) errorMsg = 'API key inválida. Verifica ANTHROPIC_API_KEY en Vercel → Settings → Environment Variables.';
    else if (err.status === 404) errorMsg = 'Modelo no encontrado. Contacta al soporte.';
    else if (err instanceof SyntaxError) errorMsg = 'Error procesando respuesta IA. Intenta de nuevo.';
    else if (err.message) errorMsg = err.message;
    return Response.json({ error: errorMsg }, { status: 500 });
  }
}