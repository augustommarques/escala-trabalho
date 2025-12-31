import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

function navClass(pathname, path) {
  const active =
    path === '/dashboard'
      ? pathname === path
      : pathname === path || pathname.startsWith(`${path}/`);

  return active ? 'nav-link active' : 'nav-link';
}

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useRouter();

  return (
    <nav
      className="app-sidebar navbar show navbar-vertical navbar-expand-lg px-0 py-4"
      id="navbarVertical"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler ms-n2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={navClass(pathname, '/dashboard')}
                href="/dashboard"
              >
                Painel
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navClass(pathname, '/escala')} href="/escala">
                Escala
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navClass(pathname, '/pessoa')} href="/pessoa">
                Por pessoa
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={navClass(pathname, '/marketplace')}
                href="/marketplace"
              >
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navClass(pathname, '/painel')} href="/painel">
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navClass(pathname, '/neon')} href="/neon">
                Neon
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={navClass(pathname, '/calendario')}
                href="/calendario"
              >
                Calendário
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={navClass(pathname, '/cobertura')}
                href="/cobertura"
              >
                Cobertura
              </Link>
            </li>
            <li className="nav-item">
              <Link className={navClass(pathname, '/agentes')} href="/agentes">
                Agentes
              </Link>
            </li>
            {user.is_admin && (
              <>
                <li className="nav-item">
                  <Link
                    className={navClass(pathname, '/usuarios')}
                    href="/usuarios"
                  >
                    Usuários
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={navClass(pathname, '/categorias')}
                    href="/categorias"
                  >
                    Categorias
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" href="/dashboard">
                Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
