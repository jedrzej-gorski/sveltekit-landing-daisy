<script>
    import Post from "$lib/components/Post.svelte";
    let {data} = $props();
</script>

<Post title={data.post.title} content={data.post.html} author={data.post.created_by} image={data.post.image} id={data.post.id} description={data.post.content}/>