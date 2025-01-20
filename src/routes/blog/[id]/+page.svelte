<script>
    import Card from "$lib/components/Card.svelte";
    let { data } = $props();
    console.log(data)
</script>

<div class="w-[65%] flex flex-col items-center justify-center my-[70px]">

    <img src={data.user.image ? `http://localhost:8000/${data.user.image}` : 'http://localhost:8000/media/default/user.jpg'} class="w-[100px] h-[100px] rounded-full" alt="Profile Picture of {data.user.first_name} {data.user.last_name}" />
    <div class="text-xl merriweather-welcome opacity-70 mt-[10px]">{data.user.first_name} {data.user.last_name}</div>
    <hr class="w-[65%] border-base-content mt-[20px]">
    
    <div class="postcard-container my-[65px]">
        {#each data.blogPosts as post}
            <Card title={post.title} content={post.content} author={post.author} image={post.author.image} id={post.id} />
        {/each}
    </div>
</div>