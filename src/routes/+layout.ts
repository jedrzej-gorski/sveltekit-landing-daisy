import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({fetch, params}) => {
    try {
        const url = "http://127.0.0.1:8000/api/pages/";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        // Return the fetched data as the response
        return {data: data};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
