# 🔐 Guía de Autenticación y Seguridad

## Nuevas Funcionalidades Implementadas

### 1. **Encriptación de Contraseña con bcryptjs**
- Las contraseñas se encriptan automáticamente antes de guardarse en la BD
- Se utiliza un factor de trabajo de 10 rondas de hash
- Es imposible recuperar la contraseña original desde la BD

### 2. **Generación de JWT (JSON Web Token)**
- Al hacer login correctamente, se genera un token JWT
- **Expiración**: 1 hora (`expiresIn: '1h'`)
- El token contiene: `userId` y `email`
- El cliente debe enviar el token en cada solicitud protegida

### 3. **Middleware de Autenticación**
- Valida el token JWT en las solicitudes
- Protege rutas sensibles
- Rutas protegidas en `/products`: POST, PUT, DELETE

---

## 📋 Endpoints de Autenticación

### Registro de Usuario
```
POST /auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "micontraseña123"
}

// Respuesta exitosa (201)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "email": "usuario@example.com",
    "created_ud": "2024-04-13T10:30:00.000Z"
  },
  "errors": []
}
```

### Iniciar Sesión
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "micontraseña123"
}

// Respuesta exitosa (200)
{
  "success": true,
  "message": "Sesión iniciada exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "errors": []
}
```

### Obtener Perfil (PROTEGIDO)
```
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Respuesta exitosa (200)
{
  "success": true,
  "message": "Perfil obtenido",
  "data": {
    "id": 1,
    "email": "usuario@example.com",
    "created_ud": "2024-04-13T10:30:00.000Z",
    "updated_up": "2024-04-13T10:30:00.000Z"
  },
  "errors": []
}
```

---

## 🔒 Rutas Protegidas

Las siguientes rutas ahora **requieren autenticación**:

### Crear Producto
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nuevo Producto",
  "categori_id": 1,
  "price": 29.99
}
```

### Actualizar Producto
```
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Producto Actualizado",
  "categori_id": 1,
  "price": 39.99
}
```

### Eliminar Producto
```
DELETE /products/:id
Authorization: Bearer <token>
```

---

## 📝 Pasos para Probar con Postman

### 1. Registrar un nuevo usuario
1. Abre **Postman**
2. Crea una solicitud **POST** a `http://localhost:3000/auth/signup`
3. En **Body → raw → JSON**, ingresa:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
4. Haz clic en **Send**
5. Deberías recibir un estado 201 con los datos del usuario

### 2. Iniciar sesión y obtener token
1. Crea una solicitud **POST** a `http://localhost:3000/auth/login`
2. En **Body → raw → JSON**, ingresa:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
3. Haz clic en **Send**
4. **Copia el token** de la respuesta (sin las comillas)

### 3. Usar el token en una ruta protegida
1. Crea una solicitud **POST** a `http://localhost:3000/products`
2. Ve a **Headers** y agrega:
   - **Key**: `Authorization`
   - **Value**: `Bearer token_que_copiaste_aqui`
3. En **Body → raw → JSON**, ingresa:
```json
{
  "name": "Mi Primer Producto",
  "categori_id": 1,
  "price": 99.99
}
```
4. Haz clic en **Send**
5. Si el token es válido, se creará el producto
6. Si no incluyes el token o es inválido, recibirás error 401

### 4. Verificar expiración del token
1. Espera a que pasen 1 hora, o manipula el token para hacerlo inválido
2. Intenta hacer otra solicitud POST a `/products`
3. Recibirás error: "Token expirado"

---

## ⚙️ Variables de Entorno

Asegúrate de crear un archivo `.env` con:

```
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=#ADSO_node
DB_NAME=inventario_adso
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
```

---

## 🗄️ Tabla de Usuarios Creada

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📌 Notas Importantes

- ✅ Las contraseñas se encriptan con **bcryptjs**
- ✅ Los tokens expiran después de **1 hora**
- ✅ El token se envía en el header `Authorization: Bearer <token>`
- ✅ Las rutas de productos ahora están protegidas (excepto GET)
- ⚠️ Cambia `JWT_SECRET` en producción
- ⚠️ El email debe ser único en la BD
- ⚠️ La contraseña mínima es de 6 caracteres
