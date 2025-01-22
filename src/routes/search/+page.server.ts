import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
    const selectedCategory = url.searchParams.get('category');
    const activeTab = url.searchParams.get('tab') || 'posts';

    const [postsRes, moviesRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:8000/api/posts'),
        fetch('http://localhost:8000/api/movies'),
        fetch('http://localhost:8000/api/category')
    ]);

    if (!postsRes.ok || !moviesRes.ok || !categoriesRes.ok) {
        console.error('Failed to fetch data');
        return {
            posts: [],
            movies: [],
            categories: [],
            selectedCategory: null
        };
    }

    const [posts, movies, categories] = await Promise.all([
        postsRes.json(),
        moviesRes.json(),
        categoriesRes.json()
    ]);

    return {
        posts,
        movies: selectedCategory 
            ? movies.filter((m: any) => m.category === selectedCategory)
            : movies,
        categories,
        selectedCategory,
        activeTab
    };
};
