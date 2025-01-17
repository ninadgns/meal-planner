"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  dietaryPreferences: z.array(z.string()).optional(),
})

export default function UserPreferencesForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const dietaryOptions = [
    { value: "vegan", label: "Vegan" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paleo" },
    { value: "gluten-free", label: "Gluten-free" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Set your date of birth and dietary preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Dietary Preferences</FormLabel>
                    <FormDescription>
                      Select all that apply to your diet.
                    </FormDescription>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {dietaryOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="dietaryPreferences"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.value}>
                              <FormControl>
                                <Toggle
                                  variant="outline"
                                  pressed={field.value?.includes(option.value)}
                                  onPressedChange={(pressed) => {
                                    return pressed
                                      ? field.onChange([...field.value || [], option.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.value
                                          )
                                        )
                                  }}
                                  className={cn(
                                    "data-[state=on]:bg-green-500 data-[state=on]:text-primary-foreground",
                                    "transition-colors duration-200"
                                  )}
                                >
                                  {option.label}
                                </Toggle>
                              </FormControl>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

