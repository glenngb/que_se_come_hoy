document.addEventListener("DOMContentLoaded", async () => {
  const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  const selectCategorias = document.getElementById('categorias');

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Iterar sobre las categorías usando forEach
    data.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.idCategory;
      option.textContent = `${category.idCategory} - ${category.strCategory}`;
      selectCategorias.appendChild(option);
    });

    console.log("Categorías obtenidas:", data.categories);

  } catch (error) {
    console.error("Error al obtener las categorías: ", error);
  }
});

document.getElementById('categorias').addEventListener('change', async (event) => {
  const idCategory = event.target.value;

  if (idCategory !== "-- Seleccione --") {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${event.target.selectedOptions[0].textContent.split(" - ")[1]}`;
    const resultadoDiv = document.getElementById('resultado');

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Limpiar cualquier resultado anterior
      resultadoDiv.innerHTML = '';

      // Verificar si hay resultados
      if (data.meals) {
        // Mostrar los resultados en el DOM
        data.meals.forEach(meal => {
          const mealCard = `
              <div class="col-md-4">
                <div class="card mb-4">
                  <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                  <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <button class="btn btn-primary" onclick="mostrarDetalles(${meal.idMeal})">Ver Receta</button>
                  </div>
                </div>
              </div>
            `;
          resultadoDiv.innerHTML += mealCard;
        });
      } else {
        resultadoDiv.innerHTML = '<p class="text-center">No se encontraron resultados para esta categoría.</p>';
      }
    } catch (error) {
      console.error("Error al obtener los resultados: ", error);
    }
  }
});

async function mostrarDetalles(idMeal) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
  const modal = new bootstrap.Modal(document.getElementById('modal'));
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');

  try {
    const response = await fetch(url);
    const data = await response.json();
    const meal = data.meals[0];

    modalTitle.textContent = meal.strMeal;
    modalBody.innerHTML = `
        <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
        <h5>Instrucciones:</h5>
        <p>${meal.strInstructions}</p>
      `;

    modal.show();
  } catch (error) {
    console.error("Error al obtener los detalles de la receta: ", error);
  }
}
