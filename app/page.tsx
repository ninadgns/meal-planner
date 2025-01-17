import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">MealPlanner</h1>
        <p className="text-xl text-muted-foreground">Your personal meal planning assistant</p>
      </header>

      <main>
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">Plan, Shop, and Cook with Ease</h2>
          <p className="text-lg mb-6">
            MealPlanner helps you organize your meals, create shopping lists, and discover new recipes.
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
              <CardTitle>Personalized Meal Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get custom meal plans tailored to your dietary preferences and goals.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Smart Shopping Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automatically generate shopping lists based on your meal plans.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recipe Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Explore a vast collection of recipes and add them to your meal plans with one click.</CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to simplify your meal planning?</h2>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started Now</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}

