<script lang="ts">
	import type { Message } from "$lib/types/types";

    export let message: Message;
    let areYouAuthor = message.authorUsername === 'You';
</script>

<div class="message-container" class:mirrored={areYouAuthor}>
    <div>
        <p class="message-author">{message.authorUsername}:</p>
        <p class="message-text">{message.text}</p>
    </div>
</div>

<style>
    .message-author {
        font-family: monospace;
        font-size: .85rem;
    }

    .message-text {
        max-width: 100%;
        white-space: pre-wrap;
        word-break: break-word;
        display: flex;
    }

    .message-container.mirrored {
        justify-content: flex-end;
    }

    .message-container.mirrored .message-author {
        text-align: end;
    }

    .message-container {
        margin-bottom: 8px;
        max-width: 100%;
        width: 100%;
        display: flex;
    }
</style>

