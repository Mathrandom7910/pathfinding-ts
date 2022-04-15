import { Cell, Mouse, Pos } from "./cell";
import "./style.css"

export const canvas = <HTMLCanvasElement> document.getElementById("gameCanv"),
ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

(onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})();


export class Game {
  static cellSize = 10;
  static maxCount = 1e5;

  mouse = new Mouse();
  cells: Cell[][] = [];
  keysPressed: {[k: string]: boolean} = {};
  down = false;

  cellBind: {
    start: Cell | null,
    end: Cell | null
  } = {end: null, start: null};

  constructor() {
    for(let i = 0; i < canvas.width / Game.cellSize; i++) {
      for(let j = 0; j < canvas.height / Game.cellSize; j++) {
        if(!this.cells[i]) {
          this.cells[i] = [];
        }
        this.cells[i][j] = new Cell(i, j);
      }
    }

    canvas.onmousemove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }

    document.onkeydown = (e) => {
      this.keysPressed[e.key] = true;
      if(this.keysPressed.p) this.pathFind();
    }

    document.onkeyup = (e) => {
      this.keysPressed[e.key] = false;
    }

    canvas.onmousedown = () => {
      this.mouse.isDown = true;
      const cellOver = this.cells[Math.floor(this.mouse.x / Game.cellSize)][Math.floor(this.mouse.y / Game.cellSize)];
      this.down = cellOver.isWall;
      
      if(this.keysPressed[" "] && !this.cellBind.start) {
        cellOver.isStart = !cellOver.isStart;
        this.cellBind.start = cellOver;
        if(!cellOver.isStart) this.cellBind.start = null
        cellOver.isWall = false;
        cellOver.isEnd = false;
        return;
      } else if(this.keysPressed.Shift && !this.cellBind.end) {
        cellOver.isEnd = !cellOver.isEnd;
        this.cellBind.end = cellOver;
        if(!cellOver.isEnd) this.cellBind.end = null
        cellOver.isStart = false;
        cellOver.isWall = false;
        return;
      }
      cellOver.isWall = !cellOver.isWall;
      cellOver.isEnd = false;
      cellOver.isStart = false;
      if(this.cellBind.end == cellOver) this.cellBind.end = null;
      if(this.cellBind.start == cellOver) this.cellBind.start = null;
    }

    canvas.onmouseup = () => {
      this.mouse.isDown = false;
    }
  }

  iterCells(cb: (cell: Cell) => any) {
    this.cells.forEach(cells => cells.forEach(cell => cb(cell)));
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(this.keysPressed.r) this.iterCells((cell) => {
      if(!cell.isStart || cell.isEnd) {
        cell.isWall = Math.random() < .25
      }
    })

    for(let i = 0; i < this.cells.length; i++) {
      for(let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].draw();
      }
    }
    requestAnimationFrame(this.render);
  }

  getAround(pos: Pos) {
    const tmp: Cell[] = [];
    for(let x = -1; x <= 1; x++) {
      for(let y = -1; y <= 1; y++) {
        const xInt = pos.x + x,
        yInt = pos.y + y;
        if(!this.cells[xInt]) continue;
        const cell = this.cells[xInt][yInt];
        if(x == 0 && y == 0 || !this.cells[xInt] || !this.cells[xInt][yInt] || cell.isWall || cell.checked) continue;
        cell.checked = true;
        tmp.push(cell);
      }
    }

    return tmp.filter(e => e);
  }

  checkAround(pos: Pos) {
    var getAr: Cell[] = [];
    getAr.push(...this.getAround(pos));
    var counter = 0;
    while(getAr.length) {
      if(counter > Game.maxCount) throw new Error("Counter exceeded " + Game.maxCount);
      counter++;
      const node = <Cell> getAr.shift();
      const neighbors = this.getAround(node);

      for(let i of neighbors) {
        i.parent = node;
        if(i.isEnd) return i;
        getAr.push(i);
      }      
    }
    return null;
  }

  pathFind() {
    const startTime = Date.now();
    this.cells.forEach(cells => cells.forEach(cell => {
      cell.parent = null;
      cell.pathOver = false;
    }));
    if(this.cellBind.start == null || this.cellBind.end == null) return;
    var curCell = this.checkAround(this.cellBind.start);
    var debug: Cell[] = [];
    while(curCell != null) {
      debug.push(curCell);
      curCell.pathOver = true;
      curCell = curCell.parent;
    }
    console.log(`took ${Date.now() - startTime} ms`, debug);
  }
}

const game = new Game();
game.render = game.render.bind(game);
game.render();

declare global {
  interface Window {
    game: Game;
  }
}
