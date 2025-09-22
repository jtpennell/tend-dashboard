# Tend Dashboard

A clean executive dashboard for monitoring clinical wait times across multiple locations.

## Setup

1. Clone the repository:
   git clone https://github.com/jtpennell/tend-dashboard.git
2. Copy `.env.example` to `.env.local`
3. Add your API key to the `API_KEY` environment variable
4. Run the development server 
   yarn
   yarn dev

## Environment Variables

- `API_KEY` - Required API key for accessing the clinical wait times endpoint

## Features

- Real-time wait time monitoring
- Auto-refresh every 60 seconds
- Color-coded status indicators
- Summary statistics
- Responsive design
- Fallback to demo data when API is unavailable
- Enhanced patient statistics display
- Professional executive-friendly interface

## API Integration

The dashboard connects to the Tend clinical wait times API using the `x-api-key` header for authentication. When the API key is not configured or the API is unavailable, the dashboard automatically falls back to demo data to ensure continuous operation.

## AI Use
This webapp was bootstrapped via v0 by Vercel and edited with the help of Github Copilot.