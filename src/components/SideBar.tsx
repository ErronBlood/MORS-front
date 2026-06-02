import { NavLink } from "react-router";
import { Icon } from "./Icon";

const NAV = [
  { id: 'Dashboard',     icon: 'dashboard',       label: 'Dashboard',      path: '/Dashboard' },
  { id: 'PatientsPage',  icon: 'people',          label: 'Pacientes',      path: '/PatientsPage' },
  { id: 'DoctorsPage',   icon: 'medical_services',label: 'Doctores',       path: '/DoctorsPage' },
  { id: 'CatalogPage',   icon: 'category',        label: 'Catálogo',       path: '/CatalogPage' },
  { id: 'OfficesPage',   icon: 'meeting_room',    label: 'Consultorios',   path: '/OfficesPage' },
  { id: 'Appointments',  icon: 'assignment',      label: 'Citas',          path: '/AppointmentsPage' },
  { id: 'ReportsPage',   icon: 'bar_chart',       label: 'Reportes',       path: '/ReportsPage' },
];

export const SideBar = () => {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#006494', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="local_hospital" size={18} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '-0.01em' }}>UMO</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Consultorios</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {NAV.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? 'rgba(0,100,148,0.35)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              fontFamily: 'inherit',
              marginBottom: 2,
              transition: 'all 0.15s',
              textAlign: 'left',
              textDecoration: 'none',
              position: 'relative'
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 32, background: '#006494', borderRadius: '0 3px 3px 0' }} />
                )}
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#006494', boxShadow: '0 0 6px #006494' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Universidad — Sistema Médico</div>
      </div>
    </nav>
  );
};