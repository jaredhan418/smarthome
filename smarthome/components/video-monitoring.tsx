"use client";

import { useRef, useState } from "react";
import { Camera, CheckCircle2, Maximize2, Play, Radio, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const cameras = [
  {
    id: "living-room",
    name: "猫窝长焦摄像头",
    location: "猫窝 · 长焦细节",
    source: "/videos/living-room.mp4",
    channel: "CAT CAM 01 · TELE",
  },
  {
    id: "entrance",
    name: "猫窝广角摄像头",
    location: "猫窝 · 广角视野",
    source: "/videos/entrance.mp4",
    channel: "CAT CAM 02 · WIDE",
  },
];

export function VideoMonitoring() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  async function playVideo(id: string) {
    const video = videoRefs.current[id];
    if (!video) return;
    Object.entries(videoRefs.current).forEach(([cameraId, element]) => {
      if (cameraId !== id) element?.pause();
    });
    if (video.ended) video.currentTime = 0;
    setErrors((current) => ({ ...current, [id]: false }));
    try {
      await video.play();
    } catch {
      setPlayingId(null);
      setErrors((current) => ({ ...current, [id]: true }));
    }
  }

  function enterFullscreen(id: string) {
    const video = videoRefs.current[id];
    if (!video) return;
    if (video.requestFullscreen) {
      void video.requestFullscreen();
    }
  }

  return (
    <section id="monitoring" className="mt-10 scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-[-0.02em]">视频监控</h2>
            <Badge className="bg-[#e8ebf3] text-[#6a6b6f]"><span className="size-1.5 rounded-full bg-[#8f9195]" />2 路在线</Badge>
          </div>
          <p className="mt-1 text-[10px] text-[#94979b]">随时看一眼，安心多一点</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-[#8b8d91]"><Radio size={12} />监控回放</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cameras.map((camera) => {
          const isPlaying = playingId === camera.id;
          const hasError = errors[camera.id];
          return (
            <Card key={camera.id} className="group overflow-hidden rounded-[20px] bg-[#1f2020] p-0 text-white">
              <div className="relative aspect-video overflow-hidden bg-[#171818]">
                <video
                  ref={(element) => { videoRefs.current[camera.id] = element; }}
                  src={camera.source}
                  className="size-full object-cover"
                  preload="metadata"
                  playsInline
                  controls={isPlaying}
                  onPlay={() => setPlayingId(camera.id)}
                  onPause={() => setPlayingId((current) => current === camera.id ? null : current)}
                  onEnded={() => setPlayingId((current) => current === camera.id ? null : current)}
                  onError={() => setErrors((current) => ({ ...current, [camera.id]: true }))}
                  aria-label={`${camera.name}监控录像`}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/55 to-transparent p-4 pb-10">
                  <span className="rounded-md border border-white/15 bg-black/25 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-white/85 backdrop-blur-sm">{camera.channel}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[9px] text-white/90 backdrop-blur-sm"><span className="size-1.5 rounded-full bg-[#c8cbd1]" />设备在线</span>
                </div>
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={() => playVideo(camera.id)}
                    className="absolute inset-0 flex w-full flex-col items-center justify-center bg-black/10 text-white transition-colors hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d8e9ff]"
                    aria-label={`播放${camera.name}`}
                  >
                    <span className="flex size-14 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform group-hover:scale-105">
                      <Play size={22} fill="currentColor" className="ml-1" />
                    </span>
                    <span className="mt-3 text-[11px] font-medium text-white/90">{hasError ? "加载失败，点击重试" : "点击播放监控"}</span>
                  </button>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/65 to-transparent p-4 pt-12">
                  <div><p className="text-sm font-semibold">{camera.name}</p><p className="mt-1 text-[10px] text-white/65">{camera.location}</p></div>
                  {!isPlaying && <Video size={17} className="mb-1 text-white/65" />}
                </div>
              </div>
              <div className="flex items-center justify-between bg-white px-4 py-3 text-[#7e8084]">
                <span className="flex items-center gap-1.5 text-[10px]"><CheckCircle2 size={12} className="text-[#8b8d91]" />画面清晰 · 1080P</span>
                <button type="button" onClick={() => enterFullscreen(camera.id)} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] transition-colors hover:bg-[#ebeef6] hover:text-[#494a4c]" aria-label={`全屏查看${camera.name}`}><Maximize2 size={12} />全屏查看</button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-[#95989c]"><Camera size={12} />录像仅保存在本地，点击任意一路即可播放</div>
    </section>
  );
}
