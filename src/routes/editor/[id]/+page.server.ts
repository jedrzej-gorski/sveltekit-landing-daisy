import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    const token = locals.session?.token;
    if (!token) {
        throw redirect(303, '/auth');
    }

    try {
        // Fetch post details
        const response = await fetch(`http://localhost:8000/api/post/details/${params.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw error(404, 'Post not found');
        }

        const postData = await response.json();

        // Fetch available templates for the template selector
        const templatesResponse = await fetch(`http://localhost:8000/api/templates`);
        const templates = await templatesResponse.json();

        // Fetch movies for the movie selector
        const moviesResponse = await fetch(`http://localhost:8000/api/movies`);
        const movies = await moviesResponse.json();

        return {
            id: params.id,
            post: postData,
            templates,
            movie: movies
        };
    } catch (e) {
        console.error('Error loading post:', e);
        throw error(500, 'Failed to access post\'s editor');
    }
};

export const actions = {
    default: async ({ request, params, fetch, locals }) => {
        const token = locals.session?.token;
        if (!token) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title')?.toString() || '';
        const content = formData.get('description')?.toString() || '';
        const status = parseInt(formData.get('status')?.toString() || '1');
        const movie_id = formData.get('movie_id')?.toString();
        const templatesData = formData.get('templates')?.toString() || '[]';
        
        let templates;
        try {
            templates = JSON.parse(templatesData);
        } catch (e) {
            console.error('Error parsing templates:', e);
            return fail(400, { error: 'Invalid template data' });
        }

        try {
            const response = await fetch(`http://localhost:8000/api/post/${params.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    status,
                    movie_id: movie_id || null,
                    content,
                    templates
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Server response error:', errorData);
                return fail(400, { 
                    error: 'Failed to update post',
                    title,
                    content,
                    movie_id,
                    templates: templatesData
                });
            }
        } catch (error) {
            console.error('Error updating post:', error);
            return fail(500, { error: 'Server error occurred' });
        }

        // Move redirect outside of try-catch
        return redirect(303, `/post/${params.id}`);
    }
} satisfies Actions;
