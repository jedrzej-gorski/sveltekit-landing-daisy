import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch, params, cookies}) => {
    try {
        const token = cookies.get('session');
        const headers = {
            'Authorization': `Token ${token}`
        };

        const url = `http://localhost:8000/api/posts/?created_by_id=${params.id}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.1');
        }

        const data = await response.json();

        const url2 = `http://localhost:8000/api/user/${params.id}`;

        const response2 = await fetch(url2, {headers});

        if (!response2.ok) {
            throw new Error('Failed to fetch data from the external server.2');
        }
        
        const data2 = await response2.json();

        return {blogPosts: data, user: data2};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
