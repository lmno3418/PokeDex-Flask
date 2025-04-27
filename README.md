# Pokedex Flask App

This project is a showcase of my Python Flask framework skills, featuring an interactive web-based Pokedex with advanced filtering capabilities and a modern, responsive UI design.

## Project Overview

The Pokedex Flask App is a comprehensive web application that allows users to search and filter Pokémon with an intuitive interface. The application provides detailed information about each Pokémon, including stats, types, generation, and more.

## Features

- **Advanced Search & Filtering System**:
  - Search Pokémon by name
  - Filter by Type 1 and Type 2
  - Filter by Generation
  - Filter by Legendary status
  - Range-based filtering for HP, Attack, and Speed stats
  - Sorting options (ID, Name, HP, Attack, Defense, Speed)
- **Modern UI/UX**:
  - Responsive design for all devices
  - Animated components and transitions
  - Collapsible filter panels
  - Active filter tags display
  - Real-time filtering and sorting
  - Type-specific color coding
- **Detailed Pokémon Information**:
  - High-quality sprite images
  - Comprehensive stats display
  - Type badges with appropriate colors
  - Generation and legendary status information
- **RESTful API**: Backend endpoints to fetch and filter Pokémon data

## Project Structure

```
pokedex-flask/
├── app.py                     # Main Flask application
├── README.md                  # Project documentation
├── requirements.txt           # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css          # Styles for the app
│   ├── data/
│   │   └── PokemonData.json   # Pokémon data in JSON format
│   └── js/
│       └── app.js             # JavaScript for frontend interactivity
├── templates/
│   └── index.html             # HTML template for the app
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pokedex-flask.git
   cd pokedex-flask
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to `http://127.0.0.1:5000`.

## Usage Guide

1. **Basic Search**: Type a Pokémon name in the search box to filter results in real-time.

2. **Using Filters**:
   - Click the "Filters" button to expand the filtering options
   - Select Type 1, Type 2, Generation, or Legendary status from dropdown menus
   - Enter min/max values for HP, Attack, or Speed to filter by stat ranges
   - Use the Sort By dropdown to organize results

3. **Active Filters**:
   - View your currently applied filters as tags below the filter section
   - Click the 'x' on any filter tag to remove that filter
   - Use the "Reset" button to clear all filters at once

4. **Viewing Pokémon Details**:
   - Click on any Pokémon card to display its detailed information in the right panel
   - The selected Pokémon will be highlighted in the list

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Font Awesome
- **Backend**: Python, Flask
- **Data**: JSON, CSV for Pokémon information storage
- **Styling**: Custom CSS with animations and responsive design

## Future Plans

- **Additional Filtering Options**: Add more stat filters and combination options
- **Favorites System**: Allow users to save their favorite Pokémon
- **Team Builder**: Create a tool to build and analyze Pokémon teams
- **Compare Feature**: Side-by-side comparison of multiple Pokémon

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions and improvements.

## License

This project is licensed under the CC BY 4.0 License. See the `LICENSE` file for details.