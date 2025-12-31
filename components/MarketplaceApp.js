
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { initialProperties } from '../data/marketplace';

function loadLeaflet() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      resolve(window.L);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
}

export default function MarketplaceApp() {
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [tourType, setTourType] = useState('In-Person');
  const [modalTab, setModalTab] = useState('overview');
  const [highlightedPropertyId, setHighlightedPropertyId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Zelzow Real Estate Copilot. Ask me anything about property taxes, local zoning laws, or renovation ROI estimates.',
    },
  ]);
  const [calcHomePrice, setCalcHomePrice] = useState(750000);
  const [calcDownPaymentPercent, setCalcDownPaymentPercent] = useState(20);
  const [calcInterestRate, setCalcInterestRate] = useState(6.5);
  const [calcLoanTermYears, setCalcLoanTermYears] = useState(30);
  const [comparedPropertyIds, setComparedPropertyIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [properties, setProperties] = useState(initialProperties);
  const [activeProperty, setActiveProperty] = useState(initialProperties[0]);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const openModalRef = useRef(null);

  const calcDownPaymentAmount = (calcHomePrice * calcDownPaymentPercent) / 100;
  const calcLoanAmount = calcHomePrice - calcDownPaymentAmount;
  const calcMonthlyPayment = useMemo(() => {
    const principal = calcLoanAmount;
    const monthlyRate = calcInterestRate / 100 / 12;
    const numberOfPayments = calcLoanTermYears * 12;
    if (monthlyRate === 0) return principal / numberOfPayments;
    return (
      (principal * monthlyRate * (1 + monthlyRate) ** numberOfPayments)
      / ((1 + monthlyRate) ** numberOfPayments - 1)
    );
  }, [calcLoanAmount, calcInterestRate, calcLoanTermYears]);

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const openModal = useCallback((property) => {
    setActiveProperty(property);
    setModalTab('overview');
    setIsModalOpen(true);
  }, []);

  openModalRef.current = openModal;

  const updateTileLayer = useCallback((dark) => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = dark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);
  }, []);

  const renderMapMarkers = useCallback((list, toastFn) => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L) return;

    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }

    markersLayerRef.current = L.layerGroup();

    list.forEach((prop) => {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color:#10b981;color:#fff;padding:4px 8px;border-radius:8px;font-weight:bold;font-size:11px;box-shadow:0 4px 12px rgba(16,185,129,.4);border:1px solid rgba(255,255,255,.2);white-space:nowrap;">${prop.price}</div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon });
      marker.on('click', () => {
        setHighlightedPropertyId(prop.id);
        openModalRef.current?.(prop);
        toastFn(`Selected map location: ${prop.title}`);
      });
      markersLayerRef.current.addLayer(marker);
    });

    markersLayerRef.current.addTo(map);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = L.map(mapRef.current, { zoomControl: false }).setView([28.935, -81.3], 13);
      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
      updateTileLayer(true);
      renderMapMarkers(properties, showToast);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateTileLayer(isDark);
  }, [isDark, updateTileLayer]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMapMarkers(properties, showToast);
  }, [properties, renderMapMarkers, showToast]);

  const sendChatMessage = (textToSend = null) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    setChatMessages((current) => [...current, { sender: 'user', text: query }]);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      let reply = 'Based on current Orange City MLS and municipal data, properties in this sector have standard R-1 residential zoning with accessory dwelling unit (ADU) allowances. Projected annual property taxes average approximately 1.15% of assessed value.';
      const lower = query.toLowerCase();
      if (lower.includes('roi') || lower.includes('renovation')) {
        reply = 'Kitchen and bathroom modernizations yield the highest ROI here, averaging roughly 82% return on resale and boosting monthly cap rates by ~0.45%.';
      } else if (lower.includes('tax') || lower.includes('property tax')) {
        reply = 'Local property taxes are approximately 1.12% to 1.18% annually. Homestead exemptions can reduce taxable assessed values for primary residents.';
      } else if (lower.includes('zoning')) {
        reply = 'Most featured listings sit in low-density residential zones, though multi-unit parcels support commercial-mixed zoning or duplex expansions.';
      }
      setChatMessages((current) => [...current, { sender: 'ai', text: reply }]);
    }, 700);
  };

  const toggleCompare = (property, event) => {
    event.stopPropagation();
    setComparedPropertyIds((current) => {
      const index = current.indexOf(property.id);
      if (index > -1) {
        showToast(`Removed ${property.title} from comparison`);
        return current.filter((id) => id !== property.id);
      }
      if (current.length >= 3) {
        showToast('You can compare a maximum of 3 properties at once.');
        return current;
      }
      showToast(`Added ${property.title} to comparison`);
      return [...current, property.id];
    });
  };

  const comparedPropertiesList = useMemo(
    () => properties.filter((property) => comparedPropertyIds.includes(property.id)),
    [properties, comparedPropertyIds],
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleTheme = () => {
    setIsDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const toggleSaveHome = (property, event) => {
    event.stopPropagation();
    setProperties((current) => current.map((item) => (
      item.id === property.id ? { ...item, isSaved: !item.isSaved } : item
    )));
    const nextSaved = !property.isSaved;
    showToast(
      nextSaved
        ? `Added ${property.title} to saved homes`
        : `Removed ${property.title} from saved homes`,
    );
  };

  const closeModal = () => setIsModalOpen(false);

  const handleTourRequest = () => {
    showToast(`${tourType} tour requested for ${activeProperty.title}! Agent will confirm via email.`);
    closeModal();
  };

  const filteredProperties = useMemo(() => {
    let result = properties.filter((prop) => {
      const matchesFilter = activeFilter === 'All' || prop.status === activeFilter;
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase())
        || prop.specs.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'price') {
          valA = a.rawPrice;
          valB = b.rawPrice;
        } else if (sortField === 'capRate' || sortField === 'aiScore') {
          valA = Number.parseFloat(String(valA).replace('%', ''));
          valB = Number.parseFloat(String(valB).replace('%', ''));
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [properties, activeFilter, searchQuery, sortField, sortDirection]);

  const savedCount = properties.filter((property) => property.isSaved).length;

  return (
    <div className="marketplace-shell flex w-full min-h-screen bg-[#f8fafc] dark:bg-[#0a0c0e] text-slate-800 dark:text-gray-100 transition-colors duration-300 pb-24">
      <aside className="w-64 h-screen sticky top-0 bg-[#181b1f] text-gray-100 border-r border-white/[0.06] hidden lg:flex flex-col justify-between p-6 z-25 shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 font-bold text-base tracking-tighter text-white">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-[0_0_10px_#10b981]" />
            <span>
              Zelzow
              <span className="text-[10px] text-emerald-400 font-normal ml-1 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Explore
              </span>
            </span>
          </div>
          <nav className="flex flex-col gap-1.5 text-xs font-medium">
            <a href="#listings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
              <i className="fas fa-building text-xs w-4" />
              Browse Homes
            </a>
            <a href="#listings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all">
              <i className="fas fa-heart text-xs w-4" />
              Saved Favorites
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {savedCount}
              </span>
            </a>
            <button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <i className="fas fa-robot text-xs w-4 text-emerald-400" />
              AI Copilot Chat
            </button>
            <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all">
              <i className="fas fa-arrow-left text-xs w-4" />
              Voltar ao Escala
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold text-xs shadow-inner">
            ZH
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-gray-200">Zelzow Member</span>
            <span className="text-[11px] text-gray-400">Free Tier Account</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Real Estate Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Explore active market listings, check Z-estimate index data, and schedule tours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-robot text-xs" />
              <span>AI Copilot</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-2 bg-white dark:bg-[#16191d] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold shadow-sm hover:border-emerald-500 transition-all flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-200"
            >
              <i className={`fas ${isDark ? 'fa-sun text-amber-500' : 'fa-moon text-slate-600'}`} />
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Market Value</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">$24,850,000</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <i className="fas fa-arrow-up text-[9px]" />
              +4.2% YTD valuation
            </span>
          </div>
          <div className="bg-white dark:bg-[#181b1f] border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <i className="fas fa-home text-xs" />
                ZELZOW ESTIMATE
              </span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">99.2% Accuracy</div>
              <span className="text-[11px] text-slate-600 dark:text-gray-300 font-medium">Automated valuation index active</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Status: Live MLS Feed</div>
          </div>
          <div className="bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Active Listings</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{properties.length} Homes</div>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">12 pending offers received</span>
          </div>
          <div className="bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Average Yield / Cap</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">7.84%</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <i className="fas fa-check text-[9px]" />
              High market demand
            </span>
          </div>
        </section>

        <section className="bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <i className="fas fa-calculator text-xs" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Mortgage & Loan Calculator</h2>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Live adjust loan parameters to simulate exact monthly investment and mortgage payments.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Payment</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ${Math.round(calcMonthlyPayment).toLocaleString()}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Home Price</span>
                <span className="font-bold text-slate-900 dark:text-white">${calcHomePrice.toLocaleString()}</span>
              </div>
              <input type="range" min="200000" max="2500000" step="25000" value={calcHomePrice} onChange={(e) => setCalcHomePrice(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Down Payment ({calcDownPaymentPercent}%)</span>
                <span className="font-bold text-slate-900 dark:text-white">${Math.round(calcDownPaymentAmount).toLocaleString()}</span>
              </div>
              <input type="range" min="5" max="50" step="5" value={calcDownPaymentPercent} onChange={(e) => setCalcDownPaymentPercent(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Interest Rate</span>
                <span className="font-bold text-slate-900 dark:text-white">{calcInterestRate}%</span>
              </div>
              <input type="range" min="2.0" max="10.0" step="0.1" value={calcInterestRate} onChange={(e) => setCalcInterestRate(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-gray-400">Loan Term</span>
                <span className="font-bold text-slate-900 dark:text-white">{calcLoanTermYears} Years</span>
              </div>
              <select value={calcLoanTermYears} onChange={(e) => setCalcLoanTermYears(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121417] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500">
                <option value={15}>15 Years Fixed</option>
                <option value={20}>20 Years Fixed</option>
                <option value={30}>30 Years Fixed</option>
              </select>
            </div>
          </div>
        </section>

        <div id="listings" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <section className="xl:col-span-7 bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <i className="fas fa-search text-xs" />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search address..."
                  className="w-full bg-slate-50 dark:bg-[#121417] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['All', 'For Sale', 'Pending', 'Coming Soon'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.06] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-[#121417]/50 sticky top-0 z-10">
                    <th onClick={() => handleSort('title')} className="py-3 px-4 cursor-pointer hover:text-emerald-400 select-none">
                      Address <i className="fas fa-sort text-[8px] ml-1" />
                    </th>
                    <th className="py-3 px-3">Status</th>
                    <th onClick={() => handleSort('price')} className="py-3 px-3 cursor-pointer hover:text-emerald-400 select-none">
                      Price <i className="fas fa-sort text-[8px] ml-1" />
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04] text-slate-700 dark:text-gray-300">
                  {filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      onClick={() => {
                        setHighlightedPropertyId(property.id);
                        mapInstanceRef.current?.setView([property.lat, property.lng], 15);
                      }}
                      className={`transition-colors cursor-pointer group ${
                        highlightedPropertyId === property.id
                          ? 'bg-emerald-500/10 border-l-2 border-emerald-500'
                          : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={property.imageUrl} alt="Home" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white">{property.title}</span>
                            <span className="text-slate-400 text-[10px]">{property.specs}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${
                          property.status === 'For Sale'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : property.status === 'Pending'
                              ? 'bg-purple-600/10 text-purple-400 border-purple-500/20'
                              : 'bg-amber-600/10 text-amber-400 border-amber-500/20'
                        }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{property.price}</td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => toggleCompare(property, e)}
                            className={`px-2 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                              comparedPropertyIds.includes(property.id)
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-400'
                            }`}
                          >
                            {comparedPropertyIds.includes(property.id) ? 'Comparing' : 'Compare'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleSaveHome(property, e)}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              property.isSaved
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-400'
                            }`}
                          >
                            <i className={`${property.isSaved ? 'fas' : 'far'} fa-heart text-[10px]`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openModal(property)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-gray-300 transition-all shadow-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="xl:col-span-5 bg-white dark:bg-[#181b1f] border border-slate-200 dark:border-white/[0.06] rounded-2xl flex flex-col overflow-hidden shadow-sm h-[500px] relative">
            <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-[#181b1f]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-800 dark:text-white flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Map Index (Click pins to inspect)</span>
            </div>
            <div ref={mapRef} className="w-full h-full z-10 bg-slate-100 dark:bg-[#121417]" />
          </section>
        </div>
      </main>

      {isChatDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#181b1f] text-gray-100 border-l border-emerald-500/30 z-50 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#121417]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i className="fas fa-robot text-xs" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Zelzow AI Real Estate Copilot</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Online • MLS Expert</span>
              </div>
            </div>
            <button type="button" onClick={() => setIsChatDrawerOpen(false)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
              <i className="fas fa-xmark text-xs" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs">
            {chatMessages.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-3 rounded-2xl leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button type="button" onClick={() => sendChatMessage('What are the local zoning rules for multi-family units?')} className="bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] transition-all cursor-pointer">🏛️ Zoning laws</button>
              <button type="button" onClick={() => sendChatMessage('How do property taxes look in this region?')} className="bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] transition-all cursor-pointer">💸 Property taxes</button>
              <button type="button" onClick={() => sendChatMessage('What are the best renovation ROI improvements?')} className="bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] transition-all cursor-pointer">🛠️ Renovation ROI</button>
            </div>
          </div>
          <div className="p-3 border-t border-white/10 bg-[#121417] flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage(null)}
              type="text"
              placeholder="Ask about zoning, taxes, or comps..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={() => sendChatMessage(null)} className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-md">
              <i className="fas fa-paper-plane text-xs" />
            </button>
          </div>
        </div>
      )}

      {comparedPropertiesList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#14171a]/95 backdrop-blur-md border-t border-emerald-500/30 p-4 z-40 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4 overflow-x-auto pl-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-columns text-sm" />
              Compare Matrix ({comparedPropertiesList.length}/3)
            </span>
            {comparedPropertiesList.map((prop) => (
              <div key={prop.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white">
                <img src={prop.imageUrl} alt="" className="w-6 h-6 rounded-lg object-cover" />
                <span className="font-semibold truncate max-w-[120px]">{prop.title}</span>
                <button type="button" onClick={(e) => toggleCompare(prop, e)} className="text-gray-400 hover:text-red-400 ml-1">
                  <i className="fas fa-xmark text-[10px]" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pr-4">
            <button type="button" onClick={() => setComparedPropertyIds([])} className="text-xs text-gray-400 hover:text-white underline cursor-pointer">Clear All</button>
            <button type="button" onClick={() => setIsCompareModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-md transition-all cursor-pointer">Open Matrix Table</button>
          </div>
        </div>
      )}

      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#181b1f] text-slate-800 dark:text-gray-100 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#121417]">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Side-by-Side Property Comparison</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Comparing {comparedPropertiesList.length} selected real estate assets.</p>
              </div>
              <button type="button" onClick={() => setIsCompareModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-300 transition-colors cursor-pointer">
                <i className="fas fa-xmark text-xs" />
              </button>
            </div>
            <div className="p-6 overflow-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="py-3 px-4 font-semibold text-slate-400 uppercase text-[10px]">Metric</th>
                    {comparedPropertiesList.map((prop) => (
                      <th key={prop.id} className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <img src={prop.imageUrl} alt="" className="w-full h-24 rounded-xl object-cover shadow-sm" />
                          <span className="font-bold text-slate-900 dark:text-white mt-1">{prop.title}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {[
                    ['Price', (p) => p.price, 'font-extrabold text-slate-900 dark:text-white'],
                    ['Status', (p) => p.status, 'text-emerald-500 font-medium'],
                    ['Specs', (p) => p.specs, 'text-slate-600 dark:text-gray-300'],
                    ['Est. Rental Yield (Cap Rate)', (p) => p.capRate, 'font-bold text-emerald-600 dark:text-emerald-400'],
                    ['Zelzow Score', (p) => p.aiScore, 'font-mono text-emerald-500'],
                    ['Year Built / HOA', (p) => `${p.yearBuilt} • ${p.hoaFee}`, 'text-slate-600 dark:text-gray-300'],
                    ['Walk Score', (p) => `${p.neighborhood.walkScore} / 100`, 'font-bold text-slate-800 dark:text-white'],
                    ['School Rating', (p) => p.neighborhood.schoolsRating, 'text-slate-600 dark:text-gray-300'],
                  ].map(([label, getter, className]) => (
                    <tr key={label}>
                      <td className="py-3 px-4 font-semibold text-slate-500">{label}</td>
                      {comparedPropertiesList.map((prop) => (
                        <td key={prop.id} className={`py-3 px-4 ${className}`}>{getter(prop)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && activeProperty && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#181b1f] text-slate-800 dark:text-gray-100 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img src={activeProperty.imageUrl} alt="Property" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181b1f] via-[#181b1f]/30 to-transparent" />
              <button type="button" onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-10">
                <i className="fas fa-xmark text-xs" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="w-max px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1.5">{activeProperty.status}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{activeProperty.title}</h3>
                  <p className="text-xs text-gray-300 mt-0.5">{activeProperty.specs}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-white">{activeProperty.price}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Zelzow Score: {activeProperty.aiScore}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 bg-slate-100 dark:bg-[#121417] border-b border-slate-200 dark:border-white/5 text-xs font-semibold overflow-x-auto">
              <div className="flex items-center gap-2">
                {[
                  ['overview', 'Overview'],
                  ['neighborhood', 'Neighborhood & Walk Score'],
                  ['financials', 'Financials'],
                  ['tours', 'Schedule Tour'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setModalTab(id)}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      modalTab === id
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setIsReportModalOpen(true)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
                <i className="fas fa-print text-[10px]" />
                Print / PDF Report
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 text-xs overflow-y-auto max-h-[50vh]">
              {modalTab === 'overview' && (
                <div className="flex flex-col gap-4">
                  <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-xs">{activeProperty.description}</p>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                      <span className="text-slate-400 dark:text-gray-400 text-[11px]">Year Built</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{activeProperty.yearBuilt}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                      <span className="text-slate-400 dark:text-gray-400 text-[11px]">HOA Dues</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{activeProperty.hoaFee}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                      <span className="text-slate-400 dark:text-gray-400 text-[11px]">Est. Monthly Rent</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activeProperty.capRate}</span>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'neighborhood' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                    <span className="text-slate-400 text-[11px]">Walk Score®</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{activeProperty.neighborhood.walkScore} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                    <span className="text-slate-400 text-[11px]">Transit Score®</span>
                    <span className="text-lg font-black text-slate-800 dark:text-white">{activeProperty.neighborhood.transitScore} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                    <span className="text-slate-400 text-[11px]">GreatSchools® Rating</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{activeProperty.neighborhood.schoolsRating}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1">
                    <span className="text-slate-400 text-[11px]">Local Crime Index</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activeProperty.neighborhood.crimeIndex}</span>
                  </div>
                </div>
              )}

              {modalTab === 'financials' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1.5">
                    <span className="text-slate-400 dark:text-gray-400 text-[11px]">Est. Monthly Payment (P&I)</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">
                      ${Math.round(activeProperty.rawPrice * 0.0065).toLocaleString()}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex flex-col gap-1.5">
                    <span className="text-slate-400 dark:text-gray-400 text-[11px]">Down Payment (20%)</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${Math.round(activeProperty.rawPrice * 0.2).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {modalTab === 'tours' && (
                <div className="flex flex-col gap-4">
                  <span className="text-slate-700 dark:text-gray-300 font-medium">Select your preferred format to experience this home:</span>
                  <div className="grid grid-cols-2 gap-3">
                    {['In-Person', 'Video Walkthrough'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTourType(type)}
                        className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${
                          tourType === type
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-500 dark:text-gray-400'
                        }`}
                      >
                        <i className={`fas ${type === 'In-Person' ? 'fa-person-walking' : 'fa-video'} text-xs`} />
                        {type === 'In-Person' ? 'In-Person Tour' : 'Video Walkthrough'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 dark:bg-[#14171a] border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 rounded-xl font-medium transition-all cursor-pointer text-xs">Close</button>
              <button type="button" onClick={handleTourRequest} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-sm cursor-pointer text-xs flex items-center gap-2">
                <i className="fas fa-calendar-check text-[10px]" />
                Schedule {tourType}
              </button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && activeProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center no-print">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                <span className="font-bold text-xs">Zelzow Real Estate Intelligence - Client Report</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => window.print()} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                  <i className="fas fa-print text-[10px]" />
                  Print / Save PDF
                </button>
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer">
                  <i className="fas fa-xmark text-xs" />
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex flex-col gap-6 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{activeProperty.title}</h2>
                  <p className="text-slate-500">{activeProperty.specs} • Built in {activeProperty.yearBuilt}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-emerald-600">{activeProperty.price}</div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{activeProperty.status}</span>
                </div>
              </div>
              <img src={activeProperty.imageUrl} alt="" className="w-full h-56 rounded-xl object-cover shadow" />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Executive Summary</h3>
                <p className="text-slate-600 leading-relaxed">{activeProperty.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Financial Highlights</span>
                  <span className="font-semibold text-slate-800">Cap Rate / Yield: <span className="text-emerald-600 font-bold">{activeProperty.capRate}</span></span>
                  <span className="font-semibold text-slate-800">Zelzow Score: <span className="font-mono text-emerald-600">{activeProperty.aiScore}</span></span>
                  <span className="font-semibold text-slate-800">HOA Dues: {activeProperty.hoaFee}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Neighborhood Metrics</span>
                  <span className="font-semibold text-slate-800">Walk Score®: {activeProperty.neighborhood.walkScore} / 100</span>
                  <span className="font-semibold text-slate-800">Schools: {activeProperty.neighborhood.schoolsRating}</span>
                  <span className="font-semibold text-slate-800">Crime Index: {activeProperty.neighborhood.crimeIndex}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto bg-[#181b1f] border border-emerald-500/30 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs">
            <i className="fas fa-circle-check text-emerald-400 text-sm" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
