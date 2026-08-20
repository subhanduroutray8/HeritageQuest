/* ==========================================================================
   GeoQuest — Gemini AI Heritage Companion Service
   Combines S35 Verified Heritage Knowledge Base, Multi-language Support,
   and Gemini Generative AI with zero-latency verified fallback.
   ========================================================================== */

import { HERITAGE_SITES } from './heritageSites.js';
import { getVerifiedHeritageSite } from './heritageFirestoreService.js';

// Helper to safely access browser storage
function getStoredKey() {
  try {
    return (typeof localStorage !== 'undefined') ? (localStorage.getItem('geoquest_gemini_api_key') || '') : '';
  } catch (e) {
    return '';
  }
}

// Configuration
const CONFIG = {
  // Free Google Gemini API Key (configurable via UI or localStorage)
  apiKey: getStoredKey(),
  model: 'gemini-1.5-flash',
  defaultLanguage: 'English'
};

export function setGeminiApiKey(key) {
  CONFIG.apiKey = (key || '').trim();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('geoquest_gemini_api_key', CONFIG.apiKey);
    }
  } catch (e) {}
}

export function getGeminiApiKey() {
  return CONFIG.apiKey;
}

/**
 * Normalizes text for smart keyword matching in the local knowledge base
 */
function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\u0B00-\u0B7F\u0900-\u097F ]/g, ' ');
}

/**
 * S35 Verified Local Knowledge Base Matcher
 */
export function queryLocalKnowledgeBase(query, siteId = null, mode = 'Ask') {
  const qWords = new Set(norm(query).split(/\s+/).filter(w => w.length > 1));
  
  // Sites to search
  const candidates = siteId 
    ? HERITAGE_SITES.filter(s => s.id === siteId)
    : HERITAGE_SITES;

  let bestMatch = null;
  let highestScore = 0;

  for (const site of candidates) {
    const searchCorpus = [
      site.name,
      site.shortName,
      site.location,
      site.state,
      site.era,
      site.type,
      site.description,
      ...(site.facts || []),
      ...(site.keywords || [])
    ].join(' ');

    const corpusWords = new Set(norm(searchCorpus).split(/\s+/));
    let score = 0;
    for (const word of qWords) {
      if (corpusWords.has(word)) score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = site;
    }
  }

  if (!bestMatch || highestScore === 0) {
    if (siteId) {
      bestMatch = HERITAGE_SITES.find(s => s.id === siteId);
    }
  }

  if (!bestMatch) {
    return {
      text: "I do not have verified archaeological or historical documentation for this specific query in my current knowledge base.",
      source: "S35 Verified Heritage Rule — No guessing without evidence",
      site: null
    };
  }

  let answerText = bestMatch.description;

  if (mode === 'Hint') {
    answerText = bestMatch.hint || `Look closely at the architectural elements of ${bestMatch.name}.`;
  } else if (mode === 'Quiz') {
    answerText = bestMatch.quiz || `Quiz: What era does ${bestMatch.name} belong to? (${bestMatch.era})`;
  } else if (mode === 'Explain') {
    answerText = `In simple terms: ${bestMatch.description}\n\nKey Highlights:\n• ` + bestMatch.facts.join('\n• ');
  }

  return {
    text: answerText,
    source: bestMatch.verifiedSource || 'UNESCO World Heritage Centre / ASI',
    site: bestMatch
  };
}

/**
 * Ask Heritage AI Companion (Firestore Grounded with Gemini Generative AI)
 */
export async function askHeritageAI({
  query,
  siteId = null,
  mode = 'Ask',
  language = 'English',
  onPartial = null
}) {
  // Ground with Firestore verified site data
  const currentSite = await getVerifiedHeritageSite(siteId || 'konark');
  const localAnswer = queryLocalKnowledgeBase(query, siteId, mode);

  // If user provided a Gemini API Key, call live Gemini
  if (CONFIG.apiKey) {
    try {
      const systemInstruction = `
You are the official "Heritage AI Companion" in the GeoQuest exploration game.
Your answers MUST be strictly grounded in verified Firestore archaeological facts.

GROUND TRUTH CONTEXT (FIRESTORE):
Monument: ${currentSite.name} (${currentSite.location}, ${currentSite.state})
Era / Century: ${currentSite.era}
Architectural Type: ${currentSite.type}
Archaeological Facts:
${(currentSite.facts || []).map(f => `- ${f}`).join('\n')}
Verified Documentation: ${currentSite.verifiedSource}

RULES:
1. Ground your answers strictly on real, verified historical and archaeological facts.
2. Mode is: ${mode.toUpperCase()} (Ask: informative; Hint: subtle clues for explorers; Quiz: interactive question with options; Explain: simple breakdown for beginners).
3. Respond in language: ${language} (support English, Hindi, or Odia cleanly).
4. Always mention the verified source citation at the end (e.g. "**Source:** ${currentSite.verifiedSource}").
5. Keep responses concise and engaging for mobile gamers (2-4 sentences max).
      `.trim();

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}` }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 350
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiReply) {
          return {
            text: geminiReply,
            source: currentSite.verifiedSource,
            isLiveAI: true
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using verified S35 local fallback:', err.message);
    }
  }

  // Instant S35 Verified Knowledge Base Fallback
  let formattedText = localAnswer.text;
  if (mode !== 'Quiz' && mode !== 'Hint' && !formattedText.includes('Source:')) {
    formattedText += `\n\n**Source:** ${localAnswer.source}`;
  }

  // Multilingual local prefixes for Odia / Hindi
  if (language === 'Hindi') {
    formattedText = `[हिंदी] ${formattedText}`;
  } else if (language === 'Odia') {
    formattedText = `[ଓଡ଼ିଆ] ${formattedText}`;
  }

  return {
    text: formattedText,
    source: localAnswer.source,
    isLiveAI: false
  };
}

/**
 * AI Vision Verifier for Real-World Heritage Photos
 */
export async function verifyHeritagePhoto({ imageBase64, siteId, siteName }) {
  const apiKey = getGeminiApiKey();

  // 1. Try secure backend proxy endpoint first
  if (imageBase64) {
    try {
      const backendRes = await fetch('/api/gemini/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          siteId,
          siteName,
          apiKey
        })
      });
      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData && typeof backendData.isMatch === 'boolean') {
          return backendData;
        }
      }
    } catch (err) {
      console.warn("Backend vision proxy note:", err.message);
    }
  }

  // 2. Direct Gemini Vision API call (if user provided key)
  if (apiKey && imageBase64) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      const promptText = `You are a precision AI Heritage Monument Verifier.
Analyze the provided image and determine whether it shows the real-world Indian heritage site: "${siteName}".
Respond ONLY in valid JSON format matching this schema:
{
  "isMatch": boolean (true if the photo authenticates ${siteName} or its distinctive architectural elements, false if unrelated/interior/blank),
  "confidence": number between 0 and 100,
  "detectedFeatures": string[],
  "feedback": "Short encouraging explanation of why it matched or what monument/scene was detected instead"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

      if (res.ok) {
        const data = await res.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            isMatch: !!parsed.isMatch,
            confidence: parsed.confidence || (parsed.isMatch ? 92 : 30),
            detectedFeatures: parsed.detectedFeatures || [],
            feedback: parsed.feedback || (parsed.isMatch ? `✓ Verified authentic match for ${siteName}!` : `Does not appear to match ${siteName}.`),
            isLiveAI: true
          };
        }
      }
    } catch (e) {
      console.warn("Gemini Vision API error, falling back to local vision heuristic:", e);
    }
  }

  // ── Offline Fallback: Real Pixel Content Checker ────────────────────────
  // We analyse the actual image data to detect blank/black/featureless frames.
  // Only pass if the image has enough visual contrast and detail.
  await new Promise(r => setTimeout(r, 900));

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const binaryStr = atob(cleanBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    // Draw into an offscreen canvas to sample pixels
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const bitmapUrl = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = bitmapUrl;
    });

    const offscreen = document.createElement('canvas');
    offscreen.width = 80;
    offscreen.height = 60;
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(img, 0, 0, 80, 60);
    URL.revokeObjectURL(bitmapUrl);

    const pixelData = ctx.getImageData(0, 0, 80, 60).data;
    const totalPixels = 80 * 60;

    let sumR = 0, sumG = 0, sumB = 0;
    let darkPixels = 0;

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i], g = pixelData[i + 1], b = pixelData[i + 2];
      sumR += r; sumG += g; sumB += b;
      const brightness = (r + g + b) / 3;
      if (brightness < 25) darkPixels++;
    }

    const avgBrightness = (sumR + sumG + sumB) / (totalPixels * 3);
    const darkRatio = darkPixels / totalPixels;

    // Reject if: image is too dark/blank (camera not capturing properly)
    if (avgBrightness < 20 || darkRatio > 0.85) {
      return {
        isMatch: false,
        confidence: 0,
        detectedFeatures: [],
        feedback: `📷 The camera captured a blank or very dark frame. Make sure you are pointing the camera at the actual monument in good lighting before clicking.`,
        isLiveAI: false
      };
    }

    // Compute variance to check if image has visual detail (not just a uniform colour)
    const meanBrightness = avgBrightness;
    let variance = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      const brightness = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
      variance += (brightness - meanBrightness) ** 2;
    }
    variance /= totalPixels;

    // Reject if image is nearly featureless (uniform colour / no stone/architectural texture)
    if (variance < 80) {
      return {
        isMatch: false,
        confidence: 8,
        detectedFeatures: [],
        feedback: `🔍 The image appears featureless or lacks architectural detail. Please photograph the main structure, stone carvings, or facade of ${siteName} clearly.`,
        isLiveAI: false
      };
    }

    // Image has real content — but we cannot confirm without AI Vision API.
    // Inform the user that a Gemini API key is needed for proper AI verification.
    return {
      isMatch: false,
      confidence: 0,
      detectedFeatures: [],
      feedback: `🔑 AI Vision requires a Gemini API key to authenticate the photo against ${siteName}. Add your free Gemini API key in Settings to enable real monument verification with +500 XP!`,
      isLiveAI: false
    };
  } catch (e) {
    // If pixel analysis fails, do not auto-pass
    return {
      isMatch: false,
      confidence: 0,
      detectedFeatures: [],
      feedback: `Could not analyse the image. Please ensure the camera is pointed at the monument and try again.`,
      isLiveAI: false
    };
  }
}
