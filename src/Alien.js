import Random from "./Random";

class Alien
{
    constructor(x, y)
    {
        this.position = {
            x: x, 
            y: y
        };
        this.alive = true;
        this.step = 0;
        this.direction = "left";
        this.lastEdge = "right";
        this.magicNumber = Random.range(1, 5000);
    }

    think(frameTime)
    {
        if(frameTime === this.magicNumber ||
           frameTime === this.magicNumber + 1 ||
           frameTime === this.magicNumber + 2 ||
           frameTime === this.magicNumber + 3 ||
           frameTime === this.magicNumber + 4 ||
           frameTime === this.magicNumber + 5 ||
           frameTime === this.magicNumber + 6 ||
           frameTime === this.magicNumber + 7) {
            this.magicNumber += 500;
            return {
                shouldFireLaser: true,
            };
        }
        return {
            shouldFireLaser: false,
        };
    }
}

export default Alien;