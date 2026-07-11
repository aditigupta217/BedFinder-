import { useState, useRef, useEffect } from "react";
import { useHospitals } from "@/lib/hospitals";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

const robotStyles = `
@keyframes robot-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes robot-wave {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-15deg); }
}
.animate-robot-bounce {
  animation: robot-bounce 3s ease-in-out infinite;
}
.animate-robot-wave {
  animation: robot-wave 1.2s ease-in-out infinite;
}
`;

function RobotMascot({ size = 48, animate = true, className = "" }: { size?: number; animate?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? "animate-robot-bounce" : ""}`}
      style={{
        filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15))",
      }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="16" y1="20" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="18" y1="24" x2="46" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#1C2541" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <path
        d="M32 20V10"
        stroke="#94A3B8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="8"
        r="4"
        fill="#E8341C"
        className={animate ? "animate-pulse" : ""}
      />
      {/* Floating alert ring */}
      <circle
        cx="32"
        cy="8"
        r="7"
        stroke="#E8341C"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        className={animate ? "animate-ping" : ""}
        style={{ animationDuration: "1.5s" }}
      />

      {/* Ears */}
      <rect x="10" y="24" width="4" height="10" rx="2" fill="#64748B" />
      <rect x="50" y="24" width="4" height="10" rx="2" fill="#64748B" />

      {/* Head */}
      <rect
        x="12"
        y="16"
        width="40"
        height="32"
        rx="10"
        fill="url(#bodyGrad)"
        stroke="#CBD5E1"
        strokeWidth="2.5"
      />

      {/* Screen Face */}
      <rect
        x="17"
        y="21"
        width="30"
        height="22"
        rx="6"
        fill="url(#screenGrad)"
      />

      {/* Glowing Eyes */}
      <g>
        {/* Left eye */}
        <circle cx="26" cy="29" r="3" fill="#38BDF8" />
        <circle cx="26" cy="29" r="1.2" fill="#FFFFFF" />
        {/* Right eye */}
        <circle cx="38" cy="29" r="3" fill="#38BDF8" />
        <circle cx="38" cy="29" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Smile/Mouth */}
      <path
        d="M27 37 Q32 40 37 37"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Cheeks */}
      <circle cx="21" cy="34" r="1.5" fill="#F43F5E" fillOpacity="0.6" />
      <circle cx="43" cy="34" r="1.5" fill="#F43F5E" fillOpacity="0.6" />

      {/* Body indicator / Collar */}
      <path
        d="M24 48 L26 53 H38 L40 48"
        fill="#94A3B8"
      />

      {/* Tiny hands / arms waving */}
      <path
        d="M10 32 Q4 26 8 20"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={animate ? "animate-robot-wave" : ""}
        style={{ transformOrigin: "10px 32px" }}
      />
    </svg>
  );
}

export function GeminiChat() {
  const { t } = useLanguage();
  const hospitals = useHospitals();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: t(
        "Hello 🙏 I'm here to help you find the right hospital fast. Please describe the medical emergency and I'll recommend the best available option nearby.",
      ),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) {
        throw new Error("Missing Gemini API Key");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an emergency medical triage assistant for BedFinder India. Here is current hospital data: ${JSON.stringify(hospitals)}. When someone describes their emergency: 1) Identify bed type needed 2) Recommend best 1-2 hospitals with available beds 3) Give hospital name, bed count, distance, contact number 4) Keep response under 100 words, calm and clear 5) Always end with "Call [number] now" 6) Never make up hospital names. User message: ${text}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Gemini API call failed");
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error("Empty candidate reply");
      }

      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "ai", text: reply }]);
    } catch (error) {
      console.error("Gemini Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: t("AI assistant unavailable. Please call 108 or browse hospitals above."),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 select-none font-sans">
      <style dangerouslySetInnerHTML={{ __html: robotStyles }} />

      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="relative flex flex-col items-end gap-2 group">
          {/* Tooltip / Speech bubble */}
          <div className="bg-[#0A1628] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 select-none animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t("Need help? Ask AI Chatbot!")}</span>
            <div className="absolute right-6 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0A1628]"></div>
          </div>

          <div className="flex items-center gap-3">
            {/* Robot Mascot sitting next to the button */}
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsOpen(true)}>
              <RobotMascot size={52} animate={true} />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-[#E8341C] hover:bg-[#c92614] text-white flex items-center justify-center text-3xl shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-[#E8341C]/25 relative"
              aria-label="Open AI Triage Assistant"
            >
              💬
            </button>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="relative w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[75vh] fade-up">
          {/* Peeking Robot Mascot on top of the chat panel */}
          <div className="absolute -top-9 left-4 z-50 cursor-pointer" onClick={() => setIsOpen(false)}>
            <RobotMascot size={46} animate={true} />
          </div>

          {/* Actual Chat panel */}
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-[#E8ECF2] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A1628] text-white px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 pl-12">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                </span>
                <span className="font-display font-semibold text-sm tracking-tight">
                  {t("AI Triage Assistant")}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Amber Disclaimer */}
            <div className="bg-[#D97706]/10 text-[#92400e] border-b border-[#D97706]/20 px-4 py-2 text-[11px] leading-snug">
              {t("For life-threatening emergencies call 108 first")}
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex-shrink-0 mt-1">
                      <RobotMascot size={28} animate={false} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#0A1628] text-white rounded-tr-none"
                        : "bg-[#F4F6F9] text-[#0A1628] border border-[#E8ECF2] rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 max-w-[85%] self-start">
                  <div className="flex-shrink-0 mt-1">
                    <RobotMascot size={28} animate={true} />
                  </div>
                  <div className="flex gap-1 items-center px-4 py-3 bg-[#F4F6F9] border border-[#E8ECF2] rounded-2xl rounded-tl-none max-w-[80px]">
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[#E8ECF2] flex gap-2 bg-white">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder={t("Describe the emergency…")}
                className="flex-1 px-3 py-2 bg-[#F4F6F9] border border-[#E8ECF2] rounded-xl text-sm outline-none focus:border-[#E8341C] text-[#0A1628]"
              />
              <button
                onClick={handleSend}
                className="bg-[#E8341C] hover:bg-[#c92614] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer shrink-0"
              >
                {t("Search Beds")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
