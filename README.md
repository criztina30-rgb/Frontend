# 🏍️ Proymotos

Plataforma web moderna para la exhibición, venta y reserva de motocicletas premium.

## 🌟 Características Principales

* **Catálogo Moderno**: Visualización en tarjetas interactivas con sistema de fallback inteligente para imágenes.
* **Búsqueda Avanzada**: Búsqueda por texto y filtros dinámicos (Marca, Categoría, Precio, Disponibilidad).
* **Sistema de Favoritos**: Guarda tus motos favoritas en tu perfil. (Sincronizado con base de datos).
* **Reservas Seguras**: Proceso de reserva de motocicletas por fecha.
* **Chat Inteligente (MotoBot)**: Asistente virtual basado en IA para responder dudas y ayudar en la selección.
* **Responsive Design**: Experiencia perfecta en móviles, tablets y escritorio.

## 🛠️ Tecnologías

### Frontend (`Frontend/`)
* **React 19**
* **Vite 8**
* **React Router v7**
* **Axios** (para consumo de API REST)
* **CSS Vanilla** (Custom properties, grid, flexbox, animaciones)

### Backend (`Proymotos/`)
* **Node.js** + **Express 5**
* **TypeScript**
* **Prisma ORM v7**
* **PostgreSQL** (Hospedado en Render)
* **JWT** (Autenticación)

## 🚀 Instalación y Uso Local

Para correr este proyecto en tu entorno local necesitas tener Node.js instalado.

### 1. Backend (API)
```bash
cd Proymotos
npm install
# Crear archivo .env basado en .env.example (necesita DATABASE_URL, JWT_SECRET, OPENAI_API_KEY)
npx prisma db push
npm run dev
```

### 2. Frontend (Cliente)
```bash
cd Frontend
npm install
npm run dev
```
El frontend correrá típicamente en `http://localhost:5173`.

## 🛡️ Seguridad

> **Nota para desarrolladores:** Nunca subas archivos `.env` a repositorios públicos. Los archivos `.gitignore` han sido configurados para prevenirlo.

## 📄 Licencia
Este proyecto es un portafolio de desarrollo.
