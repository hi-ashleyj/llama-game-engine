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

Lbase.add(Abackground, Ahalfcircle);

Lcontent.add(AhalfcircleI);

Abackground.position(0, 0, Game.width, Game.height);

Ahalfcircle.position(...Asset.center(Game.width / 2, Game.height / 2, 300, 300));

AhalfcircleI.position(...Asset.center(Game.width / 2, Game.height / 2, 200, 200));

//let AnimateHalfcircleF = new Animate.property(Ahalfcircle, "angleFrom", 1000, { 0: 0, 1: 360 }, Infinity);
//let AnimateHalfcircleT = new Animate.property(Ahalfcircle, "angleTo", 1000, { 0: 180, 1: 540 }, Infinity);
//let AnimateHalfcircleIF = new Animate.property(AhalfcircleI, "angleFrom", 1000, { 0: 180, 1: 540 }, Infinity);
//let AnimateHalfcircleIT = new Animate.property(AhalfcircleI, "angleTo", 1000, { 0: 360, 1: 720 }, Infinity);

let AnimateHalfcircleIX = new Animate.property(AhalfcircleI, "x", 2000, { 0: Game.width / 4, 0.5: Game.width * 3 / 4, 1: Game.width / 4 }, Infinity);

Game.start();