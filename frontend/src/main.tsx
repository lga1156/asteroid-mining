import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './index.css';
import { App } from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Application root element was not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider theme="light">
            <App />
        </ThemeProvider>
    </StrictMode>
);
