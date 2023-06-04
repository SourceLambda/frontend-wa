Para generar la imagen del componente *front_wa* se deben seguir los siguientes pasos: 
(Se necesita tener el proyecto con los módulos instalados)

1. Tener un archivo .env en el directorio principal (donde esta el package.json) con la información necesaria para las variables de entorno.
2. En el directorio principal ejecutar el comando: **npm run build**, el cual creará los archivos estáticos dentro de una carpeta llamada *dist*.
3. Mover la carpeta *dist* junto con una copia de los archivos package.json y Dockerfile a una nueva carpeta.
4. Dentro de la nueva carpeta editar el archivo package.json, quitanto todas las dependencias incluidas las de desarrollo conservando las relativas a Vite.js (vitejs, @vite/plugin-...).
- (Opcional) Para probar la correcta funcionalidad de la página, se puede ejecutar el comando: **npm install** para instalar Vite.js y posteriormente desplegar la página en Node.js con el comando: **npm run preview**
  Si se realiza este paso no olvidar eliminar la carpeta *node_modules* (puede dejarla porque no pesa mucho :v), el archivo package-lock.json puede conservarse.
5. Dentro de la nueva carpeta ejecutar el comando:
    **docker build -t <usuario_dockerhub>/<nombre_imagen> .**
(Se tiene en cuenta el usuario de DockerHub para su subida al repositorio)

- (Opcional) Para probar el correcto funcionamiento de la imagen ejecutar el comando:
    **docker run -p <puerto_del_host>:5173 <usuario_dockerhub>/<nombre_imagen>**

  En el archivo Dockerfile se tiene como comando entrypoint: npm run preview, este comando no tiene como función desplegar el sitio web (en este caso usando Node.js), más bien debe ser usado en desarrollo.