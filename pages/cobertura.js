import Head from 'next/head';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { coverageHours, coverageRows, coverageTotals } from '../data/coverage';

export default function CoberturaPage() {
  const hours = coverageHours;
  const rows = coverageRows;
  const totals = coverageTotals;
  const grandTotal = totals.reduce((sum, value) => sum + value, 0);

  return (
    <>
      <Head>
        <title>Cobertura - Escala</title>
      </Head>
    <AuthenticatedLayout>
      <div className="coverage">
        <div className="coverage-toolbar">
          <div>
            <h1 className="h4 mb-0">Cobertura por hora</h1>
            <p className="text-muted text-sm mb-0">Pessoas necessárias em cada posto, das 7h às 22h</p>
          </div>
          <div className="coverage-legend">
            <span><i className="coverage-swatch coverage-cell--empty"></i> 0</span>
            <span><i className="coverage-swatch coverage-cell--low"></i> 1</span>
            <span><i className="coverage-swatch coverage-cell--ok"></i> 2 ou mais</span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="coverage-empty">Nenhum posto de cobertura cadastrado.</div>
        ) : (
          <div className="table-responsive">
            <table className="coverage-table">
              <thead>
                <tr>
                  <th className="coverage-table__sector">Posto</th>
                  {hours.map((hour) => (
                    <th key={hour}>{hour}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">
                      <span className="coverage-label">
                        <i style={{ background: row.color }}></i>
                        {row.name}
                      </span>
                    </th>
                    {row.cells.map((cell) => (
                      <td key={`${row.id}-${cell.hour}`} className={`coverage-cell coverage-cell--${cell.tone}`}>
                        {cell.value}
                      </td>
                    ))}
                    <td className="coverage-total">{row.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  {totals.map((value, index) => (
                    <td key={`total-${hours[index]}`} className="coverage-total">{value}</td>
                  ))}
                  <td className="coverage-total">{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
    </>
  );
}
