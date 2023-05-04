<script lang="ts">
	import TwoFactorAuthModal from "$lib/components/TwoFactorAuthModal/TwoFactorAuthModal.svelte";
    export let data;
</script>

<main>
    <TwoFactorAuthModal action="login" login={data.slug} onClose={() => {/**/}}/>
</main>
