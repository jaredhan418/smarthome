"use client";

import { useState } from "react";
import {
  Activity,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoonStar,
  PawPrint,
  Sparkles,
  Thermometer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DailyReport = {
  date: string;
  temperature: string;
  humidity: string;
  temperatureRange: string;
  humidityRange: string;
  temperatureTrend: number[];
  humidityTrend: number[];
  feedingCount: number;
  feedingAmount: number;
  lastFeeding: string;
  feedingTimes: string[];
  nightCount: number;
  nightTimes: string[];
  sleepScore: number;
  sleepLabel: string;
  sleepDuration: string;
  deepSleep: string;
  summary: string;
};

const reports: Record<"today" | "yesterday", DailyReport> = {
  today: {
    date: "11月10日 · 今日",
    temperature: "23.7",
    humidity: "47",
    temperatureRange: "22.8° — 25.1°",
    humidityRange: "43% — 52%",
    temperatureTrend: [23, 22.8, 23.1, 23.4, 24.2, 25.1, 24.6, 23.7],
    humidityTrend: [49, 51, 52, 48, 45, 43, 46, 47],
    feedingCount: 4,
    feedingAmount: 128,
    lastFeeding: "18:35",
    feedingTimes: ["07:20", "11:45", "15:10", "18:35"],
    nightCount: 2,
    nightTimes: ["00:42", "03:18"],
    sleepScore: 86,
    sleepLabel: "睡眠良好",
    sleepDuration: "11h 26m",
    deepSleep: "5h 42m",
    summary: "今天家中温湿度始终处于舒适区间。猫咪共进食 4 次、128g，食量正常；夜间起身 2 次，睡眠总时长 11 小时 26 分钟，深睡占比约 50%，整体状态良好。与昨日相比多进食 1 次，建议继续留意饮水量。",
  },
  yesterday: {
    date: "11月9日 · 昨日",
    temperature: "23.2",
    humidity: "49",
    temperatureRange: "22.4° — 24.6°",
    humidityRange: "45% — 54%",
    temperatureTrend: [22.9, 22.4, 22.8, 23.5, 24.1, 24.6, 23.9, 23.2],
    humidityTrend: [51, 53, 54, 50, 47, 45, 46, 49],
    feedingCount: 3,
    feedingAmount: 105,
    lastFeeding: "19:10",
    feedingTimes: ["08:05", "13:20", "19:10"],
    nightCount: 3,
    nightTimes: ["23:55", "02:10", "04:26"],
    sleepScore: 78,
    sleepLabel: "睡眠尚可",
    sleepDuration: "10h 48m",
    deepSleep: "4h 51m",
    summary: "昨天家中环境整体平稳，午后温度有小幅上升。猫咪共进食 3 次、105g，夜间起身 3 次，深睡占比约 45%。睡眠略少于日常平均水平，但饮食与活动节奏正常，无需特别干预。",
  },
};

function MiniTrend({ values, className }: { values: number[]; className?: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const path = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 120;
    const y = 30 - ((value - min) / range) * 24;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 120 36" className={cn("h-9 w-full", className)} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${path} L120,36 L0,36 Z`} fill="currentColor" opacity="0.07" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx="120" cy={30 - ((values[values.length - 1] - min) / range) * 24} r="2.4" fill="currentColor" />
    </svg>
  );
}

export function DailyFamilyReport() {
  const [selectedDay, setSelectedDay] = useState<"today" | "yesterday">("today");
  const [selectedTab, setSelectedTab] = useState<"data" | "summary">("data");
  const report = reports[selectedDay];

  return (
    <section id="daily-report" className="mt-9 scroll-mt-24">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-[-0.02em]">每日家庭报告</h2>
            <Badge><Activity size={11} />每日更新</Badge>
          </div>
          <p className="mt-1 text-[10px] text-[#92959b]">家的舒适与猫咪的日常，都有迹可循</p>
        </div>
        <div className="flex self-start rounded-xl border border-[#dfe3e9] bg-white p-1" role="tablist" aria-label="家庭报告视图">
          {(["data", "summary"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              onClick={() => setSelectedTab(tab)}
              aria-selected={selectedTab === tab}
              className={cn("rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors", selectedTab === tab ? "bg-[#20242b] text-white shadow-sm" : "text-[#858b95] hover:bg-[#f0f2f6]")}
            >
              {tab === "data" ? "家庭数据" : "每日总结"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] text-[#8a929d]"><CalendarDays size={12} />{report.date}</span>
        <div className="flex rounded-xl border border-[#dfe3e9] bg-white p-1" aria-label="选择报告日期">
          {(["today", "yesterday"] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              aria-pressed={selectedDay === day}
              className={cn("rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors", selectedDay === day ? "bg-[#20242b] text-white shadow-sm" : "text-[#858b95] hover:bg-[#f0f2f6]")}
            >
              {day === "today" ? "今日" : "昨日"}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === "data" ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="tabpanel" aria-label="家庭数据">
          <Card className="col-span-2 p-4 md:col-span-1 md:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#707782]">环境舒适度</span>
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf1f7] text-[#61758e]"><Thermometer size={15} /></span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[22px] font-semibold tracking-[-0.04em]">{report.temperature}<span className="text-[11px] font-normal text-[#9299a3]">°C</span></p>
                <p className="mt-1 text-[9px] text-[#98a0aa]">{report.temperatureRange}</p>
                <MiniTrend values={report.temperatureTrend} className="mt-2 text-[#738aa7]" />
              </div>
              <div>
                <p className="text-[22px] font-semibold tracking-[-0.04em]">{report.humidity}<span className="text-[11px] font-normal text-[#9299a3]">%</span></p>
                <p className="mt-1 text-[9px] text-[#98a0aa]">{report.humidityRange}</p>
                <MiniTrend values={report.humidityTrend} className="mt-2 text-[#91a2b5]" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#707782]">猫咪进食</span>
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf1f7] text-[#61758e]"><PawPrint size={15} /></span>
            </div>
            <p className="mt-4 text-[26px] font-semibold tracking-[-0.04em]">{report.feedingCount}<span className="ml-1 text-[11px] font-normal text-[#9299a3]">次</span></p>
            <p className="mt-1 text-[10px] text-[#89929e]">共 {report.feedingAmount}g · 最近 {report.lastFeeding}</p>
            <div className="mt-4 flex items-center gap-1" aria-label={`进食时间：${report.feedingTimes.join("、")}`}>
              {report.feedingTimes.map((time) => <span key={time} className="h-1.5 flex-1 rounded-full bg-[#9caec4]" title={time} />)}
              <span className="ml-1 text-[9px] text-[#9aa2ac]">规律</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#707782]">夜间起身</span>
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf1f7] text-[#61758e]"><MoonStar size={15} /></span>
            </div>
            <p className="mt-4 text-[26px] font-semibold tracking-[-0.04em]">{report.nightCount}<span className="ml-1 text-[11px] font-normal text-[#9299a3]">次</span></p>
            <p className="mt-1 truncate text-[10px] text-[#89929e]">{report.nightTimes.join(" · ")}</p>
            <div className="mt-4 flex items-center gap-1.5 text-[9px] text-[#8f99a6]"><Clock3 size={11} />活动间隔正常</div>
          </Card>

          <Card className="col-span-2 p-4 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#707782]">猫咪睡眠质量</span>
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#edf1f7] text-[#61758e]"><BedDouble size={15} /></span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-[26px] font-semibold tracking-[-0.04em]">{report.sleepScore}<span className="ml-1 text-[11px] font-normal text-[#9299a3]">分</span></p>
              <span className="mb-1 text-[10px] text-[#667f9e]">{report.sleepLabel}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8ecf2]"><div className="h-full rounded-full bg-[#829ab8] transition-all" style={{ width: `${report.sleepScore}%` }} /></div>
            <p className="mt-3 text-[9px] text-[#929ba7]">总睡眠 {report.sleepDuration} · 深睡 {report.deepSleep}</p>
          </Card>
        </div>
      ) : (
        <div role="tabpanel" aria-label="每日总结">
          <div className="overflow-hidden rounded-[20px] bg-[#171a20] p-6 text-white shadow-[0_12px_30px_rgba(20,25,32,0.08)] sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-white/10 text-[#dceaff]"><Sparkles size={19} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">窝头的每日总结</h3>
                  <span className="text-[9px] text-[#8f9aa9]">AI 家庭分析</span>
                </div>
                <p className="mt-3 text-[12px] leading-[2] text-[#b7c0cc]">{report.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[9px] text-[#c4d5e9]"><CheckCircle2 size={11} />整体状态良好</div>
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Card className="flex items-center gap-3 p-4"><span className="flex size-9 items-center justify-center rounded-xl bg-[#edf1f7] text-[#61758e]"><Thermometer size={16} /></span><div><p className="text-[10px] text-[#929ba7]">环境舒适</p><p className="mt-1 text-xs font-medium">{report.temperature}°C · {report.humidity}%</p></div></Card>
            <Card className="flex items-center gap-3 p-4"><span className="flex size-9 items-center justify-center rounded-xl bg-[#edf1f7] text-[#61758e]"><PawPrint size={16} /></span><div><p className="text-[10px] text-[#929ba7]">饮食规律</p><p className="mt-1 text-xs font-medium">{report.feedingCount} 次 · {report.feedingAmount}g</p></div></Card>
            <Card className="flex items-center gap-3 p-4"><span className="flex size-9 items-center justify-center rounded-xl bg-[#edf1f7] text-[#61758e]"><BedDouble size={16} /></span><div><p className="text-[10px] text-[#929ba7]">{report.sleepLabel}</p><p className="mt-1 text-xs font-medium">{report.sleepScore} 分 · {report.sleepDuration}</p></div></Card>
          </div>
        </div>
      )}
    </section>
  );
}
