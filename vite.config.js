import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadDotEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/)
      if (m) process.env[m[1]] = m[2].trim()
    }
  } catch {}
}
loadDotEnv()

const SYSTEM_PROMPT = `You are a helpful assistant for The Chair, a premium barbershop with locations in Montreal and Toronto.

LOCATIONS:
- Toronto: 247 King Street West, Toronto, ON — (416) 555-0123
- Montreal: 519 Rue Rachel Est, Montreal, QC — (514) 555-0456

HOURS:
- Monday – Saturday: 9:00 AM – 8:00 PM
- Sunday: By appointment only

SERVICES & PRICING:
- Classic Haircut: $45 — precision scissor or clipper cut, finished with hot towel
- Fade & Taper: $50 — skin fade to any length, crisp lines
- Beard Trim & Shape: $30 — outline, sculpt, and hot towel finish
- Hot Towel Shave: $55 — traditional straight-razor shave with pre-shave oil
- Hair + Beard Combo: $70 — haircut and beard service together
- Kids Cut (under 12): $30

BARBERS:
- Marcus — Specialty: precision fades, skin fades, high tops. 10+ years experience. Known for perfectly blended fades.
- Jordan — Specialty: classic cuts, pompadours, textured styles, beards. Old-school barbering with a modern twist.
- Dex — Specialty: curly hair, waves, twist-outs, natural hair. Best in the city for textured and Afro hair.
- Sofia (Montreal only) — Specialty: scissor cuts, bobs, undercuts, color consultations. Trained in Paris.
- Andre (Toronto only) — Specialty: hot towel shaves, beard sculpting, skin care. A true straight-razor artist.

PARKING:
Toronto: Street parking on King St W after 6 PM. Green P lots on Spadina Ave (2-min walk). TTC King streetcar stops right outside.
Montreal: Street parking on Rue Rachel (metered, 2-hr max). Côte-des-Neiges métro is a 5-min walk. Bike racks outside the shop.

BOOKING:
Walk-ins welcome when chairs are available. Online booking recommended for weekends. Book via the website at /book or call the location directly.

POLICIES:
- Arrive 5 minutes early for your appointment
- 24-hour cancellation notice requested
- Gift cards available at both locations
- No service charge — tip your barber directly

Write like a friendly human, not a bot. Use plain conversational sentences only. Never use bullet points, dashes as list items, bold text, headers, asterisks, pound signs, or any markdown formatting whatsoever. Just talk naturally like a knowledgeable person at the front desk would. Keep answers short and direct. If you do not know something specific, tell them to call the shop.`

export default defineConfig({
  build: {
    cssMinify: false,
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  plugins: [
    react(),
    {
      name: 'chat-api',
      configureServer(server) {
        server.middlewares.use('/api/chat', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }

          // Read request body
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const { messages } = JSON.parse(body)
              const apiKey = process.env.ANTHROPIC_API_KEY

              if (!apiKey) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env' }))
                return
              }

              const client = new Anthropic({ apiKey })

              // Stream the response
              res.setHeader('Content-Type', 'text/event-stream')
              res.setHeader('Cache-Control', 'no-cache')
              res.setHeader('Connection', 'keep-alive')

              const stream = await client.messages.stream({
                model: 'claude-haiku-4-5',
                max_tokens: 512,
                system: SYSTEM_PROMPT,
                messages,
              })

              for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                  res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
                }
              }
              res.write('data: [DONE]\n\n')
              res.end()
            } catch (err) {
              console.error('[chat-api]', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        })
      },
    },
  ],
})
