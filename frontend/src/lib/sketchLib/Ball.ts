import type P5 from 'p5';

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
        
        if (this._p5.random(1) < 0.5) {
            this.xspeed *= -1;
        }
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }
}