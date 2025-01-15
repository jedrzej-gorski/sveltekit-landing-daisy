<script>
	import Link from './Link.svelte';
	let { pages } = $props();
</script>

<div class="px-[10%] flex flex-row gap-5">
	{#each pages.data as page, index}
		{#if index == pages.data.length - 1}
			<div class="flex-grow"></div>
		{/if}
		<Link id={page.id} title={page.title} />
	{/each}
</div>

<style>
	.footer-gradient {
		mask-image: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
	}
</style>
