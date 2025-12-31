const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const POST_COLORS = {
  ODONTO: '#f4d03f',
  'ALMOÇO': '#e67e22',
  BIBLIO: '#d68910',
  OFICINAS: '#f7dc6f',
  'OFICINAS/CEAT': '#f8c471',
  CEAT: '#f5b7b1',
  TRIAGEM: '#58d68d',
  'CR ON': '#ec7063',
  'BV SAÚDE MENTAL': '#f9e79f',
  LOJA: '#e59866',
  EMPRESA: '#af7ac5',
};

function inShift(jornada, hour) {
  const match = jornada.match(/(\d{1,2})h(\d{2})?\s*-\s*(\d{1,2})h(\d{2})?/);
  if (!match) return false;

  const startHour = Number(match[1]);
  const endHour = Number(match[3]);
  const endMinute = Number(match[4] ?? 0);
  const lastCell = endMinute > 0 ? endHour : endHour - 1;

  return hour >= startHour && hour <= lastCell;
}

function cells(slots, jornada) {
  const spans = [];
  let current = null;

  for (const hour of HOURS) {
    const post = slots[hour] ?? null;
    const onShift = inShift(jornada, hour);
    const key = `${post ?? ''}|${onShift ? '1' : '0'}`;

    if (current && current.key === key) {
      current.span += 1;
      continue;
    }

    if (current) {
      const { key: _key, ...rest } = current;
      spans.push(rest);
    }

    current = {
      hour,
      post,
      color: post ? (POST_COLORS[post] ?? '#d5d8dc') : null,
      in_shift: onShift,
      span: 1,
      key,
    };
  }

  if (current) {
    const { key: _key, ...rest } = current;
    spans.push(rest);
  }

  return spans;
}

function range(start, end, post) {
  const slots = {};
  for (let hour = start; hour <= end; hour += 1) {
    slots[hour] = post;
  }
  return slots;
}

const people = [
  { id: 1, name: 'Gizele', jornada: '7h-16h', mesa_color: '#f4d03f', section: 'odonto', slots: { ...range(7, 12, 'ODONTO'), 13: 'ALMOÇO', ...range(14, 15, 'ODONTO') } },
  { id: 2, name: 'Elizabeth', jornada: '12h-21h', mesa_color: '#85c1e9', section: 'odonto', slots: { 12: 'ODONTO', 13: 'ALMOÇO', ...range(14, 20, 'ODONTO') } },
  { id: 3, name: 'Francielle', jornada: '8h30-17h30', mesa_color: '#2c3e50', section: 'agentes', slots: { 8: 'BIBLIO', ...range(9, 10, 'OFICINAS'), ...range(11, 12, 'OFICINAS/CEAT'), 13: 'ALMOÇO', ...range(14, 15, 'OFICINAS'), 16: 'TRIAGEM' } },
  { id: 4, name: 'Leny', jornada: '8h30-17h30', mesa_color: '#bdc3c7', section: 'agentes', slots: { 8: 'CEAT', 9: 'TRIAGEM', ...range(10, 12, 'CEAT'), 13: 'ALMOÇO', 14: 'TRIAGEM', ...range(15, 16, 'CEAT') } },
  { id: 5, name: 'Paula', jornada: '9h-18h', mesa_color: '#bdc3c7', section: 'agentes', slots: { 9: 'CEAT', 10: 'TRIAGEM', ...range(11, 12, 'CEAT'), 13: 'ALMOÇO', 14: 'CEAT', ...range(15, 16, 'BV SAÚDE MENTAL'), 17: 'TRIAGEM' } },
  { id: 6, name: 'Eliana', jornada: '9h-18h', mesa_color: '#e74c3c', section: 'agentes', slots: { ...range(9, 10, 'CR ON'), 11: 'TRIAGEM', 12: 'CEAT', 13: 'ALMOÇO', ...range(14, 17, 'CEAT') } },
  { id: 7, name: 'Diego', jornada: '9h-18h', mesa_color: '#e74c3c', section: 'agentes', slots: { ...range(9, 12, 'BIBLIO'), 13: 'ALMOÇO', ...range(14, 16, 'BIBLIO'), 17: 'CEAT' } },
];

const sectionTitles = {
  odonto: 'Odontologia',
  apoio: 'Apoio e secretaria',
  agentes: 'Agentes',
};

const grouped = {};
for (const person of people) {
  if (!grouped[person.section]) {
    grouped[person.section] = [];
  }
  grouped[person.section].push(person);
}

export const scheduleTitle = 'Agentes · Terça-feira';
export const scheduleHours = HOURS.map((hour) => `${hour}h`);
export const scheduleGroups = Object.entries(grouped).map(([section, sectionPeople]) => ({
  key: section,
  title: sectionTitles[section] ?? 'Agentes',
  rows: sectionPeople.map((person) => ({
    id: person.id,
    name: person.name,
    jornada: person.jornada,
    mesa_color: person.mesa_color,
    cells: cells(person.slots, person.jornada),
  })),
}));
