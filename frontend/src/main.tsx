import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.tsx';
import { useThemeStore } from './core/store/useThemeStore';

useThemeStore.getState().initialize();

registerSW({
  onNeedRefresh() {
    // Reserved for a future in-app "New version available" prompt.
  },
  onOfflineReady() {
    // App shell precached — offline navigation is available.
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
