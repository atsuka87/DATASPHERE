import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { readCurrentUser } from "@/lib/auth-core";

// Proteksi /admin/* di level server, sebelum halaman dirender:
//   tidak ada sesi valid        → /admin/login
//   login tapi bukan panitia    → /admin/unauthorized
// Sekaligus me-refresh token sesi Supabase (cookie) agar tidak kedaluwarsa diam-diam.
// Catatan: ini lapis pertama. Layout admin & setiap Server Action tetap memanggil requireStaff().

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/unauthorized"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { pathname } = request.nextUrl;
  const user = await readCurrentUser(supabase);

  // Redirect yang tetap membawa cookie sesi hasil refresh
  const redirectTo = (path: string, keepNext = false) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = keepNext ? `?next=${encodeURIComponent(pathname)}` : "";
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (pathname === "/admin/login") {
    // Sudah login sebagai panitia → langsung ke dashboard
    return user?.role ? redirectTo("/admin/dashboard") : response;
  }
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return response;

  if (!user) return redirectTo("/admin/login", true);
  if (!user.role) return redirectTo("/admin/unauthorized");

  if (pathname === "/admin" || pathname === "/admin/") return redirectTo("/admin/dashboard");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
