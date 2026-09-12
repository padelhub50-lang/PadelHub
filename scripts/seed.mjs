import { listProducts, createProduct } from "../lib/db.js";

const CATALOG = [
  { name: "Bullpadel Vertex 04", category: "Ракетки", price: 8990, oldPrice: 10490, tag: "Хіт", stock: 7, description: "Ракетка топового рівня, форма — сльоза. Контроль + потужність для агресивної гри.", stats: { attack: 9, defense: 5, control: 7, versatility: 5 } },
  { name: "Head Delta Pro", category: "Ракетки", price: 7490, tag: "Новинка", stock: 12, description: "Кругла форма для максимального контролю. Легка й маневрена.", stats: { attack: 4, defense: 8, control: 8, versatility: 7 } },
  { name: "Babolat Technical Viper", category: "Ракетки", price: 6290, oldPrice: 7290, tag: "Знижка", stock: 5, description: "Універсальна ракетка для гравців середнього рівня.", stats: { attack: 6, defense: 6, control: 6, versatility: 9 } },
  { name: "Adidas Padel Balls (3 шт)", category: "М'ячі", price: 320, stock: 40, description: "Офіційні м'ячі для тренувань та турнірів." },
  { name: "Head Padel Pro S", category: "М'ячі", price: 360, tag: "Хіт", stock: 33, description: "Тур-рівень, підвищена довговічність покриття." },
  { name: "Bullpadel Vertex Backpack", category: "Сумки", price: 2890, stock: 9, description: "Рюкзак на 2 ракетки з термо-відділенням." },
  { name: "Head Tour Padel Bag", category: "Сумки", price: 3490, oldPrice: 3990, tag: "Знижка", stock: 6, description: "Місткий чохол для ракетки, форми та аксесуарів." },
  { name: "Asics Gel-Padel Pro", category: "Взуття", price: 4290, tag: "Новинка", stock: 14, description: "Кросівки з посиленою боковою підтримкою для різких рухів." },
  { name: "Padel Hub Performance Tee", category: "Одяг", price: 990, stock: 25, description: "Дихаюча футболка власної лінії Padel Hub." },
  { name: "Overgrip Comfort (3 шт)", category: "Аксесуари", price: 250, stock: 60, description: "Обмотка для ракетки, антиковзна, довга зносостійкість." },
  { name: "Padel Glove Pro", category: "Аксесуари", price: 590, stock: 18, description: "Рукавичка для кращого хвату у вологу погоду." },
  { name: "Padel Hub Sport Bottle", category: "Аксесуари", price: 350, stock: 30, description: "Спортивна пляшка 750 мл з логотипом Padel Hub." },
];

function run() {
  const existing = listProducts();
  if (existing.length > 0) {
    console.log(`Каталог уже містить ${existing.length} товар(ів) — пропускаю посів.`);
    return;
  }
  CATALOG.forEach((p, i) => {
    createProduct({ ...p, images: [], position: i });
  });
  console.log(`Додано ${CATALOG.length} товарів у каталог.`);
  console.log("Додайте фотографії для кожного товару в Керування → Товари.");
}

run();
