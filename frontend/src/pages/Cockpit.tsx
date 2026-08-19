import ReactMarkdown from "react-markdown"
import { useState, useEffect, useRef } from "react"
import { Activity, CheckCircle2, Zap, BookOpen, MessageSquare, ExternalLink, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function Cockpit() {
  const [telemetry, setTelemetry] = useState<any>(null)
  
  // AI Co-Pilot State
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/telemetry")
        if (res.ok) {
          const data = await res.json()
          setTelemetry(data)
        }
      } catch (err) {
        console.error("Failed to fetch telemetry", err)
      }
    }
    
    fetchTelemetry()
    const interval = setInterval(fetchTelemetry, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleAISubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      
      setMessages(prev => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.token) {
                aiResponse += data.token;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: aiResponse };
                  return newMsgs;
                });
              }
            } catch (e) {
              console.error("Failed to parse SSE data", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "ai", content: "Error connecting to AI backend." }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Row 1: 3 small Metric Cards */}
        <Card className="col-span-1 bg-white shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{telemetry ? `${telemetry.cpu_usage_pct}%` : "..."}</div>
            <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
              <span>CPU Usage • RAM: {telemetry ? `${telemetry.ram_usage_pct}%` : "..."}</span>
              <span>Total RAM: {telemetry ? `${telemetry.ram_used_gb}GB / ${telemetry.ram_total_gb}GB` : "..."}</span>
              <span>Swap: {telemetry ? `${telemetry.swap_used_gb}GB / ${telemetry.swap_total_gb}GB (${telemetry.swap_usage_pct}%)` : "..."}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Thermals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{telemetry ? `${telemetry.cpu_temp}°C` : "..."}</div>
            <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
              <span>CPU • GPU: {telemetry ? `${telemetry.gpu_temp}°C` : "..."}</span>
              <span>Fan Speed: {telemetry ? `${telemetry.fan_rpm} RPM (${telemetry.fan_mode})` : "..."}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white shadow-sm border-slate-200 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{telemetry ? `${telemetry.battery_pct}%` : "..."}</div>
            <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
              <span>{telemetry ? (telemetry.is_charging ? "Charging" : "Discharging") : "..."} • {telemetry ? `${telemetry.power_draw_watts}W` : "..."}</span>
              <span>System Time: {telemetry ? telemetry.system_time : "..."}</span>
            </div>
          </CardContent>
        </Card>

        {/* System Services & Diagnostics */}
        <Card className="col-span-1 md:col-span-3 bg-white shadow-sm border-slate-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> System Services & Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">AGY Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                <Switch onCheckedChange={() => {
                  fetch('http://localhost:8000/api/system/toggle-agy', { method: 'POST' })
                }} />
                <Button size="sm" variant="outline" onClick={() => window.open('http://localhost:8501', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Open
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">Laptop Status Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                <Switch />
                <Button size="sm" variant="outline" onClick={() => window.open('http://localhost:8000/api/system/laptop-dashboard', '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Open
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Row 3: Knowledge Card (Span 2), AI Co-Pilot (Span 1) */}
        <Card className="col-span-1 md:col-span-2 bg-white shadow-sm border-slate-200 rounded-xl min-h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
            <p className="text-sm text-slate-500">Document viewer will be mounted here.</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white shadow-sm border-slate-200 rounded-xl min-h-[350px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-500" /> AI Co-Pilot
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col border-t border-slate-100 p-4">
            
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 max-h-[220px] pr-2"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500 text-center">
                  AI is ready. What do you need?
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500 text-white rounded-br-none' 
                        : 'bg-slate-100 text-slate-700 rounded-bl-none'
                    }`}>
                      {msg.role === "user" ? <div className="whitespace-pre-wrap">{msg.content}</div> : <div className="prose prose-sm max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="text-xs text-slate-400 italic mt-1">AI is thinking...</div>
              )}
            </div>

            <form onSubmit={handleAISubmit} className="flex gap-2">
              <Input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Command the AI..." 
                className="bg-slate-50 border-slate-200" 
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!prompt.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </form>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
