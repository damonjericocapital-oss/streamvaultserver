# 💳 Admin Payment Gateway Configuration Guide

## Overview

The Admin Payment Gateway Configuration allows you (the server owner) to connect real payment processors to accept actual payments from your customers. This is separate from the customer-facing subscription UI.

---

## 🎯 What You Need to Configure

### 1. Choose Your Payment Gateway

StreamVault supports three payment gateways:

#### 💳 Stripe (Recommended)
- **Best for**: Credit/debit cards, global reach
- **Fees**: 2.9% + $0.30 per transaction
- **Payout**: 2-7 business days
- **Currencies**: 135+ currencies
- **Setup Time**: 10-15 minutes

#### 💰 PayPal
- **Best for**: PayPal users, buyer protection
- **Fees**: 2.9% + $0.30 per transaction
- **Payout**: 1-3 business days
- **Currencies**: 25 currencies
- **Setup Time**: 5-10 minutes

#### ₿ Cryptocurrency
- **Best for**: Privacy-focused users, global
- **Fees**: Network fees only (0.1-1%)
- **Payout**: Instant
- **Currencies**: BTC, ETH, USDT
- **Setup Time**: 5 minutes

---

## 🚀 Step-by-Step Setup Guide

### Option 1: Stripe Setup

#### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Enter your email, full name, and password
4. Click "Create account"

#### Step 2: Activate Your Account
1. Click "Activate your account" in the dashboard
2. Enter your business details:
   - Business type (Individual, Company, etc.)
   - Legal name
   - Address
   - Phone number
   - Bank account for payouts
3. Complete identity verification

#### Step 3: Get API Keys
1. Go to **Developers** → **API keys**
2. You'll see two sets of keys:
   - **Test mode** (for testing)
   - **Live mode** (for real payments)
3. Copy these keys:
   - **Publishable key** (starts with `pk_live_` or `pk_test_`)
   - **Secret key** (starts with `sk_live_` or `sk_test_`)

#### Step 4: Configure Webhooks
1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `charge.refunded`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

#### Step 5: Enter Credentials in StreamVault
1. Open StreamVault
2. Go to **Settings** → **Infrastructure** → **Payment Config**
3. Select **Stripe** tab
4. Enable Stripe
5. Paste your keys:
   - Publishable Key: `pk_live_...`
   - Secret Key: `sk_live_...`
   - Webhook Secret: `whsec_...`
6. Click "Save Stripe Configuration"
7. Toggle **Test Mode** OFF when ready for live payments

---

### Option 2: PayPal Setup

#### Step 1: Create PayPal Business Account
1. Go to [paypal.com/business](https://www.paypal.com/business)
2. Click "Sign up"
3. Choose "Business Account"
4. Enter your business email and create password
5. Complete business verification

#### Step 2: Get API Credentials
1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Go to **Apps & Credentials**
3. Click "Create App"
4. Enter app name (e.g., "StreamVault")
5. Select "Merchant" as account type
6. Click "Create App"
7. Copy these credentials:
   - **Client ID**
   - **Secret**

#### Step 3: Configure Webhooks
1. In your app settings, go to **Webhooks**
2. Click "Add webhook"
3. Enter webhook URL: `https://your-domain.com/api/webhooks/paypal`
4. Select events:
   - PAYMENT.AUTHORIZATION.CREATED
   - PAYMENT.AUTHORIZATION.VOIDED
   - PAYMENT.CAPTURE.COMPLETED
   - PAYMENT.CAPTURE.DENIED
   - PAYMENT.CAPTURE.PENDING
   - PAYMENT.CAPTURE.REFUNDED
   - PAYMENT.CAPTURE.REVERSED
   - PAYMENT.SALE.COMPLETED
5. Click "Save"
6. Copy the **Webhook ID**

#### Step 4: Enter Credentials in StreamVault
1. Open StreamVault
2. Go to **Settings** → **Infrastructure** → **Payment Config**
3. Select **PayPal** tab
4. Enable PayPal
5. Paste your credentials:
   - Client ID
   - Secret
   - Business Email
6. Toggle "Use Sandbox" for testing
7. Click "Save PayPal Configuration"

---

### Option 3: Cryptocurrency Setup

#### Step 1: Create Crypto Wallets
You need wallet addresses for each cryptocurrency you want to accept:

**Bitcoin (BTC)**
1. Create a Bitcoin wallet (e.g., Exodus, Electrum, or hardware wallet)
2. Copy your receiving address (starts with `bc1`, `1`, or `3`)

**Ethereum (ETH)**
1. Create an Ethereum wallet (e.g., MetaMask, Trust Wallet)
2. Copy your receiving address (starts with `0x`)

**USDT (Tether)**
1. Use the same Ethereum wallet (USDT is an ERC-20 token)
2. Your ETH address works for USDT

#### Step 2: (Optional) Set Up Coinbase Commerce
For automated payment tracking:
1. Go to [commerce.coinbase.com](https://commerce.coinbase.com)
2. Sign up and verify your account
3. Go to **Settings** → **API keys**
4. Create a new API key
5. Go to **Settings** → **Webhooks**
6. Add webhook URL: `https://your-domain.com/api/webhooks/crypto`
7. Copy the webhook secret

#### Step 3: Enter Credentials in StreamVault
1. Open StreamVault
2. Go to **Settings** → **Infrastructure** → **Payment Config**
3. Select **Crypto** tab
4. Enable Crypto
5. Paste your wallet addresses:
   - Bitcoin: `bc1q...`
   - Ethereum: `0x...`
   - USDT: `0x...`
6. (Optional) Add Coinbase Commerce API key
7. Click "Save Crypto Configuration"

---

## 🔧 Configuration Options

### Test Mode vs Live Mode

**Test Mode (ON)**
- Uses sandbox/test credentials
- No real money is charged
- Perfect for testing the flow
- Toggle in Payment Config header

**Live Mode (OFF)**
- Uses live credentials
- Real money is charged
- Only enable when ready
- Requires activated payment gateway accounts

### Active Gateway

You can only have **one active gateway** at a time:
- **Stripe**: Credit/debit cards
- **PayPal**: PayPal payments
- **Crypto**: Cryptocurrency payments
- **None**: No payments accepted

Switch between gateways by enabling/disabling them in their respective tabs.

---

## 📊 Revenue Dashboard

Access your revenue dashboard at **Settings** → **Infrastructure** → **Revenue**

### Metrics Displayed

**Total Revenue**
- All-time revenue from all subscriptions
- Includes completed transactions only

**Monthly Recurring Revenue (MRR)**
- Current month's recurring revenue
- Excludes one-time payments

**Active Subscribers**
- Total number of active subscriptions
- Excludes cancelled/expired

**Churn Rate**
- Percentage of subscribers who cancelled
- Lower is better (target: <5%)

**Average Revenue Per User (ARPU)**
- Total revenue ÷ active subscribers
- Indicates pricing effectiveness

**Revenue by Plan**
- Breakdown of revenue by subscription tier
- Helps identify most popular plans

**Recent Transactions**
- Last 10 payment transactions
- Shows user, plan, amount, status, gateway

---

## 🔐 Security Best Practices

### API Key Security
1. **Never share your secret keys** publicly
2. **Use environment variables** in production
3. **Rotate keys regularly** (every 90 days)
4. **Use test keys** for development
5. **Restrict webhook IPs** to your server

### Webhook Security
1. **Verify webhook signatures** before processing
2. **Use HTTPS** for all webhook URLs
3. **Validate payload** matches expected format
4. **Handle retries** gracefully
5. **Log all webhook events** for auditing

### General Security
1. **Enable 2FA** on payment gateway accounts
2. **Use strong passwords** (20+ characters)
3. **Monitor transactions** for suspicious activity
4. **Set up alerts** for large transactions
5. **Keep backups** of transaction logs

---

## 🧪 Testing Your Setup

### Test Payment Flow
1. Enable **Test Mode** in Payment Config
2. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0027 6000 3184`
3. Use any future expiration date
4. Use any 3-digit CVC
5. Use any postal code

### Verify Webhooks
1. Make a test payment
2. Check webhook logs in payment gateway dashboard
3. Verify webhook received by your server
4. Check transaction appears in Revenue Dashboard

### Test Different Scenarios
- ✅ Successful payment
- ❌ Failed payment (insufficient funds)
- 🔄 Subscription upgrade
- 🔄 Subscription downgrade
- ❌ Subscription cancellation
- 💰 Refund processing

---

## 🚨 Troubleshooting

### "Configuration saved successfully" but payments not working
- Check if **Test Mode** is OFF for live payments
- Verify API keys are **live keys** (not test keys)
- Ensure account is **fully activated** in payment gateway
- Check webhook URL is accessible from internet

### Webhooks not being received
- Verify webhook URL is **publicly accessible** (not localhost)
- Check firewall allows incoming connections
- Verify webhook secret matches in both places
- Check payment gateway webhook logs for errors

### "Please fill in all required fields" error
- Ensure all required fields are filled
- Check for extra spaces in API keys
- Verify email format is correct
- Ensure wallet addresses are valid format

### Revenue not updating
- Check transactions have **completed** status
- Verify webhook is processing correctly
- Check browser console for errors
- Refresh the Revenue Dashboard page

---

## 📈 Going Live Checklist

Before switching from test to live mode:

- [ ] Payment gateway account fully activated
- [ ] Bank account verified for payouts
- [ ] Test payments successful
- [ ] Webhooks receiving events correctly
- [ ] Revenue Dashboard showing test transactions
- [ ] API keys are **live keys** (not test keys)
- [ ] Webhook secrets configured
- [ ] HTTPS enabled on your domain
- [ ] SSL certificate valid
- [ ] Terms of Service and Privacy Policy published
- [ ] Refund policy documented
- [ ] Customer support email configured

---

## 💡 Pro Tips

### Maximize Revenue
1. **Offer yearly plans** with 20% discount
2. **Use anchor pricing** (show higher "regular" price)
3. **Send payment reminders** before renewal
4. **Offer upgrade incentives** (discount for upgrading)
5. **Analyze churn** and address common cancellation reasons

### Reduce Churn
1. **Send engagement emails** to inactive users
2. **Offer pause option** instead of cancellation
3. **Provide excellent customer support**
4. **Regularly add new content**
5. **Survey churned users** for feedback

### Optimize Conversion
1. **Show free trial** if possible
2. **Display social proof** (user count, testimonials)
3. **Highlight most popular plan**
4. **Use urgency** (limited-time offers)
5. **Simplify checkout** (minimal form fields)

---

## 🔗 Useful Links

### Stripe
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

### PayPal
- [PayPal Dashboard](https://www.paypal.com/business)
- [PayPal Developer](https://developer.paypal.com)
- [PayPal Webhooks](https://developer.paypal.com/docs/api-billing/subscriptions/webhooks/)

### Cryptocurrency
- [Coinbase Commerce](https://commerce.coinbase.com)
- [Bitcoin.org](https://bitcoin.org)
- [Ethereum.org](https://ethereum.org)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review payment gateway documentation
3. Check webhook logs in payment gateway dashboard
4. Verify all configuration values are correct
5. Contact payment gateway support if needed

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready
