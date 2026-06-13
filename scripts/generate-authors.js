import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const authorsPath = path.join(root, 'src', 'data', 'authors.json');
const avatarsDir = path.join(root, 'public', 'avatars');

const AUTHORS = [
  { id: 1, name: 'Анна Тихонова', role: 'Социальный журналист', slug: 'anna', bio: 'Пишет о волонтёрстве и благотворительности с 2020 года.' },
  { id: 2, name: 'Дмитрий Воронов', role: 'Экологический активист', slug: 'dima', bio: 'Более 50 выездов на субботники и посадки леса.' },
  { id: 3, name: 'Елена Соколова', role: 'Координатор НКО', slug: 'elena', bio: 'Помогает городским инициативам находить волонтёров.' },
  { id: 4, name: 'Игорь Мельников', role: 'Обозреватель благотворительности', slug: 'igor', bio: 'Анализирует социальные проекты по всей России.' },
  { id: 5, name: 'Мария Кузнецова', role: 'Волонтёр-наставник', slug: 'maria', bio: 'Обучает новичков основам социальной работы.' },
  { id: 6, name: 'Олег Петров', role: 'Городской активист', slug: 'oleg', bio: 'Участвует в проектах благоустройства и соседских сообществ.' },
  { id: 7, name: 'Светлана Орлова', role: 'Эко-журналист', slug: 'svetlana', bio: 'Рассказывает об экологических акциях и переработке отходов.' },
  { id: 8, name: 'Алексей Новиков', role: 'Фандрайзер', slug: 'alexey', bio: 'Специализируется на сборах для детских и медицинских фондов.' },
  { id: 9, name: 'Наталья Белова', role: 'Редактор социальных новостей', slug: 'natalya', bio: 'Отбирает истории, которые вдохновляют на добрые дела.' },
  { id: 10, name: 'Павел Громов', role: 'Корреспондент', slug: 'pavel', bio: 'Пишет о помощи людям в кризисных ситуациях.' },
];

const UNSPLASH_PORTRAITS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f7737a5b5a0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
];

async function downloadAvatar(url, dest) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    fs.writeFileSync(dest, response.data);
    return true;
  } catch {
    return false;
  }
}

function createPlaceholderAvatar(dest, name) {
  const initial = name.charAt(0);
  const colors = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444'];
  const color = colors[name.length % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="${color}" width="400" height="400"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="160" font-family="Arial,sans-serif">${initial}</text></svg>`;
  fs.writeFileSync(dest.replace('.jpg', '.svg'), svg);
}

async function main() {
  fs.mkdirSync(avatarsDir, { recursive: true });

  const authors = [];

  for (let i = 0; i < AUTHORS.length; i++) {
    const a = AUTHORS[i];
    const filename = `${a.slug}.jpg`;
    const dest = path.join(avatarsDir, filename);
    const avatarPath = `/avatars/${filename}`;

    const downloaded = await downloadAvatar(UNSPLASH_PORTRAITS[i], dest);
    if (!downloaded) {
      createPlaceholderAvatar(dest, a.name);
      authors.push({
        id: a.id,
        name: a.name,
        role: a.role,
        avatar: `/avatars/${a.slug}.svg`,
        bio: a.bio,
      });
    } else {
      authors.push({
        id: a.id,
        name: a.name,
        role: a.role,
        avatar: avatarPath,
        bio: a.bio,
      });
    }
    console.log(`✓ Автор: ${a.name}`);
  }

  fs.mkdirSync(path.dirname(authorsPath), { recursive: true });
  fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2), 'utf-8');
  console.log(`\nСохранено ${authors.length} авторов в ${authorsPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
