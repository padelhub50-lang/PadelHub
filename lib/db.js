import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { normalizeStats } from "./racketStats.js";

const DATA_DIR = process.env.DATABASE_DIR || path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "padelhub.db");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let db;

function getDb() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  init(db);
  return db;
}

function init(d) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT,
      price INTEGER NOT NULL,
      old_price INTEGER,
      description TEXT,
      images TEXT NOT NULL DEFAULT '[]',
      stock INTEGER NOT NULL DEFAULT 0,
      tag TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      position INTEGER NOT NULL DEFAULT 0,
      stats TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      customer TEXT NOT NULL DEFAULT '{}',
      items TEXT NOT NULL DEFAULT '[]',
      delivery TEXT NOT NULL DEFAULT '{}',
      subtotal INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL DEFAULT 0,
      payment_provider TEXT,
      payment_ref TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL
    );
  `);

  try {
    d.exec("ALTER TABLE products ADD COLUMN stats TEXT NOT NULL DEFAULT '{}'");
  } catch {
    /* column already exists on databases created before this field was added */
  }
  try {
    d.exec("ALTER TABLE products ADD COLUMN brand TEXT");
  } catch {
    /* column already exists on databases created before this field was added */
  }
}

export function id(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export function now() {
  return new Date().toISOString();
}

/* ---------------------------- products ---------------------------- */

export function listProducts({ activeOnly = false } = {}) {
  const d = getDb();
  const rows = activeOnly
    ? d.prepare("SELECT * FROM products WHERE active = 1 ORDER BY position ASC, created_at DESC").all()
    : d.prepare("SELECT * FROM products ORDER BY position ASC, created_at DESC").all();
  return rows.map(rowToProduct);
}

export function getProduct(productId) {
  const d = getDb();
  const row = d.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  return row ? rowToProduct(row) : null;
}

export function createProduct(data) {
  const d = getDb();
  const ts = now();
  const productId = id("prod");
  d.prepare(
    `INSERT INTO products (id, name, category, brand, price, old_price, description, images, stock, tag, active, position, stats, created_at, updated_at)
     VALUES (@id, @name, @category, @brand, @price, @old_price, @description, @images, @stock, @tag, @active, @position, @stats, @created_at, @updated_at)`
  ).run({
    id: productId,
    name: data.name || "Новий товар",
    category: data.category || "Аксесуари",
    brand: data.brand || null,
    price: Math.round(data.price || 0),
    old_price: data.oldPrice ? Math.round(data.oldPrice) : null,
    description: data.description || "",
    images: JSON.stringify((data.images || []).slice(0, 5)),
    stock: Number.isFinite(data.stock) ? data.stock : 0,
    tag: data.tag || null,
    active: data.active === false ? 0 : 1,
    position: Number.isFinite(data.position) ? data.position : 0,
    stats: JSON.stringify(normalizeStats(data.stats)),
    created_at: ts,
    updated_at: ts,
  });
  return getProduct(productId);
}

export function updateProduct(productId, data) {
  const d = getDb();
  const existing = getProduct(productId);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  d.prepare(
    `UPDATE products SET name=@name, category=@category, brand=@brand, price=@price, old_price=@old_price,
       description=@description, images=@images, stock=@stock, tag=@tag, active=@active,
       position=@position, stats=@stats, updated_at=@updated_at WHERE id=@id`
  ).run({
    id: productId,
    name: merged.name,
    category: merged.category,
    brand: merged.brand || null,
    price: Math.round(merged.price || 0),
    old_price: merged.oldPrice ? Math.round(merged.oldPrice) : null,
    description: merged.description || "",
    images: JSON.stringify((merged.images || []).slice(0, 5)),
    stock: Number.isFinite(merged.stock) ? merged.stock : 0,
    tag: merged.tag || null,
    active: merged.active === false ? 0 : 1,
    position: Number.isFinite(merged.position) ? merged.position : 0,
    stats: JSON.stringify(normalizeStats(merged.stats)),
    updated_at: now(),
  });
  return getProduct(productId);
}

export function deleteProduct(productId) {
  const d = getDb();
  d.prepare("DELETE FROM products WHERE id = ?").run(productId);
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    brand: row.brand,
    price: row.price,
    oldPrice: row.old_price,
    description: row.description,
    images: JSON.parse(row.images || "[]"),
    stock: row.stock,
    tag: row.tag,
    active: !!row.active,
    position: row.position,
    stats: JSON.parse(row.stats || "{}"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ----------------------------- orders ------------------------------ */

export function createOrder(data) {
  const d = getDb();
  const ts = now();
  const orderId = id("ord");
  d.prepare(
    `INSERT INTO orders (id, status, customer, items, delivery, subtotal, total, payment_provider, payment_ref, notes, created_at, updated_at)
     VALUES (@id, @status, @customer, @items, @delivery, @subtotal, @total, @payment_provider, @payment_ref, @notes, @created_at, @updated_at)`
  ).run({
    id: orderId,
    status: data.status || "pending",
    customer: JSON.stringify(data.customer || {}),
    items: JSON.stringify(data.items || []),
    delivery: JSON.stringify(data.delivery || {}),
    subtotal: Math.round(data.subtotal || 0),
    total: Math.round(data.total || 0),
    payment_provider: data.paymentProvider || null,
    payment_ref: data.paymentRef || null,
    notes: data.notes || null,
    created_at: ts,
    updated_at: ts,
  });
  return getOrder(orderId);
}

export function getOrder(orderId) {
  const d = getDb();
  const row = d.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  return row ? rowToOrder(row) : null;
}

export function listOrders() {
  const d = getDb();
  return d.prepare("SELECT * FROM orders ORDER BY created_at DESC").all().map(rowToOrder);
}

export function updateOrder(orderId, patch) {
  const d = getDb();
  const existing = getOrder(orderId);
  if (!existing) return null;
  const merged = { ...existing, ...patch };
  d.prepare(
    `UPDATE orders SET status=@status, customer=@customer, items=@items, delivery=@delivery,
       subtotal=@subtotal, total=@total, payment_provider=@payment_provider, payment_ref=@payment_ref,
       notes=@notes, updated_at=@updated_at WHERE id=@id`
  ).run({
    id: orderId,
    status: merged.status,
    customer: JSON.stringify(merged.customer || {}),
    items: JSON.stringify(merged.items || []),
    delivery: JSON.stringify(merged.delivery || {}),
    subtotal: Math.round(merged.subtotal || 0),
    total: Math.round(merged.total || 0),
    payment_provider: merged.paymentProvider || null,
    payment_ref: merged.paymentRef || null,
    notes: merged.notes || null,
    updated_at: now(),
  });
  return getOrder(orderId);
}

function rowToOrder(row) {
  return {
    id: row.id,
    status: row.status,
    customer: JSON.parse(row.customer || "{}"),
    items: JSON.parse(row.items || "[]"),
    delivery: JSON.parse(row.delivery || "{}"),
    subtotal: row.subtotal,
    total: row.total,
    paymentProvider: row.payment_provider,
    paymentRef: row.payment_ref,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ---------------------------- settings ------------------------------ */

const DEFAULT_SETTINGS = {
  site: {
    heroTitle: "Спорядження для падел-тенісу без компромісів",
    heroTitleEn: "Padel equipment without compromise",
    heroSubtitle: "Ракетки, м'ячі, взуття та аксесуари від топових брендів. Доставка по всій Україні Новою поштою.",
    heroSubtitleEn: "Rackets, balls, shoes and accessories from top brands. Delivery across Ukraine via Nova Poshta.",
    aboutText:
      "Padel Hub — інтернет-магазин екіпірування для падел-тенісу. Ми відбираємо тільки перевірене спорядження та відправляємо замовлення протягом 1 дня.",
    aboutTextEn:
      "Padel Hub is an online store for padel equipment. We only stock gear we trust, and ship orders within 1 day.",
    contactPhone: "+380 00 000 00 00",
    contactEmail: "Padelhub50@gmail.com",
    instagram: "",
    telegram: "",
  },
  email: {
    enabled: false,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user: "",
    pass: "",
    fromName: "Padel Hub",
    toEmail: "Padelhub50@gmail.com",
  },
  payments: {
    stripe: { enabled: false, publishableKey: "", secretKey: "", webhookSecret: "" },
    liqpay: { enabled: false, publicKey: "", privateKey: "" },
    codEnabled: true,
  },
  delivery: {
    novaPoshtaApiKey: "",
  },
};

function deepMerge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(patch || {})) {
    if (patch[k] && typeof patch[k] === "object" && !Array.isArray(patch[k]) && base && typeof base[k] === "object") {
      out[k] = deepMerge(base[k], patch[k]);
    } else {
      out[k] = patch[k];
    }
  }
  return out;
}

export function getSettings() {
  const d = getDb();
  const row = d.prepare("SELECT * FROM settings WHERE id = 1").get();
  if (!row) {
    const ts = now();
    d.prepare("INSERT INTO settings (id, data, updated_at) VALUES (1, ?, ?)").run(
      JSON.stringify(DEFAULT_SETTINGS),
      ts
    );
    return DEFAULT_SETTINGS;
  }
  return deepMerge(DEFAULT_SETTINGS, JSON.parse(row.data || "{}"));
}

export function updateSettings(patch) {
  const current = getSettings();
  const merged = deepMerge(current, patch);
  const d = getDb();
  d.prepare("UPDATE settings SET data = ?, updated_at = ? WHERE id = 1").run(
    JSON.stringify(merged),
    now()
  );
  return merged;
}

/* ----------------------------- admin -------------------------------- */

export function getAdminPasswordHash() {
  const d = getDb();
  const row = d.prepare("SELECT password_hash FROM admin WHERE id = 1").get();
  return row ? row.password_hash : null;
}

export function setAdminPasswordHash(hash) {
  const d = getDb();
  const existing = d.prepare("SELECT id FROM admin WHERE id = 1").get();
  if (existing) {
    d.prepare("UPDATE admin SET password_hash = ? WHERE id = 1").run(hash);
  } else {
    d.prepare("INSERT INTO admin (id, password_hash) VALUES (1, ?)").run(hash);
  }
}

export { getDb };
