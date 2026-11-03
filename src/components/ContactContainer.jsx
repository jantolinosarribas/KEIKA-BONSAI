import { ArrowUpRight, AtSign, Mail, Phone } from "lucide-react";

export default function ContactContainer() {
  return (
    <section className="w-full px-6 pb-32 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto flex max-w-2xl flex-col gap-5 text-center text-lg leading-relaxed text-green-900 md:text-xl">
          <p>
            ¿Te interesa el bonsái o también estás empezando? Me encantará
            leerte. Puedes escribirme para comentar la web, compartir tu
            experiencia o hablar de alguno de mis árboles.
          </p>
          <p>
            Yo también sigo aprendiendo, así que siempre está bien intercambiar
            ideas y descubrir otras formas de cuidar y trabajar las plantas.
          </p>
        </div>

        <address className="mt-12 not-italic">
          <ul className="grid gap-4 md:grid-cols-3">
            <li className="min-w-0">
              <a
                href="mailto:jantolinosarribas@gmail.com"
                className="group flex min-h-52 flex-col items-center justify-between rounded-sm border border-green-900/20 bg-white/35 px-5 py-6 text-center text-green-900 transition-colors duration-200 hover:border-green-800 hover:bg-green-900 hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
              >
                <Mail aria-hidden="true" size={26} strokeWidth={1.6} />
                <span className="my-5 min-w-0">
                  <span className="mb-1 block text-sm text-green-700 transition-colors group-hover:text-green-200">
                    Correo
                  </span>
                  <span className="break-all text-base sm:break-normal md:text-lg">
                    jantolinosarribas@gmail.com
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="translate-x-[-0.25rem] -translate-y-[-0.25rem] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  size={20}
                />
              </a>
            </li>
            <li className="min-w-0">
              <a
                href="tel:+34650533776"
                className="group flex min-h-52 flex-col items-center justify-between rounded-sm border border-green-900/20 bg-white/35 px-5 py-6 text-center text-green-900 transition-colors duration-200 hover:border-green-800 hover:bg-green-900 hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
              >
                <Phone aria-hidden="true" size={26} strokeWidth={1.6} />
                <span className="my-5">
                  <span className="mb-1 block text-sm text-green-700 transition-colors group-hover:text-green-200">
                    Teléfono
                  </span>
                  <span className="text-lg">650 533 776</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="translate-x-[-0.25rem] -translate-y-[-0.25rem] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  size={20}
                />
              </a>
            </li>
            <li className="min-w-0">
              <a
                href="https://www.instagram.com/keikabonsai/"
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-52 flex-col items-center justify-between rounded-sm border border-green-900/20 bg-white/35 px-5 py-6 text-center text-green-900 transition-colors duration-200 hover:border-green-800 hover:bg-green-900 hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
              >
                <AtSign aria-hidden="true" size={26} strokeWidth={1.6} />
                <span className="my-5">
                  <span className="mb-1 block text-sm text-green-700 transition-colors group-hover:text-green-200">
                    Instagram
                  </span>
                  <span className="text-lg">@keikabonsai</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="translate-x-[-0.25rem] -translate-y-[-0.25rem] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  size={20}
                />
              </a>
            </li>
          </ul>
        </address>
      </div>
    </section>
  );
}
