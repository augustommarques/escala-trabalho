import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const TABS = ['My Events', 'Swaps', 'Open Shifts'];
const WEEKDAYS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

/** @typedef {'shift'|'light'|'heart'|'deny'|'tool'|'dots'|null} CellKind */

/**
 * @param {number} year
 * @param {number} monthIndex
 * @param {Record<number, { kind: CellKind, label?: string }>} marks
 */
function buildMonth(year, monthIndex, marks) {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push({ empty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const mark = marks[day] ?? { kind: null };
    cells.push({
      empty: false,
      day,
      kind: mark.kind,
      label: mark.label,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ empty: true });
  }

  return cells;
}

const SEPTEMBER_MARKS = {
  1: { kind: 'light' },
  2: { kind: 'light' },
  3: { kind: 'light' },
  4: { kind: 'dots' },
  5: { kind: 'shift' },
  6: { kind: 'deny' },
  7: { kind: 'tool' },
  8: { kind: 'shift' },
  9: { kind: 'shift' },
  10: { kind: 'shift' },
  11: { kind: 'shift' },
  12: { kind: 'shift' },
  14: { kind: 'shift' },
  15: { kind: 'shift' },
  16: { kind: 'shift' },
  17: { kind: 'shift' },
  18: { kind: 'dots' },
  19: { kind: 'heart' },
  21: { kind: 'shift' },
  22: { kind: 'shift' },
  23: { kind: 'shift' },
  24: { kind: 'shift' },
  25: { kind: 'dots' },
  26: { kind: 'deny' },
  27: { kind: 'deny' },
  28: { kind: 'shift' },
  29: { kind: 'shift' },
  30: { kind: 'shift' },
};

const OCTOBER_MARKS = {
  1: { kind: 'shift' },
  2: { kind: 'dots' },
  3: { kind: 'shift' },
  4: { kind: 'shift' },
  5: { kind: 'shift' },
  6: { kind: 'dots' },
  7: { kind: 'shift' },
  8: { kind: 'shift' },
  9: { kind: 'shift' },
  10: { kind: 'shift' },
  11: { kind: 'shift' },
  12: { kind: 'shift', label: 'IPD' },
  13: { kind: 'shift' },
  14: { kind: 'shift' },
  15: { kind: 'shift' },
  16: { kind: 'dots' },
  17: { kind: 'shift' },
  18: { kind: 'shift' },
  19: { kind: 'shift' },
  20: { kind: 'shift' },
  21: { kind: 'shift' },
  22: { kind: 'shift' },
  23: { kind: 'shift' },
  24: { kind: 'shift' },
  25: { kind: 'shift' },
  26: { kind: 'shift' },
  27: { kind: 'shift' },
  28: { kind: 'shift' },
  29: { kind: 'shift' },
  30: { kind: 'shift' },
  31: { kind: 'shift' },
};

function cellClass(kind) {
  if (kind === 'shift' || kind === 'dots') return 'ng-cell ng-cell--shift';
  if (kind === 'light') return 'ng-cell ng-cell--light';
  if (kind === 'heart') return 'ng-cell ng-cell--heart';
  if (kind === 'deny') return 'ng-cell ng-cell--empty ng-cell--deny';
  if (kind === 'tool') return 'ng-cell ng-cell--empty ng-cell--tool';
  return 'ng-cell ng-cell--empty';
}

function cellIcon(kind) {
  if (kind === 'shift' || kind === 'light') return 'fa-sun';
  if (kind === 'dots') return 'fa-ellipsis';
  if (kind === 'heart') return 'fa-heart';
  if (kind === 'deny') return 'fa-ban';
  if (kind === 'tool') return 'fa-hammer';
  return null;
}

function MonthBlock({ title, year, monthIndex, marks, showWatermark }) {
  const cells = useMemo(
    () => buildMonth(year, monthIndex, marks),
    [year, monthIndex, marks],
  );

  return (
    <section className="ng-month">
      <div className="ng-month-head">
        <h2>{title}</h2>
        <div className="ng-month-tools" aria-hidden="true">
          <i className="fa-solid fa-border-all" />
          <i className="fa-solid fa-gear" />
          <i className="fa-regular fa-bell" />
        </div>
      </div>

      <div className="ng-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="ng-grid">
        {cells.map((cell, index) => {
          if (cell.empty) {
            return <div key={`e-${index}`} className="ng-cell" />;
          }

          const icon = cellIcon(cell.kind);

          return (
            <div key={cell.day} className={cellClass(cell.kind)}>
              <span className="ng-cell__day">{cell.day}</span>
              {icon && (
                <i className={`fa-solid ${icon} ng-cell__icon`} />
              )}
              {cell.label && <span className="ng-cell__label">{cell.label}</span>}
            </div>
          );
        })}
        {showWatermark && <div className="ng-watermark">my nursegrid</div>}
      </div>
    </section>
  );
}

export default function CalendarioPage() {
  const [tab, setTab] = useState('My Events');

  return (
    <>
      <Head>
        <title>Calendário - Escala</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" />
        <style>{`body:has(.ng-page){overflow:auto!important;height:auto!important;background:#dfe8ea!important;}`}</style>
      </Head>
    <div className="ng-page">
      <div className="ng-phone">
        <header className="ng-header">
          <img
            className="ng-avatar"
            src="https://images.unsplash.com/photo-1587300003388-59208cc962f0?auto=format&fit=crop&w=96&q=80"
            alt="Profile"
          />
          <h1>Calendar</h1>
          <button type="button" aria-label="Add event">+</button>
        </header>

        <nav className="ng-tabs" aria-label="Calendar views">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={tab === item ? 'is-active' : ''}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ng-scroll">
          {tab === 'My Events' && (
            <>
              <MonthBlock
                title="September 2026"
                year={2026}
                monthIndex={8}
                marks={SEPTEMBER_MARKS}
                showWatermark
              />
              <MonthBlock
                title="October 2026"
                year={2026}
                monthIndex={9}
                marks={OCTOBER_MARKS}
              />
            </>
          )}

          {tab !== 'My Events' && (
            <p style={{ textAlign: 'center', color: '#7a8a92', padding: '2rem 1rem' }}>
              No {tab.toLowerCase()} right now.
            </p>
          )}

          <div className="ng-footer-links">
            <Link href="/dashboard">Voltar ao Escala</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
