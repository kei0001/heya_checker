# 余白 / Room Reset
Private photo-based room organization prototype. Vinext + Responses API.

Set OPENAI_API_KEY as a secret in Sites runtime settings, then deploy to apply. Optional OPENAI_MODEL defaults to gpt-4.1-mini. Never add credentials to source or browser code. Preserve owner-private access: the hosting access boundary protects the paid API route. Add durable per-user quotas before making the app public.

Photos are resized to 1536px and converted to JPEG in the browser. Only pressing Analyze sends the photo to the server and OpenAI. The app has no photo database, uploads bucket, localStorage or image logging. Responses use store:false; OpenAI may retain data under its API policies. Selecting a file alone does not transmit it. Samples are explicit fictional data and never pretend to analyze uploads.

Score: 35% floor, 30% surfaces, 20% organization, 15% furniture, renormalized over visible categories and rounded to 5 points. Hygiene is separate and not scored. No claim of validated accuracy. Benchmark with labelled photos and repeated calls before production.

Run npm run dev / npm run build. API config absent: /api/status reports false, /api/analyze returns 503. No live API evaluation has been performed without credentials.

Official API references:
https://developers.openai.com/api/docs/guides/images-vision
https://developers.openai.com/api/docs/guides/structured-outputs
