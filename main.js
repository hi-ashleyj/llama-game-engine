Game.create({ width: 1080, height: 1920 });

let Lbase = new Layer("base", { level: 0 });
let Lcontent = new Layer("content", { level: 1 });

let Abackground = new Asset("background", {
    primitive: "rectangle",
    fill: "#222222"
});

let Ahalfcircle = new Asset("halfcircle", {
    primitive: "arc",
    fill: "#ffffff",
    angleFrom: 0,
    angleTo: 180
});

let AhalfcircleI = Ahalfcircle.clone("halfcircleI", { fill: "#7700cc" });

let AbouncingDot = new Asset("bouncedot", {
    primitive: "circle",
    fill: "#db188a"
});

Lbase.add(Abackground, Ahalfcircle);

Lcontent.add(AhalfcircleI, AbouncingDot);

Abackground.position(0, 0, Game.width, Game.height);

Ahalfcircle.position(Game.width / 2, Game.height / 2, 300, 300);
AhalfcircleI.position(Game.width / 2, Game.height / 2, 200, 200);

AbouncingDot.position(Game.width / 2, Game.height / 2, 30, 30);

let AnimateHalfcircleF = new Animate.property(Ahalfcircle, "angleFrom", 1000, { 0: 0, 1: 360 }, Infinity);
let AnimateHalfcircleT = new Animate.property(Ahalfcircle, "angleTo", 1000, { 0: 180, 1: 540 }, Infinity);
let AnimateHalfcircleIF = new Animate.property(AhalfcircleI, "angleFrom", 1000, { 0: 180, 1: 540 }, Infinity);
let AnimateHalfcircleIT = new Animate.property(AhalfcircleI, "angleTo", 1000, { 0: 360, 1: 720 }, Infinity);

let AnimateHalfcircleIX = new Animate.property(AbouncingDot, "x", 3000, { 0: (Game.width / 2) - 50, 0.5: (Game.width / 2) + 50, 1: (Game.width / 2) - 50 }, Infinity);

Game.start();