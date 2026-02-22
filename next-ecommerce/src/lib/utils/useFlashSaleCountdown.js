"use client";

import { useState, useEffect } from "react";

const FLASH_SALE_END_KEY = "drago_flash_sale_end";
const INITIAL_OFFSET_MS =
  2 * 24 * 60 * 60 * 1000 +
  6 * 60 * 60 * 1000 +
  1 * 60 * 1000 +
  29 * 1000;

function getEndTime() {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(FLASH_SALE_END_KEY);
  if (stored) return parseInt(stored, 10);
  const end = Date.now() + INITIAL_OFFSET_MS;
  sessionStorage.setItem(FLASH_SALE_END_KEY, String(end));
  return end;
}

function msToCountdown(ms) {
  if (ms <= 0) return { days: 0, hrs: 0, min: 0, sec: 0 };
  const sec = Math.floor((ms / 1000) % 60);
  const min = Math.floor((ms / (60 * 1000)) % 60);
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 24);
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  return { days, hrs, min, sec };
}

export function useFlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hrs: 6, min: 1, sec: 29 });

  useEffect(() => {
    const endTime = getEndTime();
    if (!endTime) return;

    const tick = () => {
      const ms = endTime - Date.now();
      setTimeLeft(msToCountdown(ms));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}
