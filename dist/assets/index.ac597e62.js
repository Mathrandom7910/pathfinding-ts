var y = Object.defineProperty;
var g = (r, e, t) => e in r ? y(r, e, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: t
}) : r[e] = t;
var l = (r, e, t) => (g(r, typeof e != "symbol" ? e + "" : e, t), t);
const p = function () {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
    new MutationObserver(s => {
        for (const i of s)
            if (i.type === "childList")
                for (const o of i.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && n(o)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function t(s) {
        const i = {};
        return s.integrity && (i.integrity = s.integrity), s.referrerpolicy && (i.referrerPolicy = s.referrerpolicy), s.crossorigin === "use-credentials" ? i.credentials = "include" : s.crossorigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i
    }

    function n(s) {
        if (s.ep) return;
        s.ep = !0;
        const i = t(s);
        fetch(s.href, i)
    }
};
p();
class m {
    constructor(e, t) {
        this.x = e, this.y = t
    }
}

function w(r, e) {
    f.fillRect(r.x, r.y, e, e)
}
class k extends m {
    constructor(e, t) {
        super(e, t);
        l(this, "size", a.cellSize);
        l(this, "ren");
        l(this, "isWall", !1);
        l(this, "isStart", !1);
        l(this, "isEnd", !1);
        l(this, "checked", !1);
        l(this, "parent", null);
        l(this, "pathOver", !1);
        this.ren = new m(e * this.size, t * this.size)
    }
    draw() {
        if (this.isWall || this.isStart || this.isEnd || this.pathOver) return f.fillStyle = this.isWall ? "black" : this.isStart ? "green" : this.isEnd ? "red" : "grey", w(this.ren, this.size);
        f.strokeRect(this.ren.x, this.ren.y, this.size, this.size)
    }
}
class S extends m {
    constructor() {
        super(0, 0);
        l(this, "isDown", !1)
    }
}
const c = document.getElementById("gameCanv"),
    f = c.getContext("2d");
(onresize = () => {
    c.width = innerWidth, c.height = innerHeight
})();
const h = class {
    constructor() {
        l(this, "mouse", new S);
        l(this, "cells", []);
        l(this, "keysPressed", {});
        l(this, "cellBind", {
            end: null,
            start: null
        });
        for (let e = 0; e < c.width / h.cellSize; e++)
            for (let t = 0; t < c.height / h.cellSize; t++) this.cells[e] || (this.cells[e] = []), this.cells[e][t] = new k(e, t);
        c.onmousemove = e => {
            this.mouse.x = e.clientX, this.mouse.y = e.clientY
        }, document.onkeydown = e => {
            this.keysPressed[e.key] = !0
        }, document.onkeyup = e => {
            this.keysPressed[e.key] = !1
        }, c.onmousedown = () => {
            this.mouse.isDown = !0;
            const e = this.cells[Math.floor(this.mouse.x / h.cellSize)][Math.floor(this.mouse.y / h.cellSize)];
            if (this.keysPressed[" "] && !this.cellBind.start) {
                e.isStart = !e.isStart, this.cellBind.start = e, e.isStart || (this.cellBind.start = null), e.isWall = !1, e.isEnd = !1;
                return
            } else if (this.keysPressed.Shift && !this.cellBind.end) {
                e.isEnd = !e.isEnd, this.cellBind.end = e, e.isEnd || (this.cellBind.end = null), e.isStart = !1, e.isWall = !1;
                return
            }
            e.isWall = !e.isWall, e.isEnd = !1, e.isStart = !1, this.cellBind.end == e && (this.cellBind.end = null), this.cellBind.start == e && (this.cellBind.start = null)
        }, c.onmouseup = () => {
            this.mouse.isDown = !1
        }
    }
    render() {
        f.clearRect(0, 0, c.width, c.height);
        for (let e = 0; e < this.cells.length; e++)
            for (let t = 0; t < this.cells[e].length; t++) this.cells[e][t].draw();
        requestAnimationFrame(this.render)
    }
    getAround(e) {
        const t = [];
        for (let n = -1; n <= 1; n++)
            for (let s = -1; s <= 1; s++) {
                const i = e.x + n,
                    o = e.y + s;
                if (!this.cells[i]) continue;
                const u = this.cells[i][o];
                n == 0 && s == 0 || !this.cells[i] || !this.cells[i][o] || u.isWall || u.checked || (u.checked = !0, t.push(u))
            }
        return t.filter(n => n)
    }
    checkAround(e) {
        var t = [];
        t.push(...this.getAround(e));
        for (var n = 0; t.length;) {
            if (n > h.maxCount) throw new Error("Counter exceeded " + h.maxCount);
            n++;
            const s = t.shift(),
                i = this.getAround(s);
            for (let o of i) {
                if (o.parent = s, o.isEnd) return o;
                t.push(o)
            }
        }
        return null
    }
    pathFind() {
        const e = Date.now();
        if (this.cells.forEach(n => n.forEach(s => {
                s.parent = null, s.pathOver = !1
            })), !(this.cellBind.start == null || this.cellBind.end == null)) {
            for (var t = this.checkAround(this.cellBind.start); t != null;) t.pathOver = !0, t = t.parent;
            console.log(`took ${Date.now()-e} ms`)
        }
    }
};
let a = h;
l(a, "cellSize", 10), l(a, "maxCount", 5e3);
const d = new a;
d.render = d.render.bind(d);
d.render();
window.game = d;