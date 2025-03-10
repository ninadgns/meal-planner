"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DietUser } from "../page"
import { CombinedDietStats } from "./table-container"



const chartConfig = {
    follower_count: {
        label: "Follower Count",
        color: "#60a5fa",
    },
      mobile: {
        label: "Recipe Count",
        color: "#60a5fa",
      },
} satisfies ChartConfig

export function UserToDietChart({ chartData }: { chartData: CombinedDietStats[] }) {

    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-10">
            <h2 className="text-xl font-bold mb-4">Users and recipe for each diet</h2>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] mx-auto">
                <BarChart accessibilityLayer data={chartData}>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                className="w-[150px]"
                                nameKey="views"
                            />
                        }
                    />
                    <CartesianGrid vertical={false} />
                    <Bar dataKey="follower_count" barSize={60} fill="hsl(var(--chart-1)" radius={3} />
                    <Bar dataKey="recipe_count" barSize={60} fill="hsl(var(--chart-4)" radius={3} />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        domain={[0, 'dataMax']} // Ensures it starts at 0 and adjusts dynamically
                        tickCount={5} // Adjust as needed to get integer values
                        allowDecimals={false} // Ensures only whole numbers appear
                        tickFormatter={(value) => value}
                    />

                    <XAxis
                        dataKey="diet_name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={10}
                        tickFormatter={(value) => {
                            return value;
                        }}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
