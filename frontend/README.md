# Tech-Learn Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


#### 2. Frontend `README.md`
The default Next.js `README.md` is there—let’s tailor it to our terminal:
```markdown
# Tech-Learn Frontend

This is the frontend for the Tech-Learn project, built with Next.js, TypeScript, TailwindCSS, and `@xterm/xterm`. It provides a browser-based terminal interface with a Dracula theme, connecting to a Django backend WebSocket for a real Ubuntu terminal experience.

## Features
- **Terminal UI**: Dracula-themed terminal using `@xterm/xterm`, displaying real-time output from an Ubuntu SSH server.
- **WebSocket Connection**: Links to `ws://127.0.0.1:8000/ws/terminal/` for command execution.
- **Responsive Design**: Styled with TailwindCSS.

## Requirements
- Node.js 22.14.0
- npm 10.9.2 (or later)
- Backend running at `http://127.0.0.1:8000` (see `backend/README.md`)

## Setup Instructions
1. **Navigate to Frontend Directory**:
   ```bash
   cd ~/Tech-Learn/frontend
2. **Install Dependencies**:
   ```bash
   npm install

3. **Run Development Server**:
   ```bash
   npm run dev

Open http://localhost:3000 to see the terminal.

##Usage
  .Ensure the backend is running (daphne on port 8000).
  .Access the terminal at http://localhost:3000.
  .Run commands like ls, python3 --version, sudo apt install <package>, or edit files with nano.

##Project Structure
  .src/app/page.tsx: Main terminal component with WebSocket and xterm integration.
  .tailwind.config.ts: TailwindCSS configuration with Dracula theme.

##Next Steps
  .Enhance UI with navigation or task indicators.
  .Add user authentication integration.
  .Expand to display learning content or chatbot UI.

##Contributing
  .Fork the repo, make changes, and submit a pull request to https://github.com/BadrRibzat/Tech-Learn.

##Learn More
  .Next.js Documentation
  .TailwindCSS
  .xterm.js

