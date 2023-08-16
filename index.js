//Search Movie title after every letter

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.movie-body').innerHTML = `
		<div class="homeMovie">
			<div class="movieDetails">
				<h1 class="homeMovieTitle">Spider-Man: No Way Home</h1>
				<div class="homeMovieYearRuntime">
					<p class="movieYear">2021</p>
					<p class="runtime">Run-time: 148 min</p>
				</div>
				<p class="homePlot">With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.</p>
			</div>
				<img class="moviePoster" src="https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg">
		</div>
`;
});

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

	//Creating watchList array
	let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

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

						const movieYearRuntime = document.createElement('div');
						movieYearRuntime.classList.add('movieYearRuntime');

						const movieYear = document.createElement('p');
						movieYear.classList.add('movieYear');

						const runtime = document.createElement('p');
						runtime.classList.add('runtime');

						const plot = document.createElement('p');
						plot.classList.add('plot');

						const actions = document.createElement('div');
						actions.classList.add('actions');

						const watchedCheckbox = document.createElement('input');
						watchedCheckbox.classList.add('checkbox');
						watchedCheckbox.type = 'checkbox';
						watchedCheckbox.checked = mergedMovieData.watched;
						watchedCheckbox.id = `watched${mergedMovieData.title}`;

						let existingMovie = watchList.find(
							(m) => m.title === mergedMovieData.title
						);

						//Add Event Listeners
						watchedCheckbox.addEventListener('change', (e) => {
							mergedMovieData.watched = e.target.checked;
							existingMovie = watchList.find(
								(m) => m.title === mergedMovieData.title
							);

							console.log(existingMovie);

							if (
								mergedMovieData.watched &&
								(!existingMovie ||
									mergedMovieData.title !== existingMovie.title)
							) {
								movieCard
									.querySelector('.watchedButton')
									.classList.add('watched');
								watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_added
                        </span>`;

								watchList.push(mergedMovieData);
								console.log('Pushed to watchList' + watchList);
								localStorage.setItem('watchList', JSON.stringify(watchList));
							} else {
								movieCard
									.querySelector('.watchedButton')
									.classList.remove('watched');
								watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_add
                        </span>`;

								if (existingMovie) {
									existingMovie.watched = false; // Set watched status to false
									const movieIndex = watchList.findIndex(
										(m) => m.title === existingMovie.title
									);
									if (movieIndex !== -1) {
										watchList.splice(movieIndex, 1); // Remove the movie from the array
										console.log('Removed from watchList' + watchList);
										localStorage.setItem(
											'watchList',
											JSON.stringify(watchList)
										); // Update local storage
									}
								}
							}
						});

						const watchedLabel = document.createElement('label');
						watchedLabel.classList.add('watchedButton');
						watchedLabel.htmlFor = `watched${mergedMovieData.title}`;
						watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_add
                        </span>`;

						const moviePoster = document.createElement('img');
						moviePoster.classList.add('moviePoster');

						//Append each element to its parent
						document.querySelector('.movie-body').appendChild(movieCard);
						movieCard.appendChild(movieDetails);
						movieDetails.appendChild(movieTitle);
						movieDetails.appendChild(movieYearRuntime);
						movieYearRuntime.appendChild(movieYear);
						movieYearRuntime.appendChild(runtime);
						movieDetails.appendChild(plot);
						movieDetails.appendChild(actions);
						actions.appendChild(watchedLabel);
						actions.appendChild(watchedCheckbox);
						movieCard.appendChild(moviePoster);

						//Check if movie already exists in Local Storage and is watched

						if (existingMovie) {
							// If the movie exists in local storage, update mergedMovieData with its data
							mergedMovieData.watched = existingMovie.watched;
						}
						if (mergedMovieData.watched) {
							movieCard
								.querySelector('.watchedButton')
								.classList.add('watched');
							watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                bookmark_added
                </span>`;
						}

						//Render Movie information to DOM

						console.log(mergedMovieData);

						movieTitle.innerText = mergedMovieData.title;
						movieYear.innerText = mergedMovieData.year;
						runtime.innerText = `Run-time: ${mergedMovieData.runtime}`;
						plot.innerText = mergedMovieData.plot;
						moviePoster.src = mergedMovieData.poster;
						if (mergedMovieData.poster === 'N/A') {
							moviePoster.src =
								'https://www.movienewz.com/wp-content/uploads/2014/07/poster-holder.jpg';
						}
						if (!mergedMovieData.plot) {
							plot.innerText = 'No plot found for this title :(';
						}

						if (!mergedMovieData.runtime) {
							runtime.innerText = 'N/A';
						}

						//Add Event Listener to checkboxes
					});
			});
		})
		.catch((err) => {
			console.error('No Movie Found');
		});
});

//Bugs:
//Sometimes search doesn't update if you type too quickly

//Add rating system, similar to bookmark, except 1-5 stars

//Create home page, maybe show 1-2 random movies
//Create rating page, able to sort ratings from high to low

//Only search from watched/rated movies when on the watchList/rated page
