<script lang="ts">
	import Carousel from '$lib/components/Carousel.svelte';
	import Chat from '$lib/components/Chat.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Mobile from '$lib/components/Mobile.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import HeroCards from '$lib/components/HeroCards.svelte';
	import Links from '$lib/components/Link.svelte';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import MovieWidget from '$lib/components/MovieWidget.svelte';
	let {data} = $props();

</script>

<div class="flex flex-col items-center w-full min-w-[250px] h-full">
	<div class="w-full">
		<div class="welcome"></div>
		<div class="merriweather-welcome text-center text-4xl relative bottom-[30px]">
			<h2>Explore the beauty of cinema.</h2>
			<h2>Share your love of film with others.</h2>
		</div>
	</div>
	<Splide class="w-[80%] min-w-[250px] h-[350px] my-[20px]" options={{type: 'loop', gap: `1rem`, perPage: 5, breakpoints: {1280: {perPage: 4}, 1024: {perPage: 3}, 768: {perPage: 2}, 512: {perPage: 1}}}}>
		{#each data.recentFilms as film}
			<SplideSlide class="flex items-center justify-center h-full">
				<MovieWidget id={film.id} poster={film.poster} title={film.title} />
			</SplideSlide>
		{/each}
	</Splide>
</div>

<style>
	.welcome {
		position: relative;
		opacity: 0.85;
		background-image: url('http://localhost:8000/media/default/welcome3.jpg');
		background-size: cover;
		
		aspect-ratio: 22/10;
		background-position: top 10% center;
		-webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent),
							linear-gradient(180deg, transparent, black 25%, black 70%, transparent),
							linear-gradient(135deg, transparent, black 20%),
							linear-gradient(225deg, transparent, black 20%);
		mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent),
					linear-gradient(180deg, transparent, black 25%, black 70%, transparent),
					linear-gradient(135deg, transparent, black 20%),
					linear-gradient(225deg, transparent, black 20%);
		-webkit-mask-composite: source-over;
		mask-composite: intersect;
	}
</style>