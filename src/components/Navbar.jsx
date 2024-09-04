import { appleImg, searchImg } from "../utils";
import { navLists } from "../constants";
import Image from "next/image";
const Navbar = () => {
  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-center items-center ">
      <nav className="flex w-full screen-max-width">
        <Image src={appleImg} alt="Apple" width={54} height={48} />
        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <div
              key={nav}
              className="px-5 text-sm: cursor-pointer  text-black hover:text-gray transition-all"
            >
              {nav}
            </div>
          ))}
        </div>
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <Image src={searchImg} alt="search" width={48} height={48} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
