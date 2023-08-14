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

						// //Create Elements
						const movieCard = document.createElement('div');
						movieCard.classList.add('movie');

						const movieDetails = document.createElement('div');
						movieDetails.classList.add('movieDetails');

						const movieTitle = document.createElement('h1');
						movieTitle.classList.add('movieTitle');

						const movieYear = document.createElement('p');
						movieYear.classList.add('movieYear');

						const runtime = document.createElement('p');
						runtime.classList.add('runtime');

						const plot = document.createElement('p');
						plot.classList.add('plot');

						const actions = document.createElement('div');
						actions.classList.add('actions');

						const watchedCheckbox = document.createElement('input');
						watchedCheckbox.classList.add('watchedButton');
						watchedCheckbox.type = 'checkbox';
						watchedCheckbox.checked = mergedMovieData.watched;

						if (mergedMovieData.watched) {
							actions.querySelector('input').classList.add('watched');
						}

						const moviePoster = document.createElement('img');
						moviePoster.classList.add('moviePoster');

						//Append each element to its parent
						document.querySelector('.movie-body').appendChild(movieCard);
						movieCard.appendChild(movieDetails);
						movieDetails.appendChild(movieTitle);
						movieDetails.appendChild(movieYear);
						movieDetails.appendChild(runtime);
						movieDetails.appendChild(plot);
						movieCard.appendChild(actions);
						actions.appendChild(watchedCheckbox);
						movieCard.appendChild(moviePoster);

						// //Render Movie information to DOM

						movieTitle.innerText = mergedMovieData.title;
						movieYear.innerText = mergedMovieData.year;
						runtime.innerText = mergedMovieData.runtime;
						plot.innerText = mergedMovieData.plot;
						moviePoster.src = mergedMovieData.poster;

						//Add Event Listener to checkboxes

						watchedCheckbox.addEventListener('change', (e) => {
							mergedMovieData.watched = e.target.checked;
							console.log(mergedMovieData.watched);
							if (mergedMovieData.watched) {
								movieCard.querySelector('input').classList.add('watched');
							} else {
								movieCard.querySelector('input').classList.remove('watched');
							}
						});
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
//Use append child to create elements, and use Innertext to add the informationm this should
//allow for a event listener to work
