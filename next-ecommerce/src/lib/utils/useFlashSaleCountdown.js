"use client";

import { useState, useEffect } from "react";

function msToCountdown(ms) {
  if (ms <= 0) return { days: 0, hrs: 0, min: 0, sec: 0 };
  const sec = Math.floor((ms / 1000) % 60);
  const min = Math.floor((ms / (60 * 1000)) % 60);
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 24);
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  return { days, hrs, min, sec };
}

/**
 * @param {number | null} endTime - End timestamp (ms). If null/undefined, returns zeros (expired).
 */
export function useFlashSaleCountdown(endTime = null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, min: 0, sec: 0 });

  useEffect(() => {
    if (endTime == null || endTime <= Date.now()) {
      setTimeLeft({ days: 0, hrs: 0, min: 0, sec: 0 });
      return;
    }

    const tick = () => {
      const ms = endTime - Date.now();
      setTimeLeft(msToCountdown(ms));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
}
