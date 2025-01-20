import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, cookies, locals }) => {
    try {
        const url = "http://localhost:8000/api/pages/";
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        
        // Return the fetched data and auth data
        return {
            data: data,
            user: locals.user,
            session: locals.session
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            user: locals.user,
            session: locals.session
        };
    }
};

