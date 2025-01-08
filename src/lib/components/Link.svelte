<script>
	let { id, title } = $props();
</script>

<a
	class="w-full text-nowrap text-neutral-content bg-neutral rounded-lg shadow-lg p-4 text-xl font-bold text-center hover:bg-base-300 transition-all duration-300"
	href="/page/{id}"
>
	<div>{title}</div>
</a>
