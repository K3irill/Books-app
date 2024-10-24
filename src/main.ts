import './styles/styles.scss';

import { Header } from './components/Header/Header.component';

const app = document.getElementById('app');

if (app) {
  const header = new Header();

  header.appendTo(app);
}
