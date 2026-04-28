# Análisis y Diseño: Sistema C4 Operativo de Seguridad Pública

Basado en la lectura profunda del documento maestro de arquitectura y los flujos operativos, este documento detalla las historias de usuario necesarias para construir el C4 Operativo.

## 1. Contexto Operativo C4

A diferencia de las áreas de seguimiento administrativo, el **C4 exige inmediatez**. Actualmente, la dependencia sufre del problema del **"Triple Folio"**, donde un mismo incidente de emergencia se captura tres veces en sistemas distintos (CAD, Bitácora, CUAS) o incluso se comunican datos críticos por WhatsApp, perdiendo toda trazabilidad legal.

**La Solución:** Un sistema unificado gobernado por un **Folio UUID único** que viaja a lo largo de 7 fases strictas (Recepción -> Despacho -> Campo -> Bitácora Automática -> Novedades -> Análisis -> Salidas).

**Postura sobre la Inteligencia Artificial:**
La IA se utiliza estrictamente como asistencia. No clasifica, ni asigna unidades, ni toma decisiones ejecutivas. El humano siempre aprueba. Sus únicos tres usos son:
1. `Whisper STT`: Para dictar voz a texto en campo.
2. `Gemini/Ollama`: Para generar un borrador pre-redactado de Novedades.
3. `Python Script`: Job nocturno para analizar patrones geográficos.

---

## 2. Historias de Usuario (Desglose Ágil)

Estructuradas en Épicas, Historias y Tareas técnicas, valoradas en puntos de historia (Fibonacci). 
*(Nota: Al ser C4, los campos específicos de formulario dependerán de los formatos FC-01 a FC-07 nacionales, por lo que aquí se define el flujo sistémico).*

### ÉPICA 4: Recepción 911 y Despacho
*El punto de entrada de la emergencia.*

*   **HU-4.1: Generación de Folio Único (Puntos: 5)**
    *   **Como:** Operador de Líneas 911.
    *   **Quiero:** Registrar la llamada de emergencia seleccionando el "Tipo de Incidente" desde un catálogo nacional pre-cargado.
    *   **Para:** Que al guardar, el sistema genere un Folio UUID central que unifique y amarre todas las bases de datos posteriores.
    *   **Tasks:**
        *   Formulario de ingesta de incidentes básicos.
        *   Seed de BD con catálogos nacionales.
        *   Lógica de generación de UUID en backend.

*   **HU-4.2: Panel de Despacho Web sin WhatsApp (Puntos: 5)**
    *   **Como:** Despachador de Unidades.
    *   **Quiero:** Ver una cola de incidentes entrantes en tiempo real y asignar la unidad patrulla responsable directamente desde la plataforma web.
    *   **Para:** Que el policía reciba el Folio en su dispositivo mediante el sistema oficial y dejemos de depender de WhatsApp para enviar direcciones y datos críticos.
    *   **Tasks:**
        *   Vista de lista en vivo (Polling o WebSockets básicos).
        *   Panel de asignación de unidades policiales (relación 1 a muchos).

### ÉPICA 5: Reporte de Campo (Asistencia IA Whisper)
*La recolección de datos en la calle.*

*   **HU-5.1: Web App de Oficial de Campo (Puntos: 5)**
    *   **Como:** Oficial de Policía en patrulla.
    *   **Quiero:** Iniciar sesión en una Web App responsive desde la tablet o laptop de mi unidad para visualizar el Folio UUID que me acaban de asignar.
    *   **Para:** Conocer los detalles del incidente y acudir al lugar.
    *   **Tasks:**
        *   UI responsive adaptada a pantallas táctiles de tablet.
        *   Manejo de sesión (JWT) por oficial.

*   **HU-5.2: Dictado de Hechos por Voz STT (Puntos: 8)**
    *   **Como:** Oficial de Policía en patrulla.
    *   **Quiero:** Presionar un botón de micrófono para narrar los hechos del evento, permitiendo que la IA (Whisper) transcriba mi voz a texto en el área de "Narrativa".
    *   **Para:** Poder leer el texto, corregirlo manualmente y guardar el reporte en una fracción del tiempo que me toma teclearlo.
    *   **Tasks:**
        *   Integrar MediaRecorder API en frontend.
        *   Endpoint para procesar audio y conectarse a Whisper API / Local.
        *   Devolver string y rellenar textarea.

### ÉPICA 6: Trazabilidad y Bitácora Automática
*Auditoría inquebrantable del sistema.*

*   **HU-6.1: Triggers de Auditoría BD (Puntos: 3)**
    *   **Como:** Bitacorista o Auditor.
    *   **Quiero:** Que el sistema agregue de forma autónoma una entrada con fecha/hora a la bitácora electrónica cada vez que el Folio cambie de fase (Ej. Despachado, Atendido, Modificado).
    *   **Para:** Garantizar la cadena de custodia de la información sin tener que capturar los tiempos a mano.
    *   **Tasks:**
        *   Configurar triggers a nivel PostgreSQL o interceptores en Drizzle ORM.
        *   Vista read-only de "Historial de Cambios" en el detalle del folio.

### ÉPICA 7: Novedades, IA y Envío a Fiscalía
*Formalización legal y automatización del "Parte Informativo".*

*   **HU-7.1: Complemento Legal CPQ (Puntos: 3)**
    *   **Como:** Auxiliar de Novedades.
    *   **Quiero:** Abrir un folio que ya trae datos de C4 y de Campo, para enriquecerlo seleccionando el artículo específico del Código Penal de Querétaro (CPQ) y datos de detenidos.
    *   **Para:** Darle el peso legal necesario al reporte.
    *   **Tasks:**
        *   Catálogo del CPQ.
        *   Sub-formulario de Detenidos y Objetos asegurados.

*   **HU-7.2: Borrador Generado por LLM y Aprobación (Puntos: 8)**
    *   **Como:** Operador de Novedades.
    *   **Quiero:** Hacer clic en "Generar Borrador" para que la IA (Gemini/Ollama) lea todos los datos estructurados del folio y me redacte una propuesta narrativa de parte informativo.
    *   **Para:** Únicamente tener que leer, editar pequeños errores, presionar "Aprobar" y que el sistema envíe en ese instante el PDF institucional a la Fiscalía por email.
    *   **Tasks:**
        *   Ingeniería de Prompts inyectando el JSON del folio.
        *   Integración API LLM para devolver el texto pre-formateado.
        *   Lógica de Generación de PDF (React-PDF/Puppeteer).
        *   Integración SMTP/Resend para despacho de correos automáticos al aprobar.

### ÉPICA 8: Análisis Geoespacial y Patrones
*Explotación de datos.*

*   **HU-8.1: Alertas Nocturnas de Job Analítico (Puntos: 5)**
    *   **Como:** Analista de C4.
    *   **Quiero:** Al llegar por la mañana, visualizar un panel de notificaciones generadas por un análisis estadístico de madrugada, que me avise de desvíos en umbrales o nuevas "zonas calientes" de criminalidad.
    *   **Para:** Poder enfocar mi generación de reportes y mapas (PostGIS) en las zonas indicadas por la estadística.
    *   **Tasks:**
        *   Script cron/worker para agrupamiento de datos geoespaciales.
        *   Notificaciones de UI en Dashboard analítico.
