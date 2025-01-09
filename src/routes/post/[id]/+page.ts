import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch, params}) => {
    try {
        const url = `http://127.0.0.1:8000/api/post/${params.id}/`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        const movieId = data.movie;
        console.log(movieId);
        const movieResponse = await fetch(`http://127.0.0.1:8000/api/movie/${movieId}/`);
        console.log(movieResponse);
        const movieData = await movieResponse.json();
        // Return the fetched data as the response
        return {post: data, movie: movieData};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
