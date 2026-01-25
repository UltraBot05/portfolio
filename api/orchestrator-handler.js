// Vercel Serverless Function Handler
import app from './orchestrator.js';

export default async function handler(req, res) {
  return app(req, res);
}
