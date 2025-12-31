import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { roles } from '../../data/users';

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <div className="invalid-feedback d-block">{message}</div>;
}

export default function CriarUsuarioPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: '',
    email: '',
    role: 'usuario',
    jornada: '',
    password: '',
    password_confirmation: '',
  });

  function updateField(field, value) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!data.name.trim()) nextErrors.name = 'Informe o nome.';
    if (!data.email.trim()) nextErrors.email = 'Informe o e-mail.';
    if (!data.password) nextErrors.password = 'Informe a senha.';
    if (data.password !== data.password_confirmation) {
      nextErrors.password_confirmation = 'A confirmação não confere.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setProcessing(true);
    router.push('/usuarios');
  }

  return (
    <>
      <Head>
        <title>Novo usuário - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-3 mb-sm-0">
              <h1 className="h2 mb-1 app-page-title">Novo usuário</h1>
              <p className="text-sm text-muted mb-0">Preencha os dados para criar o acesso</p>
            </div>
            <div className="col-sm-6 col-12 text-sm-end">
              <Link href="/usuarios" className="btn btn-neutral">
                Voltar
              </Link>
            </div>
          </div>
        </div>
      )}
    >
      <main className="py-6">
        <div className="container-fluid">
          <div className="card shadow border-0" style={{ maxWidth: 640 }}>
            <div className="card-header">
              <h5 className="mb-0">Dados do usuário</h5>
            </div>
            <div className="card-body">
              <form onSubmit={submit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">Nome</label>
                  <input
                    id="name"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={data.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    autoComplete="name"
                    autoFocus
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={data.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    autoComplete="username"
                  />
                  <FieldError message={errors.email} />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">Perfil</label>
                  <select
                    id="role"
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    value={data.role}
                    onChange={(event) => updateField('role', event.target.value)}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <FieldError message={errors.role} />
                </div>

                <div className="mb-4">
                  <label htmlFor="jornada" className="form-label">Jornada</label>
                  <input
                    id="jornada"
                    type="text"
                    className={`form-control ${errors.jornada ? 'is-invalid' : ''}`}
                    value={data.jornada}
                    onChange={(event) => updateField('jornada', event.target.value)}
                    placeholder="08:30-17:30"
                  />
                  <FieldError message={errors.jornada} />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Senha</label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={data.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    autoComplete="new-password"
                  />
                  <FieldError message={errors.password} />
                </div>

                <div className="mb-4">
                  <label htmlFor="password_confirmation" className="form-label">Confirmar senha</label>
                  <input
                    id="password_confirmation"
                    type="password"
                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                    value={data.password_confirmation}
                    onChange={(event) => updateField('password_confirmation', event.target.value)}
                    autoComplete="new-password"
                  />
                  <FieldError message={errors.password_confirmation} />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Link href="/usuarios" className="btn btn-neutral">Cancelar</Link>
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
    </>
  );
}
