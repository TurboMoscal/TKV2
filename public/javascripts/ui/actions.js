
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
        else GameInfo.playerDeck = new Deck("Your cards",
            GameInfo.matchDecks.mycards,605,490,playCard,GameInfo.images.card);////////////////////////////////////
        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards); 
        else GameInfo.oppDeck = new Deck("Opponent cards",
            GameInfo.matchDecks.oppcards,GameInfo.width-630-Deck.nCards*Card.width,5,null,GameInfo.images.card);
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
        playerObj,20,605,570,/*GameInfo.images.obj, GameInfo.images.ripples,*/false);
        if (GameInfo.oppObj) GameInfo.oppObj.update(oppObj); 
        else GameInfo.oppObj = new Obj("Opponent",
            oppObj,-60,15,180,/*GameInfo.images.obj, GameInfo.images.ripples,*/true);
    }
}



async function playCard(card) {
    if (!card.active) {
        alert("That card was already played");
    } else if (confirm(`Do you want to play the "${card.name}" card?`)) {
        let result = await requestPlayCard(card.deckId);
        if (result.successful) {
            await getGameInfo();
            await getDecksInfo();
            await getObjsInfo();
        }
        alert(result.msg);
    }
}


async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.")
}