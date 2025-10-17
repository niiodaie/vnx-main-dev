# VNX-Netscan Production Deployment Guide

## 🎯 Overview

This is the **production-ready** version of VNX-Netscan with:

- ✅ **Free & Pro Tiers** - 5 free tools + 5 pro tools
- ✅ **Supabase Authentication** - Email, OAuth (Google/GitHub), Magic Link
- ✅ **Stripe Payments** - Monthly ($9.99) & Yearly ($99) subscriptions
- ✅ **Rate Limiting** - 5 requests/min for free, unlimited for pro
- ✅ **Admin Dashboard** - Usage stats, tool management, payment logs
- ✅ **Tool Access Control** - Free vs Pro tool restrictions

---

## 📋 Prerequisites

Before deploying, you need accounts for:

1. **Supabase** (https://supabase.com) - Database & Authentication
2. **Stripe** (https://stripe.com) - Payment processing
3. **Mapbox** (https://mapbox.com) - Map visualization (optional but recommended)
4. **Vercel** (https://vercel.com) - Hosting platform

---

## 🚀 Step-by-Step Deployment

### Step 1: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** and run the `supabase-schema.sql` file
3. Go to **Authentication** → **Providers**:
   - Enable **Email** provider
   - Enable **Google** OAuth (optional)
   - Enable **GitHub** OAuth (optional)
4. Go to **Settings** → **API**:
   - Copy your `Project URL`
   - Copy your `anon public` key

### Step 2: Set Up Stripe

1. Create a Stripe account at https://stripe.com
2. Go to **Developers** → **API Keys**:
   - Copy your `Publishable key`
   - Copy your `Secret key`
3. Go to **Products** → **Add Product**:
   - Create "VNX-Netscan Pro Monthly" - $9.99/month
   - Create "VNX-Netscan Pro Yearly" - $99/year
   - Copy the `Price ID` for each
4. Go to **Developers** → **Webhooks**:
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the `Signing secret`

### Step 3: Set Up Mapbox (Optional)

1. Create account at https://mapbox.com
2. Go to **Access Tokens**
3. Create a new token with `styles:read` scope
4. Copy the token

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your-public-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_your-monthly-id
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_your-yearly-id

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token

# App Configuration
NEXT_PUBLIC_APP_URL=https://visnec.ai
NEXT_PUBLIC_APP_NAME=VNX-Netscan
```

### Step 5: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables from Step 4
5. Click "Deploy"

### Step 6: Configure Stripe Webhook

After deployment:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Update the endpoint URL to your deployed domain:
   ```
   https://your-vercel-domain.vercel.app/api/stripe/webhook
   ```
3. Test the webhook

---

## 🧪 Testing

### Test Free Tier

1. Visit `/tools/netscan`
2. Try any free tool (Ping, DNS, WHOIS, IP Lookup, GeoIP)
3. Make 6 requests quickly - should see rate limit error

### Test Pro Tier

1. Click "Upgrade to Pro"
2. Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
3. After redirect, verify Pro badge appears
4. Try Pro tools (Traceroute, Speed Test, Port Scanner, etc.)
5. Make unlimited requests - no rate limiting

### Test Admin Dashboard

1. Sign in as admin user
2. Visit `/admin/netscan`
3. Verify stats display
4. Toggle tool maintenance mode

---

## 📊 Database Schema

The Supabase database includes:

- **user_subscriptions** - User tier and Stripe subscription data
- **payment_logs** - Payment history and transactions
- **netscan_logs** - API usage tracking
- **tool_status** - Tool maintenance toggles
- **error_logs** - Error tracking

---

## 🔧 Configuration

### Free Tier Tools

- Ping
- DNS Lookup
- WHOIS
- IP Lookup
- GeoIP

**Rate Limit:** 5 requests per minute per IP

### Pro Tier Tools

All free tools PLUS:

- Traceroute
- Speed Test
- Port Scanner
- SSL/TLS Check
- Wireshark Light

**Rate Limit:** Unlimited

---

## 🛠️ Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Supabase Connection Issues

1. Verify environment variables are set correctly
2. Check Supabase project is not paused
3. Verify API keys are valid

### Stripe Webhook Not Working

1. Check webhook endpoint URL matches deployed domain
2. Verify webhook secret is correct
3. Test webhook in Stripe Dashboard
4. Check Vercel function logs

### Rate Limiting Not Working

1. Verify `rate-limiter-flexible` is installed
2. Check IP detection in `lib/rate-limit.ts`
3. Test with different IPs or clear cache

---

## 📝 API Routes

### Netscan Tools

- `GET /api/tools/netscan/ping?host=example.com`
- `GET /api/tools/netscan/dns?domain=example.com`
- `GET /api/tools/netscan/whois?domain=example.com`
- `GET /api/tools/netscan/ip-lookup?ip=8.8.8.8`
- `GET /api/tools/netscan/geoip?ip=8.8.8.8`
- `GET /api/tools/netscan/traceroute?host=example.com` (Pro)
- `GET /api/tools/netscan/speed` (Pro)

### Stripe

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Admin

- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/tools` - Get tool status
- `POST /api/admin/tools/toggle` - Toggle tool maintenance

---

## 🎨 Customization

### Adding New Tools

1. Add tool config to `config/tools.ts`
2. Create API route in `app/api/tools/netscan/[tool-name]/route.ts`
3. Add tool page in `app/tools/netscan/[tool]/page.tsx`
4. Update database with tool status

### Changing Pricing

1. Update plans in `lib/payments/stripe.ts`
2. Create new prices in Stripe Dashboard
3. Update environment variables

### Customizing Rate Limits

Edit `lib/rate-limit.ts`:

```typescript
const freeTierLimiter = new RateLimiterMemory({
  points: 10, // Change from 5 to 10 requests
  duration: 60, // Per 60 seconds
});
```

---

## 📦 Package Contents

```
vnx-netscan-prod/
├── app/
│   ├── api/
│   │   ├── stripe/          # Stripe checkout & webhooks
│   │   └── tools/netscan/   # Tool API routes
│   ├── admin/netscan/       # Admin dashboard
│   └── tools/netscan/       # Tool pages & pricing
├── components/
│   ├── auth/                # Authentication UI
│   └── netscan/             # Tool components
├── config/
│   └── tools.ts             # Tool configuration
├── lib/
│   ├── auth/                # Supabase auth
│   ├── payments/            # Stripe integration
│   └── rate-limit.ts        # Rate limiting
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment template
└── DEPLOYMENT_GUIDE_PROD.md # This file
```

---

## ✅ Production Checklist

Before going live:

- [ ] Supabase database schema applied
- [ ] Stripe products and prices created
- [ ] Stripe webhook configured and tested
- [ ] Environment variables set in Vercel
- [ ] OAuth providers configured (Google, GitHub)
- [ ] Mapbox token added (for GeoIP maps)
- [ ] Test free tier rate limiting
- [ ] Test pro tier checkout flow
- [ ] Test admin dashboard access
- [ ] Verify all 10 tools work correctly
- [ ] Test on mobile devices
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain (optional)

---

## 🚨 Security Notes

1. **Never commit `.env.local`** - It contains sensitive keys
2. **Use Stripe test mode** for development
3. **Enable RLS** on all Supabase tables (already configured in schema)
4. **Rotate API keys** regularly
5. **Monitor webhook logs** for suspicious activity

---

## 📞 Support

For issues or questions:

- **VNX Documentation:** https://visnec.ai/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 🎉 Congratulations!

Your VNX-Netscan production environment is ready to deploy!

**Next Steps:**
1. Complete the setup steps above
2. Deploy to Vercel
3. Test thoroughly
4. Launch to users!

---

**Built with:** Next.js 15, TypeScript, TailwindCSS v3, Supabase, Stripe  
**Deployed on:** Vercel  
**Part of:** Visnec Nexus (VNX) Ecosystem  
**Website:** https://visnec.ai

