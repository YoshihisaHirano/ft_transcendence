<script lang="ts">
	import defaultPicture from '$lib/images/default_pic.svg';
	import CogIcon from '../CogIcon/CogIcon.svelte';
	export let imageSrc: string, isCurrentUser: boolean;

	$: uploadVisible = false;

	function setUploadVisibility(val: boolean) {
		uploadVisible = val;
	}
</script>

<div
	class="image-frame"
	on:pointerenter={() => setUploadVisibility(true)}
	on:pointerleave={() => setUploadVisibility(false)}
>
	<img src={imageSrc !== 'null' ? imageSrc : defaultPicture} alt="user profile pic" />
	{#if isCurrentUser}
		<div class="upload-picture" class:active={uploadVisible}>
			<label for="upload-profile-pic">
				<CogIcon/>
				<input
					type="file"
					class="visually-hidden"
					name="upload-profile-pic"
					id="upload-profile-pic"
				/>
			</label>
		</div>
	{/if}
</div>

<style>
	.image-frame {
		width: 12rem;
		height: 12rem;
		border: 2px solid white;
		margin-bottom: 8px;
		position: relative;
	}

	.image-frame img {
		aspect-ratio: 1 / 1;
		max-width: 100%;
		height: auto;
		object-fit: cover;
	}

	.upload-picture {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		background-color: #2d2c2c;
		z-index: 1;
		padding: 4px 8px;
		display: flex;
		justify-content: end;
		opacity: 0;
		transition: opacity 0.4s ease-in-out;
	}

	.upload-picture.active {
		opacity: 0.9;
	}
</style>
