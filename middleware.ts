// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/sign-in',
//   '/sign-up',
//   '/[[...rest]]'
// ])

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect()
// })

//TODO: modificare pentru static route 
// Importarea funcțiilor necesare pentru configurarea middleware-ului
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Crearea unui matcher pentru rutele protejate
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Ruta pentru dashboard
  '/sign-in(.*)', // Ruta pentru autentificare
  '/sign-up(.*)', // Ruta pentru înregistrare
  '/(.*)' // Ruta pentru toate celelalte pagini
]);

// Exportarea middleware-ului
export default clerkMiddleware(async (auth, req) => {
  // Verificarea dacă ruta actuală este protejată
  if (isProtectedRoute(req)) {
    // Protejarea rutei prin autentificare
    await auth.protect();
  }
});

// Configurarea pentru matcher
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};