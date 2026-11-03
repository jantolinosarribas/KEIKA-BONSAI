export default function WhosSection() {
  return (
    <section className="w-full mt-60">
      <div className="mx-10 text-right">
        <span className="text-8xl bbh-sans-bogle-regular text-green-800">
          WHOS BEHIND KEIKA BONSAI
        </span>
      </div>
      <div className="flex flex-col md:flex-row w-full px-10 my-2 text-right">
        <div className="w-full md:w-1/2"></div>
        <div className="flex flex-col w-full md:w-1/2 gap-5 text-green-900">
          <span className="text-xl">
            Soy José Miguel, tengo 23 años. Empecé germinando plantas por mi
            cuenta; después compré plantines, comencé a alambrarlos y a
            practicar con ellos. El bonsái me ha enseñado que no todo se puede
            apresurar: hay que observar cada árbol, pensar antes de actuar y
            aceptar que cada uno tiene su ritmo. Sigo aprendiendo y disfrutando
            de cada pequeño cambio.
          </span>
          <span className="text-xl">
            Por ahora solo he asistido a una sesión de aprendizaje en la
            Escuela de Bonsái Granada. Allí trabajé un plantón de junípero hasta
            convertirlo en un bonsái en semicascada que puedes ver en una de
            las fotos. Estudié diseño y desarrollo de software, y esta web me
            pareció una buena forma de unir esa formación con mi afición y
            compartir el camino.
          </span>
          <a
            href="/about"
            className="group inline-flex items-center justify-end gap-2 text-xl underline decoration-green-700 hover:decoration-green-400"
          >
            <span>Si quieres conocer más sobre mí y mi recorrido...</span>
            <span
              aria-hidden="true"
              className="translate-x-[-0.25rem] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
