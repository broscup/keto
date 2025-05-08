
window.addEventListener('DOMContentLoaded', () => {
    let recipes = [];
    let previousFilter = { category: 'All', protein: '', search: '' };

    fetch('keto-recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = data.recipes;
            showAll();
            updateProteinButton();
        })
        .catch(error => console.error('Failed to load recipes:', error));

    function getCurrentView() {
        if (document.getElementById('keto-info').style.display === 'block') return 'info';
        if (document.getElementById('category-list').style.display === 'block') return 'category';
        return 'all';
    }

    function setActiveNav(activeId) {
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }

    function showAll() {
        setActiveNav('nav-all');
        document.getElementById('recipe-list').style.display = 'flex';
        document.getElementById('category-list').style.display = 'none';
        document.getElementById('single-recipe').style.display = 'none';
        document.getElementById('keto-info').style.display = 'none';
        previousFilter.category = 'All';
        searchRecipes();
    }

    function showByCategory() {
        setActiveNav('nav-category');
        document.getElementById('recipe-list').style.display = 'none';
        document.getElementById('category-list').style.display = 'block';
        document.getElementById('single-recipe').style.display = 'none';
        document.getElementById('keto-info').style.display = 'none';
        previousFilter.category = 'ByCategory';
        filterByCategoryView();
    }

    function showKetoInfo() {
        setActiveNav('nav-info');
        document.getElementById('recipe-list').style.display = 'none';
        document.getElementById('category-list').style.display = 'none';
        document.getElementById('single-recipe').style.display = 'none';
        document.getElementById('keto-info').style.display = 'block';
    }

    function displayRecipes(recipeArray) {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        recipeArray.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card clickable';
            card.innerHTML = `<h2>${recipe.name}</h2><p>${recipe.description}</p>`;
            card.addEventListener('click', () => {
                showSingleRecipe(recipe);
            });
            recipeList.appendChild(card);
        });
    }

    function displayByCategory() {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = '';
        const categoriesOrder = ["Appetizers/Snacks", "Breakfast", "Soups and Salads", "Main Course", "Desserts", "Drinks"];

        categoriesOrder.forEach(category => {
            const filtered = recipes.filter(r => {
                const matchProtein = !previousFilter.protein || r.protein === previousFilter.protein;
                const matchSearch = !previousFilter.search || (
                    r.name.toLowerCase().includes(previousFilter.search.toLowerCase()) ||
                    r.description.toLowerCase().includes(previousFilter.search.toLowerCase()) ||
                    r.instructions.toLowerCase().includes(previousFilter.search.toLowerCase()) ||
                    r.ingredients.join(', ').toLowerCase().includes(previousFilter.search.toLowerCase())
                );
                return r.category === category && matchProtein && matchSearch;
            }).sort((a, b) => a.name.localeCompare(b.name));

            if (filtered.length > 0) {
                const section = document.createElement('section');
                section.innerHTML = `<h2>${category}</h2>`;
                filtered.forEach(recipe => {
                    const link = document.createElement('div');
                    link.className = 'recipe-card clickable';
                    link.innerHTML = `<h3>${recipe.name}</h3>`;
                    link.addEventListener('click', () => {
                        showSingleRecipe(recipe);
                    });
                    section.appendChild(link);
                });
                categoryList.appendChild(section);
            }
        });
    }

    function filterByCategoryView() {
        displayByCategory();
    }

    function showSingleRecipe(recipe) {
        document.getElementById('recipe-list').style.display = 'none';
        document.getElementById('category-list').style.display = 'none';
        document.getElementById('keto-info').style.display = 'none';
        document.getElementById('single-recipe').style.display = 'block';

        const single = document.getElementById('single-recipe');
        
        const instructionsHTML = recipe.instructions.map(step => `<li>${step}</li>`).join('');
        const ingredientsHTML = recipe.ingredients.map(item => `<li>${item}</li>`).join('');

        single.innerHTML = `<div class="recipe-card">
                                <h2>${recipe.name}</h2><p>${recipe.description}</p>
                                <div class="details">
                                    <p><strong>Category:</strong> ${recipe.category}</p>
                                    <p><strong>Protein:</strong> ${recipe.protein}</p>
                                    <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
                                    <p><strong>Diet:</strong> ${recipe.diet}</p>
                                    <p><strong>Instructions:</strong><ol>${instructionsHTML}</ol></p>
                                    <p><strong>Ingredients:</strong><ul>${ingredientsHTML}</ul></p>
                                </div>
                                <button onclick="goBack()">Back to ${previousFilter.category === 'ByCategory' ? 'Categories' : 'All Recipes'}</button>
                            </div>`;
    }

    function goBack() {
        if (previousFilter.category === 'ByCategory') {
            showByCategory();
        } else {
            showAll();
        }
    }

    function searchRecipes() {
        const query = document.getElementById('search').value;
        previousFilter.search = query;
        updateProteinButton();

        if (getCurrentView() === 'category') {
            filterByCategoryView();
            return;
        }

        let filtered = recipes;
        if (previousFilter.protein) {
            filtered = filtered.filter(r => r.protein === previousFilter.protein);
        }
        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(lowerQuery) ||
                r.description.toLowerCase().includes(lowerQuery) ||
                r.instructions.toLowerCase().includes(lowerQuery) ||
                r.ingredients.join(', ').toLowerCase().includes(query)
            );
        }
        displayRecipes(filtered);
    }

    function filterProtein() {
        const protein = document.getElementById('protein-filter').value;
        previousFilter.protein = protein;
        updateProteinButton();

        if (getCurrentView() === 'category') {
            filterByCategoryView();
        } else if (getCurrentView() === 'info') {
            showAll();
        } else {
            searchRecipes();
        }
    }

    function clearProtein() {
        document.getElementById('protein-filter').value = '';
        previousFilter.protein = '';
        updateProteinButton();
        searchRecipes();
    }

    function updateProteinButton() {
        const protein = document.getElementById('protein-filter').value;
        const button = document.getElementById('protein-reset');
        if (!button) return;
        if (!protein) {
            button.innerHTML = '✅ All proteins shown';
        } else {
            button.innerHTML = '⚠️ Clear Protein Filter';
        }
    }

    window.showAll = showAll;
    window.showByCategory = showByCategory;
    window.showKetoInfo = showKetoInfo;
    window.searchRecipes = searchRecipes;
    window.filterProtein = filterProtein;
    window.goBack = goBack;
    window.clearProtein = clearProtein;
    window.updateProteinButton = updateProteinButton;
});
