<script lang="ts">
    import { Editor } from "@tadashi/svelte-editor-quill";
    import { enhance } from '$app/forms';
    interface Template {
        id: number;
        name: string;
        description: string;
        image: string;
        fields: {
            id: number;
            name: string;
            description: string;
            type: string;
        }[];
    }

    interface ValuatedTemplate {
        id: number;
        template: Template;
        valuations: {
            field_id: number;
            value: string;
        }[];
    }

    interface Movie {
        id: number;
        title: string;
        poster: string;
    }

    let {data} = $props();
    let templates: Template[] = data.templates;
    let movies: Movie[] = data.movie;
    let selectedMovie = $state<number | null>(null);
    let valuatedTemplates: ValuatedTemplate[] = $state([]);
    let html: Record<string, string> = $state({});
    let title = $state("");
    let description = $state("");
    let nextIndex = $state(0);
    let searchTerm = $state('');
    let isComboboxOpen = $state(false);
    let titleError = $state(false);
    let movieError = $state(false);

    let filteredMovies = $derived(searchTerm 
        ? movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : movies);

    const options: Record<string, any> = {
        theme: 'snow',
        plainclipboard: true,
    }

    function addTemplate(template: Template) {
        const newIndex = nextIndex;
        nextIndex++;
        valuatedTemplates = [...valuatedTemplates, {
            id: newIndex,
            template,
            valuations: template.fields.map(field => ({
                field_id: field.id,
                value: ''
            }))
        }];
    }

    function removeTemplate(index: number) {
        valuatedTemplates = valuatedTemplates.filter((_, i) => i !== index);
    }

    function moveTemplate(index: number, direction: 'up' | 'down') {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= valuatedTemplates.length) return;

        // Swap order values
        const temp = valuatedTemplates[index];
        valuatedTemplates[index] = valuatedTemplates[newIndex];
        valuatedTemplates[newIndex] = temp;
    }

    const onTextChange = (markup: string, _plaintext: string, templateIndex: number, templateId: number, fieldId: number) => {
        const key = `${templateId}-${fieldId}`;
        html[key] = markup;
        
        valuatedTemplates[templateIndex].valuations = 
            valuatedTemplates[templateIndex].valuations.map(v => 
                v.field_id === fieldId ? {...v, value: markup} : v
            );
    }

    function autoResize(e: Event) {
        const textarea = e.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 5 + 'px';
    }

    async function submitForm(status: 1 | 2) {
        // Reset error state
        titleError = false;
        movieError = false;

        // Validate title
        if (!title.trim()) {
            titleError = true;
            return;
        }

        // Validate movie selection
        if (!selectedMovie) {
            movieError = true;
            return;
        }

        const form = document.getElementById('documentForm') as HTMLFormElement;
        const formData = new FormData(form);
        formData.append('status', status.toString());
        formData.append('movie_id', selectedMovie.toString());
        
        // Instead of using fetch directly, submit the form
        form.submit();
    }

    function selectMovie(movie: Movie | null) {
        selectedMovie = movie?.id ?? null;
        searchTerm = movie?.title ?? '';
        isComboboxOpen = false;
    }

    $inspect(valuatedTemplates);
</script>

<style>
    /* Add these global styles for Quill editor */
    :global(.ql-container) {
        overflow-y: auto;
        box-sizing: border-box; /* Include padding and border in the width */
        font-family: 'Nunito Sans', sans-serif !important;
    }

    :global(.ql-editor) {
        white-space: pre-wrap; /* Allow wrapping of text */
        word-wrap: break-word; /* Break long words */
    }

    :global(.ql-editor p) {
        font-family: 'Nunito Sans', sans-serif !important;
    }
</style>


<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/quill@2.0.3/dist/quill.snow.css"
        crossorigin="anonymous"
    />
</svelte:head>

<div class="flex flex-col items-center min-h-screen mt-[100px] bg-base-100 p-6 rounded-sm max-w-[60%] w-[60%]">
    <form 
        use:enhance={({ formData }) => {
            // You can add any pre-submission logic here
            formData.append('status', '1'); // Default status
            return async ({ result, update }) => {
                // Handle the result if needed
                await update();
            };
        }}
        id="documentForm"
        method="POST" 
        class="w-full"
    >
        <textarea 
            name="title" 
            bind:value={title} 
            class="border-dashed border bg-transparent text-base-content merriweather-welcome w-full text-5xl text-center mb-2 overflow-hidden resize-none {titleError ? 'border-error' : ''}" 
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
            <label for="movie-search" class="nunito-sans-text text-2xl mb-4 block">Movie</label>
            <div class="relative">
                <input
                    id="movie-search"
                    type="text"
                    class="nunito-sans-text input input-bordered w-full {movieError ? 'input-error' : ''}"
                    placeholder="Search for a movie..."
                    bind:value={searchTerm}
                    onfocus={() => isComboboxOpen = true}
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
                            class="w-full px-4 py-2 text-left hover:bg-base-300 focus:bg-base-300 nunito-sans-text"
                            onclick={() => selectMovie(null)}
                        >
                            Clear selection
                        </button>
                        
                        {#each filteredMovies as movie}
                            <button
                                type="button"
                                class="w-full px-4 py-2 text-left hover:bg-base-300 focus:bg-base-300 flex items-center gap-2 nunito-sans-text"
                                onclick={() => selectMovie(movie)}
                            >
                                {#if movie.poster}
                                    <img 
                                        src="http://localhost:8000{movie.poster}" 
                                        alt={movie.title} 
                                        class="w-8 h-12 object-cover rounded-sm"
                                    />
                                {/if}
                                <span class="nunito-sans-text">{movie.title}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
            {#if movieError}
                <p class="text-error text-sm mt-1">Please select a movie</p>
            {/if}
        </div>

        <!-- Template Selection -->
        <div class="w-full mb-8">
            <h2 class="nunito-sans-text text-2xl mb-4">Available Templates</h2>
            <div class="flex flex-wrap gap-4">
                {#each templates as template}
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
            {#each valuatedTemplates as {template}, templateIndex}
                <div class="max-w-full card bg-base-200 p-4">
                    <input 
                        type="hidden" 
                        name={`order-${template.id}`} 
                        value={templateIndex} 
                    />
                    
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
                                class="btn btn-sm btn-error rounded-sm nunito-sans-text"
                                onclick={() => removeTemplate(templateIndex)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                    
                    {#if template.name === "Układ dwukolumnowy" }
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
                                        onTextChange(html, text, templateIndex, template.id, template.fields[0].id)
                                    } 
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
                                        onTextChange(html, text, templateIndex, template.id, template.fields[1].id)
                                    } 
                                    class="w-full bg-base-100 border border-base-content/20 rounded-sm"
                                >
                                    {@html $state.snapshot(html[`${template.id}-${template.fields[1].id}`] || '')}
                                </Editor>
                            </div>
                        </div>  
                    {:else if template.name === "Obraz na środku"}
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
                            <input type="text" id={`field-${template.id}-${template.fields[0].id}`} name={`field-${template.id}-${template.fields[0].id}`} class="w-full mx-auto border border-base-100/20 mt-[10px] rounded-sm bg-base-100 nunito-sans-text" bind:value={html[`${template.id}-${template.fields[0].id}`]}/>
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
                                        onTextChange(html, text, templateIndex, template.id, field.id)
                                    } 
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

        {#if valuatedTemplates.length > 0}
            <div class="flex gap-4 mt-8">
                <button 
                    type="button"
                    class="btn btn-secondary rounded-sm nunito-sans-text"
                    onclick={() => submitForm(1)}
                >
                    Save as Draft
                </button>
                <button 
                    type="button"
                    class="btn btn-primary rounded-sm nunito-sans-text"
                    onclick={() => submitForm(2)}
                >
                    Publish
                </button>
            </div>
        {/if}
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
