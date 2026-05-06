# 🏆 Guía de instalación — Polla Mundial 2026

## ¿Qué vas a tener al final?
Una URL pública (ej: `polla-mundial.vercel.app`) que puedes mandar por WhatsApp.
Cada apostador entra, pone su nombre, y sus pronósticos quedan guardados en tiempo real.
Los pronósticos se bloquean automáticamente 5 minutos antes de cada partido.

---

## PASO 1 — Crear la base de datos en Supabase (5 min)

1. Ve a **https://supabase.com** → "Start your project" → crea cuenta gratis
2. Crea un nuevo proyecto:
   - **Name:** polla-mundial
   - **Database password:** elige una contraseña segura
   - **Region:** el más cercano a tu país
3. Espera ~2 min a que el proyecto arranque
4. Ve a **SQL Editor** (menú izquierdo) → "New query"
5. Copia y pega TODO el contenido del archivo `supabase-schema.sql`
6. Haz clic en **Run** ✅
7. Ve a **Settings → API** y copia:
   - `Project URL` (ej: `https://abcdefgh.supabase.co`)
   - `anon public` key (el token largo)

---

## PASO 2 — Subir el código a GitHub (3 min)

1. Ve a **https://github.com** → crea cuenta si no tienes
2. Crea un **nuevo repositorio** llamado `polla-mundial`
3. Sube todos los archivos de esta carpeta al repositorio
   - Puedes arrastrar los archivos directamente en el navegador
   - **¡No subas el archivo `.env.local`!** (si lo creas)

---

## PASO 3 — Desplegar en Vercel (3 min)

1. Ve a **https://vercel.com** → "Start Deploying" → conecta tu cuenta de GitHub
2. Importa el repositorio `polla-mundial`
3. Antes de hacer deploy, agrega las **variables de entorno**:
   - Haz clic en "Environment Variables"
   - Agrega estas tres:

   | Nombre | Valor |
   |--------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | tu Project URL de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tu anon key de Supabase |
   | `NEXT_PUBLIC_ADMIN_PIN` | el PIN que quieras (ej: MUNDIAL2026) |

4. Haz clic en **Deploy** ✅
5. En ~2 minutos Vercel te dará una URL como `polla-mundial-xxx.vercel.app`

---

## PASO 4 — Compartir con tus apostadores

Manda la URL por WhatsApp 🎉

**Como apostador:**
- Entran a la URL
- Escriben su nombre → "ENTRAR A LA POLLA"
- Llenan sus pronósticos (se guardan solos)
- Los partidos se bloquean solos 5 min antes del pitido

**Como admin:**
- Entran a la URL
- Usan el PIN que configuraste
- Ingresan resultados reales → la tabla se actualiza en tiempo real para todos

---

## Personalizar el PIN de admin

En Vercel → tu proyecto → Settings → Environment Variables
Cambia `NEXT_PUBLIC_ADMIN_PIN` por el valor que quieras.
Haz "Redeploy" para que tome efecto.

---

## ¿Problemas?

- **Error de Supabase:** verifica que las variables de entorno estén bien escritas en Vercel
- **No se guardan pronósticos:** revisa que corriste el SQL completo en Supabase
- **La tabla no actualiza:** espera 30 seg, usa el botón de refrescar del navegador

¡Suerte en la polla! 🏆⚽
