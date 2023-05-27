
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game);
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
    }
}


async function getDecksInfo() {
    let result = await requestDecks();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.matchDecks = result.decks;
        if (GameInfo.playerDeck) GameInfo.playerDeck.update(GameInfo.matchDecks.mycards);
        else GameInfo.playerDeck = new Deck(
            GameInfo.matchDecks.mycards, 635, 370, playCard, GameInfo.images.card);////////////////////////////////////
        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards);
        else GameInfo.oppDeck = new Deck(
            GameInfo.matchDecks.oppcards, GameInfo.width - 635 - Deck.nCards * Card.width, 50, null, GameInfo.images.oppcard);
    }
}


async function getObjsInfo() {
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        let playerObj = GameInfo.game.player.obj;
        let oppObj = GameInfo.game.opponents[0].obj;

        if (GameInfo.playerObj) GameInfo.playerObj.update(playerObj);
        else GameInfo.playerObj = new Obj("You",
            playerObj, 20, 705, 570,/*GameInfo.images.obj, GameInfo.images.ripples,*/false);
        if (GameInfo.oppObj) GameInfo.oppObj.update(oppObj);
        else GameInfo.oppObj = new Obj("Opponent",
            oppObj, -60, -50, 180,/*GameInfo.images.obj, GameInfo.images.ripples,*/true);
    }
}



async function playCard(card) {
    if (!card.active) {
        alert("That card was already played");
    } else {
        let result = await requestPlayCard(card.deckId,card.type);
        if(card.type == 1){
            playAttackSound();
        }

        if(card.type == 2 && GameInfo.game.player.obj.hp < 10){
            playHealSound();
        }

        if(card.type == 3){
            playSpecialSound();
        }

        if(card.type == 4){
            playMirrorSound();
        } 
        
        if(card.type == 5){
            playDefenseSound();
        }
        if(card.type == 6){
            playSelectionSound();
        }
        await getGameInfo();
        await getDecksInfo();
        await getObjsInfo();
        GameInfo.prepareUI();
    }
}
