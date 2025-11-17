# Route Cost Calculator

A Flask-based web application that calculates the estimated fuel cost for a trip. It uses the **Google Maps API** to determine the precise distance between two locations and computes the cost based on the user's vehicle consumption and current fuel prices.

## Features

* **Route Visualization:** Renders the driving route on an interactive Google Map.
* **Autocomplete:** Uses Google Places Autocomplete for easy selection of Origin and Destination.
* **Cost Calculation:** Automatically calculates total trip cost based on:
    * Real-time distance (via Google Directions API).
    * Fuel Price ($/liter).
    * Vehicle Consumption (km/liter).
* **Responsive Design:** Simple and clean interface.

## Tech Stack

* **Backend:** Python 3, Flask
* **Frontend:** HTML5, CSS3, JavaScript
* **APIs:** Google Maps Platform
    * *Maps JavaScript API* (for the map display)
    * *Places API* (for autocomplete)
    * *Directions API* (for route and distance data)

## Prerequisites

Before running this project, ensure you have the following:

* Python 3.x installed.
* A Google Cloud Platform account with a valid **API Key**.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JonasFranc1sco/calculated.git
    cd calculated
    ```

2.  **Create a virtual environment (Optional but recommended):**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install Flask dotenv googlemaps
    ```

## Configuration

1.  **Get a Google Maps API Key:**
    * Go to the [Google Cloud Console](https://console.cloud.google.com/).
    * Create a project and generate an API Key.
    * **Enable the following APIs:**
        * Maps JavaScript API
        * Places API (New)
        * Directions API

2.  **Set up Environment Variables:**
    Create a `.env` file in the root directory of the project:
    ```bash
    touch .env
    ```

    Add your API Key to the file 'app.py':
    ```env
    API_KEY=your_api_key_here
    ```

    > **Note:** Never commit your `.env` file to GitHub.

3.  **Update HTML Script:**
    Ensure your `index.html` restricts the API key usage or uses the environment logic if you are using a template engine to inject it securely.

## Usage

1.  **Run the application:**
    ```bash
    flask --app app run
    ```

2.  **Access the App:**
    Open your browser and navigate to:
    `http://127.0.0.1:5000`

3.  **Calculate a Route:**
    * Type the **Starting point** (select from the dropdown).
    * Type the **Destination point** (select from the dropdown).
    * Enter the **Fuel Price** (e.g., 5.50).
    * Enter the **Vehicle Consumption** (e.g., 12 km/l).
    * Click **Calculate**.
