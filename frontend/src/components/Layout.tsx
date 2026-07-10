import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/carros', label: 'Carros', icon: '🚗' },
  { to: '/clientes', label: 'Clientes', icon: '👥' },
  { to: '/reservas', label: 'Reservas', icon: '📅' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🚙</span>
          <div>
            <strong>Locadora</strong>
            <small>Fleet Management</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.nome}</div>
          <button className="btn-ghost" onClick={handleLogout}>
            ⇥ Sair
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
