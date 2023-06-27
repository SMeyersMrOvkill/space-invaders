import Alien from "./Alien";
import EnemyLaser from "./EnemyLaser";
import PlayerLaser from "./PlayerLaser";

class Game
{
    constructor()
    {
        this.aliens = [];
        for(let i = 0; i < 29; i++) {
            this.aliens.push(new Alien(32 + (64 * i), 32));
        }
        this.player = {
            position: {
                x: 1920/2 - 32,
                y: 1080 - 64,
            },
            hp: 10,
        };
        this.enemyLasers = [];
        this.playerLasers = [];
        this.lastFrameTime = 0;
        this.lastShot = 0;
    }

    drawAllAliens(ctx, img) {
        this.aliens.forEach((alien) => {
            if(alien.alive) {
                ctx.drawImage(img, alien.position.x, alien.position.y, 32, 32);
            }
        });
    }

    drawEnemyLasers(ctx, img) {
        this.enemyLasers.forEach((laser) => {
            ctx.drawImage(img, laser.position.x, laser.position.y, 4, 16);
        });
    }

    drawPlayer(ctx, img) {
        ctx.drawImage(img, this.player.position.x, this.player.position.y, 64, 64);
    }

    drawPlayerLasers(ctx, img) {
        this.playerLasers.forEach((laser) => {
            ctx.drawImage(img, laser.position.x, laser.position.y, 4, 16);
        });
    }

    drawPlayerHealth(ctx, img) {
        for(let i = 0; i < this.player.hp; i++) {
            ctx.drawImage(img, i * 32, 0, 32, 32);
        }
    }

    drawCurrentScore(ctx) {
        let currentScore = 0;
        this.aliens.forEach((alien) => {
            if(!alien.alive) {
                currentScore += 5;
            }
        });
        ctx.font = "32px serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Current Score: " + currentScore, 1920-300, 30);
    }

    updateAllEntities(frameTime) {
        if(frameTime !== this.lastFrameTime && frameTime-this.lastFrameTime >= 8) {
            for(let i = 0; i < this.aliens.length; i++) {
                switch(this.aliens[i].direction)
                {
                    case "left":
                        this.aliens[i].step -= 1;
                        this.aliens[i].position.x -= 1;
                        if(this.aliens[i].step <= -32) {
                            this.aliens[i].step = 0;
                            this.aliens[i].direction = "right";
                            this.aliens[i].lastEdge = "left";
                        }
                        break;
                    case "right":
                        this.aliens[i].step += 1;
                        this.aliens[i].position.x += 1;
                        if(this.aliens[i].step >= 32) {
                            this.aliens[i].step = 0;
                            this.aliens[i].direction = "down";
                            this.aliens[i].lastEdge = "right";
                        }
                        break;
                    case "down":
                        this.aliens[i].position.y += 8;
                        this.aliens[i].direction = "left";
                        this.aliens[i].lastEdge = "right";
                        if (this.aliens[i].position.y >= 1080) {
                            this.aliens[i].position.y = 32;
                        }
                        break;
                    default:
                        
                }
                if(this.aliens[i].alive) {
                    let result = this.aliens[i].think(frameTime);
                    if(result.shouldFireLaser) {
                        this.enemyLasers.push(new EnemyLaser(this.aliens[i].position.x + 14, this.aliens[i].position.y+32));
                    }
                }
            }
            this.lastFrameTime = frameTime;
        }
    }

    performCollisionDetection()
    {
        for(let i = 0; i < this.enemyLasers.length; i++) 
        {
            this.enemyLasers[i].position.y += 10;
            if(this.enemyLasers[i].position.y > 1080) {
                let currentLaser = this.enemyLasers[i];
                const newEnemyLasers = [];
                this.enemyLasers.forEach((laser) => {
                    if(laser.position.x !== currentLaser.position.x && laser.position.y !== currentLaser.position.y) {
                        newEnemyLasers.push(laser);
                    }
                });
                this.enemyLasers = newEnemyLasers;
            }
        }
        for(let i = 0; i < this.playerLasers.length; i++)
        {
            this.playerLasers[i].position.y -= 20;
            if(this.playerLasers[i].position.y < 1) {
                let currentLaser = this.playerLasers[i];
                const newPlayerLasers = [];
                this.playerLasers.forEach((laser) => {
                    if(laser.position.x !== currentLaser.position.x && laser.position.y !== currentLaser.position.y) {
                        newPlayerLasers.push(laser);
                    }
                });
                this.playerLasers = newPlayerLasers;
            }
        }
        for(let i = 0; i < this.enemyLasers.length; i++) {
            if((this.enemyLasers[i].position.x >= this.player.position.x && 
                this.enemyLasers[i].position.x <= this.player.position.x + 64) && 
                (this.enemyLasers[i].position.y >= this.player.position.y &&
                this.enemyLasers[i].position.y <= this.player.position.y + 64)) {
                    this.player.hp -= 1;
                    let currentLaser = this.enemyLasers[i];
                    const newEnemyLasers = [];
                    this.enemyLasers.forEach((laser) => {
                        if(laser.position.x !== currentLaser.position.x && laser.position.y !== currentLaser.position.y) {
                            newEnemyLasers.push(laser);
                        }
                    });
                    this.enemyLasers = newEnemyLasers;
                    return;
                }
        }
        for(let i = 0; i < this.playerLasers.length; i++) {
            for(let x = 0; x < this.aliens.length; x++) {
                if(
                    (
                        this.playerLasers[i].position.x >= this.aliens[x].position.x &&
                        this.playerLasers[i].position.x <= this.aliens[x].position.x + 32
                    ) &&
                    (
                        this.playerLasers[i].position.y >= this.aliens[x].position.y &&
                        this.playerLasers[i].position.y <= this.aliens[x].position.y + 32
                    )
                ) {
                    console.log("Collision between enemy and player laser! Killing alien and destroying laser!");
                    this.aliens[x].alive = false;
                    let currentLaser = this.playerLasers[i];
                    const newPlayerLasers = this.playerLasers.filter((v, z, a) => {
                        if(currentLaser.position.x === this.aliens[x].position.x && currentLaser.position.y === this.aliens[x].position.y) {
                            return true;
                        }
                        return false;
                    });
                    this.playerLasers = newPlayerLasers;
                    return;
                }
            }
        }
    }

    handleKeyboardInput(event)
    {
        if(event.code === 'Space' && this.lastFrameTime - this.lastShot > 45) {
            this.lastShot = this.lastFrameTime;
            this.playerLasers.push(new PlayerLaser(this.player.position.x + 30, this.player.position.y - 64));
        } else if(event.code === 'ArrowRight' && this.player.position.x <= 1890) {
            this.player.position.x += 2;
        } else if(event.code === 'ArrowLeft' && this.player.position.x > 0) {
            this.player.position.x -= 2;    
        }
    }
}

export default Game;