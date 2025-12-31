const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function tone(value) {
  if (value <= 0) return 'empty';
  if (value === 1) return 'low';
  return 'ok';
}

function buildRow(id, name, color, requirements) {
  const cells = HOURS.map((hour) => {
    const value = requirements[hour] ?? 0;
    return { hour, value, tone: tone(value) };
  });

  return {
    id,
    name,
    color,
    cells,
    total: cells.reduce((sum, cell) => sum + cell.value, 0),
  };
}

const sectors = [
  { id: 1, name: 'CEAT', color: '#f48fb1', requirements: { 7: 0, 8: 1, 9: 3, 10: 3, 11: 3, 12: 5, 13: 4, 14: 3, 15: 2, 16: 4, 17: 3, 18: 3, 19: 2, 20: 3, 21: 0, 22: 0 } },
  { id: 2, name: 'BIBLIO', color: '#00897b', requirements: { 7: 0, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 0 } },
  { id: 3, name: 'LOJA', color: '#fb8c00', requirements: { 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 1, 13: 2, 14: 2, 15: 1, 16: 2, 17: 2, 18: 1, 19: 1, 20: 1, 21: 0, 22: 0 } },
  { id: 4, name: 'ODONTO', color: '#ab47bc', requirements: { 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 2, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 0, 22: 0 } },
  { id: 5, name: 'INGRESSO', color: '#ec407a', requirements: { 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0 } },
  { id: 6, name: 'CURSOS', color: '#26c6da', requirements: { 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0 } },
  { id: 7, name: 'PDV', color: '#fdd835', requirements: { 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0 } },
  { id: 8, name: 'TRIAGEM', color: '#43a047', requirements: { 7: 0, 8: 0, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 0, 22: 0 } },
];

export const coverageHours = HOURS.map((hour) => `${hour}h`);
export const coverageRows = sectors.map((sector) => buildRow(sector.id, sector.name, sector.color, sector.requirements));
export const coverageTotals = HOURS.map((_, index) => (
  coverageRows.reduce((sum, row) => sum + row.cells[index].value, 0)
));
