import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {
  getLiveCaptcha,
  authenticateLiveStudent,
  harvestLiveSemesterData
} from './src/services/vtop/vtopLiveBridge.ts';

function vtopLiveBridgePlugin(): Plugin {
  return {
    name: 'vtop-live-bridge',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/vtop')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');

        try {
          if (pathname === '/api/vtop/captcha' && req.method === 'GET') {
            const data = await getLiveCaptcha();
            res.end(JSON.stringify(data));
            return;
          }

          if (pathname === '/api/vtop/login' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body || '{}');
                const result = await authenticateLiveStudent(
                  payload.sessionId,
                  payload.regNo,
                  payload.password,
                  payload.captcha
                );
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, message: err.message }));
              }
            });
            return;
          }

          if (pathname === '/api/vtop/harvest' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', async () => {
              try {
                const payload = JSON.parse(body || '{}');
                const result = await harvestLiveSemesterData(
                  payload.sessionId,
                  payload.semesterSubId
                );
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, message: err.message }));
              }
            });
            return;
          }

          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: err.message }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vtopLiveBridgePlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
