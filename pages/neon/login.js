import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NeonLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@escala.test');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      router.push('/neon');
    }, 500);
  }

  return (
    <>
      <Head>
        <title>Neon Login - Escala</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        <style>{`body:has(.neon-shell),body:has(.neon-login-shell){overflow:auto!important;height:auto!important;background:#0a001a!important;}`}</style>
      </Head>
    <div className="neon-login-shell">
      <section className="neon-login-hero">
        <Link href="/neon" className="neon-login-brand">
          <i className="fa-solid fa-bolt" />
          Neon Dashboard
        </Link>

        <div className="neon-login-hero-copy">
          <h1>
            Acesse o painel
            <br />
            <span>cyber-ready</span>
          </h1>
          <p>
            Entre para visualizar métricas ao vivo, pipelines neon e o overview operacional
            do dashboard.
          </p>
        </div>

        <div className="neon-login-stats">
          <article>
            <strong>2.4k</strong>
            <span>Sessions</span>
          </article>
          <article>
            <strong>98%</strong>
            <span>Uptime</span>
          </article>
          <article>
            <strong>64%</strong>
            <span>Conversion</span>
          </article>
        </div>
      </section>

      <section className="neon-login-panel">
        <div className="neon-login-card">
          <header>
            <h2>Sign in</h2>
            <p>Use suas credenciais para entrar no Neon Dashboard.</p>
          </header>

          <form className="neon-login-form" onSubmit={submit}>
            {error && <div className="neon-login-error">{error}</div>}

            <div className="neon-field">
              <label htmlFor="neon-email">E-mail</label>
              <div className="neon-field-control">
                <i className="fa-regular fa-envelope" />
                <input
                  id="neon-email"
                  type="email"
                  autoComplete="username"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="neon-field">
              <label htmlFor="neon-password">Senha</label>
              <div className="neon-field-control">
                <i className="fa-solid fa-lock" />
                <input
                  id="neon-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: '#9b8bb8',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <div className="neon-login-row">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Lembrar-me
              </label>
              <a href="#forgot">Esqueci a senha</a>
            </div>

            <button type="submit" className="neon-login-submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="neon-login-divider">ou</div>

            <div className="neon-login-alt">
              <button type="button">
                <i className="fa-brands fa-google" />
                Google
              </button>
              <button type="button">
                <i className="fa-brands fa-github" />
                GitHub
              </button>
            </div>
          </form>

          <div className="neon-login-footer">
            Ainda sem conta? <a href="#register">Criar acesso</a>
            {' · '}
            <Link href="/dashboard">Escala</Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
