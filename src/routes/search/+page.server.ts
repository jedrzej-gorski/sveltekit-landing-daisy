import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch, params}) => {
    try {
        const url = `http://localhost:8000/api/posts/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        // Return the fetched data as the response
        return {posts: data};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
