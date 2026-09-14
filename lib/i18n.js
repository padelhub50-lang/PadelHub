export const LOCALES = ["uk", "en"];

export const CATEGORY_LABELS = {
  Ракетки: { uk: "Ракетки", en: "Rackets" },
  "М'ячі": { uk: "М'ячі", en: "Balls" },
  Сумки: { uk: "Сумки", en: "Bags" },
  Взуття: { uk: "Взуття", en: "Shoes" },
  Одяг: { uk: "Одяг", en: "Apparel" },
  Аксесуари: { uk: "Аксесуари", en: "Accessories" },
};

export const TAG_LABELS = {
  Хіт: { uk: "Хіт", en: "Hit" },
  Новинка: { uk: "Новинка", en: "New" },
  Знижка: { uk: "Знижка", en: "Sale" },
};

export function translateCategory(category, lang) {
  return CATEGORY_LABELS[category]?.[lang] || category;
}

export function translateTag(tag, lang) {
  return TAG_LABELS[tag]?.[lang] || tag;
}

const dict = {
  "common.close": { uk: "Закрити", en: "Close" },
  "nav.catalog": { uk: "Каталог", en: "Catalog" },
  "nav.why": { uk: "Чому ми", en: "Why us" },
  "nav.contacts": { uk: "Контакти", en: "Contacts" },
  "nav.cart": { uk: "Кошик", en: "Cart" },
  "nav.menu": { uk: "Меню", en: "Menu" },
  "nav.lang": { uk: "Мова", en: "Language" },

  "hero.badge": { uk: "Офіційний екіпірувальник падел-гравців", en: "Official padel players' outfitter" },
  "hero.cta": { uk: "Обрати спорядження", en: "Shop equipment" },
  "hero.delivery": { uk: "Доставка по всій Україні", en: "Delivery across Ukraine" },

  "statement.text1": { uk: "Кожен удар — це результат правильного спорядження.", en: "Every shot is the result of the right equipment." },
  "statement.text2": { uk: "підбирає його за вас.", en: "picks it for you." },
  "statement.suffix1": { uk: " день", en: " day" },
  "statement.stat1": { uk: "до відправки замовлення", en: "to ship your order" },
  "statement.stat2": { uk: "брендів та моделей у каталозі", en: "brands and models in the catalog" },
  "statement.stat3": { uk: "гравців обрали Padel Hub", en: "players chose Padel Hub" },

  "catalog.title": { uk: "Каталог", en: "Catalog" },
  "catalog.all": { uk: "Всі", en: "All" },
  "catalog.allBrands": { uk: "Всі бренди", en: "All brands" },
  "catalog.searchPlaceholder": { uk: "Пошук за назвою...", en: "Search by name..." },
  "catalog.empty": { uk: "Товарів у цій категорії поки немає.", en: "No products in this category yet." },
  "catalog.outOfStock": { uk: "Немає в наявності", en: "Out of stock" },
  "catalog.addToCart": { uk: "Додати в кошик", en: "Add to cart" },

  "quiz.badge": { uk: "Тест підбору ракетки", en: "Racket finder quiz" },
  "quiz.title": { uk: "Яка ракетка підійде саме тобі?", en: "Which racket suits you best?" },
  "quiz.subtitle": {
    uk: "Дай відповідь на 5 коротких питань про свій стиль гри — і ми підберемо найкращі ракетки з каталогу.",
    en: "Answer 5 quick questions about your playing style — we'll match the best rackets from the catalog.",
  },
  "quiz.q1": { uk: "Як ти найчастіше граєш на корті?", en: "How do you usually play on court?" },
  "quiz.q1.a": { uk: "Атакую та йду до сітки", en: "I attack and rush the net" },
  "quiz.q1.b": { uk: "Тримаюсь задньої лінії, вичікую", en: "I stay on the baseline and wait" },
  "quiz.q1.c": { uk: "Граю збалансовано, підлаштовуюсь під суперника", en: "I play balanced, adapting to my opponent" },
  "quiz.q2": { uk: "Що для тебе важливіше в грі?", en: "What matters most to you in a game?" },
  "quiz.q2.a": { uk: "Потужність та сила ударів", en: "Power and shot strength" },
  "quiz.q2.b": { uk: "Точність і контроль м'яча", en: "Precision and ball control" },
  "quiz.q2.c": { uk: "Стабільність в оборонних розіграшах", en: "Stability in defensive rallies" },
  "quiz.q3": { uk: "Який у тебе рівень гри?", en: "What's your skill level?" },
  "quiz.q3.a": { uk: "Новачок, тільки починаю", en: "Beginner, just starting out" },
  "quiz.q3.b": { uk: "Середній рівень", en: "Intermediate" },
  "quiz.q3.c": { uk: "Просунутий або турнірний", en: "Advanced or competitive" },
  "quiz.q4": { uk: "Що найчастіше підводить у твоїй грі?", en: "What lets you down most in your game?" },
  "quiz.q4.a": { uk: "Не вистачає сили в завершальних ударах", en: "Not enough power in finishing shots" },
  "quiz.q4.b": { uk: "Важко стабільно захищатись від смешів", en: "Hard to consistently defend smashes" },
  "quiz.q4.c": { uk: "Помиляюсь з контролем траєкторії", en: "I misjudge ball trajectory control" },
  "quiz.q5": { uk: "Яку ракетку ти шукаєш за вагою та маневреністю?", en: "What weight and handling are you looking for?" },
  "quiz.q5.a": { uk: "Легку і маневрену для швидкої гри", en: "Light and maneuverable for fast play" },
  "quiz.q5.b": { uk: "Важчу й потужнішу для сильних ударів", en: "Heavier and more powerful for strong hits" },
  "quiz.q5.c": { uk: "Збалансовану під будь-яку ситуацію", en: "Balanced for any situation" },
  "quiz.results": { uk: "Тобі підійдуть ці ракетки", en: "These rackets suit you" },
  "quiz.bestMatch": { uk: "Найкращий збіг", en: "Best match" },
  "quiz.retry": { uk: "Пройти ще раз", en: "Retake the quiz" },
  "quiz.fabLabel": { uk: "Підбір ракетки", en: "Racket finder" },

  "stats.attack": { uk: "Атака", en: "Attack" },
  "stats.defense": { uk: "Захист", en: "Defense" },
  "stats.control": { uk: "Контроль", en: "Control" },
  "stats.versatility": { uk: "Універсальність", en: "Versatility" },

  "why.title": { uk: "Чому обирають Padel Hub", en: "Why choose Padel Hub" },
  "why.1.title": { uk: "Швидка доставка", en: "Fast delivery" },
  "why.1.text": { uk: "Відправляємо замовлення протягом 1 дня Новою поштою по всій Україні.", en: "We ship orders within 1 day via Nova Poshta across Ukraine." },
  "why.2.title": { uk: "Тільки оригінал", en: "Genuine only" },
  "why.2.text": { uk: "Працюємо напряму з брендами — жодних підробок чи сірого імпорту.", en: "We work directly with brands — no counterfeits or gray imports." },
  "why.3.title": { uk: "Перевірений вибір", en: "Vetted selection" },
  "why.3.text": { uk: "У каталозі — тільки спорядження, перевірене нашими інструкторами та гравцями.", en: "Our catalog only features gear tested by our coaches and players." },
  "why.4.title": { uk: "Зручна оплата", en: "Convenient payment" },
  "why.4.text": { uk: "Оплата карткою онлайн або при отриманні — обирайте, як зручно.", en: "Pay online by card or on delivery — whichever suits you." },

  "cart.title": { uk: "Кошик", en: "Cart" },
  "cart.empty": { uk: "Кошик порожній", en: "Your cart is empty" },
  "cart.total": { uk: "Разом", en: "Total" },
  "cart.checkout": { uk: "Оформити замовлення", en: "Checkout" },

  "product.inStock": { uk: "В наявності", en: "In stock" },
  "product.pcs": { uk: "шт.", en: "pcs" },
  "product.outOfStock": { uk: "Немає в наявності", en: "Out of stock" },
  "product.added": { uk: "Додано", en: "Added" },
  "product.addToCart": { uk: "Додати в кошик", en: "Add to cart" },
  "product.description": { uk: "Опис", en: "Description" },
  "product.gameStats": { uk: "Характеристики гри", en: "Game characteristics" },

  "footer.contacts": { uk: "Контакти", en: "Contacts" },
  "footer.social": { uk: "Ми в соцмережах", en: "Follow us" },
  "footer.manage": { uk: "Керування", en: "Management" },
  "footer.admin": { uk: "Панель адміністратора →", en: "Admin panel →" },
  "footer.rights": { uk: "Усі права захищені.", en: "All rights reserved." },

  "checkout.continueShopping": { uk: "Продовжити покупки", en: "Continue shopping" },
  "checkout.title": { uk: "Оформлення замовлення", en: "Checkout" },
  "checkout.emptyCart": { uk: "Кошик порожній.", en: "Your cart is empty." },
  "checkout.goToCatalog": { uk: "Перейти в каталог →", en: "Go to catalog →" },
  "checkout.contactInfo": { uk: "Контактні дані", en: "Contact details" },
  "checkout.fullName": { uk: "Ім'я та прізвище *", en: "Full name *" },
  "checkout.phone": { uk: "Телефон *", en: "Phone *" },
  "checkout.email": { uk: "Email", en: "Email" },
  "checkout.delivery": { uk: "Доставка", en: "Delivery" },
  "checkout.city": { uk: "Місто", en: "City" },
  "checkout.cityPlaceholder": { uk: "Почніть вводити назву міста", en: "Start typing a city name" },
  "checkout.branch": { uk: "Відділення / поштомат", en: "Branch / parcel locker" },
  "checkout.chooseBranch": { uk: "Оберіть відділення", en: "Choose a branch" },
  "checkout.branchOrAddress": { uk: "Відділення Нової пошти / адреса", en: "Nova Poshta branch / address" },
  "checkout.comment": { uk: "Коментар до замовлення", en: "Order comment" },
  "checkout.paymentMethod": { uk: "Спосіб оплати", en: "Payment method" },
  "checkout.payStripe": { uk: "Оплата карткою онлайн (Stripe)", en: "Pay online by card (Stripe)" },
  "checkout.payLiqpay": { uk: "Оплата карткою онлайн (LiqPay)", en: "Pay online by card (LiqPay)" },
  "checkout.payCod": { uk: "Оплата при отриманні", en: "Cash on delivery" },
  "checkout.noPaymentMethods": {
    uk: "Способи оплати ще не налаштовані. Зверніться до адміністратора магазину.",
    en: "No payment methods configured yet. Please contact the store administrator.",
  },
  "checkout.confirm": { uk: "Підтвердити замовлення на", en: "Confirm order for" },
  "checkout.yourOrder": { uk: "Ваше замовлення", en: "Your order" },
  "checkout.deliveryNote": {
    uk: "Вартість доставки Новою поштою оплачується окремо, згідно тарифів перевізника.",
    en: "Nova Poshta delivery cost is paid separately, per carrier rates.",
  },
  "checkout.cartEmptyError": { uk: "Кошик порожній", en: "Your cart is empty" },

  "order.paymentCancelled": { uk: "Оплату скасовано", en: "Payment cancelled" },
  "order.thankYou": { uk: "Дякуємо за замовлення!", en: "Thank you for your order!" },
  "order.number": { uk: "Замовлення", en: "Order" },
  "order.status": { uk: "статус", en: "status" },
  "order.items": { uk: "Товари", en: "Items" },
  "order.total": { uk: "Разом", en: "Total" },
  "order.followUp": {
    uk: "Ми надіслали деталі замовлення на нашу пошту та зв'яжемося з вами за телефоном",
    en: "We've sent the order details to our mailbox and will contact you by phone",
  },
  "order.forConfirmation": { uk: "для підтвердження.", en: "to confirm." },
  "order.home": { uk: "На головну", en: "Back to home" },
  "order.status.pending": { uk: "Очікує оплати", en: "Awaiting payment" },
  "order.status.confirmed": { uk: "Підтверджено", en: "Confirmed" },
  "order.status.paid": { uk: "Оплачено", en: "Paid" },
  "order.status.shipped": { uk: "Відправлено", en: "Shipped" },
  "order.status.cancelled": { uk: "Скасовано", en: "Cancelled" },
};

export function translate(key, lang) {
  return dict[key]?.[lang] ?? dict[key]?.uk ?? key;
}

export default dict;
