# Sistema de Gestión de Tarjetas de Crédito

Aplicación web desarrollada con [Next.js](https://nextjs.org) que permite gestionar tarjetas de crédito y usuarios mediante una interfaz moderna y una API REST completa.

## 🚀 Características

- ✅ Gestión completa de tarjetas de crédito (CRUD)
- ✅ Gestión de usuarios
- ✅ Interfaz visual interactiva con vista previa de tarjetas
- ✅ API REST documentada
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Diseño responsive con Tailwind CSS y Chakra UI

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 20 o superior)
- **pnpm** (gestor de paquetes recomendado)
- **PostgreSQL** (base de datos)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sii-add-card
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
POSTGRES_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
PRISMA_DATABASE_URL="tu_url_de_prisma_accelerate" # Opcional
```

**Nota:** Reemplaza los valores con tus credenciales de PostgreSQL.

### 4. Generar el cliente de Prisma

```bash
pnpm prisma:generate
```

### 5. Ejecutar migraciones de base de datos

```bash
pnpm prisma:migrate
```

Este comando creará las tablas necesarias en tu base de datos:

- `User` - Tabla de usuarios
- `CreditCard` - Tabla de tarjetas de crédito

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción

```bash
# Construir la aplicación
pnpm build

# Iniciar el servidor de producción
pnpm start
```

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Construye la aplicación para producción |
| `pnpm start` | Inicia el servidor de producción |
| `pnpm lint` | Ejecuta el linter de código |
| `pnpm prisma:generate` | Genera el cliente de Prisma |
| `pnpm prisma:migrate` | Ejecuta migraciones de desarrollo |
| `pnpm prisma:migrate:deploy` | Ejecuta migraciones en producción |
| `pnpm prisma:studio` | Abre Prisma Studio para gestionar la BD |

## 🗂️ Estructura del Proyecto

```text
sii-add-card/
├── components/          # Componentes React reutilizables
│   ├── CreditCard.tsx  # Componente de visualización de tarjeta
│   └── Tooltip.tsx     # Componente de tooltip
├── pages/              # Páginas y rutas de Next.js
│   ├── api/           # Endpoints de la API REST
│   │   ├── cards/     # CRUD de tarjetas
│   │   └── users/     # CRUD de usuarios
│   └── index.tsx      # Página principal
├── prisma/            # Configuración de Prisma
│   ├── schema.prisma  # Esquema de base de datos
│   └── migrations/    # Migraciones de BD
├── lib/               # Utilidades y configuraciones
│   └── prisma.ts      # Cliente de Prisma
├── styles/            # Estilos globales
└── public/            # Archivos estáticos
```

## 🔌 API REST

La aplicación incluye una API REST completa. Consulta la [documentación de la API](./API_DOCUMENTATION.md) para más detalles sobre los endpoints disponibles.

### Endpoints principales

- **Usuarios:**
  - `GET /api/users` - Obtener todos los usuarios
  - `POST /api/users` - Crear usuario
  - `GET /api/users/[id]` - Obtener usuario por ID
  - `PUT /api/users/[id]` - Actualizar usuario
  - `DELETE /api/users/[id]` - Eliminar usuario

- **Tarjetas:**
  - `GET /api/cards` - Obtener todas las tarjetas
  - `POST /api/cards` - Crear tarjeta
  - `GET /api/cards/[id]` - Obtener tarjeta por ID
  - `PUT /api/cards/[id]` - Actualizar tarjeta
  - `DELETE /api/cards/[id]` - Eliminar tarjeta

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 16
- **UI:** React 19, Chakra UI, Tailwind CSS
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Lenguaje:** TypeScript
- **Iconos:** React Icons
- **Alertas:** SweetAlert2

## ⚠️ Notas de Seguridad

**IMPORTANTE:** Esta aplicación es un proyecto de demostración. Para uso en producción:

1. ❌ **NO almacenar datos de tarjetas en texto plano**
2. ✅ Implementar encriptación para campos sensibles (`cardNumber`, `cvv`)
3. ✅ Agregar autenticación y autorización
4. ✅ Usar HTTPS en todas las peticiones
5. ✅ Implementar rate limiting
6. ✅ Validar y sanitizar todas las entradas
7. ✅ Considerar cumplimiento con PCI DSS

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

Verifica que:

- PostgreSQL esté ejecutándose
- Las credenciales en `.env` sean correctas
- La base de datos exista

### Error al generar Prisma Client

```bash
# Eliminar el cliente generado y regenerar
rm -rf generated/prisma
pnpm prisma:generate
```

## 📖 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Chakra UI](https://chakra-ui.com/docs)
- [Documentación de la API](./API_DOCUMENTATION.md)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
