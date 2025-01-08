<script>
	import Link from "./Link.svelte";
	let {pages} = $props();
</script>
<footer class="footer footer-center p-10 bg-base-content text-primary-content">
	<div class="flex flex-col md:flex-row gap-2 xl:gap-5">
		{#each pages.data as page}
			<Link id={page.id} title={page.title} />
		{/each}
	</div>
</footer>
