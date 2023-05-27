//CHANGED
class Card {
    static width = 160;
    static height = 260;
    constructor(card, x, y, img) {
        this.card = card;
        this.x = x;
        this.y = y;
        this.img = img;
        if (this.card.image) {
            let imageName = this.card.image;
            let name = imageName.split('.')[0].toLowerCase();
            this.cardImage = GameInfo.images[name];
        }
    }
    draw(darker,hover,normal) {
        if (!this.card.active) tint(56, 56, 56);
        if (normal && this.card.active){
            tint(214, 214, 214);
        }
        if (mouseX > this.x && mouseX < this.x + Card.width && mouseY > this.y && mouseY < this.y + Card.height && hover && this.card.active && GameInfo.gameoverState == false){
            tint(255, 255, 255);
        }
        if (darker && this.card.active) {
            tint(128, 128, 128);}
        if (this.card.image)     
            image(this.cardImage,this.x, this.y, Card.width, Card.height);    
        else 
            image(this.img, this.x, this.y, Card.width, Card.height);
        textFont(GameInfo.fonts.retro);
        textAlign(CENTER, CENTER);
        fill(255)
        textStyle(BOLD);
        textSize(12);
        stroke(0);
        strokeWeight(2);
        text(this.card.cost, this.x + Card.width * 0.905, this.y + Card.height * 0.065);
        strokeWeight(1);
        noStroke();
        fill(0);
        textSize(15);
        text(this.card.name, this.x + Card.width * 0.5, this.y + Card.height * 0.12);
        textSize(8);
        textAlign(CENTER, TOP);
        //text(this.card.effect, this.x + Card.width * 0.1, this.y + Card.height * 0.68,
            //Card.width * 0.8, Card.height * 0.1);
        if (this.card.note) {
            //text(this.card.note, this.x + Card.width * 0.1, this.y + Card.height * 0.8,
                //Card.width * 0.8, Card.height * 0.15);
        }
        textStyle(NORMAL);
        noTint();
    }
    click() {
        return mouseX > this.x && mouseX < this.x + Card.width &&
            mouseY > this.y && mouseY < this.y + Card.height;
    }
}


class Deck {
    static titleHeight = 85;
    static nCards = 3;

    constructor(cardsInfo, x, y, clickAction, cardImg) {
        this.x = x;
        this.y = y;
        this.width = Card.width * Deck.nCards;
        this.clickAction = clickAction;
        this.cardImg = cardImg;
        this.cards = this.createCards(cardsInfo);
        this.active;
        this.darker = false;
        this.hover = false;
        this.normal = false;
    }

    createCards(cardsInfo) {
        let cards = [];
        let x = this.x;
        for (let cardInfo of cardsInfo) {
            cards.push(new Card(cardInfo, x, this.y + Deck.titleHeight, this.cardImg));
            x += Card.width;
        }
        return cards;
    }


    update(cardsInfo) {
        this.cards = this.createCards(cardsInfo);
    }


    draw() {
        fill(0);
        noStroke();
        textSize(22);
        textAlign(CENTER, CENTER);
        text(this.title, this.x, this.y, this.width, Deck.titleHeight);
        for (let card of this.cards) {
            card.draw(this.darker, this.hover, this.normal);
        }

    }

    click() {
        if (this.clickAction && GameInfo.playerDeck.active == true && GameInfo.gameoverState == false) {
            for (let card of this.cards) {
                if (card.click()) {
                    this.clickAction(card.card);
                }
            }
        }
    }
}