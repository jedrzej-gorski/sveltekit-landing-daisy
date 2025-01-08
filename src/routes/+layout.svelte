<script lang="ts">
	import '$lib/app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data} = $props();
</script>

<div class="bg-base-200 flex flex-col min-h-screen">
	<Nav />

	<div class="flex-grow flex flex-col items-center">
		{@render children()}
	</div>
	<Footer pages={data}/>
</div>
