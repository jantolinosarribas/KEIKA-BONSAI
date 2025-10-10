export default function Header() {
  return (
    <header className="fixed top-0 left-0 bg-green/30 backdrop-blur-md w-full h-20 z-20 flex items-center justify-between px-5">
      <h1 className="text-4xl bbh-sans-bogle-regular text-green-800 cursor-pointer">
        <a href="/">KEIKABONSAI</a>
      </h1>
      <div className="hidden text-lg md:flex items-center gap-20">
        <span className="header-link"><a href="/work">Work</a></span>
        <span className="header-link">
          <a href="/about">About Me</a>
        </span>
        <span className="header-link"><a href="/contact">Contact</a></span>
      </div>
      <div className="hidden text-lg md:flex items-center gap-10">
        <div>
          <span className="header-link"> Log In</span>
        </div>
        <div>
          <span className="header-link">Sign In</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 h-1/2 md:hidden justify-center">
        <span className="block w-6 h-1 bg-green-800"></span>
        <span className="block w-6 h-1 bg-green-800"></span>
        <span className="block w-6 h-1 bg-green-800"></span>
      </div>
    </header>
  );
}
