<script>
    let {id,poster, title} = $props();
</script>

<div class="poster frame rounded-md z-10">
    <a href={`/movie/${id}`} class="h-[287px] rounded-md w-full flex items-center justify-center">
        <img src="http://localhost:8000{poster}" alt={title} class="relative bottom-[1px] poster-img object-cover rounded-md"/>
    </a>
</div>

<style> 
    .poster {
        height: 287px;
        width: 200px;
    }
    .poster-img {
        width: 200px;
        height: 285px;
    }
</style>