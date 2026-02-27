/**
 * File-based footer settings - fallback when MongoDB not available
 */

import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "footer-settings.json");

function ensureDir() {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readFooterSettings() {
  try {
    ensureDir();
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Footer file read:", e.message);
  }
  return null;
}

export function writeFooterSettings(data) {
  try {
    ensureDir();
    fs.writeFileSync(FILE_PATH, JSON.stringify(data || {}, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Footer file write:", e.message);
    return false;
  }
}
