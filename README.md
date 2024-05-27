This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Variables

- `.env` for running `scripts` and `npm run dev`.
- `.env.local` for running `npm run dev` locally.
- `.env.sample` specifies what you need to setup.
- `.env.production` for running in Dockerfile to push to ecr.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# run external testing scripts
npx ts-node xxx.ts
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Development Environment

1. Local dev environment
   - `NEXT_PUBLIC_BACKEND_BASE_URL=http://0.0.0.0:4000`
   - In docker compose, `NEXT_PUBLIC_BACKEND_BASE_URL=http://api:4000`

### References

- https://stackoverflow.com/questions/40302349/how-to-verify-jwt-from-aws-cognito-in-the-api-backend
- https://stateful.com/blog/gmail-api-node-tutorial
- https://dev.to/scottwrobinson/using-to-the-gmail-api-with-nodejs-51kh
- https://groups.google.com/g/adwords-api/c/6WNYZYBMF2c
- https://filiphric.com/google-sign-in-with-cypress
