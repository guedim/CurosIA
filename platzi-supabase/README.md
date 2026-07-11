# Suplatzigram Avanzada

Frontend para el **Curso de Supabase Avanzado de Platzi**. Una aplicación inspirada en Instagram construida con [Next.js](https://nextjs.org) y [Supabase](https://supabase.com) como backend.

**🌐 Producción:** [suplatzigram-two.vercel.app](https://suplatzigram-two.vercel.app)

## Tecnologías

| Herramienta | Versión |
| :--- | :--- |
| Next.js | 16.2.x |
| React | 19.2.x |
| Tailwind CSS | 4.3.x |
| @supabase/supabase-js | 2.110.x |
| TypeScript | 5.9.x |
| ESLint | 9.39.x |

> Nota: TypeScript 7 y ESLint 10 todavía no son compatibles con el build de Next.js 16 / `eslint-config-next`, por eso se mantienen en la última versión estable de sus series anteriores.

## Configuración

Crea un archivo `.env.local` a partir de `.env.example` con las credenciales de tu proyecto Supabase (Dashboard → Project Settings → API):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

Sin estas variables la aplicación no compila (`Error: supabaseUrl is required`).

## Estructura en Supabase

La app espera esta estructura (ya desplegada vía migraciones en el proyecto `suplatzigram`):

- **Tabla `public.posts_new`**: `id`, `user_id` (uuid), `image_url`, `caption`, `likes`, `created_at`, `updated_at`. RLS habilitado con lectura pública e inserción abierta (la app publica con la anon key sin sesión).
- **Bucket de Storage `images`** (público): las imágenes se suben a `posts/` y se sirven por URL pública.
- **Auth por email/contraseña** para las páginas de registro e inicio de sesión.

## Comenzar

Instala las dependencias e inicia el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

El proyecto está desplegado en Vercel (proyecto `suplatzigram`) con las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas para el build de producción.

Consideraciones:

- Vercel bloquea versiones de Next.js con vulnerabilidades conocidas (p. ej. CVE-2025-66478 en 16.0.6); mantén Next.js actualizado.
- El hostname del proyecto Supabase debe estar permitido en `next.config.ts` (`images.remotePatterns`) para que `next/image` cargue las fotos.
- En Supabase (Authentication → URL Configuration) el **Site URL** debe apuntar al dominio de producción para que los correos de confirmación redirijan bien.

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
