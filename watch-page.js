// Function to render movie elements
function renderElements(watchList) {
	// Clear DOM before adding searched movies
	document.querySelector('.watchList').innerHTML = '';

	// Run the below code on each individual movie that is found
	console.log(watchList);
	watchList.forEach((movie) => {
		// Create Elements
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
		watchedCheckbox.checked = movie.watched;
		watchedCheckbox.id = `watched${movie.title}`;

		let existingMovie = watchList.find((m) => m.title === movie.title);

		// Add Event Listeners
		watchedCheckbox.addEventListener('change', (e) => {
			movie.watched = e.target.checked;
			existingMovie = watchList.find((m) => m.title === movie.title);

			if (
				movie.watched &&
				(!existingMovie || movie.title !== existingMovie.title)
			) {
				actions.classList.add('watched');
				watchedLabel.innerHTML = `<span class="material-symbols-outlined">
        bookmark_added
        </span>`;

				watchList.push(movie);
				console.log('Pushed to watchList' + watchList);
				localStorage.setItem('watchList', JSON.stringify(watchList));
			} else {
				actions.classList.remove('watched');
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
						localStorage.setItem('watchList', JSON.stringify(watchList)); // Update local storage
					}
				}
			}
		});

		const watchedLabel = document.createElement('label');
		watchedLabel.classList.add('watchedButton');
		watchedLabel.htmlFor = `watched${movie.title}`;
		watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                        bookmark_add
                        </span>`;

		const moviePoster = document.createElement('img');
		moviePoster.classList.add('moviePoster');

		// Append each element to its parent
		document.querySelector('.watchList').appendChild(movieCard);
		movieCard.appendChild(moviePoster);
		movieCard.appendChild(movieDetails);
		movieDetails.appendChild(movieTitle);
		movieDetails.appendChild(movieYearRuntime);
		movieYearRuntime.appendChild(movieYear);
		movieYearRuntime.appendChild(runtime);
		movieDetails.appendChild(plot);
		movieCard.appendChild(actions);
		actions.appendChild(watchedLabel);
		actions.appendChild(watchedCheckbox);

		// Check if movie already exists in Local Storage and is watched
		if (existingMovie) {
			// If the movie exists in local storage, update movie with its data
			movie.watched = existingMovie.watched;
		}
		if (movie.watched) {
			actions.classList.add('watched');
			watchedLabel.innerHTML = `<span class="material-symbols-outlined">
                bookmark_added
                </span>`;
		}

		// Render Movie information to DOM
		movieTitle.innerText = movie.title;
		movieYear.innerText = movie.year;
		runtime.innerText = movie.runtime;
		plot.innerText = movie.plot;
		moviePoster.src = movie.poster;
		if (movie.poster === 'N/A') {
			moviePoster.src =
				'https://www.movienewz.com/wp-content/uploads/2014/07/poster-holder.jpg';
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	// Fetch the watch list from local storage
	let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

	// Call the function to render the watch list to the DOM on page load
	renderElements(watchList);
});

//Bugs
//Unable to use search box on Watched Items
