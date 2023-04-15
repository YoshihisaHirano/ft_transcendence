import type P5 from 'p5';
import type { Paddle } from './Paddle';

export class Ball {
    _p5: P5;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    r: number;

    constructor(p5: P5) {
        this._p5 = p5;
        this.x = this._p5.width / 2;
        this.y = this._p5.height / 2;
        this.xspeed = 0;
        this.yspeed = 0;
        this.r = 12;

        this.reset();
    }

    reset() {
        this.x = this._p5.width/2;
        this.y = this._p5.height/2;
        let angle = this._p5.random(-this._p5.PI/4, this._p5.PI/4);
        this.xspeed = 5 * Math.cos(angle);
        this.yspeed = 5 * Math.sin(angle);
        // send new ball position to socket
        
        if (this._p5.random(1) < 0.5) {
            this.xspeed *= -1;
        }
    }

    edges(scores: { score1: number, score2: number }) {
        if (this.y < 0 || this.y > this._p5.height) {
            this.yspeed *= -1;
        }
        
        if (this.x - this.r > this._p5.width) {
            scores.score1 += 1;
            //send new score to socket
            this.reset();
        }
        
        if (this.x + this.r < 0) {
            scores.score2 += 1;
            //send new score to socket
            this.reset();
        }
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
                this.xspeed = 5 * this._p5.cos(angle);
                this.yspeed = 5 * this._p5.sin(angle);
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
                this.xspeed = 5 * this._p5.cos(angle);
                this.yspeed = 5 * this._p5.sin(angle);
                this.x = p.x - p.w/2 - this.r;
            }
        }
    }
}