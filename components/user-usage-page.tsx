import type { UsageActivity } from "@/lib/usage-activity";

type UsageKind = keyof UsageActivity;

type UserUsagePageProps = {
  activity: UsageActivity;
};

const DAY_MS = 24 * 60 * 60 * 1_000;
const WEEK_COUNT = 52;
const DAY_COUNT = WEEK_COUNT * 7;

const SECTION_COPY: Array<{ kind: UsageKind; title: string }> = [
  { kind: "token", title: "Token 用量统计" },
  { kind: "tool", title: "工具调用用量统计" },
  { kind: "skill", title: "Skill 调用用量统计" },
];

function startOfDay(timestamp: number) {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

const TODAY = startOfDay(Date.now());

function usageDayKey(timestamp: number) {
  const date = new Date(timestamp);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function heatLevel(value: number, maximum: number) {
  if (value <= 0 || maximum <= 0) return 0;
  return Math.min(4, Math.ceil((value / maximum) * 4));
}

function formatDetail(timestamp: number, value: number, unit: string) {
  return `${new Date(timestamp).toLocaleDateString("zh-CN")} · ${value.toLocaleString("zh-CN")} ${unit}`;
}

function Heatmap({ values, unit }: { values: Map<string, number>; unit: string }) {
  const firstDay = TODAY - (DAY_COUNT - 1) * DAY_MS;
  const maximum = Math.max(0, ...values.values());
  const days = Array.from({ length: DAY_COUNT }, (_, index) => {
    const timestamp = firstDay + index * DAY_MS;
    const value = values.get(usageDayKey(timestamp)) ?? 0;
    return { timestamp, value, level: heatLevel(value, maximum) };
  });
  const months = Array.from({ length: WEEK_COUNT }, (_, index) => {
    const timestamp = firstDay + index * 7 * DAY_MS;
    const date = new Date(timestamp);
    const previous = index === 0 ? -1 : new Date(timestamp - 7 * DAY_MS).getMonth();
    return date.getMonth() !== previous ? `${date.getMonth() + 1}月` : null;
  }).filter((month): month is string => month !== null);

  return (
    <div className="usage-heatmap" aria-label="最近一年活动热力图">
      <div className="usage-heatmap-grid" aria-hidden="true">
        {days.map((day) => (
          <i
            className={`usage-heatmap-cell level-${day.level}`}
            data-tooltip={formatDetail(day.timestamp, day.value, unit)}
            key={day.timestamp}
          />
        ))}
      </div>
      <div className="usage-heatmap-months" aria-hidden="true">
        {months.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
      </div>
    </div>
  );
}

export function UserUsagePage({ activity }: UserUsagePageProps) {
  return (
    <section className="user-usage-page" aria-label="用户用量统计">
      {SECTION_COPY.map(({ kind, title }) => (
        <section className="user-usage-section" key={kind}>
          <h1>{title}</h1>
          <Heatmap values={activity[kind]} unit={kind === "token" ? "Tokens" : "次"} />
        </section>
      ))}
    </section>
  );
}
