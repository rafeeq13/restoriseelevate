/**
 * CSS-only "device mockup" that simulates a hospitality analytics dashboard.
 * Used in the hero / showcase section to give a visual proof-of-craft without
 * requiring real screenshots. Uses bar-pulse + live-dot CSS for motion.
 */

const TODAY_METRICS = [
  { label: "Covers", value: "247", trend: "+18%" },
  { label: "Online orders", value: "1,432", trend: "+34%" },
  { label: "Avg. ticket", value: "£28.40", trend: "+6%" },
  { label: "Repeat rate", value: "31%", trend: "+4%" },
];

const TOP_DISHES = [
  { name: "Truffle pappardelle", count: 47 },
  { name: "Wagyu burger", count: 38 },
  { name: "Sea bass crudo", count: 31 },
  { name: "Lobster ravioli", count: 26 },
];

export function ShowcaseDevice() {
  return (
    <div className="device-frame">
      <div className="device-screen device-screen-wide">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[color:var(--brand-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-[color:var(--brand-primary)]"
              style={{ boxShadow: "0 0 8px rgba(255,0,0,0.6)" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Live · Today
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            <span className="live-dot" aria-hidden="true" />
            <span>Connected</span>
          </div>
        </div>

        {/* Metric pills */}
        <div className="grid grid-cols-4 gap-px bg-[color:var(--brand-border)] border-b border-[color:var(--brand-border)]">
          {TODAY_METRICS.map((m) => (
            <div key={m.label} className="bg-white px-4 py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                {m.label}
              </p>
              <p className="font-display tabular mt-2 text-lg text-ink">{m.value}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--brand-success)]">
                {m.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + top dishes */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-5 p-5">
          {/* Bar chart */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Hourly orders
              </p>
              <p className="font-display tabular text-xs text-ink">8:00 — 22:00</p>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1.5">
              {[0.35, 0.5, 0.7, 0.85, 0.95, 0.7, 0.55, 0.6, 0.75, 0.9, 0.8, 0.65, 0.45, 0.3].map(
                (h, i) => (
                  <span
                    key={i}
                    className="bar-pulse"
                    style={{
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.12}s`,
                      animationDuration: "2.6s",
                    }}
                  />
                ),
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="font-display tabular text-xl text-ink">+184%</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                vs last 30d
              </p>
            </div>
          </div>

          {/* Top dishes */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Top dishes today
            </p>
            <ul className="mt-4 space-y-2.5">
              {TOP_DISHES.map((d, i) => (
                <li
                  key={d.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="font-display tabular text-[10px] text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-xs text-ink">{d.name}</span>
                  </span>
                  <span className="font-display tabular text-xs text-[color:var(--brand-primary)]">
                    {d.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
