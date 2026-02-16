# Accesibilidad

Este proyecto ha sido desarrollado siguiendo principios de accesibilidad web para garantizar que todas las personas puedan interactuar con la interfaz, independientemente de sus capacidades o del dispositivo utilizado.

Se aplican criterios basados en:

- WCAG 2.1 (nivel básico AA)
- WAI-ARIA
- Principios de usabilidad de Nielsen

---

# 1. Principios Aplicados

El sistema cumple con los cuatro principios fundamentales de accesibilidad:

## 1.1 Perceptible
- El contenido no depende únicamente del color.
- Los estados (error, éxito, loading) son visibles y textuales.
- Los mensajes dinámicos pueden ser anunciados por lectores de pantalla.
- Se mantiene contraste adecuado en textos y botones.

## 1.2 Operable
- Toda la interfaz es navegable por teclado.
- No existen acciones exclusivas de mouse.
- Se respeta el orden lógico de tabulación.
- Los diálogos pueden cerrarse con tecla Escape.

## 1.3 Comprensible
- Los mensajes de error son claros y específicos.
- Los estados del sistema son visibles.
- La retroalimentación es inmediata tras acciones del usuario.

## 1.4 Robusto
- Uso correcto de HTML semántico (`button`, `input`, `form`, `nav`, `main`).
- Implementación adecuada de atributos ARIA cuando es necesario.
- Compatibilidad con tecnologías asistivas.

---

# 2. Navegación por Teclado

El sistema soporta:

- Tab → Navegación hacia adelante
- Shift + Tab → Navegación hacia atrás
- Enter → Activación de botones y enlaces
- Space → Activación de botones
- Escape → Cierre de diálogos y modales
- Arrow keys → Navegación en menús y tabs

No se utilizan `div` interactivos sin roles apropiados.

---

# 3. Gestión de Foco

Se implementa manejo adecuado de foco en:

- Apertura de modales (focus inicial dentro del diálogo)
- Cierre de modales (retorno al elemento que lo activó)
- Elementos dinámicos
- Estados de validación

El indicador visual de foco nunca se elimina.

---

# 4. Formularios Accesibles

Los formularios incluyen:

- `aria-invalid="true"` cuando hay errores
- Asociación de errores mediante `aria-describedby`
- Mensajes de error con `role="alert"`
- Etiquetas (`label`) correctamente asociadas a inputs

Los errores no se comunican únicamente por color.

---

# 5. Feedback Dinámico

Se implementa retroalimentación accesible mediante:

- `aria-live="polite"` para mensajes informativos
- `aria-live="assertive"` para errores críticos
- Indicadores de carga con `aria-busy="true"`

Esto permite que lectores de pantalla anuncien cambios dinámicos.

---

# 6. Estados del Sistema

Se documentan y manejan los siguientes estados:

- Default
- Hover
- Focus-visible
- Active
- Disabled
- Loading
- Error
- Success

Todos los estados son:

- Visualmente distinguibles
- Funcionalmente coherentes
- Accesibles mediante teclado

---

# 7. Testing de Accesibilidad

El proyecto incluye pruebas de interacción que validan:

- Renderizado correcto
- Activación por teclado
- Apertura y cierre de componentes interactivos
- Cambios de estado

Se prioriza testing basado en comportamiento del usuario.

---

# Conclusión

El sistema cumple con buenas prácticas modernas de accesibilidad web, proporcionando:

- Interfaz navegable por teclado
- Estados claros y visibles
- Feedback accesible
- Uso adecuado de semántica HTML y ARIA
- Experiencia inclusiva para usuarios con tecnologías asistivas