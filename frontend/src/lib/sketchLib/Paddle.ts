import type P5 from 'p5';

export class Paddle {
    _p5: P5;
    y: number;
    x: number;
    w: number;
    h: number;
    ychange: number;

    constructor(p5: P5, isLeft: boolean) {
        this._p5 = p5;
        this.y = this._p5.height / 2;
        this.w = 20;
        this.h = this._p5.height / 3;
        this.ychange = 0;

        if (isLeft) {
            this.x = this.w;
        } else {
            this.x = this._p5.width - this.w;
        }
    }

    update() {
        this.y += this.ychange;
        this.y = this._p5.constrain(this.y, this.h/2, this._p5.height-this.h/2);
    }
    
    move(steps: number) {
        this.ychange = steps;
    }
    
    show() {
        // console.log(this.x, this.y, this.w, this.h)
        this._p5.fill(255);
        this._p5.rectMode(this._p5.CENTER);
        // this._p5.rect(this.x, this.y, 100, 100);
        this._p5.rect(this.x, this.y, this.w, this.h);
    }
}