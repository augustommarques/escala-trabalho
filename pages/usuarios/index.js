import Head from 'next/head';
import Link from 'next/link';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { users } from '../../data/users';

export default function UsuariosPage() {
  const rows = users.data ?? [];

  return (
    <>
      <Head>
        <title>Usuários - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-3 mb-sm-0">
              <h1 className="h2 mb-1 app-page-title">Usuários</h1>
              <p className="text-sm text-muted mb-0">Cadastre e gerencie os acessos do sistema</p>
            </div>
            <div className="col-sm-6 col-12 text-sm-end">
              <Link href="/usuarios/criar" className="btn btn-primary">
                Novo usuário
              </Link>
            </div>
          </div>
        </div>
      )}
    >
      <main className="py-6">
        <div className="container-fluid">
          <div className="card shadow border-0">
            <div className="card-header">
              <h5 className="mb-0">Usuários cadastrados</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Perfil</th>
                    <th scope="col">Jornada</th>
                    <th scope="col">Cadastrado em</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-5">
                        Nenhum usuário cadastrado.
                      </td>
                    </tr>
                  )}
                  {rows.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <span className="avatar avatar-sm bg-soft-primary text-primary rounded-circle me-2">{user.initials}</span>
                        <span className="text-heading font-semibold">{user.name}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role_label}</td>
                      <td>{user.jornada || '—'}</td>
                      <td>{user.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.total > 0 && (
              <div className="card-footer border-0 py-5">
                <span className="text-muted text-sm">
                  Mostrando {users.from} a {users.to} de {users.total} usuários
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
    </>
  );
}
