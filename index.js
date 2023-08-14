//Search Movie title after every letter
document.getElementById('search').addEventListener('keyup', (e) => {
	let searchName = e.target.value;

	console.log(searchName);

	//API options
	const url = `http://www.omdbapi.com/?apikey=b2b8b2f0&s=${searchName}`;
	const options = {
		method: 'GET',
		contentType: 'application/json',
	};

	//Clear DOM before adding searched movies
	document.querySelector('.movie-body').innerHTML = '';

	//Fetch request to get some basic info on the Movie
	fetch(url, options)
		.then((resp) => resp.json())
		.then((data) => {
			const results = data.Search;

			//Run the below code on each individual movie that is found
			const renderResults = results.forEach((movie) => {
				//2nd Fetch request on Movie using different URL, to get more information from API
				fetch(
					`http://www.omdbapi.com/?apikey=b2b8b2f0&t=${movie.Title}`,
					options
				)
					.then((resp) => resp.json())
					.then((data) => {
						//Merge both fetch requests into one variable, adding 'watched' and 'rating' variables
						const mergedMovieData = {
							title: movie.Title,
							year: movie.Year,
							runtime: data.Runtime,
							plot: data.Plot,
							poster: movie.Poster,
							watched: false,
							rating: 0,
						};

						//Render Movie to DOM
						document.querySelector('.movie-body').innerHTML += `
                <div class='movie'>
                    <div class='movieDetails'>
                        <h1 class='movieTitle'>${mergedMovieData.title}</h1>
                        <p class='movieYear'>${mergedMovieData.year}</p>
                        <p class='runtime'>${mergedMovieData.runtime}</p>
                        <p class='plot'>${mergedMovieData.plot}</p>
                    </div>
                    <div class='actions'>
                    <input class='watched' type='checkbox' id='${mergedMovieData.title}'>
                    </div>
                    <img class='moviePoster' src='${mergedMovieData.poster}'>
                </div>
                `;
					});
			});
		})
		.catch((err) => {
			console.error('No Movie Found');
		});
});

//Bugs:
//Default poster if one cannot be loaded/found
//Adding event listener onto dynamically created checkboxes
