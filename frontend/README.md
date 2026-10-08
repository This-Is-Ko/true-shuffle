# Spotify True Shuffle - Frontend

This package is the React frontend for **True Shuffle**. It provides the user interface for shuffling Spotify playlists and exploring your music library.

For an overview of the project, its features and the full technology stack, see the [root README](../README.md). For the API, see the [backend README](../backend/README.md).

## Technology Stack

This frontend application is built with:

- **React 18.2.0** - Core framework
- **Material-UI (MUI)** - Component library for the user interface
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Nivo Charts** - Data visualisation for analysis features
- **ApexCharts** - Additional charting capabilities
- **React Helmet** - SEO and meta tag management
- **React Virtuoso** - Virtualised lists for performance with large playlists

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (22 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)

## Getting Started

To get the frontend up and running locally:

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Set up environment variables:

    Create a `.env` file in the root directory based on `sampleEnv.txt`. You'll need to configure:
    - `REACT_APP_BACKEND_PATH` - Backend API endpoint
    - `REACT_APP_SPOTIFY_AUTH_URI` - Spotify OAuth authorization URI
    - `REACT_APP_CONTACT_EMAIL_ADDRESS` - Contact email for support
    - `REACT_APP_SHOW_GLOBAL_MESSAGE` - Optional global message display
    - `REACT_APP_GLOBAL_MESSAGE_CONTENT` - Content for global message
    - `REACT_APP_ENABLE_FILTER_SHUFFLE` - Feature flag for filtered shuffle

3. Run the development server:

    ```bash
    npm start
    ```

    This will start the app and you should be able to view it in your browser at http://localhost:3000.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Project Structure

The application is organised into the following main directories:

- `src/pages/` - Main page components (ShufflePage, AnalysisPage, ShareLikedTracksPage, FAQPage, AboutPage)
- `src/components/` - Reusable UI components and page-specific component containers
- `src/features/` - Feature-specific modules (shuffle, analysis, admin, common) with components, services, and state management
- `src/contexts/` - React context providers
- `src/utils/` - Utility functions for authentication, formatting, and API services
- `public/` - Static assets including images, icons, and the HTML template
