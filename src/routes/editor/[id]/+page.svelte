<script lang="ts">
	import { Editor } from '@tadashi/svelte-editor-quill';
	import { enhance } from '$app/forms';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	interface Field {
		field_id: number;
		field_name: string;
		content: string;
	}

	interface Template {
		template_id: number;
		order: number;
		fields: Field[];
	}

	interface Movie {
		id: number;
		title: string;
		poster: string;
	}

	interface MetaTemplate {
		id: number;
		name: string;
		description: string;
		image: string;
		fields: Array<{
			id: number;
			name: string;
			description: string;
			type: string;
		}>;
	}

	interface ValuatedTemplate {
		id: number;
		template: MetaTemplate;
		valuations: Array<{
			field_id: number;
			value: string;
		}>;
	}

	interface PageData {
		post: {
			id: number;
			title: string;
			content: string;
			movie_id: number | null;
			templates: Array<{
				template_id: number;
				order: number;
				fields: Array<{
					field_id: number;
					name: string;
					content: string;
				}>;
			}>;
		};
		templates: Template[];
		movie: Movie[];
	}

	let { data } = $props<{ data: PageData }>();
	let title = $state(data.post.title);
	let description = $state(data.post.content || '');
	let selectedMovie = $state(data.post.movie_id);
	let searchTerm = $state(
		data.post.movie_id 
			? data.movie.find((m: Movie) => m.id === data.post.movie_id)?.title || ''
			: ''
	);
	let isComboboxOpen = $state(false);
	let titleError = $state(false);
	let movieError = $state(false);
	let movies = data.movie;

	// Initialize templates from post data
	let valuatedTemplates = $state(
		data.post.templates.map((t: Template) => ({
			id: t.template_id,
			template: data.templates.find((template: MetaTemplate) => template.id === t.template_id)!,
			valuations: t.fields.map((f: Field) => ({
				field_id: f.field_id,
				value: f.content
			}))
		}))
	);

	let html = $state<Record<string, string>>({});
	// Initialize html state from templates
	data.post.templates.forEach((t: Template) => {
		t.fields.forEach((f: Field) => {
			html[`${t.template_id}-${f.field_id}`] = f.content;
		});
	});

	let nextIndex = $derived.by(
		() => Math.max(...valuatedTemplates.map((t: ValuatedTemplate) => t.id)) + 1
	);

	let filteredMovies = $derived(
		searchTerm
			? movies.filter((movie: Movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
			: movies
	);

	const options: Record<string, any> = {
		theme: 'snow',
		plainclipboard: true
	};

	function addTemplate(template: MetaTemplate) {
		valuatedTemplates = [
			...valuatedTemplates,
			{
				id: nextIndex,
				template,
				valuations: template.fields.map((field) => ({
					field_id: field.id,
					value: ''
				}))
			}
		];
	}

	function removeTemplate(index: number) {
		valuatedTemplates = valuatedTemplates.filter((_: ValuatedTemplate, i: number) => i !== index);
	}

	function moveTemplate(index: number, direction: 'up' | 'down') {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= valuatedTemplates.length) return;

		const temp = valuatedTemplates[index];
		valuatedTemplates[index] = valuatedTemplates[newIndex];
		valuatedTemplates[newIndex] = temp;
		valuatedTemplates = [...valuatedTemplates];
	}

	const onTextChange = (
		markup: string,
		_plaintext: string,
		templateIndex: number,
		templateId: number,
		fieldId: number
	) => {
		const key = `${templateId}-${fieldId}`;
		html[key] = markup;

		valuatedTemplates[templateIndex].valuations = valuatedTemplates[templateIndex].valuations.map(
			(v: { field_id: number; value: string }) => (v.field_id === fieldId ? { ...v, value: markup } : v)
		);
	};

	function autoResize(e: Event) {
		const textarea = e.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 5 + 'px';
	}

	function selectMovie(movie: Movie | null) {
		selectedMovie = movie?.id ?? null;
		searchTerm = movie?.title ?? '';
		isComboboxOpen = false;
	}

	onMount(() => {
		// Get both textareas and resize them
		const titleTextarea = document.querySelector('textarea[name="title"]') as HTMLTextAreaElement;
		const descriptionTextarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
		
		if (titleTextarea) {
			titleTextarea.style.height = 'auto';
			titleTextarea.style.height = titleTextarea.scrollHeight + 5 + 'px';
		}
		
		if (descriptionTextarea) {
			descriptionTextarea.style.height = 'auto';
			descriptionTextarea.style.height = descriptionTextarea.scrollHeight + 5 +'px';
		}
	});

</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/quill@2.0.3/dist/quill.snow.css"
		crossorigin="anonymous"
	/>
</svelte:head>

<div
	class="flex flex-col items-center min-h-screen mt-[100px] bg-base-100 p-6 rounded-sm max-w-[60%] w-[60%]"
>
	<form
		method="POST"
		use:enhance={({ formData }) => {
			movieError = false;
			if (!selectedMovie) {
				movieError = true;
				return;
			}
			// Add templates data to form
			const templates = valuatedTemplates.map((vt: ValuatedTemplate, index: number) => ({
				template_id: vt.template.id,
				order: index + 1,
				fields: vt.valuations.map(v => ({
					field_id: v.field_id,
					content: html[`${vt.template.id}-${v.field_id}`] || ''
				}))
			}));
			formData.append('templates', JSON.stringify(templates));
		}}
		class="w-full"
	>
		<textarea
			name="title"
			bind:value={title}
			class="border-dashed border bg-transparent text-base-content merriweather-welcome w-full text-5xl text-center mb-2 overflow-hidden resize-none {titleError
				? 'border-error'
				: ''}"
			placeholder="Title"
			rows="1"
			style="height: auto;"
			oninput={autoResize}
		></textarea>
		{#if titleError}
			<p class="text-error text-sm mb-6">Title is required</p>
		{/if}

		<textarea
			id="description"
			name="description"
			bind:value={description}
			class="nunito-sans-text border-dashed border bg-transparent text-base-content w-full text-2xl text-center mb-8 resize-none overflow-hidden"
			placeholder="Description"
			rows="1"
			style="height: auto;"
			oninput={autoResize}
		></textarea>

		<!-- Add Movie Selector -->
		<div class="w-full mb-8">
			<label for="movie-search" class="nunito-sans text-2xl mb-4 block">Movie</label>
			<div class="relative">
				<input
					id="movie-search"
					type="text"
					class="nunito-sans input input-bordered w-full {movieError ? 'input-error' : ''}"
					placeholder="Search for a movie..."
					bind:value={searchTerm}
					onfocus={() => (isComboboxOpen = true)}
					autocomplete="off"
				/>

				<!-- Hidden input for form submission -->
				<input type="hidden" name="movie_id" value={selectedMovie || ''} />

				{#if isComboboxOpen && (searchTerm || filteredMovies.length > 0)}
					<div
						class="absolute z-50 w-full mt-1 bg-base-200 border border-base-content/20 rounded-sm shadow-lg max-h-60 overflow-auto"
					>
						<button
							type="button"
							class="w-full px-4 py-2 text-left hover:bg-base-300 focus:bg-base-300 nunito-sans"
							onclick={() => selectMovie(null)}
						>
							Clear selection
						</button>

						{#each filteredMovies as movie}
							<button
								type="button"
								class="w-full px-4 py-2 text-left hover:bg-base-300 focus:bg-base-300 flex items-center gap-2 nunito-sans"
								onclick={() => selectMovie(movie)}
							>
								{#if movie.poster}
									<img
										src="http://localhost:8000{movie.poster}"
										alt={movie.title}
										class="w-8 h-12 object-cover rounded-sm"
									/>
								{/if}
								<span class="nunito-sans">{movie.title}</span>
							</button>
						{/each}
					</div>
				{/if}

				{#if movieError}
					<p class="text-error text-sm mt-1">Please select a movie</p>
				{/if}
			</div>
		</div>

		<!-- Template Selection -->
		<div class="w-full mb-8">
			<h2 class="nunito-sans text-2xl mb-4">Available Templates</h2>
			<div class="flex flex-wrap gap-4">
				{#each data.templates as template}
					<button
						type="button"
						class="btn btn-primary rounded-sm nunito-sans-text"
						onclick={() => addTemplate(template)}
					>
						{template.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- Template Editors -->
		<div class="w-full max-w-full space-y-8">
			{#each valuatedTemplates as { template }, templateIndex}
				<div class="max-w-full card bg-base-200 p-4">
					<input type="hidden" name={`order-${template.id}`} value={templateIndex} />

					<div class="flex justify-between items-center mb-4">
						<h3 class="text-xl font-bold nunito-sans-text">{template.name}</h3>
						<div class="flex gap-2">
							{#if templateIndex > 0}
								<button
									type="button"
									class="btn btn-sm btn-ghost nunito-sans-text"
									onclick={() => moveTemplate(templateIndex, 'up')}
								>
									↑
								</button>
							{/if}
							{#if templateIndex < valuatedTemplates.length - 1}
								<button
									type="button"
									class="btn btn-sm btn-ghost nunito-sans-text"
									onclick={() => moveTemplate(templateIndex, 'down')}
								>
									↓
								</button>
							{/if}
							<button
								type="button"
								class="btn btn-sm btn-error rounded-sm nunito-sans-text font-bold"
								onclick={() => removeTemplate(templateIndex)}
							>
								Remove
							</button>
						</div>
					</div>

					{#if template.name === 'Układ dwukolumnowy'}
						<div class="flex flex-row gap-3">
							<div class="w-1/2 min-w-0">
								<label class="sr-only" for={`field-${template.id}-${template.fields[0].id}`}>
									<span class="label-text">{template.fields[0].name}</span>
								</label>
								<input
									type="text"
									id={`field-${template.id}-${template.fields[0].id}`}
									name={`field-${template.id}-${template.fields[0].id}`}
									class="sr-only"
									bind:value={html[`${template.id}-${template.fields[0].id}`]}
									hidden
								/>
								<Editor
									{options}
									onTextChange={(html: string, text: string) =>
										onTextChange(html, text, templateIndex, template.id, template.fields[0].id)}
									class="w-full bg-base-100 border border-base-content/20 rounded-sm"
								>
									{@html $state.snapshot(html[`${template.id}-${template.fields[0].id}`] || '')}
								</Editor>
							</div>
							<div class="w-1/2 min-w-0">
								<label class="sr-only" for={`field-${template.id}-${template.fields[1].id}`}>
									<span class="label-text">{template.fields[1].name}</span>
								</label>
								<input
									type="text"
									id={`field-${template.id}-${template.fields[1].id}`}
									name={`field-${template.id}-${template.fields[1].id}`}
									class="sr-only"
									bind:value={html[`${template.id}-${template.fields[1].id}`]}
									hidden
								/>
								<Editor
									{options}
									onTextChange={(html: string, text: string) =>
										onTextChange(html, text, templateIndex, template.id, template.fields[1].id)}
									class="w-full bg-base-100 border border-base-content/20 rounded-sm"
								>
									{@html $state.snapshot(html[`${template.id}-${template.fields[1].id}`] || '')}
								</Editor>
							</div>
						</div>
					{:else if template.name === 'Obraz na środku'}
						<div class="mb-4">
							<label class="sr-only" for={`field-${template.id}-${template.fields[0].id}`}>
								<span class="label-text">{template.fields[0].name}</span>
							</label>
							<img
								src={html[`${template.id}-${template.fields[0].id}`]}
								class="mx-auto hidden"
								alt="Your upload"
								onload={(e) => e.currentTarget.classList.remove('hidden')}
								onerror={(e) => e.currentTarget.classList.add('hidden')}
							/>
							<input
								type="text"
								id={`field-${template.id}-${template.fields[0].id}`}
								name={`field-${template.id}-${template.fields[0].id}`}
								class="w-full mx-auto border border-base-content/20 mt-[15px] rounded-sm bg-base-100 nunito-sans-text"
								bind:value={html[`${template.id}-${template.fields[0].id}`]}
							/>
						</div>
					{:else}
						{#each template.fields as field}
							<div class="mb-4">
								<label class="sr-only" for={`field-${template.id}-${field.id}`}>
									<span class="label-text">{field.name}</span>
								</label>
								<input
									type="text"
									id={`field-${template.id}-${field.id}`}
									name={`field-${template.id}-${field.id}`}
									class="sr-only"
									bind:value={html[`${template.id}-${field.id}`]}
									hidden
								/>
								<Editor
									{options}
									onTextChange={(html: string, text: string) =>
										onTextChange(html, text, templateIndex, template.id, field.id)}
									class="w-full max-w-full bg-base-100 border border-base-content/20 rounded-sm"
								>
									{@html $state.snapshot(html[`${template.id}-${field.id}`] || '')}
								</Editor>
								{#if field.description}
									<p class="text-sm text-base-content/70 mt-1">{field.description}</p>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</div>

		<div class="flex gap-4 mt-8">
			<button 
				type="submit" 
				class="btn btn-secondary rounded-sm nunito-sans-text"
				name="status" 
				value="1"
			>
				Make Draft
			</button>
			<button 
				type="submit" 
				class="btn btn-primary rounded-sm nunito-sans-text"
				name="status" 
				value="2"
			>
				Publish
			</button>
		</div>
	</form>
</div>

<!-- Add click outside handling -->
<svelte:window
	onclick={(e) => {
		const target = e.target as HTMLElement;
		if (!target.closest('#movie-search')) {
			isComboboxOpen = false;
		}
	}}
/>

<style>
	/* Add these global styles for Quill editor */
	:global(.ql-container) {
		overflow-y: auto;
		box-sizing: border-box;
		font-family: 'Nunito Sans', sans-serif !important;
	}

	:global(.ql-editor) {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

    :global(.ql-editor p) {
        font-family: 'Nunito Sans', sans-serif !important;
    }

</style>
