import { fail } from '@sveltejs/kit';
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
    templateIndex: number;
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
        
        try {
            const title = formData.get('title')?.toString() || '';
            const content = formData.get('description')?.toString() || '';
            const status = parseInt(formData.get('status')?.toString() || '1');
            const movie_id = formData.get('movie_id')?.toString();
            const entries = Array.from(formData.entries());
            const templates: TemplateFormData[] = [];
            let currentTemplate: TemplateFormData | null = null;

            // Process field entries
            for (const [key, value] of entries) {
                if (key.startsWith('field-')) {
                    const [_, templateIndex, fieldId] = key.split('-').map(Number);
                    const order = parseInt(formData.get(`order-${templateIndex}`)?.toString() || templateIndex.toString());
                    
                    if (!currentTemplate || currentTemplate.templateIndex !== templateIndex) {
                        currentTemplate = {
                            templateIndex,
                            order,
                            fields: []
                        };
                        templates.push(currentTemplate);
                    }

                    currentTemplate.fields.push({
                        field_id: fieldId,
                        content: value.toString()
                    });
                }
            }

            // Sort templates by order before sending
            templates.sort((a, b) => a.order - b.order);

            const response = await fetch('http://localhost:8000/api/post/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
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
                return fail(400, { 
                    error: 'Failed to save document',
                    title,
                    formData: Object.fromEntries(formData)
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Form submission error:', error);
            return fail(500, { 
                error: 'Server error occurred',
                title: formData.get('title')?.toString()
            });
        }
    }
} satisfies Actions;
