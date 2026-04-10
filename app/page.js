'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for CostTracker to avoid hydration issues
const CostTracker = dynamic(() => import('../components/CostTracker'), { ssr: false });
import { trackUsage } from '../components/CostTracker';

// --- DATA ORIGINAL (RESTORED) ---

const TECHNIQUES = [
  {
    id: 'sandwich', icon: '💰', name: 'Sándwich',
    sub: 'Beneficio → Precio → Beneficio → Pregunta',
    badge: 'La que ya usas', badgeColor: 'blue',
    origin: 'Ventas telefónicas 90s', use: 'Presentar precio', type: 'Persuasión cognitiva',
    desc: 'Envuelve el precio entre dos capas de valor. El cerebro del cliente asocia el precio al valor que lo rodea, no al número en sí.',
    formula: '[Beneficio emocional] → [Precio + contexto] → [Beneficio racional] → [Pregunta de cierre suave]',
    message: `Con ASHIRA, tus historiales de pacientes van a estar siempre a la mano — sin buscar carpetas, sin depender de la memoria de nadie. 🏥

El plan individual está en [PRECIO/mes] — menos de lo que cuesta una consulta de control.

Y además incluye gestión de citas, recordatorios automáticos y soporte directo en español.

¿Eso suena como lo que necesitas para tu consultorio? 😊`,
    note: 'Regla de oro: jamás el precio solo. Siempre en el relleno del sándwich.',
  },
  {
    id: 'fab', icon: '🎯', name: 'FAB',
    sub: 'Feature → Advantage → Benefit',
    badge: 'Demos', badgeColor: 'green',
    origin: 'Ventas industriales B2B', use: 'Presentar funciones', type: 'Traslación de valor',
    desc: 'Convierte características técnicas en beneficios humanos. Los doctores no compran "módulos" — compran tiempo, tranquilidad y menos errores.',
    formula: '"ASHIRA tiene [feature] → lo que significa que [ventaja] → así que tú [beneficio personal concreto]."',
    message: `ASHIRA tiene un historial clínico digital por paciente →

lo que significa que toda la información de consultas, diagnósticos y medicación está en un solo lugar →

así que tú, o cualquier persona de tu equipo, puede encontrar lo que necesita en 10 segundos, sin llamar a nadie ni buscar en correos. 📂

¿Eso resuelve algo de lo que te genera más trabajo hoy?`,
    note: 'Aplica un FAB por feature. Nunca encadenes 3 de seguido — abruma.',
  },
  {
    id: 'spin', icon: '🔍', name: 'SPIN Lite',
    sub: 'Situación → Problema → Implicación → Necesidad',
    badge: 'Para calificar', badgeColor: 'purple',
    origin: 'Neil Rackham, Huthwaite 1988', use: 'Etapa de diagnóstico', type: 'Venta consultiva',
    desc: 'Haces preguntas que llevan al cliente a descubrir su propio problema. Cuando él lo verbaliza, la urgencia ya no la creas tú — la crea él mismo.',
    formula: 'S: ¿Cómo manejas [X]? | P: ¿Qué pasa cuando [problema]? | I: ¿Cuánto pierdes? | N: ¿Qué cambiaría si se resolviera?',
    messages: [
      { color: 'blue', text: 'S: ¿Cómo llevas hoy el control de historiales y citas? ¿Usas algún sistema o es más manual? 📋' },
      { color: 'mint', text: 'P: Cuando hay mucha carga de pacientes, ¿qué es lo que más se complica — encontrar información, coordinar el equipo, o confirmar citas? 🤔' },
      { color: 'amber', text: 'I: ¿Y eso cuánto tiempo les toma a la semana aproximadamente? Te pregunto porque cuando lo calculamos con otros consultorios, el número siempre sorprende.' },
      { color: 'blue', text: 'N: Si eso se resolviera — que todo estuviera centralizado y accesible en segundos — ¿cómo cambiaría el día a día de tu equipo? 😊' },
    ],
    note: 'No hagas las 4 preguntas juntas. Una por mensaje. Deja que responda.',
  },
  {
    id: 'fff', icon: '🤝', name: 'Feel-Felt-Found',
    sub: 'Siento → Sentían → Encontraron',
    badge: 'Objeciones', badgeColor: 'amber',
    origin: 'Tom Hopkins, ventas inmobiliarias', use: 'Cualquier objeción', type: 'Empatía + prueba social',
    desc: 'Valida la objeción (no la ignoras), la universaliza (no está solo), y la resuelve con evidencia real. Conversión 62% en objeciones de precio.',
    formula: '"Entiendo cómo te [Feel] → muchos médicos [Felt] lo mismo → y encontraron que [Found + prueba concreta]."',
    message: `Entiendo perfectamente esa sensación — el presupuesto siempre es una consideración real, especialmente en un consultorio donde cada gasto se nota.

Muchos médicos con los que hablamos al principio sentían exactamente lo mismo.

Y lo que encontraron cuando empezaron a usar ASHIRA es que en las primeras semanas ya estaban ahorrando más en tiempo administrativo de lo que costaba la suscripción.

¿Le damos esos 15 días gratis para que lo compruebes tú mismo? 😊`,
    note: 'La "prueba encontrada" debe ser específica. SafeCare es tu mejor arma aquí.',
  },
  {
    id: 'yescalado', icon: '📱', name: 'Sí Escalonado',
    sub: 'Micro-compromisos que llevan al gran sí',
    badge: 'Leads tibios', badgeColor: 'green',
    origin: 'Robert Cialdini, Influence 1984', use: 'Leads fríos o tibios', type: 'Psicología de compromiso',
    desc: 'Cada pequeño "sí" crea coherencia interna. No empieces pidiendo el registro; empieza pidiendo algo pequeño.',
    formula: 'Pregunta fácil → pregunta de dolor → pregunta de visión → CTA de bajo riesgo (trial) → CTA de compra',
    messages: [
      { color: 'blue', text: '¿Tienes consultorio propio o trabajas en una clínica? 🖐️' },
      { color: 'mint', text: '[Responde] ¿Y cómo llevas hoy el control de las citas — digital, en papel, o mezcla de los dos?' },
      { color: 'amber', text: '[Responde] ¿Te ha pasado alguna vez perder o retrasar algo importante por no encontrar un historial a tiempo?' },
      { color: 'blue', text: '[Responde] Perfecto — entonces ASHIRA es exactamente para ti. ¿Empezamos con los 15 días gratis?\n👉 https://ashira.click/register' },
    ],
    note: 'Cuatro síes pequeños hacen el quinto (el registro) mucho más fácil.',
  },
  {
    id: 'challenger', icon: '💡', name: 'Challenger',
    sub: 'Enseñar → Adaptar → Tomar control',
    badge: 'Directores', badgeColor: 'purple',
    origin: 'CEB, The Challenger Sale 2011', use: 'Decisores institucionales', type: 'Venta disruptiva',
    desc: 'Desafías al cliente con un insight que él no tenía. Muy potente con directores de clínica que creen que "ya tienen todo bajo control".',
    formula: '[Insight inesperado] → [cómo aplica a su situación] → [ASHIRA como solución natural]',
    message: `Buenas tardes, [nombre]. Te cuento algo que descubrimos trabajando con consultorios en Venezuela:

El 70% del tiempo administrativo en clínicas privadas se pierde en 3 tareas: buscar historiales, confirmar citas y coordinar entre el equipo médico.

No es un problema de personal — es un problema de sistema. Y la mayoría de las clínicas lo resuelven contratando más recepcionistas, cuando la solución real es centralizar.

¿Cuánto tiempo está perdiendo tu equipo en esas tres cosas hoy? Con gusto te hago el cálculo. 📋`,
    note: 'No empieces hablando de ASHIRA. Empieza con el insight.',
  },
  {
    id: 'reciprocidad', icon: '🎁', name: 'Reciprocidad',
    sub: 'Da primero, vende después',
    badge: 'Contacto frío', badgeColor: 'amber',
    origin: 'Robert Cialdini, principio universal', use: 'Primer contacto frío', type: 'Generosidad estratégica',
    desc: 'Das algo de valor real sin pedir nada. El cerebro siente una deuda psicológica y está más dispuesto a escucharte cuando sí pidas algo.',
    formula: '[Regalo de valor genuino sin CTA] → [seguimiento 24-48h] → [conversión mucho más suave]',
    message: `¡Hola! Vi que trabajas en [especialidad/clínica].

Te comparto algo que les ha funcionado muy bien a otros consultorios: una checklist de los 5 errores más comunes en la gestión de citas que cuestan pacientes sin que el médico lo note.

¿Te la envío? Es gratis, sin ningún compromiso 😊`,
    note: 'El regalo puede ser un PDF, checklist o dato. El registro llega en el segundo o tercer mensaje.',
  },
  {
    id: 'alternativo', icon: '🔄', name: 'Cierre Alternativo',
    sub: 'No preguntes si — pregunta cuál',
    badge: 'Cierre', badgeColor: 'green',
    origin: 'Zig Ziglar, ventas clásicas', use: 'Momento de cierre', type: 'Decisión guiada',
    desc: 'En vez de preguntar "¿quieres comprar?" (admite un no), preguntas entre dos opciones que ambas llevan a la venta.',
    formula: '"¿Prefieres [opción A] o [opción B]?" — ambas opciones avanzan hacia la venta.',
    message: `¿Prefieres empezar con el plan individual para tu consultorio, o te conviene más el plan clínica para incluir a todo tu equipo desde el inicio? 😊

Los dos tienen los 15 días gratuitos — solo quiero asegurarme de que entres al plan que mejor se adapta a tu caso.`,
    note: 'Nunca: "¿Quieres registrarte?" Siempre: "¿Cuál de estas dos opciones te queda mejor?"',
  },
  {
    id: 'amarre', icon: '🔗', name: 'Cierre por Amarre',
    sub: 'Bonus si actúas hoy',
    badge: 'Urgencia real', badgeColor: 'amber',
    origin: 'Ben Gay III, ventas directas', use: 'Leads indecisos', type: 'Incentivo temporal',
    desc: 'Ofreces un beneficio adicional condicionado a que actúen hoy. El bonus debe ser algo que genuinamente puedes dar.',
    formula: '"Si confirmas hoy, [bonus específico y genuino] — de lo contrario [consecuencia natural]."',
    message: `Quiero darte algo extra: si te registras hoy, yo personalmente te ayudo a configurar tu primera agenda y a importar tus pacientes existentes.

Son 20 minutos por videollamada que normalmente no podemos ofrecer a todos, pero esta semana tengo espacio.

¿Lo agendamos? 📅
👉 https://ashira.click/register`,
    note: 'El amarre DEBE ser real. Es tu diferenciador humano frente a cualquier SaaS grande.',
  },
];

const FLOW_STEPS = [
  { n: 1, title: 'Bienvenida', tag: 'Gancho inmediato', color: 'blue', tech: 'Espejo de dolor + CTA directo',
    message: `¡Hola [nombre]! 👋 Gracias por escribirnos, qué bueno que estés aquí.

Somos ASHIRA — la plataforma creada para que médicos y clínicas dejen de perder tiempo en lo administrativo y lo pongan donde vale: en sus pacientes.

Con ASHIRA puedes:
🏥 Centralizar todos los historiales médicos en un solo lugar seguro
📅 Gestionar citas sin errores ni doble agendamiento
📂 Olvidarte de buscar por cuál correo llegó tal documento
💡 Mantener a recepción, enfermería y médicos coordinados en tiempo real

Y para que lo veas con tus propios ojos, te damos 15 días completamente GRATIS:
👉 https://ashira.click/register

Sin tarjeta. Sin contratos. Solo entra y prueba.

¿Tienes consultorio propio o trabajas en una clínica? 🙂`,
    note: 'La pregunta final califica al prospecto y personaliza el siguiente mensaje.' },
  { n: 2, title: 'Calificación', tag: 'Diagnóstico', color: 'blue', tech: 'SPIN Lite — preguntas de situación y problema',
    message: `[Si tiene consultorio propio]
¡Perfecto! Los médicos con consultorio propio son exactamente a quienes más le ayuda ASHIRA.

Cuéntame un poco — ¿cómo manejas hoy las citas y los historiales de tus pacientes? ¿Usas algún sistema o lo llevas manual/en Excel? 📋

—————————————————————
[Si trabaja en clínica]
¡Genial! Para clínicas ASHIRA es especialmente poderoso porque centraliza a todo el equipo.

¿Cuántos médicos o especialistas hay en la clínica aproximadamente? Así te puedo decir exactamente qué plan les conviene más 😊`,
    note: 'No vendas todavía. Escucha. La información que te da aquí define toda la conversación siguiente.' },
  { n: 3, title: 'Amplificación del dolor', tag: 'Urgencia real', color: 'mint', tech: 'Costo de la inacción',
    message: `Entiendo perfectamente. La mayoría de los consultorios que nos contactan llevan años así — con Excel, WhatsApp y correos mezclados, y funcionan… pero a un costo enorme de tiempo y errores que no siempre se ven.

Dime, ¿cuántas horas a la semana crees que pierde tu equipo buscando información de pacientes, con firmando citas o resolviendo confusiones? 🤔

Te lo pregunto porque cuando lo calculamos con nuestros clientes, el número siempre sorprende.`,
    note: 'Esta pregunta hace que el prospecto CALCULE su propio dolor. La urgencia se descubre, no se crea.' },
  { n: 4, title: 'Presentación de precio', tag: 'Técnica sándwich', color: 'mint', tech: 'Sándwich — Beneficio → Precio → Beneficio → Pregunta',
    message: `Mira, con ASHIRA tu consultorio va a tener los historiales de TODOS tus pacientes organizados, seguros y accesibles desde cualquier dispositivo — nunca más un "¿dónde quedó esa historia?" 🏥

El plan para consultorios individuales está en [PRECIO/mes] — menos de lo que cuesta una cena para dos 😄

Y lo mejor: incluye gestión de citas, recordatorios automáticos, historial clínico completo y soporte incluido — todo en uno.

¿Eso encaja con lo que estás buscando para tu consultorio? 🙂`,
    note: 'Fórmula exacta: BENEFICIO emocional → precio con contexto → BENEFICIO racional → pregunta de cierre suave.' },
  { n: 5, title: 'Prueba social', tag: 'Credibilidad', color: 'amber', tech: 'Feel-Felt-Found + social proof específico',
    message: `¿Sabes qué? Entiendo perfectamente esa duda — antes de probar algo nuevo uno siempre piensa "¿y esto realmente funciona para mi realidad?"

Muchos de nuestros clientes sentían lo mismo al principio.

Uno de ellos, SafeCare (servicio de atención médica a domicilio en Venezuela), llevaba años manejando todo por correo y WhatsApp. Desde que usan ASHIRA, centralizaron el seguimiento de todos sus pacientes y dejaron de perder tiempo coordinando entre médicos.

¿Quieres que te cuente exactamente cómo lo lograron? 📈`,
    note: 'Feel-Felt-Found: "Entiendo (Feel) → otros sentían lo mismo (Felt) → y encontraron que... (Found)".' },
  { n: 6, title: 'Urgencia real', tag: 'Cierre suave', color: 'purple', tech: 'Urgencia anclada en beneficio, no en presión',
    message: `Quiero ser directo contigo, [nombre]: los 15 días de prueba gratuita son reales y sin trampa, pero el acceso al onboarding personalizado que estamos dando ahora sí es por cupos limitados.

Hoy tenemos espacio. La semana que viene no puedo prometerte lo mismo.

Si te registras hoy, te ayudo personalmente en los primeros pasos para que aproveches al máximo los 15 días:
👉 https://ashira.click/register

¿Te animas? 🙂`,
    note: 'La urgencia debe ser REAL. Usa escasez genuina: cupos de onboarding, tiempo del equipo.' },
  { n: 7, title: 'Cierre y activación', tag: 'Cierre asertivo', color: 'blue', tech: 'Cierre asuntivo + baja fricción',
    message: `¡Perfecto, [nombre]! Bienvenido/a a ASHIRA 🎉

El registro toma menos de 2 minutos:
👉 https://ashira.click/register

Cuando entres, empieza por [primer paso del onboarding]. Yo estoy aquí si tienes cualquier pregunta.

Y cuéntame — ¿cuál es el problema #1 que quieres resolver primero con ASHIRA? Así te oriento desde el día 1 😊`,
    note: 'La pregunta final convierte el cierre en el inicio del onboarding. Mantiene el engagement.' },
];

const OBJECTIONS = [
  { q: '"Está muy caro / no tengo presupuesto"', tech: 'Reencuadre de inversión + costo de inacción',
    a: `Entiendo perfectamente, [nombre] — el presupuesto siempre es una consideración real.

Déjame preguntarte algo: ¿cuánto tiempo pierde tu equipo por semana buscando historiales, confirmando citas o resolviendo confusiones? Si son 3 horas a la semana, al mes eso son 12 horas de tu consultorio trabajando ineficientemente.

ASHIRA vale menos que eso. Y en los 15 días gratis puedes comprobarlo sin gastar un centavo.

¿Le damos esa oportunidad? 😊` },
  { q: '"Ya uso Excel / WhatsApp / otro sistema"', tech: 'Validar + mostrar el gap invisible',
    a: `¡Tiene todo el sentido! Excel y WhatsApp funcionan — de hecho, así empezaron la mayoría de nuestros clientes.

La diferencia está en esto: cuando un paciente llama y necesitas su historial en 30 segundos, ¿cuánto tardas en encontrarlo?

ASHIRA no reemplaza la comodidad que ya tienes — la organiza y la hace 10x más rápida. Y en los 15 días gratis puedes migrar tus datos sin perder nada.

¿Te muestro cómo en 5 minutos? 🙂` },
  { q: '"No tengo tiempo para aprender algo nuevo"', tech: 'Inversión de objeción — tiempo perdido vs. ganado',
    a: `Eso es lo que más me dicen, y lo entiendo completamente — los médicos y el personal clínico ya tienen el tiempo al límite.

Por eso diseñamos ASHIRA para que en 10 minutos ya estés operando. Sin manuales, sin cursos. Si sabes usar WhatsApp, sabes usar ASHIRA.

Y hay algo más: el tiempo que "inviertes" aprendiendo ASHIRA, lo recuperas en la primera semana. Nuestros clientes reportan ahorrar entre 3 y 5 horas semanales desde el primer mes.

¿Probamos esos 10 minutos? 😊` },
  { q: '"¿Mis datos de pacientes están seguros?"', tech: 'Validar la preocupación + prueba técnica concreta',
    a: `Es la pregunta más importante que me puedes hacer — y me alegra que la hagas, porque significa que te tomas en serio la responsabilidad con tus pacientes.

ASHIRA tiene encriptación de datos, acceso por roles y backups automáticos. Tus historiales están más protegidos que en una carpeta física o un correo de Gmail.

Si quieres, te comparto más detalles técnicos o te presento a alguien de nuestro equipo que te explica el sistema de seguridad directamente.

¿Eso te da más tranquilidad? 🙂` },
  { q: '"Déjame pensarlo / te aviso"', tech: 'Descubrir la objeción real + abrir la puerta',
    a: `¡Claro que sí, [nombre]! Tómate el tiempo que necesitas.

Solo cuéntame — ¿hay algo específico que te genera duda o que necesites que te aclare? A veces hay una pregunta puntual detrás del "lo pienso" y prefiero respondértela directamente.

Si es así, aquí estoy. Y si decides probarlo en cualquier momento, el acceso gratuito sigue disponible:
👉 https://ashira.click/register 😊` },
  { q: '"¿Funciona para Venezuela? ¿Aceptan pagos locales?"', tech: 'Validar contexto local + eliminar fricción',
    a: `¡Sí, ASHIRA está diseñado específicamente para el mercado venezolano! Es una plataforma 100% local, creada entendiendo la realidad de los consultorios y clínicas privadas aquí.

Aceptamos [métodos de pago disponibles] y el soporte es en español, en horario venezolano.

De hecho, uno de nuestros clientes activos es SafeCare, que opera aquí en Venezuela — así que sabes que funciona en tu misma realidad.

¿Registramos tu acceso hoy para que lo compruebes? 🙂` },
];

const REACTIVATION = [
  { n: 1, title: 'Nunca respondió la bienvenida', when: '24h', tech: 'Reciprocidad + reapertura sin presión',
    message: `¡Hola [nombre]! 👋 Solo quería asegurarme de que mi mensaje anterior llegó bien.

Te cuento algo rápido: muchos médicos que nos escriben están en el mismo punto — les llama la atención pero no saben bien si ASHIRA aplica para su tipo de consultorio.

¿Puedo preguntarte una cosa? ¿Cómo llevas hoy el control de historiales y citas? 📋

Dependiendo de tu respuesta te digo en 2 minutos si ASHIRA es lo que necesitas o no — sin rodeos 😊`,
    note: 'No repitas el pitch. Abre con una pregunta simple que sea fácil de responder.' },
  { n: 2, title: 'Respondió quién era pero paró', when: '24–36h', tech: 'Anclaje en lo dicho + FAB personalizado',
    message: `¡Hola [nombre]! Me quedé pensando en lo que me contaste — que [resumen de lo que dijo, ej: "manejas las citas en papel"].

Justo para ese caso ASHIRA tiene algo específico que creo que te va a interesar:

[Feature relevante] → que significa que [ventaja concreta] → así que tu equipo [beneficio que le importa].

¿Te cuento cómo funcionaría en tu caso? 🙂`,
    note: 'Usa sus propias palabras de vuelta. El cliente siente que lo escuchaste — eso construye confianza instantánea.' },
  { n: 3, title: 'Reconoció el problema pero paró', when: '24h', tech: 'Costo de inacción + historia real',
    message: `¡Hola [nombre]! Quería retomarte porque me quedé con tu respuesta en mente.

Me comentaste que [dolor que mencionó]. Y sé que uno sigue adelante igual — se adapta, se resuelve. Pero hay un costo invisible que la mayoría no calcula.

Uno de nuestros clientes, SafeCare, llevaba años así. Cuando por fin centralizaron todo con ASHIRA, se dieron cuenta de que estaban perdiendo entre 4 y 6 horas semanales que ahora usan para atender más pacientes.

No te digo que es igual en tu caso — pero vale la pena comprobarlo 15 días gratis, ¿no? 😊
👉 https://ashira.click/register`,
    note: 'La historia concreta (SafeCare) hace más trabajo que cualquier argumento abstracto.' },
  { n: 4, title: 'Vio el precio y desapareció', when: '12–24h', tech: 'Feel-Felt-Found + reencuadre de inversión',
    message: `¡Hola [nombre]! Te escribo porque creo que el precio pudo haber generado una duda y no quiero que eso te deje sin probarlo.

Es completamente normal — muchos médicos sienten lo mismo cuando lo ven por primera vez.

Lo que encontraron cuando lo probaron es que ASHIRA no es un gasto mensual — es un ahorro mensual. El tiempo que recuperas en administración vale más que la suscripción desde la primera semana.

Y lo más importante: tienes 15 días para comprobarlo sin pagar nada. Si no te convence, cancelas sin preguntas.

¿Le damos esa oportunidad? 🙂
👉 https://ashira.click/register`,
    note: 'No bajes el precio. Reencuadra el valor. Bajar el precio devalúa el producto.' },
  { n: 5, title: 'Escuchó SafeCare pero paró', when: '36–48h', tech: 'Sí escalonado + nuevo ángulo de valor',
    message: `¡Hola [nombre]! 👋

Te cuento que desde que les conté sobre SafeCare a otros médicos, me empezaron a preguntar algo específico: ¿ASHIRA funciona para [especialidad del cliente]?

La respuesta corta: sí, y hay algo particular que funciona muy bien para [su tipo de consultorio].

¿Quieres que te cuente exactamente qué parte le saca más provecho alguien en tu posición? 😊`,
    note: 'Cambia el ángulo — no repitas SafeCare. Habla de su especialidad específica.' },
  { n: 6, title: 'Vio los cupos limitados pero no actuó', when: '24h máximo', tech: 'Amarre + último intento genuino',
    message: `¡Hola [nombre]! Te escribo porque ayer te mencioné que los cupos de onboarding personalizado son limitados, y hoy todavía tengo uno disponible para ti.

Si entras hoy, yo te ayudo personalmente en los primeros pasos — 20 minutos de configuración guiada para que en tu primer día ya tengas ASHIRA funcionando.

Si prefieres esperar, también está bien — el trial de 15 días sigue abierto, solo sin ese acompañamiento.

¿Te animas hoy? 😊
👉 https://ashira.click/register`,
    note: 'Este es el último mensaje antes de cerrar el lead. Hazlo valer.' },
  { n: 7, title: 'Dijo "ok" pero nunca se registró', when: '6–12h', tech: 'Reducción de fricción + micro-ayuda',
    message: `¡Hola [nombre]! Solo quería ver si tuviste algún problema al registrarte — a veces el formulario genera una duda puntual.

El proceso toma menos de 2 minutos:
1. Entras a https://ashira.click/register
2. Pones tu correo y creas tu contraseña
3. Listo — ya tienes acceso

Si algo no funcionó o tienes una pregunta antes de entrar, cuéntame aquí y lo resolvemos ahora mismo 🙂`,
    note: 'Muchas veces el "no se registró" es fricción técnica, no falta de interés.' },
];

const RULES = [
  { icon: '💡', text: 'Responde en menos de 5 minutos.', detail: 'El 85% de los prospectos elige al primer proveedor que responde. En Instagram, la velocidad es ventaja competitiva directa.' },
  { icon: '🎯', text: 'Un mensaje = una acción.', detail: 'Cada mensaje debe tener un solo CTA claro. Múltiples opciones generan parálisis. Decide por ellos: "¿Lo probamos hoy?"' },
  { icon: '🎧', text: 'Escucha más de lo que hablas.', detail: 'El 70% de la decisión ya está tomada antes de que intervengas. Tu rol es descubrir qué los frena, no convencerlos desde cero.' },
  { icon: '🚫', text: 'Nunca menciones el precio solo.', detail: 'Siempre envuelto: beneficio → precio → beneficio → pregunta. El precio desnudo siempre parece caro.' },
  { icon: '💬', text: 'Las objeciones son señales de interés.', detail: '"Está caro" significa "convénceme". "Lo pienso" significa "tengo una duda que no dije". Siempre pregunta qué hay detrás.' },
  { icon: '📖', text: 'Usa historias, no características.', detail: '"SafeCare ahora coordina a sus médicos en tiempo real" > "ASHIRA tiene módulo de coordinación de equipos". Las historias venden, los features no.' },
  { icon: '⏳', text: 'La urgencia debe ser real.', detail: '"Cupos de onboarding limitados" es verdad para ti. "Oferta expira hoy" sin que expire destruye la confianza y el médico no vuelve.' },
  { icon: '🔄', text: 'Máximo 2 follow-ups sin respuesta.', detail: 'El tercero sin respuesta cierra el lead. No persigas — reabre con valor y si no hay eco, pasa al siguiente.' },
  { icon: '🤝', text: 'Califica antes de vender.', detail: 'Pregunta quién es, qué usa hoy y qué tamaño tiene su operación. Un mensaje personalizado convierte 3x más que uno genérico.' },
  { icon: '🙂', text: 'Sé humano, no vendedor.', detail: 'Los médicos tienen radar muy afinado para detectar scripts. El tono conversacional genera más confianza que el copy perfecto.' },
];

const TRACKING_METRICS = [
  { val: "<5'", label: 'Tiempo de primera respuesta' },
  { val: '30%', label: 'Meta: info → registro' },
  { val: '2x', label: 'Máximo follow-ups' },
  { val: '+50', label: 'NPS de usuarios meta' },
  { val: '<5%', label: 'Churn mensual meta' },
  { val: '1.2', label: 'Referidos por usuario' },
];

const LEAD_LABELS = [
  { color: '#4A7DE8', dot: '🔵', label: 'Caliente', desc: 'Respondió, hizo preguntas, pidió más info o el precio. Prioridad máxima — cerrar en 24–48h.' },
  { color: '#f59e0b', dot: '🟠', label: 'Tibio', desc: 'Leyó y no respondió, o dijo "lo pienso". Follow-up en 24h con nuevo ángulo de valor.' },
  { color: '#7FFFD4', dot: '🟢', label: 'Trial activo', desc: 'Se registró. Check-in al día 3, al día 7 y al día 13 antes de que venza el trial.' },
  { color: '#ef4444', dot: '🔴', label: 'Cerrado', desc: '2 follow-ups sin respuesta o rechazo explícito. Archivar. Reactivar en 30 días.' },
];

const CHECKINS = [
  { day: 'Día 3', msg: '"¿Cómo vas con ASHIRA? ¿Ya probaste [feature específico]? Te cuento un truco que les encanta a los médicos que empiezan."' },
  { day: 'Día 7', msg: '"A mitad del trial, ¿qué ha sido lo más útil hasta ahora? ¿Hay algo que no hayas podido configurar?"' },
  { day: 'Día 13', msg: '"Tu prueba gratuita termina mañana. ¿Seguimos juntos? [Link de pago o plan]. Si tienes alguna duda del precio o el plan, aquí estoy."' },
];

// --- NUEVA DATA (SHORT & MIXED) ---

const SHORT_FLOW = [
  { 
    n: 1, title: "Bienvenida + Anclaje + FOMO", tag: "Urgencia inmediata", color: "blue", tech: "Price Anchoring + FOMO",
    message: "¡Hola [nombre]! 👋 Qué bueno que preguntas directamente — te voy a ser completamente honesto.\n\nASHIRA normalmente cuesta $49/mes. Pero ahora mismo estamos en precio de lanzamiento para los primeros médicos que entren a la plataforma: $20/mes.\n\n¿Por qué tan bajo? Porque estamos construyendo la comunidad de médicos venezolanos que van a liderar la digitalización del sector salud privado en el país. Y queremos que los pioneros entren con una ventaja real.\n\nEso sí — el precio de $20 no va a durar para siempre. Cuando cerremos esta fase de lanzamiento, sube.\n\n¿Tienes consultorio propio o trabajas en una clínica? Así te digo exactamente qué plan te conviene 🙂",
    note: "El anclaje $49→$20 activa el efecto psicológico de comparación inmediato."
  },
  { 
    n: 2, title: "Brecha + Pertenencia + Prueba Social", tag: "Comunidad + Valor", color: "mint", tech: "Gap Selling + Pertenencia",
    message: "Perfecto. Entonces te cuento exactamente lo que cambia para un [consultorio/clínica como el tuyo/la tuya]:\n\nHOY: historiales en papel o Excel, citas por WhatsApp, coordinación por correo.\nCON ASHIRA: todo centralizado, accesible en segundos, desde cualquier dispositivo.\n\nLa diferencia no es solo comodidad — es tiempo. Y el tiempo en medicina es dinero y calidad de atención.\n\nYa hay médicos en Venezuela usando ASHIRA — entre ellos SafeCare. Tú puedes ser parte de la primera generación de médicos venezolanos completamente digitalizados. 💙\n\n¿Empezamos con los 15 días gratis y $20/mes después? Sin tarjeta ahora.\n👉 https://ashira.click/register",
    note: "Posiciona al médico como un 'Líder Pionero' de la era digital."
  },
  { 
    n: 3, title: "Cierre Asuntivo + Amarre", tag: "Cierre con urgencia", color: "blue", tech: "Amarre + Urgencia real",
    message: "¡Perfecto, [nombre]! El registro toma menos de 2 minutos:\n👉 https://ashira.click/register\n\nCuando entres, empieza configurando tu primera agenda. Y como entras en esta fase de lanzamiento, el precio de $20/mes queda fijo para ti — aunque después suba para nuevos usuarios.\n\nAdemás, si entras hoy, te ayudo personalmente con los primeros pasos: 15 minutos de configuración guiada para que en tu primer día ya tengas ASHIRA corriendo.\n\n¿Lo hacemos ahora mismo? 🚀",
    note: "Precio congelado para early adopters + acompañamiento personal."
  },
  { 
    n: 4, title: "Seguimiento (12-24h)", tag: "Reactivación urgente", color: "amber", tech: "FOMO Real + Costo Cuantificado",
    message: "¡Hola [nombre]! 👋 Te escribo porque el precio de lanzamiento de $20 va a subir pronto y quiero avisarte antes de que cambie.\n\n📊 Si tu equipo pierde 3 horas/semana en tareas administrativas → son 12 horas/mes → más de 140 horas al año perdidas en caos que ASHIRA resuelve.\n\nA $20/mes, ASHIRA te cuesta menos de lo que vale una hora de tu tiempo profesional. Y recuperas ese costo en la primera semana.\n\nSi te interesa entrar con el precio actual, aquí está el link:\n👉 https://ashira.click/register\n\nY si no es el momento, no hay problema — pero quería que la decisión la tomara con toda la info. 😊",
    note: "El cálculo 3h/sem = 140h/año hace que el ROI sea tangible."
  }
];

const MIXED_FLOW = [
  {
    n: 1, title: "Detectar y Validar la Fricción", tag: "Diagnóstico", color: "blue", tech: "Pregunta Directa",
    message: "¡Hola [nombre]! Entiendo perfectamente — y aprecio que seas directo/a.\n\nDéjame preguntarte algo específico para ayudarte mejor: de todo lo que está en tu cabeza ahora mismo, ¿cuál de estas tres cosas es la que más te frena?\n\nA) El precio — no estoy seguro de que valga la inversión\nB) El tiempo — estoy muy ocupado para aprender algo nuevo ahora\nC) La duda — no sé si realmente funciona para mi tipo de consultorio\n\nNo hay respuesta incorrecta. Solo quiero entender bien tu situación para darte la información que realmente te sirve 🙂",
    note: "Hacer que el prospecto elija su objeción lo compromete con ella psicológicamente."
  },
  {
    n: 2, title: "Resolver Objeción (Opción A: Precio)", tag: "Precio", color: "amber", tech: "Challenger + Inacción",
    message: "\"El precio es una preocupación válida.\n\nPero te hago un Challenger: ¿Cuántas horas pierde tu equipo por semana en caos administrativo? Si son 3 horas, al mes son 12 horas — tiempo que vale mucho más que cualquier suscripción.\n\nASHIRA no es un gasto — es un ahorro mensual. El tiempo que recuperas vale 10x lo que pagas. Y tienes 15 días gratis para comprobarlo sin riesgo. ¿Eso cambia la ecuación? 🙂\"",
    note: "Usa el ROI tangible del tiempo recuperado."
  },
  {
     n: 3, title: "Anclaje + FOMO Comunidad", tag: "Pertenencia", color: "blue", tech: "Social Proof + FOMO",
     message: "Mira, y ya que estamos siendo directos: ASHIRA vale $49/mes, pero ahora está en $20/mes porque estamos construyendo la comunidad inicial de médicos que entienden que digitalizarse es el paso natural.\n\nCuando esta fase cierre, el precio sube. Más de [X] médicos ya están dentro de la comunidad ASHIRA. ¿Quieres ser parte de esto? 💙\n👉 https://ashira.click/register",
     note: "El sentimiento de 'Comunidad' elimina el miedo a estar solo."
  },
  {
     n: 4, title: "Cierre Alternativo", tag: "Cierre", color: "mint", tech: "Elección Guiada",
     message: "Entonces te presento las dos opciones reales:\n\n🔵 Opción A — Entras hoy al precio de lanzamiento de $20, 15 días gratis, y decides con resultados reales. Si no te gusta, cancelas sin preguntas.\n⚪ Opción B — Lo piensas más, el precio sube al cerrar el lanzamiento, y entras después al precio normal.\n\n¿Cuál tiene más sentido para ti ahora mismo? 🙂",
     note: "No preguntes 'si', pregunta 'cuál'."
  },
  {
     n: 5, title: "Seguimiento Final (24-48h)", tag: "Reactivación", color: "purple", tech: "Garantía Personal",
     message: "¡Hola [nombre]! Quería cerrar el loop: el precio de $20 sigue disponible por poco tiempo.\n\nTe propongo algo concreto: regístrate hoy, usa los 15 días gratis, y si en la primera semana no ves diferencia real en lo que mencionamos, me escribes y hablamos — personalmente.\n\nSin riesgo. Sin contratos. Solo 2 minutos.\n👉 https://ashira.click/register 💙",
     note: "La garantía de relación personal es vital en LATAM."
  }
];

// --- COMPONENTS ---

function Tag({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    mint: 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return (
    <span className={`tag border ${colors[color] || colors.blue}`}>{children}</span>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-200 font-medium"
      style={{ 
        background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(74, 125, 232, 0.05)', 
        color: copied ? '#059669' : '#4A7DE8', 
        border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(74, 125, 232, 0.1)'}` 
      }}>
      {copied ? '✓ Copiado' : '📋 Copiar'}
    </button>
  );
}

function Collapsible({ title, badge, badgeColor, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-elegant rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-gray-50/50">
        <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">{icon}</span>
        <div className="flex-1">
          <div className="font-bold text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--ash-text)' }}>{title}</div>
          {badge && <div className="mt-1.5"><Tag color={badgeColor}>{badge}</Tag></div>}
        </div>
        <span className="transition-transform duration-300" style={{ color: 'var(--ash-primary)', transform: open ? 'rotate(180deg)' : 'none' }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div className={`collapsible-content ${open ? 'open' : ''}`}>
        <div className="px-5 pb-5 border-t border-gray-50 pt-4 bg-white/50">{children}</div>
      </div>
    </div>
  );
}

function MsgBlock({ text, color = 'blue' }) {
  const borderColors = { blue: '#4A7DE8', mint: '#10B981', amber: '#F59E0B', purple: '#7C3AED' };
  const bgColors = { blue: '#F0F7FF', mint: '#F0FDF4', amber: '#FFFBEB', purple: '#F5F3FF' };
  
  return (
    <div className="relative rounded-xl p-5 mb-4 border"
      style={{ 
        background: bgColors[color] || bgColors.blue, 
        borderColor: `${borderColors[color] || borderColors.blue}20`,
        borderLeft: `4px solid ${borderColors[color] || borderColors.blue}` 
      }}>
      <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium" 
        style={{ fontFamily: 'var(--font-body)', color: 'var(--ash-text)' }}>{text}</pre>
      <div className="mt-3 flex justify-end gap-2 border-t border-black/5 pt-3"><CopyButton text={text} /></div>
    </div>
  );
}

// --- SECTIONS ---

function MarketingSection() {
  const [mActive, setMActive] = useState('panorama');
  const [copyStatus, setCopyStatus] = useState('');

  const mTabs = [
    { id: 'panorama', label: 'Panorama Competitivo', icon: '🔍' },
    { id: 'perfiles', label: 'Perfiles de Cliente', icon: '👤' },
    { id: 'contenido', label: 'Estrategia de Contenido', icon: '📱' },
    { id: 'pacientes', label: 'Estrategia de Pacientes', icon: '🤝' },
    { id: 'reels', label: 'Ideas de Reels', icon: '⚡' },
    { id: 'calendario', label: 'Calendario', icon: '📅' },
    { id: 'seo', label: 'Hashtags y SEO', icon: '🏷️' },
    { id: 'kpis', label: 'KPIs y Seguimiento', icon: '📈' },
  ];

  const handleCopyHash = (text) => {
    navigator.clipboard.writeText(text);
    setCopyStatus('¡Copiados!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const renderTab = () => {
    switch (mActive) {
      case 'panorama':
        return (
          <div className="space-y-6 fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-2xl mt-1">📡</span>
              <p className="text-sm text-blue-900 leading-relaxed font-medium">
                Datos extraídos de Sonda Labs. El mercado venezolano de software médico tiene 4 jugadores activos en Instagram. 
                ASHIRA tiene la audiencia más pequeña pero el único diferenciador que ningún competidor tiene: 
                <span className="font-black"> portal de pacientes + soporte a clínicas domiciliarias.</span>
              </p>
            </div>

            <div className="card-elegant overflow-hidden rounded-2xl bg-white border border-gray-100">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-black tracking-tight text-gray-500 uppercase text-[10px]">Cuenta</th>
                      <th className="px-6 py-4 font-black tracking-tight text-gray-500 uppercase text-[10px]">Seguidores</th>
                      <th className="px-6 py-4 font-black tracking-tight text-gray-500 uppercase text-[10px]">Estrategia actual</th>
                      <th className="px-6 py-4 font-black tracking-tight text-gray-500 uppercase text-[10px]">Debilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-6 py-4 font-bold text-blue-600">@docsiapp</td>
                      <td className="px-6 py-4 font-medium">12.8K</td>
                      <td className="px-6 py-4 text-xs">Innovación/edu tech</td>
                      <td className="px-6 py-4 text-xs font-medium text-red-500">Crecimiento cero, no habla de médicos</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-blue-600">@hipocrates.salud</td>
                      <td className="px-6 py-4 font-medium">4.9K</td>
                      <td className="px-6 py-4 text-xs">Pagos y reportes</td>
                      <td className="px-6 py-4 text-xs font-medium text-red-500">0 comentarios, muy corporativo</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-blue-600">@docguia.inc</td>
                      <td className="px-6 py-4 font-medium">4.5K</td>
                      <td className="px-6 py-4 text-xs">Etiquetado de médicos</td>
                      <td className="px-6 py-4 text-xs font-medium text-red-500">No tiene portal de pacientes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-emerald-600">@ashira_soft</td>
                      <td className="px-6 py-4 font-medium">242</td>
                      <td className="px-6 py-4 text-xs">En construcción</td>
                      <td className="px-6 py-4 text-xs font-medium italic text-gray-400">Bajo volumen de contenido</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">💡</span>
                <h3 className="text-sm font-black text-emerald-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>La oportunidad real</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                El competidor con más seguidores (12.8K) tiene crecimiento CERO. Nadie en el sector está publicando contenido 
                dirigido a <span className="font-bold underline decoration-emerald-200">recepcionistas y asistentes de citas</span> — el perfil más fácil de convertir. 
                Hay un nicho libre esperando a ASHIRA.
              </p>
            </div>

            <div className="card-elegant rounded-2xl overflow-hidden bg-white border-2 border-amber-100 group transition-all hover:border-amber-200">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Post Estrella de la competencia</span>
                </div>
                <Tag color="amber">Técnica: Etiquetado</Tag>
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-gray-800 mb-4 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  "Etiqueta a tu ginecólogo de confianza o envíale este post. Merece trabajar con herramientas del siglo 21 🫡"
                </p>
                <div className="flex gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-black text-gray-900">69L</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-gray-900">26C</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Comentarios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-gray-900">912</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Vistas</div>
                  </div>
                </div>
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1">Análisis Estratégico</p>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium italic">
                    "Funcionó porque habla al PACIENTE, no al médico, y le pide que actúe (etiquetar). 
                    Esta es la base de la Estrategia de Pacientes que ASHIRA puede dominar."
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'perfiles':
        return (
          <div className="p-1 space-y-4 fade-in">
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-medium">
                ASHIRA no solo vende a médicos. Hay 6 perfiles que pueden adoptar, recomendar o exigir ASHIRA. 
                Cada uno necesita un mensaje diferente.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Collapsible title="Recepcionista / Asistente" badge="PRIORIDAD MÁXIMA" badgeColor="green" icon="👩‍💻">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">Caos diario — confirmar citas por WhatsApp, buscar historiales físicos, manejar llamadas mientras registra pacientes.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-1">Mensaje Clave</p>
                    <p className="text-blue-900">"ASHIRA no te quita el trabajo — te quita el caos. Tus citas organizadas, los historiales en un clic."</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Canal Ideal</p>
                      <p className="text-xs">Reels / Stories (Día a día)</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">CTA Contenido</p>
                      <p className="text-xs">"Etiqueta a tu recepcionista"</p>
                    </div>
                  </div>
                </div>
              </Collapsible>
              <Collapsible title="Médico Independiente" badge="ALTA PRIORIDAD" badgeColor="blue" icon="🩺">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">Administra solo. Siente que pierde tiempo valioso en lo administrativo en lugar de con sus pacientes.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-1">Mensaje Clave</p>
                    <p className="text-blue-900">"Tu tiempo vale más que buscar papeles. ASHIRA hace lo administrativo por ti."</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Especialidades</p>
                      <p className="text-xs">Pediatras, Ginecólogos, Dentistas</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Precio Ancla</p>
                      <p className="text-xs">"Menos de una consulta"</p>
                    </div>
                  </div>
                </div>
              </Collapsible>
              <Collapsible title="Director de Clínica" badge="ALTA PRIORIDAD" badgeColor="blue" icon="🏥">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">Coordinar múltiples turnos y facturación. La desorganización le cuesta pacientes y credibilidad.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-1">Mensaje Clave</p>
                    <p className="text-blue-900">"Centraliza tu clínica completa. Médicos coordinados y citas sin cruces."</p>
                  </div>
                  <p className="text-xs text- emerald-700 bg-emerald-50 p-2 rounded-lg italic">🎯 Un director convierte toda la clínica. Una venta = Múltiples usuarios activos.</p>
                </div>
              </Collapsible>
              <Collapsible title="Enfermero/a" badge="PRIORIDAD MEDIA" badgeColor="amber" icon="💉">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">Dependencia del expediente físico. Interrumpe al médico constantemente por falta de información.</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <p className="text-[10px] uppercase tracking-widest text-amber-600 font-black mb-1">Mensaje Clave</p>
                    <p className="text-amber-900">"Toda la historia en tu teléfono, sin interrumpir al doctor ni buscar papeles."</p>
                  </div>
                </div>
              </Collapsible>
              <Collapsible title="Especialista en Clínica" badge="PRIORIDAD MEDIA" badgeColor="amber" icon="🧬">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">Comparte espacio pero necesita su propia agenda privada y que no se cruce con otros especialistas.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-1">Mensaje Clave</p>
                    <p className="text-blue-900">"Tu consultorio, tu agenda, tus pacientes — todo tuyo, aunque compartas el espacio."</p>
                  </div>
                </div>
              </Collapsible>
              <Collapsible title="Paciente (Canal Indirecto)" badge="ESTRATÉGICO" badgeColor="mint" icon="👥">
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-500 font-black mb-1">Dolor Principal</p>
                    <p className="text-gray-600 leading-relaxed italic">No tiene acceso a su historial. Depende de que el médico recuerde o de llevar una carpeta.</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
                    <p className="text-[10px] uppercase tracking-widest text-teal-600 font-black mb-1">Estrategia de Activación</p>
                    <p className="text-teal-900">"¿Tu médico ya usa ASHIRA? Pídele que lo implemente — es gratis para empezar."</p>
                  </div>
                  <p className="text-xs text-blue-800 italic">💡 Un paciente pidiendo una herramienta es la venta más fácil del mundo.</p>
                </div>
              </Collapsible>
            </div>
          </div>
        );
      case 'contenido':
        return (
          <div className="space-y-6 fade-in">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2 font-black text-gray-900 uppercase text-xs tracking-widest">
                <span className="w-2 h-4 bg-blue-500 rounded-sm" /> Los 4 Pilares de Contenido
              </div>
              <p className="text-xs text-gray-500 font-medium">Construir autoridad y confianza ANTES de que el lead llegue al DM.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-elegant p-5 rounded-2xl bg-white border-l-4 border-red-400">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black text-red-600 tracking-widest uppercase">Pilar #1: DOLOR</span>
                  <Tag color="blue">30%</Tag>
                </div>
                <p className="text-sm font-bold mb-2">Objetivo: "ESO ME PASA A MÍ"</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Reels y carruseles sobre situaciones caóticas reales en consultorios.</p>
                <p className="text-[10px] font-black italic text-gray-400">Regla: No mencionar ASHIRA directamente.</p>
              </div>
              <div className="card-elegant p-5 rounded-2xl bg-white border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black text-blue-600 tracking-widest uppercase">Pilar #2: EDUCACIÓN</span>
                  <Tag color="blue">25%</Tag>
                </div>
                <p className="text-sm font-bold mb-2">Objetivo: POSICIONAR AUTORIDAD</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Carruseles "3 errores que..." y tips sobre gestión médica profesional.</p>
                <p className="text-[10px] font-black italic text-gray-400">Regla: ASHIRA es el facilitador del valor.</p>
              </div>
              <div className="card-elegant p-5 rounded-2xl bg-white border-l-4 border-emerald-400">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">Pilar #3: PRUEBA SOCIAL</span>
                  <Tag color="blue">25%</Tag>
                </div>
                <p className="text-sm font-bold mb-2">Objetivo: GENERAR CONFIANZA</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Testimonios, casos de uso (SafeCare) y dashboards antes vs después.</p>
                <p className="text-[10px] font-black italic text-gray-400">Regla: Datos específicos &gt; Argumentos abstractos.</p>
              </div>
              <div className="card-elegant p-5 rounded-2xl bg-white border-l-4 border-teal-400">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black text-teal-600 tracking-widest uppercase">Pilar #4: COMUNIDAD</span>
                  <Tag color="blue">20%</Tag>
                </div>
                <p className="text-sm font-bold mb-2">Objetivo: CREAR PERTENENCIA</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Posts de etiquetado y encuestas interactivas en historias.</p>
                <p className="text-[10px] font-black italic text-gray-400">Regla: Hablar en plural (ej. "Médicos del Siglo 21").</p>
              </div>
            </div>

            <div className="card-elegant rounded-2xl bg-white overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase">Frecuencia Semanal Recomendada</h3>
                 <span className="animate-pulse w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { d: 'LUN', f: 'Carrusel', p: 'Educación' },
                    { d: 'MAR', f: 'Stories', p: 'Interacción' },
                    { d: 'MIE', f: 'Reel', p: 'Dolor' },
                    { d: 'JUE', f: 'Post', p: 'Prueba Social' },
                    { d: 'VIE', f: 'Post', p: 'Comunidad' },
                    { d: 'SAB', f: 'Reel/Meme', p: 'Humanizar' },
                    { d: 'DMG', f: '-', p: 'Analizar métricas' },
                    { d: 'TODO', f: 'Stories', p: 'Mínimo 1 diaria' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100/50 transition-all hover:bg-white hover:shadow-sm">
                      <div className="text-[10px] font-black text-gray-400 mb-1">{item.d}</div>
                      <div className="text-xs font-bold text-blue-600">{item.f}</div>
                      <div className="text-[10px] font-medium text-gray-500 mt-1">{item.p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'pacientes':
        return (
          <div className="space-y-6 fade-in">
             <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
               <h3 className="text-lg font-black tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>Estrategia de Pacientes: El Canal Maestro</h3>
               <p className="text-sm opacity-90 leading-relaxed font-medium">Un paciente que pide ASHIRA a su médico convierte 10x más que cualquier anuncio pagado. Es la distribución estratégica que ningún competidor ha activado.</p>
             </div>

             <div className="p-6 bg-white rounded-2xl border border-gray-100 card-elegant">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">El Mecanismo de Activación</p>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {[
                    { n: 1, t: 'Descubrimiento', d: 'El paciente ve el portal en IG o vía médicos.' },
                    { n: 2, t: 'Valor Percibido', d: 'Entiende que tendrá su historial clínico móvil.' },
                    { n: 3, t: 'Solicitud', d: 'Pregunta al médico: "¿Por qué no usas ASHIRA?"' },
                    { n: 4, t: 'Conversión', d: 'El médico se registra motivado por su propio cliente.' }
                  ].map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="flex-1 flex flex-col items-center text-center max-w-[140px]">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm mb-3 border-2 border-emerald-200">
                          {step.n}
                        </div>
                        <p className="text-xs font-bold text-gray-900 mb-1">{step.t}</p>
                        <p className="text-[10px] text-gray-500 leading-tight font-medium">{step.d}</p>
                      </div>
                      {i < 3 && <div className="hidden md:block text-emerald-200 text-2xl">→</div>}
                    </React.Fragment>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl card-elegant border border-gray-100 border-t-4 border-emerald-500">
                   <p className="text-xs font-black text-emerald-600 uppercase mb-3 tracking-widest">FORMA 1</p>
                   <p className="text-sm font-bold mb-2">Contenido Directo</p>
                   <p className="text-xs text-gray-500 leading-relaxed mb-4">"No más llevar carpetas. Tu historial viaja contigo."</p>
                   <Tag color="emerald">CTA: Etiqueta tu médico</Tag>
                </div>
                <div className="bg-white p-5 rounded-2xl card-elegant border border-gray-100 border-t-4 border-blue-500">
                   <p className="text-xs font-black text-blue-600 uppercase mb-3 tracking-widest">FORMA 2</p>
                   <p className="text-sm font-bold mb-2">Anzuelo en Portal</p>
                   <p className="text-xs text-gray-500 leading-relaxed mb-4">Cuando el paciente se registra, "exige" a su médico en el sistema.</p>
                   <Tag color="blue">Notificación Directa</Tag>
                </div>
                <div className="bg-white p-5 rounded-2xl card-elegant border border-gray-100 border-t-4 border-purple-500">
                   <p className="text-xs font-black text-purple-600 uppercase mb-3 tracking-widest">FORMA 3</p>
                   <p className="text-sm font-bold mb-2">Referido Cruzado</p>
                   <p className="text-xs text-gray-500 leading-relaxed mb-4">QR en sala de espera e invitaciones automáticas vía WhatsApp.</p>
                   <Tag color="purple">Efecto Viral</Tag>
                </div>
             </div>
          </div>
        );
      case 'reels':
        return (
          <div className="space-y-4 fade-in">
             <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium">ASHIRA puede grabar Reels con teléfono. Estas son las ideas con mayor potencial de alcance orgánico.</p>
             </div>
             
             {[
               { n: 1, cat: 'DOLOR', t: 'Día de una recepcionista sin ASHIRA', concepts: 'Caos visual, teléfono sonando, papeles volando.', audio: 'Stress / Chaos sound', caption: 'Así empieza el día de miles de recepcionistas en Venezuela. ¿Reconoces esto? 👇\n\n#SoftwareMedico #GestionHospitalaria #ASHIRA', cta: 'Etiqueta a tu recepcionista' },
               { n: 2, cat: 'DOLOR', t: '¿Cuántos WhatsApps por una cita?', concepts: 'Pantalla de chat infinito vs 1 clic en ASHIRA.', audio: 'Notification sounds loop', caption: 'Esto no debería tomar 15 mensajes. ASHIRA resuelve el agendamiento en segundos.\n\n#AgendaDigital #MedicinaDigital', cta: 'Prueba 15 días gratis' },
               { n: 3, cat: 'TRANSFORMACIÓN', t: 'Recepcionista CON ASHIRA', concepts: 'Mismo consultorio, paz mental, todo digital.', audio: 'Peaceful / Chill lo-fi', caption: 'La misma recepción. Pero con el control total. 💙\n\n#ProductividadMedica #SaludDigital', cta: 'Link en Bio' },
               { n: 4, cat: 'TRANSFORMACIÓN', t: 'Antes vs Después: La Agenda', concepts: 'Split screen Excel vs ASHIRA.', audio: 'Transition trend', caption: '$20/mes. Ese es el costo de cambiar el caos por el control.\n\n#ConsultorioDigital #VenezuelaMedica', cta: 'Únete a la fase de lanzamiento' },
               { n: 5, cat: 'EDUCACIÓN', t: '3 errores que te cuestan pacientes', concepts: 'Lista rápida: Doble cita, pérdida de historia, demora.', audio: 'Voice over / List style', caption: 'El 80% de las clínicas pierden ingresos por estos 3 errores. ¿Cometes alguno?\n\n#GestionClinica #MedicosVenezuela', cta: '¿Cuál es el que más te pasa?' },
               { n: 6, cat: 'COMUNIDAD', t: 'Etiqueta al médico del siglo 21', concepts: 'Uso de ASHIRA en iPad/Phone con estética premium.', audio: 'Modern tech / Cinematic', caption: 'Los médicos venezolanos merecen herramientas a la altura de su talento. 🇻🇪\n\n#SaludVenezuela #InnovacionMedica', cta: 'Etiquétalo abajo' },
             ].map((reel, i) => (
                <Collapsible key={i} title={`${reel.n}. ${reel.t}`} icon="⚡" badge={reel.cat} badgeColor={reel.cat === 'DOLOR' ? 'blue' : (reel.cat === 'TRANSFORMACIÓN' ? 'green' : 'purple')}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Concepto</p>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">{reel.concepts}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Audio Sugerido</p>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">🎵 {reel.audio}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Copy Sugerido</p>
                        <p className="text-xs text-blue-900 leading-relaxed font-medium italic whitespace-pre-wrap">{reel.caption}</p>
                        <div className="mt-3 flex justify-end">
                          <CopyButton text={reel.caption} />
                        </div>
                    </div>
                    <p className="text-xs font-black text-emerald-600 uppercase">CTA: {reel.cta}</p>
                  </div>
                </Collapsible>
             ))}
          </div>
        );
      case 'calendario':
        return (
          <div className="fade-in space-y-6">
            <div className="card-elegant bg-white rounded-2xl p-6 overflow-hidden border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 tracking-tight mb-4 uppercase text-xs">Plan de Ejecución Mensual</h3>
              
              <div className="hidden lg:block">
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50 rounded-t-xl overflow-hidden">
                  {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map(d => (
                    <div key={d} className="px-3 py-3 text-[10px] font-black text-gray-400 text-center tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 border-l border-t border-gray-100">
                  {/* Simplificado para ejemplo visual de 4 semanas */}
                  {[
                    { t: 'Lanzamiento Presencia', s: Array(7).fill({ f: 'R', p: 'D' }) },
                    { t: 'Activación Asistentes', s: Array(7).fill({ f: 'P', p: 'E' }) },
                    { t: 'Estrategia Pacientes', s: Array(7).fill({ f: 'S', p: 'PS' }) },
                    { t: 'Urgencia Final', s: Array(7).fill({ f: 'R', p: 'C' }) }
                  ].map((week, wi) => (
                    <React.Fragment key={wi}>
                      {Array(7).fill(0).map((_, di) => (
                        <div key={di} className="border-r border-b border-gray-100 p-2 h-24 bg-white hover:bg-gray-50 transition-colors group">
                           <div className="text-[9px] font-black text-gray-300 mb-1">DÍA {di+1 + (wi*7)}</div>
                           <div className="text-[10px] font-bold text-blue-600 leading-tight">
                              {di % 2 === 0 ? 'Reel: ' : 'Post: '}
                           </div>
                           <div className="text-[9px] text-gray-500 font-medium mt-1 leading-tight group-hover:text-gray-900 line-clamp-2">
                             {['Dolor', 'Edu', 'Social', 'Comunidad', 'Venta'][di % 5]}...
                           </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="lg:hidden space-y-4">
                 {[1,2,3,4].map(w => (
                   <Collapsible key={w} title={`Semana ${w}`} icon="🗓️" badge={`Fase: ${['Lanzamiento', 'Activación', 'Pacientes', 'Conversión'][w-1]}`} badgeColor="blue">
                      <div className="space-y-3">
                         {['Lunes', 'Miércoles', 'Viernes'].map(d => (
                           <div key={d} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <span className="w-12 text-[10px] font-black text-gray-400">{d.toUpperCase()}</span>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-blue-600">{d === 'Miércoles' ? '⚡ Reel' : '📱 Post'}</p>
                                <p className="text-[10px] text-gray-500 font-medium">Contenido táctico semanal</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </Collapsible>
                 ))}
              </div>
            </div>
          </div>
        );
      case 'seo':
        const h1 = "#MédicosVenezuela #SaludDigital #MedicinaVenezuela #Medicos #GestionMedica #SoftwareMedico #SaludEnCasa #Telemedicina #InnovacionMedica #MedicinaModerna";
        const h2 = "#GestionClinica #AgendaDigital #HistoriaClinica #PortalDePaciente #SoftwareSalud #ProductividadMedica #CentrosMedicos #EscalabilidadMedica #AgendasMedicas #GestionConsultorio";
        const h3 = "#ConsultorioVenezuela #ClinicaPrivada #MedicoVenezolano #SaludPrivadaVenezuela #TecnologiaMedica #DigitalizacionMedica #ConsultorioDigital #ASHIRASalud";

        return (
          <div className="space-y-6 fade-in">
             <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-gray-500 font-medium">Mezcla siempre hashtags grandes, medianos y específicos para maximizar el alcance sin perder relevancia.</p>
             </div>
             
             <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 card-elegant">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Grupo 1: Sector & Especialidad</span>
                    <button onClick={() => handleCopyHash(h1)} className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors">Copiar Grupo</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {h1.split(' ').map((h, i) => <span key={i} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-800 rounded-lg font-bold border border-blue-100/50">{h}</span>)}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 card-elegant">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Grupo 2: Producto & Función</span>
                    <button onClick={() => handleCopyHash(h2)} className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors">Copiar Grupo</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {h2.split(' ').map((h, i) => <span key={i} className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-100/50">{h}</span>)}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 card-elegant">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Grupo 3: Comunidad & Local</span>
                    <button onClick={() => handleCopyHash(h3)} className="text-[10px] font-bold text-gray-400 hover:text-teal-600 transition-colors">Copiar Grupo</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {h3.split(' ').map((h, i) => <span key={i} className="text-[10px] px-2 py-1 bg-teal-50 text-teal-800 rounded-lg font-bold border border-teal-100/50">{h}</span>)}
                  </div>
                </div>

                <button onClick={() => handleCopyHash(`${h1} ${h2} ${h3}`)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-black transition-all shadow-lg active:scale-95">
                  🚀 {copyStatus || 'Copiar Set Completo'}
                </button>
             </div>
          </div>
        );
      case 'kpis':
        return (
          <div className="space-y-8 fade-in">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { l: 'Seguidores Nuevos', v: '+50/sem', c: 'blue' },
                  { l: 'Alcance Reel', v: '500+ vistas', c: 'blue' },
                  { l: 'DMs Recibidos', v: '5+/sem', c: 'emerald' },
                  { l: 'Leads Calificados', v: '20+/mes', c: 'emerald' },
                  { l: 'Ratio DM→Trial', v: '25%', c: 'purple' },
                  { l: 'Registros Trial', v: '10+/mes', c: 'teal' }
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl card-elegant border border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.l}</p>
                    <p className={`text-xl font-black text-${kpi.c}-600 tracking-tighter`} style={{ fontFamily: 'var(--font-display)' }}>{kpi.v}</p>
                  </div>
                ))}
             </div>

             <div className="flex flex-col items-center py-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Embudo de Conversión Ideal</p>
                <div className="relative w-full max-w-sm space-y-1">
                   {[
                    { t: 'Impresiones', r: '100%', w: 'w-full', c: 'bg-blue-600' },
                    { t: 'Seguidores', r: '2%', w: 'w-[90%]', c: 'bg-blue-500' },
                    { t: 'DMs', r: '10%', w: 'w-[80%]', c: 'bg-blue-400' },
                    { t: 'Leads', r: '20%', w: 'w-[70%]', c: 'bg-emerald-500' },
                    { t: 'Trial', r: '33%', w: 'w-[60%]', c: 'bg-emerald-400' },
                    { t: 'Pago', r: '50%', w: 'w-[50%]', c: 'bg-teal-400' }
                   ].map((f, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className={`h-10 ${f.w} ${f.c} mx-auto flex items-center justify-center text-white font-black text-[9px] uppercase tracking-widest shadow-sm border border-white/10`} style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}>
                          {f.t}
                        </div>
                        <div className="w-10 text-[10px] font-black text-emerald-600">{i > 0 && f.r}</div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 card-elegant">
                   <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Checklist Semanal</h3>
                   <div className="space-y-3">
                      {['Reels publicados (meta: 2)', 'DMs nuevos recibidos', 'Leads que pidieron precio', 'Clics en link de registro', 'Registros de trial', 'DMs de seguimiento'].map((t, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-4 h-4 border-2 border-gray-200 rounded flex-shrink-0" />
                           <span className="text-xs text-gray-600 font-medium">{t}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Señales de Alerta ⚠️</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-red-800 uppercase">Engagement &lt; 3%</p>
                      <p className="text-xs text-red-600">Cambiar tipo de contenido/audio.</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-800 uppercase">0 DMs en la semana</p>
                      <p className="text-xs text-red-600">El contenido no tiene CTA claro.</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-red-800 uppercase">DMs sin conversión</p>
                       <p className="text-xs text-red-600">Problemas en el follow-up (Revisar Playbook).</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {mTabs.map(tab => (
          <button key={tab.id} onClick={() => setMActive(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${mActive === tab.id ? 'bg-[#4A7DE8] text-white border-[#4A7DE8] shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}>
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}

function AIAnalyzer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeResponse, setActiveResponse] = useState(0);

  const examples = [
    'Hola, vi su anuncio y me gustaría saber más sobre ASHIRA',
    'Cuánto cuesta? Tengo un consultorio con 2 médicos',
    'Ya uso Excel para todo, no sé si necesito algo más',
  ];

  const analyze = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (data.usage) trackUsage(data.usage);
    } catch (e) {
      setError(e.message || 'Error al analizar');
    } finally {
      setLoading(false);
    }
  };

  const sentimentConfig = {
    positivo: { label: 'Positivo', color: '#10B981', bg: '#F0FDF4' },
    neutro: { label: 'Neutro', color: '#4A7DE8', bg: '#F0F7FF' },
    negativo: { label: 'Negativo', color: '#EF4444', bg: '#FEF2F2' },
    con_objecion: { label: 'Con objeción', color: '#F59E0B', bg: '#FFFBEB' },
  };

  return (
    <div className="space-y-6">
      <div className="card-elegant rounded-2xl p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-6 bg-blue-600 rounded-full" />
          <span className="section-title text-gray-900">Analizador Inteligente</span>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          rows={5} placeholder="Pega aquí el mensaje del cliente..."
          className="w-full rounded-xl p-4 text-sm transition-all focus:ring-2 focus:ring-blue-100 outline-none"
          style={{ background: '#F9FAFB', border: '1px solid var(--ash-border)', color: 'var(--ash-text)', fontFamily: 'var(--font-body)' }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <div className="flex gap-2">
            {examples.map((ex, i) => (
              <button key={i} onClick={() => setInput(ex)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
                Ejemplo {i + 1}
              </button>
            ))}
          </div>
          <button onClick={analyze} disabled={loading || !input.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-[#4A7DE8] text-white shadow-lg transition-opacity disabled:opacity-50">
            {loading ? 'Analizando...' : '📊 Sugerir respuesta'}
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm italic">⚠️ {error}</div>}

      {result && (
        <div className="fade-in space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ETAPA</div>
              <div className="text-sm font-bold text-blue-600 tracking-tight">{result.stage}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CONFIANZA</div>
              <div className="text-sm font-bold text-gray-800">{result.stage_confidence}%</div>
            </div>
            <div className="rounded-2xl p-4 shadow-sm border" style={{ background: sentimentConfig[result.sentiment]?.bg, borderColor: `${sentimentConfig[result.sentiment]?.color}20` }}>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SENTIMIENTO</div>
              <div className="text-sm font-bold" style={{ color: sentimentConfig[result.sentiment]?.color }}>
                {sentimentConfig[result.sentiment]?.label || result.sentiment}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">URGENCIA</div>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= result.urgency_level ? 'bg-blue-500' : 'bg-gray-100'}`} />)}
              </div>
            </div>
          </div>

          <div className="card-elegant rounded-2xl overflow-hidden bg-white">
            <div className="flex border-b border-gray-100">
              {result.responses?.map((r, i) => (
                <button key={i} onClick={() => setActiveResponse(i)}
                  className={`px-6 py-4 text-xs font-bold transition-all border-b-2 ${activeResponse === i ? 'bg-blue-50 text-blue-600 border-blue-600' : 'text-gray-400 border-transparent'}`}>
                  OPCIÓN #{i + 1}
                </button>
              ))}
            </div>
            <div className="p-6">
              <Tag color="mint">{result.responses[activeResponse].technique_tag}</Tag>
              <h3 className="text-lg font-bold mt-2 mb-4 text-gray-900">{result.responses[activeResponse].technique}</h3>
              <p className="text-sm leading-relaxed text-blue-800 italic mb-6 bg-blue-50/50 p-4 rounded-xl">
                {result.responses[activeResponse].reasoning}
              </p>
              <MsgBlock text={result.responses[activeResponse].message} color="blue" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TechniquesSection() {
  return (
    <div className="space-y-4">
      {TECHNIQUES.map(t => (
        <Collapsible key={t.id} icon={t.icon} title={t.name} badge={t.badge} badgeColor={t.badgeColor}>
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.sub}</p>
            <div className="flex gap-2 flex-wrap">
              <Tag color="blue">{t.origin}</Tag>
              <Tag color="green">{t.use}</Tag>
              <Tag color="purple">{t.type}</Tag>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{t.desc}</p>
            <div className="rounded-xl p-4 text-xs bg-gray-50 border border-gray-100 text-gray-700 font-medium whitespace-pre-wrap">
              <span className="text-blue-600 font-bold block mb-1">Estructura Sugerida: </span>{t.formula}
            </div>
            {t.messages ? t.messages.map((m, i) => <MsgBlock key={i} text={m.text} color={m.color} />) : <MsgBlock text={t.message} />}
            {t.note && <p className="text-xs font-medium text-blue-800 bg-blue-50/30 p-3 rounded-lg border border-blue-100/30 italic">💡 {t.note}</p>}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function FlowSection() {
  return (
    <div className="space-y-4">
      {FLOW_STEPS.map(s => (
        <Collapsible key={s.n} icon={`${s.n}`} title={`Paso ${s.n}: ${s.title}`} badge={s.tag} badgeColor={s.color}>
          <Tag color="purple">{s.tech}</Tag>
          <MsgBlock text={s.message} color={s.color} />
          {s.note && <p className="text-xs font-medium text-blue-800 bg-blue-50/30 p-3 rounded-lg border border-blue-100/30 italic">💡 {s.note}</p>}
        </Collapsible>
      ))}
    </div>
  );
}

function ObjectionsSection() {
  return (
    <div className="space-y-4">
      {OBJECTIONS.map((o, i) => (
        <Collapsible key={i} icon="💬" title={o.q} badge={o.tech} badgeColor="amber">
          <MsgBlock text={o.a} color="amber" />
        </Collapsible>
      ))}
    </div>
  );
}

function ReactivationSection() {
  return (
    <div className="space-y-4">
      {REACTIVATION.map(r => (
        <Collapsible key={r.n} icon={`${r.n}`} title={`Paso ${r.n}: ${r.title}`} badge={`Espera: ${r.when}`} badgeColor="amber">
          <Tag color="purple">{r.tech}</Tag>
          <MsgBlock text={r.message} color="mint" />
          {r.note && <p className="text-xs font-medium text-blue-800 bg-blue-50/30 p-3 rounded-lg border border-blue-100/30 italic">💡 {r.note}</p>}
        </Collapsible>
      ))}
    </div>
  );
}

function RulesSection() {
  return (
    <div className="space-y-3">
      {RULES.map((r, i) => (
        <div key={i} className="card-elegant flex gap-4 p-5 rounded-2xl bg-white transition-all hover:translate-y-[-2px]">
          <span className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 flex-shrink-0">{r.icon}</span>
          <div>
            <p className="text-sm font-bold mb-1 text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{r.text}</p>
            <p className="text-xs leading-relaxed text-gray-500 font-medium">{r.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackingSection() {
  return (
    <div className="space-y-8">
      <div>
        <p className="section-title mb-4">Métricas de Rendimiento</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRACKING_METRICS.map((m, i) => (
            <div key={i} className="card-elegant rounded-2xl p-5 text-center bg-white">
              <div className="text-2xl font-black mb-1 text-blue-600" style={{ fontFamily: 'var(--font-display)' }}>{m.val}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title mb-4">Etiquetado de Leads</p>
        <div className="space-y-3">
          {LEAD_LABELS.map((l, i) => (
            <div key={i} className="card-elegant flex gap-4 p-4 rounded-2xl bg-white">
              <span className="text-lg w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 flex-shrink-0">{l.dot}</span>
              <div>
                <span className="text-sm font-bold" style={{ color: l.color }}>{l.label}</span>
                <p className="text-xs font-medium text-gray-500">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title mb-4">Secuencia de Seguimiento (Trial)</p>
        <div className="space-y-3">
          {CHECKINS.map((c, i) => (
            <div key={i} className="card-elegant flex gap-4 p-5 rounded-2xl bg-white border-l-4 border-blue-500">
              <span className="text-[11px] font-black px-2 py-1 rounded bg-blue-100 text-blue-700 h-fit" style={{ fontFamily: 'var(--font-display)' }}>{c.day}</span>
              <p className="text-sm leading-relaxed text-gray-600 font-medium italic">{c.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShortFlowSection() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6 font-medium text-xs text-blue-800 italic">
        🎯 Esta flujo está optimizado para leads calientes que buscan resultados hoy.
      </div>
      {SHORT_FLOW.map(s => (
        <Collapsible key={s.n} icon={`${s.n}`} title={`Paso ${s.n}: ${s.title}`} badge={s.tag} badgeColor={s.color}>
          <Tag color="purple">{s.tech}</Tag>
          <MsgBlock text={s.message} color={s.color} />
          {s.note && <p className="text-xs font-medium text-blue-800 bg-blue-50/30 p-3 rounded-lg border border-blue-100/30 italic">💡 {s.note}</p>}
        </Collapsible>
      ))}
    </div>
  );
}

function MixedFlowSection() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-6 font-medium text-xs text-amber-800 italic">
        🔄 Flujo mixto para leads interesados pero con fricción o dudas específicas.
      </div>
      {MIXED_FLOW.map(s => (
        <Collapsible key={s.n} icon={`${s.n}`} title={`Paso ${s.n}: ${s.title}`} badge={s.tag} badgeColor={s.color}>
          <Tag color="purple">{s.tech}</Tag>
          <MsgBlock text={s.message} color={s.color} />
          {s.note && <p className="text-xs font-medium text-blue-800 bg-blue-50/30 p-3 rounded-lg border border-blue-100/30 italic">💡 {s.note}</p>}
        </Collapsible>
      ))}
    </div>
  );
}

// --- MAIN APP ---

const NAV = [
  { id: 'ia', label: 'IA Analyzer', icon: '📊' },
  { id: 'marketing', label: 'Estrategias Marketing', icon: '🎯' },
  { id: 'flujo', label: 'Flujo completo', icon: '→' },
  { id: 'corto', label: 'Flujo corto', icon: '⚡' },
  { id: 'mixto', label: 'Flujo mixto', icon: '⇄' },
  { id: 'tecnicas', label: 'Técnicas', icon: '◎' },
  { id: 'objeciones', label: 'Objeciones', icon: '💬' },
  { id: 'reactivacion', label: 'Reactivación', icon: '↺' },
  { id: 'reglas', label: 'Reglas de oro', icon: '⭐' },
  { id: 'seguimiento', label: 'Seguimiento', icon: '◈' },
];

export default function App() {
  const [active, setActive] = useState('ia');
  const [menuOpen, setMenuOpen] = useState(false);

  const SECTION_COMPONENTS = {
    ia: <AIAnalyzer />,
    marketing: <MarketingSection />,
    flujo: <FlowSection />,
    corto: <ShortFlowSection />,
    mixto: <MixedFlowSection />,
    tecnicas: <TechniquesSection />,
    objeciones: <ObjectionsSection />,
    reactivacion: <ReactivationSection />,
    reglas: <RulesSection />,
    seguimiento: <TrackingSection />,
  };

  const currentNav = NAV.find(n => n.id === active);

  return (
    <div className="grid-bg min-h-screen flex bg-[#F9FAFB] font-sans">
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 pb-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg bg-[#4A7DE8]">A</div>
            <div>
              <div className="font-black text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>ASHIRA</div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Intelligence</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${active === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 bg-white">
          <CostTracker />
          <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">IA Engine Active</span>
          </div>
        </div>
      </aside>

      {menuOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setMenuOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-5 bg-white/70 border-b border-gray-100 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl bg-gray-50 text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentNav?.icon}</span>
                <h1 className="text-lg font-black tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{currentNav?.label}</h1>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ASHIRA Sales Playbook</p>
            </div>
          </div>
          <a href="https://ashira.click/register" target="_blank" rel="noopener noreferrer"
             className="hidden sm:inline-block px-5 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all">
            Acceso Directo ↗
          </a>
        </header>

        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          <div key={active} className="fade-in">
            {SECTION_COMPONENTS[active]}
          </div>
        </div>
      </main>
    </div>
  );
}
