import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();



  const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];
  const publicRoutes = ["/", ...authRoutes];

  // If the user is NOT authenticated and tries to access a protected route, redirect to /sign-in
  if (!publicRoutes.includes(request.nextUrl.pathname) && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }


  if (!user.error && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/recipes", request.url)); // Change to your desired authenticated home page
  }

  return response;

};
