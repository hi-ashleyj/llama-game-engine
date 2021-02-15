let MultiText = function(options) {
    this.text = options.text;
    this.size = options.size;
    this.font = options.font;
    this.style = (options.style) ? options.style : "";
    this.fill = (options.fill) ? options.fill : null;
    this.stroke = (options.stroke) ? options.stroke : null;
    this.alignH = (["left", "center", "right"].includes(options.alignH)) ? options.alignH : "left";
    this.alignV = (["top", "middle", "bottom", "alphabetic"].includes(options.alignV)) ? options.alignV : "alphabetic";
    this.spacing = (options.spacing) ? options.spacing : 1.35;

    return this;
};

MultiText.prototype.draw = function(layer, x, y, w, _h) {
    // Add logic here regarding splitting lines, new lines etc
    let splitter = this.text.split(" ");
    let lines = [""];
    let current = 0;

    layer.ctx.textAlign = this.alignH;
    layer.ctx.textBaseline = this.alignV;
    layer.ctx.font = ((this.style) ? this.style + " ": "") + this.size + "px " + this.font;

    for (let i = 0; i < splitter.length; i++) {
        let newLine = splitter[i].split("\n");
        let test = newLine[0];
        
        if (Math.ceil(layer.ctx.measureText(lines[current] + " " + test).width) > w) {
            current ++;
            lines.push(test);
        } else {
            lines[current] += ((lines[current].length > 0) ? " " : "") + test;
        }

        if (newLine[1]) {
            current ++;
            lines.push(newLine[1]);
        }
    }

    let lineLengths = lines.map((val) => { return layer.ctx.measureText(val).width; });
    let longest = Math.max(...lineLengths);

    let additionalHeight = ((lines.length - 1) * this.spacing * this.size);
    let initialOffset = (this.alignV == "middle") ? (additionalHeight / -2) : ((this.alignV == "bottom") ? (additionalHeight * -1) : 0);

    if (this.fill) {
        layer.ctx.fillStyle = this.fill;
        layer.ctx.fillText(this.text, x, y);
    }
    if (this.stroke) {
        layer.ctx.strokeStyle = this.stroke;
        layer.ctx.strokeText(this.text, x, y);
    }
};