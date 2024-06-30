## Healthcare Platform RXSscope Website

## CICD Design

- Local Development with/without Docker Compose
  ```mermaid
  flowchart TB;
  B([Mock OAuth]);
  subgraph Python
     E([FastAPI])
  end;
  subgraph NextJS
     direction TB
        A([Client]);
        C([Server]);
  end;
  A <-->|1. request token| B;
  A -->|2. request with token| C;
  C <-->|3. authorize| B;
  C -->|4. claim| D[AWS]
  A <-->|"request (No Auth)"| E;
  E -->|query| F[(Postgres)]
  ```
- Cloud Deployment
  ```mermaid
  flowchart TB;
  subgraph AWS
     A[Cognito];
     B[(RDS)];
     G[Other Resources];
     subgraph NextJS ECS
        C([Client])
        D([Server])
     end
     subgraph Python ECS
        E([FastAPI])
     end
  end;
  F((User));

  F -->|1. visit| C;
  C <-->|2. login to request token| A;
  C -->|3. request with token| D & E;
  D & E <-->|4. authorize| A;
  D -->|5. claim| G;
  E -->|5. query| B;
  ```

## Environment Variables

- `.env` for running `scripts` and `npm run dev`.
- `.env.local` for running `npm run dev` locally.
- `.env.sample` specifies what you need to setup.

## Special Variables

- `NEXT_PUBLIC_ENV_NAME`
  - Deployment: `dev`
  - Local: `local-dev` (Bypass protected route)
- `NEXT_PUBLIC_COGNITO_OPENID_CONF_URI`
  - Deployment: `https://cognito-idp.{region}.amazonaws.com/{cognito_user_pool_id}/.well-known/openid-configuration`
  - Local without docker compose: `http://localhost:8001/default_issuer/.well-known/openid-configuration`
  - Local with docker compose: `http://oauth:8080/default_issuer/.well-known/openid-configuration`
- `NEXT_PUBLIC_BACKEND_BASE_URL`
  - Deployment: `https://api.service.internal:4000`
  - Local without docker compose: `http://0.0.0.0:4000`
  - Local with docker compose: `http://api:4000`
- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID` and `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`
  - Deployment: Pass by IAM
  - Local Necessary: Pass manually

## How to run?

```bash
# run NEXT server
npm run dev
# run external testing scripts
npx ts-node scripts/xxx.ts
```

### References

- https://stackoverflow.com/questions/40302349/how-to-verify-jwt-from-aws-cognito-in-the-api-backend
- https://stateful.com/blog/gmail-api-node-tutorial
- https://dev.to/scottwrobinson/using-to-the-gmail-api-with-nodejs-51kh
- https://groups.google.com/g/adwords-api/c/6WNYZYBMF2c
- https://filiphric.com/google-sign-in-with-cypress
