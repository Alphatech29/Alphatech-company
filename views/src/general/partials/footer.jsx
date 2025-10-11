import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTiktok
} from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../../utilities/authContext";

export default function Footer() {
  const { settings } = useAuth();

  return (
    <footer className="bg-primary-950 text-primary-50">
      <div className="py-12 px-4 mobile:px-4 tab:px-8 pc:px-16 flex flex-col tab:flex-row justify-between gap-12">
        {/* Brand & Description */}
        <div className="tab:w-[40%] pc:w-[40%]">
          <h2 className="text-2xl font-bold text-primary-200">
            <a href="/">
              <img
                src="/image/favicon.png"
                alt="footer logo"
                className="object-contain w-36"
              />
            </a>
          </h2>
          <p className="mt-4 text-primary-300 mobile:text-sm text-base leading-relaxed">
            {settings?.footer_description || ""}
          </p>
          <div className="flex space-x-4 mt-6 text-lg">
            {settings?.facebook_url && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                <FaFacebookF />
              </a>
            )}

            {settings?.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                <FaTwitter />
              </a>
            )}

            {settings?.instagram && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                <FaInstagram />
              </a>
            )}

            {settings?.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                <FaLinkedinIn />
              </a>
            )}

            {settings?.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition"
              >
                <FaTiktok />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="tab:w-1/3 pc:w-1/3">
          <h3 className="text-xl font-semibold text-primary-200">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-primary-300 mobile:text-sm text-base">
            {[
              { name: "Pricing", href: "/pricing" },
              { name: "Our Services", href: "/services" },
              { name: "About", href: "/about-us" },
              { name: "Contact", href: "/contact-us" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="flex items-center gap-2 hover:text-primary-400 transition"
                >
                  <MdKeyboardArrowRight className="text-primary-200 text-[20px]" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="tab:w-1/3 pc:w-1/3">
          <h3 className="text-xl font-semibold text-primary-200">Contact Us</h3>
          <div className="mt-4 flex flex-col gap-3 text-primary-300 mobile:text-sm text-base">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary-400" />
              <span>{settings?.address || "No address available"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-primary-400" />
              <a
                href={`mailto:${settings?.contact_email || ""}`}
                className="hover:text-primary-400"
              >
                {settings?.contact_email || "info@alphatech.com"}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary-400" />
              <a
                href={`tel:${settings?.contact_phone || ""}`}
                className="hover:text-primary-400"
              >
                {settings?.contact_phone || "+234 000 000 0000"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-primary-300 mt-8 py-4 px-4 tab:px-16 flex flex-col justify-center items-center gap-4 text-primary-300 text-sm">
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/privacy-policy"
            className="hover:text-primary-400 transition"
          >
            Privacy Policy
          </a>
          |
          <a
            href="/terms-of-service"
            className="hover:text-primary-400 transition"
          >
            Terms of Service
          </a>
        </div>
        <p className="text-center">
          &copy; {new Date().getFullYear()} Alphatech Multimedia Technologies -
          RC No: 3596357. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
