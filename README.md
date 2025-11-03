# EXCEL QI Web App

A web application that serves as the frontend for the EXCEL QI project. Which aims to boost the capabilities of the EXCEL repository by  allowing them to efficiently explore and
visualize data from the repository

## Main Documentation
[Google Docs](https://docs.google.com/document/d/1DVFFSDRPC33LMscfds1c9auRf74Pf46EVr_3PAcg2nw/edit?usp=sharing)

## Dependencies 

The app is currently built using [Node.js](https://nodejs.org/en) v22.11.0

It is recommended to use nvm 
- [UNIX](https://github.com/nvm-sh/nvm) 
- [Windows](https://github.com/coreybutler/nvm-windows) 
  
to manage your versions of node.

###  Tech Stack

| Category           | Tech |
|--------------------|------|
| **Framework**      | [Next.js](https://nextjs.org/) |
| **UI Library**     | [React](https://react.dev/) |
| **Language**       | [TypeScript](https://www.typescriptlang.org/) |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/) / [DaisyUI](https://daisyui.com/) |
| **Auth**           | [NextAuth.js](https://next-auth.js.org/) |
| **Database**           | [MongoDB](https://www.mongodb.com/) |

## Getting Started

### Clone the repository
View the repository at [GitHub](https://github.com/dhuang101/excel-qi-app)
```bash
git clone https://github.com/dhuang101/excel-qi-app.git
cd excel-qi-app
```

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Setup .env.local
Create a .env.local file in the root:
```bash
ECMOPAL_API_URL = "the port which ECMO-PAL is deployed to"
DB_CONNECTION_URI = "MongoDB's connection URL"

GOOGLE_DRIVE_KEY = "The key related to the Google Cloud Service Account"
GOOGLE_DRIVE_FOLDER_ID = "The ID of the Google Drive Folder for the file-repository"

NEXTAUTH_URL = "URL for NextAuthJS"
NEXTAUTH_SECRET = "Secret for NextAuthJS"

NEXT_PUBLIC_OKTA_CLIENT_ID = "Okta's client ID made public to the frontend"
NEXT_PUBLIC_OKTA_ISSUER = "Okta's issuer URL made public to the frontend"
OKTA_CLIENT_SECRET = "the secret key for Okta"
```

### Start dev server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
Your app is now running at http://localhost:3000

## Build

To build the app simply run ```npm run build```. This will create a built version of the application which can then be launched using ```npm start```. The app will then be running on [localhost:3000](http:localhost:3000) or the UNIX equivalent address.

## File Structure
```
.
├── public/             # Static assets
├── src/
│   ├── assets/         # More static assets
│   ├── components/     # Reusable UI components
│   ├── constants/      # Reusable TS constants 
│   ├── pages/          # Next.js pages (routes)
│   ├── reducers/       # React general Reducer hook declarations
│   ├── store/          # Global store reducer declatations
│   ├── styles/         # TailwindCSS/DaisyUI dependencies
│   ├── types/          # Reusable TS Types
│   ├── utilities/      # Reusable functions
│   └── middleware.ts   # NextJS middleware function
├── .env.local          # Local environment variables
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── package.json
```

