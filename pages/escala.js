import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useAuth } from '../context/AuthContext';
import { rosterGroups } from '../data/roster';

function statusClass(status) {
  return `roster-status roster-status--${status}`;
}

export default function EscalaPage() {
  const { user } = useAuth();
  const groups = rosterGroups;
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => (
    groups.slice(3).map((group) => group.id)
  ));

  const visibleGroups = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return groups;
    }

    return groups.filter((group) => {
      const inName = group.name.toLowerCase().includes(term);
      const inTasks = group.tasks.some((task) => (
        task.name.toLowerCase().includes(term)
        || task.category.toLowerCase().includes(term)
      ));

      return inName || inTasks;
    });
  }, [groups, query]);

  function toggleGroup(id) {
    setCollapsed((current) => (
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    ));
  }

  return (
    <>
      <Head>
        <title>Escala - Escala</title>
      </Head>
    <AuthenticatedLayout>
      <div className="roster">
        <div className="roster-views">
          <span className="roster-views__item is-active">Escala</span>
          <span className="roster-views__item">Calendário</span>
          <span className="roster-views__item">Progresso</span>
        </div>

        <div className="roster-toolbar">
          <div className="roster-toolbar__title">
            <strong>Escala</strong>
            {user.is_admin && (
              <button type="button" className="roster-new">+ Nova tarefa</button>
            )}
          </div>
          <label className="roster-filter">
            <i className="bi bi-search"></i>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrar pessoas ou postos"
              aria-label="Filtrar escala"
            />
          </label>
          <span className="roster-toolbar__meta">Agrupado por pessoa</span>
        </div>

        <div className="roster-board">
          {visibleGroups.length === 0 && (
            <div className="roster-empty">
              Nenhum colaborador com jornada para exibir.
            </div>
          )}

          {visibleGroups.map((group) => {
            const isCollapsed = collapsed.includes(group.id);

            return (
              <section key={group.id} className="roster-group">
                <button
                  type="button"
                  className="roster-group__head"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={!isCollapsed}
                >
                  <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-down'}`}></i>
                  <span className="roster-avatar">{group.initials}</span>
                  <Link
                    href={`/pessoa/${group.id}`}
                    className="roster-group__name-link"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {group.name}
                  </Link>
                  <span className="roster-group__count">{group.task_count} tarefas</span>
                  <span className="roster-group__shift">{group.jornada}</span>
                </button>

                {!isCollapsed && (
                  <div className="table-responsive">
                    <table className="roster-table">
                      <thead>
                        <tr>
                          <th>Posto</th>
                          <th>Início</th>
                          <th>Fim</th>
                          <th>Responsável</th>
                          <th>Status</th>
                          <th>Categoria</th>
                          <th>Código</th>
                          <th>Estimativa</th>
                          <th>Horas</th>
                          <th>Extra</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task) => (
                          <tr key={task.id}>
                            <td>
                              <span className={`roster-dot roster-dot--${task.status}`}></span>
                              {task.name}
                            </td>
                            <td>{task.start}</td>
                            <td>{task.end}</td>
                            <td>
                              <span className="roster-avatar roster-avatar--sm" title={group.name}>
                                {group.initials}
                              </span>
                            </td>
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
                          <td colSpan="8">Total da semana</td>
                          <td>{group.totals.hours} h</td>
                          <td>{group.totals.extra || '—'}</td>
                        </tr>
                      </tbody>
                    </table>
                    {user.is_admin && (
                      <button type="button" className="roster-add">+ Nova tarefa</button>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </AuthenticatedLayout>
    </>
  );
}
