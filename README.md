<<<<<<< HEAD
Proyecto Backend - Litflix

Este proyecto es un backend desarrollado en Node.js y Express que se conecta a una base de datos llamada "litflix". A continuación, se detallan los pasos para configurar la base de datos y el archivo .env para asegurar una correcta conexión. El código de este proyecto se encuentran en la rama 'master' del repositorio.

Requisitos

- Node.js instalado
- NPM (gestor de paquetes de Node.js)
- Base de datos MySQL

Configuración del archivo .env

Modifique o cree un archivo llamado .env en la raíz de tu proyecto y asegúrate de incluir la siguiente configuración:

- DB_HOST=localhost
- DB_USER=root # Reemplaza con tu usuario
- DB_PASSWORD=tu_contraseña # Reemplaza con tu contraseña de la base de datos
- DB_NAME=litflix
- PORT=3001

Configuración de la Base de Datos

Crear la base de datos: Asegúrate de que la base de datos se llame "litflix" ejecutando el siguiente comando en MySQL:

CREATE DATABASE litflix;

=======
Para conectar la base de datos abra MySQL e importe litflix.sql
Luego abra el archivo .env y configure su contraseña y usuario en caso de ser necesario
Para ejecutar el backend abrir una terminal en la carpeta raíz
Usar "cd backend" para entrar en la carpeta del backend, luego "node index.js"
Si la conexión fue exitosa, vaya a su navegador y escriba "localhost:3001"
Debería ver el resultado a la consulta de ejemplo "SELECT * FROM Obra"
>>>>>>> master
