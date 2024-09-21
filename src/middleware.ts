import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    console.log('Protected route accessed:', req.url);
    auth().protect(); // Corrected the invocation
  }
});


export const config = {
  matcher: [
    '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
