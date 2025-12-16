<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16tDYnor6ynWdaBg795KxmUYzFgVV6C3v

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the lightweight auth backend (new):
   `npm run server`
4. Run the app in a second terminal:
   `npm run dev`

Default login: **company11 / company123**

Dashboard data now comes from the local backend (`/api/dashboard`) with live-style updates and order mutations (`/api/orders`).
