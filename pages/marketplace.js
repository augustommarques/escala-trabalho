import Head from 'next/head';
import Script from 'next/script';
import MarketplaceApp from '../components/MarketplaceApp';

export default function MarketplacePage() {
  return (
    <>
      <Head>
        <title>Marketplace - Escala</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <style>{`
          body:has(.marketplace-shell) {
            overflow: auto !important;
            height: auto !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          @media print {
            .no-print { display: none !important; }
          }
        `}</style>
      </Head>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script id="tailwind-dark-config" strategy="beforeInteractive">{`
        tailwind.config = { darkMode: 'class' };
      `}</Script>
      <MarketplaceApp />
    </>
  );
}
