# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Arbolario

El catálogo está en [src/data/plants.ts](src/data/plants.ts). Cada ejemplar tiene
un `id` único y estable, por ejemplo `higuera-001`, y su ficha se genera en
`/arbolario/higuera-001` mediante una plantilla compartida. No cambies el ID al
cambiar el nombre o la categoría del árbol; otro ejemplar de la misma especie
debe tener otro ID.

Los campos opcionales `age`, `cultivationTime`, `origin`, `location`, `substrate`
y `futureDesign` completan la ficha. Los campos sin datos se muestran como
pendientes, sin inventar información.

Las publicaciones se añaden al array `journalEntries` de
[src/data/journalEntries.ts](src/data/journalEntries.ts). Cada una debe incluir
`id`, `plantId` (el ID exacto del ejemplar), `date` (formato `YYYY-MM-DD`),
`dateLabel`, `title` y `description`. También admite `observation`, `nextStep` y
`photos` (objetos con `src` y `alt`). Una misma publicación aparece en el blog
de su categoría y en la ficha de su árbol, ordenada por fecha descendente.

Al ejecutar `npm run build`, Astro genera una página estática por ejemplar.
Para publicar cambios de datos hay que generar y desplegar de nuevo la web.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
