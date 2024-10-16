# Blockchain Price Tracker

This project is a blockchain price tracking system built using Nest.js. It fetches the latest prices of Ethereum and Polygon, stores them in a PostgreSQL database, and provides APIs for setting alerts, getting price histories, and swapping rates between cryptocurrencies. The project also includes email alerts when certain conditions are met, such as price alerts set by users.

## Features

- **Track Prices**: Periodically fetches Ethereum and Polygon prices from the CoinGecko API every 5 minutes.
- **Price Alerts**: Users can set price alerts for specific thresholds. An email is sent when the tracked cryptocurrency reaches the specified price.
- **Price History**: Provides an API to retrieve hourly prices for the last 24 hours.
- **Swap Rate**: Calculates swap rates between Ethereum (ETH) and Bitcoin (BTC).
- **Email Notifications**: Sends notifications when price changes exceed thresholds (e.g., a 3% change within an hour) or when user-defined alerts are triggered.

## Technologies Used

- **Backend Framework**: [Nest.js](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Scheduler**: Nest.js Cron Jobs
- **Email Service**: Nodemailer (for sending alert emails)
- **APIs**: CoinGecko API for fetching cryptocurrency prices
- **Containerization**: Docker

## Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or above)
- [Docker](https://www.docker.com/) (for PostgreSQL and Docker Compose)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shashank9694/blockchain-price-tracker.git
   cd blockchain-price-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root of the project and add your environment variables (for database connection, email service, etc.)(right now db config will be static ):

   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your-db-user
   DATABASE_PASSWORD=your-db-password
   DATABASE_NAME=prices
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   ```

4. **Run PostgreSQL using Docker:**

   If you're using Docker, you can use Docker Compose to quickly set up the PostgreSQL instance:

   ```bash
   docker-compose up -d
   ```

   This will spin up a PostgreSQL container with the appropriate configuration.

5. **Run the application:**

   ```bash
   npm run start
   ```

   The application will start on `http://localhost:3000`.

6. **Database Synchronization:**

   The application uses TypeORM to sync the entities with your database. The entities for prices and alerts will be automatically created.

## API Endpoints

### 1. **Set a Price Alert**

   Set an alert for a specific cryptocurrency price.

   - **Endpoint**: `POST /prices/set-alert`
   - **Body**:
     ```json
     {
       "chain": "ethereum",
       "price": 1000,
       "email": "user@example.com"
     }
     ```

   - **Response**:
     ```json
     {
       "message": "Alert set for ethereum at $1000"
     }
     ```

### 2. **Get Hourly Prices**

   Fetch hourly prices for Ethereum and Polygon for the last 24 hours.

   - **Endpoint**: `GET /prices/hourly`
   - **Response**:
     ```json
     [
       {
         "chain": "ethereum",
         "price": 1200,
         "timestamp": "2024-10-16T05:00:00.000Z"
       },
       {
         "chain": "polygon",
         "price": 1.2,
         "timestamp": "2024-10-16T05:00:00.000Z"
       }
     ]
     ```

### 3. **Get Swap Rate**

   Get the swap rate from Ethereum (ETH) to Bitcoin (BTC).

   - **Endpoint**: `POST /prices/swap-rate`
   - **Body**:
     ```json
     {
       "ethAmount": 1
     }
     ```

   - **Response**:
     ```json
     {
       "btcAmount": 0.03,
       "fee": {
         "eth": 0.03,
         "usd": 36
       }
     }
     ```

## Project Structure

```
src/
 ├── alerts/
 │   └── entities/
 │       └── alert.entity.ts  # Alert entity for storing user-defined price alerts
 ├── common/
 │   └── email.service.ts      # Email service for sending alerts
 ├── prices/
 │   ├── entities/
 │   │   └── price.entity.ts   # Price entity for storing fetched prices
 │   ├── prices.controller.ts  # Controller for price-related endpoints
 │   └── prices.service.ts     # Service for fetching prices and handling alerts
 └── app.module.ts             # Main application module
```

## Cron Jobs

The application uses cron jobs to fetch Ethereum and Polygon prices every 5 minutes and store them in the database.

- **Job Schedule**: `*/5 * * * *` (every 5 minutes)
- **Functionality**:
  - Fetch prices from the CoinGecko API.
  - Check if price alerts need to be triggered.
  - Send email notifications when necessary.

## Running with Docker

If you prefer to run the entire application (including PostgreSQL) using Docker, use the following commands:

1. **Build and run the Docker containers:**

   ```bash
   docker-compose up --build
   ```

   This will build the application and run it inside a container along with PostgreSQL.

2. **Access the application:**

   The application will be accessible on `http://localhost:3000/api`.



