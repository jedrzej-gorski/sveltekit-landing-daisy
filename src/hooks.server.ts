import type { Handle } from "@sveltejs/kit";
import { getCurrentUser } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const protectedRoutes = ['/editor', '/drafts', '/delete'];

	const isProtectedRoute = protectedRoutes.some(route =>
		event.url.pathname.startsWith(route)
	);


	const session = event.cookies.get('session');
	if (session) {
		const user = await getCurrentUser(event.fetch, session);
		if (user) {
			event.locals.user = user;
			event.locals.session = { token: session };
		} else {
			// Invalid token, clear it
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
			event.locals.session = null;

			// If this is a protected route, redirect to auth
			if (isProtectedRoute) {
				throw redirect(303, '/auth');
			}
		}
	} else {
		event.locals.user = null;
		event.locals.session = null;

		// If this is a protected route, redirect to auth
		if (isProtectedRoute) {
			throw redirect(303, '/auth');
		}
	}


	// Theme handling
	let theme: string | null = null;
	const newTheme = event.url.searchParams.get("theme");
	const cookieTheme = event.cookies.get("colortheme");

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('data-theme=""', `data-theme="${theme}"`),
		});
	}

	return await resolve(event);
}
