import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function BrandHeader() {
  const { user } = useAuth();
  const { pathname } = useRouter();

  return (
    <>
      <div className="app-utility">
        <Link href="/dashboard">Perfil</Link>
        <button type="button">Sair</button>
      </div>
      <div className="app-brandbar">
        <Link className="app-brand" href="/dashboard">
          <img
            className="app-brand__logo"
            src="/brand/sesc-horizontal-negativa.png"
            alt="Sesc"
          />
          <span>| escala</span>
        </Link>
        <nav className="app-brandnav">
          <Link
            className={pathname === '/dashboard' ? 'is-active' : ''}
            href="/dashboard"
          >
            Painel
          </Link>
          <Link
            className={pathname.startsWith('/escala') ? 'is-active' : ''}
            href="/escala"
          >
            Escala
          </Link>
          <Link
            className={pathname.startsWith('/pessoa') ? 'is-active' : ''}
            href="/pessoa"
          >
            Por pessoa
          </Link>
          <Link
            className={pathname.startsWith('/marketplace') ? 'is-active' : ''}
            href="/marketplace"
          >
            Marketplace
          </Link>
          <Link
            className={pathname.startsWith('/painel') ? 'is-active' : ''}
            href="/painel"
          >
            Analytics
          </Link>
          <Link
            className={pathname.startsWith('/neon') ? 'is-active' : ''}
            href="/neon"
          >
            Neon
          </Link>
          <Link
            className={pathname.startsWith('/calendario') ? 'is-active' : ''}
            href="/calendario"
          >
            Calendário
          </Link>
          <Link
            className={pathname.startsWith('/cobertura') ? 'is-active' : ''}
            href="/cobertura"
          >
            Cobertura
          </Link>
          <Link
            className={pathname.startsWith('/agentes') ? 'is-active' : ''}
            href="/agentes"
          >
            Agentes
          </Link>
          {user.is_admin && (
            <>
              <Link
                className={pathname.startsWith('/usuarios') ? 'is-active' : ''}
                href="/usuarios"
              >
                Usuários
              </Link>
              <Link
                className={pathname.startsWith('/categorias') ? 'is-active' : ''}
                href="/categorias"
              >
                Categorias
              </Link>
            </>
          )}
        </nav>
        <label className="app-search">
          <input type="search" placeholder="Buscar" aria-label="Buscar" />
          <i className="bi bi-search ms-2"></i>
        </label>
      </div>
      <span className="visually-hidden">{user.name}</span>
    </>
  );
}
