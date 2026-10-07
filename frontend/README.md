# Spotify True Shuffle - Frontend

Spotify's built-in shuffle can sometimes feel repetitive and predictable, pushing certain tracks more frequently than others. **True Shuffle** aims to provide a better shuffle experience by creating custom playlists with a truly randomised order of tracks.

This repository contains the frontend for the **Spotify True Shuffle** project, built with React. It allows users to shuffle their playlists on Spotify in a way that enhances the randomness of track order, providing a more enjoyable listening experience.

For the backend of the project, check out the [backend repository here](https://github.com/This-Is-Ko/spotify-true-shuffle).

## Features

- **Truly Random Shuffle**: Generate custom playlists with a fully randomised track order. Select any of your Spotify playlists or your Liked Songs to create a shuffled copy that preserves your original playlist.
- **Custom Playlist Management**: Keep your original playlist intact while creating a shuffled copy that you can delete anytime. Previous shuffled playlists are automatically replaced to prevent duplicates.
- **Library Analysis**: Analyse your Liked Songs library to discover insights about your music taste. View statistics including top artists, top albums, track length distributions, and audio features analysis with interactive visualisations.
- **Share Liked Songs**: Create a shareable playlist from your Liked Songs collection, making it easy to share your music library with others.
- **User-Friendly Interface**: A simple and intuitive React app built with Material-UI components to manage your shuffle experience and explore your music library.

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

To get the project up and running locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/This-Is-Ko/spotify-true-shuffle-frontend.git
    ```

2. Navigate to the project folder:

    ```bash
    cd spotify-true-shuffle-frontend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory based on `sampleEnv.txt`. You'll need to configure:
    - `REACT_APP_BACKEND_PATH` - Backend API endpoint
    - `REACT_APP_SPOTIFY_AUTH_URI` - Spotify OAuth authorization URI
    - `REACT_APP_CONTACT_EMAIL_ADDRESS` - Contact email for support
    - `REACT_APP_SHOW_GLOBAL_MESSAGE` - Optional global message display
    - `REACT_APP_GLOBAL_MESSAGE_CONTENT` - Content for global message
    - `REACT_APP_ENABLE_FILTER_SHUFFLE` - Feature flag for filtered shuffle

5. Run the development server:

    ```bash
    npm start
    ```

    This will start the app and you should be able to view it in your browser at http://localhost:3000.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Project Structure

The application is organised into the following main directories:

- `src/pages/` - Main page components (ShufflePage, AnalysisPage, ShareLikedTracksPage, FAQPage, AboutPage)
- `src/components/` - Reusable UI components and page-specific component containers
- `src/features/` - Feature-specific modules (shuffle, analysis) with components, services, and state management
- `src/utils/` - Utility functions for authentication, formatting, and API services
- `public/` - Static assets including images, icons, and the HTML template

## Deployment

This project is set up for automatic deployment of commits to the main branch using Vercel. 
