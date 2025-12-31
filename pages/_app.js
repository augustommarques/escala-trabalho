import Providers from '../components/Providers';
import BootstrapClient from '../components/BootstrapClient';
import '../styles/brand.css';
import '../styles/painel.css';
import '../styles/neon.css';
import '../styles/nursegrid.css';

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
      <BootstrapClient />
    </Providers>
  );
}
