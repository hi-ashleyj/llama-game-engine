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

let AnimateHalfcircleF = new Animate.property(Ahalfcircle, "angleFrom", 1000, { from: 0, to: 360 }, Infinity);
let AnimateHalfcircleT = new Animate.property(Ahalfcircle, "angleTo", 1000, { from: 180, to: 540 }, Infinity);
let AnimateHalfcircleIF = new Animate.property(AhalfcircleI, "angleFrom", 1000, { from: 180, to: 540 }, Infinity);
let AnimateHalfcircleIT = new Animate.property(AhalfcircleI, "angleTo", 1000, { from: 360, to: 720 }, Infinity);

Game.start();