# Portal Roshkero - Frontend

Este proyecto es una aplicación frontend moderna construida con React, potenciada por Vite para un desarrollo rápido, estilada con TailwindCSS, organizada con una arquitectura feature-based y asegurando calidad de código mediante ESLint y Prettier.

## 📂 Tecnologías utilizadas

* [React](https://es.react.dev/) 19.1.1
* [Vite](https://vite.dev/) 7.1.2
* [TypeScript](https://www.typescriptlang.org/) 5.8.3
* [React Router](https://reactrouter.com/home) 7.9.6
* [TailwindCSS](https://tailwindcss.com/) 3.4.17

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

| Script     | Descripción                                               |
| ---------- | --------------------------------------------------------- |
| `npm run dev`      | Inicia el servidor de desarrollo con Vite                 |
| `npm run build`    | Compila TypeScript y genera el build optimizado           |
| `npm run lint`     | Ejecuta ESLint sobre el código                            |
| `npm run lint:fix` | Ejecuta ESLint e intenta corregir errores automáticamente |
| `npm run preview`  | Sirve localmente el build generado                        |

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
