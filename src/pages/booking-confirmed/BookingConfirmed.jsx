import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '../../components/Navbar'

function buildGoogleCalendarUrl(rawDate, time) {
  try {
    const date = new Date(rawDate)
    const [timePart, period] = time.split(' ')
    let [hours, minutes] = timePart.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    date.setHours(hours, minutes, 0, 0)

    const end = new Date(date)
    end.setHours(end.getHours() + 1)

    function fmt(d) {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0]
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'The Chair — Barbershop Appointment',
      dates: `${fmt(date)}/${fmt(end)}`,
      details: 'Your appointment at The Chair Barbershop. Please arrive 5 minutes early.',
      location: '247 King Street West, Toronto, ON',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  } catch {
    return null
  }
}

export default function BookingConfirmed() {
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('booking')
    if (stored) {
      setBooking(JSON.parse(stored))
      sessionStorage.removeItem('booking')
    }
  }, [])

  const calUrl = booking ? buildGoogleCalendarUrl(booking.rawDate, booking.time) : null

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Gold checkmark */}
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 border border-[#C8A96E] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l6 6L20 6" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="eyebrow mb-3">You're all set</p>
            <h1 className="font-playfair text-4xl font-bold text-[#F0EDE6] leading-tight mb-4">
              Appointment<br />Confirmed
            </h1>
            <p className="text-[#4A4642] text-sm leading-relaxed">
              We'll see you soon. Show up a few minutes early and we'll take great care of you.
            </p>
          </div>

          {booking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-[#141414] border border-[#2A2A2A] px-6 py-5 mb-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className="text-[#3A3632] text-xs tracking-widest uppercase">Date</span>
                  <span className="text-[#F0EDE6] text-sm text-right">{booking.date}</span>
                </div>
                <div className="w-full h-px bg-[#1E1E1E]" />
                <div className="flex justify-between items-center">
                  <span className="text-[#3A3632] text-xs tracking-widest uppercase">Time</span>
                  <span className="text-[#F0EDE6] text-sm">{booking.time}</span>
                </div>
                <div className="w-full h-px bg-[#1E1E1E]" />
                <div className="flex justify-between items-start">
                  <span className="text-[#3A3632] text-xs tracking-widest uppercase">Location</span>
                  <span className="text-[#F0EDE6] text-sm text-right">247 King St W<br />Toronto, ON</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-3">
            {calUrl && (
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#C8A96E] text-[#0C0C0C] text-xs font-semibold tracking-widest uppercase hover:bg-[#D4B87A] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="11" rx="0" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M1 5h12" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                </svg>
                Add to Google Calendar
              </a>
            )}
            <Link
              to="/"
              className="w-full flex items-center justify-center py-3.5 border border-[#2A2A2A] text-[#6B6560] text-xs tracking-widest uppercase hover:border-[#4A4642] hover:text-[#F0EDE6] transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
