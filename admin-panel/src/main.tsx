import { createRoot } from 'react-dom/client';
import './index.css';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';
import App from './App.tsx';
import './global.css';
import { AppWrapper } from './components/common/PageMeta.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import '../i18n';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </AuthProvider>
  </Provider>,
);
