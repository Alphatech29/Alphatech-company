import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../utilities/authContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { settings } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseClasses = "transition";
  const activeClasses = "text-primary-400 font-semibold";

  const menuItems = [
    { to: "/", label: "Home" },
    { to: "/book-a-consultation", label: "Book Consultation" },
     {
      label: "Resources",
      dropdown: [
        { to: "/blog", label: "Blogs" },
      ],
    },
    { to: "/about-us", label: "About" },
    { to: "/portfolio", label: "Our Portfolio" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-primary-800/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center text-primary-100 font-medium py-2 mobile:px-2 pc:px-[5rem]">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-primary-200">
          <img
            src={settings?.avatar || "/image/favicon.png"}
            alt="Logo"
            className="object-contain w-36"
          />
        </NavLink>

        {/* Menu Icon for Mobile */}
        <button
          className="tab:hidden text-2xl cursor-pointer focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Unified Menu */}
        <nav
          className={`${
            menuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-primary-950/90 text-primary-200 px-4 py-4 space-y-3"
              : "hidden tab:flex tab:space-x-6 items-center"
          } transition-all duration-300`}
        >
          {menuItems.map((item, index) =>
            item.dropdown ? (
              <div key={index} className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 hover:text-primary-400 transition"
                >
                  <span>{item.label}</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className={`${
                      menuOpen
                        ? "flex flex-col space-y-2 mt-2 pl-4"
                        : "absolute left-0 mt-2 w-48 bg-primary-900 rounded-lg shadow-lg flex flex-col z-50"
                    }`}
                  >
                    {item.dropdown.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-primary-800 hover:text-primary-400 transition"
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${baseClasses} ${
                    isActive ? activeClasses : "hover:text-primary-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}

          {/* Hire Us Button */}
          <NavLink
            to="/hire-us"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg bg-gradient-to-r from-primary-700 to-secondary-500 hover:opacity-90 transition text-center ${
                isActive ? "ring-2 ring-primary-400" : ""
              }`
            }
          >
            Hire Us
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
