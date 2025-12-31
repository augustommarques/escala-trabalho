import Head from 'next/head';
import Link from 'next/link';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { categories } from '../../data/categories';

export default function CategoriasPage() {
  const rows = categories.data ?? [];

  return (
    <>
      <Head>
        <title>Categorias - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-3 mb-sm-0">
              <h1 className="h2 mb-1 app-page-title">Categorias</h1>
              <p className="text-sm text-muted mb-0">Postos e atividades da escala</p>
            </div>
            <div className="col-sm-6 col-12 text-sm-end">
              <Link href="/categorias/criar" className="btn btn-primary">
                Nova categoria
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
              <h5 className="mb-0">Categorias cadastradas</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Cadastrada em</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center text-muted py-5">
                        Nenhuma categoria cadastrada.
                      </td>
                    </tr>
                  )}
                  {rows.map((category) => (
                    <tr key={category.id}>
                      <td className="text-heading font-semibold">{category.name}</td>
                      <td>{category.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {categories.total > 0 && (
              <div className="card-footer border-0 py-5">
                <span className="text-muted text-sm">
                  Mostrando {categories.from} a {categories.to} de {categories.total} categorias
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
