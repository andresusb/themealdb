document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search-btn");
  const ingredientInput = document.getElementById("ingredient-input");
  const recipesGrid = document.getElementById("recipes-grid");
  const ingredientsList = document.getElementById("ingredients-list");
  const recipeModal = document.getElementById("recipe-modal");
  const modalName = document.getElementById("modal-name");
  const modalImage = document.getElementById("modal-image");
  const modalInstructions = document.getElementById("modal-instructions");
  const closeBtn = document.querySelector(".close-btn");

  function fetchIngredients() {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
      .then((response) => response.json())
      .then((data) => {
        ingredientsList.innerHTML = "";
        data.meals.forEach((ingredient) => {
          const ingredientItem = document.createElement("div");
          ingredientItem.className = "ingredient-item";
          ingredientItem.textContent = ingredient.strIngredient;
          ingredientItem.addEventListener("click", function () {
            hideIngredientsList();
            searchRecipes(ingredient.strIngredient);
          });
          ingredientsList.appendChild(ingredientItem);
        });
      })
      .catch((error) => console.error("Error fetching ingredients:", error));
  }

  function hideIngredientsList() {
    ingredientsList.style.display = "none";
  }

  function showIngredientsList() {
    ingredientsList.style.display = "grid";
  }

  function searchRecipes(ingredient) {
    hideIngredientsList();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then((response) => response.json())
      .then((data) => {
        recipesGrid.innerHTML = "";
        if (data.meals) {
          data.meals.forEach((meal) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <a href="#" data-id="${meal.idMeal}">Ver receta</a>
                        `;
            recipesGrid.appendChild(card);
          });
        } else {
          recipesGrid.innerHTML =
            "<p>No recipes found for this ingredient.</p>";
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  searchBtn.addEventListener("click", function () {
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
      hideIngredientsList();
      searchRecipes(ingredient);
    }
  });

  recipesGrid.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      event.preventDefault();
      const mealId = event.target.getAttribute("data-id");

      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((response) => response.json())
        .then((data) => {
          const meal = data.meals[0];
          modalName.textContent = meal.strMeal;
          modalImage.src = meal.strMealThumb;
          modalInstructions.textContent = meal.strInstructions;
          recipeModal.style.display = "flex";
        })
        .catch((error) =>
          console.error("Error fetching recipe details:", error)
        );
    }
  });

  closeBtn.addEventListener("click", function () {
    recipeModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === recipeModal) {
      recipeModal.style.display = "none";
    }
  });

  fetchIngredients();
});
