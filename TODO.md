# TODO: Resolve Token Cookie Issue on Vercel

## Completed Tasks
- [x] Analyze the authentication flow and identify the issue with cookies not persisting on Vercel
- [x] Update login route to set cookie domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'
- [x] Update signup route to set cookie domain to '.vercel.app' if on vercel.app in production, sameSite to 'lax'
- [x] Update logout route to set cookie domain to '.vercel.app' if on vercel.app in production
- [x] Fix console.log in login route to remove reference to removed domain variable

## Summary
The issue was that cookies were not being set correctly on Vercel due to incorrect domain setting. For Vercel deployments, domain should be set to the specific host (e.g., myapp.vercel.app) rather than '.vercel.app' to ensure cookies are set properly.

Changes made:
- In `/api/auth/login/route.ts`: Changed domain: isVercel ? request.nextUrl.host : undefined
- In `/api/auth/signup/route.ts`: Changed domain: isVercel ? request.nextUrl.host : undefined
- In `/api/auth/logout/route.ts`: Changed domain: isVercel ? request.nextUrl.host : undefined

This should resolve the redirect issue after login on Vercel.

This should resolve the redirect issue after login on Vercel.
