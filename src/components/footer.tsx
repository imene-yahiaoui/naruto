import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-orange-600">
                  NarutoVerse
                </span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/characters"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium"
                >
                  Personnages
                </Link>
                <Link
                  to="/village"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium"
                >
                  Villages
                </Link>
                <Link
                  to="/clans"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium"
                >
                  Clans
                </Link>
                <Link
                  to="/tailed-beasts"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium"
                >
                  Bijū
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                aria-label="Ouvrir le menu"
                title="Ouvrir le menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/characters"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              >
                Personnages
              </Link>
              <Link
                to="/village"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              >
                Villages
              </Link>
              <Link
                to="/clans"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              >
                Clans
              </Link>
              <Link
                to="/tailed-beasts"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              >
                Bijū
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <footer className="bg-black text-white mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="text-center text-orange-400">
            Développé avec <span className="text-red-500">❤</span> par Sadek et
            sa maman
          </p>
          <p className="text-sm text-gray-400 mt-2">
            © {new Date().getFullYear()} NarutoVerse. Tous droits réservés.
          </p>
        </div>
      </footer>
    </>
  );
}
