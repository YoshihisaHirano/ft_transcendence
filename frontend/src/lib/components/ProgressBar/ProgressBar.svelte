<script>
	export let label = 'Now Loading';
    export let className = '';
</script>

<div class="progress-bar-container {className}">
	<div class="progress-bar-label">
        {label}
        <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
    </div>
    <div class="progress-bar-wrapper">
        <div class="progress-bar"></div>
        <div class="progress-bar-frame"></div>
    </div>

	<svg class="visually-hidden">
		<clipPath id="progress-bar-path" clipPathUnits="objectBoundingBox"
			><path
				d="M1,0.425 h-0.007 V0.25 h-0.017 V0.05 H0.025 v0.2 h-0.013 v0.175 h-0.009 v0.3 h0.009 V0.85 h0.013 v0.2 h0.955 v-0.2 h0.017 v-0.125 h0.007 v-0.3 m-0.015,0.325 h-0.017 v0.2 H0.033 v-0.2 h-0.013 V0.35 h0.013 V0.15 h0.938 v0.2 h0.017 v0.4"
			/></clipPath
		>
	</svg>
</div>

<style>
    .dot {
        display: inline-block;
    }

    .dot:first-child {
        animation: jumping-dot 1s ease-in 0s 10;
    }

    .dot:nth-child(2) {
        animation: jumping-dot 1s ease-in .3s 10;
    }

    .dot:last-child {
        animation: jumping-dot 1s ease-in .6s 10;
    }

    .progress-bar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .progress-bar-wrapper {
        position: relative;
        width: 100%;
        height: 2rem;
    }

    .progress-bar-label {
        margin-bottom: 24px;
        text-transform: uppercase;
    }

	.progress-bar-frame {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--text-primary);
        clip-path: url(#progress-bar-path);
	}

    .progress-bar {
        background-color: var(--text-primary);
        opacity: .89;
        width: 93.5%;
        height: 1.35em;
        margin-left: 3.5%;
        margin-top: .4rem;
        animation: progress-bar 10s cubic-bezier(0,.55,.55,.27) .1s 1 alternate forwards;
    }
</style>
