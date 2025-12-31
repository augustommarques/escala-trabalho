import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { rosterGroups } from '../../data/roster';
import { scheduleGroups, scheduleHours, scheduleTitle } from '../../data/schedule';

function statusClass(status) {
  return `roster-status roster-status--${status}`;
}

function cellClass(cell) {
  if (cell.post) {
    return 'schedule-cell schedule-cell--post';
  }

  return cell.in_shift ? 'schedule-cell schedule-cell--idle' : 'schedule-cell schedule-cell--off';
}

function findScheduleRow(name) {
  for (const group of scheduleGroups) {
    const row = group.rows.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (row) {
      return row;
    }
  }
  return null;
}

export default function PessoaDetailPage() {
  const router = useRouter();
  const personId = Number(router.query.id);
  const person = rosterGroups.find((group) => group.id === personId);
  const dayRow = person ? findScheduleRow(person.name) : null;

  if (!router.isReady) {
    return null;
  }

  if (!person) {
    return (
      <AuthenticatedLayout
        header={(
          <div className="container-fluid">
            <h1 className="h2 mb-1 app-page-title">Pessoa não encontrada</h1>
          </div>
        )}
      >
        <main className="py-6">
          <div className="container-fluid">
            <p className="text-muted">Não há escala cadastrada para este colaborador.</p>
            <Link href="/pessoa" className="btn btn-neutral">Voltar</Link>
          </div>
        </main>
      </AuthenticatedLayout>
    );
  }

  return (
    <>
      <Head>
        <title>{person ? `${person.name} - Escala` : "Pessoa - Escala"}</title>
      </Head>
    <AuthenticatedLayout
      header={(
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-sm-8 col-12 mb-3 mb-sm-0">
              <div className="person-hero">
                <span className="roster-avatar person-hero__avatar">{person.initials}</span>
                <div>
                  <h1 className="h2 mb-1 app-page-title">{person.name}</h1>
                  <p className="text-sm text-muted mb-0">
                    Jornada {person.jornada} · {person.task_count} tarefas · {person.totals.hours} h
                    {person.totals.extra ? ` · ${person.totals.extra} h extra` : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-12 text-sm-end">
              <Link href="/pessoa" className="btn btn-neutral">Todas as pessoas</Link>
            </div>
          </div>
        </div>
      )}
    >
      <div className="person-schedule">
        <section className="person-schedule__section">
          <div className="person-schedule__heading">
            <h2>Semana</h2>
            <p>Postos e status por dia</p>
          </div>

          <div className="table-responsive">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Posto</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Código</th>
                  <th>Estimativa</th>
                  <th>Horas</th>
                  <th>Extra</th>
                </tr>
              </thead>
              <tbody>
                {person.tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span className={`roster-dot roster-dot--${task.status}`}></span>
                      {task.name}
                    </td>
                    <td>{task.start}</td>
                    <td>{task.end}</td>
                    <td>
                      <span className={statusClass(task.status)}>{task.status_label}</span>
                    </td>
                    <td>
                      <span className="roster-tag">
                        <i style={{ background: task.category_color }}></i>
                        {task.category}
                      </span>
                    </td>
                    <td>
                      <span className="roster-code" style={{ background: task.category_color }}>
                        {task.code}
                      </span>
                    </td>
                    <td>{task.estimate}</td>
                    <td>{task.hours || '—'}</td>
                    <td>{task.extra || '—'}</td>
                  </tr>
                ))}
                <tr className="roster-total">
                  <td colSpan="7">Total da semana</td>
                  <td>{person.totals.hours} h</td>
                  <td>{person.totals.extra || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {dayRow && (
          <section className="person-schedule__section">
            <div className="person-schedule__heading">
              <h2>Grade horária</h2>
              <p>{scheduleTitle}</p>
            </div>

            <div className="table-responsive">
              <table className="schedule-table person-schedule__day">
                <thead>
                  <tr className="schedule-table__hours">
                    <th>Jornada</th>
                    <th>Mesa</th>
                    {scheduleHours.map((hour) => (
                      <th key={hour}>{hour}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="schedule-jornada">{dayRow.jornada}</td>
                    <td className="schedule-mesa">
                      <span style={{ background: dayRow.mesa_color }}></span>
                    </td>
                    {dayRow.cells.map((cell) => (
                      <td
                        key={`${dayRow.id}-${cell.hour}`}
                        colSpan={cell.span}
                        className={cellClass(cell)}
                        style={cell.color ? { background: cell.color } : undefined}
                      >
                        {cell.post}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="person-schedule__nav">
          {rosterGroups.map((item) => (
            <Link
              key={item.id}
              href={`/pessoa/${item.id}`}
              className={item.id === person.id ? 'is-active' : ''}
            >
              {item.initials}
            </Link>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
    </>
  );
}
