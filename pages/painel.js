import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-house', href: '/painel' },
  { id: 'apps', label: 'Apps', icon: 'fa-star', badge: true },
  { id: 'chart', label: 'Chart', icon: 'fa-chart-column' },
  { id: 'chat', label: 'Chat', icon: 'fa-comment-dots', badge: true },
  { id: 'setting', label: 'Setting', icon: 'fa-gear' },
  { id: 'help', label: 'Help', icon: 'fa-circle-exclamation' },
];

const METRICS = [
  {
    title: 'Follows',
    icon: 'fa-user-plus',
    color: '#e83a9b',
    percent: 25,
    month: 30,
    text: 'Placeholder for metric description and growth context in the current period.',
  },
  {
    title: 'Scope',
    icon: 'fa-bullseye',
    color: '#2a225e',
    percent: 75,
    month: 50,
    text: 'Placeholder for metric description and coverage of active campaigns.',
  },
  {
    title: 'Views',
    icon: 'fa-eye',
    color: '#7a30b2',
    percent: 50,
    month: 60,
    text: 'Placeholder for metric description and audience engagement overview.',
  },
];

const VIEW_STATS = [
  { value: '21%', label: 'FOLLOWS', icon: 'fa-user-plus', color: '#e83a9b', note: 'New audience this week' },
  { value: '75%', label: 'SCOPE', icon: 'fa-bullseye', color: '#2a225e', note: 'Reach across channels' },
  { value: '50%', label: 'VIEWS', icon: 'fa-eye', color: '#7a30b2', note: 'Page impressions' },
];

const BARS = [
  { day: 'SUN', segments: [{ h: 42, c: '#e83a9b' }, { h: 28, c: '#2a225e' }] },
  { day: 'MON', segments: [{ h: 55, c: '#e83a9b' }, { h: 22, c: '#7a30b2' }] },
  { day: 'TUE', segments: [{ h: 34, c: '#2a225e' }, { h: 40, c: '#e83a9b' }] },
  { day: 'WED', segments: [{ h: 62, c: '#e83a9b' }, { h: 18, c: '#2a225e' }] },
  { day: 'THU', segments: [{ h: 48, c: '#7a30b2' }, { h: 30, c: '#e83a9b' }] },
  { day: 'FRI', segments: [{ h: 70, c: '#e83a9b' }, { h: 16, c: '#2a225e' }] },
  { day: 'SAT', segments: [{ h: 38, c: '#2a225e' }, { h: 26, c: '#7a30b2' }] },
];

const EARN_POINTS = [
  { x: 70, y: 120, label: '300' },
  { x: 190, y: 48, label: '600' },
  { x: 330, y: 98, label: '350' },
  { x: 470, y: 78, label: '400' },
];

function ProgressRing({ percent, color }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="progress-ring" viewBox="0 0 118 118">
      <circle className="track" cx="59" cy="59" r={radius} />
      <circle
        className="value"
        cx="59"
        cy="59"
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 59 59)"
      />
      <text x="59" y="64" textAnchor="middle">{percent}%</text>
    </svg>
  );
}

function buildCalendar(year, month) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first like L M M J V S D
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push({ day: '', muted: true });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, muted: false });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: '', muted: true });
  }
  return cells;
}

export default function PainelPage() {
  const [activeNav, setActiveNav] = useState('chat');
  const [query, setQuery] = useState('');
  const today = useMemo(() => new Date(), []);
  const calendar = useMemo(
    () => buildCalendar(today.getFullYear(), today.getMonth()),
    [today],
  );
  const highlights = new Set([2, 14, 25]);

  return (
    <>
      <Head>
        <title>Painel Analytics - Escala</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
        <style>{`body:has(.painel-shell){overflow:auto!important;height:auto!important;background:#f8eef5!important;}`}</style>
      </Head>
    <div className="painel-shell">
      <aside className="painel-sidebar">
        <div className="painel-profile">
          <div className="painel-avatar" aria-hidden="true">
            <i className="fa-solid fa-user" />
          </div>
          <strong>Anne Williams</strong>
        </div>

        <nav className="painel-nav">
          {NAV.map((item) => {
            const className = activeNav === item.id ? 'is-active' : '';
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={className}
                  onClick={() => setActiveNav(item.id)}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  {item.label}
                  {item.badge && <span className="painel-badge" />}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                className={className}
                onClick={() => setActiveNav(item.id)}
              >
                <i className={`fa-solid ${item.icon}`} />
                {item.label}
                {item.badge && <span className="painel-badge" />}
              </button>
            );
          })}
          <Link href="/dashboard" className="painel-back">
            <i className="fa-solid fa-arrow-left" />
            Escala
          </Link>
        </nav>
      </aside>

      <main className="painel-main">
        <header className="painel-topbar">
          <label className="painel-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              placeholder="Search Here"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search"
            />
          </label>
          <div className="painel-actions">
            <button type="button" className="painel-icon-btn" aria-label="Favorites">
              <i className="fa-regular fa-heart" />
            </button>
            <button type="button" className="painel-icon-btn" aria-label="Notifications">
              <i className="fa-regular fa-bell" />
              <span className="dot" />
            </button>
            <button type="button" className="painel-icon-btn" aria-label="Menu">
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </header>

        <section className="painel-grid painel-row-metrics">
          {METRICS.map((metric) => (
            <article key={metric.title} className="painel-card metric-card">
              <div className="metric-card__top">
                <div className="metric-card__copy">
                  <h3>{metric.title}</h3>
                  <p>{metric.text}</p>
                </div>
                <span className="metric-icon" style={{ background: metric.color }}>
                  <i className={`fa-solid ${metric.icon}`} />
                </span>
              </div>
              <div className="ring-wrap">
                <ProgressRing percent={metric.percent} color={metric.color} />
              </div>
              <div className="metric-slider">
                <div className="metric-slider__bar">
                  <div
                    className="metric-slider__fill"
                    style={{ width: `${metric.month}%`, background: metric.color }}
                  />
                </div>
                <span>{metric.month}% THIS MONTH</span>
              </div>
            </article>
          ))}
        </section>

        <section className="painel-grid painel-row-mid">
          <article className="painel-card views-card">
            <h3>VIEWS</h3>
            <div className="views-grid">
              {VIEW_STATS.map((stat) => (
                <div key={stat.label} className="views-box">
                  <strong>{stat.value}</strong>
                  <div className="views-box__label">
                    <i className={`fa-solid ${stat.icon}`} style={{ background: stat.color }} />
                    <b>{stat.label}</b>
                    <span>{stat.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="painel-card subs-card">
            <h3>SUBSCRIPTIONS</h3>
            <div className="subs-body">
              <div className="bar-chart">
                {BARS.map((col) => (
                  <div key={col.day} className="bar-col">
                    <div className="bar-stack">
                      {col.segments.map((seg, index) => (
                        <span
                          key={`${col.day}-${index}`}
                          style={{ height: `${seg.h}%`, background: seg.c }}
                        />
                      ))}
                    </div>
                    <small>{col.day}</small>
                  </div>
                ))}
              </div>
              <div className="subs-legend">
                <div><i style={{ background: '#e83a9b' }} /> Direct</div>
                <div><i style={{ background: '#7a30b2' }} /> Organic</div>
                <div><i style={{ background: '#2a225e' }} /> Referral</div>
              </div>
            </div>
          </article>
        </section>

        <section className="painel-grid painel-row-bottom">
          <article className="painel-card earn-card">
            <h3>EARNING</h3>
            <svg className="earn-chart" viewBox="0 0 560 210" preserveAspectRatio="none">
              <defs>
                <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e83a9b" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#7a30b2" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path
                d="M20,160 C80,150 110,90 160,70 C210,50 250,95 300,105 C350,115 390,70 440,85 C490,100 520,120 540,130 L540,200 L20,200 Z"
                fill="url(#earnFill)"
              />
              <path
                d="M20,160 C80,150 110,90 160,70 C210,50 250,95 300,105 C350,115 390,70 440,85 C490,100 520,120 540,130"
                fill="none"
                stroke="#e83a9b"
                strokeWidth="3"
              />
              {EARN_POINTS.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r="7" fill="#7a30b2" />
                  <circle cx={point.x} cy={point.y} r="3.5" fill="#fff" />
                  <rect x={point.x - 18} y={point.y - 28} width="36" height="18" rx="9" fill="#7a30b2" />
                  <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="earn-axis">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </article>

          <article className="painel-card cal-card">
            <h3>
              {today.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="cal-grid">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dow, index) => (
                <div key={`${dow}-${index}`} className="dow">{dow}</div>
              ))}
              {calendar.map((cell, index) => (
                <div
                  key={`d-${index}`}
                  className={`cal-day${cell.muted ? ' is-muted' : ''}${highlights.has(cell.day) ? ' is-active' : ''}`}
                >
                  {cell.day || ''}
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
    </>
  );
}
