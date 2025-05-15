# Netflix Clone

A Netflix clone built with Next.js and Material UI with Material 3 Expressive design, using the TVMaze API for content.

## Features

- 📺 Browse TV shows and movies from TVMaze API
- 🎬 Watch trailers and videos (demo mode with sample content)
- 📱 Responsive design that works on mobile and desktop
- 🌙 Dark theme inspired by Netflix's UI
- 🎨 Material 3 Expressive design implementation

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Material UI with Material 3 Expressive theme
- TVMaze API for content data
- React Player for video playback
- Axios for API requests

## System Requirements

- Node.js 18.18.0 or later
- npm 9.0.0 or later

> **Note:** This project requires Node.js version 18.18.0 or higher. If you're using an older version, you'll need to upgrade.

## Getting Started

### Checking Node.js Version

First, check your Node.js version:

```bash
node -v
```

If your version is below 18.18.0, you'll need to upgrade using NVM (Node Version Manager) or download the installer from the [official Node.js website](https://nodejs.org).

### Using NVM to upgrade Node.js

```bash
# Install NVM if you don't have it already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js 18
nvm install 18

# Use Node.js 18
nvm use 18
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable components
  - `layout`: Layout components (NavBar)
  - `shows`: Show-related components (ShowsCarousel, VideoPlayer)
  - `ui`: UI components (HeroSection)
- `src/services`: API services and data interfaces

## API Integration

This project uses the TVMaze API to fetch TV show information. The implementation can be found in `src/services/tvmaze-api.ts`.

## Acknowledgements

- [Next.js](https://nextjs.org) - The React framework
- [Material UI](https://mui.com) - UI component library
- [TVMaze API](https://www.tvmaze.com/api) - TV show data API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
