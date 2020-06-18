class Grid extends Entity {

    cellCountX = 0;
    cellCountY = 0;
    cellSize = 0;
    #lookup = {};
    grid = []

    constructor(position, cellCountX, cellCountY, sketch) {
        super(new Physics(position), IdUtils.newId("GRID"), null);
        this.cellCountX = cellCountX
        this.cellCountY = cellCountY
        this.cellSize = Math.floor(sketch.width / cellCountX);
        this.grid = new Array(cellCountY)
        for (var i = 0; i < cellCountY; i += 1) {
            this.grid[i] = new Array(cellCountX)
        }

    }

    worldPos(x, y) {
        return this.physics.pos.add(x * this.cellSize + this.cellSize / 2, y * this.cellSize + this.cellSize / 2)
    }

    canMove(dir, e) {
        let dx = dir.x;
        let dy = dir.y;
        let cell = this.#lookup[e.id];
        let nx = cell.x + dx;
        let ny = cell.y + dy;
        if (ny < 0 || ny >= this.grid.length) {
            return false;
        }
        if (nx < 0 || nx >= this.grid[ny].length) {
            return false;
        }
        let targetEntity = this.grid[ny][nx];
        return targetEntity == null;
    }

    moveEntityCell(dir, e) {
        if (!this.canMove(dir, e)) {
            throw new Error("cannot move")
        }
        let cell = this.#lookup[e.id]
        this.setEntityNoPos(cell.x + dir.x, cell.y + dir.y, e)
        // this.setEntity(cell.x + dir.x, cell.y + dir.y, e)
    }

    worldPosOffset(dir, e) {
        if (e.id in this.#lookup) {
            let current = this.#lookup[e.id];
            let targetX = current.x + dir.x
            let targetY = current.y + dir.y
            if (!this.validCoords(targetX, targetY)) {
                throw new Error("Invalid coords")
            }
            return this.worldPos(targetX, targetY)
        }
        throw new Error("entity not in grid")
    }

    validCoords(x, y) {
        if (y < 0 || y >= this.grid.length) {
            return false;
        }
        return x >= 0 && x < this.grid[y].length;
    }

    initWalls(sketch) {
        let egrid = this;
        let walls = []
        for (var y = 0; y < egrid.grid.length; y += 1) {
            for (var x = 0; x < egrid.grid[y].length; x += 1) {
                if (sketch.random(1) > 0.9 && this.grid[y][x] == null) {
                    let wall = EFactory.createWall(sketch.createVector())
                    walls.push(wall);
                    this.setEntity(x, y, wall);
                }
            }
        }
        return walls
    }

    setEntity(x, y, e) {
        this.setEntityNoPos(x, y, e)
        e.physics.pos = this.worldPos(x, y)
    }

    setEntityNoPos(x, y, e) {
        this.removeEntity(e)
        this.grid[y][x] = e;
        this.#lookup[e.id] = new Cell(x, y);
    }

    removeEntity(e) {
        if (e.id in this.#lookup) {
            let cell = this.#lookup[e.id];
            this.grid[cell.y][cell.x] = null;
            this.#lookup[e.id] = null;
            return true;
        }
        return false;
    }

    setEntityRandom(ctx, e) {
        var attempt = 0;
        do {
            let y = Math.floor(ctx.sketch.random(this.grid.length));
            let x = Math.floor(ctx.sketch.random(this.grid[y].length));
            if (this.grid[y][x] == null) {
                this.setEntity(x, y, e);
                return;
            }
        } while (attempt++ < this.cellCountX * this.cellCountX);
        throw new Error("can't find an empty cell");
    }

    addPickup(ctx, image) {
        let pickup = EFactory.createPickup(ctx.sketch.createVector(), this.cellSize, image)
        this.setEntityRandom(ctx, pickup)
        return pickup
    }

    findNeighborsEntity(e) {
        if (!(e.id in this.#lookup)) {
            return [];
        }
        let cell = this.#lookup[e.id]
        return this.findNeighbors(cell.x, cell.y)
    }

    findNeighbors(startx, starty) {
        if (!this.validCoords(startx, starty)) {
            return []
        }
        let out = []
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue;
                }
                let entity = this.getEntity(x + startx, y + starty);
                if (entity != null) {
                    out.push(entity);
                }
            }
        }
        return out;
    }

    getEntity(x, y) {
        if (!this.validCoords(x, y)) {
            return null;
        }
        return this.grid[y][x];
    }

    get sprite() {
        let egrid = this;
        return {
            draw: function (ctx, physics) {
                // ctx.sketch.fill(255);
                // ctx.sketch.rectMode(ctx.sketch.CENTER);
                // ctx.sketch.rect(0,0,100,100);

                for (var y = 0; y < egrid.grid.length; y += 1) {
                    for (var x = 0; x < egrid.grid[y].length; x += 1) {
                        ctx.sketch.rectMode(ctx.sketch.CENTER);
                        ctx.sketch.stroke(200, 150, 0);
                        ctx.sketch.noFill()

                        let neighbors = egrid.findNeighbors(x, y);
                        ctx.sketch.noFill();

                        let countPickups = egrid.numEntityOfType(neighbors, "PICKUP");
                        if (countPickups > 0) {
                            ctx.sketch.fill(70 + countPickups * 15, 64 + countPickups * 13, 43 + countPickups * 10);
                        }

                        let e=egrid.getEntity(x,y)
                        if (e!=null && e.id.startsWith("PICKUP")){
                            ctx.sketch.fill(70, 64, 43);
                        }

                        let pos = egrid.worldPos(x, y);

                        ctx.sketch.rect(pos.x, pos.y, egrid.cellSize, egrid.cellSize);
//                    ctx.app().ellipse(worldPos(x, y).x, worldPos(x, y).y, 2, 2);
                    }
                }
            }
        }
    }

    numEntityOfType(list, typeName) {
        let count = 0
        for (var i = 0; i < list.length; i++) {
            let e = list[i]
            if (e.id.startsWith(typeName)) {
                count++
            }
        }
        return count
    }
}

class EFactory {
    static createPlayer(pos) {
        return new Entity(new Physics(pos), IdUtils.newId("PLAYER"), {
            draw(ctx, phys) {
                ctx.sketch.fill(0, 200, 0)
                ctx.sketch.stroke(255)
                ctx.sketch.ellipse(phys.pos.x, phys.pos.y, 20, 20);
            }
        })
    }

    static createOther(pos) {
        return new Entity(new Physics(pos), IdUtils.newId("OTHER"), {
            draw(ctx, phys) {
                ctx.sketch.fill(200, 0, 0)
                ctx.sketch.stroke(255)
                ctx.sketch.ellipse(phys.pos.x, phys.pos.y, 20, 20);
            }
        })
    }

    static createWall(pos) {
        return new Entity(new Physics(pos), IdUtils.newId("OTHER"), {
            draw(ctx, phys) {
                ctx.sketch.rectMode(ctx.sketch.CENTER);
                ctx.sketch.fill(200, 60, 150)
                ctx.sketch.stroke(30)
                ctx.sketch.rect(phys.pos.x, phys.pos.y, 40, 40)
            }
        })
    }

    static createPickup(pos, maxSize, image) {
        return new Entity(new Physics(pos), IdUtils.newId("PICKUP"), {
            draw(ctx, phys) {
                ctx.sketch.imageMode(ctx.sketch.CENTER)
                let w = image.width
                let h = image.height
                if (w > maxSize || h > maxSize) {
                    let scalar = 1
                    if (image.width >= image.height) {
                        scalar = maxSize / w
                    } else {
                        scalar = maxSize / h
                    }
                    w = w * scalar
                    h = h * scalar
                }
                ctx.sketch.image(image, phys.pos.x, phys.pos.y, w, h)
            }
        })
    }
}