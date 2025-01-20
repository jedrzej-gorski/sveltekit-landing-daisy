<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import '$lib/app.css';
	import { themes } from '$lib/utils/themes';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');

		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};
</script>

<div class="bg-opacity-0 w-screen absolute top-0 z-40">
	<div class="flex items-center justify-between p-2 w-screen max-w-4xl mx-auto">
		<div class="">
			<a href="/" class="font-bold text-xl nunito-sans-text">CINEMAHUB</a>
		</div>

		<a href="/search" class="btn btn-ghost nunito-sans-text rounded-sm">
			POSTS
		</a>

		{#if $page.data.session}
			<div class="dropdown dropdown-hover dropdown-end">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="btn btn-ghost nunito-sans-text rounded-sm">{$page.data.user.first_name.toUpperCase()} {$page.data.user.last_name.toUpperCase()}</label>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content menu p-0 shadow bg-base-100 rounded-sm">
					<li>
						<a class="btn btn-primary nunito-sans-text rounded-sm" href="/editor/new"
							>+NEW POST</a
						>
					</li>
					<li>
						<a class="btn btn-ghost nunito-sans-text rounded-sm" href="/blog/{$page.data.user.id}"
							>BLOG</a
						>
					</li>
					<li>
						<a class="btn btn-ghost nunito-sans-text rounded-sm" href="/auth">LOGOUT</a>
					</li>
				</ul>
			</div>
		{:else}
			<a href="/auth" class="btn btn-ghost nunito-sans-text rounded-sm">
				SIGN IN OR REGISTER NEW ACCOUNT
			</a>
		{/if}

		<div class="">
			<div class="dropdown dropdown-hover dropdown-end">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="btn btn-ghost nunito-sans-text rounded-sm">THEME</label>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 h-96 overflow-y-scroll rounded-sm">
					<form method="POST" use:enhance={submitUpdateTheme}>
						{#each themes as theme}
							<li>
								<button formaction="/?/setTheme&theme={theme}&redirectTo={$page.url.pathname}"
									>{theme}</button
								>
							</li>
						{/each}
					</form>
				</ul>
			</div>
		</div>
	</div>
</div>
