import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const theme = url.searchParams.get("theme");
		const redirectTo = url.searchParams.get("redirectTo");

		if (theme) {
			cookies.set("colortheme", theme, {
				path: "/",
				maxAge: 60 * 60 * 24 * 365,
			});
		}

		throw redirect(303, redirectTo ?? "/");
	},
};

export const load: PageServerLoad = async ({fetch, params}) => {
    try {
        const url = `http://localhost:8000/api/recent/`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the external server.');
        }

        const data = await response.json();
        return {recentFilms: data};
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};