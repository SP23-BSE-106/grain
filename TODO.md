# TODO: Resolve Token Cookie Issue on Vercel

## Completed Tasks
- [x] Analyze the authentication flow and identify the issue with cookies not persisting on Vercel
- [x] Update login route to set cookie domain in production
- [x] Update logout route to clear cookies with domain in production

## Summary
The issue was that cookies were not being set with the correct domain on Vercel, causing them to not be sent with requests, leading to middleware redirecting to login.

Changes made:
- In `/api/auth/login/route.ts`: Set `domain = request.nextUrl.host` in production for cookie options.
- In `/api/auth/logout/route.ts`: Added domain to cookie clearing options in production.

This should resolve the redirect issue after login on Vercel.
