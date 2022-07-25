import { GameObject } from "./game-object";
import { Game } from "./game";

export class Layer {
    static list: Map<string, Layer> = new Map();

    private id: string;
    private readonly canvas: HTMLCanvasElement;
    private readonly options: { level: number };
    readonly width: number;
    readonly height: number;
    private targets: Set<GameObject> = new Set();

    ctx: CanvasRenderingContext2D;

    constructor( id: string, options: { level: number } ) {
        if ( !id ) {
            throw new Error( 'Layer id is required' );
        }
        if (Layer.list.has( id )) {
            return Layer.list.get( id );
        }

        this.id = id;
        this.options = options;

        if (!Game.width || !Game.height) {
            throw new Error( 'Game not created yet' );
        }

        this.width = Game.width;
        this.height = Game.height;

        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = Game.width;
        this.canvas.height = Game.height;
        this.canvas.style.zIndex = options.level.toString();
        this.canvas.className = "llama-game-engine game-canvas";

        this.ctx = this.canvas.getContext( '2d' );
        this.ctx.imageSmoothingEnabled = false;

        Game.pushCanvas( this.canvas );

        Layer.list.set( id, this );
    }

    assign( ...targets: GameObject[] ) {
        for ( const target of targets ) {
            this.targets.add( target );
        }
        return this;
    }

    remove( ...targets: GameObject[] ) {
        for ( const target of targets ) {
            this.targets.delete( target );
        }
        return this;
    }

    purge() {
        this.targets.clear();
    }

    draw() {
        this.ctx.clearRect( 0, 0, this.width, this.height );
        for ( const target of this.targets ) {
            target.draw( this );
        }
    }


    static draw() {
        Layer.list.forEach( layer => {
            layer.draw();
        } );
    }

    static purge() {
        Layer.list.forEach( layer => {
            layer.purge();
        } );
    }
}
