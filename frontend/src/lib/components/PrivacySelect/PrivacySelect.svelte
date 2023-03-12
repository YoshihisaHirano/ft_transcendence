<script lang="ts">
	import type { PrivacyMode, ChatSettings, NewChat } from '$lib/types/types';
	export let chatSettings: ChatSettings | NewChat;
	const privacyModes = ['public', 'private', 'protected'];
</script>

<p class="section-label">privacy mode</p>
<div class="section-wrapper">
	<div class="radio-group">
		{#each privacyModes as mode}
			<label for="privacy-mode-{mode}">
				<input
					type="radio"
					name={mode}
					value={mode}
					id="privacy-mode-{mode}"
					bind:group={chatSettings.privacyMode}
				/>
                {mode}
			</label>
		{/each}
	</div>
	{#if chatSettings.privacyMode == 'protected'}
		<label for="chat-password" class="password-label">
			chat passsword
			<input
				type="password"
				name="chat-password"
				id="chat-password"
				bind:value={chatSettings.password}
			/>
		</label>
	{/if}
</div>

<style>
	.section-label {
		margin-bottom: .5rem;
	}

    .section-wrapper {
        display: flex;
        gap: 2rem;
        align-items: center;
        height: 54px;
    }

	.password-label,
	.password-label input {
		display: block;
	}

    .radio-group {
        padding-bottom: 12px;
    }
</style>
