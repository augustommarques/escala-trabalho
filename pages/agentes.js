import Head from 'next/head';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { scheduleGroups, scheduleHours, scheduleTitle } from '../data/schedule';

function cellClass(cell) {
  if (cell.post) {
    return 'schedule-cell schedule-cell--post';
  }

  return cell.in_shift ? 'schedule-cell schedule-cell--idle' : 'schedule-cell schedule-cell--off';
}

export default function AgentesPage() {
  const title = scheduleTitle;
  const hours = scheduleHours;
  const groups = scheduleGroups;

  return (
    <>
      <Head>
        <title>Agentes - Escala</title>
      </Head>
    <AuthenticatedLayout>
      <div className="schedule">
        <div className="schedule-banner">{title}</div>

        {groups.length === 0 ? (
          <div className="schedule-empty">Nenhuma escala de agentes cadastrada.</div>
        ) : (
          <div className="table-responsive">
            <table className="schedule-table">
              {groups.map((group) => (
                <tbody key={group.key}>
                  <tr className="schedule-table__hours">
                    <th>Equipe</th>
                    <th>Jornada</th>
                    <th>Mesa</th>
                    {hours.map((hour) => (
                      <th key={`${group.key}-${hour}`}>{hour}</th>
                    ))}
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.name}</th>
                      <td className="schedule-jornada">{row.jornada}</td>
                      <td className="schedule-mesa">
                        <span style={{ background: row.mesa_color }}></span>
                      </td>
                      {row.cells.map((cell) => (
                        <td
                          key={`${row.id}-${cell.hour}`}
                          colSpan={cell.span}
                          className={cellClass(cell)}
                          style={cell.color ? { background: cell.color } : undefined}
                        >
                          {cell.post}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
    </>
  );
}
