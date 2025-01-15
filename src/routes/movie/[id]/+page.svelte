<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	interface CrewMember {
		id: Number;
		first_name: string;
		last_name: string;
		birth_date: string;
		description: string;
		image: string;
		created_by: Number;
	}
	interface CrewMemberInMovie {
		crew_member: CrewMember;
		role: string;
		character_name: string;
	}
	interface CrewTuple {
		full_name: string;
		id: Number;
	}
	let { data } = $props();
	let activeTab: number = $state(0);
	let directors: CrewTuple[] = [];
	let actors: CrewTuple[] = [];
	let crew: Record<string, CrewTuple[]> = {};

	data.movie.crew.forEach((person: CrewMemberInMovie) => {
		if (person.role == 'Reżyser') {
			directors.push({
				full_name: person.crew_member.first_name + ' ' + person.crew_member.last_name,
				id: person.crew_member.id
			});
		} else if (person.role == 'Aktor') {
			actors.push({
				full_name: person.crew_member.first_name + ' ' + person.crew_member.last_name,
				id: person.crew_member.id
			});
		} else {
			if (crew[person.role] == undefined) {
				crew[person.role] = [];
			}
			crew[person.role].push({
				full_name: person.crew_member.first_name + ' ' + person.crew_member.last_name,
				id: person.crew_member.id
			});
		}
	});
    console.log(crew);

	function setActiveTab(tab: number) {
		activeTab = tab;
	}
</script>

<div class="md:mt-[200px] mx-auto md:w-[775px] w-full">
	<div class="grid grid-cols-1 place-items-center md:grid-cols-7 gap-[24px] w-full">
		<!-- Poster column -->
		<div class="md:col-start-2 md:col-span-2 flex justify-center mt-16">
			<img
				src={`http://localhost:8000/${data.movie.poster}`}
				class="w-[200px] h-[285px] object-cover rounded-md"
				alt="{data.movie.title} Poster"
			/>
		</div>

		<!-- Content column -->
		<div class="md:col-span-3 w-[80%] flex flex-col">
			<div class="flex flex-row items-baseline justify-center mb-8 flex-wrap">
				<p class="text-2xl merriweather-welcome">{data.movie.title}</p>
				<p class="nunito-sans-text text-sm ml-[10px]">{data.movie.year} Directed by</p>
				{#each directors as director, index}
					<a href={`/crew/${director.id}`} class="nunito-sans-text text-sm ml-[4px] underline"
						>{director.full_name}</a
					>
					{#if index < directors.length - 2}
						<p class="nunito-sans-text text-sm">,</p>
					{:else if index == directors.length - 2}
						<a href="/crew" class="nunito-sans-text text-sm ml-[7px]"> and </a>
					{/if}
				{/each}
			</div>

			<div class="flex flex-row items-center">
				<button
					class="nunito-sans-text text-sm ml-[7px] {activeTab == 0 ? 'break-border-btm' : ''}"
					onclick={() => setActiveTab(0)}>CAST</button
				>
				<button
					class="nunito-sans-text text-sm ml-[7px] {activeTab == 1 ? 'break-border-btm' : ''}"
					onclick={() => setActiveTab(1)}>CREW</button
				>
				<button
					class="nunito-sans-text text-sm ml-[7px] {activeTab == 2 ? 'break-border-btm' : ''}"
					onclick={() => setActiveTab(2)}>DETAILS</button
				>
				<button
					class="nunito-sans-text text-sm ml-[7px] {activeTab == 3 ? 'break-border-btm' : ''}"
					onclick={() => setActiveTab(3)}>GENRE</button
				>
			</div>

			<hr class="w-full break-border opacity-30 relative bottom-[1px]" />
			<div class="my-[10px]  overflow-y-hidden overflow-x-hidden">
				{#if activeTab == 0}
					{#each actors as actor}
						<span
							class="nunito-sans-text bg-neutral text-neutral-content ease-in-out rounded-md p-1 text-sm mr-[4px] underline"
							>{actor.full_name}</span
						>
					{/each}
				{:else if activeTab == 1}
					{#each Object.keys(crew) as role}
						<p class="nunito-sans-text text-sm ml-[4px] opacity-70 mt-2">{role.toUpperCase()}</p>
						{#each crew[role] as crewMember}
							<span
								class="nunito-sans-text bg-neutral text-neutral-content ease-in-out rounded-md p-1 text-sm mr-[4px] underline"
								>{crewMember.full_name}</span
							>
						{/each}
					{/each}
				{:else if activeTab == 2}
                    <p class="nunito-sans-text text-sm ml-[4px] opacity-90 mt-2 underline">RELEASE DATE</p>
                    <p class="nunito-sans-text text-sm ml-[4px] opacity-90 mt-1">{data.movie.release_date}</p>
                    <p class="nunito-sans-text text-sm ml-[4px] opacity-90 mt-2 underline">DESCRIPTION</p>
                    <p class="nunito-sans-text text-sm ml-[4px] opacity-90 mt-1">{data.movie.description}</p>
                {:else if activeTab == 3}
                    <p class="nunito-sans-text text-sm ml-[4px] opacity-90 mt-2">{data.movie.category}</p>
                {/if}
			</div>
		</div>
	</div>
</div>

<!---<Post movie={data.movie} title={data.post.title} content={data.post.html} author={data.post.created_by} id={data.post.id} description={data.post.content}/>-->
