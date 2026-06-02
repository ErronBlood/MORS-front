import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Icon } from "./Icon";

export const Header = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode state with document theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Determine current page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/Dashboard":
        return "Dashboard";
      case "/PatientsPage":
        return "Pacientes";
      case "/DoctorsPage":
        return "Doctores";
      case "/CatalogPage":
        return "Catálogo";
      case "/OfficesPage":
        return "Consultorios";
      case "/AppointmentsPage":
        return "Citas";
      case "/ReportsPage":
        return "Reportes";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
          {getPageTitle()}
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        <button
          className="btn-icon"
          onClick={toggleDarkMode}
          title="Cambiar tema"
          style={{ position: "relative" }}
        >
          <Icon name={darkMode ? "wb_sunny" : "dark_mode"} size={20} />
        </button>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            color: "var(--accent)",
            fontSize: 13,
            fontWeight: 700,
            justifyContent: "center"
          }}
        >
        </div>
      </div>
    </header>
  );
};