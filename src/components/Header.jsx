import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full z-50 absolute top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-24 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center" onClick={closeMenu}>
            <img
              src="/logo.webp"
              alt="HARVYST"
              className="h-16 lg:h-20 xl:h-24 w-auto object-contain"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-base font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/our-works"
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Our Works
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 shadow-lg">
          <nav className="flex flex-col items-center py-8 gap-6 text-xl font-medium">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/our-works"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-green-600"
                  : "text-gray-800 hover:text-green-600 transition-colors"
              }
            >
              Our Works
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}