import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)
const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'

serve(async (req) => {
  const { email, code } = await req.json()

  try {
    if (!email || !code) {
      return new Response(JSON.stringify({ error: 'email and code are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data, error } = await resend.emails.send({
      from: `MyTrancy <${fromEmail}>`,
      to: [email],
      subject: 'Password Reset Code - MyTrancy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your MyTrancy account.</p>
          <p>Your reset code is: <strong style="font-size: 24px; color: #007bff;">${code}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>MyTrancy Team</p>
        </div>
      `,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message, details: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})