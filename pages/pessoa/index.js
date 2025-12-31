import Head from 'next/head';
import Link from 'next/link';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { rosterGroups } from '../../data/roster';

export default function PessoaIndexPage() {
  return (
    <>
      <Head>
        <title>Por pessoa - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <h1 className="h2 mb-1 app-page-title">Escala por pessoa</h1>
          <p className="text-sm text-muted mb-0">Selecione um colaborador para ver a escala da semana</p>
        </div>
      )}
    >
      <main className="py-6">
        <div className="container-fluid">
          <div className="person-grid">
            {rosterGroups.map((person) => (
              <Link key={person.id} href={`/pessoa/${person.id}`} className="person-card">
                <span className="roster-avatar person-card__avatar">{person.initials}</span>
                <span className="person-card__body">
                  <strong>{person.name}</strong>
                  <span>{person.jornada}</span>
                  <span>{person.task_count} tarefas · {person.totals.hours} h</span>
                </span>
                <i className="bi bi-chevron-right person-card__arrow"></i>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
    </>
  );
}
