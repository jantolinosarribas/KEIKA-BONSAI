export default function WhosSection() {
  return (
    <section className="w-full h-screen">
      <div className="mx-10 text-right">
        <span className="text-8xl bbh-sans-bogle-regular text-green-800">
          WHOS BEHIND KEIKA BONSAI
        </span>
      </div>
      <div className="flex w-full px-10 my-2 text-right">
        <div className="w-1/2"></div>
        <div className="flex flex-col w-1/2 gap-5 text-green-900">
          <span className="text-xl">
            Soy José Miguel Antolinos, aunque muchos me conocen como Jaxxty. Soy
            desarrollador de software, tengo 22 años y actualmente vivo en
            Granada. Este proyecto nace de un descubrimiento personal: durante
            el verano comencé a interesarme por el arte del bonsái, y poco a
            poco fui quedando fascinado por su calma, su detalle y su filosofía.
          </span>
          <span className="text-xl">
            Combinando mi gusto por la tecnología con esta nueva afición, decidí
            crear Keika Bonsai como un espacio donde compartir mi progreso,
            aprendizajes y experiencias mientras avanzo en este camino. Más que
            una web, es una forma de documentar mi crecimiento —tanto en el arte
            del bonsái como en mi desarrollo personal y creativo.
          </span>
          <a href="/about" className="text-xl underline decoration-green-700 hover:decoration-green-400 cursor-aointer">
            Si quieres conocer más sobre mí y mi recorrido...
          </a>
        </div>
      </div>
    </section>
  );
}
