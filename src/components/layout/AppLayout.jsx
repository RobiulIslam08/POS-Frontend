import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNavItems } from "@/config/nav.config";
import { Menu, X } from "lucide-react";
import Header from "./Header";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children }) {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const navItems = getNavItems(t);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Navigation */}
      <nav className="bg-nav sticky top-0 z-50 shadow-md" ref={dropdownRef}>
        <div className="container mx-auto px-4">
          {/* Mobile toggle */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-nav-foreground font-semibold text-sm">
              {t("nav.sales")}
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-nav-foreground p-1"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Desktop nav */}
          <Navbar
            navItems={navItems}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

          {/* Mobile nav */}
          {mobileOpen && (
            <MobileNav
              navItems={navItems}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">{children}</main>
    </div>
  );
}
