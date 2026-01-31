## Error Type
Console Error

## Error Message
The final argument passed to useEffect changed size between renders. The order and size of this array must remain constant.

Previous: [true, /shop, [object Object], ()=>set({
                isHydrated: true
            })]
Incoming: [true, /shop, [object Object], ()=>set({
                isHydrated: true
            }), [object Object]]


    at createConsoleError (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_49c74ceb._.js:2199:71)
    at handleConsoleError (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_49c74ceb._.js:2980:54)
    at console.error (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_49c74ceb._.js:3124:57)
    at areHookInputsEqual (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:4635:56)
    at updateEffectImpl (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:5331:50)
    at Object.useEffect (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:15358:13)
    at exports.useEffect (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_2ad096cd._.js:1722:36)
    at AuthProvider (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/grain_9f78d475._.js?id=%255Bproject%255D%252Fgrain%252Fsrc%252Fcomponents%252FAuthProvider.tsx+%255Bapp-client%255D+%2528ecmascript%2529:32:189)
    at Object.react_stack_bottom_frame (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:14826:24)
    at renderWithHooksAgain (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:4706:24)
    at renderWithHooks (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:4657:28)
    at updateFunctionComponent (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:6112:21)
    at beginWork (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:6708:24)
    at runWithFiberInDEV (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:965:74)
    at performUnitOfWork (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:9562:97)
    at workLoopSync (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:9456:40)
    at renderRootSync (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:9440:13)
    at performWorkOnRoot (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:9068:186)
    at performSyncWorkOnRoot (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:10238:9)
    at flushSyncWorkAcrossRoots_impl (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:10154:316)
    at flushSyncWork$1 (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:9237:86)
    at scheduleRefresh (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_react-dom_3044fad4._.js:299:13)
    at S.scheduleRefresh (chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js:1:86461)
    at <unknown> (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_2ad096cd._.js:391:33)
    at Set.forEach (<anonymous>:null:null)
    at Object.performReactRefresh (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_2ad096cd._.js:384:38)
    at applyUpdate (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_2ad096cd._.js:878:31)
    at <unknown> (file://D:/Sixth semester/Projects/grain/.next/dev/static/chunks/c9072_next_dist_compiled_2ad096cd._.js:886:13)
    at RootLayout (src\app\layout.tsx:29:9)

## Code Frame
  27 |     <html lang="en" suppressHydrationWarning={true}>
  28 |       <body className={inter.className} suppressHydrationWarning={true}>
> 29 |         <AuthProvider>
     |         ^
  30 |           {/* Skip to main content link for accessibility */}
  31 |           <a
  32 |             href="#main-content"

Next.js version: 16.1.4 (Turbopack)
# TODO: Fix Login Redirect Issue

## Problem
Users are being redirected to login page even when already logged in, causing unnecessary redirects and poor UX.

## Root Cause
- Both middleware and AuthProvider are performing authentication checks
- AuthProvider makes API calls to /api/auth/me on every protected route load
- Potential race conditions between middleware token verification and client-side auth checks

## Solution
1. Optimize AuthProvider to avoid redundant auth checks
2. Use token verification from cookies instead of API calls where possible
3. Ensure middleware handles initial auth verification properly

## Tasks
- [x] Update AuthProvider to check for existing user in store first
- [x] Add token verification from cookies before API call
- [x] Prevent unnecessary redirects when user is already authenticated
- [x] Test the fix to ensure no more unwanted redirects

## Summary of Changes
- Modified `src/components/AuthProvider.tsx` to:
  - Check if user is already in the auth store before making API calls
  - Verify token existence in cookies before attempting API verification
  - Only make `/api/auth/me` API call when necessary (token exists but no user in store)
  - Prevent unnecessary redirects when user is already authenticated
- This should resolve the login redirect issue when users are already logged in
