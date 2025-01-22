<script lang="ts">
    let {title, content, author, image, id, editable} = $props();
	let height = $state(0);

    function handleDelete(event: MouseEvent) {
        if (!confirm('Are you sure you want to delete this post?')) {
            event.preventDefault();
        }
    }
</script>

<div class="relative w-[300px] group">
    {#if editable}
        <a 
            href={`/editor/${id}`} 
            class="absolute bottom-1 right-1 z-20 btn btn-sm btn-circle bg-transparent hover:bg-white/20 border-0 shadow-none text-white"
            aria-label="Edit post"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="w-4 h-4"
            >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
        </a>
		<a 
		href={`/delete/${id}`} 
		class="absolute top-1 right-1 z-20 btn btn-sm btn-circle bg-transparent hover:bg-red-500/20 border-0 shadow-none text-white"
		aria-label="Delete post"
		onclick={handleDelete}
	>
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="white" 
			stroke-width="2" 
			stroke-linecap="round" 
			stroke-linejoin="round" 
			class="w-4 h-4"
		>
			<path d="M3 6h18"></path>
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
		</svg>
	</a>
    {/if}
    <a 
        href={`/post/${id}`} 
        class="w-[300px] card flex bg-base-100 shadow-xl image-full z-10" 
        style={`background-image: url('http://localhost:8000${image}'); background-size: cover;`}
    >
        <div class="card-body h-[225px]">
            <h2 class="card-title overflow-hidden nunito-sans-text font-bold h-[50px]">{title}</h2>
            <div class="overflow-hidden flex-grow nunito-sans-text">
                <p class={height > 151 ? 'card-body-scroll' : ''} bind:clientHeight={height}>{content}</p>
            </div>
            <!--<div class="card-actions justify-end">
                <button class="btn btn-primary">{author.first_name} {author.last_name}</button>
            </div>-->
        </div>
    </a>
</div>
