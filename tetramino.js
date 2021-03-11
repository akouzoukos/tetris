class Tetramino {
	constructor(n){
		this.x = 3;
		this.y = 0;
		this.tetr = n;
		this.rotation = 0;
		this.map = [];
		this.held = 0;
		this.r = 0;
		this.failed = 0;
		for(let i = 0; i < 4; i++){
			this.map[i] = [];
			for(let j = 0; j < 4; j++){
				this.map[i][j] = [];
				for(let k = 0; k < 4; k++){
					this.map[i][j][k] = 0;
				}
			}
		}
		this.setMap();
	}

	paint(){
		for(let i = 0; i < this.map.length; i++){
			for(let j = 0; j < this.map[i].length; j++){
				if(this.map[this.rotation][i][j] === 1){
					blockTexture((((this.x)+i)*scl)+xoffset,(((this.y)+j) * scl)+yoffset,scl,db.colors[this.tetr].r,db.colors[this.tetr].g,db.colors[this.tetr].b);
				}
			}
		}
	}

	shadow(){
		for(let i = 0; i < this.map.length; i++){
			for(let j = 0; j < this.map[i].length; j++){
				if(this.map[this.rotation][i][j] === 1){
					stroke(db.colors[this.tetr].r,db.colors[this.tetr].g,db.colors[this.tetr].b);
                	strokeWeight(2);
                	noFill();
                	rect((((this.x)+i) * scl)+xoffset+3,(((this.lowest())+j) * scl)+yoffset+3,scl-6,scl-6);
				}
			}
		}
	}

	place(){
		for(let i = 0; i < this.map[this.rotation].length; i++){
			for(let j = 0; j < this.map[this.rotation][i].length; j++){
				if(this.map[this.rotation][i][j] === 1){
					list[(this.x)+i][(this.y)+j].state = 1;
					list[(this.x)+i][(this.y)+j].r = db.colors[this.tetr].r;
					list[(this.x)+i][(this.y)+j].g = db.colors[this.tetr].g;
					list[(this.x)+i][(this.y)+j].b = db.colors[this.tetr].b;

					push();
    				tint(150,150,150);
    				image(img2,scl-7+xoffset-200,scl+10);
    				pop();

				}
			}	
		}
		repaint();
		next();
		score();
		this.held = 0;
	}

	move(d){
		this.r++;
		if(this.check(d,0,this.rotation) === true)
			this.x += d;
		graphics();
	}

	lower(){
		if(this.check(0,1,this.rotation)){
        	this.y++;
        	graphics();
        	return true;
   		}
   		return false;
	}

	drop(){
        this.y = this.lowest();
        this.place();
	}

	lowest(){
		for(let i = 0; i < (rows - this.y); i++){
			if(!this.check(0,i,this.rotation)){
        		return (this.y)+i-1;	
   			}	
		}	
	}

	rotate(r){
		this.r++;
		if(this.tetr === 0){
			if(r === 1){
				switch(this.rotation){
					case 0:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i01[i][0],db.i01[i][1],(this.rotation)+r)){
								this.x += db.i01[i][0];
								this.y += db.i01[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 1:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i12[i][0],db.i12[i][1],(this.rotation)+r)){
								this.x += db.i12[i][0];
								this.y += db.i12[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 2:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i23[i][0],db.i23[i][1],(this.rotation)+r)){
								this.x += db.i23[i][0];
								this.y += db.i23[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 3:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i30[i][0],db.i30[i][1],0)){
								this.x += db.i30[i][0];
								this.y += db.i30[i][1];
								this.rotation = 0;
								return true;
							}
						}
						return false;
				}
			}else{
				switch(this.rotation){
					case 0:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i03[i][0],db.i03[i][1],3)){
								this.x += db.i03[i][0];
								this.y += db.i03[i][1];
								this.rotation = 3;
								return true;
							}
						}
						return false;
					case 1:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i10[i][0],db.i10[i][1],(this.rotation)+r)){
								this.x += db.i10[i][0];
								this.y += db.i10[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
					case 2:
						for(let i = 0; i < 7; i++){
							if(this.check(db.i21[i][0],db.i21[i][1],(this.rotation)+r)){
								this.x += db.i21[i][0];
								this.y += db.i21[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
					case 3:
						for(let i = 0; i < 7; i--){
							if(this.check(db.i32[i][0],db.i32[i][1],(this.rotation)+r)){
								this.x += db.i32[i][0];
								this.y += db.i32[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
				}
			}
		}else{
			if(r === 1){
				switch(this.rotation){
					case 0:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r01[i][0],db.r01[i][1],(this.rotation)+r)){
								this.x += db.r01[i][0];
								this.y += db.r01[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 1:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r12[i][0],db.r12[i][1],(this.rotation)+r)){
								this.x += db.r12[i][0];
								this.y += db.r12[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 2:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r23[i][0],db.r23[i][1],(this.rotation)+r)){
								this.x += db.r23[i][0];
								this.y += db.r23[i][1];
								this.rotation++;
								return true;
							}
						}
						return false;
					case 3:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r30[i][0],db.r30[i][1],0)){
								this.x += db.r30[i][0];
								this.y += db.r30[i][1];
								this.rotation = 0;
								return true;
							}
						}
						return false;
				}
			}else{
				switch(this.rotation){
					case 0:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r03[i][0],db.r03[i][1],3)){
								this.x += db.r03[i][0];
								this.y += db.r03[i][1];
								this.rotation = 3;
								return true;
							}
						}
						return false;
					case 1:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r10[i][0],db.r10[i][1],(this.rotation)+r)){
								this.x += db.r10[i][0];
								this.y += db.r10[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
					case 2:
						for(let i = 0; i < 7; i++){
							if(this.check(db.r21[i][0],db.r21[i][1],(this.rotation)+r)){
								this.x += db.r21[i][0];
								this.y += db.r21[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
					case 3:
						for(let i = 0; i < 7; i--){
							if(this.check(db.r32[i][0],db.r32[i][1],(this.rotation)+r)){
								this.x += db.r32[i][0];
								this.y += db.r32[i][1];
								this.rotation--;
								return true;
							}
						}
						return false;
				}
			}
		}		
	}

	

	check(x,y,r){
		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				if(this.map[r][i][j] === 1){
					if((this.x)+x+i < 0 || (this.x)+x+i > (cols-1) || (this.y)+y+j > (rows-1))
						return false;
					if(list[(this.x)+x+i][(this.y)+y+j].state === 1)
						return false;
				}
			}
		}
		return true;
	}

	setMap(){
		switch(this.tetr){
			case 0:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 4; j++){
						for(let k = 0; k < 4; k++){
							this.map[i][j][k] = db.b0[i].map[k][j];
						}
					}
				}
				break;
			case 1:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 3; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b1[i].map[k][j];
						}
					}
				}
				break;
			case 2:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 3; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b2[i].map[k][j];
						}
					}
				}
				break;
			case 3:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 4; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b3[i].map[k][j];
						}
					}
				}
				break;
			case 4:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 3; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b4[i].map[k][j];
						}
					}
				}
				break;
			case 5:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 3; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b5[i].map[k][j];
						}
					}
				}
				break;
			case 6:
				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 3; j++){
						for(let k = 0; k < 3; k++){
							this.map[i][j][k] = db.b6[i].map[k][j];
						}
					}
				}
		}	
	}
}