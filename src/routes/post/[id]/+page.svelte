<script>
    import Post from "$lib/components/Post.svelte";
    let {data} = $props();
</script>

<Post movie={data.movie} title={data.post.title} content={data.post.html} author={data.post.created_by} id={data.post.id} description={data.post.content}/>