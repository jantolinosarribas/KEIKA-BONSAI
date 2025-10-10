export default function ProjectsSection() {
  return (
    <section className="w-full h-screen bg-zinc-900">
      <div className="flex justify-center">
        <span className="text-8xl bbh-sans-bogle-regular text-stone-100">
          STUFF IM ON
        </span>
      </div>
      <div className="flex w-full px-10 my-10 text-xl">
        <div className="flex flex-col w-1/2 gap-5 text-stone-100">
          <span>
            Actualmente estoy trabajando en varios proyectos de bonsái, cada uno
            con características y objetivos propios. A continuación tienes una
            breve descripción de cada ejemplar:
          </span>
          <ul className="list-disc pl-6">
            <li>
              Granado (Punica granatum), un árbol de gran carácter que combina
              fuerza y elegancia. Estoy enfocando el trabajo en refinar la
              ramificación y potenciar su floración.
            </li>
            <li>
              Juniperus chinensis, una especie clásica en el arte del bonsái.
              Actualmente estoy desarrollando el movimiento del tronco y la
              definición de las nubes de follaje.
            </li>
            <li>
              Juniperus procumbens, de porte rastrero y muy expresivo. Estoy
              trabajando en la compactación de su masa verde y el equilibrio
              general del diseño.
            </li>
            <li>
              Acer palmatum, conocido por su espectacular colorido estacional.
              En este proyecto busco mejorar la estructura fina de ramas y
              realzar su silueta natural.
            </li>
            <li>
              Ficus carica, una especie mediterránea de hoja grande y carácter
              vigoroso. El objetivo es lograr un equilibrio entre vigor y
              refinamiento.
            </li>
            <li>
              Ficus macrocarpa, resistente y de crecimiento rápido, ideal para
              técnicas de modelado intensivo. Actualmente trabajo en la
              conicidad del tronco y la proporción de las raíces aéreas.
            </li>
          </ul>
        </div>
        <div className="w-1/2"></div>
      </div>
    </section>
  );
}
