class Obj {
    static textWidth = 150;
    static textHeight = 200;
    static vRatio = 0.33;
    static space = 20;
    static swaptime = 100;
    static nRipplesSprites = 5;

    constructor (title,obj,x,y,sheight,/*img,ripplesImg,*/fliped) {
        this.title = title;
        this.obj = obj;
        this.x = x;
        this.y = y;
        this.sheight = sheight;
        this.swidth = Obj.vRatio*sheight
        //this.img = img;
       // this.ripplesImg = ripplesImg;
        this.ripplesPos = 1;
        this.time = millis();
        if (fliped) {
            this.textOffset = this.swidth+Obj.space;
           // this.imgOffset = 0;
        } else {
            this.textOffset = 0;
           // this.imgOffset = Obj.textWidth+Obj.space;
        }
    }
    update(obj) {
        this.p = obj;
    }
    draw() {
        // the text box
        fill(100,100,200);
        stroke(0);
        rect(this.textOffset+this.x,this.y,Obj.textWidth,Obj.textHeight);
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(18);
        textStyle(BOLD);
        text(this.title,this.textOffset+this.x,this.y,Obj.textWidth,1*Obj.textHeight/4);
        text(this.obj.state,this.textOffset+this.x,this.y+Obj.textHeight/4,Obj.textWidth,Obj.textHeight/4);
        text("HP: "+this.obj.hp,this.textOffset+this.x,this.y+2*Obj.textHeight/4,Obj.textWidth,Obj.textHeight/4);
        text("Class:"+this.obj.ap,this.textOffset+this.x,this.y+3*Obj.textHeight/4,Obj.textWidth,Obj.textHeight/4);        
        // the image
       /* let ellapsed = millis() - this.time;
        if (ellapsed > Obj.swaptime) {
            this.ripplesPos++;
            if (this.ripplesPos >= Obj.nRipplesSprites) this.ripplesPos=0;
            this.time = millis();
        }*/
       /* let spriteWidth = this.ripplesImg.width/Obj.nRipplesSprites;
        image(this.ripplesImg,this.x+this.imgOffset-this.swidth*0.15,this.y-this.sheight*0.15,this.swidth*1.3,this.sheight*1.3,
             spriteWidth* this.ripplesPos, 0, spriteWidth, this.ripplesImg.height);
        image(this.img,this.x+this.imgOffset,this.y,this.swidth,this.sheight);*/
    }
}