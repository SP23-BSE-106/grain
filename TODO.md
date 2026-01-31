# TODO: Resolve Token Cookie Issue on Vercel

## Completed Tasks
- [x] Analyze the authentication flow and identify the issue with cookies not persisting on Vercel
- [x] Update login route to remove cookie domain and set sameSite to 'none' in production
- [x] Update logout route to remove cookie domain in production
- [x] Fix console.log in login route to remove reference to removed domain variable

## Summary
The issue was that cookies were not being set correctly on Vercel due to domain setting and sameSite policy. On Vercel, domain should not be set, and sameSite should be 'none' in production for cross-site compatibility.

Changes made:
- In `/api/auth/login/route.ts`: Removed domain setting, set sameSite to 'none' in production.
- In `/api/auth/logout/route.ts`: Removed domain setting.

This should resolve the redirect issue after login on Vercel.
