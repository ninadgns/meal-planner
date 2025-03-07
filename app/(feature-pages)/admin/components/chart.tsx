"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DietUser } from "../page"



const chartConfig = {
    follower_count: {
        label: "Follower Count",
        color: "#60a5fa",
    },
    //   mobile: {
    //     label: "Mobile",
    //     color: "#60a5fa",
    //   },
} satisfies ChartConfig

export function UserToDietChart({ chartData }: { chartData: DietUser[] }) {

    return (
        <div className="">
            <h2 className="text-xl font-bold mb-4">User to Diet Chart</h2>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-4/5 mx-auto">
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
                    <Bar dataKey="follower_count"  barSize={60} fill="hsl(var(--chart-2)" radius={3} />
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
