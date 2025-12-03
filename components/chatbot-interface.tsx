"use client"

import { useState } from "react"
import { Send, Copy, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

type ChatMode = "translate" | "summarize"

export function ChatbotInterface() {
  const [mode, setMode] = useState<ChatMode>("translate")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "👋 Hello! I'm your campus AI assistant powered by intelligent algorithms. I can help you translate text into multiple languages or summarize documents. What would you like me to do today?",
      timestamp: new Date(),
    },
  ])
  const [copied, setCopied] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      let botResponse = ""
      if (mode === "translate") {
        botResponse = `🌐 Translation: "${input}" - Ready to be translated! In production, this connects to your translation microservice for real-time language conversion.`
      } else {
        botResponse = `📊 Summary: Your document (${input.split(" ").length} words) has been analyzed. Key points extracted and condensed for quick reading. Connects to your summarization service.`
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 600)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Chatbot Assistant
            </h2>
            <p className="text-slate-600">Translate and summarize with intelligent AI</p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mb-6 flex gap-3">
        {[
          { id: "translate" as const, label: "🌐 Translate", desc: "Translate text to different languages" },
          { id: "summarize" as const, label: "📄 Summarize", desc: "Summarize documents and texts" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 px-4 py-3 rounded-lg border transition-all text-left ${
              mode === m.id
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                : "bg-white border-slate-300 hover:border-blue-300 text-slate-900"
            }`}
          >
            <div className="font-bold text-sm">{m.label}</div>
            <div className="text-xs opacity-75">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <Card className="mb-6 flex flex-col h-[550px] bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200 shadow-xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md px-4 py-3 rounded-xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-br-none shadow-lg shadow-blue-500/20"
                    : "bg-gradient-to-r from-blue-100 to-blue-50 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className="text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</span>
                  {message.type === "bot" && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {copied === message.id ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-300 p-4 bg-slate-50 rounded-b-lg">
          <div className="flex gap-2">
            <Textarea
              placeholder={mode === "translate" ? "Enter text to translate..." : "Enter text to summarize..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSendMessage()
                }
              }}
              className="min-h-[60px] max-h-[120px] resize-none bg-white border-slate-300"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="h-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-600 mt-2">💡 Press Ctrl+Enter to send</p>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="font-bold mb-2 text-blue-900">🌐 Translation Features</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>✓ Support for 50+ languages</li>
            <li>✓ Context-aware translation</li>
            <li>✓ Preserve document formatting</li>
            <li>✓ Instant copy functionality</li>
          </ul>
        </Card>
        <Card className="p-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="font-bold mb-2 text-blue-900">📄 Summarization Features</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>✓ Extract key points automatically</li>
            <li>✓ Adjustable summary length</li>
            <li>✓ Maintain important details</li>
            <li>✓ Download summaries</li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
