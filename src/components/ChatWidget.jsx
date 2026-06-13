import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const WELCOME = {
  role: 'assistant',
  content: "Welcome to The Chair. I can help with questions about our services, barbers, locations, parking, and booking. What can I help you with?",
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8L2 2l2.5 6L2 14l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h16v12H3V3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 18l2.5-3h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    // Placeholder assistant message for streaming
    const assistantMsg = { role: 'assistant', content: '' }
    setMessages([...history, assistantMsg])

    try {
      const apiMessages = history
        .filter(m => m.role !== 'assistant' || m !== WELCOME)
        .map(m => ({ role: m.role, content: m.content }))
        // filter out the welcome message (index 0) which is synthetic
        .filter((_, i) => !(i === 0 && history[0] === WELCOME))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: `Sorry, something went wrong: ${err.error}` }
          return copy
        })
        setLoading(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text } = JSON.parse(data)
            full += text
            setMessages(prev => {
              const copy = [...prev]
              copy[copy.length - 1] = { role: 'assistant', content: full }
              return copy
            })
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: 'Connection error. Please try again.' }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // Build the messages to actually display (filter welcome separately)
  const displayMessages = messages.map((m, i) => ({ ...m, _key: i }))

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] sm:w-[380px] flex flex-col rounded-none border border-[#2A2A2A] bg-[#141414] shadow-2xl overflow-hidden"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A] bg-[#0C0C0C]">
              <div>
                <p className="font-playfair text-[#F0EDE6] text-sm font-semibold tracking-wide">The Chair</p>
                <p className="text-[#C8A96E] text-[10px] tracking-[0.18em] uppercase mt-0.5">AI Concierge</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6B6560] hover:text-[#F0EDE6] transition-colors p-1"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin">
              {displayMessages.map((msg) => (
                <div
                  key={msg._key}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] text-[13px] leading-relaxed px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-[#C8A96E] text-[#0C0C0C] font-medium'
                        : 'bg-[#1E1E1E] text-[#F0EDE6] border border-[#2A2A2A]'
                    }`}
                  >
                    {msg.content || (loading && msg.role === 'assistant' ? (
                      <span className="inline-flex gap-1 items-center">
                        <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    ) : '')}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#2A2A2A] bg-[#0C0C0C] px-4 py-3 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything…"
                disabled={loading}
                className="flex-1 bg-transparent text-[#F0EDE6] text-[13px] placeholder-[#4A4642] outline-none disabled:opacity-40"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="text-[#C8A96E] hover:text-[#F0EDE6] transition-colors disabled:opacity-30 disabled:cursor-not-allowed p-1"
              >
                <SendIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.93 }}
        className="w-13 h-13 flex items-center justify-center bg-[#C8A96E] text-[#0C0C0C] shadow-lg hover:bg-[#D4B87A] transition-colors"
        style={{ width: 52, height: 52 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
