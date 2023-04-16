import { DEFAULT_FIELD_HEIGHT, DEFAULT_FIELD_WIDTH } from '$lib/utils/constants';
import type P5 from 'p5';

export class Paddle {
    _p5: P5;
    y: number;
    x: number;
    w: number;
    h: number;
    ychange: number;
    coef: number;

    constructor(p5: P5, isLeft: boolean, scaleCoef: number, y?: number) {
        this._p5 = p5;
        this.y = y || DEFAULT_FIELD_HEIGHT / 2;
        this.w = 20;
        this.h = DEFAULT_FIELD_HEIGHT / 3;
        this.ychange = 0;
        this.coef = scaleCoef;

        if (isLeft) {
            this.x = this.w;
        } else {
            this.x = DEFAULT_FIELD_WIDTH - this.w;
        }
    }

    update() {
        this.y += this.ychange;
        this.y = this._p5.constrain(this.y, this.h/2, DEFAULT_FIELD_HEIGHT-this.h/2);
    }

    updatePosition(newY: number) {
        this.y == newY;
    }
    
    move(steps: number) {
        this.ychange = steps;
    }
    
    show() {
        // console.log(this.x == this.w ? 'HOST ' : 'PLAYER ', this.y);
        this._p5.fill(255);
        this._p5.rectMode(this._p5.CENTER);
        // this._p5.rect(this.x, this.y, 100, 100); 
        this._p5.rect(this.x * this.coef, this.y * this.coef, this.w * this.coef, this.h * this.coef);
    }
}