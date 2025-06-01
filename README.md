# Ship Routing Application

A web-based ship routing application that uses A* algorithm to calculate optimal maritime routes and displays them on an interactive map.

## Features

- Interactive port selection with autocomplete
- Ship type and cargo type selection
- Custom routing parameters with weight adjustments
- Route visualization on an interactive map
- Multiple avoidance options (Suez Canal, Panama Canal, piracy zones)
- Route results with distance, time, and waypoint information
- Export route data to CSV

## Tech Stack

- **Frontend**: React, Tailwind CSS, LeafletJS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Algorithms**: A* pathfinding for optimal routes

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v13+)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
   ```
   createdb shiprouting
   ```

2. Run schema and seed scripts:
   ```
   psql -d shiprouting -f database/schema.sql
   psql -d shiprouting -f database/seed-data.sql
   ```

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file (see .env.example)

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Usage

1. Select a start port and destination port using the autocomplete fields
2. Choose a ship type based on your vessel characteristics
3. Select a cargo type (note that some combinations may have restrictions)
4. Adjust routing parameters if desired:
   - Distance vs. Time weights
   - Risk avoidance levels
   - Canal avoidance options
5. Click "Calculate Route" to generate the optimal path
6. View the route on the map and examine detailed results in the panel
7. Export the route data to CSV if needed

## License

MIT
