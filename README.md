## Pasos para iniciar la aplicación:

### 1) Configurar MongoDB Atlas:

Se debe crear una cuenta en MongoDB Atlas. Para ello ingresa a

https://www.mongodb.com/cloud/atlas

Entras en Sign up y llena los campos de registro.

Luego, crea un nuevo Cluster. Selecciona alguno de los
proveedores que ahí aparecen como AWS o Google Cloud
y selecciona una de las regiones gratuitas.

Luego, sigue los pasos que aparecen en la página:
- Crea tu primer usuario de la base de datos como ATLAS ADMIN
- Agrega tu IP al whitelist
- Conecta al Cluster dando click en Connect, seleccionando
Connect your application y copia el Connection String.

NOTA: Al pegar, cambiar el <password> por la contraseña 
del usuario creado previamente

Luego ingresa a la dirección del proyecto

/todo-app/backend/.env 

y cambia los siguientes:

ATLAS_URI=ellink
cambia ellink por el link copiado en MongoDB Atlas


### 2) Configurar Mail

Se debe configurar la dirección que enviará los correos. Para ello
ingresa a la dirección del proyecto

/todo-app/backend/.env 

y realiza los siguientes cambios:

EMAIL=tucorreo 
cambia tucorreo por tu correo

PASSWORD=tucontraseña 
cambia tucontraseña por tu contraseña

SERVICE=gmail 
cambia gmail por el servicio de correo que utilices

También debes ingresar a la cuenta de correo y configurar
tu cuenta para ser usada en aplicaciones poco seguras. Esto
puede variar según tu servicio. Para gmail el link es:

https://myaccount.google.com/lesssecureapps?pli=1


### 3) Iniciar

Para iniciar el servidor ejecuta en la consola

/todo-app/backend/npm start

Para iniciar la aplicación ejecuta en la consola

/todo-app/npm start
