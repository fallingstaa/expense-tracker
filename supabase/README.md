# Supabase Edge Functions

This directory contains Supabase Edge Functions for the expense tracker.

## send-reset-code

Sends a password reset code email using Resend.

### Setup

1. Sign up for [Resend](https://resend.com) and get your API key.
2. In your Supabase dashboard, go to Project Settings > Edge Functions > Environment variables, and add `RESEND_API_KEY` with your Resend API key.
3. Deploy the function using Supabase CLI:

   ```bash
   supabase functions deploy send-reset-code
   ```

### Local Development

To test locally:

1. Install Supabase CLI if not already.
2. Set the environment variable locally:

   ```bash
   export RESEND_API_KEY=your_resend_api_key
   ```

3. Start the local Supabase:

   ```bash
   supabase start
   ```

4. Serve the function locally:

   ```bash
   supabase functions serve send-reset-code
   ```

The backend will call this function to send emails.