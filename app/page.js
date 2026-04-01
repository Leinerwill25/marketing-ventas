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
    blue: 'bg-blue-900/40 text-blue-300 border border-blue-700/30',
    green: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30',
    purple: 'bg-purple-900/40 text-purple-300 border border-purple-700/30',
    amber: 'bg-amber-900/40 text-amber-300 border border-amber-700/30',
    mint: 'bg-teal-900/40 text-teal-300 border border-teal-700/30',
  };
  return (
    <span className={`tag ${colors[color] || colors.blue}`}>{children}</span>
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
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-200"
      style={{ background: copied ? 'rgba(127,255,212,0.15)' : 'rgba(74,125,232,0.1)', color: copied ? '#7FFFD4' : '#6FA8F5', border: `1px solid ${copied ? 'rgba(127,255,212,0.3)' : 'rgba(74,125,232,0.2)'}` }}>
      {copied ? '✓ Copiado' : '⎘ Copiar'}
    </button>
  );
}

function Collapsible({ title, badge, badgeColor, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-hover rounded-xl" style={{ background: 'rgba(13,31,60,0.6)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <div className="font-medium text-sm" style={{ fontFamily: 'var(--font-display)', color: '#e2eaf8' }}>{title}</div>
          {badge && <div className="mt-1"><Tag color={badgeColor}>{badge}</Tag></div>}
        </div>
        <span style={{ color: '#4A7DE8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▾</span>
      </button>
      <div className={`collapsible-content ${open ? 'open' : ''}`}>
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

function MsgBlock({ text, color = 'blue' }) {
  const borderColors = { blue: '#4A7DE8', mint: '#7FFFD4', amber: '#f59e0b', purple: '#a78bfa' };
  return (
    <div className="relative rounded-r-xl rounded-bl-xl p-4 mb-3"
      style={{ background: 'rgba(10,22,40,0.8)', borderLeft: `3px solid ${borderColors[color] || borderColors.blue}` }}>
      <pre className="text-xs leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-body)', color: '#b8cce8' }}>{text}</pre>
      <div className="mt-2 flex justify-end"><CopyButton text={text} /></div>
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
    positivo: { label: 'Positivo', color: '#7FFFD4', bg: 'rgba(127,255,212,0.1)' },
    neutro: { label: 'Neutro', color: '#6FA8F5', bg: 'rgba(74,125,232,0.1)' },
    negativo: { label: 'Negativo', color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
    con_objecion: { label: 'Con objeción', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  };

  return (
    <div className="space-y-4">
      {/* Input area */}
      <div className="gradient-border" style={{ position: 'relative', zIndex: 0 }}>
        <div className="rounded-xl p-4" style={{ background: '#0a1628' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="glow-dot" />
            <span className="section-title">Analizador IA — Pega el mensaje del cliente</span>
          </div>
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
            rows={5} placeholder="Escribe o pega aquí el mensaje del cliente..."
            className="w-full rounded-lg p-3 text-sm"
            style={{ background: 'rgba(5,12,26,0.8)', border: '1px solid #1a3055', color: '#c8d8f0', fontFamily: 'var(--font-body)' }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) analyze(); }} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2 flex-wrap">
              {examples.slice(0, 3).map((ex, i) => (
                <button key={i} onClick={() => setInput(ex)}
                  className="text-xs px-2 py-1 rounded-md transition-all"
                  style={{ background: 'rgba(74,125,232,0.08)', color: '#6FA8F5', border: '1px solid rgba(74,125,232,0.2)' }}>
                  Ejemplo {i + 1}
                </button>
              ))}
            </div>
            <button onClick={analyze} disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
              style={{ background: input.trim() && !loading ? 'linear-gradient(135deg, #4A7DE8, #7FFFD4)' : '#1a3055', color: input.trim() && !loading ? '#050c1a' : '#3a5070', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Analizando...</> : '✦ Analizar mensaje'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>⚠ {error}</p>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Verifica que ANTHROPIC_API_KEY está configurada en las variables de entorno de Vercel.</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-in space-y-4">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl p-3" style={{ background: 'rgba(74,125,232,0.08)', border: '1px solid #1a3055' }}>
              <div className="text-xs mb-1" style={{ color: '#4a6080', fontFamily: 'var(--font-mono)' }}>ETAPA</div>
              <div className="text-sm font-medium" style={{ color: '#6FA8F5' }}>{result.stage}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(74,125,232,0.08)', border: '1px solid #1a3055' }}>
              <div className="text-xs mb-1" style={{ color: '#4a6080', fontFamily: 'var(--font-mono)' }}>CONFIANZA</div>
              <div className="text-sm font-medium" style={{ color: '#e2eaf8' }}>{result.stage_confidence}%</div>
              <div className="score-bar mt-1" style={{ width: `${result.stage_confidence}%` }} />
            </div>
            <div className="rounded-xl p-3" style={{ background: sentimentConfig[result.sentiment]?.bg || 'rgba(74,125,232,0.08)', border: '1px solid #1a3055' }}>
              <div className="text-xs mb-1" style={{ color: '#4a6080', fontFamily: 'var(--font-mono)' }}>SENTIMIENTO</div>
              <div className="text-sm font-medium" style={{ color: sentimentConfig[result.sentiment]?.color || '#e2eaf8' }}>
                {sentimentConfig[result.sentiment]?.label || result.sentiment}
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(74,125,232,0.08)', border: '1px solid #1a3055' }}>
              <div className="text-xs mb-1" style={{ color: '#4a6080', fontFamily: 'var(--font-mono)' }}>URGENCIA</div>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-2 rounded-sm flex-1"
                    style={{ background: i <= result.urgency_level ? '#4A7DE8' : '#1a3055' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Key signals */}
          {result.key_signals?.length > 0 && (
            <div className="rounded-xl p-3" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid #1a3055' }}>
              <div className="text-xs mb-2 section-title">Señales detectadas</div>
              <div className="flex gap-2 flex-wrap">
                {result.key_signals.map((s, i) => <Tag key={i} color="blue">{s}</Tag>)}
              </div>
            </div>
          )}

          {/* Response tabs */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a3055' }}>
            <div className="flex" style={{ background: '#0a1628', borderBottom: '1px solid #1a3055' }}>
              {result.responses?.map((r, i) => (
                <button key={i} onClick={() => setActiveResponse(i)}
                  className="flex-1 py-3 px-2 text-xs font-medium transition-all"
                  style={{
                    background: activeResponse === i ? 'rgba(74,125,232,0.12)' : 'transparent',
                    color: activeResponse === i ? '#7FFFD4' : '#4a6080',
                    borderBottom: activeResponse === i ? '2px solid #7FFFD4' : '2px solid transparent',
                    fontFamily: 'var(--font-mono)'
                  }}>
                  #{i + 1} — {r.score}pts
                </button>
              ))}
            </div>
            {result.responses?.[activeResponse] && (
              <div className="p-4" style={{ background: 'rgba(5,12,26,0.8)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Tag color="mint">{result.responses[activeResponse].technique_tag}</Tag>
                    <p className="text-sm font-medium mt-2" style={{ color: '#e2eaf8', fontFamily: 'var(--font-display)' }}>
                      {result.responses[activeResponse].technique}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: '#4A7DE8' }}>
                      {result.responses[activeResponse].score}
                    </div>
                    <div className="text-xs" style={{ color: '#4a6080' }}>score</div>
                  </div>
                </div>
                <div className="score-bar mb-4" style={{ width: `${result.responses[activeResponse].score}%` }} />
                <p className="text-xs mb-3 italic" style={{ color: '#6FA8F5' }}>
                  {result.responses[activeResponse].reasoning}
                </p>
                <MsgBlock text={result.responses[activeResponse].message} color="mint" />
              </div>
            )}
          </div>

          {/* Next step */}
          {result.next_step && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(127,255,212,0.05)', border: '1px solid rgba(127,255,212,0.15)' }}>
              <div className="section-title mb-1" style={{ color: '#7FFFD4' }}>Siguiente paso recomendado</div>
              <p className="text-sm" style={{ color: '#c8d8f0' }}>{result.next_step}</p>
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
    <div className="space-y-3">
      {TECHNIQUES.map(t => (
        <Collapsible key={t.id} icon={t.icon} title={t.name} badge={t.badge} badgeColor={t.badgeColor}>
          <div className="space-y-3">
            <p className="text-xs" style={{ color: '#7a9bbf' }}>{t.sub}</p>
            <div className="flex gap-2 flex-wrap">
              <Tag color="blue">{t.origin}</Tag>
              <Tag color="green">{t.use}</Tag>
              <Tag color="purple">{t.type}</Tag>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#8cb0d4' }}>{t.desc}</p>
            <div className="rounded-lg p-3 text-xs" style={{ background: 'rgba(74,125,232,0.06)', border: '1px solid #1a3055', color: '#8cb0d4', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#4A7DE8' }}>Fórmula: </span>{t.formula}
            </div>
            {t.messages ? (
              <div className="space-y-2">
                {t.messages.map((m, i) => <MsgBlock key={i} text={m.text} color={m.color} />)}
              </div>
            ) : (
              <MsgBlock text={t.message} />
            )}
            {t.note && <p className="text-xs italic" style={{ color: '#4a6080' }}>💡 {t.note}</p>}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function FlowSection() {
  const colorMap = { blue: '#4A7DE8', mint: '#7FFFD4', amber: '#f59e0b', purple: '#a78bfa' };
  return (
    <div className="space-y-3">
      {FLOW_STEPS.map(s => (
        <Collapsible key={s.n} icon={`${s.n}`} title={`Paso ${s.n}: ${s.title}`} badge={s.tag} badgeColor={s.color}>
          <div className="space-y-3">
            <Tag color="purple">{s.tech}</Tag>
            <MsgBlock text={s.message} color={s.color} />
            {s.note && <p className="text-xs italic" style={{ color: '#4a6080' }}>💡 {s.note}</p>}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function ObjectionsSection() {
  return (
    <div className="space-y-3">
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
    <div className="space-y-3">
      {REACTIVATION.map(r => (
        <Collapsible key={r.n} icon={`${r.n}`} title={`Paso ${r.n}: ${r.title}`} badge={`Espera: ${r.when}`} badgeColor="amber">
          <div className="space-y-3">
            <Tag color="purple">{r.tech}</Tag>
            <MsgBlock text={r.message} color="mint" />
            {r.note && <p className="text-xs italic" style={{ color: '#4a6080' }}>💡 {r.note}</p>}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

function RulesSection() {
  return (
    <div className="space-y-2">
      {RULES.map((r, i) => (
        <div key={i} className="card-hover flex gap-4 p-4 rounded-xl"
          style={{ background: 'rgba(13,31,60,0.6)' }}>
          <span className="text-xl flex-shrink-0">{r.icon}</span>
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#e2eaf8', fontFamily: 'var(--font-display)' }}>{r.text}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#6a8baa' }}>{r.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackingSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="section-title mb-3">Métricas norte — Fase 1</p>
        <div className="grid grid-cols-3 gap-3">
          {TRACKING_METRICS.map((m, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid #1a3055' }}>
              <div className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-mono)', color: '#4A7DE8' }}>{m.val}</div>
              <div className="text-xs" style={{ color: '#4a6080' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title mb-3">Etiqueta cada lead en tu DM</p>
        <div className="space-y-2">
          {LEAD_LABELS.map((l, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid #1a3055' }}>
              <span className="text-sm w-5 flex-shrink-0">{l.dot}</span>
              <div>
                <span className="text-sm font-medium mr-2" style={{ color: l.color }}>{l.label}</span>
                <span className="text-xs" style={{ color: '#6a8baa' }}>{l.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="section-title mb-3">Secuencia de check-in durante el trial</p>
        <div className="space-y-2">
          {CHECKINS.map((c, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid #1a3055' }}>
              <span className="text-xs font-bold w-12 flex-shrink-0 pt-0.5" style={{ fontFamily: 'var(--font-mono)', color: '#4A7DE8' }}>{c.day}</span>
              <p className="text-xs leading-relaxed" style={{ color: '#8cb0d4' }}>{c.msg}</p>
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
    <div className="grid-bg min-h-screen flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0"
        style={{ background: 'rgba(5,12,26,0.95)', borderRight: '1px solid #1a3055', position: 'sticky', top: 0, height: '100vh' }}>
        {/* Logo */}
        <div className="p-6 pb-4" style={{ borderBottom: '1px solid #1a3055' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #4A7DE8, #7FFFD4)', color: '#050c1a' }}>A</div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)', color: '#e2eaf8' }}>ASHIRA</div>
              <div className="text-xs" style={{ color: '#4a6080' }}>Sales Intelligence</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${active === item.id ? 'active' : ''}`}
              style={{ color: active === item.id ? '#7FFFD4' : '#4a6080', fontFamily: 'var(--font-body)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div className="p-4" style={{ borderTop: '1px solid #1a3055' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="glow-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs" style={{ color: '#4a6080' }}>IA activa</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#2a4060' }}>
            Powered by Claude Sonnet 4
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(5,12,26,0.95)', borderBottom: '1px solid #1a3055', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: '#4A7DE8' }}>☰</button>
            <div>
              <h1 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: '#e2eaf8' }}>
                {currentNav?.icon} {currentNav?.label}
              </h1>
              <p className="text-xs" style={{ color: '#4a6080' }}>ASHIRA Sales Playbook 2026</p>
            </div>
          </div>
          <a href="https://ashira.click/register" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(74,125,232,0.1)', color: '#6FA8F5', border: '1px solid rgba(74,125,232,0.2)' }}>
            ashira.click/register ↗
          </a>
        </header>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden p-3 space-y-1" style={{ background: 'rgba(5,12,26,0.98)', borderBottom: '1px solid #1a3055' }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setActive(item.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm"
                style={{ color: active === item.id ? '#7FFFD4' : '#4a6080', background: active === item.id ? 'rgba(127,255,212,0.08)' : 'transparent' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
          <div key={active} className="fade-in">
            {SECTION_COMPONENTS[active]}
          </div>
        </div>
      </main>
    </div>
  );
}
