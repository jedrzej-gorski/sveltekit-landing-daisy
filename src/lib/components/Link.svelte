<script>
	let { id, title } = $props();
</script>

<a
	class="text-nowrap nunito-sans-text text-base-content underline opacity-75 p-4 text-sm md:text-lg sm:text-md font-bold text-center hover:bg-base-300 transition-all duration-300"
	href="/page/{id}"
>
	<div>{title}</div>
</a>
