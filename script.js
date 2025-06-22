const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        });
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

// show recipe modal with feedback
function mealRecipeModal(meal) {
    meal = meal[0];
    const savedFeedback = localStorage.getItem(`feedback_${meal.idMeal}`) || "";

    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>

        <div class="feedback-section">
            <h3>Leave Your Feedback</h3>
            <textarea id="feedback-text" rows="4" placeholder="What did you think of this recipe?">${savedFeedback}</textarea>
            <button id="submit-feedback">Submit Feedback</button>
            <p id="feedback-response" style="color: green; margin-top: 10px;"></p>
        </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    const feedbackBtn = document.getElementById('submit-feedback');
    feedbackBtn.addEventListener('click', () => {
        const feedbackText = document.getElementById('feedback-text').value.trim();
        const responseMsg = document.getElementById('feedback-response');
        if (feedbackText) {
            localStorage.setItem(`feedback_${meal.idMeal}`, feedbackText);
            responseMsg.textContent = "Thanks for your feedback!";
            responseMsg.style.color = "green";
            console.log(`Feedback saved for ${meal.strMeal}:`, feedbackText);
        } else {
            responseMsg.textContent = "Please write something before submitting.";
            responseMsg.style.color = "red";
        }
    });
}
