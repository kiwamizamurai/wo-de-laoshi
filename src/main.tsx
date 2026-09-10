import { render } from 'hono/jsx/dom';
import './styles/global.css';
import { App } from './app';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}
