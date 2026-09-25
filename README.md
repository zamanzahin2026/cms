# Ostra — Property Management Marketing Landing Page & CMS

Ostra is an ultra-premium, Scandinavian-inspired marketing landing page and private CMS built for boutique retreats and property-management portfolios. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (Postgres, Auth, Storage), deployed via **Vercel** and **GitHub**.

---

## 1. Running the Site Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Create local environment file**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. **Fill in your environment variables** in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase Publishable / Anon key
   - `SUPABASE_SECRET_KEY`: Supabase Service Role Secret Key (server-only)
   - `SUPABASE_STORAGE_BUCKET`: `site-images`
   - `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000`
   - `ADMIN_SETUP_CODE`: A random 32-character secret code you generate for initial owner setup
   - `ADMIN_HOST`: (Optional) Leave empty for local development
4. **Seed database** (optional if already populated):
   ```bash
   npm run seed
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. One-Time Owner Account Setup (`/admin/setup`)

1. Open `http://localhost:3000/admin/setup` (or `https://<your-domain>/admin/setup` in production).
2. Enter your desired **Username** (3–32 characters, letters, numbers, dot, dash, underscore).
3. Enter your **Email address** (use the same email as your Supabase organization account for default email delivery).
4. Enter a strong **Password** (minimum 10 characters) and confirm it.
5. Enter the **Setup Code** matching your `ADMIN_SETUP_CODE` environment variable.
6. Submit the form. Your owner account is created and you are automatically signed in to the admin console.
7. **Important**: Once the admin profile is created in the database, `/admin/setup` permanently returns **404 Not Found** to prevent any unauthorized account creation.

---

## 3. Signing In to the Admin Console (`/admin/login`)

1. Navigate to `/admin/login` (note: there are no links to the admin area on the public website).
2. Enter either your **Username** or **Email address**, along with your password.
3. Submit the form. On success, session cookies are created and you are redirected to the editor at `/admin`.
4. **Rate Limiting**: To prevent brute-force attacks, 5 failed attempts within 15 minutes will temporarily lock out that IP address for 15 minutes.

---

## 4. Resetting a Forgotten Password (`/admin/forgot-password`)

1. Navigate to `/admin/forgot-password` (or click "Forgot password?" on the login page).
2. Enter your username or email address and click **Send Reset Link**.
3. For security, a generic confirmation message is always displayed.
4. Check your inbox for the Supabase password reset email.
   > **Note on Email Delivery**: Supabase's built-in default email service only sends emails to confirmed members of your Supabase project organization and is rate-limited to ~2-3 emails/hour. For production use, configure custom SMTP (see section 8).
5. Click the link in the email. It will take you to `/auth/callback?next=/admin/reset-password`.
6. Enter and confirm your new password (at least 10 characters).
7. Upon saving, all sessions across all devices are terminated, and you can sign in with your new password.

---

## 5. Managing Account Settings (`/admin/account`)

In the admin sidebar or top menu, click **Account**:
- **Change Username**: Update your login handle.
- **Change Password**: Verify your current password and set a new one.
- **Change Reset Email**: Enter a new email address. Supabase will send a confirmation email to the new address; once clicked, the email update is finalized.
- **Sign Out Everywhere**: Immediately invalidates all active sessions across all browsers and devices.

---

## 6. How Pushing to GitHub Redeploys on Vercel

1. Commit your changes to the `main` branch of your private GitHub repository:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
2. Vercel automatically detects the push and triggers an optimized production build.
3. Because all dynamic content and uploaded images live in **Supabase** (not on the local ephemeral file system), redeployments will never erase your edited text or uploaded media!

---

## 7. How to Add an Admin Subdomain (`admin.yourdomain.com`)

1. In your Vercel project dashboard, go to **Settings → Domains** and add `admin.yourdomain.com`.
2. In your DNS provider (Cloudflare, Namecheap, Route53, etc.), create a CNAME record pointing `admin` to `cname.vercel-dns.com`.
3. In Vercel's Environment Variables, set:
   ```env
   ADMIN_HOST=admin.yourdomain.com
   ```
4. Next.js middleware will automatically:
   - Serve the admin dashboard directly at `https://admin.yourdomain.com/`
   - Redirect any `/admin/*` visits on `yourdomain.com` to `admin.yourdomain.com`
   - Keep the main domain purely focused on the public landing page.

---

## 8. Setting Up Custom SMTP for Reliable Email Delivery

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to **Project Settings → Authentication → SMTP Settings**.
3. Toggle **Enable Custom SMTP** on.
4. Enter your SMTP credentials from a provider such as **Resend**, **SendGrid**, or **Postmark**:
   - **Sender email**: `noreply@yourdomain.com`
   - **Sender name**: `Ostra`
   - **Host**: e.g., `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **User**: `resend`
   - **Password**: Your API key / SMTP token
5. Save changes. No code modifications are needed. Password reset emails will now deliver reliably to any email address.

---

## 9. What to Do If You Are Fully Locked Out

If you lose your password, lose access to your email, or need to start fresh:
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication → Users**.
3. Locate the admin user row and click **Delete User**.
4. Because the `admin_profile` table has `ON DELETE CASCADE` on `user_id references auth.users(id)`, deleting the user in Supabase automatically removes the row from `admin_profile`.
5. Once `admin_profile` is empty, `/admin/setup` immediately becomes available again!
6. Open `/admin/setup`, enter your `ADMIN_SETUP_CODE`, and create a fresh admin account.
