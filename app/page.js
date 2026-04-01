'use client';
import { useState, useRef, useEffect } from 'react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

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
    id: 'yescalado', icon: '📶', name: 'Sí Escalonado',
    sub: 'Micro-compromisos que llevan al gran sí',
    badge: 'Leads tibios', badgeColor: 'green',
    origin: 'Robert Cialdini, Influence 1984', use: 'Leads fríos o tibios', type: 'Psicología de compromiso',
    desc: 'Cada pequeño "sí" crea coherencia interna. No empieces pidiendo el registro; empieza pidiendo algo pequeño.',
    formula: 'Pregunta fácil → pregunta de dolor → pregunta de visión → CTA de bajo riesgo (trial) → CTA de compra',
    messages: [
      { color: 'blue', text: '¿Tienes consultorio propio o trabajas en una clínica? 🙂' },
      { color: 'mint', text: '[Responde] ¿Y cómo llevas hoy el control de las citas — digital, en papel, o mezcla de los dos?' },
      { color: 'amber', text: '[Responde] ¿Te ha pasado alguna vez perder o retrasar algo importante por no encontrar un historial a tiempo?' },
      { color: 'blue', text: '[Responde] Perfecto — entonces ASHIRA es exactamente para ti. ¿Empezamos con los 15 días gratis?\n👉 https://ashira.click/register' },
    ],
    note: 'Cuatro síes pequeños hacen el quinto (el registro) mucho más fácil.',
  },
  {
    id: 'challenger', icon: '⚡', name: 'Challenger',
    sub: 'Enseñar → Adaptar → Tomar control',
    badge: 'Directores', badgeColor: 'purple',
    origin: 'CEB, The Challenger Sale 2011', use: 'Decisores institucionales', type: 'Venta disruptiva',
    desc: 'Desafías al cliente con un insight que él no tenía. Muy potente con directores de clínica que creen que "ya tienen todo bajo control".',
    formula: '[Insight inesperado] → [cómo aplica a su situación] → [ASHIRA como solución natural]',
    message: `Buenas tardes, [nombre]. Te cuento algo que descubrimos trabajando con consultorios en Venezuela:

El 70% del tiempo administrativo en clínicas privadas se pierde en 3 tareas: buscar historiales, confirmar citas y coordinar entre el equipo médico.

No es un problema de personal — es un problema de sistema. Y la mayoría de las clínicas lo resuelven contratando más recepcionistas, cuando la solución real es centralizar.

¿Cuánto tiempo está perdiendo tu equipo en esas tres cosas hoy? Con gusto te hago el cálculo. 📊`,
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
    id: 'alternativo', icon: '🔀', name: 'Cierre Alternativo',
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
    message: `¡Hola [nombre]! 👋 Gracias por escribirnos, qué bueno que estás aquí.

Somos ASHIRA — la plataforma creada para que médicos y clínicas dejen de perder tiempo en lo administrativo y lo pongan donde vale: en sus pacientes.

Con ASHIRA puedes:
🏥 Centralizar todos los historiales médicos en un solo lugar seguro
📅 Gestionar citas sin errores ni doble agendamiento
📂 Olvidarte de buscar por cuál correo llegó tal documento
⚡ Mantener a recepción, enfermería y médicos coordinados en tiempo real

Y para que lo veas con tus propios ojos, te damos 15 días completamente GRATIS:
👉 https://ashira.click/register

Sin tarjeta. Sin contratos. Solo entra y prueba.

¿Tienes consultorio propio o trabajas en una clínica? 🙂`,
    note: 'La pregunta final califica al prospecto y personaliza el siguiente mensaje.' },
  { n: 2, title: 'Calificación', tag: 'Diagnóstico', color: 'blue', tech: 'SPIN Lite — preguntas de situación y problema',
    message: `[Si tiene consultorio propio]
¡Perfecto! Los médicos con consultorio propio son exactamente a quienes más le ayuda ASHIRA.

Cuéntame un poco — ¿cómo manejas hoy las citas y los historiales de tus pacientes? ¿Usas algún sistema o lo llevas manual/en Excel? 📋

─────────────────────
[Si trabaja en clínica]
¡Genial! Para clínicas ASHIRA es especialmente poderoso porque centraliza a todo el equipo.

¿Cuántos médicos o especialistas hay en la clínica aproximadamente? Así te puedo decir exactamente qué plan les conviene más 😊`,
    note: 'No vendas todavía. Escucha. La información que te da aquí define toda la conversación siguiente.' },
  { n: 3, title: 'Amplificación del dolor', tag: 'Urgencia real', color: 'mint', tech: 'Costo de la inacción',
    message: `Entiendo perfectamente. La mayoría de los consultorios que nos contactan llevan años así — con Excel, WhatsApp y correos mezclados, y funcionan… pero a un costo enorme de tiempo y errores que no siempre se ven.

Dime, ¿cuántas horas a la semana crees que pierde tu equipo buscando información de pacientes, confirmando citas o resolviendo confusiones? 🤔

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
  { icon: '⚡', text: 'Responde en menos de 5 minutos.', detail: 'El 85% de los prospectos elige al primer proveedor que responde. En Instagram, la velocidad es ventaja competitiva directa.' },
  { icon: '🎯', text: 'Un mensaje = una acción.', detail: 'Cada mensaje debe tener un solo CTA claro. Múltiples opciones generan parálisis. Decide por ellos: "¿Lo probamos hoy?"' },
  { icon: '👂', text: 'Escucha más de lo que hablas.', detail: 'El 70% de la decisión ya está tomada antes de que intervengas. Tu rol es descubrir qué los frena, no convencerlos desde cero.' },
  { icon: '🚫', text: 'Nunca menciones el precio solo.', detail: 'Siempre envuelto: beneficio → precio → beneficio → pregunta. El precio desnudo siempre parece caro.' },
  { icon: '💬', text: 'Las objeciones son señales de interés.', detail: '"Está caro" significa "convénceme". "Lo pienso" significa "tengo una duda que no dije". Siempre pregunta qué hay detrás.' },
  { icon: '📖', text: 'Usa historias, no características.', detail: '"SafeCare ahora coordina a sus médicos en tiempo real" > "ASHIRA tiene módulo de coordinación de equipos". Las historias venden, los features no.' },
  { icon: '⏰', text: 'La urgencia debe ser real.', detail: '"Cupos de onboarding limitados" es verdad para ti. "Oferta expira hoy" sin que expire destruye la confianza y el médico no vuelve.' },
  { icon: '🔄', text: 'Máximo 2 follow-ups sin respuesta.', detail: 'El tercero sin respuesta cierra el lead. No persigas — reabre con valor y si no hay eco, pasa al siguiente.' },
  { icon: '🤝', text: 'Califica antes de vender.', detail: 'Pregunta quién es, qué usa hoy y qué tamaño tiene su operación. Un mensaje personalizado convierte 3x más que uno genérico.' },
  { icon: '😊', text: 'Sé humano, no vendedor.', detail: 'Los médicos tienen radar muy afinado para detectar scripts. El tono conversacional genera más confianza que el copy perfecto.' },
];

const TRACKING_METRICS = [
  { val: '<5\'', label: 'Tiempo de primera respuesta' },
  { val: '30%', label: 'Meta: info → registro' },
  { val: '2x', label: 'Máximo follow-ups' },
  { val: '+50', label: 'NPS de usuarios meta' },
  { val: '<5%', label: 'Churn mensual meta' },
  { val: '1.2', label: 'Referidos por usuario' },
];

const LEAD_LABELS = [
  { color: '#4A7DE8', dot: '🔵', label: 'Caliente', desc: 'Respondió, hizo preguntas, pidió más info o el precio. Prioridad máxima — cerrar en 24–48h.' },
  { color: '#f59e0b', dot: '🟡', label: 'Tibio', desc: 'Leyó y no respondió, o dijo "lo pienso". Follow-up en 24h con nuevo ángulo de valor.' },
  { color: '#7FFFD4', dot: '🟢', label: 'Trial activo', desc: 'Se registró. Check-in al día 3, al día 7 y al día 13 antes de que venza el trial.' },
  { color: '#ef4444', dot: '🔴', label: 'Cerrado', desc: '2 follow-ups sin respuesta o rechazo explícito. Archivar. Reactivar en 30 días.' },
];

const CHECKINS = [
  { day: 'Día 3', msg: '"¿Cómo vas con ASHIRA? ¿Ya probaste [feature específico]? Te cuento un truco que les encanta a los médicos que empiezan."' },
  { day: 'Día 7', msg: '"A mitad del trial, ¿qué ha sido lo más útil hasta ahora? ¿Hay algo que no hayas podido configurar?"' },
  { day: 'Día 13', msg: '"Tu prueba gratuita termina mañana. ¿Seguimos juntos? [Link de pago o plan]. Si tienes alguna duda del precio o el plan, aquí estoy."' },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

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
        background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.05)', 
        color: copied ? '#059669' : '#2563EB', 
        border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(37, 99, 235, 0.1)'}` 
      }}>
      {copied ? '✓ Copiado' : '⎘ Copiar'}
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
  const borderColors = { blue: '#2563EB', mint: '#10B981', amber: '#F59E0B', purple: '#7C3AED' };
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

// ─── AI ANALYZER ─────────────────────────────────────────────────────────────

function AIAnalyzer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeResponse, setActiveResponse] = useState(0);
  const textareaRef = useRef(null);

  const examples = [
    'Hola, vi su anuncio y me gustaría saber más sobre ASHIRA',
    'Cuánto cuesta? Tengo un consultorio con 2 médicos',
    'Ya uso Excel para todo, no sé si necesito algo más',
    'Lo pienso y te aviso, ahorita estoy muy ocupado',
    'Cuánto cobran? Parece interesante pero caro',
    'Mis datos de pacientes deben ser muy privados, ¿cómo garantizan eso?',
  ];

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setActiveResponse(0);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Error al analizar');
    } finally {
      setLoading(false);
    }
  };

  const sentimentConfig = {
    positivo: { label: 'Positivo', color: '#10B981', bg: '#F0FDF4' },
    neutro: { label: 'Neutro', color: '#2563EB', bg: '#F0F7FF' },
    negativo: { label: 'Negativo', color: '#EF4444', bg: '#FEF2F2' },
    con_objecion: { label: 'Con objeción', color: '#F59E0B', bg: '#FFFBEB' },
  };

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="card-elegant rounded-2xl p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-6 bg-blue-600 rounded-full" />
          <span className="section-title text-gray-900">Analizador Inteligente</span>
        </div>
        <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
          rows={5} placeholder="Pega aquí el mensaje del cliente para recibir consejos estratégicos..."
          className="w-full rounded-xl p-4 text-sm transition-all focus:ring-2 focus:ring-blue-100 outline-none"
          style={{ background: '#F9FAFB', border: '1px solid var(--ash-border)', color: 'var(--ash-text)', fontFamily: 'var(--font-body)' }}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) analyze(); }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <div className="flex gap-2 flex-wrap">
            {examples.slice(0, 3).map((ex, i) => (
              <button key={i} onClick={() => setInput(ex)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-blue-50"
                style={{ background: 'white', color: '#4B5563', border: '1px solid #E5E7EB' }}>
                Ejemplo {i + 1}
              </button>
            ))}
          </div>
          <button onClick={analyze} disabled={loading || !input.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
            style={{ 
              background: input.trim() && !loading ? 'var(--ash-primary)' : '#E5E7EB', 
              color: 'white', 
              opacity: input.trim() && !loading ? 1 : 0.6,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' 
            }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'white' }} /> Analizando...</> : '✦ Sugerir respuesta'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 bg-red-50 border border-red-100">
          <p className="text-sm font-medium text-red-600">⚠ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-in space-y-6">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ETAPA</div>
              <div className="text-sm font-bold text-blue-600">{result.stage}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CONFIANZA</div>
              <div className="text-sm font-bold text-gray-800">{result.stage_confidence}%</div>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${result.stage_confidence}%` }} />
              </div>
            </div>
            <div className="rounded-2xl p-4 shadow-sm border border-gray-100" style={{ background: sentimentConfig[result.sentiment]?.bg || 'white' }}>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SENTIMIENTO</div>
              <div className="text-sm font-bold" style={{ color: sentimentConfig[result.sentiment]?.color || '#1F2937' }}>
                {sentimentConfig[result.sentiment]?.label || result.sentiment}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">URGENCIA</div>
              <div className="flex items-center gap-1.5 mt-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-2 rounded-full flex-1"
                    style={{ background: i <= result.urgency_level ? 'var(--ash-primary)' : '#F3F4F6' }} />
                ))}
              </div>
            </div>
          </div>

          <div className="card-elegant rounded-2xl overflow-hidden bg-white">
            <div className="flex border-b border-gray-100 overflow-x-auto scroller-hidden">
              {result.responses?.map((r, i) => (
                <button key={i} onClick={() => setActiveResponse(i)}
                  className="flex-shrink-0 px-6 py-4 text-xs font-bold transition-all border-b-2"
                  style={{
                    backgroundColor: activeResponse === i ? '#F0F7FF' : 'transparent',
                    color: activeResponse === i ? 'var(--ash-primary)' : '#9CA3AF',
                    borderColor: activeResponse === i ? 'var(--ash-primary)' : 'transparent',
                  }}>
                  OPCIÓN #{i + 1} ({r.score}%)
                </button>
              ))}
            </div>
            {result.responses?.[activeResponse] && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Tag color="mint">{result.responses[activeResponse].technique_tag}</Tag>
                    <h3 className="text-lg font-bold mt-2 text-gray-900">
                      {result.responses[activeResponse].technique}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-blue-600">
                      {result.responses[activeResponse].score}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">CALIDAD</div>
                  </div>
                </div>
                
                <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100/50">
                  <p className="text-sm leading-relaxed text-blue-800 italic">
                    <span className="font-bold not-italic mr-2">Estrategia:</span>
                    {result.responses[activeResponse].reasoning}
                  </p>
                </div>

                <MsgBlock text={result.responses[activeResponse].message} color="blue" />
              </div>
            )}
          </div>

          {/* Next step */}
          {result.next_step && (
            <div className="rounded-2xl p-5 bg-emerald-50 border border-emerald-100">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">PROTIP DE SEGUIMIENTO</div>
              <p className="text-sm font-medium text-emerald-900">{result.next_step}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

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
            <div className="rounded-xl p-4 text-xs bg-gray-50 border border-gray-100 text-gray-700 font-medium leading-relaxed">
              <span className="text-blue-600 font-bold block mb-1">Estructura Sugerida: </span>{t.formula}
            </div>
            {t.messages ? (
              <div className="space-y-3">
                {t.messages.map((m, i) => <MsgBlock key={i} text={m.text} color={m.color} />)}
              </div>
            ) : (
              <MsgBlock text={t.message} />
            )}
            {t.note && (
              <div className="flex items-center gap-2 p-3 bg-blue-50/30 rounded-lg border border-blue-100/30">
                <span className="text-sm">💡</span>
                <p className="text-xs font-medium text-blue-800">{t.note}</p>
              </div>
            )}
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
          <div className="space-y-4">
            <Tag color="purple">{s.tech}</Tag>
            <MsgBlock text={s.message} color={s.color} />
            {s.note && (
              <div className="flex items-center gap-2 p-3 bg-blue-50/30 rounded-lg border border-blue-100/30">
                <span className="text-sm">💡</span>
                <p className="text-xs font-medium text-blue-800">{s.note}</p>
              </div>
            )}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function ObjectionsSection() {
  return (
    <div className="space-y-4">
      {OBJECTIONS.map((o, i) => (
        <Collapsible key={i} icon="⚡" title={o.q} badge={o.tech} badgeColor="amber">
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
          <div className="space-y-4">
            <Tag color="purple">{r.tech}</Tag>
            <MsgBlock text={r.message} color="mint" />
            {r.note && (
              <div className="flex items-center gap-2 p-3 bg-blue-50/30 rounded-lg border border-blue-100/30">
                <span className="text-sm">💡</span>
                <p className="text-xs font-medium text-blue-800">{r.note}</p>
              </div>
            )}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function RulesSection() {
  return (
    <div className="space-y-3">
      {RULES.map((r, i) => (
        <div key={i} className="card-elegant flex gap-4 p-5 rounded-2xl bg-white">
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
              <div className="text-2xl font-black mb-1 text-blue-600" style={{ fontFamily: 'var(--font-mono)' }}>{m.val}</div>
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold" style={{ color: l.color }}>{l.label}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{l.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title mb-4">Secuencia de Seguimiento (Trial)</p>
        <div className="space-y-3">
          {CHECKINS.map((c, i) => (
            <div key={i} className="card-elegant flex gap-4 p-5 rounded-2xl bg-white">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-[11px] font-black px-2 py-1 rounded bg-blue-100 text-blue-700" style={{ fontFamily: 'var(--font-mono)' }}>{c.day}</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 font-medium">{c.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'ia', label: 'IA Analyzer', icon: '✦' },
  { id: 'flujo', label: 'Flujo completo', icon: '→' },
  { id: 'tecnicas', label: 'Técnicas', icon: '◎' },
  { id: 'objeciones', label: 'Objeciones', icon: '⚡' },
  { id: 'reactivacion', label: 'Reactivación', icon: '↺' },
  { id: 'reglas', label: 'Reglas de oro', icon: '★' },
  { id: 'seguimiento', label: 'Seguimiento', icon: '◈' },
];

export default function App() {
  const [active, setActive] = useState('ia');
  const [menuOpen, setMenuOpen] = useState(false);

  const SECTION_COMPONENTS = {
    ia: <AIAnalyzer />,
    tecnicas: <TechniquesSection />,
    flujo: <FlowSection />,
    objeciones: <ObjectionsSection />,
    reactivacion: <ReactivationSection />,
    reglas: <RulesSection />,
    seguimiento: <TrackingSection />,
  };

  const currentNav = NAV.find(n => n.id === active);

  return (
    <div className="grid-bg min-h-screen flex bg-[#F9FAFB]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-r border-gray-200 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-8 pb-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg shadow-blue-100"
              style={{ background: 'var(--ash-primary)', color: 'white' }}>A</div>
            <div>
              <div className="font-black text-sm tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>ASHIRA</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Intelligence</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 ${active === item.id ? 'active shadow-sm shadow-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
              style={{ fontFamily: 'var(--font-body)' }}>
              <span className="text-base">{item.icon}</span>
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-2 mb-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
            <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1 }} />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">IA Engine Active</span>
          </div>
          <p className="text-[10px] font-medium text-gray-400 mt-2 text-center">
            ASHIRA Playbook © 2026
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-5 bg-white/70 border-b border-gray-100 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl bg-gray-50 text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentNav?.icon}</span>
                <h1 className="text-lg font-black tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                  {currentNav?.label}
                </h1>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ASHIRA Sales Playbook</p>
            </div>
          </div>
          <a href="https://ashira.click/register" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600">
            Acceso Directo ↗
          </a>
        </header>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden p-4 space-y-2 bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setActive(item.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left text-sm font-bold ${active === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          <div key={active} className="fade-in">
            {SECTION_COMPONENTS[active]}
          </div>
        </div>
      </main>
    </div>
  );
}
