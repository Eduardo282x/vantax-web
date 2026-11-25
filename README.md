# Vantax

Frontend de Vantax: panel de gestión comercial construido con React, Vite y una arquitectura modular por dominios.

## Stack

| Herramienta | Uso |
| --- | --- |
| Vite 8 + React 19 + TypeScript 7 | Base del proyecto |
| `@vitejs/plugin-react-swc` | Transformación de React con SWC |
| Oxlint | Linter (sin ESLint) |
| Tailwind CSS v4 + `@tailwindcss/vite` | Estilos |
| shadcn/ui (base Radix, preset Nova) | Componentes |
| Recharts + shadcn Chart | Gráficas |
| React Router | Rutas SPA |
| TanStack Query | Estado del servidor / caché |
| Axios | Cliente HTTP |
| Zustand + persist | Estado global |
| React Hook Form + Zod | Formularios y validación |
| react-icons | Iconografía |
| Sonner | Notificaciones |

## Requisitos

- Node.js 24+
- pnpm 11+

## Instalación

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts

```bash
pnpm dev        # servidor de desarrollo
pnpm build      # typecheck + build de producción
pnpm preview    # previsualizar el build
pnpm lint       # Oxlint
pnpm lint:fix   # Oxlint con corrección automática
pnpm typecheck  # solo TypeScript
```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=true
```

- `VITE_API_URL`: URL base de la API NestJS (incluye el prefijo `/api`).
- `VITE_USE_MOCKS`: con `true` el módulo de usuarios usa datos locales de ejemplo. Con `false` llama a `GET /users`, `POST /users`, etc. contra la API.

## Estructura

```text
src/
├─ components/
│  └─ ui/                     # componentes generados por shadcn
├─ layout/                    # AppLayout, sidebar, header y navegación
├─ pages/
│  ├─ dashboard/              # dashboard-page + revenue-chart
│  ├─ users/                  # users-page + users-form
│  ├─ settings/               # settings-page
│  └─ not-found-page.tsx
├─ routes/                    # router de React Router
├─ services/
│  ├─ base-service.ts         # instancia Axios + get/post/put/delete
│  ├─ query-client.ts         # configuración de TanStack Query
│  ├─ utils.ts                # utilidades compartidas (cn)
│  ├─ ui/
│  │  └─ ui.store.ts          # Zustand persist: tema y sidebar
│  └─ users/
│     ├─ user.interface.ts    # tipos del dominio
│     ├─ user.service.ts      # llamadas HTTP / mocks
│     ├─ user.store.ts        # estado del módulo (búsqueda, selección)
│     └─ user.hook.ts         # hooks de TanStack Query
├─ App.tsx
├─ main.tsx
└─ index.css
```

## Patrón para nuevos módulos

Cada dominio vive dentro de `src/services/<modulo>` y sus pantallas en `src/pages/<modulo>`:

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
- `*.hook.ts` envuelve el servicio con `useQuery` / `useMutation` y maneja el cacheo.
- `*.store.ts` guarda estado local del módulo con Zustand y `persist`.
- `*.interface.ts` define tipos y constantes del dominio.

## shadcn/ui

Añadir un componente:

```bash
pnpm dlx shadcn@latest add <componente>
```

La configuración está en `components.json` y el alias `@/services/utils` reemplaza al clásico `@/lib/utils`.

## Estilos y tema

- Tailwind v4 se carga con `@import "tailwindcss";` en `src/index.css`.
- El tema (variables CSS) lo genera shadcn.
- El modo oscuro se activa con la clase `dark` en `<html>` desde `App.tsx` y se persiste con Zustand.

## Integración con la API

`src/services/base-service.ts` crea una instancia de Axios con:

- `baseURL` desde `VITE_API_URL`.
- Cabecera `Authorization` automática si existe `vantax_token` en `localStorage`.
- Timeout de 15 s y helpers `get`, `post`, `put`, `delete`.
- `getApiErrorMessage` para normalizar errores de NestJS.

Los endpoints actuales de usuarios (`/users`) todavía no están implementados en `vantax-api`; por eso `VITE_USE_MOCKS=true` viene activo por defecto.
