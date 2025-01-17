# Next.js 15 + Supabase Project

This repository contains a Next.js 15 project configured with Supabase. Follow the instructions below to set up and run the project locally.

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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or suggestions.

---

Thank you for using this project! Happy coding!

