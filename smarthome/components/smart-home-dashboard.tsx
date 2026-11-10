"use client";

import { useMemo, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Blinds,
  Bot,
  ChevronDown,
  CloudSun,
  Command,
  Cpu,
  DoorOpen,
  House,
  LayoutDashboard,
  Leaf,
  ListFilter,
  MessageCircleMore,
  MoonStar,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react";
import { AiPanel } from "@/components/ai-panel";
import { DeviceCard } from "@/components/device-card";
import { VideoMonitoring } from "@/components/video-monitoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initialDevices, roomMeta, rooms, type Device, type DeviceType } from "@/lib/devices";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "家庭总览", icon: LayoutDashboard, href: "#overview" },
  { label: "空间管理", icon: DoorOpen, href: "#rooms" },
  { label: "视频监控", icon: Play, href: "#monitoring" },
  { label: "智能设备", icon: Cpu, href: "#devices" },
  { label: "场景自动化", icon: Command, href: "#scenes" },
];

const sceneItems = [
  { name: "回家模式", icon: Sun, className: "bg-[#eff2fa] text-[#76787c]" },
  { name: "离家模式", icon: DoorOpen, className: "bg-[#e9ecf4] text-[#6d6e72]" },
  { name: "观影模式", icon: Play, className: "bg-[#e6e9f1] text-[#6a6b6f]" },
  { name: "晚安模式", icon: MoonStar, className: "bg-[#e7eaf2] text-[#67686c]" },
];

const deviceTypes: ("全部类型" | DeviceType)[] = ["全部类型", "照明", "环境", "安防", "影音", "家电", "传感"];

export function SmartHomeDashboard() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[number]>("全部房间");
  const [selectedType, setSelectedType] = useState<(typeof deviceTypes)[number]>("全部类型");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [aiOpen, setAiOpen] = useState(false);
  const [activeScene, setActiveScene] = useState("回家模式");
  const [toast, setToast] = useState("");

  const onlineCount = devices.filter((device) => device.online).length;
  const activeCount = devices.filter((device) => device.isOn && device.online).length;
  const power = devices.reduce((total, device) => total + (device.isOn && device.online ? device.power : 0), 0);

  const filteredDevices = useMemo(() => devices.filter((device) => {
    const matchesRoom = selectedRoom === "全部房间" || device.room === selectedRoom;
    const matchesType = selectedType === "全部类型" || device.type === selectedType;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${device.name}${device.room}${device.type}`.toLowerCase().includes(normalizedQuery);
    return matchesRoom && matchesType && matchesQuery;
  }), [devices, query, selectedRoom, selectedType]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function toggleDevice(id: number, value: boolean) {
    const device = devices.find((item) => item.id === id);
    setDevices((current) => current.map((item) => item.id === id ? {
      ...item,
      isOn: value,
      power: value ? 4 + ((item.id * 13) % 180) : 0,
    } : item));
    if (device) notify(`${device.room} · ${device.name}已${value ? "开启" : "关闭"}`);
  }

  function selectRoom(room: (typeof rooms)[number], scroll = false) {
    setSelectedRoom(room);
    setVisibleCount(12);
    if (scroll) document.getElementById("devices")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applyScene(scene: string) {
    setActiveScene(scene);
    setDevices((current) => current.map((device) => {
      let isOn = device.isOn;
      if (scene === "离家模式") isOn = device.type === "安防" || device.type === "传感";
      if (scene === "回家模式" && device.room === "客厅") isOn = ["照明", "环境", "影音"].includes(device.type) || /窗帘/.test(device.name);
      if (scene === "晚安模式") {
        if (device.type === "照明" || device.type === "影音") isOn = false;
        if (device.room === "主卧" && /空调|加湿器|夜起地灯/.test(device.name)) isOn = true;
        if (device.type === "安防") isOn = true;
      }
      if (scene === "观影模式" && device.room === "客厅") {
        if (device.type === "照明" || /窗帘/.test(device.name)) isOn = false;
        if (/电视|音响|空调/.test(device.name)) isOn = true;
      }
      return { ...device, isOn, power: isOn ? Math.max(device.power, 4 + ((device.id * 13) % 180)) : 0 };
    }));
    notify(`已为你切换至${scene}`);
  }

  function executeCommand(command: string): string {
    const turnOff = /关闭|关掉|关上/.test(command);
    const turnOn = /打开|开启|启动/.test(command);
    if (/晚安/.test(command)) {
      applyScene("晚安模式");
      return "晚安模式已开启。我关闭了主要灯光和影音设备，保留主卧舒适环境与全屋安防。祝你有个好梦。";
    }
    if (/离家/.test(command)) {
      applyScene("离家模式");
      return "离家模式已执行。非必要设备已关闭，安防传感器保持工作，我会继续替你照看家中情况。";
    }
    if (/观影/.test(command)) {
      applyScene("观影模式");
      return "观影模式准备好了：客厅灯光与窗帘已关闭，电视、音响和空调已开启。享受你的电影时光。";
    }
    if (/回家/.test(command)) {
      applyScene("回家模式");
      return "欢迎回家。客厅灯光、空调和影音设备已开启，窗帘也已为你打开。";
    }
    if (/灯/.test(command) && (turnOff || turnOn)) {
      const room = rooms.find((item) => item !== "全部房间" && command.includes(item));
      setDevices((current) => current.map((device) => {
        if (device.type === "照明" && (!room || device.room === room)) {
          return { ...device, isOn: turnOn, power: turnOn ? Math.max(device.power, 24) : 0 };
        }
        return device;
      }));
      const countByRoom = devices.filter((device) => device.type === "照明" && (!room || device.room === room)).length;
      return `好的，已${turnOn ? "打开" : "关闭"}${room ?? "全屋"}的 ${countByRoom} 台照明设备。${turnOff ? `预计每小时可节省约 ${Math.round(countByRoom * 18)} W 待机能耗。` : "亮度沿用你上次的偏好设置。"}`;
    }
    if (/空调/.test(command) && (turnOff || turnOn)) {
      const room = rooms.find((item) => item !== "全部房间" && command.includes(item));
      const count = devices.filter((device) => /空调/.test(device.name) && (!room || device.room === room)).length;
      setDevices((current) => current.map((device) => /空调/.test(device.name) && (!room || device.room === room) ? { ...device, isOn: turnOn, power: turnOn ? Math.max(device.power, 120) : 0 } : device));
      return `已${turnOn ? "开启" : "关闭"}${room ?? "全屋"} ${count} 台空调。当前室内平均温度约 23.7°C，体感舒适。`;
    }
    if (/状态|怎么样|情况/.test(command)) {
      return `家中目前 ${onlineCount} 台设备在线，${activeCount} 台正在运行。平均温度 23.7°C，湿度 47%，空气质量为优。安防系统正常，没有发现异常。`;
    }
    if (/能耗|用电|电费/.test(command)) {
      return `今日已用电 18.6 kWh，比昨天同期下降 12%。当前实时功率约 ${(power / 1000).toFixed(2)} kW，空调与热水器是主要耗电设备。建议在午后启用新风替代部分制冷。`;
    }
    if (/温度|湿度|空气/.test(command)) {
      return "客厅 24°C / 湿度 48%，主卧 23°C / 湿度 46%，书房 23°C / 湿度 45%。全屋 PM2.5 为 8 μg/m³，空气质量优，暂时不需要额外开启净化器。";
    }
    return "我可以帮你控制灯光、空调、切换回家或晚安模式，也可以查询房间温度与家庭能耗。试试说“关闭客厅灯光”或“家里现在怎么样？”。";
  }

  return (
    <div className="min-h-screen bg-[#edf0f8] text-[#22262d]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col bg-[#111318] px-4 py-5 text-white lg:flex">
        <a href="#overview" className="flex items-center gap-3 px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#d8e9ff] text-[#18212c]"><House size={20} strokeWidth={2.2} /></span>
          <span><span className="block text-[17px] font-semibold tracking-[0.18em]">J-Home</span><span className="block text-[8px] tracking-[0.2em] text-[#999ca0]">AI SMART HOME</span></span>
        </a>
        <button className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.045] p-3 text-left transition-colors hover:bg-white/[0.08]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#292f38] text-[#d8e9ff]"><House size={16} /></span>
          <span className="min-w-0 flex-1"><span className="block text-xs font-medium">Jared 的家</span><span className="mt-0.5 block text-[9px] text-[#999ca0]">杭州 · 西溪公寓</span></span>
          <ChevronDown size={14} className="text-[#999ca0]" />
        </button>
        <p className="mb-2 mt-8 px-3 text-[9px] font-medium tracking-[0.18em] text-[#7f8185]">控制中心</p>
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <a key={item.label} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-xs transition-colors", index === 0 ? "bg-[#d8e9ff] font-semibold text-[#18212c]" : "text-[#adafb5] hover:bg-white/[0.06] hover:text-white")}>
              <item.icon size={17} strokeWidth={1.8} />{item.label}
              {item.label === "智能设备" && <span className={cn("ml-auto rounded-md px-1.5 py-0.5 text-[9px]", index === 0 ? "bg-black/10" : "bg-white/8")}>206</span>}
            </a>
          ))}
        </nav>
        <button onClick={() => setAiOpen(true)} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-xs text-[#adafb5] transition-colors hover:bg-white/[0.06] hover:text-white xl:hidden"><MessageCircleMore size={17} />AI 家庭助手</button>
        <div className="mt-auto">
          <div className="mb-5 overflow-hidden rounded-2xl border border-white/8 bg-[#1b2028] p-4">
            <div className="mb-3 flex items-center justify-between"><Leaf size={18} className="text-[#d8e9ff]" /><ArrowUpRight size={14} className="text-[#86888c]" /></div>
            <p className="text-xs font-medium">本周减碳 4.8 kg</p>
            <p className="mt-1 text-[9px] leading-relaxed text-[#999ca0]">相当于种下 0.26 棵树</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#d8e9ff]" /></div>
          </div>
          <div className="flex items-center gap-3 border-t border-white/8 px-2 pt-4">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#c5c8ce] text-xs font-semibold text-[#4b4c4e]">J</div>
            <div className="flex-1"><p className="text-xs font-medium">Jared</p><p className="mt-0.5 text-[9px] text-[#8d8f93]">家庭管理员</p></div>
            <Settings2 size={15} className="text-[#8d8f93]" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-56">
        <header className="flex h-16 items-center justify-between border-b border-[#dee2e8] bg-[#edf0f8]/90 px-4 backdrop-blur md:px-6 lg:h-[72px] lg:px-8">
          <a href="#overview" className="flex items-center gap-2.5 lg:hidden"><span className="flex size-8 items-center justify-center rounded-[10px] bg-[#20242b] text-[#d8e9ff]"><House size={17} /></span><span className="font-semibold tracking-[0.16em]">J-Home</span></a>
          <div className="hidden items-center gap-2 text-xs text-[#8d8f93] lg:flex"><span>我的家庭</span><span>/</span><span className="font-medium text-[#434446]">家庭总览</span></div>
          <div className="flex items-center gap-2">
            <Badge className="hidden bg-[#e5e8f0] text-[#6b6c70] sm:inline-flex"><span className="size-1.5 rounded-full bg-[#8e9094]" />全屋网络良好</Badge>
            <Button variant="ghost" size="icon-sm" aria-label="通知" className="relative" onClick={() => notify("没有新的异常通知，家中一切正常")}><Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#9da0a4]" /></Button>
          </div>
        </header>

        <div className="mx-auto flex max-w-[1700px] items-start gap-6 px-4 pb-28 pt-6 md:px-6 md:pt-8 lg:px-8 lg:pb-8">
          <main className="min-w-0 flex-1">
            <section id="overview" className="scroll-mt-24">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-[#8a8c90]"><span>11月10日 · 星期二</span><span className="h-3 w-px bg-[#d2d5db]" /><span>杭州</span></div>
                  <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#2d2d2f] md:text-[34px]">欢迎回家，Jared。</h1>
                  <p className="mt-2 text-xs leading-relaxed text-[#828488] md:text-[13px]">家是懂你的空间，一切都已为你准备妥当。</p>
                </div>
                <div className="flex items-center gap-3 self-start rounded-2xl border border-[#dde1e7] bg-white/70 px-4 py-3 sm:self-auto">
                  <CloudSun size={28} strokeWidth={1.4} className="text-[#84868a]" />
                  <div><p className="text-sm font-semibold">22°C <span className="ml-1 text-[11px] font-normal text-[#7c7e82]">多云</span></p><p className="mt-0.5 text-[10px] text-[#96999d]">适宜开窗通风</p></div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Card className="p-4 md:p-5">
                  <div className="flex items-start justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-[#e8ebf3] text-[#67686c]"><Cpu size={18} /></span><Badge className="bg-transparent px-0 text-[#7f8185]"><span className="size-1.5 rounded-full bg-[#95989c]" />运行稳定</Badge></div>
                  <p className="mt-5 text-[11px] text-[#898b8f]">在线设备</p>
                  <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em]">{onlineCount}<span className="ml-1 text-xs font-normal text-[#9b9ea2]">/ {devices.length}</span></p>
                </Card>
                <Card className="p-4 md:p-5">
                  <div className="flex items-start justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-[#eceff7] text-[#76787c]"><Zap size={18} /></span><span className="flex items-center text-[10px] font-medium text-[#828488]"><ArrowDownRight size={12} />12%</span></div>
                  <p className="mt-5 text-[11px] text-[#898b8f]">今日能耗</p>
                  <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em]">18.6<span className="ml-1 text-xs font-normal text-[#9b9ea2]">kWh</span></p>
                </Card>
                <Card className="p-4 md:p-5">
                  <div className="flex items-start justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-[#e8ebf3] text-[#6e6f73]"><Thermometer size={18} /></span><span className="text-[10px] text-[#8f9195]">体感舒适</span></div>
                  <p className="mt-5 text-[11px] text-[#898b8f]">室内均温</p>
                  <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em]">23.7<span className="ml-1 text-xs font-normal text-[#9b9ea2]">°C</span></p>
                </Card>
                <Card className="bg-[#171a20] text-white border-[#171a20] p-4 md:p-5">
                  <div className="flex items-start justify-between"><span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-[#dceaff]"><ShieldCheck size={18} /></span><span className="size-2 rounded-full bg-[#d8e9ff] shadow-[0_0_0_4px_rgba(180,215,250,0.14)]" /></div>
                  <p className="mt-5 text-[11px] text-[#b4b7bd]">全屋安防</p>
                  <p className="mt-1 text-[23px] font-semibold tracking-[-0.03em]">守护中</p>
                </Card>
              </div>
            </section>

            <section id="scenes" className="mt-8 scroll-mt-24">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">快捷场景</h2><span className="text-[10px] text-[#95989c]">一键切换家的模样</span></div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {sceneItems.map((scene) => (
                  <button key={scene.name} onClick={() => applyScene(scene.name)} className={cn("group flex items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(20,25,32,0.05)]", activeScene === scene.name ? "border-[#9ea1a5]" : "border-[#dfe3e9]")}>
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", scene.className)}><scene.icon size={17} /></span>
                    <span className="flex-1 text-xs font-medium">{scene.name}</span>
                    <ArrowUpRight size={13} className="text-[#a7a9af] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </section>

            <section id="rooms" className="mt-9 scroll-mt-24">
              <div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold tracking-[-0.02em]">我的空间</h2><p className="mt-1 text-[10px] text-[#94979b]">每个空间，都有刚刚好的舒适</p></div><Button variant="ghost" size="sm" className="text-[11px]" onClick={() => selectRoom("全部房间", true)}>全部空间<ArrowRight size={13} /></Button></div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {roomMeta.map((room, index) => {
                  const RoomIcon = [Blinds, MoonStar, CookingPotPlaceholder, Bot][index] ?? House;
                  const roomDevices = devices.filter((device) => device.room === room.name);
                  const active = roomDevices.filter((device) => device.isOn).length;
                  return (
                    <button key={room.name} onClick={() => selectRoom(room.name, true)} className={cn("group relative overflow-hidden rounded-[20px] border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,25,32,0.06)]", selectedRoom === room.name ? "border-[#a4a6ac] bg-[#f3f7ff]" : "border-[#dee2e8] bg-white")}>
                      <div className="flex items-start justify-between"><span className={cn("flex size-10 items-center justify-center rounded-[13px]", index === 0 ? "bg-[#e7eaf2] text-[#696a6e]" : index === 1 ? "bg-[#e4e7ef] text-[#6e6f73]" : index === 2 ? "bg-[#e8ebf3] text-[#797b7f]" : "bg-[#e6e9f1] text-[#6e6f73]")}><RoomIcon size={20} strokeWidth={1.7} /></span><ArrowUpRight size={14} className="text-[#a3a5ab]" /></div>
                      <p className="mt-4 text-sm font-semibold">{room.name}</p><p className="mt-1 text-[10px] text-[#9c9fa3]">{room.description}</p>
                      <div className="mt-4 flex items-center gap-2 border-t border-[#e8ebf3] pt-3 text-[10px] text-[#828488]"><span>{room.temperature}</span><span className="size-0.5 rounded-full bg-[#b8bbc1]" /><span>{room.humidity}</span><span className="ml-auto text-[#77797d]">{active} 台运行</span></div>
                    </button>
                  );
                })}
              </div>
            </section>

            <VideoMonitoring />

            <section id="devices" className="mt-10 scroll-mt-24">
              <div className="flex items-end justify-between gap-3">
                <div><div className="flex items-center gap-2"><h2 className="text-base font-semibold tracking-[-0.02em]">智能设备</h2><Badge>{devices.length} 台</Badge></div><p className="mt-1 text-[10px] text-[#94979b]">轻点开关，让设备听从你的安排</p></div>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => notify("添加设备：请确保新设备已进入配网模式")}><Plus size={14} />添加设备</Button>
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#dfe3e9] bg-white p-3 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#eef1f9] px-3"><Search size={15} className="shrink-0 text-[#929498]" /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} placeholder="搜索设备、房间..." className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#9fa2a6]" aria-label="搜索智能设备" />{query && <button onClick={() => setQuery("")} className="text-[10px] text-[#8e9094]">清除</button>}</div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
                  <div className="relative shrink-0"><ListFilter size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7f83]" /><select value={selectedType} onChange={(event) => { setSelectedType(event.target.value as (typeof deviceTypes)[number]); setVisibleCount(12); }} className="h-9 appearance-none rounded-xl border border-[#dfe3e9] bg-white pl-8 pr-8 text-[11px] text-[#6a6b6f] outline-none" aria-label="筛选设备类型">{deviceTypes.map((type) => <option key={type}>{type}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#929498]" /></div>
                  <Button variant="secondary" size="sm" className="h-9 shrink-0" onClick={() => { setSelectedRoom("全部房间"); setSelectedType("全部类型"); setQuery(""); setVisibleCount(12); }}>重置筛选</Button>
                </div>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {rooms.map((room) => <button key={room} onClick={() => selectRoom(room)} className={cn("shrink-0 rounded-full px-3.5 py-2 text-[11px] font-medium transition-colors", selectedRoom === room ? "bg-[#171a20] text-white" : "border border-[#dde1e7] bg-white text-[#7a7c80] hover:border-[#bec1c7]")}>{room}{room !== "全部房间" && <span className={cn("ml-1.5 text-[9px]", selectedRoom === room ? "text-[#c4c7cd]" : "text-[#a2a4aa]")}>{devices.filter((device) => device.room === room).length}</span>}</button>)}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-[#909296]"><span>显示 {Math.min(visibleCount, filteredDevices.length)} / {filteredDevices.length} 台设备</span><span className="flex items-center gap-1.5"><Wifi size={11} />实时状态已同步</span></div>
              {filteredDevices.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
                  {filteredDevices.slice(0, visibleCount).map((device) => <DeviceCard key={device.id} device={device} onToggle={toggleDevice} />)}
                </div>
              ) : (
                <Card className="mt-3 flex flex-col items-center justify-center py-14 text-center"><Search size={25} className="mb-3 text-[#a3a5ab]" /><p className="text-sm font-medium">没有找到相关设备</p><p className="mt-1 text-xs text-[#95989c]">换个关键词或重置筛选试试</p></Card>
              )}
              {visibleCount < filteredDevices.length && <div className="mt-6 flex justify-center"><Button variant="outline" onClick={() => setVisibleCount((count) => count + 12)}>加载更多设备<ArrowDownRight size={14} /></Button></div>}
            </section>
          </main>

          <aside className="sticky top-6 hidden w-[340px] shrink-0 xl:block"><AiPanel onCommand={executeCommand} /></aside>
        </div>
      </div>

      <button onClick={() => setAiOpen(true)} className="fixed bottom-24 right-4 z-30 flex size-13 items-center justify-center rounded-2xl bg-[#171a20] text-[#dceaff] shadow-[0_10px_30px_rgba(20,25,32,0.28)] transition-transform hover:scale-105 lg:bottom-6 lg:right-6 xl:hidden" aria-label="打开 AI 家庭助手"><Sparkles size={22} /></button>

      <nav className="fixed inset-x-3 bottom-3 z-30 flex h-16 items-center justify-around rounded-[20px] border border-white/10 bg-[#111318]/95 px-2 text-[#9a9da1] shadow-[0_12px_35px_rgba(20,25,32,0.25)] backdrop-blur lg:hidden">
        <a href="#overview" className="flex min-w-14 flex-col items-center gap-1.5 text-[#d8e9ff]"><LayoutDashboard size={19} /><span className="text-[9px]">总览</span></a>
        <a href="#devices" className="flex min-w-14 flex-col items-center gap-1.5"><Cpu size={19} /><span className="text-[9px]">设备</span></a>
        <button onClick={() => setAiOpen(true)} className="flex min-w-14 flex-col items-center gap-1.5"><MessageCircleMore size={19} /><span className="text-[9px]">AI 助手</span></button>
        <a href="#scenes" className="flex min-w-14 flex-col items-center gap-1.5"><Command size={19} /><span className="text-[9px]">场景</span></a>
      </nav>

      <Dialog.Root open={aiOpen} onOpenChange={setAiOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="dialog-backdrop fixed inset-0 z-40 bg-[#11141a]/45 backdrop-blur-[2px]" />
          <Dialog.Popup className="dialog-popup fixed inset-x-0 bottom-0 z-50 outline-none sm:left-1/2 sm:right-auto sm:w-[420px] sm:-translate-x-1/2">
            <Dialog.Title className="sr-only">AI 家庭助手</Dialog.Title>
            <AiPanel onCommand={executeCommand} mobile onClose={() => setAiOpen(false)} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {toast && <div role="status" className="fixed left-1/2 top-5 z-[60] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#111318] px-4 py-2.5 text-xs text-white shadow-xl"><span className="size-1.5 rounded-full bg-[#d8e9ff]" />{toast}</div>}
    </div>
  );
}

function CookingPotPlaceholder(props: { size?: number; strokeWidth?: number }) {
  return <CookingPotIcon {...props} />;
}

function CookingPotIcon({ size = 20, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5Z" /><path d="M2 10h20M8 6l-1-2M12 6V3M16 6l1-2M6 20v2M18 20v2" /></svg>;
}
