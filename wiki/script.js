const container = document.getElementById('cocktailContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

let allDrinks = []; // Almacenar resultados y filtrar

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
  if (!query) {
    container.innerHTML = '<p style="text-align:center;">Escribe para buscar un cóctel.</p>';
    allDrinks = [];
    return;
  }
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

// Mostrar lista de cócteles (agregamos clase para animación)
function displayCocktails(cocktails) {
  container.innerHTML = '';
  cocktails.forEach(drink => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
      <h2>${drink.strDrink}</h2>
    `;
    card.addEventListener('click', () => showDetails(drink));
    container.appendChild(card);

    // Reiniciar la animación por si falla
    card.style.animation = 'none';
    requestAnimationFrame(() => {
      card.style.animation = '';
    });
  });
}

// Mostrar modal con detalles (igual que antes)
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
    <p><strong>Instrucciones:</strong><br>${drink.strInstructions}</p>
    <p><strong>Ingredientes:</strong></p>
    <ul>${ingredients}</ul>
  `;
}

// Eventos
searchInput.addEventListener('input', e => {
  const query = e.target.value.trim();
  if (query.length < 2) {
    container.innerHTML = '<p style="text-align:center;">Escribe al menos 2 caracteres para buscar.</p>';
    allDrinks = [];
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

// Mostrar varios cócteles aleatorios al iniciar
async function loadRandomCocktails(n = 6) {
  container.innerHTML = '<p style="text-align:center;">Cargando cócteles populares...</p>';
  let drinks = [];
  try {
    for (let i = 0; i < n; i++) {
      const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      const data = await res.json();
      if (data.drinks && data.drinks[0]) {
        drinks.push(data.drinks[0]);
      }
    }
    allDrinks = drinks;
    displayCocktails(drinks);
  } catch (err) {
    container.innerHTML = '<p style="text-align:center;">Error cargando cócteles.</p>';
  }
}

loadCategories();
loadRandomCocktails();
