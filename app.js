// Helper function to switch pages
function showPage(pageName) {
    document.querySelectorAll('[data-page]').forEach(page => {
        page.classList.remove('active-page');
    });
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }
}

// Handle navigation clicks
document.querySelectorAll('[data-nav-target]').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const targetPage = event.target.dataset.navTarget;
        showPage(targetPage);
        if (targetPage === 'movies') {
            loadMovies();
        }
    });
});

// Function to load and display movies
async function loadMovies() {
    const moviesGrid = document.getElementById('movies-grid');
    const loadingIndicator = document.getElementById('movies-loading');
    const errorIndicator = document.getElementById('movies-error');
    moviesGrid.innerHTML = ''; // Clear existing movies
    loadingIndicator.classList.remove('hidden');
    errorIndicator.classList.add('hidden');

    try {
        const response = await fetch('/api/movies');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movies = await response.json();

        movies.forEach(movie => {
            const movieCard = `
                <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                    <img src="${movie.imageUrl}" alt="${movie.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2 text-red-400">${movie.title}</h3>
                        <p class="text-gray-300 text-sm">${movie.description}</p>
                        <button class="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full text-sm font-bold transition-colors">Watch Now</button>
                    </div>
                </div>
            `;
            moviesGrid.innerHTML += movieCard;
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        errorIndicator.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const statusDiv = document.getElementById('contact-status');
    statusDiv.classList.add('hidden');
    statusDiv.classList.remove('text-green-400', 'text-red-400');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.textContent = result.message || 'Message sent successfully!';
            statusDiv.classList.add('text-green-400');
            form.reset();
        } else {
            throw new Error(result.message || 'Failed to send message.');
        }
    } catch (error) {
        console.error('Contact form submission error:', error);
        statusDiv.textContent = error.message || 'An unexpected error occurred.';
        statusDiv.classList.add('text-red-400');
    } finally {
        statusDiv.classList.remove('hidden');
    }
});

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    // Pre-load movies in case the user navigates directly to the movies page
    // This will run on DOMContentLoaded, but the results won't be visible until 'movies' page is active
    loadMovies(); 
});
