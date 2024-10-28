// index.tsx
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import Tablet from './components/Tablet';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Tablet />
);
