// Obtener la referencia a la pizza y la lista de ingredientes
const pizza = document.getElementById('pizza');
const ingredientsList = document.getElementById('ingredientsList');

// Lista de ingredientes con su posicionamiento en la pizza
let ingredients = [];

// Función para añadir ingredientes a la pizza
function addIngredient(ingredient) {
  // Crear un nuevo elemento para el ingrediente
  const ingredientElement = document.createElement('div');
  ingredientElement.classList.add('ingredient');
  
  // Asignar el color y tipo según el ingrediente
  switch (ingredient) {
    case 'cheese':
      ingredientElement.classList.add('cheese');
      break;
    case 'pepperoni':
      ingredientElement.classList.add('pepperoni');
      break;
    case 'mozzarella':
      ingredientElement.classList.add('mozzarella');
      break;
    default:
      break;
  }
  
  // Posicionar aleatoriamente el ingrediente sobre la pizza
  const x = Math.random() * 250 + 25;  // Valor aleatorio dentro del rango de la pizza
  const y = Math.random() * 250 + 25;
  ingredientElement.style.left = `${x}px`;
  ingredientElement.style.top = `${y}px`;

  // Añadir el ingrediente visualmente
  pizza.appendChild(ingredientElement);

  // Añadir el ingrediente a la lista
  ingredients.push(ingredient);
  updateIngredientsList();
}

// Actualizar la lista de ingredientes
function updateIngredientsList() {
  ingredientsList.innerHTML = ''; // Limpiar la lista
  ingredients.forEach((ingredient, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Ingrediente ${index + 1}: ${ingredient}`;
    listItem.style.listStyle="none";
    ingredientsList.appendChild(listItem);
  });
}

