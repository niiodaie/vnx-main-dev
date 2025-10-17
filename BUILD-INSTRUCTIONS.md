# VNX-Netscan Build Instructions

## ⚠️ Important: Local Build Limitations

This project **requires runtime environment variables** to build successfully. The build process will fail locally without Supabase and Stripe credentials configured.

### Why Local Build Fails

The project uses:
- **Supabase** for authentication and database
- **Stripe** for payment processing

Both require API keys that must be set as environment variables. Next.js tries to initialize these clients during the build phase, which fails without the credentials.

---

## ✅ Recommended Deployment Method

### Deploy Directly to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vnx-netscan.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables (see below)
   - Deploy!

3. **Set Environment Variables in Vercel**
   
   Go to Project Settings → Environment Variables and add:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID_MONTHLY=price_...
   STRIPE_PRICE_ID_YEARLY=price_...
   
   # Mapbox (Optional)
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
   
   # App URL
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Vercel will build automatically** with access to these environment variables

---

## 🔧 Alternative: Local Build with Environment Variables

If you need to build locally:

1. **Create `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in all required values** in `.env.local`

3. **Run build**
   ```bash
   npm run build
   ```

**Note:** You must have valid Supabase and Stripe credentials for the build to succeed.

---

## 🚀 Quick Deploy (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for env vars)
vercel --prod
```

---

## 📋 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] Supabase project created
- [ ] Supabase database schema deployed (`supabase-schema.sql`)
- [ ] Stripe account set up
- [ ] Stripe products created (Monthly & Yearly)
- [ ] Mapbox account (optional, for maps)
- [ ] All environment variables documented

---

## 🐛 Troubleshooting

### Build fails with "Neither apiKey nor config.authenticator provided"

**Solution:** This means Supabase credentials are missing. Add them to Vercel environment variables or `.env.local`.

### Build fails with Stripe errors

**Solution:** Add Stripe API keys to environment variables.

### Build succeeds but features don't work

**Solution:** Verify all environment variables are set correctly in Vercel dashboard.

---

## ✅ Deployment Checklist

1. [ ] Code pushed to GitHub
2. [ ] Supabase project created
3. [ ] Database schema deployed
4. [ ] Stripe products created
5. [ ] Mapbox token generated (optional)
6. [ ] Repository imported to Vercel
7. [ ] Environment variables added to Vercel
8. [ ] Deployment successful
9. [ ] Stripe webhook configured with live URL
10. [ ] Test free tier functionality
11. [ ] Test pro tier upgrade flow

---

## 📞 Support

For deployment issues:
- Check Vercel build logs
- Verify environment variables
- Review Supabase connection
- Test Stripe API keys

---

**Recommended:** Deploy to Vercel directly instead of building locally. Vercel handles environment variables correctly during the build process.

