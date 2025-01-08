import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch, params}) => {
    try {
        const url = `http://127.0.0.1:8000/api/posts/`;

        const response = await fetch(url);
        console.log(response);
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
