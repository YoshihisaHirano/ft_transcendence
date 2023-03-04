<script lang="ts">
	import { goto } from "$app/navigation";
    import Button from "$lib/components/Button/Button.svelte";
    import dino from '$lib/images/dino.svg';
    import { appState } from "$lib/store/appState";
	import { saveToStorage } from "$lib/utils/storage";
	import { beforeUpdate } from "svelte";

    function login() {
        appState.update((prevState) => {
            return { ...prevState, isLoggedIn: true }
        })
        saveToStorage('isLoggedIn', 'true');
        goto('/');
        console.log("login");
    }

    beforeUpdate(() => {
        if ($appState.isLoggedIn) {
            goto('/');
        }
    })
</script>

<fieldset>
    <img src={dino} alt="">
    <label for="">
        Login
        <input type="text">
    </label>
    <label for="">
        Password
        <input type="text">
    </label>
    <Button variant="success" onClick={login}>Let me in</Button>
</fieldset>

<style>
    img {
        position: absolute;
        max-width: 10rem;
        bottom: -3rem;
        left: -4rem;
    }

    label {
        display: block;
        color: var(--text-primary);
        text-align: end;
        width: 31rem;
    }

    fieldset {
        position: relative;
        width: 85%;
        margin: 15% auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;
        gap: 1rem;
    }
</style>