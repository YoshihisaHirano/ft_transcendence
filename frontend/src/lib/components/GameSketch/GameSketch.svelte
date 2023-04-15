<script lang="ts">
	import P5 from 'p5-svelte';
	import type { Sketch } from 'p5-svelte';
	import { Ball } from '$lib/sketchLib/Ball';
	import { Paddle } from '$lib/sketchLib/Paddle';
	import { gameStats, gameStatus } from '$lib/store/gameState';

	let scores = {
		score1: 0,
		score2: 0
	};

	const sketch: Sketch = (p5) => {
		let ball: Ball;
		let left: Paddle;
		let right: Paddle;

		const score1Div = document.getElementById('score1');
		const score2Div = document.getElementById('score2');

		p5.setup = () => {
			p5.createCanvas(Math.min(p5.windowWidth * 0.8, 800), Math.min(p5.windowHeight * 0.8, 400));
			ball = new Ball(p5);
			left = new Paddle(p5, true);
			right = new Paddle(p5, false);
		};

		p5.keyReleased = () => {
			left.move(0);
			right.move(0);
		};

		p5.keyPressed = () => {
			if (p5.key == 'a') {
				left.move(-10);
			} else if (p5.key == 'z') {
				left.move(10);
			}

			if (p5.key == 'j') {
				right.move(-10);
			} else if (p5.key == 'm') {
				right.move(10);
			}
		};

		p5.draw = () => {
			p5.background(p5.color(5, 6, 9));

			ball.checkPaddleRight(right);
			ball.checkPaddleLeft(left);

			left.show();
			right.show();
			left.update();
			right.update();

			ball.update();
			ball.edges(scores);
			ball.show();

			if (score1Div && score2Div) {
				score1Div.innerHTML = scores.score1.toString();
				score2Div.innerHTML = scores.score2.toString();
			}

			if (scores.score1 > 2 || scores.score2 > 2) {
				p5.noLoop();
				console.log('game finished', scores);
				gameStatus.set('finished')
				if ($gameStats) {
					gameStats.update((val) => {
						if (val) return {
							...val, userOneScore: scores.score1, userTwoScore: scores.score2
						}
						return null;
					})
				}
				scores.score1 = 0;
				scores.score2 = 0;
			}
		};
	};
</script>

<P5 {sketch} />
