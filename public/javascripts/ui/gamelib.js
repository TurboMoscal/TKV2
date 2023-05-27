const { game } = require("./gameInfo");

async function cancel() {
    try {
        let result = await requestCancelMatch();
        window.location.pathname = "matches.html";
    } catch(err) {
        console.log(err);
    }
}

async function refresh() {
    if (GameInfo.game.player.state == "Waiting") { 
        // Every time we are waiting
        await getGameInfo();   
        await getDecksInfo();  
        await getObjsInfo();
        if (GameInfo.game.player.state != "Waiting") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
            gameOver();
        }
    } 
}

let volumeSlider;

function preload() {
    GameInfo.images.card = loadImage('/assets/card_template.png');
    GameInfo.images.oppcard = loadImage('/assets/cardBack.png');
    GameInfo.images.youwon = loadImage('/assets/youWon.png');
    GameInfo.images.youlost = loadImage('/assets/youLost.png');
    GameInfo.images.back = loadImage('/assets/back.png');
    GameInfo.images.hospcard = loadImage('/assets/hospCard.png');
    GameInfo.images.huscard = loadImage('/assets/husCard.png');
    GameInfo.images.alcoholcard = loadImage('/assets/alcoholCard.png');
    GameInfo.images.arrowcard = loadImage('/assets/arrowCard.png');
    GameInfo.images.atruehospcard = loadImage('/assets/atruehospCard.png');
    GameInfo.images.atruehuscard = loadImage('/assets/atruehusCard.png');
    GameInfo.images.craguemartcard = loadImage('/assets/craguemartCard.png');
    GameInfo.images.daggercard = loadImage('/assets/daggerCard.png');
    GameInfo.images.fielddoctorcard = loadImage('/assets/fielddoctorCard.png');
    GameInfo.images.halberdcard = loadImage('/assets/halberdCard.png');
    GameInfo.images.hospcard = loadImage('/assets/hospCard.png');
    GameInfo.images.hospdefencecard = loadImage('/assets/hospdefenceCard.png');
    GameInfo.images.husdefencecard = loadImage('/assets/husdefenceCard.png');
    GameInfo.images.huscard = loadImage('/assets/husCard.png');
    GameInfo.images.macecard = loadImage('/assets/maceCard.png');
    GameInfo.images.medicinalherbscard = loadImage('/assets/medicinalherbsCard.png');
    GameInfo.images.mirrorcard = loadImage('/assets/mirrorCard.png');
    GameInfo.images.morphinecard = loadImage('/assets/morphineCard.png');
    GameInfo.images.rapiercard = loadImage('/assets/rapierCard.png');
    GameInfo.images.spearcard = loadImage('/assets/spearCard.png');
    GameInfo.images.stilettocard = loadImage('/assets/stilettoCard.png');
    GameInfo.images.swordcard = loadImage('/assets/swordCard.png');
    GameInfo.fonts.retro = loadFont("/assets/RETRO_SPACE.ttf");
    GameInfo.sounds.win = loadSound('/assets/win.wav');
    GameInfo.sounds.lose = loadSound('/assets/lose.wav');
    GameInfo.sounds.attack = loadSound('/assets/sword.mp3');
    GameInfo.sounds.healing = loadSound('/assets/heal.wav');
    GameInfo.sounds.background = loadSound('/assets/background.mp3');
    GameInfo.sounds.special= loadSound('/assets/special.mp3');
    GameInfo.sounds.mirror = loadSound('/assets/mirror.mp3');
    GameInfo.sounds.defense = loadSound('/assets/defense.mp3');
    GameInfo.sounds.selection = loadSound('/assets/warcry.wav')

}


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    GameInfo.sounds.attack.setVolume(0.07);
    GameInfo.sounds.healing.setVolume(0.07);
    GameInfo.sounds.special.setVolume(0.07);
    GameInfo.sounds.mirror.setVolume(0.07);
    GameInfo.sounds.defense.setVolume(0.07);
    GameInfo.sounds.selection.setVolume(0.04);
    GameInfo.sounds.background.setVolume(0.01);
    GameInfo.sounds.win.setVolume(0.06);
    GameInfo.sounds.lose.setVolume(0.06);
    
    GameInfo.sounds.background.loop();

    await  getGameInfo();
    setInterval(refresh,1000);

    GameInfo.endgameButton = createButton('Leave Match');
    GameInfo.endgameButton.parent('game');
    GameInfo.endgameButton.position(1600, GameInfo.height-50);
    GameInfo.endgameButton.mousePressed(cancel);
    GameInfo.endgameButton.addClass('game')

    await getDecksInfo();
    await getObjsInfo();

    GameInfo.prepareUI();
    

    GameInfo.loading = false;
}

function draw() {

    background(GameInfo.images.back);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);
    } else {
        GameInfo.scoreBoard.draw();
        GameInfo.playerDeck.draw();
        GameInfo.oppDeck.draw();
        GameInfo.playerObj.draw();
        GameInfo.oppObj.draw();

        gameOver();
    }    
}

async function gameOver() {
    if (GameInfo.game.opponents[0].obj.hp <= 0) {
        image(GameInfo.images.youwon,0,0,GameInfo.width,GameInfo.height);
        GameInfo.game.player.state = "End";
    }
    if (GameInfo.game.player.obj.hp <= 0) {
        image(GameInfo.images.youlost,0,0,GameInfo.width,GameInfo.height);
        GameInfo.game.player.state = "End";
    }
}

async function mouseClicked() {
    if ( GameInfo.playerDeck) {
        GameInfo.playerDeck.click();
    }
}

async function gameOverShortcut() {
    GameInfo.game.opponents[0].obj.hp = 0
    GameInfo.endgameButton.show();
    GameInfo.game.player.state = "End";
    GameInfo.gameoverState = true;
}

async function gameOverShortcutLose() {
    GameInfo.game.player.obj.hp = 0
    GameInfo.endgameButton.show();
    GameInfo.game.player.state = "End";
    GameInfo.gameoverState = true;
}

function keyPressed() {
    if (keyCode === 17) {
        GameInfo.sounds.win.play();
        gameOverShortcut();
    }
    if (keyCode === 16) {
        GameInfo.sounds.lose.play();
        gameOverShortcutLose();
    }
}