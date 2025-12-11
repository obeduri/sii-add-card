# Documentación de la API

## Descripción General
Esta API proporciona operaciones CRUD para Usuarios y Tarjetas de Crédito utilizando Prisma ORM con PostgreSQL.

## URL Base
```
http://localhost:3000/api
```

---

## API de Usuarios

### Obtener Todos los Usuarios
**GET** `/api/users`

Parámetros de consulta:
- `include` (opcional): Establecer en `cards` o `true` para incluir las tarjetas de crédito del usuario

**Respuesta:** `200 OK`
```json
[
  {
    "id": "clxxx...",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creditCards": []
  }
]
```

### Crear Usuario
**POST** `/api/users`

**Cuerpo de la solicitud:**
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez"  // opcional
}
```

**Respuesta:** `201 Created`
```json
{
  "id": "clxxx...",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errores:**
- `400`: El email es requerido
- `409`: Ya existe un usuario con este email

### Obtener Usuario por ID
**GET** `/api/users/[id]`

Parámetros de consulta:
- `include` (opcional): Establecer en `cards` o `true` para incluir las tarjetas de crédito del usuario

**Respuesta:** `200 OK`
```json
{
  "id": "clxxx...",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errores:**
- `404`: Usuario no encontrado

### Actualizar Usuario
**PUT** `/api/users/[id]`

**Cuerpo de la solicitud:**
```json
{
  "email": "nuevoemail@ejemplo.com",  // opcional
  "name": "María García"              // opcional
}
```

**Respuesta:** `200 OK`
```json
{
  "id": "clxxx...",
  "email": "nuevoemail@ejemplo.com",
  "name": "María García",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errores:**
- `404`: Usuario no encontrado
- `409`: El email ya está en uso

### Eliminar Usuario
**DELETE** `/api/users/[id]`

**Respuesta:** `200 OK`
```json
{
  "message": "Usuario eliminado exitosamente",
  "id": "clxxx..."
}
```

**Errores:**
- `404`: Usuario no encontrado

**Nota:** Eliminar un usuario eliminará en cascada todas las tarjetas de crédito asociadas.

---

## API de Tarjetas de Crédito

### Obtener Todas las Tarjetas de Crédito
**GET** `/api/cards`

Parámetros de consulta:
- `userId` (opcional): Filtrar tarjetas por ID de usuario
- `include` (opcional): Establecer en `user` o `true` para incluir información del usuario

**Respuesta:** `200 OK`
```json
[
  {
    "id": "clxxx...",
    "cardNumber": "4111111111111111",
    "cardHolder": "JUAN PÉREZ",
    "expiryDate": "12/25",
    "cvv": "123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "clxxx...",
    "user": null
  }
]
```

### Crear Tarjeta de Crédito
**POST** `/api/cards`

**Cuerpo de la solicitud:**
```json
{
  "cardNumber": "4111111111111111",
  "cardHolder": "JUAN PÉREZ",
  "expiryDate": "12/25",  // Formato: MM/YY
  "cvv": "123",
  "userId": "clxxx..."    // opcional
}
```

**Respuesta:** `201 Created`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "JUAN PÉREZ",
  "expiryDate": "12/25",
  "cvv": "123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": {
    "id": "clxxx...",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez"
  }
}
```

**Errores:**
- `400`: Faltan campos requeridos o formato de fecha de expiración inválido
- `404`: Usuario no encontrado (si se proporciona userId)

### Obtener Tarjeta de Crédito por ID
**GET** `/api/cards/[id]`

Parámetros de consulta:
- `include` (opcional): Establecer en `user` o `true` para incluir información del usuario

**Respuesta:** `200 OK`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "JUAN PÉREZ",
  "expiryDate": "12/25",
  "cvv": "123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": null
}
```

**Errores:**
- `404`: Tarjeta de crédito no encontrada

### Actualizar Tarjeta de Crédito
**PUT** `/api/cards/[id]`

**Cuerpo de la solicitud:**
```json
{
  "cardNumber": "4111111111111111",  // opcional
  "cardHolder": "MARÍA GARCÍA",      // opcional
  "expiryDate": "12/26",             // opcional, Formato: MM/YY
  "cvv": "456",                      // opcional
  "userId": "clxxx..."               // opcional, establecer en null para desasignar
}
```

**Respuesta:** `200 OK`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "MARÍA GARCÍA",
  "expiryDate": "12/26",
  "cvv": "456",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": {
    "id": "clxxx...",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez"
  }
}
```

**Errores:**
- `404`: Tarjeta de crédito no encontrada o Usuario no encontrado (si se proporciona userId)
- `400`: Formato de fecha de expiración inválido

### Eliminar Tarjeta de Crédito
**DELETE** `/api/cards/[id]`

**Respuesta:** `200 OK`
```json
{
  "message": "Tarjeta de crédito eliminada exitosamente",
  "id": "clxxx..."
}
```

**Errores:**
- `404`: Tarjeta de crédito no encontrada

---

## Respuestas de Error

Todos los endpoints pueden devolver las siguientes respuestas de error:

### 400 Bad Request
```json
{
  "error": "Mensaje de error describiendo qué salió mal"
}
```

### 404 Not Found
```json
{
  "error": "Recurso no encontrado"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Método GET no permitido"
}
```

### 409 Conflict
```json
{
  "error": "Mensaje de conflicto de recurso"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error Interno del Servidor",
  "message": "Mensaje de error detallado"
}
```

---

## Instrucciones de Configuración

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Crear un archivo `.env` con:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
   ```

3. **Generar el cliente de Prisma:**
   ```bash
   pnpm prisma:generate
   ```

4. **Ejecutar migraciones:**
   ```bash
   pnpm prisma:migrate
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

---

## Notas de Seguridad

⚠️ **Importante:** La implementación actual almacena los datos de tarjetas de crédito en texto plano. Para uso en producción:

1. Encriptar campos sensibles (`cardNumber`, `cvv`) antes de almacenar
2. Implementar autenticación y autorización
3. Usar HTTPS para todas las peticiones de la API
4. Agregar limitación de tasa (rate limiting)
5. Implementar validación y sanitización de entradas
6. Considerar requisitos de cumplimiento con PCI DSS
