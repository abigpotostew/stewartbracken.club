const s = (sketch) => {

    let x = 100;
    let y = 100;
    let config = null;
    let game = null;
    let previousDrawTimeSeconds = 0;
    let assetManager = new AssetManager()

    sketch.setup = () => {
        sketch.createCanvas(600, 700);
        const cellCountX = 7;

        config = new GameConfig()
        config.cellCountX = cellCountX
        config.cellCountY = cellCountX;
        config.assetManager = assetManager
        game = new Game(sketch, config)
    };

    sketch.draw = () => {
        sketch.background(0);

        let startTimeSeconds = sketch.millis() / 1000;
        let dt = (startTimeSeconds - previousDrawTimeSeconds);

        let ctx = new Context(sketch, dt, startTimeSeconds)
        game.update(ctx)
        game.draw(ctx);
        previousDrawTimeSeconds = startTimeSeconds;
    };

    sketch.keyPressed = (e) => {
        if (e.key == 'r') {
            game = new Game(sketch, config)
        }
        game.keyReleased(e)
    }
    sketch.keyReleased = (e) => {
        game.keyPressed(e)
    }
    sketch.preload = () => {
        assetManager.load(sketch)
    }
};

let myp5 = new p5(s);