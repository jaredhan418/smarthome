export const rooms = ["全部房间", "客厅", "主卧", "厨房", "书房", "阳台", "浴室"] as const;
export type Room = (typeof rooms)[number];
export type DeviceRoom = Exclude<Room, "全部房间">;
export type DeviceType = "照明" | "环境" | "安防" | "影音" | "家电" | "传感";

export type Device = {
  id: number;
  name: string;
  room: DeviceRoom;
  type: DeviceType;
  isOn: boolean;
  online: boolean;
  value: string;
  power: number;
};

const deviceNames: Record<DeviceRoom, string[]> = {
  客厅: ["主吊灯", "落地灯", "中央空调", "新风系统", "智能电视", " Soundbar 音响", "扫地机器人", "窗帘电机", "温湿度传感器", "人体传感器", "智能插座", "空气净化器", "加湿器", "筒灯组", "氛围灯带", "智能摄像头", "门窗传感器", "智能香薰机", "风扇", "背景音乐"],
  主卧: ["床头灯", "主灯", "空调", "智能窗帘", "加湿器", "空气净化器", "温湿度传感器", "人体传感器", "智能插座", "睡眠监测仪", "香薰机", "壁灯", "氛围灯带", "智能风扇", "电动窗", "背景音乐", "智能闹钟", "除湿机", "电热毯", "夜起地灯"],
  厨房: ["顶灯", "操作台灯", "智能冰箱", "洗碗机", "烟灶套装", "净水器", "垃圾处理器", "智能烤箱", "电饭煲", "咖啡机", "燃气传感器", "烟雾传感器", "水浸传感器", "智能插座", "凉霸", "温湿度传感器", "智能热水壶", "消毒柜", "厨下灯光", "背景音乐"],
  书房: ["护眼台灯", "顶灯", "空调", "智能窗帘", "电脑插座", "显示器", "智能音箱", "空气净化器", "温湿度传感器", "人体传感器", "氛围灯带", "智能打印机", "网络音箱", "加湿器", "新风系统", "智能摄像头", "桌面风扇", "除湿机", "阅读灯", "背景音乐"],
  阳台: ["智能晾衣架", "顶灯", "智能窗帘", "洗衣机", "烘干机", "温湿度传感器", "光照传感器", "水浸传感器", "智能插座", "浇花系统", "氛围灯带", "智能摄像头", "门窗传感器", "除湿机", "新风口", "智能风扇", "宠物喂食器", "宠物饮水机", "收纳柜灯", "人体传感器"],
  浴室: ["主灯", "智能浴霸", "智能马桶", "热水器", "排风扇", "智能镜", "地暖", "温湿度传感器", "水浸传感器", "人体传感器", "智能插座", "毛巾架", "除雾系统", "香薰机", "背景音乐", "夜起地灯", "智能体重秤", "吹风机插座", "除湿机", "门窗传感器"],
};

const additionalDeviceNames: Record<DeviceRoom, string[]> = {
  客厅: ["智能沙发", "投影仪", "投影幕布", "游戏机", "智能茶吧机", "智能鞋柜", "宠物摄像头", "猫窝广角摄像头", "猫窝长焦摄像头", "空气检测仪", "智能门铃", "电暖器", "智能花盆", "无线充电器", "智能环境监测仪"],
  主卧: ["智能床垫", "智能衣柜", "衣物护理机", "智能化妆镜", "智能投影仪", "智能空调伴侣", "智能手环充电座", "智能门禁", "睡眠灯", "智能环境检测仪", "智能窗帘伴侣", "无线充电器", "智能花瓶", "智能音乐枕", "空气检测仪"],
  厨房: ["智能料理机", "智能微波炉", "智能破壁机", "智能电压力锅", "智能电磁炉", "智能油烟机", "智能水龙头", "智能米箱", "智能食材检测仪", "智能厨房秤", "智能垃圾桶", "智能排风系统", "智能冰箱摄像头", "智能环境检测仪"],
  书房: ["智能升降桌", "智能办公椅", "智能路由器", "智能NAS", "智能键盘", "智能鼠标", "智能会议摄像头", "智能麦克风", "智能护眼仪", "智能书柜灯", "智能空气检测仪", "智能窗帘伴侣", "智能无线充电器", "智能环境检测仪"],
  阳台: ["智能猫窝", "智能猫砂盆", "智能宠物摄像头", "智能宠物陪伴机器人", "智能花盆", "智能土壤检测仪", "智能气象站", "智能雨感器", "智能遮阳棚", "智能晾衣架杀菌模块", "智能宠物净味器", "智能窗户控制器", "智能户外灯", "智能环境检测仪"],
  浴室: ["智能浴缸", "智能淋浴系统", "智能花洒", "智能水龙头", "智能浴室柜", "智能牙刷消毒器", "智能电动牙刷", "智能吹风机", "智能美容仪", "智能衣物烘干机", "智能防滑垫", "智能皂液器", "智能空气检测仪", "智能环境检测仪"],
};

const types: DeviceType[] = ["照明", "环境", "安防", "影音", "家电", "传感"];
const roomOffsets = [0, 35, 70, 104, 138, 172];

function getType(name: string): DeviceType {
  if (/灯|照明/.test(name)) return "照明";
  if (/摄像头|门窗|燃气|烟雾|门禁|门铃/.test(name)) return "安防";
  if (/电视|音响|音乐|显示器|音箱|投影/.test(name)) return "影音";
  if (/传感|监测|体重秤|检测仪|气象站|雨感/.test(name)) return "传感";
  if (/空调|新风|净化|加湿|除湿|风扇|浴霸|排风|地暖|净味/.test(name)) return "环境";
  return "家电";
}

function getValue(name: string, type: DeviceType, index: number) {
  if (type === "环境" && /空调|浴霸|热水器/.test(name)) return `${21 + (index % 5)}°C`;
  if (type === "环境") return `${42 + (index % 25)}%`;
  if (type === "照明") return `${35 + (index % 60)}%`;
  if (type === "传感") return index % 2 === 0 ? `${22 + (index % 4)}°C` : "正常";
  if (type === "影音") return index % 2 === 0 ? "播放中" : "待机";
  return "运行正常";
}

export const initialDevices: Device[] = (Object.keys(deviceNames) as DeviceRoom[]).flatMap(
  (room, roomIndex) =>
    [...deviceNames[room], ...additionalDeviceNames[room]].map((rawName, index) => {
      const id = roomOffsets[roomIndex] + index + 1;
      const name = rawName.trim();
      const type = getType(name);
      const isOn = (id * 7) % 10 < 6;
      return {
        id,
        name,
        room,
        type: type ?? types[id % types.length],
        isOn,
        online: id % 37 !== 0,
        value: getValue(name, type, id),
        power: isOn ? 4 + ((id * 13) % 180) : 0,
      };
    }),
);

export const roomMeta = [
  { name: "客厅" as const, description: "会客与休闲", temperature: "24°", humidity: "48%" },
  { name: "主卧" as const, description: "安静好眠", temperature: "23°", humidity: "46%" },
  { name: "厨房" as const, description: "烟火日常", temperature: "25°", humidity: "51%" },
  { name: "书房" as const, description: "专注时刻", temperature: "23°", humidity: "45%" },
];
