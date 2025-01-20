import type { Handle } from "@sveltejs/kit";
import { getCurrentUser } from '$lib/auth';

export const handle = (async ({ event, resolve }) => {
	let theme: string | null = null;

	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("colortheme");

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	const session = event.cookies.get('session');
	if (session) {
		const user = await getCurrentUser(event.fetch, session);
		event.locals.user = user;
		event.locals.session = { token: session };
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('data-theme=""', `data-theme="${theme}"`),
		});
	}

	return await resolve(event);
}) satisfies Handle;
