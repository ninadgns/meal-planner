# NutriCulinary - Personalized Meal Planning Platform

NutriCulinary is a comprehensive meal planning web application that helps users discover recipes tailored to their dietary preferences, nutritional goals, and available ingredients.

## Features

- **Personalized Recipe Suggestions**: Get recipe recommendations based on your dietary preferences and nutritional goals
- **Ingredient-Based Recipe Search**: Find recipes using ingredients you already have at home
- **User Preference Management**: Save your dietary preferences for personalized recipe recommendations
- **Recipe Browser**: Explore our collection of recipes with detailed instructions and nutritional information
- **Admin Dashboard**: Manage recipes, ingredients, and dietary categories (admin access only)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui component library
- **Authentication**: Supabase Authentication
- **Database**: Supabase Database
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [pnpm](https://pnpm.io/) (version 8 or later recommended)
- [Git](https://git-scm.com/)

## Installation

1. **Install Dependencies**

   Install the required packages using `pnpm`:

   ```bash
   pnpm install
   ```

2. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory of the project and add the following environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

   Replace `<your-supabase-url>` and `<your-supabase-anon-key>` with your Supabase project details. You can find these in the [Supabase dashboard](https://supabase.com/).

## Running the Project Locally

1. **Start the Development Server**

   Run the development server:

   ```bash
   pnpm dev
   ```

2. **Access the Application**

   Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

## Build for Production

To create a production-ready build:

```bash
pnpm build
```

To preview the production build:

```bash
pnpm start
```

## Project Structure

- `/app`: Next.js app directory containing page components and routes
  - `/(admin-pages)`: Admin dashboard pages
  - `/(auth-pages)`: Authentication pages (sign-in, sign-up)
  - `/(feature-pages)`: Main feature pages (recipes, preferences)
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared logic
- `/utils`: Helper functions and type definitions
- `/hooks`: Custom React hooks

## Features in Detail

### Recipe Discovery
Users can browse recipes by categories, dietary restrictions, or search by specific ingredients they have available.

### Personalized Recommendations
After creating an account and setting preferences, users receive personalized recipe suggestions that match their dietary needs and preferences.

### Preference Management
Users can specify dietary restrictions, allergies, and preferred cuisines to receive more relevant recommendations.

### Admin Panel
Administrators can manage recipes, ingredients, and dietary categories, can see statistical views through a dedicated admin interface.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or suggestions.

## License

This project is licensed under the MIT License.

---

Thank you for using NutriCulinary! Happy meal planning!

