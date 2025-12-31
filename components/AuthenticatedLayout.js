import BrandHeader from './BrandHeader';
import Sidebar from './Sidebar';

export default function AuthenticatedLayout({ header, children }) {
  return (
    <div className="app-shell">
      <div className="app-shell__chrome">
        <BrandHeader />
        {header && <div className="app-page-header">{header}</div>}
      </div>
      <aside className="app-shell__sidebar">
        <Sidebar />
      </aside>
      <div className="app-shell__main">{children}</div>
    </div>
  );
}
