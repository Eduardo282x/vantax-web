# AGENTS.md

Guía obligatoria para agentes de IA que trabajen en `vantax-web`. Léela antes de crear pantallas, componentes, navegación, servicios o módulos. El código y los archivos usan inglés; las rutas y todo el texto visible al usuario van en español.

Si una regla visual de esta guía aún no coincide con el código, no la ignores ni crees una solución paralela: implementa la migración de forma incremental y conserva el funcionamiento actual mientras avanzas.

## 1. Contexto del producto

Vantax es el frontend de un sistema de gestión comercial y ventas (POS) con analítica predictiva para la optimización dinámica de precios.

- SPA con React 19, Vite 8 y TypeScript 7.
- Backend NestJS en el repo hermano `../vantax-api`, con prefijo global `/api`.
- El frontend solo consume datos y muestra resultados. **La analítica predictiva y el cálculo de precios pertenecen al backend**; nunca implementes modelos, reglas de margen ni optimización de precios en React.
- La interfaz debe ser modular, contextual, expansiva y centrada en el contenido. Navegación global en cabecera; navegación secundaria contextual en un dock flotante. **No se debe construir un sidebar administrativo fijo como solución objetivo.**

### Estado actual frente al objetivo

| Aspecto | Estado actual verificado | Objetivo |
| --- | --- | --- |
| Layout | `AppLayout` con `AppHeader` + `FloatingDock` y contenido full-width; sin sidebar. | Mantener header + dock + workspace amplio. |
| Navegación | Áreas y secciones en `src/layout/navigation.ts`; rutas en español. | Una sola fuente de verdad para header y dock. |
| Transiciones | `PageTransition` integrado en Usuarios para listado ↔ detalle. | Reutilizarlo en los demás módulos. |
| Tema | Paleta azul aplicada en `:root` y `.dark` de `src/index.css`. | Mantener contraste AA y tokens semánticos. |
| Componentes | `DataTable`, `DataFilters` y `ConfigurableForm` implementados. | Reutilizarlos en todos los módulos. |
| Datos | Usuarios con mocks; dashboard estático; módulos nuevos con placeholder. | Conectar módulos al backend cuando existan endpoints. |
| Tests | No hay runner ni suite configurada. | No inventar comandos ni resultados de tests. |

Los archivos `.html` sueltos en la raíz (por ejemplo los prototipos visuales) son referencias estáticas: no forman parte del build, no se importan en React y no deben copiarse como código de producción.

### Módulos y áreas funcionales

| Área principal | Módulos / secciones | Estado frontend |
| --- | --- | --- |
| Inicio | Dashboard, alertas y actividad reciente. | Dashboard implementado con datos estáticos; alertas y actividad con placeholder. |
| Ventas | Punto de venta, historial, comprobantes, devoluciones. | Rutas y dock listos; pantallas con placeholder. |
| Inventario | Productos, movimientos, existencias, alertas de stock, precios inteligentes. | Rutas y dock listos; pantallas con placeholder. |
| Compras | Registrar compra, historial, proveedores, entradas de mercancía. | Rutas y dock listos; pantallas con placeholder. |
| Reportes | Resumen, ventas, inventario, compras, rentabilidad, analítica predictiva. | Rutas y dock listos; pantallas con placeholder. |
| Configuración | Usuarios, roles y permisos, datos comerciales, preferencias. | Usuarios y preferencias implementados; roles y datos con placeholder. |

La analítica predictiva es transversal: se integra en productos, compras, inventario, dashboard y reportes. No es un CRUD aislado.

### Estado del backend (verificar antes de asumir)

A fecha de esta documentación, en `../vantax-api` los controladores de `users`, `products`, `sales`, `dashboard` y `pricing` son stubs vacíos; solo `POST /api/auth` tiene implementación. Por eso `VITE_USE_MOCKS=true` es el modo de trabajo por defecto. Antes de desactivar mocks, confirma el endpoint real en el backend.

## 2. Comandos

- Usa **pnpm** exclusivamente (hay `pnpm-lock.yaml` y `allowBuilds` en `pnpm-workspace.yaml`). Requiere Node 24+ y pnpm 11+.
- `pnpm dev` — servidor de desarrollo en `http://localhost:5173`.
- `pnpm build` — `tsc -b && vite build`.
- `pnpm typecheck` — solo `tsc -b`.
- `pnpm lint` / `pnpm lint:fix` — Oxlint, no ESLint.
- `pnpm preview` — previsualiza el build.

No hay test runner ni suite de pruebas configurada. No inventes comandos de test ni afirmes que pasaron pruebas que no existen.

## 3. Estructura real y responsabilidades

```text
src/
├─ main.tsx                         # createRoot + StrictMode
├─ App.tsx                          # QueryClientProvider + RouterProvider + Toaster
├─ index.css                        # Tailwind v4, tokens y tema shadcn
├─ vite-env.d.ts                    # tipado de import.meta.env
├─ routes/
│  └─ app-router.tsx                # createBrowserRouter + lazy imports
├─ layout/
│  ├─ app-layout.tsx                # header + dock + <Outlet /> + footer
│  ├─ app-header.tsx                # navegación global por áreas
│  ├─ floating-dock.tsx             # navegación contextual según el área
│  └─ navigation.ts                 # áreas, secciones, rutas e iconos
├─ components/
│  ├─ data-table/                   # DataTable reutilizable + tipos
│  ├─ data-filters/                 # filtros select, multi-select, fecha y rango
│  ├─ forms/                        # ConfigurableForm + tipos + máscaras
│  ├─ transition/
│  │  └─ PageTransition.tsx         # transición listado ↔ detalle
│  └─ ui/                           # shadcn/ui generado (Radix)
├─ pages/
│  ├─ dashboard/                    # dashboard-page.tsx + revenue-chart.tsx
│  ├─ users/                        # users-page.tsx + users-form.tsx
│  ├─ settings/
│  ├─ module-placeholder-page.tsx   # placeholder para módulos por implementar
│  └─ not-found-page.tsx
└─ services/
   ├─ base-service.ts               # Axios + helpers + getApiErrorMessage
   ├─ query-client.ts               # defaults de TanStack Query
   ├─ utils.ts                      # re-export de cn
   ├─ ui/ui.store.ts                # Zustand persist: tema, sidebar y móvil
   └─ users/                        # dominio de referencia
      ├─ user.interface.ts
      ├─ user.service.ts
      ├─ user.store.ts
      └─ user.hook.ts
```

Responsabilidades:

- `components/ui`: primitivas shadcn generadas. No las reescribas ni reformatees sin motivo; compón o envuelve.
- `components/data-table`, `components/data-filters`, `components/forms`: componentes reutilizables de tablas, filtros y formularios. Úsalos antes de crear variantes locales.
- `components/transition`: transiciones de vista reutilizables. No crear un segundo sistema.
- `layout`: estructura persistente. `AppHeader` y `FloatingDock` viven aquí; las páginas no deben recrear la navegación global.
- `pages`: pantallas y piezas específicas del dominio. Orquestan hooks, estados de UI y composición. Los módulos aún no implementados usan `ModulePlaceholderPage`.
- `services/<dominio>`: contratos y acceso a datos. `service` = HTTP/mocks; `hook` = TanStack Query, cache e invalidación; `store` = estado de UI persistido; `interface` = tipos y constantes.
- `routes`: registro de rutas y lazy loading, no lógica de negocio.

### Componentes reutilizables disponibles hoy

Inventario real de `src/components/ui`: `badge`, `button`, `card`, `chart`, `checkbox`, `form`, `input`, `label`, `select`, `separator`, `skeleton`, `sonner`, `table`.

Componentes de aplicación ya implementados:

- `DataTable`: columnas tipadas, búsqueda con debounce de 500 ms, ordenamiento, paginación local o controlada, edición/eliminación y estados.
- `DataFilters`: selector simple, multi-select, fecha y rango de fechas.
- `ConfigurableForm`: campos de texto, email, password, número, solo números, teléfono, cédula, fecha y select; incluye hints, sugerencias, errores y resaltado de campos modificados.
- `PageTransition`: listado ↔ detalle; ya se usa en Usuarios.

No existen todavía `Dialog`, `AlertDialog`, `Popover`, `DropdownMenu`, `Tooltip`, `Tabs` ni `Sheet`. Si el diseño los necesita, añádelos con `pnpm dlx shadcn@latest add <componente>` y verifica su API antes de usarlos. **No importes componentes ni inventes props que no existan.**

## 4. Arquitectura y flujo de datos

- Entrada: `main.tsx` monta `App.tsx`.
- `App.tsx` provee `QueryClientProvider`, `RouterProvider` y el `Toaster` de Sonner. El tema se aplica con la clase `dark` en `<html>` desde `useUiStore`.
- Las rutas hijas viven dentro de `AppLayout`; las páginas se cargan con `lazy: async () => ({ Component: XPage })`, por lo que **deben exportarse con export nombrado**.
- Para añadir una pantalla: crea la página, regístrala en `src/routes/app-router.tsx` con `lazy` y añade su entrada en `src/layout/navigation.ts` (área + sección del dock). Mantén las rutas en español y los nombres de archivo en inglés.
- Las rutas legadas `/dashboard`, `/users` y `/settings` redirigen a `/inicio`, `/configuracion/usuarios` y `/configuracion`.
- Flujo de datos: página → hook de dominio → service → `baseService` → API o mocks. El estado del servidor vive en TanStack Query; el estado de UI compartido, en Zustand. No dupliques datos del servidor en stores.
- Mantén la lógica de negocio fuera de los componentes: validaciones de dominio y transformaciones van en servicios, hooks, helpers o Zod; la presentación solo muestra y dispara acciones.
- Evita componentes monolíticos. Si una página supera ~200-250 líneas, extrae tabla, filtros, formulario, tarjetas o estados a archivos hermanos dentro de la misma carpeta.
- Mantén **una sola fuente de verdad** para áreas, secciones, rutas, iconos y etiquetas en `src/layout/navigation.ts`. No dupliques el mapa de navegación entre header, dock y páginas.

## 5. Convenciones de nombres y archivos

- Archivos y carpetas en `kebab-case`: `users-page.tsx`, `app-header.tsx`, `base-service.ts`.
- Rutas en español y `kebab-case`: `/inicio`, `/ventas`, `/inventario`, `/compras`, `/reportes`, `/configuracion/usuarios`.
- Dominio en plural para la carpeta y singular para el prefijo de archivos: `services/users/user.service.ts`, `pages/users/users-page.tsx`.
- Componentes en `PascalCase` con export nombrado (`export function UsersPage()`). Solo `App.tsx` usa export default.
- Excepción existente: `src/components/transition/PageTransition.tsx` usa `PascalCase` y export default. Consérvalo así mientras no se migre; no reformatees ese archivo sin motivo.
- Hooks `useX` (`useUsers`, `useCreateUser`), query keys como `userKeys`, stores `useXStore`, servicios como objeto `xService`.
- Tipos e interfaces en `*.interface.ts`, junto a constantes del dominio. No uses `enum`; usa `as const` + union (ver `USER_ROLES`).
- Imports: externos → internos con `@/` → relativos de la misma carpeta. Dentro de una carpeta usa rutas relativas; entre carpetas usa el alias.
- No hay barriles `index.ts`; importa desde el archivo concreto.
- Estilo manual del código de aplicación: comillas simples, sin punto y coma, indentación de 2 espacios y comas finales. Los archivos generados de shadcn y `PageTransition.tsx` usan otro estilo: no los reformatees.

## 6. TypeScript

- La configuración es estricta: `verbatimModuleSyntax` exige `import type` para tipos; `erasableSyntaxOnly` prohíbe `enum`, `namespace` y parameter properties; `noUnusedLocals`/`noUnusedParameters` hacen fallar el build.
- No uses `any`. Prefiere tipos concretos, `unknown` con narrowing, genéricos o Zod para datos externos.
- Tipa explícitamente las APIs públicas de services, stores y helpers; en componentes y hooks locales, deja que TypeScript infiera.
- Alias `@/*` → `./src/*` está definido en `vite.config.ts` y en los `tsconfig`. No uses rutas relativas profundas entre carpetas.
- No agregues dependencias nuevas sin revisar `package.json`: ya existen Axios, TanStack Query, Zustand, React Hook Form, Zod, Recharts, Sonner, Radix, `react-icons`, lucide y `class-variance-authority`.

## 7. Sistema visual y principios de UX

La identidad debe ser la de un SaaS de gestión comercial, no un panel administrativo genérico.

Principios obligatorios:

- Navegación global en header; navegación contextual en dock flotante. Sin sidebar fijo permanente.
- Máximo aprovechamiento del ancho y alto disponible.
- Tablas e información operativa por encima de tarjetas decorativas.
- Transiciones suaves y naturales entre listado y detalle.
- Información suficiente en contexto para reducir errores; no esconder datos clave detrás de demasiadas interacciones.
- Jerarquía visual clara, densidad controlada y consistencia entre módulos.
- Minimalismo profesional: superficies limpias, bordes suaves, sombras discretas.

Evitar:

- Sidebar administrativo genérico.
- Exceso de tarjetas, KPI decorativos o widgets.
- Sombras muy pronunciadas, gradientes innecesarios y bordes excesivamente redondeados.
- Animaciones exageradas o que retrasen la operación.
- Formularios diminutos en modales cuando necesitan contexto.
- Ocultar información importante tras múltiples clics.

### Identidad cromática (azul)

La paleta azul ya está aplicada en `src/index.css` para `:root` y `.dark`. Conserva estos tokens, evita duplicar definiciones y no introduzcas hex en componentes:

| Token | Hex | oklch aproximado | Uso |
| --- | --- | --- | --- |
| `--primary` | `#2563EB` | `oklch(0.5461 0.2152 262.88)` | Acción principal, área activa, enlaces y foco. |
| `--primary-foreground` | `#FFFFFF` | `oklch(1 0 0)` | Texto sobre primario. |
| `--primary-hover` (nuevo) | `#1D4ED8` | `oklch(0.4882 0.2172 264.38)` | Hover; exponlo como `--color-primary-hover` en `@theme inline` o usa `hover:bg-primary/80`. |
| `--secondary` / `--accent` | `#EFF6FF` | `oklch(0.9705 0.0142 254.60)` | Fondos suaves, hover y selección. |
| `--background` | `#F8FAFC` | `oklch(0.9842 0.0034 247.86)` | Fondo de la app. |
| `--card` / `--popover` | `#FFFFFF` | `oklch(1 0 0)` | Superficies. |
| `--foreground` | `#0F172A` | `oklch(0.2077 0.0398 265.75)` | Texto principal. |
| `--muted-foreground` | `#64748B` | `oklch(0.5544 0.0407 257.42)` | Texto secundario. |
| `--border` / `--input` | `#E2E8F0` | `oklch(0.9288 0.0126 255.51)` | Bordes y campos. |
| `--ring` | `#2563EB` | `oklch(0.5461 0.2152 262.88)` | Anillo de foco. |
| `--sidebar-primary` | `#1E3A8A` | `oklch(0.3791 0.1378 265.52)` | Acento oscuro de marca, si se conserva el token. |
| `--chart-1` … `--chart-5` | `#2563EB`, `#60A5FA`, `#1E3A8A`, `#93C5FD`, `#BFDBFE` | — | Escala azul para gráficas; sustituye la escala gris actual. |

Para modo oscuro, define valores propios en `.dark` manteniendo contraste AA; no reutilices los fondos claros. Mantén `--destructive` para errores y añade tokens de éxito/advertencia solo si un módulo los necesita.

El tema global es Zustand (`useUiStore`), no `next-themes`. `next-themes` solo aparece en el `sonner.tsx` generado y no hay `ThemeProvider`; no lo introduzcas como sistema de tema.

## 8. Navegación principal: Header

La navegación global vive en una cabecera compacta y sticky. Debe permitir cambiar de área sin sidebar.

Áreas principales: **Inicio, Ventas, Inventario, Compras, Reportes, Configuración**. Rutas y etiquetas en español.

| Área | Ruta | Estado |
| --- | --- | --- |
| Inicio | `/inicio` | Implementada. |
| Ventas | `/ventas` | Ruta y dock implementados; contenido placeholder. |
| Inventario | `/inventario` | Ruta y dock implementados; contenido placeholder. |
| Compras | `/compras` | Ruta y dock implementados; contenido placeholder. |
| Reportes | `/reportes` | Ruta y dock implementados; contenido placeholder. |
| Configuración | `/configuracion` | Implementada; usuarios y preferencias reales, resto placeholder. |

El header debe incluir:

- Identidad de marca (logo/nombre Vantax).
- Navegación de áreas con estado activo y `aria-current`.
- Contexto de navegación (área actual y, si aplica, breadcrumb o título de sección).
- Búsqueda global o contextual cuando exista soporte.
- Notificaciones.
- Acciones generales (por ejemplo tema claro/oscuro).
- Información del usuario, acceso a perfil y opciones de sesión.

Reglas:

- Cabecera compacta (aprox. 64-74 px; la referencia visual usa 74 px), superficie limpia, borde inferior discreto y `backdrop-blur` solo si aporta legibilidad.
- No convertir el header en una segunda barra de herramientas saturada. Las acciones secundarias van a menús o popovers.
- El header actual (`app-header.tsx`) ya incluye marca, áreas, notificaciones (placeholder), tema y acceso a configuración con usuario estático. No asumas un menú desplegable de usuario hasta implementarlo.
- Mantén una jerarquía clara: marca → áreas → contexto → acciones → usuario.

## 9. Navegación contextual: Floating Dock

Cada área principal debe tener una barra contextual flotante inspirada en el Dock de macOS. Es la navegación secundaria, no un sidebar.

Comportamiento:

- Posición flotante en el lateral izquierdo, centrada verticalmente.
- Fondo translúcido con `backdrop-blur`, borde suave y sombra discreta (glassmorphism).
- Iconos para cada sección, con estado visual de sección activa.
- Al pasar el cursor o recibir foco, se expande horizontalmente y muestra las etiquetas.
- Debe poder usarse con teclado y en pantallas táctiles.
- No debe empujar ni tapar el contenido principal de forma permanente; flota sobre un gutter reservado.
- Permanece accesible durante el scroll.
- Las animaciones deben ser cortas (~150-200 ms), con `transform`/`opacity`, y respetar `prefers-reduced-motion`.

Contenido contextual de referencia (adaptar a los módulos reales):

| Área | Secciones del dock |
| --- | --- |
| Inicio | Resumen, alertas, actividad reciente (si se añaden subsecciones). |
| Ventas | Punto de venta, historial de ventas, comprobantes, devoluciones. |
| Inventario | Productos, movimientos, existencias, alertas de stock, precios inteligentes. |
| Compras | Registrar compra, historial de compras, proveedores, entradas de mercancía. |
| Reportes | Resumen general, ventas, inventario, compras, rentabilidad, analítica predictiva. |
| Configuración | Usuarios, roles y permisos, datos comerciales, preferencias del sistema. |

Reglas:

- El contenido del dock cambia según el área activa y se deriva de la configuración única de navegación.
- La sección activa se determina por la ruta; no mantengas un estado duplicado que pueda desincronizarse.
- El dock no sustituye al header: el header cambia de área; el dock cambia de sección dentro del área.
- En escritorio, usa un ancho colapsado de ~48-64 px; al expandir, muestra etiquetas como overlay sin recalcular toda la página (la referencia visual usa botones de 43 px y expansión a ~158 px).
- En móvil, el dock se convierte en una barra inferior horizontal con scroll; los labels se ocultan y cada icono conserva `title`/`aria-label`.
- `src/layout/floating-dock.tsx` ya implementa el dock. Reutilízalo y extiéndelo; no crees otro sistema de navegación contextual.
- El dock se deriva de `navigationAreas`; si una sección no debe aparecer, no la añadas o marca su estado en la configuración, pero no dupliques listas en las páginas.

## 10. Layout y aprovechamiento del espacio (Full Workspace)

- No reserves una columna lateral permanente para navegación. El dock flotante vive sobre un gutter pequeño; el contenido usa el resto del ancho.
- El `main` debe aprovechar el viewport: padding moderado (`px-4 py-5 md:px-6 lg:px-8`) y, si se usa un ancho máximo, que sea amplio y no asfixie tablas.
- Las tablas ocupan el ancho disponible; `Table` ya incluye scroll horizontal. No las encierres en tarjetas estrechas ni en grids de dos columnas.
- Evita márgenes y separaciones excesivos. La densidad debe ser cómoda para trabajo operativo, no una landing page.
- Los formularios que necesitan contexto no van en modales pequeños: usa una vista secundaria o un panel amplio con la información del registro visible.
- Las tarjetas se reservan para agrupaciones con propósito (resumen, detalle, estado). No envuelvas cada bloque en una card.
- En páginas de listado, el encabezado de página y las acciones deben ocupar una sola fila cuando el espacio lo permita.
- Responsive: el contenido es mobile-first, pero la prioridad es que tablas y formularios sigan siendo operables; usa scroll horizontal, columnas ocultables y acciones compactas antes que reducir todo a tarjetas ilegibles.
- `AppLayout` ya implementa header + dock + contenido full-width. No reintroduzcas un sidebar ni añadas offsets laterales permanentes.
- En móvil, `main` reserva padding inferior para el dock; el footer también evita quedar tapado.

## 11. Transiciones entre vistas: `PageTransition`

El único sistema de transición existente es `src/components/transition/PageTransition.tsx`. **No existe un componente llamado `Transition`; no inventes uno ni crees un segundo sistema.** Ya está integrado en Usuarios para pasar del listado al detalle/edición y volver conservando el estado del listado.

API real:

```tsx
interface PageTransitionComponentProps {
  toggle: boolean
  children: [ReactNode, ReactNode]
}

export default function PageTransitionComponent({ children, toggle }: PageTransitionComponentProps)
```

Uso:

```tsx
import PageTransition from '@/components/transition/PageTransition'

<PageTransition toggle={isDetailOpen}>
  <ListView />
  <DetailView />
</PageTransition>
```

Comportamiento verificado:

- `toggle = false` muestra la vista principal (primer hijo); `toggle = true` muestra la vista secundaria (segundo hijo).
- El contenedor interno mide `200%` y cada vista ocupa el `100%` del ancho visible; el cambio se hace con `translate-x` y `transition-transform duration-500 ease-in-out`.
- Ambas vistas permanecen montadas: la principal tiene `overflow-auto`; la secundaria, `overflow-hidden` y debe gestionar su propio scroll.
- Al montar, un efecto con `requestAnimationFrame` fuerza un rerender de layout para estabilizar el ancho. No lo elimines sin probar el comportamiento visual.
- En desarrollo advierte si no recibe exactamente 2 hijos.
- El contenedor padre debe tener altura disponible (`h-full`, `min-h-0` o equivalente); de lo contrario la transición no ocupa la pantalla.
- No usa librerías de animación y no gestiona rutas, URL, historial, foco ni estado. Eso lo controla quien lo consume.

Reglas de uso:

- Úsalo para listado/tabla ↔ detalle/edición/ampliación, no para cada cambio menor de UI.
- Controla `toggle` desde la página o desde rutas anidadas; no dupliques el estado en varios componentes.
- Conserva filtros, búsqueda, ordenamiento y página al abrir/cerrar la vista secundaria. Usa el store del dominio o search params; no reinicies el estado al montar el detalle.
- La vista secundaria debe aprovechar casi toda la pantalla y mantener visible el contexto del registro.
- Gestiona el foco y el retorno con teclado al abrir/cerrar; añade `aria` y un botón de volver explícito.
- En móvil, la transición sigue funcionando porque cada vista ocupa el ancho completo; verifica que el detalle no quede cortado y que el scroll sea independiente.
- No agregues Framer Motion ni otra librería de transiciones sin justificación técnica y aprobación.
- Si `PageTransition` no cubre un caso (por ejemplo salida/entrada con desmontaje), primero evalúa extenderlo; no crees un sistema alternativo.
- No copies el overlay ni el CSS de los prototipos HTML de referencia: implementa la vista con React, shadcn/ui y `PageTransition`.

## 12. Tablas, filtros y popovers

Las tablas son el elemento principal de la aplicación y deben tener prioridad visual frente a tarjetas decorativas. Usa `DataTable` de `src/components/data-table` y `DataFilters` de `src/components/data-filters` en lugar de crear tablas o barras de filtros locales.

`DataTable` ya resuelve búsqueda con debounce de 500 ms, ordenamiento local o controlado, paginación local o controlada, edición/eliminación, estados de carga/error/vacío y scroll horizontal. `DataFilters` soporta selector simple, multi-select, fecha y rango de fechas.

Patrones obligatorios:

- Búsqueda visible y con debounce cuando la consulta sea remota.
- Filtros relevantes (estado, fecha, categoría, proveedor, rol) sin saturar la barra.
- Ordenamiento por columnas clave, con indicador visual.
- Paginación cuando el volumen lo requiera; no cargues todo el historial.
- Acciones por fila: una acción principal visible y las secundarias agrupadas en un menú/popover.
- Acciones masivas si el caso lo justifica, con resumen de seleccionados.
- Estados de carga (`Skeleton`), error con reintento y vacío con mensaje útil.
- Columnas secundarias ocultables en móvil (`hidden md:table-cell`), sin perder la información esencial.
- Scroll horizontal cuando haya muchas columnas; nunca comprimas texto hasta hacerlo ilegible.

Popovers:

- Úsalos para información complementaria sin abandonar la vista: resumen de indicadores, filtros activos, resumen de selección, detalles de una operación, acciones secundarias.
- Deben tener un propósito claro y cierre evidente.
- No sustituyen formularios ni vistas de detalle que necesiten espacio o contexto.
- `Popover` aún no está instalado; añádelo con shadcn cuando se necesite y verifica su API. El multi-select de `DataFilters` usa un panel propio, no un Popover.
- Para menús de acciones, evalúa `DropdownMenu`; tampoco existe todavía.

## 13. Vistas de detalle y edición contextual

El principio clave es mantener visible la información del registro que se está manipulando. No presentes formularios aislados que oculten el contexto.

Al editar un producto, la vista debe mostrar:

1. Información general.
2. Categoría, código y estado.
3. Existencias y costos.
4. Precio de venta vigente.
5. Precio recomendado por analítica predictiva, cuando exista.
6. Campos editables claramente diferenciados de los datos de solo lectura.
7. Resaltado visual de los campos modificados.
8. Comparación entre valor original y nuevo.
9. Acciones de guardar y descartar cambios.

Reglas:

- Aplica el mismo principio a clientes, productos, compras, ventas, usuarios y configuración.
- La vista secundaria debe ocupar el espacio necesario; usa `PageTransition` en lugar de un modal pequeño.
- Muestra un indicador de “cambios sin guardar” y evita perderlos por navegación accidental.
- Los campos editables usan los componentes de formulario existentes; los datos de contexto pueden ser solo lectura.
- El resaltado de cambios debe usar tokens (`bg-primary/5`, `border-primary`, `text-primary`), no colores crudos.
- En compras, muestra producto, cantidad, costo unitario, costo total, fecha y proveedor; el costo total puede mostrarse como confirmación, pero el backend lo valida.
- En productos e inventario, muestra costo, precio vigente, precio recomendado, margen y estado del análisis cuando la API los provea.
- La vista de Usuarios ya usa `PageTransition` y muestra el contexto del usuario seleccionado antes del formulario; el formulario se construye con `ConfigurableForm` y resalta los campos modificados en edición. Úsala como referencia.

## 14. Integración con módulos y analítica predictiva

La analítica se integra visualmente donde se necesita consultar, no como un módulo CRUD aislado.

| Pantalla | Información de analítica |
| --- | --- |
| Productos | Precio actual, costo de adquisición, precio recomendado, margen y estado. |
| Compras | Nueva adquisición y activación del análisis automático. |
| Inventario | Variación de costos, existencias y alertas. |
| Dashboard | Estado de las ejecuciones y evolución de precios. |
| Reportes | Análisis histórico, rentabilidad y resultados por producto. |

### Activación por evento

Al registrar y confirmar una entrada de mercancía, el sistema recibe producto, cantidad adquirida, precio de compra unitario, costo total, fecha de adquisición y proveedor. Esa información actualiza inventario y conserva el historial de costos; después se activa la analítica para los productos afectados.

El proceso considera costos actuales, historial de compras y costos, historial de ventas, existencias, historial de precios, variables del modelo, margen y reglas comerciales. El resultado es una recomendación de precio que puede actualizar el precio vigente si cumple las reglas.

Responsabilidad del frontend:

- Enviar el payload validado al endpoint de compras/entrada de mercancía.
- Tras confirmar, invalidar las queries de inventario, productos, costos, recomendaciones, dashboard y reportes afectados.
- Mostrar estado de procesamiento, errores y la recomendación resultante cuando el backend la exponga.
- No calcular el precio recomendado ni duplicar reglas de margen.

### Activación programada

Debe existir una ejecución automática diaria en el backend para revisar productos y detectar cambios que justifiquen recalcular precios. El frontend solo muestra estados, resultados, fechas de ejecución, recomendaciones y precios actualizados. No implementes cron, timers ni cálculos de modelo en React.

### UI de recomendaciones

- Precio vigente vs. recomendado, variación y margen cuando la API los provea.
- Estado del análisis (pendiente, procesando, aplicado, descartado) con badges.
- Última y próxima ejecución si el endpoint las expone.
- Filtros por producto, estado y fecha; tabla con estados de carga/error/vacío.
- Acciones de aprobar/aplicar solo si el backend las soporta. No inventes campos ni endpoints; ajusta los tipos a la respuesta real.

## 15. Servicios, API y estado del servidor

- `src/services/base-service.ts` crea Axios con `VITE_API_URL` (fallback `http://localhost:3000/api`), timeout de 15 s y `Content-Type: application/json`. Adjunta `Authorization: Bearer <token>` leyendo `localStorage.vantax_token`.
- `baseService.get/post/put/delete` ya devuelven `response.data`; los services deben devolver tipos de dominio, no respuestas Axios.
- Centraliza los errores con `getApiErrorMessage(error)`, que normaliza mensajes de NestJS, timeouts y fallos de conexión.
- Variables de entorno: `VITE_API_URL` y `VITE_USE_MOCKS`. Al añadir una variable, actualiza `.env.example` y `src/vite-env.d.ts`.
- Los mocks se implementan dentro de cada service con `import.meta.env.VITE_USE_MOCKS === 'true'` y un delay simulado; no hay MSW. Sigue el patrón de `user.service.ts` y no mezcles datos mock en componentes.
- Los hooks de TanStack Query definen query keys, `enabled`, invalidación y toasts. Tras una mutación, invalida las keys afectadas. No llames a Axios desde componentes.
- `query-client.ts`: `staleTime` 30 s, `retry: 1`, sin refetch al enfocar y mutaciones sin retry.
- `DataTable` aplica un debounce de 500 ms a la búsqueda antes de llamar a `onSearchChange`; no añadas otro debounce en la página ni dispares una query por pulsación. La key de TanStack Query debe seguir incluyendo el término de búsqueda.
- No hay login ni flujo de autenticación en el frontend: solo se lee un token existente. Si implementas sesión, centraliza el guardado/limpieza del token y la redirección.
- Si una pantalla usa `PageTransition`, la query del listado y la del detalle deben coexistir sin duplicar datos ni provocar refetch innecesario; reutiliza la cache y las query keys del dominio.

## 16. Estado, formularios y validación

- Estado del servidor: TanStack Query. Estado global de UI: Zustand + `persist`. Estado efímero de pantalla: `useState`. No introduzcas Redux ni Context para datos remotos.
- Cada dominio tiene su store solo si necesita estado compartido entre pantallas; no persistas datos que pertenecen al servidor.
- Conserva filtros, búsqueda, ordenamiento, página y selección al entrar/salir de una vista de detalle. Usa el store del dominio, el estado de la página o search params; no los guardes solo en un componente que se desmonta.
- Formularios: schema Zod en el archivo del formulario, `zodResolver`, validaciones condicionales con `superRefine` cuando dependan del modo edición, y `ConfigurableForm` para renderizar campos. Usa `Form*` directamente solo para casos que el formulario configurable no cubra.
- `DataFilters` es controlado: mantén `values` y `onChange` en la página y traduce esos valores al filtrado o a los parámetros de la query.
- Normaliza el payload al enviar (por ejemplo `trim()`); no envíes campos vacíos opcionales. En edición, omite la contraseña si no se cambió.
- Las mutaciones cierran/resetean el formulario en `onSuccess` y los errores se muestran con toast usando `getApiErrorMessage`.
- Para acciones destructivas, el patrón actual es `window.confirm`; si introduces `AlertDialog`, aplícalo de forma consistente en todos los módulos.
- Usa las constantes del dominio (`USER_ROLES`, `USER_ROLE_LABELS`) en selects y badges; no dupliques listas de roles.
- En formularios contextuales, muestra el registro original junto a los campos y resalta los cambios. No ocultes la información de contexto al editar.

## 17. Reglas de implementación

Antes de modificar la arquitectura o añadir una pantalla:

1. Inspecciona `src/components/transition/PageTransition.tsx`.
2. Revisa el inventario real de `src/components/ui` y sus props.
3. Revisa `src/layout/app-layout.tsx`, `app-header.tsx`, `floating-dock.tsx` y `navigation.ts`.
4. Identifica cómo se manejan rutas, estados, stores y queries del dominio.
5. Revisa los tokens de `src/index.css`.
6. Determina qué se puede reutilizar antes de crear algo nuevo.

Reglas:

- Reutiliza componentes, hooks, tipos y patrones existentes antes de crear nuevos.
- Respeta la estructura y los nombres actuales; no introduzcas una arquitectura paralela.
- No reintroduzcas un sidebar ni una navegación lateral permanente: el sistema es header + dock.
- No crees un segundo sistema de navegación, transición, tema, tablas, filtros o formularios. Reutiliza `DataTable`, `DataFilters`, `ConfigurableForm` y `PageTransition`.
- No dupliques las listas de áreas o secciones: edita `src/layout/navigation.ts`.
- Mantén la lógica de negocio y las llamadas HTTP fuera de los componentes de presentación.
- Centraliza tipos reutilizables en `*.interface.ts` y evita duplicar contratos entre módulos.
- No dupliques estilos, tablas, formularios, estados de carga/error ni lógica de toasts.
- Usa shadcn/ui y los tokens del tema; no agregues CSS global ni utilidades nuevas sin necesidad.
- No agregues dependencias si una existente resuelve el problema. Revisa `package.json` primero.
- No uses `react-router-dom`: este proyecto importa de `react-router` (v8).
- No crees `tailwind.config.*`: Tailwind v4 se configura en `src/index.css`.
- No edites `dist/` (es salida de build) ni `node_modules`.
- No inventes componentes, props, rutas ni endpoints. Verifica el archivo o el contrato real.
- No implementes funcionalidades de módulos aún no solicitadas; esta guía describe el destino, no una orden de construirlos.
- Mantén consistencia entre módulos: misma estructura de página, mismos patrones de tabla/formulario/estado y mismo tono en español.
- Respeta `prefers-reduced-motion` y evita animaciones que interfieran con la operación.
- Toda la interfaz debe usar español como idioma predeterminado.

## 18. Verificación después de cambios

1. Ejecuta `pnpm lint && pnpm typecheck`. Ambos deben pasar sin errores ni warnings nuevos.
2. Si tocaste rutas, lazy loading, variables de entorno, configuración de Vite/Tailwind o el bundle, ejecuta también `pnpm build`.
3. Levanta `pnpm dev` y prueba el flujo afectado: navegación, formulario, mutación, estados de carga/error/vacío, tema claro/oscuro y responsive.
4. Verifica el sistema visual: header compacto, área activa, dock contextual, expansión al hover/foco, navegación por teclado, legibilidad del glassmorphism y adaptación móvil.
5. Verifica rutas en español: `/inicio`, `/ventas`, `/inventario`, `/compras`, `/reportes` y `/configuracion`; las rutas legadas deben redirigir.
6. Verifica tablas: `DataTable` con ancho completo, scroll horizontal, búsqueda debounced, filtros, ordenamiento, paginación y acciones por fila.
7. Verifica `DataFilters`: selector simple, multi-select, fecha y rango; que el botón de limpiar restablezca el estado.
8. Verifica `ConfigurableForm`: hints, sugerencias, errores, campos numéricos/máscaras y resaltado de campos modificados.
9. Verifica `PageTransition`: que cada vista ocupe el ancho completo, que el scroll sea correcto, que se conserven filtros/búsqueda/orden/página y que se pueda volver al listado.
10. Verifica formularios contextuales: información original visible, campos modificados resaltados, comparación y acciones guardar/descartar.
11. Revisa la consola del navegador y que no queden imports sin usar (el build falla por `noUnusedLocals`/`noUnusedParameters`).
12. Si cambió un contrato de API o una variable de entorno, actualiza `README.md` y `.env.example` en el mismo cambio.
13. No afirmes que hay tests: no existe suite configurada.
