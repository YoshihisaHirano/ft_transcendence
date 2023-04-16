<script>
    export let numStars = 0;
</script>

<span class="stars">
  {#each Array(numStars) as _, i}
    <span class="star">⭐</span>
  {/each}
</span>

<style>
    .stars {
        display: inline-block;
    }

    .star {
        display: inline-block;
        width: 1.4rem;
        height: 2.3rem;
        margin-right: 0.25em;
        font-size: 1.4rem;
        margin-top: -2rem;
    }
</style>
