"use client";

import type { ReactNode } from "react";
import {
  AirVent,
  Blinds,
  Camera,
  Coffee,
  CookingPot,
  Droplets,
  Fan,
  LampCeiling,
  Lightbulb,
  Monitor,
  Music2,
  Plug,
  Refrigerator,
  ShieldCheck,
  Speaker,
  Thermometer,
  Tv,
  WashingMachine,
  Wifi,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { Device } from "@/lib/devices";
import { cn } from "@/lib/utils";

function getDeviceIcon(device: Device): ReactNode {
  const { name, type } = device;
  const props = { size: 22, strokeWidth: 1.7 };
  if (/窗帘|晾衣架|电动窗/.test(name)) return <Blinds {...props} />;
  if (/摄像头/.test(name)) return <Camera {...props} />;
  if (/门窗|燃气|烟雾/.test(name)) return <ShieldCheck {...props} />;
  if (/空调|新风|净化|加湿|除湿|浴霸/.test(name)) return <AirVent {...props} />;
  if (/风扇|排风/.test(name)) return <Fan {...props} />;
  if (/冰箱/.test(name)) return <Refrigerator {...props} />;
  if (/洗衣|烘干/.test(name)) return <WashingMachine {...props} />;
  if (/咖啡|热水壶/.test(name)) return <Coffee {...props} />;
  if (/烤箱|烟灶|电饭煲|洗碗/.test(name)) return <CookingPot {...props} />;
  if (/电视/.test(name)) return <Tv {...props} />;
  if (/显示器/.test(name)) return <Monitor {...props} />;
  if (/音乐/.test(name)) return <Music2 {...props} />;
  if (/音响|音箱/.test(name)) return <Speaker {...props} />;
  if (/插座|电热毯/.test(name)) return <Plug {...props} />;
  if (/水浸|浇花|饮水|热水/.test(name)) return <Droplets {...props} />;
  if (/传感|监测|体重/.test(name)) return <Thermometer {...props} />;
  if (/顶灯|吊灯|筒灯/.test(name)) return <LampCeiling {...props} />;
  if (type === "照明") return <Lightbulb {...props} />;
  if (type === "安防") return <ShieldCheck {...props} />;
  if (type === "影音") return <Speaker {...props} />;
  if (type === "环境") return <AirVent {...props} />;
  return <Plug {...props} />;
}

const iconColors = {
  照明: "bg-[#eef1f9] text-[#727478]",
  环境: "bg-[#e9ecf4] text-[#606264]",
  安防: "bg-[#e5e8f0] text-[#66676b]",
  影音: "bg-[#e7eaf2] text-[#6d6e72]",
  家电: "bg-[#e7eaf2] text-[#6e6f73]",
  传感: "bg-[#e8ebf3] text-[#6d6e72]",
};

export function DeviceCard({ device, onToggle }: { device: Device; onToggle: (id: number, value: boolean) => void }) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-[18px] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#bec1c7] hover:shadow-[0_10px_30px_rgba(20,25,32,0.07)]",
        device.isOn && device.online && "border-[#d9dde3] bg-[#f6faff]",
        !device.online && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex size-11 items-center justify-center rounded-[14px]", iconColors[device.type])}>
          {getDeviceIcon(device)}
        </div>
        <Switch
          checked={device.isOn}
          onCheckedChange={(checked) => onToggle(device.id, checked)}
          disabled={!device.online}
          aria-label={`${device.isOn ? "关闭" : "打开"}${device.room}${device.name}`}
        />
      </div>
      <div className="mt-4">
        <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em]">{device.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#8b8d91]">
          <span>{device.room}</span>
          <span className="size-0.5 rounded-full bg-[#b6b9bf]" />
          <span>{device.type}</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-[#e8ebf3] pt-3">
        <div>
          <p className={cn("text-[17px] font-semibold tracking-[-0.03em]", !device.isOn && "text-[#9da0a4]")}>
            {device.online ? device.value : "设备离线"}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-[#93969a]">
            <Zap size={10} />
            {device.online ? `${device.isOn ? device.power : 0} W` : "请检查连接"}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#8b8d91]">
          <span className={cn("size-1.5 rounded-full", device.online ? "bg-[#8e9094]" : "bg-[#b0b2b8]")} />
          <Wifi size={12} strokeWidth={1.8} />
        </div>
      </div>
    </Card>
  );
}
