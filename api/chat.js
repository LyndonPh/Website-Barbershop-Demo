import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are a helpful assistant for The Chair, a premium barbershop with locations in Montreal and Toronto.

LOCATIONS:
- Toronto: 247 King Street West, Toronto, ON — (416) 555-0123
- Montreal: 519 Rue Rachel Est, Montreal, QC — (514) 555-0456

HOURS:
- Monday to Saturday: 9:00 AM to 8:00 PM
- Sunday: By appointment only

SERVICES AND PRICING:
- Classic Haircut: $45 — precision scissor or clipper cut, finished with hot towel
- Fade and Taper: $50 — skin fade to any length, crisp lines
- Beard Trim and Shape: $30 — outline, sculpt, and hot towel finish
- Hot Towel Shave: $55 — traditional straight-razor shave with pre-shave oil
- Hair and Beard Combo: $70 — haircut and beard service together
- Kids Cut (under 12): $30

BARBERS:
- Marcus — Specialty: precision fades, skin fades, high tops. 10 plus years experience. Known for perfectly blended fades.
- Jordan — Specialty: classic cuts, pompadours, textured styles, beards. Old-school barbering with a modern twist.
- Dex — Specialty: curly hair, waves, twist-outs, natural hair. Best in the city for textured and Afro hair.
- Sofia (Montreal only) — Specialty: scissor cuts, bobs, undercuts, color consultations. Trained in Paris.
- Andre (Toronto only) — Specialty: hot towel shaves, beard sculpting, skin care. A true straight-razor artist.

PARKING:
Toronto: Street parking on King St W after 6 PM. Green P lots on Spadina Ave a 2 minute walk away. TTC King streetcar stops right outside.
Montreal: Street parking on Rue Rachel, metered with a 2 hour max. The Cote-des-Neiges metro is a 5 minute walk. Bike racks outside the shop.

BOOKING:
Walk-ins welcome when chairs are available. Online booking recommended for weekends. Book via the website or call the location directly.

POLICIES:
- Arrive 5 minutes early for your appointment
- 24-hour cancellation notice requested
- Gift cards available at both locations
- No service charge, tip your barber directly

Write like a friendly human, not a bot. Use plain conversational sentences only. Never use bullet points, dashes as list items, bold text, headers, asterisks, pound signs, or any markdown formatting whatsoever. Just talk naturally like a knowledgeable person at the front desk would. Keep answers short and direct. If you do not know something specific, tell them to call the shop.`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { messages } = await req.json()
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = await client.messages.stream({
            model: 'claude-haiku-4-5',
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages,
          })

          for await (const chunk of anthropicStream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
