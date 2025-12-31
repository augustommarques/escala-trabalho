import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
  { id: 'chart', label: 'Chart', icon: 'fa-chart-column' },
  { id: 'apps', label: 'Apps', icon: 'fa-star' },
  { id: 'forum', label: 'Forum', icon: 'fa-comments' },
  { id: 'email', label: 'Email', icon: 'fa-envelope' },
  { id: 'setting', label: 'Setting', icon: 'fa-gear' },
];

const GAUGES = [
  { value: '1,544', color: '#00e5ff', percent: 72 },
  { value: '2,487', color: '#ff2bd6', percent: 84 },
  { value: '1,932', color: '#c6ff3d', percent: 61 },
];

const H_BARS = [
  { width: 78, gradient: 'linear-gradient(90deg,#ff4d6d,#ffe566)' },
  { width: 64, gradient: 'linear-gradient(90deg,#00e5ff,#9b5cff)' },
  { width: 88, gradient: 'linear-gradient(90deg,#9b5cff,#00e5ff)' },
  { width: 52, gradient: 'linear-gradient(90deg,#ff9f1c,#00e5ff)' },
];

const SEG_COLORS = ['#ff4d6d', '#ff9f1c', '#ffe566', '#c6ff3d', '#00e5ff', '#9b5cff', '#ff2bd6'];

const SEG_BARS = [
  [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3],
  [2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5],
  [4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0],
  [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4],
];

const ACTIVITIES = [
  'New campaign draft synced across channels',
  'Forum thread marked as high priority',
  'Email digest scheduled for 18:00',
  'Chart export completed for Q1 report',
  'User session verified from local node',
];

const TIMELINE = [
  { percent: 40, color: '#00e5ff' },
  { percent: 75, color: '#ff2bd6' },
  { percent: 20, color: '#c6ff3d' },
  { percent: 80, color: '#ff9f1c' },
  { percent: 60, color: '#9b5cff' },
];

function Ring({ percent, color, size = 96, stroke = 8 }) {
  const radius = (size / 2) - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const center = size / 2;

  return (
    <svg className="neon-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ color }}>
      <circle className="track" cx={center} cy={center} r={radius} strokeWidth={stroke} />
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text x={center} y={center + 4} textAnchor="middle" fill="#fff" fontSize={size * 0.18} fontWeight="700">
        {percent}%
      </text>
    </svg>
  );
}

function buildCalendar(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i += 1) cells.push({ day: '', muted: true });
  for (let day = 1; day <= daysInMonth; day += 1) cells.push({ day, muted: false });
  while (cells.length % 7 !== 0) cells.push({ day: '', muted: true });
  return cells;
}

export default function NeonPage() {
  const [active, setActive] = useState('dashboard');
  const [query, setQuery] = useState('');
  const calendar = useMemo(() => buildCalendar(2026, 0), []);
  const highlights = new Set([5, 12, 18, 24, 29]);

  return (
    <>
      <Head>
        <title>Neon Dashboard - Escala</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        <style>{`body:has(.neon-shell),body:has(.neon-login-shell){overflow:auto!important;height:auto!important;background:#0a001a!important;}`}</style>
      </Head>
    <div className="neon-shell">
      <aside className="neon-sidebar">
        <div className="neon-brand">
          <button type="button" aria-label="Menu">
            <i className="fa-solid fa-bars" />
          </button>
          <span>Dashboard</span>
        </div>

        <nav className="neon-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? 'is-active' : ''}
              onClick={() => setActive(item.id)}
            >
              <i className={`fa-solid ${item.icon}`} />
              {item.label}
              <i className="fa-solid fa-chevron-down chevron" />
            </button>
          ))}
        </nav>

        <div>
          <div className="neon-projects-title">PROJECTS</div>
          <div className="neon-projects">
            <a href="#option">OPTION</a>
            <a href="#case">CASE</a>
            <a href="#local">LOCAL</a>
          </div>
        </div>

        <Link href="/dashboard" className="neon-back">
          <i className="fa-solid fa-arrow-left" />
          Voltar ao Escala
        </Link>
      </aside>

      <main className="neon-main">
        <header className="neon-topbar">
          <div className="neon-breadcrumb">
            <strong>DASHBOARD</strong>
            {' / HOME'}
          </div>
          <label className="neon-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="neon-actions">
            <button type="button" className="neon-icon-btn" aria-label="Notifications">
              <i className="fa-regular fa-bell" />
              <span className="badge red">3</span>
            </button>
            <button type="button" className="neon-icon-btn" aria-label="Settings">
              <i className="fa-solid fa-gears" />
            </button>
            <button type="button" className="neon-icon-btn" aria-label="Mail">
              <i className="fa-regular fa-envelope" />
              <span className="badge green">1</span>
            </button>
            <Link href="/neon/login" className="neon-login">
              LOGIN
              <span><i className="fa-solid fa-user" /></span>
            </Link>
          </div>
        </header>

        <section className="neon-grid neon-row-top">
          {GAUGES.map((gauge) => (
            <article key={gauge.value} className="neon-card gauge-card">
              <Ring percent={gauge.percent} color={gauge.color} />
              <strong>{gauge.value}</strong>
              <b>DATA TEXT</b>
              <p>Live feed snapshot with trending volume across selected channels.</p>
            </article>
          ))}

          <article className="neon-card pct-card">
            <h3>Lorem Ipsum</h3>
            <div className="big">64%</div>
            <p>Conversion index for the current operational window and active funnel.</p>
          </article>

          <article className="neon-card bars-card">
            <h3>Lorem Ipsum</h3>
            {H_BARS.map((bar, index) => (
              <div key={index} className="neon-hbar">
                <span>
                  <i style={{ width: `${bar.width}%`, background: bar.gradient }} />
                </span>
              </div>
            ))}
          </article>
        </section>

        <section className="neon-grid neon-row-mid">
          <article className="neon-card">
            <h3>Performance Curve</h3>
            <div className="area-wrap">
              <svg viewBox="0 0 640 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="neonArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff2bd6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#9b5cff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="40" y1={y} x2="620" y2={y} stroke="rgba(255,255,255,0.06)" />
                ))}
                {[160, 320, 480].map((x, i) => (
                  <g key={x}>
                    <line x1={x} y1="20" x2={x} y2="190" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <text x={x} y="210" textAnchor="middle" fill="#9b8bb8" fontSize="11">Data 0{i + 1}</text>
                  </g>
                ))}
                <text x="18" y="45" fill="#9b8bb8" fontSize="10">70</text>
                <text x="18" y="105" fill="#9b8bb8" fontSize="10">40</text>
                <text x="18" y="165" fill="#9b8bb8" fontSize="10">10</text>
                <path
                  d="M40,150 C120,130 180,60 250,80 C320,100 360,40 430,55 C500,70 560,110 620,90 L620,190 L40,190 Z"
                  fill="url(#neonArea)"
                />
                <path
                  d="M40,150 C120,130 180,60 250,80 C320,100 360,40 430,55 C500,70 560,110 620,90"
                  fill="none"
                  stroke="#ff9f1c"
                  strokeWidth="3"
                />
                <path
                  d="M40,170 C130,150 190,110 260,120 C340,132 390,70 460,85 C530,100 580,140 620,125"
                  fill="none"
                  stroke="#9b5cff"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </article>

          <article className="neon-card">
            <h3>Lorem Ipsum</h3>
            <div className="seg-body">
              <div className="seg-bars">
                {SEG_BARS.map((row, index) => (
                  <div key={index} className="seg-bar">
                    {row.map((colorIndex, cell) => (
                      <span key={cell} style={{ background: SEG_COLORS[colorIndex] }} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="seg-copy">
                <p>
                  Segmented throughput across neon pipelines. Each bar maps channel intensity for the selected sprint.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="neon-grid neon-row-bottom">
          <article className="neon-card">
            <h3>Activites</h3>
            <ul className="act-list">
              {ACTIVITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="neon-card">
            <h3>January</h3>
            <div className="cal-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dow, index) => (
                <div key={`${dow}-${index}`} className="dow">{dow}</div>
              ))}
              {calendar.map((cell, index) => (
                <div
                  key={`c-${index}`}
                  className={`cal-day${cell.muted ? ' is-muted' : ''}${highlights.has(cell.day) ? ' is-active' : ''}`}
                >
                  {cell.day || ''}
                </div>
              ))}
            </div>
          </article>

          <article className="neon-card">
            <h3>Process Timeline</h3>
            <div className="timeline">
              <div className="timeline-rings">
                {TIMELINE.map((item) => (
                  <div key={item.percent} className="timeline-item">
                    <Ring percent={item.percent} color={item.color} size={64} stroke={6} />
                    <small>Data text</small>
                  </div>
                ))}
              </div>
              <div className="timeline-line" />
              <div className="timeline-dots">
                {TIMELINE.map((item) => (
                  <i key={`dot-${item.percent}`} style={{ background: item.color }} />
                ))}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
    </>
  );
}
