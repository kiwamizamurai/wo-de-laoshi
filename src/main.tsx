import { render } from 'hono/jsx/dom';
import './styles/global.css';
import { App } from './app';
import { LocaleProvider } from './i18n/LocaleContext';
import { resolveInitialLocale } from './i18n/resolveInitialLocale';

document.documentElement.lang = resolveInitialLocale();

const root = document.getElementById('root');
if (root) {
  render(
    <LocaleProvider>
      <App />
    </LocaleProvider>,
    root,
  );
}
