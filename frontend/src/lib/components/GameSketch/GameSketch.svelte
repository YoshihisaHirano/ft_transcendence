<script lang="ts">
    import P5 from "p5-svelte";
    import type { Sketch } from "p5-svelte";

    const sketch: Sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(Math.min(p5.windowWidth * 0.8, 800), Math.min(p5.windowHeight * 0.8, 400));
		};
		p5.draw = () => {
			p5.ellipse(p5.width / 2, p5.height / 2, 10, 10);
		};
	}
</script>

<div class="game-info">
    <div class="game-info-right"></div>
    <div class="game-info-left"></div>
</div>
<div class="game-field-wrapper">
    <P5 {sketch} />
</div>

<style>
    .game-field-wrapper {
        width: fit-content;
        margin: 0 auto;
        border: 1px dashed var(--text-primary);
    }
</style>