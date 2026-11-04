# KeikaBonsai

Astro 5, React, Tailwind, Vercel y Supabase. Node.js 22.

## Desarrollo

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

Sin variables de Supabase, el arbolario y el diario conservan los datos de
`src/data/plants.ts` y `src/data/journalEntries.ts`. El panel `/admin` queda
inactivo. Si configuras Supabase, la base de datos pasa a ser la unica fuente
de contenido; una base vacia se muestra vacia, sin sustituirla por ejemplos.

Las paginas `/work`, `/blog`, `/arbolario/[id]` y `/admin` se sirven bajo demanda
con el adaptador de Vercel. Los cambios guardados aparecen al visitar o recargar
la pagina, sin otro despliegue. El resto de paginas sigue siendo estatico.

## Activar Supabase

1. Crea un proyecto en Supabase y guarda sus credenciales en tu gestor de claves.
2. Ejecuta [supabase/schema.sql](supabase/schema.sql) en SQL Editor **una sola
	vez**, en un proyecto nuevo. Crea tablas, politicas RLS y el bucket publico
	`plant-photos`.
3. En Authentication > Providers > Email, activa Email y desactiva el registro
	de nuevos usuarios (Allow new users to sign up). Si esa opcion aparece en
	Authentication > Settings en tu version del panel, desactivala alli.
4. En Authentication > Users, usa **Add user > Create new user** para crear tu
	cuenta. Marca el correo como confirmado si se ofrece esa opcion. Si exige
	una contrasena inicial, genera una aleatoria; el panel solo usa enlaces por
	correo. No uses Invite user para este primer paso, porque la invitacion
	tiene un flujo de activacion diferente.
5. Autoriza tu cuenta desde SQL Editor, sustituyendo el correo:

	```sql
	insert into public.admin_users (user_id)
	select id from auth.users where lower(email) = lower('tu-correo@ejemplo.com');

	select email from auth.users
	where id in (select user_id from public.admin_users);
	```

	La segunda consulta debe devolver solo tu cuenta. Tener una cuenta en Auth
	no concede escritura: tambien debe estar en `admin_users`.
6. En Authentication > URL Configuration, establece Site URL con tu dominio
	de produccion y agrega las URLs de redireccion exactas:
	- `https://tu-dominio/admin`
	- `http://localhost:4321/admin` para desarrollo.
	- `http://127.0.0.1:4321/admin` si usas esa direccion local.
	Para previews, agrega solo los dominios que controles. Evita comodines
	amplios que permitan redirigir enlaces de acceso a terceros.
7. Configura el envio de correo. El proveedor de prueba de Supabase tiene
	restricciones de destinatarios y frecuencia; usa SMTP propio para un envio
	fiable y configura remitente, SPF y DKIM con tu proveedor.
8. En Project Settings > API Keys, localiza la clave **publishable** (o la
	`anon` heredada). Copia [.env.example](.env.example) a `.env` y rellena las
	dos variables. Nunca pongas una clave `secret` o `service_role` en una
	variable `PUBLIC_*`.
9. Reinicia `pnpm dev`. Abre `/admin`, solicita el enlace con tu correo y
	completa el acceso. Con ambas tablas vacias, pulsa **Importar datos actuales**.
	La importacion es atomica y se rechaza si ya hay contenido. Incluye la
	entrada marcada como ejemplo; puedes editarla o eliminarla despues.

## Configurar Vercel

1. Agrega `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` en
	Settings > Environment Variables para Production y, si procede, Preview.
	Son configuracion publica; los permisos se aplican mediante RLS.
2. Usa el preset Astro y el comando `pnpm build`. El adaptador prepara
	automaticamente las funciones y los archivos estaticos para Vercel.
3. Despliega de nuevo tras cambiar estas variables, porque tambien se incluyen
	en el JavaScript del navegador durante la compilacion.
4. Comprueba el acceso desde `/admin` en el dominio final. Una vez conectado,
	los cambios de contenido no requieren mas despliegues.

Para no dejar el sitio publico vacio al activar la base, importa primero desde
el panel local conectado al mismo proyecto y luego despliega las variables en
produccion. Conserva las imagenes de `public/`: la importacion guarda sus rutas
actuales; las fotos nuevas se suben a Supabase Storage.

## Edicion y seguridad

- No hay registro publico. El enlace por correo crea una sesion en el navegador.
  Cierra sesion en dispositivos compartidos. Trata los enlaces como contrasenas.
- Las tablas y las fotos publicadas son publicas. No guardes notas privadas,
  ubicaciones sensibles ni imagenes que no quieras publicar.
- Solo los UUID autorizados en `admin_users` pueden crear, editar o borrar
  contenido. Esa lista solo se modifica desde SQL Editor, no desde el panel.
- Los ID de las plantas son estables. El panel genera ID para nuevos ejemplares
  y no cambia los existentes al editar nombres o categorias.
- Un arbol con entradas no se puede borrar hasta eliminar sus entradas.
- Las fotos admiten JPG, PNG, WebP y AVIF hasta 10 MB por archivo. Una entrada
  admite hasta 20 fotos desde el panel.
- Quitar una foto de una ficha no borra el archivo del bucket, para no romper
  referencias compartidas. Las subidas descartadas pueden dejar archivos sin
  referencias: revisalos en Storage antes de eliminarlos manualmente.
- Configura copias de seguridad de la base y de Storage segun tu plan. Evita
  editar el mismo registro simultaneamente desde dos dispositivos.

## Verificacion

La auditoria actual detecta avisos de seguridad, incluidos criticos, en el
arbol de dependencias de Astro y del adaptador. Antes de activar la
administracion en produccion, revisa `pnpm audit --prod` y resuelve los avisos
aplicables. No se han aplicado actualizaciones mayores automaticamente.

`pnpm test` ejecuta el esquema SQL en PostgreSQL embebido (PGlite), con roles
de visitante, usuario sin permisos y propietario. Comprueba RLS, fotos,
importacion atomica y proteccion de plantas con entradas. Simula las tablas de
Auth y Storage: no sustituye una prueba final contra tu proyecto Supabase.

Antes de publicar, comprueba con tu proyecto real:

1. El enlace llega y vuelve al dominio correcto; una cuenta no autorizada no
	puede editar y un visitante no puede escribir mediante la API.
2. Crear y editar una planta o entrada se refleja en el blog y su ficha.
3. Las fotos nuevas aparecen, se pueden ampliar y no se rompen las existentes.
4. Los formularios funcionan en movil y cerrar sesion retira el editor.

El empaquetado SSR incluye sus dependencias para evitar enlaces simbolicos
restringidos en Windows y mantener una sola instancia de React.
