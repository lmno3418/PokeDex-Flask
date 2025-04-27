document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("search-box");
  const pokelist = document.getElementById("pokelist");
  const pokeResultCard = document.getElementById("poke-result-card");
  const filterToggle = document.getElementById("filter-toggle");
  const filterContainer = document.getElementById("filter-container");
  const filterChevron = document.getElementById("filter-chevron");
  const resetFiltersBtn = document.getElementById("reset-filters");
  const activeFiltersContainer = document.getElementById("active-filters");

  let allPokemons = [];
  let selectedPokemon = null;
  let currentFilters = {};
  let searchTerm = "";
  let sortOption = "id";

  // Fetch all Pokemons on page load
  fetchPokemons();

  // Add event listener for search
  searchBox.addEventListener("input", function (event) {
    searchTerm = event.target.value.trim().toLowerCase();
    applyFiltersAndSearch();
  });

  // Toggle filter container
  filterToggle.addEventListener("click", function () {
    filterContainer.classList.toggle("active");
    filterChevron.classList.toggle("fa-chevron-down");
    filterChevron.classList.toggle("fa-chevron-up");
  });

  // Reset filters
  resetFiltersBtn.addEventListener("click", resetFilters);

  function fetchPokemons() {
    showLoading();

    fetch("/api/pokemon")
      .then((response) => response.json())
      .then((data) => {
        allPokemons = data;
        hideLoading();
        renderPokemonList(allPokemons);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
        hideLoading();
        pokelist.innerHTML =
          '<h2 class="no-pokemon">Error loading Pokemon data!</h2>';
      });
  }

  function showLoading() {
    pokelist.innerHTML = `
      <div class="loading">
        <div class="pokeball"></div>
      </div>
    `;
  }

  function hideLoading() {
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  function sortPokemons(pokemons) {
    return [...pokemons].sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "hp":
          return b.hp - a.hp;
        case "attack":
          return b.attack - a.attack;
        case "defense":
          return b.defense - a.defense;
        case "speed":
          return b.speed - a.speed;
        default: // id
          return a.id - b.id;
      }
    });
  }

  function renderPokemonList(pokemons) {
    if (pokemons.length === 0) {
      pokelist.innerHTML = '<h2 class="no-pokemon">No pokemon found!</h2>';
      return;
    }

    pokelist.innerHTML = "";

    // Sort pokemons
    const sortedPokemons = sortPokemons(pokemons);

    sortedPokemons.forEach((pokemon) => {
      if (!pokemon.name) return;

      const pokeCard = document.createElement("div");
      pokeCard.className = "pokecard";
      if (selectedPokemon && selectedPokemon.id === pokemon.id) {
        pokeCard.classList.add("selected");
      }
      pokeCard.addEventListener("click", () => handlePokemonClick(pokemon));

      // Parse the sprites JSON string if it's a string
      let sprites;
      if (typeof pokemon.sprites === "string") {
        try {
          sprites = JSON.parse(pokemon.sprites);
        } catch (e) {
          sprites = { normal: "", animated: "" };
        }
      } else {
        sprites = pokemon.sprites;
      }

      const spriteUrl = sprites.normal || "";

      pokeCard.innerHTML = `
                <img src="${spriteUrl}" alt="${pokemon.name}" class="pokemon">
                <p>${pokemon.name}</p>
            `;

      pokelist.appendChild(pokeCard);
    });
  }

  function handlePokemonClick(pokemon) {
    selectedPokemon = pokemon;
    renderPokemonDetails();

    // Update selected state in the list
    document.querySelectorAll(".pokecard").forEach((card) => {
      card.classList.remove("selected");
    });

    // Find and select the current card
    const cards = document.querySelectorAll(".pokecard");
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].querySelector("p").textContent === pokemon.name) {
        cards[i].classList.add("selected");
        break;
      }
    }
  }

  function renderPokemonDetails() {
    if (!selectedPokemon) {
      pokeResultCard.innerHTML = `
                <h2>Welcome to the Pokedex</h2>
                <p class="info-text">Select a Pokémon to view details</p>
            `;
      return;
    }

    // Parse the sprites JSON string if it's a string
    let sprites;
    if (typeof selectedPokemon.sprites === "string") {
      try {
        sprites = JSON.parse(selectedPokemon.sprites);
      } catch (e) {
        sprites = { normal: "", animated: "" };
      }
    } else {
      sprites = selectedPokemon.sprites;
    }

    const spriteUrl = sprites.animated || sprites.normal || "";
    const type2Display = selectedPokemon.type2 ? selectedPokemon.type2 : "None";
    const legendaryStatus = selectedPokemon.legendary ? "Yes" : "No";

    pokeResultCard.innerHTML = `
            <img src="${spriteUrl}" alt="${
      selectedPokemon.name
    }" class="pokemon-animated-sprite">
            <div class="pokemon-details">
                <p><strong>Name:</strong> ${selectedPokemon.name}</p>
                <p><strong>ID:</strong> #${String(selectedPokemon.id).padStart(
                  3,
                  "0"
                )}</p>
                <p><strong>Height:</strong> ${selectedPokemon.height} m</p>
                <p><strong>Weight:</strong> ${selectedPokemon.weight} kg</p>
                <p><strong>Base XP:</strong> ${
                  selectedPokemon.base_experience
                }</p>
                <p><strong>Type 1:</strong> <span class="type-badge type-${selectedPokemon.type1.toLowerCase()}">${
      selectedPokemon.type1
    }</span></p>
                <p><strong>Type 2:</strong> ${
                  selectedPokemon.type2
                    ? `<span class="type-badge type-${selectedPokemon.type2.toLowerCase()}">${
                        selectedPokemon.type2
                      }</span>`
                    : "None"
                }</p>
                <p><strong>HP:</strong> ${selectedPokemon.hp}</p>
                <p><strong>Attack:</strong> ${selectedPokemon.attack}</p>
                <p><strong>Defense:</strong> ${selectedPokemon.defense}</p>
                <p><strong>Special Attack:</strong> ${
                  selectedPokemon.sp_atk
                }</p>
                <p><strong>Special Defense:</strong> ${
                  selectedPokemon.sp_def
                }</p>
                <p><strong>Speed:</strong> ${selectedPokemon.speed}</p>
                <p><strong>Generation:</strong> ${
                  selectedPokemon.generation
                }</p>
                <p><strong>Legendary:</strong> ${legendaryStatus}</p>
            </div>
        `;
  }

  // Set up filter input events
  const filterInputs = document.querySelectorAll(".filter-input");

  filterInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (input.id === "filter-sort") {
        sortOption = input.value;
      } else {
        updateFilters();
      }
      applyFiltersAndSearch();
    });
  });

  // Range inputs
  const rangeInputs = document.querySelectorAll(".range-min, .range-max");
  rangeInputs.forEach((input) => {
    input.addEventListener("input", function () {
      updateFilters();
      applyFiltersAndSearch();
    });
  });

  function updateFilters() {
    currentFilters = {};

    // Extract standard filters
    const standardFilters = ["type1", "type2", "generation", "legendary"];
    standardFilters.forEach((filter) => {
      const input = document.getElementById(`filter-${filter}`);
      if (input && input.value.trim() !== "") {
        currentFilters[filter] = input.value.trim();
      }
    });

    // Extract range filters
    const rangeFilters = ["hp", "attack", "speed"];
    rangeFilters.forEach((filter) => {
      const minInput = document.getElementById(`filter-${filter}-min`);
      const maxInput = document.getElementById(`filter-${filter}-max`);

      if (minInput && minInput.value.trim() !== "") {
        currentFilters[`${filter}_min`] = parseInt(minInput.value.trim());
      }

      if (maxInput && maxInput.value.trim() !== "") {
        currentFilters[`${filter}_max`] = parseInt(maxInput.value.trim());
      }
    });

    renderActiveFilters();
  }

  function renderActiveFilters() {
    activeFiltersContainer.innerHTML = "";

    Object.entries(currentFilters).forEach(([key, value]) => {
      const filterTag = document.createElement("div");
      filterTag.className = "active-filter-tag";

      let displayName = key
        .replace("_", " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      if (key === "type1") displayName = "Type 1";
      if (key === "type2") displayName = "Type 2";
      if (key === "hp_min") displayName = "Min HP";
      if (key === "hp_max") displayName = "Max HP";
      if (key === "attack_min") displayName = "Min Attack";
      if (key === "attack_max") displayName = "Max Attack";
      if (key === "speed_min") displayName = "Min Speed";
      if (key === "speed_max") displayName = "Max Speed";

      filterTag.innerHTML = `
        ${displayName}: ${value}
        <i class="fas fa-times" data-filter="${key}"></i>
      `;

      activeFiltersContainer.appendChild(filterTag);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".active-filter-tag i").forEach((removeBtn) => {
      removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const filterKey = this.getAttribute("data-filter");

        // Clear the corresponding input
        if (filterKey.includes("_min") || filterKey.includes("_max")) {
          const inputId = `filter-${filterKey}`;
          document.getElementById(inputId).value = "";
        } else {
          document.getElementById(`filter-${filterKey}`).value = "";
        }

        // Remove from current filters
        delete currentFilters[filterKey];
        renderActiveFilters();
        applyFiltersAndSearch();
      });
    });
  }

  function resetFilters() {
    // Reset all filter inputs
    filterInputs.forEach((input) => {
      input.value = "";
    });

    // Reset range inputs
    rangeInputs.forEach((input) => {
      input.value = "";
    });

    // Reset sort option
    document.getElementById("filter-sort").value = "id";
    sortOption = "id";

    // Clear current filters
    currentFilters = {};
    renderActiveFilters();

    // Apply reset
    searchBox.value = "";
    searchTerm = "";
    applyFiltersAndSearch();
  }

  function applyFiltersAndSearch() {
    const filteredPokemons = filterPokemons(allPokemons);
    renderPokemonList(filteredPokemons);
  }

  function filterPokemons(pokemons) {
    return pokemons.filter((pokemon) => {
      // Apply search
      if (searchTerm && !pokemon.name.toLowerCase().includes(searchTerm)) {
        return false;
      }

      // Apply standard filters
      for (const [key, value] of Object.entries(currentFilters)) {
        // Skip range filters
        if (key.includes("_min") || key.includes("_max")) continue;

        if (key === "legendary") {
          // Handle boolean values
          const boolValue = value === "true";
          if (pokemon[key] !== boolValue) return false;
        } else if (
          pokemon[key]?.toString().toLowerCase() !== value.toLowerCase()
        ) {
          return false;
        }
      }

      // Apply range filters
      const rangeFilters = {
        hp: ["hp_min", "hp_max"],
        attack: ["attack_min", "attack_max"],
        speed: ["speed_min", "speed_max"],
      };

      for (const [stat, [minKey, maxKey]] of Object.entries(rangeFilters)) {
        const min = currentFilters[minKey];
        const max = currentFilters[maxKey];

        if (min !== undefined && pokemon[stat] < min) return false;
        if (max !== undefined && pokemon[stat] > max) return false;
      }

      return true;
    });
  }
});
