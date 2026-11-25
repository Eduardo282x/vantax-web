# Vantax

Frontend de Vantax: SPA de gestión comercial y ventas (POS) con analítica predictiva para la optimización dinámica de precios.

Construido con React, Vite y una arquitectura modular por dominios. La navegación global vive en una cabecera y cada área tiene una navegación contextual en un dock flotante. No se utiliza un sidebar administrativo fijo.

> Guía completa y obligatoria para agentes de IA: [`AGENTS.md`](./AGENTS.md).

## Stack

| Herramienta | Uso |
| --- | --- |
| Vite 8 + React 19 + TypeScript 7 | Base del proyecto |
| `@vitejs/plugin-react-swc` | Transformación de React con SWC |
| Oxlint | Linter (sin ESLint) |
| Tailwind CSS v4 + `@tailwindcss/vite` | Estilos CSS-first, sin `tailwind.config` |
| shadcn/ui (Radix, preset Nova) | Componentes base |
| Recharts + shadcn Chart | Gráficas |
| React Router v8 | Rutas SPA (`react-router`, no `react-router-dom`) |
| TanStack Query | Estado del servidor y caché |
| Axios | Cliente HTTP |
| Zustand + persist | Tema y estado de UI |
| React Hook Form + Zod | Formularios y validación |
| react-icons / lucide | Iconografía |
| Sonner | Notificaciones |

## Requisitos

- Node.js 24+
- pnpm 11+

## Instalación y scripts

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

```bash
pnpm dev        # servidor de desarrollo
pnpm build      # typecheck + build de producción
pnpm preview    # previsualizar el build
pnpm lint       # Oxlint
pnpm lint:fix   # Oxlint con corrección automática
pnpm typecheck  # solo TypeScript
```

No hay test runner ni suite de pruebas configurada. No se deben inventar comandos de test.

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=true
```

- `VITE_API_URL`: URL base de la API NestJS, incluyendo el prefijo `/api`.
- `VITE_USE_MOCKS`: con `true`, los servicios con datos demo usan mocks locales. Con `false`, llaman a la API real.

Al añadir una variable nueva, actualiza también `src/vite-env.d.ts`.

## Estado actual

| Área / módulo | Estado |
| --- | --- |
| Inicio / dashboard | Implementado con datos estáticos e incluye la tasa del dólar. Alertas y actividad usan placeholder. |
| Usuarios | Implementado con CRUD sobre mocks, tabla, filtros, paginación local y edición contextual. Roles y permisos con placeholder. |
| Clientes | Ruta y dock listos; pantalla con placeholder. |
| Productos | Ruta y dock listos; catálogo, categorías y optimización de precios con placeholder. |
| Inventario | Ruta y dock listos; existencias, movimientos y alertas con placeholder. |
| Compras | Ruta y dock listos; registrar compra, historial, proveedores y entradas con placeholder. |
| Ventas | Página base con tasa del dólar; punto de venta, historial, comprobantes y devoluciones con placeholder. |
| Reportes | Ruta y dock listos; resumen, ventas, inventario, compras, rentabilidad y analítica predictiva con placeholder. |
| Analítica predictiva | Módulo interno bajo Reportes; cálculo responsabilidad del backend. |
| Optimización dinámica de precios | Módulo interno bajo Productos; cálculo responsabilidad del backend. |
| Configuración | Preferencias implementadas; datos comerciales con placeholder. |

El backend vive en el repo hermano `../vantax-api`. A la fecha de esta documentación, sus controladores de usuarios, productos, ventas, dashboard y precios son stubs; el endpoint de tasa de cambio aún no está expuesto. Por eso el modo mock es el valor de trabajo por defecto.

## Navegación y rutas

La cabecera agrupa las áreas principales. El dock flotante cambia según el área activa.

| Área | Ruta | Secciones del dock |
| --- | --- | --- |
| Inicio | `/inicio` | Resumen, alertas, actividad |
| Usuarios | `/usuarios` | Usuarios, roles y permisos |
| Clientes | `/clientes` | Clientes |
| Productos | `/productos` | Productos, categorías, optimización de precios |
| Inventario | `/inventario` | Existencias, movimientos, alertas de stock |
| Compras | `/compras` | Registrar compra, historial, proveedores, entradas de mercancía |
| Ventas | `/ventas` | Punto de venta, historial, comprobantes, devoluciones |
| Reportes | `/reportes` | Resumen general, ventas, inventario, compras, rentabilidad, analítica predictiva |
| Configuración | `/configuracion` | Preferencias, datos comerciales |

La analítica predictiva se consulta desde Reportes y la optimización dinámica de precios desde Productos. No son módulos CRUD aislados: se integran en los flujos de productos, inventario, compras, ventas y reportes.

Rutas legadas con redirección:

- `/dashboard` → `/inicio`
- `/users` → `/usuarios`
- `/configuracion/usuarios` → `/usuarios`
- `/configuracion/roles` → `/usuarios/roles`
- `/settings` → `/configuracion`

La configuración de áreas, secciones, rutas e iconos está centralizada en `src/layout/navigation.ts`. No dupliques esa lista en header, dock o páginas.

## Sistema visual

Principios:

- Interfaz modular, contextual, expansiva y centrada en el contenido.
- Header global + dock contextual; sin sidebar fijo.
- Tablas e información operativa por encima de tarjetas decorativas.
- Transiciones suaves entre listado y detalle.
- Minimalismo profesional: menos tarjetas, sombras discretas, sin gradientes innecesarios.
- Todo el texto visible al usuario en español.

Paleta principal:

| Token | Hex | Uso |
| --- | --- | --- |
| `--primary` | `#2563EB` | Acción principal, área activa, foco |
| `--primary-hover` | `#1D4ED8` | Hover de acciones principales |
| `--secondary` / `--accent` | `#EFF6FF` | Fondos suaves y selección |
| `--background` | `#F8FAFC` | Fondo de la aplicación |
| `--card` / `--popover` | `#FFFFFF` | Superficies |
| `--foreground` | `#0F172A` | Texto principal |
| `--muted-foreground` | `#64748B` | Texto secundario |
| `--border` / `--input` | `#E2E8F0` | Bordes y campos |
| `--sidebar-primary` | `#1E3A8A` | Acento azul oscuro de marca |

Los tokens se definen en `src/index.css` para `:root` y `.dark`. Usa clases semánticas (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`) y `var(--chart-N)` en gráficas; no escribas colores hex directamente en JSX.

El tema se persiste con Zustand (`useUiStore`) y se aplica con la clase `dark` en `<html>`.

## Estructura

```text
src/
├─ main.tsx
├─ App.tsx
├─ index.css
├─ vite-env.d.ts
├─ routes/
│  └─ app-router.tsx
├─ layout/
│  ├─ app-layout.tsx
│  ├─ app-header.tsx
│  ├─ floating-dock.tsx
│  └─ navigation.ts
├─ components/
│  ├─ data-table/              # DataTable + tipos
│  ├─ data-filters/            # DataFilters + tipos
│  ├─ dollar-rate/             # tasa del dólar (header y tarjeta)
│  ├─ forms/                   # ConfigurableForm + tipos + máscaras
│  ├─ transition/
│  │  └─ PageTransition.tsx
│  └─ ui/                      # shadcn/ui generado
├─ pages/
│  ├─ dashboard/
│  ├─ sales/
│  ├─ users/
│  ├─ settings/
│  ├─ module-placeholder-page.tsx
│  └─ not-found-page.tsx
└─ services/
   ├─ base-service.ts
   ├─ query-client.ts
   ├─ utils.ts
   ├─ exchange-rate/           # tasa del dólar: interface, service y hook
   ├─ ui/ui.store.ts
   └─ users/
      ├─ user.interface.ts
      ├─ user.service.ts
      ├─ user.store.ts
      └─ user.hook.ts
```

Responsabilidades:

- `layout`: navegación global, dock contextual y shell de la aplicación.
- `pages`: pantallas y composición por dominio.
- `services/<dominio>`: tipos, acceso a datos, hooks de TanStack Query y estado de UI.
- `components/ui`: primitivas shadcn generadas; no reescribir sin motivo.
- `components/data-table`, `components/data-filters`, `components/forms`: componentes de aplicación reutilizables.
- `components/dollar-rate`: tasa del dólar en variantes `header` y `card`.
- `routes`: registro de rutas con lazy loading.

## Patrón para nuevos módulos

Cada dominio vive en `src/services/<modulo>` y sus pantallas en `src/pages/<modulo>`:

```text
src/services/products/
├─ product.interface.ts
├─ product.service.ts
├─ product.store.ts
└─ product.hook.ts

src/pages/products/
├─ products-page.tsx
└─ products-form.tsx
```

- `*.service.ts` usa `baseService` y expone operaciones tipadas.
- `*.hook.ts` envuelve el servicio con `useQuery` / `useMutation`, define query keys e invalida caché.
- `*.store.ts` guarda estado de UI del módulo con Zustand y `persist`.
- `*.interface.ts` define tipos y constantes del dominio.

Para añadir una pantalla: crea la página, regístrala con `lazy` en `src/routes/app-router.tsx` y añade su entrada en `src/layout/navigation.ts`.

## Componentes reutilizables

### `DataTable`

Ubicación: `src/components/data-table`.

Incluye búsqueda con debounce de 500 ms, ordenamiento local o controlado, paginación local o controlada, acciones de edición/eliminación y estados de carga, error y vacío.

```tsx
<DataTable
  data={users}
  columns={columns}
  getRowId={(user) => user.id}
  getRowLabel={(user) => user.name}
  initialSearch={search}
  onSearchChange={setSearch}
  searchPlaceholder="Buscar usuarios..."
  onEdit={handleEdit}
  onDelete={handleDelete}
  isLoading={isLoading}
  error={errorMessage}
  onRetry={() => void refetch()}
  emptyMessage="Sin resultados"
/>
```

Props principales:

- `data`, `columns`, `getRowId`, `getRowLabel`.
- `initialSearch`, `searchPlaceholder`, `searchDebounceMs` (500 por defecto), `onSearchChange`.
- `sorting`, `onSortingChange` para ordenamiento controlado; si se omiten, ordena localmente.
- `pagination` con `page`, `pageSize`, `total`, `onPageChange`, `onPageSizeChange`; si se omite, pagina localmente.
- `onEdit`, `onDelete`, `actionsDisabled`.
- `isLoading`, `error`, `onRetry`, `emptyMessage`.

Cada columna define `id`, `header`, `accessorKey`, `cell`, `sortValue`, `sortable`, `align`, `className`, `headerClassName` y `hideOnMobile`.

### `DataFilters`

Ubicación: `src/components/data-filters`.

Soporta selector simple, multi-select, fecha y rango de fechas. Es un componente controlado.

```tsx
<DataFilters
  filters={[
    {
      id: 'roles',
      label: 'Rol',
      type: 'multi-select',
      options: [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Cajero', value: 'CAJERO' },
      ],
    },
    {
      id: 'createdAt',
      label: 'Fecha de creación',
      type: 'date-range',
    },
  ]}
  values={filterValues}
  onChange={setFilterValues}
/>
```

Tipos de filtro: `select`, `multi-select`, `date`, `date-range`. Los valores se guardan en un `Record<string, FilterValue>` y la página los traduce a filtrado local o parámetros de consulta.

### `ConfigurableForm`

Ubicación: `src/components/forms`.

Renderiza campos configurables sobre React Hook Form y los componentes `Form*` de shadcn, con hints, sugerencias, mensajes de error y resaltado de campos modificados.

Tipos de campo: `text`, `email`, `password`, `number`, `only-numbers`, `phone`, `cedula`, `date`, `select`.

```tsx
<ConfigurableForm
  form={form}
  fields={[
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ana',
      required: true,
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'phone',
      hint: 'Formato 0412-1234567',
    },
    {
      name: 'roles',
      label: 'Rol',
      type: 'select',
      options: roleOptions,
      required: true,
    },
  ]}
  onSubmit={handleSubmit}
  submitLabel="Guardar cambios"
  onCancel={handleCancel}
  columns={2}
  highlightDirty
/>
```

El consumidor crea el formulario con `useForm`, `zodResolver` y su schema Zod. Los campos soportan `placeholder`, `description`, `hint`, `suggestions`, `options`, `min`, `max`, `step`, `maxLength`, `disabled`, `autoComplete`, `required`, `fullWidth` y `className`.

### `PageTransition`

Ubicación: `src/components/transition/PageTransition.tsx`.

Transición entre listado y detalle/edición. No crear un segundo sistema de transiciones.

```tsx
<PageTransition toggle={isDetailOpen}>
  <ListView />
  <DetailView />
</PageTransition>
```

- `toggle`: `false` muestra la vista principal; `true`, la secundaria.
- `children`: exactamente dos hijos `[ReactNode, ReactNode]`.
- Ambas vistas permanecen montadas; la principal gestiona su scroll y la secundaria debe gestionar el suyo.
- El contenedor padre debe tener altura disponible.
- La vista de Usuarios es la referencia de uso.

### `DollarRate`

Ubicación: `src/components/dollar-rate`.

Muestra la tasa oficial del dólar con dos variantes:

- `header`: indicador compacto siempre visible en la cabecera.
- `card`: tarjeta con fuente, variación, fecha de actualización y acción de refresco.

```tsx
<DollarRate variant="header" />
<DollarRate variant="card" className="w-full lg:w-72" />
```

La tarjeta se usa en `/inicio` y en la página base de `/ventas`. El dato se comparte mediante `useDollarRate` y TanStack Query, con `staleTime` y refresco cada 5 minutos.

El servicio `src/services/exchange-rate` usa datos mock cuando `VITE_USE_MOCKS=true`. El endpoint real (`GET /exchange-rate/current`) aún no está implementado en `vantax-api`; no desactives mocks sin verificar el backend.

## Integración con la API

`src/services/base-service.ts` crea una instancia de Axios con:

- `baseURL` desde `VITE_API_URL`, con fallback a `http://localhost:3000/api`.
- Cabecera `Authorization: Bearer <token>` si existe `vantax_token` en `localStorage`.
- Timeout de 15 s y helpers `get`, `post`, `put`, `delete`.
- `getApiErrorMessage` para normalizar errores de NestJS, timeouts y fallos de conexión.

Los servicios con datos demo implementan mocks internos con `VITE_USE_MOCKS`. No mezcles datos mock en componentes ni llames a Axios directamente desde una página: usa un hook de dominio.

`query-client.ts` configura TanStack Query con `staleTime` de 30 s, `retry: 1`, sin refetch al enfocar y mutaciones sin retry.

## Estado, tablas y formularios

- Estado del servidor: TanStack Query.
- Estado global de UI: Zustand + `persist` (`vantax-ui`, `vantax-users`).
- Estado efímero: `useState`.
- Tablas: `DataTable` con búsqueda debounced, filtros, ordenamiento, paginación y acciones.
- Filtros: `DataFilters` controlado.
- Formularios: React Hook Form + Zod + `ConfigurableForm`.
- Tasa del dólar: `DollarRate` + `useDollarRate`, con caché compartida entre header, inicio y ventas.
- Edición contextual: muestra el registro original, resalta campos modificados y permite guardar o descartar.
- Acciones destructivas: confirmación explícita; el patrón actual es `window.confirm`.

## Analítica predictiva

La analítica es transversal y no se calcula en React. El frontend captura datos, dispara procesos del backend y visualiza resultados. La analítica predictiva se consulta en `/reportes/analitica`; la optimización dinámica de precios, en `/productos/precios`.

Activación por evento: al registrar y confirmar una entrada de mercancía se envían producto, cantidad, precio de compra unitario, costo total, fecha y proveedor. El backend actualiza inventario, conserva el historial de costos y calcula la recomendación de precio considerando costos, compras, ventas, existencias, historial de precios, margen y reglas comerciales.

Activación programada: el backend ejecuta una revisión diaria. El frontend solo muestra estados, fechas de ejecución, recomendaciones y precios actualizados.

Después de confirmar una compra, invalida las queries afectadas de inventario, productos, costos, recomendaciones, dashboard y reportes. No dupliques reglas de margen ni cálculos de precio en el cliente.

## Convenciones

- Archivos y carpetas en `kebab-case`; componentes en `PascalCase` con export nombrado.
- Rutas en español y `kebab-case`.
- Dominio en plural para la carpeta y singular para el prefijo de archivo: `services/users/user.service.ts`.
- Tipos e interfaces en `*.interface.ts`; no uses `enum`, usa `as const` + union.
- `verbatimModuleSyntax`: usa `import type` para tipos.
- `erasableSyntaxOnly`: sin `enum`, `namespace` ni parameter properties.
- `noUnusedLocals` / `noUnusedParameters`: el build falla con imports o variables sin usar.
- Alias `@/*` → `./src/*`.
- `cn` se importa de `@/services/utils` en código de aplicación.
- Tailwind v4 se configura en `src/index.css`; no crear `tailwind.config.*`.
- No usar `react-router-dom`; importar de `react-router`.
- No editar `dist/` ni `node_modules`.
- No agregar dependencias sin revisar primero las existentes.

## Verificación

1. Ejecuta `pnpm lint && pnpm typecheck`.
2. Si cambiaste rutas, lazy loading, variables de entorno, Vite, Tailwind o el bundle, ejecuta `pnpm build`.
3. Prueba en `pnpm dev`: navegación header/dock, rutas en español, responsive, tema claro/oscuro, tablas, filtros, formularios y `PageTransition`.
4. Verifica que la búsqueda espere 500 ms, que los filtros se limpien correctamente y que la edición conserve el contexto del listado.
5. Verifica `DollarRate` en header, `/inicio` y `/ventas`: tasa, fuente, variación, fecha, carga y error.
6. Revisa la consola del navegador y que no queden imports sin usar.
7. Si cambió un contrato de API o una variable de entorno, actualiza `README.md` y `.env.example`.

No afirmes que hay tests: no existe suite configurada.
