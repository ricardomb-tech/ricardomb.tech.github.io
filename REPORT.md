# Reporte de Configuración del Proyecto - Portafolio Angular para GitHub Pages

Este documento detalla las acciones realizadas para configurar la arquitectura y el despliegue del portafolio personal en Angular 20, siguiendo los requisitos específicos para un sitio estático en GitHub Pages.

---

## 1. Arquitectura de Carpetas

Se estableció una arquitectura basada en características (`feature-based`) utilizando `standalone components`.

### Acciones Realizadas:

-   **Generación de Componentes y Servicios:**
    -   `ng g c pages/home --skip-tests`
    -   `ng g c pages/about --skip-tests`
    -   `ng g c pages/projects --skip-tests`
    -   `ng g c pages/experience --skip-tests`
    -   `ng g s core/services/portfolio-data --skip-tests`
-   **Creación de Directorios:**
    -   `mkdir src\app\core\models` (para interfaces TypeScript)
    -   `mkdir src\assets\data` (para archivos JSON de contenido)

### Estructura de Carpetas Resultante (Fragmento relevante):

```
ricardomb.tech.github.io/
└───src/
    ├───assets/
    │   └───data/
    │       ├───experience.json
    │       └───projects.json
    └───app/
        ├───core/
        │   ├───models/
        │   │   └───portfolio.models.ts
        │   └───services/
        │       └───portfolio-data.ts
        └───pages/
            ├───about/
            ├───experience/
            ├───home/
            └───projects/
```

---

## 2. Configuración de Angular para GitHub Pages

Se ajustó la configuración de Angular para el despliegue estático y el lazy loading, asegurando la compatibilidad con GitHub Pages.

### Acciones Realizadas:

-   **`angular.json`:**
    -   El `builder` del proyecto fue corregido a: `"@angular/build:application"`.
    -   Se eliminaron las configuraciones de Server-Side Rendering (SSR) (`server`, `ssr`, `outputMode`) para asegurar un build 100% estático.
    -   `outputPath` se configuró como `"dist/browser"`.
    -   `baseHref` se estableció en `"/"` (adecuado para sitios `usuario.github.io`).
    -   Las rutas de `assets` se corrigieron para incluir el contenido de `public/` y `src/assets`.
-   **`src/app/app.routes.ts`:**
    -   Se definieron las rutas para `home`, `about`, `projects` y `experience` con lazy loading (`loadComponent`).
    -   Se configuraron redirecciones para la ruta raíz (`''`) y rutas no encontradas (`'**'`) hacia `/home`.
-   **`src/app/app.html`:**
    -   El contenido del archivo fue reemplazado por un simple `<router-outlet />` para asegurar que el enrutamiento controle la vista principal.
-   **`src/app/app.config.ts`:**
    -   Se añadió `provideHttpClient()` a los proveedores para habilitar el uso de `HttpClient` en toda la aplicación.

---

## 3. Gestión de Contenido

Se implementó una estructura para gestionar contenido estático de manera tipada.

### Acciones Realizadas:

-   **`src/app/core/models/portfolio.models.ts`:**
    -   Se crearon las interfaces TypeScript `Project` y `Experience` para tipar los datos del portafolio.
-   **Archivos JSON:**
    -   Se crearon `src/assets/data/projects.json` y `src/assets/data/experience.json` con datos de ejemplo.
-   **`src/app/core/services/portfolio-data.ts`:**
    -   El servicio `PortfolioData` fue implementado utilizando `inject(HttpClient)` para cargar los archivos JSON locales y retornar Observables de los datos tipados (`Project[]`, `Experience[]`).

---

## 4. Build y Optimización

Se configuraron los scripts de build para producción y se consideraron optimizaciones.

### Acciones Realizadas:

-   **`angular.json` (sección `build.configurations.production`):**
    -   Se mantuvieron los `budgets` configurados para el tamaño inicial y de estilos de componentes, asegurando control sobre el tamaño del bundle.
-   **`package.json`:**
    -   Se añadió el script `"build:prod": "ng build --configuration production"` para generar una versión optimizada para producción.

---

## 5. Deployment a GitHub Pages

Se configuró el proceso de despliegue para automatizar la publicación en GitHub Pages.

### Acciones Realizadas:

-   **Instalación de `angular-cli-ghpages`:**
    -   `npm install angular-cli-ghpages --save-dev`
-   **`package.json`:**
    -   Se añadió el script `"deploy": "ng build --configuration production && npx angular-cli-ghpages --dir=dist/browser"` para automatizar el build y despliegue.
-   **`.nojekyll`:**
    -   Se creó un archivo `.nojekyll` vacío en la raíz del proyecto para indicarle a GitHub Pages que no debe procesar el sitio con Jekyll, evitando conflictos.

---

## 6. Configuración del Proyecto

Se documentaron las instrucciones esenciales y se corrigió una dependencia de runtime.

### Acciones Realizadas:

-   **`README.md`:**
    -   Se creó un `README.md` detallado con secciones para instalación, desarrollo local, build y el proceso de despliegue en GitHub Pages.
-   **`zone.js` Fix:**
    -   Se instaló la dependencia `zone.js`: `npm install zone.js`.
    -   Se añadió `import 'zone.js';` al inicio de `src/main.ts` para resolver el error `NG0908`, asegurando que Angular tenga su mecanismo de detección de cambios activo.

---

Este conjunto de cambios prepara el proyecto para un desarrollo eficiente y un despliegue sin problemas en GitHub Pages, cumpliendo con todos los requisitos de un portafolio estático, modular y production-ready.
