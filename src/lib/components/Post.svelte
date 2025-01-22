<script>
	let { title, content, author, id, description, movie, created_at } = $props();
</script>

<div class="flex rounded-sm p-7 flex-col gap-3 justify-center w-[70%]  my-[80px] bg-base-100">
	<div class=" nunito-sans-text flex flex-row items-center gap-2 py-5 justify-start">
		<a href={`/blog/${author.id}`} class="hover:opacity-80 transition-opacity">
			<img
				src={`http://localhost:8000/${author.image}`}
				class="h-[70px] w-[70px] object-cover rounded-full"
				alt="Author Image"
			/>
		</a>
		<div class="flex flex-col items-start gap-3 ">
			<div class="text-md">{author.first_name} {author.last_name}</div>
			<div class="text-md">{new Date(created_at).toLocaleDateString()}</div>
		</div>
	</div>
	<div class="merriweather-title text-5xl w-full text-center">{title.toUpperCase()}</div>
	{#if description}
		<div class="nunito-sans-text text-center font-bold text-lg">{description}</div>
	{/if}
	<div class="nunito-sans-text"> {@html content}</div>
	
</div>

<style>
</style>
