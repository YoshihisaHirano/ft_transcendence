import type P5 from 'p5';
import type { Paddle } from './Paddle';
import { DEFAULT_FIELD_WIDTH, DEFAULT_FIELD_HEIGHT } from '$lib/utils/constants';

export class Ball {
    _p5: P5;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    ballSpeed: number;
    r: number;

    constructor(p5: P5, scaleCoef: number, ballRadius: number, ballSpeed: number, x?: number, y?: number, xspeed?: number, yspeed?: number) {
        this._p5 = p5;
        this.x = x || DEFAULT_FIELD_WIDTH / 2;
        this.y = y || DEFAULT_FIELD_HEIGHT / 2;
        this.xspeed = xspeed || 0;
        this.yspeed = yspeed || 0;
        this.r = ballRadius * scaleCoef;
        this.ballSpeed = ballSpeed;

        if (!x && !y && !xspeed && !yspeed) {
            this.reset();
        }
    }

    reset() {
        this.x = DEFAULT_FIELD_WIDTH/2;
        this.y = DEFAULT_FIELD_HEIGHT/2;
        let angle = this._p5.random(-this._p5.PI/4, this._p5.PI/4);
        this.xspeed = this.ballSpeed * Math.cos(angle);
        this.yspeed = this.ballSpeed * Math.sin(angle);
        // send new ball position to socket
        
        if (this._p5.random(1) < 0.5) {
            this.xspeed *= -1;
        }
    }

    edges(scores: { score1: number, score2: number }) {
        if (this.y < 0 || this.y > DEFAULT_FIELD_HEIGHT) {
            this.yspeed *= -1;
        }
        
        if (this.x - this.r > DEFAULT_FIELD_WIDTH) {
            scores.score1 += 1;
            //send new score to socket
            this.reset();
            return { scoreChanged: true, scores }
        }
        
        if (this.x + this.r < 0) {
            scores.score2 += 1;
            //send new score to socket
            this.reset();
            return { scoreChanged: true, scores }
        }

        return { scoreChanged: false, scores: null }
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    show() {
        this._p5.fill(255);
        // send new ball position to socket
        this._p5.ellipse(this.x, this.y, this.r*2);
    }

    checkPaddleLeft(p: Paddle) {
        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x - this.r < p.x + p.w/2) {
                
            if (this.x > p.x) {
                let diff = this.y - (p.y - p.h/2);
                let rad = this._p5.radians(45);
                let angle = this._p5.map(diff, 0, p.h, -rad, rad);
                this.xspeed = this.ballSpeed * this._p5.cos(angle);
                this.yspeed = this.ballSpeed * this._p5.sin(angle);
                this.x = p.x + p.w/2 + this.r;
            }
            
        }
    }

    checkPaddleRight(p: Paddle) {
        if (this.y - this.r < p.y + p.h/2 &&
            this.y + this.r > p.y - p.h/2 &&
            this.x + this.r > p.x - p.w/2) {
                
            if (this.x < p.x) {
                let diff = this.y - (p.y - p.h/2);
                let angle = this._p5.map(diff, 0, p.h, this._p5.radians(225), this._p5.radians(135));
                this.xspeed = this.ballSpeed * this._p5.cos(angle);
                this.yspeed = this.ballSpeed * this._p5.sin(angle);
                this.x = p.x - p.w/2 - this.r;
            }
        }
    }
}