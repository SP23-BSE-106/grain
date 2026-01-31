# Redirect Loop Issue - Fixed

## Problem Summary
Users were experiencing infinite redirects to the login page when logged in on Vercel, but the authentication worked fine locally.

## Root Causes Identified & Fixed

### 1. **Cookie Domain Configuration Issue** ❌ → ✅
**Problem:** 
- Login route was setting cookies with `domain: '.vercel.app'` for Vercel deployments
- This doesn't work because Vercel assigns specific domain names like `your-project.vercel.app`, not the generic `.vercel.app` domain
- Cookies weren't being sent back to the middleware for verification on subsequent requests

**Fix:**
- Removed the domain setting entirely from cookie options
- Next.js/Browser will automatically set the correct domain based on the request URL
- Now works on both localhost and all Vercel deployments

**File:** `src/app/api/auth/login/route.ts`

### 2. **Auth Store Hydration Race Condition** ❌ → ✅
**Problem:**
- `authStore` was using `sessionStorage` in production, which doesn't persist properly on page reloads
- During store rehydration, there was a timing issue where the middleware checked authentication before the client-side store decoded the JWT from the cookie
- This caused legitimate logged-in users to be redirected to login

**Fix:**
- Changed storage to use `localStorage` consistently (more reliable for Vercel)
- Improved hydration flow to properly set `isHydrated` state
- Now ensures `isHydrated` is set to `true` when `login()` is called, avoiding race conditions

**File:** `src/stores/authStore.ts`

### 3. **Middleware Logging** ⚠️ → ✅
**Problem:**
- Verbose console logs could help with debugging but were noise in production

**Fix:**
- Removed debug console logs from middleware
- Kept only critical error logs

**File:** `middleware.ts`, `src/lib/auth.ts`, `src/app/api/auth/login/route.ts`

### 4. **Admin Redirect Logic** ⚠️ → ✅
**Problem:**
- Non-admin users trying to access `/admin` were being redirected to login instead of home

**Fix:**
- Changed to redirect non-admin users to `/` (home) instead of login
- More intuitive UX for users without admin privileges

**File:** `middleware.ts`

## Changes Made

### Before:
```typescript
// login/route.ts
const isVercel = request.nextUrl.host.includes('vercel.app');
const cookieOptions = {
  domain: isVercel ? '.vercel.app' : undefined,
  // ...
};
```

### After:
```typescript
// login/route.ts
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};
// domain removed - browser handles it automatically
```

## Testing Recommendations

1. **Local Test:**
   ```bash
   npm run dev
   # Login and refresh page multiple times
   # Visit protected routes like /shop, /orders
   ```

2. **Vercel Test:**
   - Deploy to Vercel
   - Test login on your Vercel deployment URL
   - Refresh the page after login
   - Visit protected routes
   - Test logout and login again

3. **Browser Dev Tools Checks:**
   - Open DevTools → Application → Cookies
   - Verify `accessToken` and `refreshToken` are present
   - Check that domain is set to your deployment domain (not `.vercel.app`)

## Additional Notes

- Token expiration is set to 7 days for both access and refresh tokens
- `sameSite: 'lax'` allows cookies to work with cross-site navigation
- `httpOnly: false` for accessToken allows client-side access for auth checks
- `httpOnly: true` for refreshToken keeps it secure server-side only

### 5. **Edge Runtime Compatibility (Middleware)** ❌ → ✅
**Problem:**
- Middleware runs on Vercel's Edge Runtime, which doesn't support native Node.js modules used by `jsonwebtoken` (crypto, etc.) and potentially `bcryptjs`
- This caused token verification to silently fail or crash in the middleware, redirecting valid users to login

**Fix:**
- Installed `jose` library (lightweight, Edge-compatible JWT library)
- Created `src/lib/token.ts` for Edge-safe token verification using `jose`
- Refactored `src/lib/auth.ts` to separate Node-only dependencies (bcrypt) from token verification
- Updated `middleware.ts` and all API routes to use the new `async verifyToken` function

**File:** `middleware.ts`, `src/lib/token.ts`, `src/lib/auth.ts`
