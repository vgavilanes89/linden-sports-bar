import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'menu-data.json'), 'utf8')
);

const MENU_SECTIONS = ['Food', 'Non-Alcoholic Drinks', 'Alcoholic Drinks'];

const SECTION_BY_CATEGORY = {
  'LUNCH SPECIAL': 'Food',
  APPETIZERS: 'Food',
  Pizza: 'Food',
  MEAT: 'Food',
  PASTA: 'Food',
  'FISH & SEAFOOD': 'Food',
  CHICKEN: 'Food',
  SALAD: 'Food',
  BURGERS: 'Food',
  SANDWICHES: 'Food',
  SIDES: 'Food',
  DESSERTS: 'Food',
  'SOFT DRINKS': 'Non-Alcoholic Drinks',
  COFFEE: 'Non-Alcoholic Drinks',
  'Happy Hour': 'Alcoholic Drinks',
  'Cocktails and Sangria': 'Alcoholic Drinks',
  Wine: 'Alcoholic Drinks',
};

const CATEGORY_ORDER = [
  'LUNCH SPECIAL',
  'APPETIZERS',
  'Pizza',
  'MEAT',
  'PASTA',
  'FISH & SEAFOOD',
  'CHICKEN',
  'SALAD',
  'BURGERS',
  'SANDWICHES',
  'SIDES',
  'DESSERTS',
  'SOFT DRINKS',
  'COFFEE',
  'Happy Hour',
  'Cocktails and Sangria',
  'Wine',
];

function cleanDescription(value) {
  if (!value || value === '.' || value.trim() === '') return '';
  return value.trim();
}

const menuItems = [];
const categoriesBySection = {
  Food: [],
  'Non-Alcoholic Drinks': [],
  'Alcoholic Drinks': [],
};

for (const categoryName of CATEGORY_ORDER) {
  const category = raw.data.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  if (!category) continue;

  const section = SECTION_BY_CATEGORY[category.name];
  if (!section) continue;

  const activeItems = category.menus
    .filter((item) => item.status === 'ACTIVE')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (activeItems.length === 0) continue;

  categoriesBySection[section].push(category.name);

  for (const item of activeItems) {
    let description = cleanDescription(item.regular_decription || item.about);
    const hasSecondary = item.price2 != null && item.price2 > 0;

    if (hasSecondary) {
      const secondaryNote = [item.label_price2, `$${item.price2.toFixed(2)}`]
        .filter(Boolean)
        .join(' ');
      description = description
        ? `${description} (${secondaryNote})`
        : secondaryNote;
    }

    menuItems.push({
      id: `m${item.id}`,
      section,
      category: category.name,
      name: item.name.trim(),
      description,
      price: item.price ?? 0,
      image: item.image_cdn || null,
    });
  }
}

const EXTRA_MENU_ITEMS = [
  {
    id: 'extra-water',
    section: 'Non-Alcoholic Drinks',
    category: 'SOFT DRINKS',
    name: 'Bottle Water',
    description: '',
    price: 2,
    image: null,
  },
  {
    id: 'extra-sparkling-water',
    section: 'Non-Alcoholic Drinks',
    category: 'SOFT DRINKS',
    name: 'Bottle Sparkling Water',
    description: '',
    price: 6,
    image: null,
  },
  {
    id: 'extra-coke',
    section: 'Non-Alcoholic Drinks',
    category: 'SOFT DRINKS',
    name: 'Canned Coke',
    description: '',
    price: 2,
    image: null,
  },
  {
    id: 'extra-sprite',
    section: 'Non-Alcoholic Drinks',
    category: 'SOFT DRINKS',
    name: 'Canned Sprite',
    description: '',
    price: 2,
    image: null,
  },
  {
    id: 'extra-ginger-ale',
    section: 'Non-Alcoholic Drinks',
    category: 'SOFT DRINKS',
    name: 'Canned Ginger Ale',
    description: '',
    price: 2,
    image: null,
  },
];

for (const item of EXTRA_MENU_ITEMS) {
  menuItems.push(item);
  if (!categoriesBySection[item.section].includes(item.category)) {
    categoriesBySection[item.section].unshift(item.category);
  }
}

const output = `// Auto-generated from Linden Sports Bar menu (tumenu.online API)
export const MENU_SECTIONS = ${JSON.stringify(MENU_SECTIONS, null, 2)};

export const MENU_CATEGORIES_BY_SECTION = ${JSON.stringify(categoriesBySection, null, 2)};

export const MENU_ITEMS = ${JSON.stringify(menuItems, null, 2)};
`;

const outPath = path.join(__dirname, '..', 'src', 'data', 'menu.js');
fs.writeFileSync(outPath, output);

for (const section of MENU_SECTIONS) {
  const count = menuItems.filter((item) => item.section === section).length;
  console.log(`${section}: ${count} items in ${categoriesBySection[section].length} subcategories`);
}

console.log(`Generated ${menuItems.length} total items.`);
