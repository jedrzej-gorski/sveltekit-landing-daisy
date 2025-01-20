// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
interface User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	image: string;
	username: string;
}

interface Session {
	token: string;
}

declare namespace App {
	interface Locals {
		user: User | null;
		session: Session | null;
	}
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}
