<script lang="ts">
    export let username: string, userId: string, currentId: string, className = '';
</script>

<a href={userId === currentId ? '/' : `/profile/${userId}`} class={className}>
    {username}
</a>

<style>
    a, a:active, a:visited {
        color: var(--text-primary);
        text-decoration: none;
    }
</style>