import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch, params}) => {
    try {
        const url = `http://127.0.0.1:8000/api/movies?crew=${params.id}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        const crewId = data.crew;
        console.log(crewId);
        const movieResponse = await fetch(`http://localhost:8000/api/movie/${crewId}/`);
        const movieData = await movieResponse.json();
        console.log(movieResponse);
        // Return the fetched data as the response
        return {crew: data, movies: movieData};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
