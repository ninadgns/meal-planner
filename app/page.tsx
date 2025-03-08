import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">NutriCulinary</h1>
        <p className="text-xl text-muted-foreground">Discover recipes that fit your lifestyle</p>
      </header>

      <main>
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">Find Recipes Tailored to You</h2>
          <p className="text-lg mb-6">
            NutriCulinary helps you explore a vast collection of recipes based on your dietary needs and preferences.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recipe Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get recipes based on your dietary preferences and nutritional goals.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Filter by Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Find recipes based on the ingredients you have at home.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Save Your Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Save your Preferences to view only the Recipes that are compatible with you</CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to explore new recipes?</h2>
          <Button size="lg" asChild>
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
