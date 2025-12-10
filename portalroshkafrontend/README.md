# Portal Roshkero - Frontend

Este proyecto es una aplicación frontend moderna construida con React, potenciada por Vite para un desarrollo rápido, estilada con TailwindCSS, organizada con una arquitectura feature-based y asegurando calidad de código mediante ESLint y Prettier.

## 📂 Tecnologías utilizadas

- [React](https://es.react.dev/) 19.1.1
- [Vite](https://vite.dev/) 7.1.2
- [TypeScript](https://www.typescriptlang.org/) 5.8.3
- [React Router](https://reactrouter.com/home) 7.9.6
- [TailwindCSS](https://tailwindcss.com/) 4.1.17
- [Jest](https://jestjs.io/) 30.2.0
- [Testing Library - React](https://testing-library.com/) 6.3.0

## Estructura del proyecto

### Arquitectura feature-based

```
src/
 ├─ app/
 │   ├─ router/
 │   └─ providers/
 │
 ├─ features/
 │   ├─ user/
 │   │    ├─ pages/
 │   │    ├─ components/
 │   │    ├─ hooks/
 │   │    └─ services/
 │   ├─ auth/
 │   └─ ...
 │
 ├─ shared/
 │   ├─ services/
 │   ├─ ui/
 │   └─  utils/
 │
 │
 ├─ assets/
 └─ main.tsx
```

## Scripts

| Script             | Descripción                                               |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo con Vite                 |
| `npm run build`    | Compila TypeScript y genera el build optimizado           |
| `npm run lint`     | Ejecuta ESLint sobre el código                            |
| `npm run lint:fix` | Ejecuta ESLint e intenta corregir errores automáticamente |
| `npm run preview`  | Sirve localmente el build generado                        |
| `npm run test`     | Ejectura los test unitarios del proyecto                  |

## Instalación

1. Clonar el repositorio e instalar las dependencias del proyecto raíz

```sh
git clone https://github.com/roshkadev/portal-roshkero.git
cd portal-roshkero
npm install
cd portalroshkafrontend
```

2. Instalar las dependencias del proyecto de frontend

```sh
npm install
```

3. Genera una copia del archivo .env.example y actualiza con tus datos.

4. Ejecutar el proyecto localmente

```sh
npm run dev
```

## Licencia

Este proyecto es propiedad de Roshka. No está bajo una licencia de código abierto y solo puede ser utilizado por miembros autorizados de la organización.

HAY UN ARCHIVO QUE SE LLAMA env.example
#For Develop environment
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK=false
#For Production environment
VITE_API_BASE=https://TU-DOMINIO-O-EC2/api

ESE DEBEN COPIAR Y EN EL NUEVO CAMBIAR EL NOMBRE A env.development

debe quedar asi:

.env.development
.env.example
