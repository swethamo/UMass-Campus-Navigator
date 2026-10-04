# UMass Campus Navigator

A full-stack web application that helps users explore UMass Amherst buildings, get directions, view room schedules, and ask questions about campus facilities.

## Features

- **Building search:** Search buildings by name and browse paginated results.
- **Campus directions:** Get walking, cycling, driving, or transit directions from your current location using Google Maps.
- **Building details:** Explore floors, rooms, and room types such as classrooms, laboratories, and offices.
- **Room schedules:** View stored classes and events in a calendar.
- **Saved buildings:** Sign in with Google and save frequently visited buildings.
- **AI assistant:** Ask questions about buildings, rooms, and scheduled events.

## How It Works

1. The **React frontend** displays building information, maps, calendars, and chat responses.
2. **Redux Toolkit** manages user, building, and chat state.
3. The frontend calls **Express REST APIs** to search buildings, retrieve details, and update saved buildings.
4. **MongoDB** stores user profiles and building documents containing floors, rooms, and events.
5. **Google Maps** uses browser geolocation to generate directions to a selected building.
6. For chatbot requests, the backend retrieves building data from MongoDB and includes it with the user's question in a prompt to **OpenAI GPT-4o**.

Schedules and chatbot answers use the data stored in the application.

## Tech Stack

React · TypeScript · Redux Toolkit · Material UI · Node.js · Express · MongoDB · Google Maps API · OpenAI API · FullCalendar · Vite

## Project Structure

- **`frontend/`** — User interface, navigation, maps, calendars, and state management.
- **`backend/`** — REST APIs, database connection, and AI assistant integration.
- **`models/`** — Shared TypeScript data models.
- **`database/`** — JSON exports of building and user data.

## Running Locally

1. Install dependencies with `npm install` in both `frontend/` and `backend/`.
2. Configure MongoDB and OpenAI credentials in `backend/environment.ts`, and Google OAuth and Maps settings in `frontend/src/environment.ts`.
3. Import the provided JSON data into the `campus_navigator` MongoDB database.
4. Run `npm start` in each directory.

Frontend: `http://localhost:3000`  
Backend: `http://localhost:8000`
