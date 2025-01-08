<script>
	let { title, content, author, id, description } = $props();
</script>

<div class="post-container mx-5 my-2">
	{#if description}
		<div class="flex flex-row items-center gap-2 justify-start">
			<div class="flex flex-col items-center gap-5">
				<div class="text-sm">{author.first_name} {author.last_name}</div>
				<img
					src={`http://127.0.0.1:8000/${author.image}`}
					class="h-[100px] w-auto object-contain"
					alt="Author Image"
				/>
			</div>
			<div class="text-5xl font-bold max-w-[35%] shrink text-justify">{title.toUpperCase()}</div>
			<p class="flex-grow basis-[50%] text-center">{description}</p>
		</div>

		<hr class="taperline" />
	{:else}
		<div class="flex flex-col items-center">
			<div class="text-5xl font-bold max-w-[35%] text-center">{title.toUpperCase()}</div>
			<hr class="taperline w-[50%]" />
			<div class="flex flex-col items-center gap-5">
				<div class="text-sm">{author.first_name} {author.last_name}</div>
				<img
					src={`http://127.0.0.1:8000/${author.image}`}
					class="h-[100px] w-auto object-contain"
					alt="Author Image"
				/>
			</div>
			<hr class="taperline w-[15%]" />
		</div>
	{/if}
	{@html content}
</div>
