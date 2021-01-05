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

let AhalfcircleI = Ahalfcircle.clone("halfcircleI", { angleFrom: 180, angleTo: 360, fill: "#7700cc" });

Lbase.add(Abackground, Ahalfcircle);

Lcontent.add(AhalfcircleI);

Abackground.draw(0, 0, Game.width, Game.height);

Ahalfcircle.draw(Game.width / 2, Game.height / 2, 300, 300);

AhalfcircleI.draw(Game.width / 2, Game.height / 2, 200, 200);