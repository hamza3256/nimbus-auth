# NimbusAuth Starter Kit

A modern, production-ready authentication starter kit for Next.js 15+ projects. Built for rapid development, robust security, and easy customisation for any project or brand.

---

## 🚀 Quick Start

Scaffold a new project in seconds:

```bash
npx degit hamza3256/nimbus-auth my-app
cd my-app
npm install
```

---

## ✨ Features
- **Next.js 15+ (App Router)** for best-in-class performance and developer experience
- **Auth.js (NextAuth.js)** for secure, flexible authentication (credentials + OAuth ready)
- **Drizzle ORM + PostgreSQL** for type-safe, scalable database access
- **shadcn/ui** for beautiful, accessible, and customizable UI components
- **Dragon Ball Z-inspired theme** (easy to swap out for your own branding)
- **Responsive, mobile-first design**
- **Protected dashboard route example**
- **Form validation with Zod**
- **Toast notifications for feedback**
- **All styles via Tailwind CSS for easy re-theming**
- **Password visibility toggle for user-friendly forms**

---

## 🚀 Getting Started (from a Clean Slate)

1. **Set up your environment variables:**
   - Copy `.env.example` to `.env.local` and fill in:
     - `DATABASE_URL` (PostgreSQL connection string)
     - `NEXTAUTH_URL` (your site URL)
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
     - OAuth provider keys if needed (Google, GitHub, etc.)
2. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```
3. **Start the dev server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) and sign up!**

---

## 🛠️ Technologies & Why

- **Next.js 15+**: App Router, server components, and best-in-class SSR/SSG/ISR for performance and scalability.
- **Auth.js (NextAuth.js)**: Secure, flexible, and production-proven authentication for credentials and OAuth.
- **Drizzle ORM**: Type-safe, modern ORM for PostgreSQL, easy migrations, and great DX.
- **PostgreSQL**: Reliable, scalable, open-source SQL database.
- **shadcn/ui**: Accessible, headless, and easily customizable React UI components.
- **Tailwind CSS**: Utility-first, fast, and easy to theme.
- **Zod**: Type-safe, declarative schema validation for forms and APIs.

---

## 🎨 Theming & Customization
- All colors, fonts, and UI elements are styled via Tailwind classes and CSS variables.
- To re-theme, update the Tailwind config or swap out the color classes in components.
- All UI components are modular and easy to swap or extend.
- Easily replace assets, icons, and branding for your own project.

---

## 🧑‍💻 How to Use as a Starter Kit
- Replace theme assets and colors with your own branding.
- Update the database schema in `src/lib/db/schema.ts` as needed.
- Add or remove authentication providers in `src/lib/auth/auth.ts`.
- Extend the dashboard or add new protected routes as your app grows.
- All UI components are modular and easy to swap or extend.

---

## 📁 Notable Files & Structure
- `src/app/page.tsx` — Home page, session-aware
- `src/app/signin/page.tsx` & `src/app/signup/page.tsx` — Auth forms
- `src/app/dashboard/page.tsx` — Protected dashboard example
- `src/components/ui/password-input.tsx` — Password field with eye toggle

---

## 📝 License
MIT — Use this as a base for your next project!
