import { ctx, Game } from "./main";



export class Pos {
    constructor(public x: number, public y: number){

    }
}

function sqr(pos: Pos, size: number) {
    ctx.fillRect(pos.x, pos.y, size, size);
}

export class Cell extends Pos{
    private size = Game.cellSize;
    private ren: Pos;

    isWall = false;
    isStart = false;
    isEnd = false;
    checked = false;
    parent: Cell | null = null;
    pathOver = false;

    constructor(x: number, y: number) {
        super(x, y);
        this.ren = new Pos(x * this.size, y * this.size);
    }

    draw() {
        if(this.isWall || this.isStart || this.isEnd || this.pathOver) {
            ctx.fillStyle = this.isWall ? "black" : this.isStart ? "green" : this.isEnd ? "red" : "grey";
            return sqr(this.ren, this.size); 
        }
        ctx.strokeRect(this.ren.x, this.ren.y, this.size, this.size);
    }

    dist(pos: Pos) {
        return Math.hypot(pos.x - this.x, pos.y - this.y);
    }
}

export class Mouse extends Pos {
    isDown = false;
    constructor() {
        super(0, 0);
    }
}
