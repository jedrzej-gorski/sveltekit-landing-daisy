<script>
    let {title, content, author, image, id} = $props();
	let height = $state(0);
</script>

<a href={`/post/${id}`} class="w-[300px] card flex bg-base-100 shadow-xl image-full" style="background-image: url('http://127.0.0.1:8000/{image}'); background-size: cover;">
	<div class="card-body h-[225px]">
		<h2 class="card-title overflow-hidden h-[50px]">{title}</h2>
		<div class="overflow-hidden flex-grow">
			<p class={height > 151 ? 'card-body-scroll' : ''} bind:clientHeight={height}>{content}</p>
		</div>
		<!--<div class="card-actions justify-end">
			<button class="btn btn-primary">{author.first_name} {author.last_name}</button>
		</div>-->
	</div>
</a>
