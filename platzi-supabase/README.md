# Suplatzigram Avanzada

Frontend para el **Curso de Supabase Avanzado de Platzi**. Una aplicación inspirada en Instagram construida con [Next.js](https://nextjs.org) y [Supabase](https://supabase.com) como backend.

**🌐 Producción:** [suplatzigram-two.vercel.app](https://suplatzigram-two.vercel.app)

## Funcionalidades

- **Feed** con posts, likes persistidos y comentarios (`/`)
- **Registro e inicio de sesión** con email/contraseña y username único (`/auth/register`, `/auth/login`)
- **Perfil de usuario**: ver (`/profile`) y editar username + avatar (`/profile/edit`)
- **Notificaciones en tiempo real** (campana con Supabase Realtime) cuando alguien da like o comenta tus posts
- **Ranking** de posts con más de 5 likes (`/rank`)
- **Dashboard** de métricas en vivo (`/dashboard`)
- **Email al dueño del post** cuando recibe un comentario (vía Resend, opcional)

## Tecnologías

| Herramienta | Versión |
| :--- | :--- |
| Next.js | 16.2.x |
| React | 19.2.x |
| Tailwind CSS | 4.3.x |
| @supabase/supabase-js | 2.110.x |
| TypeScript | 5.9.x |
| ESLint | 9.39.x |
| Resend | 6.x |

> Nota: TypeScript 7 y ESLint 10 todavía no son compatibles con el build de Next.js 16 / `eslint-config-next`, por eso se mantienen en la última versión estable de sus series anteriores.

## Requisitos previos

- Node.js 20 o superior y npm
- Un proyecto en [Supabase](https://supabase.com) con la estructura descrita más abajo

## Ejecutar en ambiente local

1. **Clonar el repositorio y entrar a la carpeta del proyecto:**

   ```bash
   git clone https://github.com/guedim/CurosIA.git
   cd CurosIA/platzi-supabase
   ```

2. **Configurar las variables de entorno.** Copia `.env.example` a `.env.local` y completa con las credenciales de tu proyecto Supabase (Dashboard → Project Settings → API):

   ```bash
   cp .env.example .env.local
   ```

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```

   Sin estas variables la aplicación no compila (`Error: supabaseUrl is required`).

3. **Instalar dependencias:**

   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador. Los cambios en el código se recargan automáticamente.

### Otros comandos útiles

```bash
npm run build   # Build de producción (verifica que todo compile)
npm run start   # Sirve el build de producción en localhost:3000
npm run lint    # Ejecuta ESLint sobre el proyecto
```

## Estructura en Supabase

Toda la estructura está versionada en la carpeta [`supabase/`](supabase/):

- **[`supabase/setup.sql`](supabase/setup.sql)**: script idempotente que crea todo el backend (tablas, trigger, RLS, Realtime y Storage).
- **[`supabase/functions/send-notification/`](supabase/functions/send-notification/)**: código de la Edge Function de notificaciones.

Lo que crea el script:

- **`public.profiles`**: perfil 1:1 con `auth.users` (`username` único, `avatar_url`). Se crea automáticamente al registrarse mediante el trigger `on_auth_user_created`.
- **`public.posts_new`**: posts con `user_id`, `image_url`, `caption`.
- **`public.likes`**: un like por usuario/post (única `user_id + post_id`).
- **`public.comments`**: comentarios con autor y post.
- **`public.notifications`**: notificaciones por like/comentario, con **Realtime habilitado** para la campana.
- **Bucket de Storage `images`** (público): fotos de posts en `posts/` y avatares en `profile/`.
- **RLS**: lectura pública de posts/perfiles/likes/comentarios; escribir requiere sesión y ser el dueño de la fila; las notificaciones solo las ve su destinatario.
- **Realtime** habilitado en las 5 tablas (lo usan el dashboard y la campana de notificaciones).

### Desplegar en tu propia cuenta de Supabase

1. **Crea un proyecto nuevo** en [supabase.com/dashboard](https://supabase.com/dashboard).

2. **Ejecuta el script SQL.** Abre el **SQL Editor** del proyecto, pega el contenido completo de [`supabase/setup.sql`](supabase/setup.sql) y ejecútalo. Es idempotente: puedes correrlo más de una vez sin errores.

3. **Despliega la Edge Function** con la [Supabase CLI](https://supabase.com/docs/guides/cli):

   ```bash
   supabase login
   supabase functions deploy send-notification --project-ref TU_PROJECT_REF
   ```

   La función usa `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, que Supabase inyecta automáticamente; no necesita secretos adicionales.

4. **Configura la app.** Copia la URL y la anon key del proyecto nuevo (Dashboard → Project Settings → API) a tu `.env.local` (y a Vercel si despliegas), y agrega el hostname `TU_PROYECTO.supabase.co` en `images.remotePatterns` de [`next.config.ts`](next.config.ts) para que `next/image` cargue las fotos.

5. **Ajusta Authentication → URL Configuration** para que el **Site URL** apunte a tu dominio (o `http://localhost:3000` en local) y los correos de confirmación redirijan bien.

## Ver la aplicación en la URL pública

La app está desplegada en Vercel y disponible para cualquiera en:

**[https://suplatzigram-two.vercel.app](https://suplatzigram-two.vercel.app)**

- Como **visitante anónimo** puedes ver el feed (`/`) y el ranking (`/rank`).
- Para **dar like, comentar, crear posts o editar tu perfil** necesitas registrarte en [/auth/register](https://suplatzigram-two.vercel.app/auth/register) y confirmar tu correo (revisa tu bandeja de entrada), luego iniciar sesión en [/auth/login](https://suplatzigram-two.vercel.app/auth/login).
- El dashboard de métricas en vivo está en [/dashboard](https://suplatzigram-two.vercel.app/dashboard).

### Cómo se despliega

El proyecto en Vercel se llama `suplatzigram` y usa las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el build de producción.

Consideraciones:

- Vercel bloquea versiones de Next.js con vulnerabilidades conocidas (p. ej. CVE-2025-66478 en 16.0.6); mantén Next.js actualizado.
- El hostname del proyecto Supabase debe estar permitido en `next.config.ts` (`images.remotePatterns`) para que `next/image` cargue las fotos.
- En Supabase (Authentication → URL Configuration) el **Site URL** debe apuntar al dominio de producción para que los correos de confirmación redirijan bien.
- Para activar el **email de comentarios** agrega en Vercel las variables `SUPABASE_SERVICE_ROLE_KEY` y `RESEND_API_KEY` (API key de Resend, server-only — sin prefijo `NEXT_PUBLIC_`); sin ellas el endpoint responde 503 y la app funciona normal.

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Repositorio del curso (Platzi)](https://github.com/platzi/supabase-avanzado)
