# TODO: Resolve Token Cookie Issue on Vercel

## Completed Tasks
- [x] Analyze the authentication flow and identify the issue with cookies not persisting on Vercel
- [x] Update login route to set cookie domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'
- [x] Update signup route to set cookie domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'
- [x] Update logout route to set cookie domain to '.vercel.app' if on vercel.app in production
- [x] Fix console.log in login route to remove reference to removed domain variable

## Summary
The issue was that cookies were not being set correctly on Vercel due to sameSite policy. Set sameSite to 'none' in production to allow cross-site requests, removed domain settings, and set accessToken to httpOnly: true.

Changes made:
- In `/api/auth/login/route.ts`: Removed domain, set sameSite 'none' in production, accessToken httpOnly: true
- In `/api/auth/signup/route.ts`: Removed domain, set sameSite 'none' in production
- In `/api/auth/logout/route.ts`: Removed domain, set sameSite 'none' in production

This should resolve the redirect issue after login on Vercel.
