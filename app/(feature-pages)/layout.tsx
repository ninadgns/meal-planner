import { deleteAccountAction, signOutAction } from "@/app/actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "../globals.css";
import { ChefHat, LogOut, Menu, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "NutriCulinary - Personalized Recipe Finder",
  description: "Find recipes that match your dietary preferences and restrictions",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let userData = null;
  if (authUser) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (!error) {
      userData = data;
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex w-full justify-between items-center">
              {/* Logo and brand */}
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <ChefHat className="h-6 w-6" />
                <span className="hidden sm:inline">NutriCulinary</span>
              </Link>

              {/* Desktop Navigation */}
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 mx-6">
                <Link
                  className="text-sm font-medium transition-colors hover:text-primary hover:underline py-1 px-2 rounded-md hover:bg-primary/10"
                  href="/recipes">
                  Recipes
                </Link>
                <Link
                  className="text-sm font-medium transition-colors hover:text-primary hover:underline py-1 px-2 rounded-md hover:bg-primary/10"
                  href="/preferences">
                  Dietary Preferences
                </Link>
                <Link
                  className="text-sm font-medium transition-colors hover:text-primary hover:underline py-1 px-2 rounded-md hover:bg-primary/10"
                  href="/compatible-recipes">
                  Compatible Recipes
                </Link>
              </nav>

              {/* Theme and Auth */}
              <div className="flex items-center gap-2">
                <ThemeSwitcher />

                {/* Auth Status */}
                {!hasEnvVars ? (
                  <Badge variant="outline" className="hidden md:inline-flex">
                    Update .env.local file
                  </Badge>
                ) : authUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 px-3 md:px-4">
                        <span className="hidden md:inline-flex mr-1">Hey,</span>
                        {userData?.user_name || 'User'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <form action={signOutAction} className="w-full">
                          <button type="submit" className="w-full text-left flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </form>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <form action={deleteAccountAction} className="w-full">
                          <button type="submit" className="w-full text-left text-destructive flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant="default" className="hidden md:inline-flex">
                      <Link href="/sign-up">Sign up</Link>
                    </Button>
                  </div>
                )}

                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col gap-4 mt-8">
                      <Link className="text-base font-medium" href="/recipes">
                        Recipes
                      </Link>
                      <Link className="text-base font-medium" href="/preferences">
                        Dietary Preferences
                      </Link>
                      <Link className="text-base font-medium" href="/compatible-recipes">
                        Compatible Recipes
                      </Link>
                      {!authUser && (
                        <Button asChild className="mt-4" size="sm">
                          <Link href="/sign-up">Sign up</Link>
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full container py-6">
          {children}
        </div>
      </main>
    </ThemeProvider>

  );
}