import OpenAI from 'openai';
import { withRetry } from './lib/retry.js';
import { geminiGenerateText, isGeminiConfigured } from './gemini.js';

const API_TIMEOUT_MS = parseInt(process.env.API_TIMEOUT_MS || '60000', 10);

const SCENE_SYSTEM_PROMPT =
  'Опиши ОДНУ конкретную фотографию для иллюстрации русскоязычной новости о пенсиях, налогах, пособиях или социальной поддержке. Ответ на английском, 2-3 предложения. Сцена должна ТОЧНО соответствовать заголовку — очередь в МФЦ, пенсионер с документами, налоговая декларация, семья оформляет пособие и т.п. Локация: Россия. Стиль: любительское фото с телефона для регионального СМИ. В кадре НЕТ текста, вывесок, надписей.';

export function extractSceneFromTitle(title) {
  const t = title.toLowerCase();
  const scenes = [
    [/пенси|пенсион|сфр|пфр|индексац.*пенси|пенсионн.*балл/i, 'elderly Russian person at MFC office window queue, seen from behind, fluorescent light, mundane'],
    [/ндфл|налог|декларац|вычет|фнс|налогов/i, 'person filling paper tax forms at kitchen table in Russian apartment, calculator nearby, screen blurred'],
    [/пособи|выплат|льгот|компенсац|материнск|едв|единовремен/i, 'young mother with child at social services office waiting area, plastic chairs, grey walls'],
    [/больничн|декретн|больнич/i, 'doctor office corridor in Russian polyclinic, patient holding envelope of documents, seen from side'],
    [/безработ|центр.*занят/i, 'employment center waiting hall in Russia, people sitting on benches, bulletin board without readable text'],
    [/субсид|жкх|коммунальн|квартплат/i, 'elderly person paying utility bills at post office counter in Russia, worn interior'],
    [/госуслуг|мфц|многофункц/i, 'Russian MFC service hall with ticket queue machine, people waiting, documentary angle'],
    [/инвалид|малоимущ|соцзащит|нуждающ/i, 'social worker visiting elderly person in modest Russian apartment, tea cups on table'],
    [/ветеран|ветеран/i, 'older man in worn jacket receiving documents at veterans support office in Russia'],
    [/стаж|трудов.*книж|выслуг/i, 'middle-aged worker at HR desk signing employment papers in Russia, office clutter'],
    [/минтруд|минфин|правительств/i, 'press conference room in Russia after social policy announcement, empty chairs, microphones without logos'],
  ];
  for (const [pattern, scene] of scenes) {
    if (pattern.test(t)) return scene;
  }
  return 'ordinary Russian citizen receiving social services at a government office, candid phone photo, mundane';
}

export function photoRealismWrapper(sceneDescription) {
  return [
    sceneDescription,
    'Must look like an unedited candid photograph, NOT illustration, NOT digital art, NOT CGI, NOT painting.',
    'Shot on an old smartphone in Russia, 2019: soft focus, slight motion blur, JPEG compression, desaturated muted colors.',
    'Flat overcast daylight or dim fluorescent office light — no studio lighting, no golden hour glamour, no HDR.',
    'Awkward framing, subject off-center, background clutter, mundane reality.',
    'Muted palette: grey, brown, olive, beige — no oversaturated colors.',
    'Natural skin with pores and imperfections, no airbrushing, no plastic smoothness.',
    'FORBIDDEN: text, letters, numbers, signs, banners, logos, labels, watermarks, readable screens.',
    'FORBIDDEN: stock photo poses, perfect symmetry, lens flare, bokeh balls, AI gloss, painterly look.',
  ].join(' ');
}

async function openAiImageScene(apiKey, baseURL, model, provider, title, category, body) {
  const response = await withRetry(
    async () => {
      const client = new OpenAI({ apiKey, baseURL, timeout: API_TIMEOUT_MS, maxRetries: 0 });
      return client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SCENE_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Заголовок: ${title}\nКатегория: ${category}\nСодержание: ${body.slice(0, 400) || title}`,
          },
        ],
        max_tokens: 180,
      });
    },
    { attempts: 3, label: `${provider} Image Prompt` }
  );
  return response.choices[0]?.message?.content?.trim();
}

export async function aiImageScene(title, category, body) {
  const userPrompt = `Заголовок: ${title}\nКатегория: ${category}\nСодержание: ${body.slice(0, 400) || title}`;

  if (isGeminiConfigured()) {
    try {
      const scene = await geminiGenerateText({ system: SCENE_SYSTEM_PROMPT, user: userPrompt });
      if (scene && scene.length > 40) {
        console.log(`  [Gemini Image Prompt] ${scene.slice(0, 70)}…`);
        return scene;
      }
    } catch (err) {
      console.warn(`  [Gemini Image Prompt] ${err.message}`);
    }
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const textProviders = [];
  if (deepseekKey && deepseekKey !== 'sk-...') {
    textProviders.push({
      provider: 'DeepSeek',
      apiKey: deepseekKey,
      baseURL: 'https://api.deepseek.com',
      model: 'deepseek-chat',
    });
  }
  if (openaiKey && openaiKey !== 'sk-...') {
    textProviders.push({ provider: 'OpenAI', apiKey: openaiKey, model: 'gpt-4o-mini' });
  }

  for (const { provider, apiKey, baseURL, model } of textProviders) {
    try {
      const scene = await openAiImageScene(apiKey, baseURL, model, provider, title, category, body);
      if (scene && scene.length > 40) {
        console.log(`  [${provider} Image Prompt] ${scene.slice(0, 70)}…`);
        return scene;
      }
    } catch (err) {
      console.warn(`  [${provider} Image Prompt] ${err.message}`);
    }
  }

  return null;
}

export async function buildImagePrompt(title, category, body = '') {
  const aiScene = await aiImageScene(title, category, body);
  const scene = aiScene || extractSceneFromTitle(`${title} ${body}`);
  return photoRealismWrapper(scene);
}
