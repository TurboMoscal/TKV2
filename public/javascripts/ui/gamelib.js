const { game } = require("./gameInfo");

async function cancel() {
    try {
        let result = await requestCancelMatch();
        if (result.successful)
            window.location.pathname = "matches.html"
        else
            window.location.pathname = "matches.html"
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
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

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
    GameInfo.images.hospitallerdefencecard = loadImage('/assets/hospitallerdefenceCard.png');
    GameInfo.images.husariadefencecard = loadImage('/assets/husariadefenceCard.png');
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
    //GameInfo.images.obj = loadImage('/assets/Ship_big_with_guns.png');
   // GameInfo.images.ripples = loadImage('/assets/Ship_ripples_big_all.png');   
}


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    // preload  images
    
    await  getGameInfo();
    setInterval(refresh,1000);

    //buttons (create a separated function if they are many)
    
    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    GameInfo.endturnButton.position(50, GameInfo.height-20);
    GameInfo.endturnButton.mousePressed(endturnAction);
    GameInfo.endturnButton.addClass('game')

    GameInfo.endgameButton = createButton('End Game');
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
}

async function gameOverShortcutLose() {
    GameInfo.game.player.obj.hp = 0
    GameInfo.endgameButton.show();
    GameInfo.game.player.state = "End";
}

function keyPressed() {
    if (keyCode === 17) {
        gameOverShortcut();
    }
    if (keyCode === 16) {
        gameOverShortcutLose();
    }
}