class Obj {
    static textWidth = 150;
    static textHeight = 200;
    static vRatio = 0.33;
    static space = 20;
    static swaptime = 100;
    static nRipplesSprites = 5;

    constructor (title,obj,x,y,sheight,fliped) {
        this.title = title;
        this.obj = obj;
        this.x = x;
        this.y = y;
        this.sheight = sheight;
        this.swidth = Obj.vRatio*sheight

        this.ripplesPos = 1;
        this.time = millis();
        if (fliped) {
            this.textOffset = this.swidth+Obj.space;
        } else {
            this.textOffset = 0;
        }
    }
    update(obj) {
        this.obj = obj;
    }
    draw() {
        // the text box
        fill(156,106,38);
        stroke(0);
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(27);
        textStyle(BOLD);
        text(""+this.obj.hp,this.textOffset+this.x + 505,this.y+2*Obj.textHeight/5,Obj.textWidth,Obj.textHeight/5);//HP
        text(""+this.obj.ap,this.textOffset+this.x+1110,this.y+2*Obj.textHeight/5,Obj.textWidth,Obj.textHeight/5);//AP        
        text(""+this.obj.gameClass,this.textOffset+this.x+780,this.y+2*Obj.textHeight/5,Obj.textWidth,Obj.textHeight/5);//CLASS   
    }
}