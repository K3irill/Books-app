import 'reset-css';
import './styles/styles.scss';
import { Header } from './components/Header/Header.component';
import { log } from 'console';

const app = document.getElementById('app');

if (app) {
  const header = new Header();

  header.appendTo(app);
}
