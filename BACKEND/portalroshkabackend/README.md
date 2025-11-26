📌 Descripción General
| Componente    | Tecnología                         |
| ------------- | ---------------------------------- |
| Backend       | Java 21 + Spring Boot + PostgreSQL |
| Frontend      | React + Vite + TypeScript          |
| Base de Datos | PostgreSQL 17                      |


⚙️ Prerrequisitos

| Herramienta              | Versión recomendada 
| ------------------------ | -------------------
| Java                     | 21 LTS              
| Maven                    | 3.8+                
| Node.js + npm            | 20.19.5 LTS         
| PostgreSQL               | 17       
| Thunder Client / Postman | —         
 


📦 Backend – Instalación

📍 Ubicación:

BACKEND/portalroshkabackend

▶️ 1. Verificar Java y Maven

 ```bash
 java -version
 mvn -version
 ```


🐘 2. Configurar PostgreSQL

1. Crear base: portalroshka

2. Restaurar Base de Datos de pgAdmin 
📍 src/main/resources/application.properties
  
3. Crear Archivo application.properties
   
```bash
spring.application.name=portalroshka
spring.datasource.url=jdbc:postgresql://localhost:5432/portalroshka
spring.datasource.username=<YOUR AWESOME DB USER>
spring.datasource.password=<YOUR AWESOME PASSWORD>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.show-sql:true
spring.jpa.hibernate.ddl-auto:none
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
```
▶️ 4. Levantar backend

 ```bash
  mvn clean install
  mvn spring-boot:run
  ```
  Si funciona correctamente 👉

  Tomcat started on port 8080
  Started PortalroshkabackendApplication

🧪 Testeo con Postman
✔️ Endpoint PÚBLICO

GET http://localhost:8080/api/v1/admin/th/users

👉 Status 200 OK

🔐 Login para obtener Token

GET http://localhost:8080/login

⚛️ 5. Frontend

 FRONTEND/portalroshkafrontend
 ```bash

 npm install
 ```
 
 ```bash

npm run dev
```
URL del front:

http://localhost:5173/

🧠 6. Flujo completo

1️⃣ PostgreSQL ON  
2️⃣ Backend → mvn spring-boot:run  
3️⃣ Test en Postman  
4️⃣ Login → guardar token  
5️⃣ Front → npm run dev  
6️⃣ Consumir API con token  