import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // common nav classes
  const baseClasses = "transition";
  const activeClasses = "text-primary-400 font-semibold";

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary-800/90" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center text-primary-100 font-medium py-2 mobile:px-2 pc:px-[5rem]">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary-200">
          <NavLink to="/">
            <img
              src="/image/favicon.png"
              alt="Logo"
              className="object-contain w-36"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden tab:flex space-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Our Services
          </NavLink>
          <NavLink
            to="/about-us"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Our Portfolio
          </NavLink>
          <NavLink
            to="/contact-us"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/hire-us"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg bg-gradient-to-r from-primary-700 to-secondary-500 hover:opacity-90 transition ${
                isActive ? "ring-2 ring-primary-400" : ""
              }`
            }
          >
            Hire Us
          </NavLink>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="tab:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="tab:hidden w-full text-primary-200 font-medium px-4 pb-4 flex flex-col space-y-4 bg-primary-950/90">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Our Services
          </NavLink>
          <NavLink
            to="/about-us"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/portfolio"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Our Portfolio
          </NavLink>
          <NavLink
            to="/contact-us"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "hover:text-primary-400"}`
            }
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/hire-us"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg bg-gradient-to-r from-primary-700 to-secondary-500 hover:opacity-90 transition text-center ${
                isActive ? "ring-2 ring-primary-400" : ""
              }`
            }
          >
            Hire Us
          </NavLink>
        </div>
      )}
    </header>
  );
}
