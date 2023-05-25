const SB_WIDTH = 300;
const SB_HEIGHT = 100;
const SB_POSX = 1430;
const SB_POSY = 15;

class ScoreBoard {
    constructor(game) {
        this.game = game;
    }
    draw() {
        
        fill(156,106,38);
        stroke(0,0,0);
        //rect (SB_POSX,SB_POSY,SB_WIDTH,SB_HEIGHT,5,5,5,5);
        fill(255);
        textAlign(LEFT,CENTER);
        textSize(18);
        textStyle(BOLD);
        text("Turn: "+this.game.turn,SB_POSX+150,SB_POSY+SB_HEIGHT/2.2)
        text("Player: "+this.game.player.name,SB_POSX-1400,SB_POSY+2*SB_HEIGHT + 580);
        text("Opponent: "+this.game.opponents[0].name,SB_POSX-1400,SB_POSY+3*SB_HEIGHT/7);
        //text(`(${this.game.player.state})`,SB_POSX+140,SB_POSY+16.5*SB_HEIGHT/4);
        //text(`(${this.game.opponents[0].state})`,SB_POSX+200,SB_POSY+3*SB_HEIGHT/4);
        if (this.game.player.state == "Playing"){
            text("Your Turn",SB_POSX+140,SB_POSY+16.5*SB_HEIGHT/4);
        }
        else text("Opponent's Turn",SB_POSX+140,SB_POSY+16.5*SB_HEIGHT/4);
        if (this.game.state == "Finished"){ 
            fill(200,0,0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER,CENTER);
            text("GAMEOVER",SB_POSX+200,SB_POSY-5+SB_HEIGHT/4)    
        }
    }

    update(game) {
        this.game = game;
    }
}