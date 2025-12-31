import Head from 'next/head';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useAuth } from '../context/AuthContext';
import { applications } from '../data/dashboard';

function StatCard({ label, value, icon, iconClass, badgeClass, badge, trend }) {
  return (
    <div className="col-xl-3 col-sm-6 col-12">
      <div className="card shadow border-0">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <span className="h6 font-semibold text-muted text-sm d-block mb-2">{label}</span>
              <span className="h3 font-bold mb-0">{value}</span>
            </div>
            <div className="col-auto">
              <div className={`icon icon-shape text-white text-lg rounded-circle ${iconClass}`}>
                <i className={`bi ${icon}`}></i>
              </div>
            </div>
          </div>
          <div className="mt-2 mb-0 text-sm">
            <span className={`badge badge-pill me-2 ${badgeClass}`}>
              <i className={`bi me-1 ${trend}`}></i>{badge}
            </span>
            <span className="text-nowrap text-xs text-muted">Desde o mês passado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Painel - Escala</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <h1 className="h2 mb-1 app-page-title">Painel</h1>
          <p className="text-sm text-muted mb-0">{user.name}</p>
        </div>
      )}
    >
      <main className="py-6">
        <div className="container-fluid">
          <div className="row g-6 mb-6">
            <StatCard label="Orçamento" value="$750.90" icon="bi-credit-card" iconClass="bg-tertiary" badgeClass="bg-soft-success text-success" badge="13%" trend="bi-arrow-up" />
            <StatCard label="Novos projetos" value="215" icon="bi-people" iconClass="bg-primary" badgeClass="bg-soft-success text-success" badge="30%" trend="bi-arrow-up" />
            <StatCard label="Horas totais" value="1.400" icon="bi-clock-history" iconClass="bg-info" badgeClass="bg-soft-danger text-danger" badge="-5%" trend="bi-arrow-down" />
            <StatCard label="Carga de trabalho" value="95%" icon="bi-minecart-loaded" iconClass="bg-warning" badgeClass="bg-soft-success text-success" badge="10%" trend="bi-arrow-up" />
          </div>

          <div className="card shadow border-0 mb-7">
            <div className="card-header">
              <h5 className="mb-0">Candidaturas</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Data</th>
                    <th scope="col">Empresa</th>
                    <th scope="col">Proposta</th>
                    <th scope="col">Reunião</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application, index) => (
                    <tr key={`${application.name}-${index}`}>
                      <td>
                        <span className="avatar avatar-sm bg-soft-primary text-primary rounded-circle me-2">{application.initials}</span>
                        <a className="text-heading font-semibold" href="#">{application.name}</a>
                      </td>
                      <td>{application.date}</td>
                      <td>
                        <a className="text-heading font-semibold" href="#">{application.company}</a>
                      </td>
                      <td>{application.offer}</td>
                      <td>
                        <span className="badge badge-lg badge-dot">
                          <i className={`bg-${application.statusColor}`}></i>{application.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <a href="#" className="btn btn-sm btn-neutral">Ver</a>
                        <button type="button" className="btn btn-sm btn-square btn-neutral text-danger-hover">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer border-0 py-5">
              <span className="text-muted text-sm">Mostrando 10 itens de 250 resultados</span>
            </div>
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
    </>
  );
}
