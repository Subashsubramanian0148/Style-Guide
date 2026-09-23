import React from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend,
} from "recharts";

/**
 * Chart / graph components, built on Recharts (https://recharts.org/) — an
 * SVG-based, composable React charting library. CORE wraps it rather than
 * building charting from scratch, then owns the visual layer (tokens for
 * every color/font/stroke here, none of Recharts' own defaults) and
 * accessibility (every chart ships a real data table alternative, not just
 * an aria-label — see ChartDataTable below).
 */

export interface ChartSeries { key: string; label: string; color?: string; }
export interface ChartDatum { [key: string]: string | number; }

const DEFAULT_SERIES_COLORS = [
  "var(--core-color-categorical-1)",
  "var(--core-color-categorical-2)",
  "var(--core-color-categorical-3)",
  "var(--core-color-categorical-4)",
  "var(--core-color-categorical-5)",
];

const axisTick = { fontSize: 12, fill: "var(--core-color-text-secondary)" };
const legendStyle = { fontSize: 12, color: "var(--core-color-text-secondary)" };
const tooltipStyle: React.CSSProperties = {
  background: "var(--core-card-bg)",
  border: "1px solid var(--core-color-border-default)",
  borderRadius: "var(--core-radius-sm)",
  fontSize: "var(--core-font-size-xs, 12px)",
};

export interface ChartProps {
  data: ChartDatum[];
  /** The field in each datum used as the x-axis / row label. */
  xKey: string;
  series: ChartSeries[];
  height?: number;
  /** Required — becomes the visible chart title and the data table's caption. */
  title: string;
  description?: string;
}

/** WCAG 1.1.1 (Non-text Content) / 4.1.2 (Name, Role, Value) — a chart is
 *  non-text content; an aria-label summarizing "line chart, 5 points" is not
 *  an equivalent. This renders the same data as a real, visually-hidden-but-
 *  screen-reader-visible table, so the information the chart conveys is
 *  actually available, not just announced as existing. */
function ChartDataTable({ data, xKey, series, title }: { data: ChartDatum[]; xKey: string; series: ChartSeries[]; title: string }) {
  return (
    <table className="cds-visually-hidden">
      <caption>{title} — data table</caption>
      <thead>
        <tr>
          <th scope="col">{xKey}</th>
          {series.map((s) => <th key={s.key} scope="col">{s.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <th scope="row">{row[xKey]}</th>
            {series.map((s) => <td key={s.key}>{row[s.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartFrame({ title, description, children, data, xKey, series }: {
  title: string; description?: string; children: React.ReactNode;
  data: ChartDatum[]; xKey: string; series: ChartSeries[];
}) {
  return (
    <figure className="cds-chart">
      <figcaption className="cds-chart-title">{title}</figcaption>
      {/* The rendered SVG is decorative to assistive tech — the table below
          is the real accessible equivalent, per the note on ChartDataTable. */}
      <div aria-hidden="true">{children}</div>
      {description && <p className="cds-chart-desc">{description}</p>}
      <ChartDataTable data={data} xKey={xKey} series={series} title={title} />
    </figure>
  );
}

export function LineChartCard({ data, xKey, series, height = 260, title, description }: ChartProps) {
  return (
    <ChartFrame title={title} description={description} data={data} xKey={xKey} series={series}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--core-color-border-default)" />
          <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: "var(--core-color-border-default)" }} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={40} />
          <RTooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          {series.map((s, i) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
              stroke={s.color ?? DEFAULT_SERIES_COLORS[i % DEFAULT_SERIES_COLORS.length]}
              strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function BarChartCard({ data, xKey, series, height = 260, title, description }: ChartProps) {
  return (
    <ChartFrame title={title} description={description} data={data} xKey={xKey} series={series}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--core-color-border-default)" vertical={false} />
          <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: "var(--core-color-border-default)" }} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={40} />
          <RTooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label}
              fill={s.color ?? DEFAULT_SERIES_COLORS[i % DEFAULT_SERIES_COLORS.length]}
              radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
