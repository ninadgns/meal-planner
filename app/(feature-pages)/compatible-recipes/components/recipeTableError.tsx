import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface RecipesErrorStateProps {
    error: string
}

export function RecipesErrorState({ error }: RecipesErrorStateProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
        </Card>
    )
}