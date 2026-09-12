import { getSettings } from "./db.js";

const NP_URL = "https://api.novaposhta.ua/v2.0/json/";

function getApiKey() {
  return getSettings().delivery?.novaPoshtaApiKey || "";
}

async function callNp(body) {
  const res = await fetch(NP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Nova Poshta HTTP ${res.status}`);
  return res.json();
}

export function isNovaPoshtaConfigured() {
  return Boolean(getApiKey());
}

export async function searchCities(query) {
  const apiKey = getApiKey();
  if (!apiKey) return { configured: false, results: [] };
  const json = await callNp({
    apiKey,
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: { CityName: query, Limit: 20, Page: 1 },
  });
  const items = json?.data?.[0]?.Addresses || [];
  return {
    configured: true,
    results: items.map((a) => ({
      ref: a.DeliveryCity,
      name: a.MainDescription,
      area: a.Area,
      full: a.Present,
    })),
  };
}

export async function searchBranches(cityRef, query = "") {
  const apiKey = getApiKey();
  if (!apiKey) return { configured: false, results: [] };
  const json = await callNp({
    apiKey,
    modelName: "AddressGeneral",
    calledMethod: "getWarehouses",
    methodProperties: { CityRef: cityRef, FindByString: query, Limit: 200, Page: 1 },
  });
  const items = json?.data || [];
  return {
    configured: true,
    results: items.map((w) => ({
      ref: w.Ref,
      description: w.Description,
      number: w.Number,
      type: w.CategoryOfWarehouse,
    })),
  };
}
