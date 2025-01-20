import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch, params}) => {
    try {
        const url = `http://localhost:8000/api/page/${params.id}/`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        // Return the fetched data as the response
        return {pages: data};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
