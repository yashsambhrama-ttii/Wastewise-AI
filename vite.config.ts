import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function serverApiPlugin(): Plugin {
  return {
    name: 'waste-management-server-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ai/')) {
          return next();
        }

        try {
          const { handlePredictAccumulation, handleOptimizeRoute, handleAnalyzeReport, handleAiConsultant } = await import('./src/server/aiRouter.ts');
          
          let body = '';
          req.on('data', chunk => { body += chunk; });
          await new Promise(resolve => req.on('end', resolve));

          const payload = body ? JSON.parse(body) : {};
          res.setHeader('Content-Type', 'application/json');

          if (req.url === '/api/ai/predict') {
            const result = await handlePredictAccumulation(payload.bins || [], payload.areas || [], payload.surgeFactor || 1.0);
            res.end(JSON.stringify({ success: true, data: result }));
          } else if (req.url === '/api/ai/optimize-route') {
            const result = await handleOptimizeRoute(payload.bins || [], payload.driverName || 'Marcus Vance', payload.vehicleType || 'Heavy Compactor');
            res.end(JSON.stringify({ success: true, data: result }));
          } else if (req.url === '/api/ai/analyze-report') {
            const result = await handleAnalyzeReport(payload.report || {});
            res.end(JSON.stringify({ success: true, data: result }));
          } else if (req.url === '/api/ai/consultant') {
            const result = await handleAiConsultant(payload.query || '', payload.context || {});
            res.end(JSON.stringify({ success: true, data: result }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          }
        } catch (error: any) {
          console.error('Server API error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: error?.message || 'Internal AI Server Error' }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
