import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, fetch, request }) => {
    const token = locals.session?.token;
    
    if (!token) {
        throw redirect(303, '/auth');
    }

    // Get the referring URL, fallback to home if not available
    const referrer = request.headers.get('Referer') || '/';

    try {
        const response = await fetch(`http://localhost:8000/api/post/${params.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        return redirect(303, referrer);
    } catch (error) {
        console.error('Error deleting post:', error);
        return redirect(303, referrer);
    }
}; 