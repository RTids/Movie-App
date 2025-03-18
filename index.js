//Load default movie for home screen
// document.addEventListener('DOMContentLoaded', () => {
// 	document.querySelector('.movie-body').innerHTML = `
// 		<div class="homeMovie">
// 			<div class="movieDetails">
// 				<h1 class="homeMovieTitle">Spider-Man: No Way Home</h1>
// 				<div class="homeMovieYearRuntime">
// 					<p class="movieYear">2021</p>
// 					<p class="runtime">Run-time: 148 min</p>
// 				</div>
// 				<p class="homePlot">With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.</p>
// 			</div>
// 				<img class="moviePoster" src="https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg">
// 		</div>
// `;
// });

//Search OMDB API using searched words
document.getElementById('search').addEventListener('keyup', (e) => {
	let searchName = e.target.value;

	console.log(searchName);

	//API options
	const url = `http://www.omdbapi.com/?apikey=[API KEY GOES HERE]=${searchName}`;
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
					`http://www.omdbapi.com/?apikey=[API KEY GOES HERE]=${movie.Title}`,
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
							rating: data.Ratings[0].Value,
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

						const movieRating = document.createElement('p');

						const runtime = document.createElement('p');

						const plot = document.createElement('p');
						plot.classList.add('plot');

						const actions = document.createElement('div');
						actions.classList.add('actions');

						const watchedCheckbox = document.createElement('input');
						watchedCheckbox.classList.add('checkbox');
						watchedCheckbox.type = 'checkbox';
						watchedCheckbox.checked = mergedMovieData.watched;
						watchedCheckbox.id = `watched${mergedMovieData.title}`;

						//Creating variable for the current movie that, this allows for the event listeners to
						//work on the correct movie
						let existingMovie = watchList.find(
							(m) => m.title === mergedMovieData.title
						);

						//Add Event Listeners
						watchedCheckbox.addEventListener('change', (e) => {
							mergedMovieData.watched = e.target.checked;

							//This only runs if the movie is not watched, and not already part of the watchList array
							//Then this if statement will run. This avoids duplicate movies in the watchList array
							if (
								mergedMovieData.watched &&
								(!existingMovie ||
									mergedMovieData.title !== existingMovie.title)
							) {
								movieCard.querySelector('.watchedButton');
								watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_added
                        </span>`;
								actions.classList.add('watched');

								watchList.push(mergedMovieData);
								console.log('Pushed to watchList' + watchList);
								localStorage.setItem('watchList', JSON.stringify(watchList));
							} else {
								movieCard.querySelector('.watchedButton');
								watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_add
                        </span>`;
								actions.classList.remove('watched');

								if (existingMovie) {
									existingMovie.watched = false; // Set watched status to false
									const movieIndex = watchList.findIndex(
										//Find a title in the watchList array that matches the title
										(m) => m.title === existingMovie.title
									);
									if (movieIndex !== -1) {
										// If the movieIndex doesn't return -1, it mean the movie exists
										watchList.splice(movieIndex, 1); // Remove the movie from the array
										console.log('Removed from watchList' + watchList);
										localStorage.setItem(
											'watchList',
											JSON.stringify(watchList) // Update local storage
										);
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
						movieCard.appendChild(moviePoster);
						movieCard.appendChild(movieDetails);
						movieDetails.appendChild(movieTitle);
						movieDetails.appendChild(movieYearRuntime);
						movieYearRuntime.appendChild(movieYear);
						movieYearRuntime.appendChild(movieRating);
						movieYearRuntime.appendChild(runtime);
						movieDetails.appendChild(plot);
						movieCard.appendChild(actions);
						actions.appendChild(watchedLabel);
						actions.appendChild(watchedCheckbox);

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

						movieTitle.innerText = mergedMovieData.title;
						movieYear.innerText = mergedMovieData.year;
						movieRating.innerText = mergedMovieData.rating;
						runtime.innerText = mergedMovieData.runtime;
						plot.innerText = mergedMovieData.plot;
						moviePoster.src = mergedMovieData.poster;
						if (mergedMovieData.poster === 'N/A') {
							moviePoster.src =
								'https://www.movienewz.com/wp-content/uploads/2014/07/poster-holder.jpg';
						}
						if (!mergedMovieData.plot || mergedMovieData.plot === 'N/A') {
							plot.innerText = 'No plot found for this title :(';
						}

						if (!mergedMovieData.runtime) {
							runtime.innerText = 'N/A';
						}

						if (!mergedMovieData.rating) {
							rating.innerText = 'N/A';
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

//Add few more details from API e.g rating

//Create home page, maybe show 1-2 random movies
