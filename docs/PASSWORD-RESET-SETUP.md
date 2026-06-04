# Password reset and change — setup

DigiPermit supports:

| Flow | Where | API |
|------|--------|-----|
| **Forgot password** | Login → Forgot password? | `POST /api/auth/forgot-password` |
| **Reset from email** | Link opens `/reset-password` | `POST /api/auth/reset-password` |
| **Change while logged in** | Profile → Change password | `POST /api/auth/change-password` |

Password rules: minimum **8 characters** (same as admin-created users).

---

## 1. Supabase — redirect URLs

**Authentication → URL configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://mrntuli.github.io/DPermit/` |
| Redirect URLs | `https://mrntuli.github.io/DPermit/reset-password` |
| | `http://localhost:4200/reset-password` |
| | `http://localhost:8100/reset-password` |

The API builds the reset link from `FRONTEND_URL` (first entry). For production Render:

```env
FRONTEND_URL=https://mrntuli.github.io/DPermit,http://localhost:4200
```

---

## 2. Supabase — email

**Authentication → Email templates** → enable **Reset password**.

For demos without SMTP: use Supabase built-in mail (rate-limited) or configure **Custom SMTP** under Project Settings → Auth.

---

## 3. Test locally

1. Start API and app (`npm run dev` / `ionic serve`).
2. Open `/forgot-password`, enter a seed user email (e.g. `verify@digipermit.demo`).
3. Open the link in the email → should land on `/reset-password#access_token=...&type=recovery`.
4. Set a new password and sign in.
5. While logged in: **Profile** → change password with current + new.

---

## 4. Troubleshooting

| Issue | Fix |
|-------|-----|
| Email not received | Check spam; confirm Auth email enabled; user exists in Supabase Auth |
| Link opens 404 on GitHub Pages | Add redirect URL; rebuild frontend with `npm run build:pages` |
| Invalid or expired reset link | Link expires (~1 hour); request a new reset |
| Current password incorrect | Use exact account email; caps lock |

---

## 5. Security notes

- Forgot-password response is generic (does not reveal whether the email exists).
- Change password requires the current password.
- Reset uses a one-time token from Supabase; the API validates it before updating.
