let scl = 36;
let cols = 10;
let rows = 21;
let xoffset;
let yoffset = 50;                       
let width;
let height;
let maxwindup = 12;
let objective = 40;
let backgroundColor = 51;

let texture = [];
let selector = 0;

var list = [];
var choices = [0,1,2,3,4,5,6];
var cleft = [];
var indexes = [];
var bag = [];
var cleared = [];

var q = new Array(5);
let value;

let held = 0;

let timer = 0;

var db;
var current;

let lwindup = 0;
let rwindup = 0;

let lines = 0;
let n = 0;

let endtime = 0;
let gametime = 0;

let h = 0;
let o = 0.5;
let sscl = 0.7*scl;


function preload(){
    db = loadJSON('tetramino.json');
    texture[0] = loadImage('assets/block.jpg');
    texture[1] = loadImage('assets/block2.png');
    texture[2] = loadImage('assets/block3.png');

    img2 = loadImage('assets/background2.png');    
}

function setup() {    
    width = displayWidth * pixelDensity() - 18;
    height = displayHeight * pixelDensity() - 18;
    xoffset = width/2-180;
    createCanvas(width,height);
    background(backgroundColor);

    push();
    tint(150,150,150);
    image(img2,scl-7+xoffset-200,scl+10);
    pop();

    stroke(100);
    strokeWeight(6);
    fill(255);
    textSize(50);
    text(objective,3*scl+(xoffset-200),16*scl);

    frameRate(120);
    fillBag();
    createList();
    next();
}

function draw() {
    if(focused){
        if(round(millis()) % 1 === 0)
            timer++;

        if(n === 0){
            keyDown();
            timers();
        }else{
            endState();   
        }
    }    
}

function hold(){
    if(held === 0){
        held = current;
        next();
        holdReset();
    }else{
        let temp = current;
        current = held;
        held = temp;
        holdReset();
    }
    push();
    tint(150,150,150);
    image(img2,scl-7+xoffset-200,scl+10);
    pop();
    graphics();
}

function holdReset(){
    held.x = 4;
    held.y = 0;
    held.rotation = 0;
    current.held = 1;    
}

function score(){
    for(let i = 0; i < rows; i++){
        if(linecheck(i)){
            lines++;
            collapse(i);
            cleared[i].state = 1;
            cleared[i].timer = millis();
        }
    }
    if(lines > 0){
        graphics();
        objective -= lines;
        lines = 0;

        noStroke();
        fill(51);
        rect(2.6*scl+(xoffset-200),14*scl,2*scl,4*scl);

        stroke(100);
        strokeWeight(6);
        fill(255);
        textSize(50);
        text(objective,3*scl+(xoffset-200),16*scl);
    }
}

function linecheck(l){
    for(let i = 0; i < cols; i++){
        if(list[i][l].state === 0)
            return false;
    }
    return true;
}

function collapse(l){
    for(i = l; i > 0; i--){
        for(j = 0; j < cols; j++){
            if(i > 1){
                list[j][i].state = list[j][i-1].state;
                list[j][i].r = list[j][i-1].r;
                list[j][i].g = list[j][i-1].g;
                list[j][i].b = list[j][i-1].b;
            }else{
                list[j][1].state = 0;   
            }        
        }
    }
    repaint();
}

function keyDown(){ 
    if(keyIsDown(76) && (timer % (4)) === 0){
            current.lower();
    }
    if(keyIsDown(75) && (timer % (3)) === 0 && lwindup > maxwindup){
            current.move(-1);
    }
    if(keyIsDown(186) && (timer % (3)) === 0 && rwindup > maxwindup){
            current.move(1);
    }
    if(keyIsDown(75)){
        lwindup += 3;
    }
    if(keyIsDown(186)){
        rwindup += 3;
    }
}

function keyPressed(){
    if(n === 0){
        if(keyCode === 79){//o
            current.rotate(1);
            graphics();
        }else if(keyCode === 222){//''
            current.rotate(-1);
            graphics();
        }else if(keyCode === 75){//k
            current.move(-1);    
        }else if(keyCode === 186){//;
            current.move(1);
        }else if(keyCode === 32){//space
            current.drop();    
        }else if(keyCode === 16 && current.held === 0){//shift
            hold();  
        }
    }
}

function keyReleased() {
    if(value === 75){
        lwindup = 0;
    }else if(value === 186){
        rwindup = 0;
    }
  return false;
}

function createList(){
    for(let i = 0; i < cols; i++){
        list[i] = [];
        for(let j = 0; j < rows; j++){
            list[i][j] = new Block();
            cleared[j] = new Clear();
        }
    }

    for(let i = 0; i < 5; i++){
        q[i] = new Tetramino(bag.pop());
    }
}

function graphics(){
    noTint();

    for(i = 0; i < cols; i++){
        for(j = 0; j < rows; j++){
            if(list[i][j].state === 0){
                noStroke();
                fill(30+(10*((i+j) % 2)));
                rect(xoffset+(i*scl),yoffset+(j*scl),scl,scl);
            }
        }        
    }

    current.shadow();
    current.paint();


    noStroke();
    fill(70);
    rect(xoffset,yoffset-1,cols*scl+1, scl-(scl*0.2)-16);

    noStroke();
    fill(58);
    rect(xoffset,yoffset-1+12,cols*scl+1, scl-(scl*0.2)-12);

    let cx = scl+sscl+xoffset-200;
    let cy = 8.7*scl;

    if(held != 0){
        for(let i = 0; i < held.map.length; i++){
            for(let j = 0; j < held.map[i].length; j++){
                if(held.map[held.rotation][i][j] === 1){
                    if(held.tetr === 0){
                        h = 0.5;
                        o = 0;
                    }
                    if(held.tetr === 3)
                        h = 0.5;                    

                    blockTexture(((i-h)*(sscl)+cx),((j+o)*(sscl))+cy,(sscl),db.colors[held.tetr].r,db.colors[held.tetr].g,db.colors[held.tetr].b);

                    if(held.tetr === 0){
                        h = 0;
                        o = 0.5;
                    }
                    if(held.tetr === 3)
                        h = 0;  
                }
            }
        }
    }

    cx = 17.2*scl+xoffset-200;

    for(let k = 0; k < 5; k++){
        for(let i = 0; i < q[k].map.length; i++){
            for(let j = 0; j < q[k].map[i].length; j++){
                if(q[k].map[q[k].rotation][i][j] === 1){
                    if(q[k].tetr === 0){
                        h = 0.5;
                        o = 0;
                    }
                    if(q[k].tetr === 3)
                        h = 0.5;
                    blockTexture(((i-h)*(sscl))+cx,((j+o)*(sscl))+(3.7+(3.5*k))*scl,(sscl),db.colors[q[k].tetr].r,db.colors[q[k].tetr].g,db.colors[q[k].tetr].b);
                    if(q[k].tetr === 0){
                        h = 0;
                        o = 0.5;
                    }
                    if(q[k].tetr === 3)
                        h = 0;  
                }
            }
        }
    }

    for(let j = 0; j < rows; j++){
        if(cleared[j].state === 1){
            console.log('1');
            noStroke();
            fill(255);
            rect(xoffset,yoffset+(j*scl),10*scl,scl);
        }
    }

    
}

function blockTexture(x,y,scale,r,g,b){
    push();
    tint(r,g,b);
    image(texture[selector],x,y,scale,scale);
    pop();
}

function next(){
    current = q[0];
    if(!current.check(0,0,current.rotation)){
        end(-1);
    }

    for(let i = 0; i < 4; i++){
        q[i] = q[i+1];
    }
    q[4] = new Tetramino(bag.pop());

    if(bag.length === 0)
        fillBag();

    graphics();
}

function fillBag(){
    for(let i = 0; i < 7; i++){
        cleft[i] = choices[i];   
    }

    for(let i = 0; i < 7; i++){
        rIndexes();
        bag[i] = yoink(cleft,random(indexes));
    }
}

function yoink(a,i){
    let temp = a[i];
    for(let j = i; j < (a.length)-1; j++){
        a[j] = a[j+1];
    }
    a.pop();
    return temp;
}

function rIndexes(){
    for(let i = 0; i < cleft.length+1; i++){
        indexes.pop();
    }
    for(let i = 0; i < cleft.length; i++){
        indexes[i] = i;
    }
}


function timers(){
    let flag = 0;
    if(lwindup > 0)
        lwindup -=2;
    if(rwindup > 0)
        rwindup -=2;
    if(timer % (65) === 0 && !current.lower()){
        if(current.r === 0 || current.failed === 3){
            current.place();
        }else{
            current.r = 0
            current.failed++;
        }
    }

    for(let i = 0; i < rows; i++){
        if(cleared[i].timer < (millis()-100) && cleared[i].state === 1){
            cleared[i].state = 0;
            cleared[i].timer = 0;
            repaint();
            graphics();
        }
    }

    if(objective < 1)
        end(1);

    noStroke();
    fill(backgroundColor);
    rect(0,0,width,1.3*scl);

    if(gametime < (millis()-10)){
        gametime += 20;
    }

    stroke(100);
    strokeWeight(6);
    fill(255);
    textSize(50);
    text(round(gametime/10)/100,9.5*scl+(xoffset-200),1.2*scl);
}

function end(s){
    n = s;
    endtime = millis();
    for(let i = 0; i < rows; i++){
        cleared[i].state = 0;          
    }

    repaint();
    graphics();
}

function endState(){
    if(n === 1){
        stroke(100);
        strokeWeight(4);
        fill(255);
        textSize(50);
        text(' Clear!',8*scl+(xoffset-200),10*scl);

        stroke(100);
        strokeWeight(4);
        fill(255);
        textSize(50);
        text(round(endtime/10)/100,9*scl+(xoffset-200),11.5*scl);
    }else if(n === -1){
        stroke(100);
        strokeWeight(4);
        fill(255);
        textSize(50);
        text('You lost.',8*scl+(xoffset-200),10*scl);
    }

    noStroke();
    fill(51);
    rect(2.6*scl+(xoffset-200),14*scl,2*scl,4*scl);

    stroke(100);
    strokeWeight(6);
    fill(255);
    textSize(50);
    text('0',3*scl+(xoffset-200),16*scl);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function repaint(){
    for(i = 0; i < cols; i++){
        for(j = 0; j < rows; j++){
            if(list[i][j].state === 1){
                blockTexture(xoffset+(i*scl),yoffset+(j*scl),scl,list[i][j].r,list[i][j].g,list[i][j].b);
            }
        }
    }
}

class Block {
    constructor(){
        this.state = 0;
        this.r = 51;
        this.g = 51;
        this.b = 51;
    }
}

class Clear{
    constructor(){
        this.state = 0;
        this.timer = 0;
    }
}