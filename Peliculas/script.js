document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const movieSearch = document.getElementById('movieSearch');

    searchButton.addEventListener('click', searchMovie);
    movieSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovie();
        }
    });

    
    searchMovie();
});

function searchMovie() {
    const searchTerm = document.getElementById('movieSearch').value || 'The Dark Knight';
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovie(data);
                fetchRecommendations(data.Genre.split(', ')[0]);
            } else {
                displayError('No se encontró la película.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('Ocurrió un error al buscar la película.');
        });
}

function displayMovie(movie) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="card shadow mb-4 fade-in">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Poster'}" class="img-fluid rounded-start" alt="${movie.Title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h2 class="card-title">${movie.Title} <span class="badge bg-secondary">${movie.Year}</span></h2>
                        <p class="card-text">
                            <span class="badge bg-info">${movie.Rated}</span>
                            <span class="badge bg-primary">${movie.Runtime}</span>
                        </p>
                        <p class="card-text"><strong>Director:</strong> ${movie.Director}</p>
                        <p class="card-text"><strong>Actores:</strong> ${movie.Actors}</p>
                        <p class="card-text"><strong>Género:</strong> ${movie.Genre}</p>
                        <p class="card-text"><strong>Trama:</strong> ${movie.Plot}</p>
                        <p class="card-text"><small class="text-muted">IMDb Rating: ${movie.imdbRating}</small></p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function fetchRecommendations(genre) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(genre)}&type=movie&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayRecommendations(data.Search.slice(0, 4));
            }
        })
        .catch(error => console.error('Error fetching recommendations:', error));
}

function displayRecommendations(movies) {
    const recommendationsDiv = document.getElementById('recommendations');
    let html = '<h3 class="mt-4 mb-3">Recomendaciones</h3><div class="row">';

    movies.forEach(movie => {
        html += `
            <div class="col-md-3 mb-4">
                <div class="card recommendation-card h-100" onclick="selectMovie('${movie.Title}')">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Poster'}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    recommendationsDiv.innerHTML = html;
}

function selectMovie(title) {
    document.getElementById('movieSearch').value = title;
    searchMovie();
}

function displayError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="alert alert-danger fade-in" role="alert">
            ${message}
        </div>
    `;
    document.getElementById('recommendations').innerHTML = '';
}