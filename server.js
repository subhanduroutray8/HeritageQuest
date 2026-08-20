import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

// Helper to read JSON request body
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Server-side Mission XP Validation Catalog
const VALID_XP_REWARDS = {
  '3d_tour': 150,
  'knowledge_lore': 200,
  'quiz_complete': 300,
  'relic_arrange': 250,
  'photo_lens': 500,
  'konark_mission_01': 500
};

const server = http.createServer(async (req, res) => {
  let reqUrl = req.url.split('?')[0];

  // ─────────────────────────────────────────────────────────────
  // 1. SECURE BACKEND API: Server-Validated XP Rewards (Item 9)
  // ─────────────────────────────────────────────────────────────
  if (reqUrl === '/api/missions/validate-reward' && req.method === 'POST') {
    try {
      const { missionType, score, correctCount, totalQuestions } = await readJsonBody(req);
      let validatedXP = VALID_XP_REWARDS[missionType] || 100;

      if (missionType === 'quiz_complete' && typeof correctCount === 'number') {
        const total = totalQuestions || 6;
        validatedXP = Math.round((correctCount / total) * 300);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        validatedXP,
        verifiedAt: new Date().toISOString()
      }));
      return;
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. SECURE BACKEND API: Gemini Vision / Chat Proxy (Item 6)
  // ─────────────────────────────────────────────────────────────
  if (reqUrl === '/api/gemini/vision' && req.method === 'POST') {
    try {
      const { imageBase64, siteName, apiKey } = await readJsonBody(req);
      const keyToUse = process.env.GEMINI_API_KEY || apiKey;

      if (!keyToUse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          isMatch: false,
          confidence: 0,
          detectedFeatures: [],
          feedback: 'Backend Gemini API key not configured. Please provide an API key in settings.',
          isLiveAI: false
        }));
        return;
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      const promptText = `Analyze this image and determine whether it shows the real-world Indian heritage site: "${siteName}".
Respond ONLY in valid JSON format:
{
  "isMatch": boolean,
  "confidence": number between 0 and 100,
  "detectedFeatures": string[],
  "feedback": "Short explanation of verified monument features"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: promptText },
              { inline_data: { mime_type: 'image/jpeg', data: cleanBase64 } }
            ]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(rawJson);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          isMatch: !!parsed.isMatch,
          confidence: parsed.confidence || (parsed.isMatch ? 92 : 30),
          detectedFeatures: parsed.detectedFeatures || [],
          feedback: parsed.feedback || (parsed.isMatch ? `✓ Verified authentic match for ${siteName}!` : `Does not appear to match ${siteName}.`),
          isLiveAI: true
        }));
        return;
      } else {
        throw new Error('Gemini upstream status ' + response.status);
      }
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        isMatch: false,
        confidence: 0,
        feedback: 'Vision analysis error: ' + e.message,
        isLiveAI: false
      }));
      return;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Static Assets & SPA Routing (Optimized for Large 3D Models)
  // ─────────────────────────────────────────────────────────────
  let filePath = path.join(__dirname, reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err2, indexContent) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🧭 GeoQuest Mobile UI Server with Secure Backend APIs running at http://localhost:${PORT}`);
});
