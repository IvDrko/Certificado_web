const container = document.getElementById('cocktailContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

let masterDrinksList = []; // Guardará TODOS los cócteles cargados al inicio
let allDrinks = [];        // Lista actual para mostrar (filtrada o favoritos)

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

let showingFavorites = false;


function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(id) {
  return favorites.includes(id);
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  saveFavorites();
  displayCocktails(allDrinks); // Actualiza visual
}


// Carga las categorías
async function loadCategories() {
  try {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const data = await res.json();
    data.drinks.forEach(drink => {
      const option = document.createElement('option');
      option.value = drink.strCategory;
      option.textContent = drink.strCategory;
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.error('Error cargando categorías:', err);
  }
}

// Buscar cócteles
async function searchCocktails(query) {
  try {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    if (!data.drinks) {
      container.innerHTML = '<p style="text-align:center;">No se encontraron cócteles.</p>';
      allDrinks = [];
      return;
    }
    allDrinks = data.drinks; 
    displayCocktailsFiltered();
  } catch (error) {
    container.innerHTML = '<p style="text-align:center;">Error al cargar datos.</p>';
    console.error(error);
  }
}

// Muestra los cócteles filtrados por categoría seleccionada
function displayCocktailsFiltered() {
  const selectedCategory = categoryFilter.value;
  let filtered = allDrinks;
  if (selectedCategory) {
    filtered = allDrinks.filter(d => d.strCategory === selectedCategory);
  }
  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center;">No hay cócteles para esta categoría.</p>';
    return;
  }
  displayCocktails(filtered);
}

// Mostrar lista de cócteles
function displayCocktails(cocktails) {
  container.innerHTML = '';
  cocktails.forEach(drink => {
    const card = document.createElement('div');
    card.className = 'card';

    const isFav = isFavorite(drink.idDrink);

    card.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
      <div class="card-content">
        <h2>${drink.strDrink}</h2>
        <button class="fav-btn" data-id="${drink.idDrink}" title="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
          ${isFav ? '★' : '☆'}
        </button>
      </div>
    `;

    // Click en la tarjeta (excepto en el botón)
    card.addEventListener('click', e => {
      if (!e.target.classList.contains('fav-btn')) {
        showDetails(drink);
      }
    });

    // Botón de favorito
    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', e => {
      e.stopPropagation(); // evitar que se abra el modal
      toggleFavorite(drink.idDrink);
    });

    container.appendChild(card);
  });
}


// Mostrar modal con detalles
function showDetails(drink) {
  modal.classList.remove('hidden');
  modalBody.innerHTML = '<p>Cargando...</p>';

  let ingredients = '';
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      ingredients += `<li>${measure ? measure : ''} ${ingredient}</li>`;
    }
  }

  modalBody.innerHTML = `
    <h2>${drink.strDrink}</h2>
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" style="width:100%; border-radius:8px; margin-bottom:15px;" />
    <p><strong>Categoría:</strong> ${drink.strCategory || 'N/A'}</p>
    <p><strong>Tipo:</strong> ${drink.strAlcoholic || 'N/A'}</p>
    <p><strong>Instrucciones:</strong><br>${drink.strInstructionsES}</p>
    <p><strong>Ingredientes:</strong></p>
    <ul>${ingredients}</ul>
  `;
}

// Mostrar todos los cocteles
async function loadAllCocktails() {
  container.innerHTML = '<p style="text-align:center;">Cargando todos los cócteles disponibles...</p>';
  const all = [];
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  for (const letter of letters) {
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await res.json();
      if (data.drinks) {
        all.push(...data.drinks);
      }
    } catch (err) {
      console.error(`Error con la letra ${letter}`, err);
    }
  }
  masterDrinksList = all; // todos los cócteles
  allDrinks = all;        // inicialmente mostramos todos
  displayCocktailsFiltered();
}


// Eventos
searchInput.addEventListener('input', e => {
  const query = e.target.value.trim();
  if (query.length === 0) {
  // Campo vacío: volvemos a mostrar todos los cócteles cargados previamente
  displayCocktailsFiltered();
  return;
}
if (query.length < 2) {
  container.innerHTML = '<p style="text-align:center;">Escribe al menos 2 caracteres para buscar.</p>';
  return;
}
  searchCocktails(query);
});

categoryFilter.addEventListener('change', () => {
  displayCocktailsFiltered();
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', e => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Inicialización
container.innerHTML = '<p style="text-align:center;">Escribe al menos 2 caracteres para buscar un cóctel.</p>';
loadCategories();

const showFavoritesBtn = document.getElementById('showFavoritesBtn');

showFavoritesBtn.addEventListener('click', async () => {
  if (!showingFavorites) {
    if (favorites.length === 0) {
      container.innerHTML = '<p style="text-align:center;">No tienes cócteles favoritos aún.</p>';
      return;
    }
    container.innerHTML = '<p style="text-align:center;">Cargando favoritos...</p>';
    const drinks = [];
    for (const id of favorites) {
      try {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        if (data.drinks && data.drinks[0]) {
          drinks.push(data.drinks[0]);
        }
      } catch (e) {
        console.error('Error cargando favorito con ID', id);
      }
    }
    displayCocktails(drinks); // Muestra favoritos sin tocar allDrinks
    showingFavorites = true;
    showFavoritesBtn.textContent = '🔙 Volver a todos los cócteles';
  } else {
    allDrinks = masterDrinksList;  // restaurar la lista maestra
    displayCocktailsFiltered();
    showingFavorites = false;
    showFavoritesBtn.textContent = '⭐ Ver favoritos';
  }
});

loadCategories();
loadAllCocktails();
