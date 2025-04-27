from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Load Pokemon data
with open(
    "static/data/PokemonData.json", "r"
) as f:
    pokemon_data = json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/pokemon")
def get_pokemon():
    search_query = request.args.get("search", "").lower()

    # Standard filters
    filters = {
        "height": request.args.get("height"),
        "weight": request.args.get("weight"),
        "base_experience": request.args.get("base_experience"),
        "type1": request.args.get("type1"),
        "type2": request.args.get("type2"),
        "generation": request.args.get("generation"),
        "legendary": request.args.get("legendary"),
    }

    # Range filters
    range_filters = {
        "hp": {
            "min": request.args.get("hp_min"),
            "max": request.args.get("hp_max"),
        },
        "attack": {
            "min": request.args.get("attack_min"),
            "max": request.args.get("attack_max"),
        },
        "defense": {
            "min": request.args.get("defense_min"),
            "max": request.args.get("defense_max"),
        },
        "sp_atk": {
            "min": request.args.get("sp_atk_min"),
            "max": request.args.get("sp_atk_max"),
        },
        "sp_def": {
            "min": request.args.get("sp_def_min"),
            "max": request.args.get("sp_def_max"),
        },
        "speed": {
            "min": request.args.get("speed_min"),
            "max": request.args.get("speed_max"),
        },
    }

    def matches_filters(pokemon):
        # Check standard filters
        for key, value in filters.items():
            if value is not None and value != "":
                if key == "legendary":
                    # Handle boolean values
                    pokemon_value = pokemon.get(key, False)
                    filter_value = value.lower() == "true"
                    if pokemon_value != filter_value:
                        return False
                # Handle null/None type2
                elif key == "type2" and value.lower() == "none":
                    if (
                        pokemon.get(key, None) is not None
                        and pokemon.get(key, "") != ""
                    ):
                        return False
                elif str(pokemon.get(key, "")).lower() != value.lower():
                    return False

        # Check range filters
        for stat, range_values in range_filters.items():
            min_val = range_values["min"]
            max_val = range_values["max"]

            if min_val is not None and min_val != "":
                try:
                    if int(pokemon.get(stat, 0)) < int(min_val):
                        return False
                except ValueError:
                    pass

            if max_val is not None and max_val != "":
                try:
                    if int(pokemon.get(stat, 0)) > int(max_val):
                        return False
                except ValueError:
                    pass

        return True

    if search_query:
        filtered_pokemon = [
            pokemon
            for pokemon in pokemon_data
            if search_query in pokemon.get("name", "").lower()
            and matches_filters(pokemon)
        ]
    else:
        filtered_pokemon = [
            pokemon for pokemon in pokemon_data if matches_filters(pokemon)
        ]

    return jsonify(filtered_pokemon)


@app.route("/api/pokemon/<pokemon_id>")
def get_pokemon_by_id(pokemon_id):
    for pokemon in pokemon_data:
        if pokemon.get("id") == pokemon_id:
            return jsonify(pokemon)

    return jsonify({"error": "Pokemon not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
