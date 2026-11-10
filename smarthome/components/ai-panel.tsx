"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, ChevronRight, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const initialMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: "欢迎回家，Jared。家中设备运行平稳，空气质量很好。需要我帮你做点什么？",
};

const suggestions = ["关闭所有灯光", "家里现在怎么样？", "开启晚安模式", "今日能耗分析"];

export function AiPanel({
  onCommand,
  mobile = false,
  onClose,
}: {
  onCommand: (command: string) => string;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  function sendCommand(command: string) {
    const content = command.trim();
    if (!content || isThinking) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content }]);
    setInput("");
    setIsThinking(true);
    window.setTimeout(() => {
      const response = onCommand(content);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: response }]);
      setIsThinking(false);
    }, 650);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendCommand(input);
  }

  return (
    <section className={cn("flex min-h-0 flex-col overflow-hidden border border-[#dde1e7] bg-white", mobile ? "h-[82dvh] rounded-t-[26px]" : "h-[calc(100dvh-128px)] max-h-[900px] min-h-[560px] rounded-[24px] shadow-[0_8px_40px_rgba(20,25,32,0.04)]")} aria-label="AI 家庭助手">
      <header className="flex items-center justify-between border-b border-[#e8ebf3] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-[14px] bg-[#20242b] text-[#dceaff]">
            <Sparkles size={20} />
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-[3px] border-white bg-[#a0a3a7]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">窝头 <span className="ml-1 font-normal text-[#8e9094]">AI 家庭助手</span></h2>
            <p className="mt-0.5 text-[10px] text-[#93969a]">已连接全屋 206 台设备</p>
          </div>
        </div>
        {mobile ? (
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="关闭 AI 对话"><X size={18} /></Button>
        ) : (
          <Button variant="ghost" size="icon-sm" aria-label="新建对话" onClick={() => setMessages([initialMessage])}><Plus size={18} /></Button>
        )}
      </header>

      <div ref={scrollRef} className="ai-scroll flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.12em] text-[#a1a4a8]">
          <span className="h-px flex-1 bg-[#e8ebf3]" /> 今天 <span className="h-px flex-1 bg-[#e8ebf3]" />
        </div>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-2.5", message.role === "user" && "justify-end")}>
            {message.role === "assistant" && (
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eaedf5] text-[#5a5c5e]"><Bot size={15} /></div>
            )}
            <div className={cn(
              "max-w-[84%] rounded-2xl px-3.5 py-3 text-[12px] leading-[1.75]",
              message.role === "assistant" ? "rounded-tl-md bg-[#edf0f8] text-[#545658]" : "rounded-tr-md bg-[#171a20] text-white",
            )}>
              {message.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#eaedf5] text-[#5a5c5e]"><Bot size={15} /></div>
            <div className="flex gap-1 rounded-2xl rounded-tl-md bg-[#edf0f8] px-4 py-3.5">
              {[0, 1, 2].map((dot) => <span key={dot} className="typing-dot size-1.5 rounded-full bg-[#929498]" style={{ animationDelay: `${dot * 150}ms` }} />)}
            </div>
          </div>
        )}
        {messages.length === 1 && !isThinking && (
          <div className="pt-2">
            <p className="mb-2.5 text-[10px] font-medium text-[#9b9ea2]">你可以这样问</p>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => sendCommand(suggestion)} className="flex w-full items-center justify-between rounded-xl border border-[#e4e7ef] px-3.5 py-2.5 text-left text-[11px] text-[#606264] transition-colors hover:border-[#c4c7cd] hover:bg-[#f2f5fd]">
                  {suggestion}<ChevronRight size={13} className="text-[#9fa2a6]" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-2">
        <div className="mb-3 flex items-center gap-1.5 text-[10px] text-[#989b9f]">
          <Sparkles size={11} className="text-[#838589]" /> 由 AI 提供全屋智能建议
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dce0e6] bg-[#f3f7ff] p-2 transition-colors focus-within:border-[#a8aab0] focus-within:bg-white">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="告诉我，你想做什么..."
            className="h-8 w-full bg-transparent px-2 text-xs outline-none placeholder:text-[#a5a7ad]"
            aria-label="向 AI 家庭助手发送消息"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="px-2 text-[9px] text-[#a2a4aa]">Enter 发送</span>
            <Button type="submit" size="icon-sm" className="rounded-[10px]" disabled={!input.trim() || isThinking} aria-label="发送消息"><ArrowUp size={16} /></Button>
          </div>
        </form>
      </div>
    </section>
  );
}
