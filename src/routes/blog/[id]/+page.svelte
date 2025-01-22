<script>
    import Card from "$lib/components/Card.svelte";
    let { data } = $props();
    console.log(data)
</script>

<div class="w-[65%] flex flex-col items-center justify-center my-[70px] bg-base-100">

    <div class="flex flex-col items-center justify-center w-full mt-5">
        <img src={data.user.image ? `http://localhost:8000/${data.user.image}` : 'http://localhost:8000/media/default/user.jpg'} class="w-[100px] h-[100px] rounded-full object-cover" alt="Profile Picture of {data.user.first_name} {data.user.last_name}" />
    <div class="text-xl merriweather-welcome opacity-70 mt-[10px]">{data.user.first_name} {data.user.last_name}</div>
    <hr class="w-[90%] border-base-content mt-[20px]">
    </div>
    
    <div class="postcard-container my-7">
        {#each data.blogPosts as post}
            {#if post.status == "Published"}
                <Card title={post.title} content={post.content} author={post.author} image={post.poster} id={post.id} editable={data.user.id == post.author.id}/>
            {/if}
        {/each}
    </div>
</div>