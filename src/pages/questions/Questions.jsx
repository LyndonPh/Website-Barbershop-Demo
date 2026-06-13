import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '../../components/Navbar'

const SUGGESTED = [
  "Which barber is best for fades?",
  "Where can I park in Toronto?",
  "How much does a haircut cost?",
  "Do you do hot towel shaves?",
  "What are your hours?",
  "Which barber is best for curly hair?",
  "Do you take walk-ins?",
  "Do you offer kids cuts?",
]

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM',
]

const WELCOME = {
  role: 'assistant',
  content: "Hey, welcome to The Chair. Feel free to ask me anything — services, pricing, which barber to see, parking, you name it. Or if you're ready, I can help you book an appointment right here.",
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ onSelect, selected }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const firstDay = viewDate.getDay()
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  function selectDay(day) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (date < today || date.getDay() === 0) return
    onSelect(date)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-[#6B6560] hover:text-[#F0EDE6] transition-colors text-lg leading-none px-1">‹</button>
        <span className="text-[#F0EDE6] text-sm font-medium tracking-wide">{monthName}</span>
        <button onClick={nextMonth} className="text-[#6B6560] hover:text-[#F0EDE6] transition-colors text-lg leading-none px-1">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-[#4A4642] tracking-wide py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
          const isPast = date < today
          const isSunday = date.getDay() === 0
          const disabled = isPast || isSunday
          const isSelected = selected &&
            selected.getFullYear() === date.getFullYear() &&
            selected.getMonth() === date.getMonth() &&
            selected.getDate() === day
          return (
            <button
              key={i}
              onClick={() => selectDay(day)}
              disabled={disabled}
              className={`h-8 w-full text-xs transition-all duration-150 ${
                isSelected
                  ? 'bg-[#C8A96E] text-[#0C0C0C] font-semibold'
                  : disabled
                  ? 'text-[#2A2A2A] cursor-not-allowed'
                  : 'text-[#C8C4BC] hover:bg-[#1E1E1E] hover:text-[#F0EDE6]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Booking Card (renders inline in chat) ─────────────────────────────────────
function BookingCard({ onComplete }) {
  const [step, setStep] = useState('calendar') // 'calendar' | 'time'
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)

  function handleDateSelect(d) {
    setDate(d)
    setStep('time')
  }

  function handleTimeSelect(t) {
    setTime(t)
  }

  function confirm() {
    onComplete(date, time)
  }

  const formattedDate = date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] p-5"
    >
      {step === 'calendar' && (
        <>
          <p className="text-[#F0EDE6] text-sm mb-4">Pick a date for your appointment.</p>
          <MiniCalendar onSelect={handleDateSelect} selected={date} />
          <p className="text-[#3A3632] text-xs mt-4">We're open Monday through Saturday. Sundays are by appointment only — call us directly.</p>
        </>
      )}

      {step === 'time' && (
        <AnimatePresence mode="wait">
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => { setStep('calendar'); setTime(null) }} className="text-[#4A4642] hover:text-[#C8A96E] transition-colors text-xs">← Back</button>
              <span className="text-[#F0EDE6] text-sm">{formattedDate}</span>
            </div>
            <p className="text-[#6B6560] text-xs mb-3">Choose a time that works for you.</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`py-2 text-xs transition-all duration-150 ${
                    time === slot
                      ? 'bg-[#C8A96E] text-[#0C0C0C] font-semibold'
                      : 'border border-[#2A2A2A] text-[#C8C4BC] hover:border-[#C8A96E] hover:text-[#F0EDE6]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              onClick={confirm}
              disabled={!time}
              className="w-full py-3 bg-[#C8A96E] text-[#0C0C0C] text-xs font-semibold tracking-widest uppercase hover:bg-[#D4B87A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Confirm Appointment
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Questions() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, bookingOpen])

  function openBooking() {
    if (bookingOpen) return
    setBookingOpen(true)
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: "Sure thing, let's get you booked. Pick a date below and then choose your time." },
      { role: 'booking' },
    ])
  }

  function handleBookingComplete(date, time) {
    const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    sessionStorage.setItem('booking', JSON.stringify({ date: formatted, time, rawDate: date.toISOString() }))
    navigate('/booking-confirmed')
  }

  async function send(text) {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return
    setInput('')

    // Detect booking intent client-side
    const bookingKeywords = ['book', 'appointment', 'schedule', 'reserve', 'slot']
    const wantsToBook = bookingKeywords.some(k => trimmed.toLowerCase().includes(k))

    const userMsg = { role: 'user', content: trimmed }
    const history = [...messages.filter(m => m.role !== 'booking'), userMsg]
    const display = [...messages, userMsg]
    setMessages(display)
    setLoading(true)
    setMessages([...display, { role: 'assistant', content: '' }])

    try {
      const apiMessages = history.slice(1).map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: `Something went wrong. ${err.error}` }
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

      if (wantsToBook && !bookingOpen) {
        setTimeout(openBooking, 400)
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: 'Having trouble connecting right now. Try again in a moment.' }
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

  const usedSuggestions = new Set(messages.filter(m => m.role === 'user').map(m => m.content))
  const remaining = SUGGESTED.filter(s => !usedSuggestions.has(s))

  return (
    <div className="bg-[#0C0C0C]" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ marginTop: 64 }}>

        {/* ── Left sidebar ── */}
        <aside className="hidden lg:flex flex-col w-[300px] shrink-0 border-r border-[#1E1E1E]">
          <div className="px-8 pt-10 pb-8 border-b border-[#1E1E1E]">
            <p className="eyebrow mb-4">Ask anything</p>
            <h1 className="font-playfair text-3xl font-bold text-[#F0EDE6] leading-tight">
              We're here<br />to help
            </h1>
            <p className="text-[#3A3632] text-sm mt-3 leading-relaxed">
              Ask about our barbers, services, prices, parking — anything at all.
            </p>
          </div>

          {/* Book CTA */}
          <div className="px-8 py-6 border-b border-[#1E1E1E]">
            <button
              onClick={openBooking}
              disabled={bookingOpen}
              className="w-full py-3 border border-[#C8A96E] text-[#C8A96E] text-xs tracking-widest uppercase hover:bg-[#C8A96E] hover:text-[#0C0C0C] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Book an appointment
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <p className="text-[#2A2A2A] text-[10px] tracking-[0.2em] uppercase mb-4">Try asking</p>
            <div className="flex flex-col">
              {remaining.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left text-[#4A4642] text-sm py-2.5 hover:text-[#F0EDE6] transition-colors duration-150 leading-snug border-b border-[#1A1A1A] last:border-0"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right: chat panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-[#1E1E1E] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={openBooking}
              disabled={bookingOpen}
              className="shrink-0 px-4 py-2 border border-[#C8A96E] text-[#C8A96E] text-xs tracking-wider whitespace-nowrap hover:bg-[#C8A96E] hover:text-[#0C0C0C] transition-all duration-150 disabled:opacity-40"
            >
              Book now
            </button>
            {remaining.slice(0, 4).map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 px-3 py-2 border border-[#1E1E1E] text-[#4A4642] text-xs whitespace-nowrap hover:border-[#2A2A2A] hover:text-[#C8C4BC] transition-all duration-150"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 flex flex-col gap-6">
            {messages.map((msg, i) => {
              if (msg.role === 'booking') {
                return (
                  <div key={i} className="flex justify-start">
                    <BookingCard onComplete={handleBookingComplete} />
                  </div>
                )
              }
              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[72%] text-[14px] leading-[1.75] ${
                      msg.role === 'user'
                        ? 'bg-[#C8A96E] text-[#0C0C0C] font-medium px-4 py-2.5'
                        : 'text-[#9A9690]'
                    }`}
                  >
                    {msg.content || (loading && i === messages.length - 1
                      ? <span className="inline-flex gap-1.5 items-center h-5">
                          <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '140ms' }} />
                          <span className="w-1 h-1 bg-[#C8A96E] rounded-full animate-bounce" style={{ animationDelay: '280ms' }} />
                        </span>
                      : null
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 md:px-12 py-5 bg-[#0C0C0C]">
            <div className="flex items-center gap-3 max-w-2xl bg-[#141414] px-4 py-3">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything…"
                disabled={loading}
                autoFocus
                className="flex-1 bg-transparent text-[#F0EDE6] text-sm outline-none placeholder-[#2A2A2A] disabled:opacity-40"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="shrink-0 text-[#C8A96E] hover:text-[#F0EDE6] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 2l2.5 6L2 14l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
