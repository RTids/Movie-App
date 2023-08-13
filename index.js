document.getElementById('search').addEventListener('keyup', (e) => {
	let searchName = e.target.value;

	console.log(searchName);

	//Search API for movies

	const url = `http://www.omdbapi.com/?apikey=b2b8b2f0&s=${searchName}`;
	const posterUrl = `http://img.omdbapi.com/?apikey=b2b8b2f0&s=${searchName}`;
	const options = {
		method: 'GET',
		contentType: 'application/json',
	};

    document.querySelector('.movie-body').innerHTML = ''

	fetch(url, options)
		.then((resp) => resp.json())
		.then((data) => {
			console.log(data.Search);

			const results = data.Search;
			const renderResults = results.forEach((movie) => {
				console.log(movie.Title);
            
                document.querySelector('.movie-body').innerHTML += `
                <div class='movie'>
                    <div class='movieDetails'>
                        <h1 class='movieTitle'>${movie.Title}</h1>
                        <p class='movieYear'>${movie.Year}</p>
                    </div>
                    <img class='moviePoster' src='${movie.Poster}'>
                </div>
                `
			});
		})
		.catch((err) => {
			console.error('No Movie Found');
		});
});
