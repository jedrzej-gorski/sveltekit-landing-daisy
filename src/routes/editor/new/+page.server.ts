import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({fetch, params}) => {
    try {
        const url = `http://localhost:8000/api/templates`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();

        const movieUrl = `http://localhost:8000/api/movies`;
        const movieResponse = await fetch(movieUrl);
        const movieData = await movieResponse.json();

        
        return {templates: data, movie: movieData};
    } catch (error) {
        console.error('Error fetching data:', error);
        return { templates: [] };
    }
};

interface TemplateFormData {
    template_id: number;
    order: number;
    fields: Array<{
        field_id: number;
        content: string;
    }>;
}

export const actions = {
    default: async ({ request, fetch, locals }) => {
        const formData = await request.formData();
        const token = locals.session?.token;
        let newPostId : number | null = null;
        
        try {
            const title = formData.get('title')?.toString() || '';
            const content = formData.get('description')?.toString() || '';
            const status = parseInt(formData.get('status')?.toString() || '1');
            const movie_id = formData.get('movie_id')?.toString();
            
            // Log all form entries for debugging
            console.log('All form entries:', Array.from(formData.entries()));
            
            const entries = Array.from(formData.entries());
            const templates: TemplateFormData[] = [];

            // Process field entries
            for (const [key, value] of entries) {
                console.log('Processing key:', key, 'value:', value);
                
                if (key.startsWith('field-')) {
                    const [_, templateId, fieldId] = key.split('-').map(Number);
                    console.log('Parsed IDs:', { templateId, fieldId });
                    
                    const order = parseInt(formData.get(`order-${templateId}`)?.toString() || '0');
                    console.log('Order:', order);

                    // Find existing template or create new one
                    let template = templates.find(t => t.template_id === templateId);
                    if (!template) {
                        template = {
                            template_id: templateId,
                            order,
                            fields: []
                        };
                        templates.push(template);
                        console.log('Created new template:', template);
                    }

                    template.fields.push({
                        field_id: fieldId,
                        content: value.toString()
                    });
                    console.log('Added field:', { field_id: fieldId, content: value.toString() });
                }
            }

            console.log('Final templates array:', templates);
            
            const body = {
                title,
                status,
                movie_id: movie_id || null,
                content,
                templates
            }
            console.log('Request body:', body);

            const response = await fetch('http://localhost:8000/api/post/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                return fail(400, { 
                    error: 'Failed to save document',
                    title,
                    formData: Object.fromEntries(formData)
                });
            }
            
            const data = await response.json();
            newPostId = data.id;
            console.log('Response data:', data);
            console.log('New post ID:', newPostId, typeof newPostId);
            
            if (!newPostId) {
                return fail(400, { 
                    error: 'No post ID returned from server',
                    title: formData.get('title')?.toString()
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            return fail(500, { 
                error: 'Server error occurred',
                title: formData.get('title')?.toString()
            });
        }
        
        console.log('About to redirect to:', `/post/${newPostId}`);
        redirect(303, `/post/${newPostId}`);
    }
} satisfies Actions;
