// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width = 1750;
    static height = 850;

    static loading = true;

    // data
    static game;
    static matchDecks;
    static images = {};
    static sounds = {};

    // renderers
    static scoreBoard;
    static playerDeck;
    static oppDeck;
    static playerObj;
    static oppObj;

    // buttons
    static endturnButton;

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Playing") { 
            GameInfo.endturnButton.show();
            GameInfo.playerDeck.active = true;
        } else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.endturnButton.hide();
            GameInfo.playerDeck.active = false;
        } 
    }
}