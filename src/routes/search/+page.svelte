<script>
    import Card from "$lib/components/Card.svelte";
    let {data} = $props();
</script>

<div class="postcard-container my-[65px]">
    {#each data.posts as post}
        <Card title={post.title} content={post.content} author={post.author} image={post.author.image} id={post.id} />
    {/each}
</div>

