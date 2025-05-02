document.addEventListener('DOMContentLoaded', () => {
    
    // --- Meal Toggling Logic ---
    const mealList = document.getElementById('meal-list'); // Target main container for event delegation

    // Inside your existing script.js, add this:
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

    if (mealList) {
        mealList.addEventListener('click', (event) => {
            // Check if the clicked element is a meal toggle header
            if (event.target.classList.contains('meal-toggle')) {
                const toggle = event.target;
                const content = toggle.nextElementSibling;

                // Check if the content div exists and has the correct class
                if (content && content.classList.contains('recipe-content')) {
                    // Toggle the 'visible' class to show/hide
                    content.classList.toggle('visible');
                    
                    // Update ARIA state when toggling 
                    const isVisible = content.classList.contains('visible');
                    toggle.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
                }
            }
        });

        // Add ARIA attributes for accessibility on initial load
        const mealToggles = mealList.querySelectorAll('.meal-toggle');
        mealToggles.forEach(toggle => {
             const content = toggle.nextElementSibling;
             if (content && content.classList.contains('recipe-content')) {
                // Create a somewhat unique ID based on the text content if possible
                 const textContent = toggle.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                 const contentId = 'content-' + (textContent || Math.random().toString(36).substring(2, 9)); 
                
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-controls', contentId);
                content.setAttribute('id', contentId);
                // If toggle needs an ID for aria-labelledby:
                // toggle.id = 'label-' + contentId; 
                // content.setAttribute('aria-labelledby', toggle.id);
            }
        });
    } // end if(mealList)

    // --- Meal Filtering Logic ---
    const filterNav = document.querySelector('.filter-nav');
    const mealItems = document.querySelectorAll('#meal-list .meal-item');

    if (filterNav && mealItems.length > 0) {
        filterNav.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-btn')) {
                const filterButton = event.target;
                const filterValue = filterButton.getAttribute('data-filter');

                // Update active button style
                filterNav.querySelector('.filter-btn.active').classList.remove('active');
                filterButton.classList.add('active');

                // Filter meal items
                mealItems.forEach(item => {
                    const itemProtein = item.getAttribute('data-protein');
                    // Hide any open recipe content when filtering
                    const recipeContent = item.querySelector('.recipe-content');
                    if (recipeContent && recipeContent.classList.contains('visible')) {
                         recipeContent.classList.remove('visible');
                         const toggle = item.querySelector('.meal-toggle');
                         if(toggle) {
                            toggle.setAttribute('aria-expanded', 'false');
                         }
                    }

                    // Show/hide based on filter
                    if (filterValue === 'all' || itemProtein === filterValue) {
                        item.classList.remove('hidden'); // Use class for hiding
                        // item.style.display = ''; // Or use style directly
                    } else {
                        item.classList.add('hidden');
                        // item.style.display = 'none';
                    }
                });
            }
        });
    } // end if(filterNav && mealItems)

});