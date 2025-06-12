 Waitlist & Launch Page Manager

 
💡 Why This One?
Frontend-heavy, so you can ship fast using familiar tools (Next.js + Tailwind).

Backend is simpler: No file uploads, fewer edge cases compared to screenshot handling in the feedback tool.

High polish with low logic complexity.

Great portfolio project — easily demoable with a public URL.

🗓️ 4-Day Build Plan
🔥 Day 1 – Setup & Core Landing Page
 Set up monorepo or two folders: /frontend (Next.js) and /backend (Go).

 Create waitlist landing page with:

Project logo, tagline, and email input.

?ref=code URL support.

 Connect form to Go backend endpoint: /api/signup.

 Store email + referral code in PostgreSQL.

Learning Goal: Basic Go API + DB setup.

⚙️ Day 2 – Referral Logic & Dashboard
 Generate and store unique referral codes (UUID, slugify(email), etc).

 When someone signs up using a referral link, credit the inviter.

 Build minimal admin dashboard in Next.js:

View signups

View referral counts

Leaderboard

Learning Goal: Joins, queries, dashboard UI.

💌 Day 3 – Email & Customization
 Send welcome email (Mailgun or Resend API).

 Email includes “Your referral link: [site]?ref=abc123”.

 Add branding customization on landing page (logo, background color).

 Add analytics: views vs signups.

Learning Goal: Go + external API (Mailgun), custom settings.

🎉 Day 4 – Polish & Deploy
 Mobile responsiveness

 Auth for dashboard (simple token or Clerk)

 Deploy:

Frontend → Vercel

Backend → Railway/Fly.io

DB → Supabase or hosted Postgres

 Test referral links, emails

 Write short demo doc / README

🔧 Tech Stack Snapshot
Layer	Tech
Frontend	Next.js, Tailwind, SWR
Backend	Go (Fiber or Gin), GORM
DB	PostgreSQL
Auth	Clerk/Auth.js or JWT
Emails	Resend or Mailgun
Hosting	Vercel + Railway

🧩 Optional Bonus Features (Time Permitting)
Custom subdomain (e.g., yourstartup.landing.so)

Admin CSV export

Dark mode