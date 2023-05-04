<script lang="ts">
	import P5 from 'p5-svelte';
	import type { Sketch } from 'p5-svelte';
	import { Ball } from '$lib/sketchLib/Ball';
	import { Paddle } from '$lib/sketchLib/Paddle';
	import { currentGameId, gameStats, gameStatus, isGameHost, gameMode } from '$lib/store/gameState';
	import { gameIo } from '$lib/sockets/gameSocket';
	import type { BallPosition } from '$lib/types/types';
	import { DEFAULT_FIELD_WIDTH, gameModes } from '$lib/utils/constants';
	import { appState } from '$lib/store/appState';

	let scores = {
		score1: 0,
		score2: 0
	};

	function findScaleCoefficient(canvasWidth: number) {
		return canvasWidth / DEFAULT_FIELD_WIDTH;
	}

	let canvasWidth: number = 0;
	let canvasHeight: number = 0;

	const currentGameMode = gameModes[$gameMode];
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
			p5.createCanvas(canvasWidth, canvasHeight);
			const scaleCoefficient = findScaleCoefficient(canvasWidth);

			// p5.frameRate(40);
			ball = new Ball(p5, scaleCoefficient, ballRadius, ballSpeed);
			left = new Paddle(p5,paddleLength, true, scaleCoefficient);
			right = new Paddle(p5, paddleLength, false, scaleCoefficient);
			ballShadow = new Ball(p5, scaleCoefficient, ballRadius, ballSpeed, canvasWidth / 2, canvasHeight / 2);

			gameIo.on('endOfGame', () => {
				p5.noLoop();
			});

			function showFrame() {
				p5.background(currentGameMode.bgCol);
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
				// console.log(data);
				if (score1Div && score2Div) {
					scores.score1 = data.scores.score1;
					scores.score2 = data.scores.score2;
					if (!$isGameHost) {
						gameStats.update((val) => {
							if (val) {
								return {
									...val,
									userOneScore: data.scores.score1,
									userTwoScore: data.scores.score2
								};
							}
							return null;
						});
					}
					score1Div.innerHTML = scores.score1.toString();
					score2Div.innerHTML = scores.score2.toString();
				}
			});

			if ($isGameHost) {
				gameIo.on('rightPaddleUpdate', (data) => {
					right = new Paddle(p5, paddleLength, false, scaleCoefficient, data.paddleY);
					showFrame();
				});
			} else {
				gameIo.on('leftPaddleUpdate', (data) => {
					left = new Paddle(p5, paddleLength, true, scaleCoefficient, data.paddleY);
					showFrame();
				});
			}
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
				showFrame();
			});
		};

		// p5.keyReleased = () => {
		// 	if ($isGameHost) {
		// 		left.move(0);
		// 	} else {
		// 		right.move(0);
		// 	}
		// };

		p5.keyPressed = () => {
			if ($isGameHost) {
				if (p5.key == 'ArrowUp') {
					left.move(-30);
					left.update();
					p5.background(bgCol);
					right.show();
					left.show();
					ballShadow.show();
					gameIo.emit('leftPaddleUpdate', { gameId: $currentGameId, paddleY: left.y });
				}
				if (p5.key == 'ArrowDown') {
					left.move(30);
					left.update();
					p5.background(bgCol);
					right.show();
					left.show();
					ballShadow.show();
					gameIo.emit('leftPaddleUpdate', { gameId: $currentGameId, paddleY: left.y });
				}
			} else {	
				// @TODO IMPORTANT need to change to ARROW_UP & ARROW_DOWN as well
				if (p5.key == 'a') {
					right.move(-30);
					right.update();
					p5.background(bgCol);
					left.show();
					right.show();
					gameIo.emit('rightPaddleUpdate', { gameId: $currentGameId, paddleY: right.y });
				}
				if (p5.key == 'z') {
					right.move(30);
					right.update();
					p5.background(bgCol);
					left.show();
					right.show();
					gameIo.emit('rightPaddleUpdate', { gameId: $currentGameId, paddleY: right.y });
				}
			}
		};

		p5.draw = () => {
			if ($isGameHost) {
				ball.checkPaddleRight(right);
				ball.checkPaddleLeft(left);
				ball.update();
				const edgeCheck = ball.edges(scores);
				if (edgeCheck.scoreChanged) {
					gameIo.emit('scoreUpdate', { gameId: $currentGameId, scores });
				}
				const ballPos: BallPosition = {
					x: ball.x,
					y: ball.y,
					xspeed: ball.xspeed,
					yspeed: ball.yspeed
				};
				gameIo.emit('ballPositionUpdate', {
					gameId: $currentGameId,
					ballPos
				});

				if (scores.score1 > 5 || scores.score2 > 5) {
					p5.noLoop();
					console.log('game finished', scores);
					if ($gameStats) {
						gameStats.update((val) => {
							if (val)
								return {
									...val,
									userOneScore: scores.score1,
									userTwoScore: scores.score2
								};
							return null;
						});
						gameIo.emit('finishGame', {
							gameId: $gameStats.userOneId,
							playerId: $gameStats.userTwoId
						});
					}
					scores.score1 = 0;
					scores.score2 = 0;
					$gameMode = $appState.user?.gameMode || $gameMode;
					gameStatus.set('finished');
				}
			}
		};
	};
</script>

<P5 {sketch} />
