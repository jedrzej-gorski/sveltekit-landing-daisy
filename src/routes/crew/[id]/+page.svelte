<script lang="ts">
    interface Movie {
        id: number;
        poster: string;
        roles: string[];
    }
    interface MovieLink {
        id: number;
        poster: string;
    }
    let { data } = $props();
    let roleDict: Record<number, string> = {};
    let maxIndex = 0;
    let credits: Record<string, MovieLink[]> = {};
    data.crew.movies.forEach((movie: Movie) => {
        movie.roles.forEach((role: string) => {
            if (!credits[role]) {
                credits[role] = [];
                roleDict[maxIndex] = role;
                maxIndex++;
            }
            credits[role].push({
                id: movie.id,
                poster: movie.poster
            })
        })
    })

    let activeTab = $state(0);

    function setActiveTab(index: number) {
        activeTab = index;
    }





</script>

<div class="mt-[150px] mx-auto lg:w-[975px] w-full">
    <div class="lg:grid lg:grid-cols-4 lg:place-items-start gap-2 flex flex-col items-center">
        <div class="lg:col-span-3 w-[85%] lg:w-full">
            <div class="text-xl nunito-sans-text opacity-70">FILMS WORKED ON BY</div>
            <div class="text-2xl merriweather-welcome font-bold">{data.crew.first_name} {data.crew.last_name}</div>
            <hr class="w-full break-border opacity-30 relative top-[5px]" />
            <div class="flex flex-row items-center mt-2">
                {#each Object.entries(credits) as [role, movies], index}
                    <button
                        class="nunito-sans-text text-sm ml-[7px] {activeTab == index ? 'break-border-btm' : ''}"
                        onclick={() => setActiveTab(index)}>{role}</button
                    >
                {/each}
            </div>
            <hr class="w-full break-border opacity-30 relative bottom-[1px]" />
            <div class="mt-4 flex flex-row items-center flex-wrap gap-2">
                {#each credits[roleDict[activeTab]] as movie}
                    <a href={`/movie/${movie.id}`} class="w-[200px] h-[285px]">
                        <img src={`http://localhost:8000/${movie.poster}`} class="w-full h-full object-cover" alt='Movie Poster'/>
                    </a>
                {/each}
            </div>
            
        </div>
        <div class="lg:col-span-1 lg:mt-0 mt-4">
            <div class="nunito-sans-text w-[80%] mx-auto">{data.crew.description}</div>
        </div>
    </div>

</div>

<style>

</style>