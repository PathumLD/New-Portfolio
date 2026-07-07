<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jGdbcIVv2XD9B0iysbMmJp1qAOEaGk7u

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set the Resend contact form variables in your local/deployment environment:
   `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_EMAIL_TO`
4. Run the app:
   `npm run dev`

The contact form posts to `/api/contact`, which needs a serverless/API runtime such as Vercel Functions. Use `vercel dev` for local end-to-end email testing.
