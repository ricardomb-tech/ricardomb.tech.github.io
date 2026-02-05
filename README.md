# Mi Portafolio Personal

Este proyecto es mi portafolio personal, creado con Angular 20 y desplegado en GitHub Pages.

## Requisitos

- Node.js (v20 o superior)
- Angular CLI (v20 o superior)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/ricardomb-tech/ricardomb-tech.github.io.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Servidor de Desarrollo

Ejecuta `npm start` para un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos de origen.

## Build

Ejecuta `npm run build:prod` para construir el proyecto en modo producción. Los artefactos de la construcción se almacenarán en el directorio `dist/browser/`.

## Despliegue en GitHub Pages

1. Asegúrate de que tu repositorio en GitHub se llame `tu-usuario.github.io`.
2. Ejecuta el siguiente comando:
   ```bash
   npm run deploy
   ```
Este comando construirá la aplicación en modo producción y la desplegará automáticamente en la rama `gh-pages` de tu repositorio. El sitio estará disponible en `https://tu-usuario.github.io`.