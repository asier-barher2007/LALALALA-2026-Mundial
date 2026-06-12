import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const calc = (target) => {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
};

const pad = (n) => String(n).padStart(2, "0");

const Countdown = ({ target, testId = "countdown" }) => {
  const { t } = useI18n();
  const [c, setC] = useState(() => calc(target));
  useEffect(() => {
    const id = setInterval(() => setC(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const block = (val, label, id) => (
    <div className="flex flex-col items-center" data-testid={`${testId}-${id}`}>
      <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
        {pad(val)}
      </span>
      <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 sm:gap-6" data-testid={testId}>
      {block(c.days, t("countdown.days"), "days")}
      <span className="text-neon text-2xl sm:text-4xl font-mono">:</span>
      {block(c.hours, t("countdown.hours"), "hours")}
      <span className="text-neon text-2xl sm:text-4xl font-mono">:</span>
      {block(c.minutes, t("countdown.minutes"), "minutes")}
      <span className="text-neon text-2xl sm:text-4xl font-mono">:</span>
      {block(c.seconds, t("countdown.seconds"), "seconds")}
    </div>
  );
};

export default Countdown;
