import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <div className="invalid-feedback d-block">{message}</div>;
}

export default function CriarCategoriaPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Informe o nome.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setProcessing(true);
    router.push('/categorias');
  }

  return (
    <>
      <Head>
        <title>Nova categoria - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-6 col-12 mb-3 mb-sm-0">
              <h1 className="h2 mb-1 app-page-title">Nova categoria</h1>
              <p className="text-sm text-muted mb-0">Cadastre um posto ou atividade da escala</p>
            </div>
            <div className="col-sm-6 col-12 text-sm-end">
              <Link href="/categorias" className="btn btn-neutral">
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
              <h5 className="mb-0">Dados da categoria</h5>
            </div>
            <div className="card-body">
              <form onSubmit={submit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">Nome</label>
                  <input
                    id="name"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Link href="/categorias" className="btn btn-neutral">Cancelar</Link>
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
