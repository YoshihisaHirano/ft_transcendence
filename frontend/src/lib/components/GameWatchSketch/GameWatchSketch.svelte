<script lang="ts">
	import { Ball } from '$lib/sketchLib/Ball';
	import { Paddle } from '$lib/sketchLib/Paddle';
	import { gameIo } from '$lib/sockets/gameSocket';
	import { gameBeingShown } from '$lib/store/gameWatchState';
	import { gameModes } from '$lib/utils/constants';
	import { findScaleCoefficient } from '$lib/utils/utils';
	import P5 from 'p5-svelte';
	import type { Sketch } from 'p5-svelte';

	let scores = {
		score1: 0,
		score2: 0
	};

	let canvasWidth: number = 0;
	let canvasHeight: number = 0;

	let currentGameMode = gameModes[$gameBeingShown?.gameMode || 'default'];
    
	const { paddleLength, ballRadius, bgCol, ballSpeed } = currentGameMode;
	const sketch: Sketch = (p5) => {
		let ball: Ball;
		let left: Paddle;
		let right: Paddle;
		let ballShadow: Ball;

		const score1Div = document.getElementById('score1');
		const score2Div = document.getElementById('score2');

		p5.setup = () => {
			canvasWidth = Math.min(p5.windowWidth * 0.8, 800);
			canvasHeight = canvasWidth / 2;
			const canvas = p5.createCanvas(canvasWidth, canvasHeight);
            canvas.id('gameWatchCanvas');
			const scaleCoefficient = findScaleCoefficient(canvasWidth);
            let scoresSet = false;

			ball = new Ball(p5, scaleCoefficient, ballRadius, ballSpeed);
			left = new Paddle(p5, paddleLength, true, scaleCoefficient);
			right = new Paddle(p5, paddleLength, false, scaleCoefficient);
			ballShadow = new Ball(
				p5,
				scaleCoefficient,
				ballRadius,
				ballSpeed,
				canvasWidth / 2,
				canvasHeight / 2
			);

			gameIo.on('endOfGame', () => {
				p5.fill(255, 255, 255);
                p5.textAlign('center');
                p5.text('GAME OVER', 0, 0);
				p5.noLoop();
			});

			function showFrame() {
				p5.background(bgCol);
				left.show();
				right.show();
				ballShadow.show();
			}

			left.show();
			right.show();

			if (score1Div && score2Div) {
				score1Div.innerHTML = scores.score1.toString();
				score2Div.innerHTML = scores.score2.toString();
			}

			gameIo.on('scoreUpdate', (data) => {
				if (score1Div && score2Div) {
					scores.score1 = data.scores.score1;
					scores.score2 = data.scores.score2;
					score1Div.innerHTML = scores.score1.toString();
					score2Div.innerHTML = scores.score2.toString();
				}
			});

			gameIo.on('rightPaddleUpdate', (data) => {
				right = new Paddle(p5, paddleLength, false, scaleCoefficient, data.paddleY);
				showFrame();
			});

			gameIo.on('leftPaddleUpdate', (data) => {
				left = new Paddle(p5, paddleLength, true, scaleCoefficient, data.paddleY);
				showFrame();
			});

			gameIo.on('ballPositionUpdate', (data) => {
				const { ballPos } = data;
				const { x, y, xspeed, yspeed } = ballPos;
				ballShadow = new Ball(
					p5,
					scaleCoefficient,
					ballRadius,
					ballSpeed,
					x * scaleCoefficient,
					y * scaleCoefficient,
					xspeed * scaleCoefficient,
					yspeed * scaleCoefficient
				);
				
                // if (!scoresSet && score1Div && score2Div) {
                //     scoresSet = true;
                //     scores.score1 = data.score1;
				// 	scores.score2 = data.score2;
				// 	score1Div.innerHTML = scores.score1.toString();
				// 	score2Div.innerHTML = scores.score2.toString();
                // }
				showFrame();
			});
		};

		p5.draw = () => {};
	};
</script>

<P5 {sketch} />
