// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const repoName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ||
  process.env.REPO_NAME ||
  'citizen-news';
const owner =
  process.env.GITHUB_REPOSITORY?.split('/')[0] ||
  process.env.GITHUB_OWNER ||
  'example';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || `https://${owner}.github.io`,
  base: process.env.BASE_PATH || `/${repoName}/`,
  vite: {
    plugins: [tailwindcss()],
  },
});
