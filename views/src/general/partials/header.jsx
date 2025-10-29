import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../utilities/authContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Common nav classes
  const baseClasses = "transition";
  const activeClasses = "text-primary-400 font-semibold";

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary-800/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center text-primary-100 font-medium py-2 mobile:px-2 pc:px-[5rem]">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary-200">
          <NavLink to="/">
            <img
              src={settings?.avatar || "/image/favicon.png"}
              alt="Logo"
              className="object-contain w-36"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden tab:flex space-x-6 items-center">
          {[
            { to: "/", label: "Home" },
            { to: "/services", label: "Our Services" },
            { to: "/book-a-consultation", label: "Book Consultation" },
            { to: "/about-us", label: "About" },
            { to: "/portfolio", label: "Our Portfolio" },
            { to: "/contact-us", label: "Contact Us" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeClasses : "hover:text-primary-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

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
        <button
          className="tab:hidden text-2xl cursor-pointer focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="tab:hidden w-full text-primary-200 font-medium px-4 pb-4 flex flex-col space-y-4 bg-primary-950/90">
          {[
            { to: "/", label: "Home" },
            { to: "/services", label: "Our Services" },
            { to: "/book-a-consultation", label: "Consultation" },
            { to: "/about-us", label: "About" },
            { to: "/portfolio", label: "Our Portfolio" },
            { to: "/contact-us", label: "Contact Us" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeClasses : "hover:text-primary-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

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
