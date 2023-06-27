import './App.css';
import Canvas from './Canvas';
import Game from './Game';

let game;

const draw = (ctx, canvas, frameCount, loadContext) => {
	if(canvas !== null) {
		canvas.width = 1920;
		canvas.height = 1080;
	}
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	const alien = loadContext.findOrNull("alien");
	const player = loadContext.findOrNull("ship");
	const enemyLaser = loadContext.findOrNull("enemyLaser");
	const playerLaser = loadContext.findOrNull("playerLaser");
	const heart = loadContext.findOrNull("heart");

	game.drawAllAliens(ctx, alien.img);
	game.drawPlayer(ctx, player.img);
	game.drawEnemyLasers(ctx, enemyLaser.img);
	game.drawPlayerLasers(ctx, playerLaser.img);
	game.drawPlayerHealth(ctx, heart.img);
	game.drawCurrentScore(ctx);

	game.updateAllEntities(frameCount);
	game.performCollisionDetection();
}

const load = (loadContext) => {
	loadContext.addContentSource("/png/alien.png", "alien");
	loadContext.addContentSource("/png/enemyLaser.png", "enemyLaser");
	loadContext.addContentSource("/png/ship.png", "ship");
	loadContext.addContentSource("/png/playerLaser.png", "playerLaser");
	loadContext.addContentSource("/svg/heart.svg", "heart");
}

const onKeyDown = (scancode) => {
	game.handleKeyboardInput(scancode);
}

function App() {
	game = new Game();
	window.addEventListener('keydown', onKeyDown, false);
	return (
		<>
			<Canvas draw={draw} load={load}/>
		</>
	);
}

export default App;
