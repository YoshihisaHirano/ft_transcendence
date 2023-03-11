<script lang="ts">
    export let onClose: (() => void), title = '';
</script>

<div class="modal-wrapper">
    <div class="modal simple-shadow">
        <h2 class="modal-title">{title}</h2>
        <button class="modal-close" on:click={onClose}>✖</button>
        <slot/>
    </div>
</div>

<style>
    .modal-wrapper {
        position: absolute;
        height: 100vh;
        max-height: 100vh;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.9);
        z-index: 3;
    }

    .modal {
        position: relative;
        padding: 1.5rem;
        background: var(--background-primary);
        width: 65vw;
        top: 50%;
        transform: translate(0%, -50%);
    }

    .modal-close {
        color: var(--text-primary);
        position: absolute;
        right: 8px;
        top: 8px;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .modal-title {
        font-size: 1.05rem;
    }
</style>