# TODO: Resolve Token Cookie Issue on Vercel

## Completed Tasks
- [x] Analyze the authentication flow and identify the issue with cookies not persisting on Vercel
- [x] Update login route to remove cookie domain and set sameSite to 'none' in production
- [x] Update logout route to remove cookie domain in production
- [x] Fix console.log in login route to remove reference to removed domain variable

## Summary
The issue was that cookies were not being set correctly on Vercel due to domain setting. For Vercel deployments on subdomains, domain should be set to '.vercel.app' to allow cookies across subdomains, and sameSite should be 'lax'.

Changes made:
- In `/api/auth/login/route.ts`: Set domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'.
- In `/api/auth/signup/route.ts`: Set domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'.
- In `/api/auth/logout/route.ts`: Set domain to '.vercel.app' if on vercel.app in production.

This should resolve the redirect issue after login on Vercel.
