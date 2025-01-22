<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	let { data } = $props();
	let searchTerm = $state('');
	let activeTab = $state($page.url.searchParams.get('tab') || 'posts');
	
	let filteredPosts = $derived(
		searchTerm
			? data.posts.filter((post: any) => 
				post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.content.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: data.posts
	);

	let filteredMovies = $derived(
		searchTerm
			? data.movies.filter((movie: any) => 
				movie.title.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: data.movies
	);

    function selectCategory(category: string | null) {
        const url = new URL(window.location.href);
        if (category) {
            url.searchParams.set('category', category);
        } else {
            url.searchParams.delete('category');
        }
        url.searchParams.set('tab', 'movies');
        window.location.href = url.toString();
    }

    function setActiveTab(tab: 'posts' | 'movies') {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.location.href = url.toString();
    }
</script>

<div class="flex flex-col items-center min-h-screen mt-[100px] bg-base-100 p-6 rounded-sm max-w-[60%] w-[60%]">
	<div class="w-full mb-8">
		<input
			type="text"
			class="input input-bordered w-full nunito-sans-text"
			placeholder="Search posts and movies..."
			bind:value={searchTerm}
		/>
	</div>

	<div class="flex w-full mb-8 bg-base-200 rounded-sm overflow-hidden">
		<button 
			class="flex-1 py-2 nunito-sans-text border-r border-base-content/20 {activeTab === 'posts' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}"
			onclick={() => setActiveTab('posts')}
		>
			Posts
		</button>
		<button 
			class="flex-1 py-2 nunito-sans-text {activeTab === 'movies' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}"
			onclick={() => setActiveTab('movies')}
		>
			Movies
		</button>
	</div>

    {#if activeTab === 'movies'}
        <div class=" w-full mb-8 flex gap-2 flex-wrap">
            <button
                class="btn btn-sm {!data.selectedCategory ? 'btn-primary' : 'btn-ghost'} rounded-sm nunito-sans-text"
                onclick={() => selectCategory(null)}
            >
                All
            </button>
            {#each data.categories as category}
                <button
                    class="btn btn-sm {data.selectedCategory === category.name ? 'btn-primary' : 'btn-ghost'} rounded-sm nunito-sans-text"
                    onclick={() => selectCategory(category.name)}
                >
                    {category.name}
                </button>
            {/each}
        </div>
    {/if}

	{#if activeTab === 'posts'}
		<div class="grid grid-cols-[repeat(auto-fill,300px)] gap-8 justify-center w-full">
			{#each filteredPosts as post}
				{#if post.status === "Published"}
					<Card 
						title={post.title}
						content={post.content}
						author={post.author}
						image={post.poster}
						id={post.id}
						editable={false}
					/>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-[repeat(auto-fill,200px)] gap-6 justify-center w-full">
			{#each filteredMovies as movie}
				<a href="/movie/{movie.id}" class="w-[200px] h-[285px]">
					<img 
						src="http://localhost:8000{movie.poster}" 
						alt={movie.title}
						class="w-full h-full object-cover"
					/>
				</a>
			{/each}
		</div>
	{/if}

    {#if (activeTab === 'posts' && filteredPosts.length === 0) || (activeTab === 'movies' && filteredMovies.length === 0)}
        <div class="w-full text-center mt-8">
            <p class="nunito-sans-text text-lg opacity-70">No results found</p>
        </div>
    {/if}
</div>