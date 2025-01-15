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

		<a href="/search" class="btn btn-ghost">
			Posts
		</a>

		<div class="">
			<div class="dropdown dropdown-hover dropdown-end opacity-0">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="btn">Theme</label>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 h-96 overflow-scroll">
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
