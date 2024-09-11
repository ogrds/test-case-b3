This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

The list of libraries used are:

- `redux` for state management;
- `jest` for test the components;
- `tailwindcss` for styles;
- `shadcn/ui` for designed components and default styling;

The project have the routes below:

#### Public

- `/signin`: When the user is not authenticated, he will see this route

#### Authenticated

- `/`: The home page of the application, where the user is redirect after register ou login;
- `/profile`: The page where the user can change their information like name, country, etc;

_For this test case, we don't have an API or database to save information. All the user will be saved on localStorage._
