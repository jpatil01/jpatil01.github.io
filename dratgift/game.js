// let minionString = `0000000000000000000000
// 0000000011111110000000
// 0000000111111111000000
// 0000001122212221100000
// 0000001277727772100000
// 0000003274727572300000
// 0000001277727772100000
// 0000001122212221100000
// 0000001111111111100000
// 0005001513111311100000
// 0000555111333111600000
// 0000555611111116110000
// 0000555666666666110000
// 0000011366666666130000
// 0000555666666666600000
// 0000505666666666000000
// 0000000003000300000000
// 0000000000000000000000`
let minionString = `000
010
000`
//^^^ fuckin idiot moment, make node js program that just reads the minion pixel art as pixels and then it converts to string what a fuckin moron
//^^^^ update: got it dumbass i did it it in python its right here https://replit.com/@xllama/minion-string#main.py
let minion = minionString.split("\n")
for(let i = 0; i < minion.length; i++) {
    minion[i] = minion[i].split("")
}
console.log(minion)
//let colorPalette = {'(255, 216, 0)': 1, '(128, 128, 128)': 2, '(0, 0, 0)': 3, '(127, 106, 0)': 4, '(127, 51, 0)': 5, '(0, 38, 255)': 6}
let colorPalette = {1: "rgb(255, 216, 0)", 2: "rgb(128, 128, 128)", 3: "rgb(0, 0, 0)", 4: "rgb(127, 106, 0)", 5: "rgb(127, 51, 0)", 6: "rgb(0, 38, 255)", 7: "rgb(254, 254, 254)"}
let bombAmount = 0
for(let i = 0; i < minion.length; i++) {
    for(let j = 0; j < minion[i].length; j++) {
        minion[i][j] = parseInt(minion[i][j])
        if(minion[i][j] != 0) {
            bombAmount++
        }
    }
}

let canvas = document.querySelector("canvas");

const TILESIZE = 30;
canvas.height = minion.length*TILESIZE;
canvas.width = minion[0].length*TILESIZE;

let g = canvas.getContext("2d");

let flagsNum = bombAmount
document.getElementById("flagsNum").innerHTML = `${flagsNum} Flags`

let lost = false
let win = false

let shiftHeld = false;

let cursorPos = {
    x: 0,
    y: 0
}

let seconds = 0

setInterval(changeTimer = () => {
    if(win == false && lost == false) {
        seconds++
    }
    let minutes = Math.floor(seconds/60)
    let secondsAfterMinutes = ""+seconds%60
    if(secondsAfterMinutes.length == 1) {
        secondsAfterMinutes = "0"+secondsAfterMinutes
    }
    document.getElementById("time").innerHTML = ""+`${minutes}:${secondsAfterMinutes}`
}, 1000)




function restart() {
    if(win) {
        window.location.replace("file:///C:/Users/bobth/Desktop/workspace/js/dratgift/numberonefan.html") //REPLACE WHEN GET DOMAIN
    } else {
        lost = false
        win = false
        seconds = 0
        flagsNum = bombAmount
        document.getElementById("flagsNum").innerHTML = `${flagsNum} Flags`
        grid = new Grid()
    }
}


class Tile {

    constructor(x, y) {
        this.pos = {x: x, y: y}
        this.w = TILESIZE
        this.h = TILESIZE
        this.type = 0
        this.color = ""
        this.covered = true
        this.flagged = false
    }

    checkCollision(x, y) {
        return (x > this.pos.x && x < this.pos.x+this.w && y > this.pos.y && y < this.pos.y+this.h)
    }

    draw() {
        if(this.covered) {
            g.fillStyle = "#999"
        } else {
            g.fillStyle = "#eee"
        }
        g.fillRect(this.pos.x, this.pos.y, this.w, this.h)
        if(!this.covered) {
            if(this.type == -1) { //draw bomb
                g.fillStyle = this.color
                g.fillRect(this.pos.x, this.pos.y, this.w, this.h)
                g.beginPath();
                g.arc(this.pos.x+this.w/2, this.pos.y+this.h/2, (TILESIZE/2)-5, 0, 2*Math.PI, false);
                g.fill();
            } else if(this.type > 0) { //draw number on uncovered tile
                g.fillStyle = "#333"
                g.font = "bold 20px courier new"
                g.fillText(""+this.type, this.pos.x-5+this.w/2, this.pos.y+6+this.h/2)
            }
        } else {
            if(this.flagged) {
                g.fillStyle = "yellow"
                g.fillRect(this.pos.x+10, this.pos.y+10, this.w-20, this.h-20)
            }
        }
        g.strokeStyle = "white"
        g.strokeRect(this.pos.x, this.pos.y, this.w, this.h)
    }

}




class Grid {
    
    constructor() {
        this.pos = {x: 0, y: 0}
        this.tiles = []
        for(let i = 0; i < canvas.height/TILESIZE; i++) {
            this.tiles.push([])
            for(let j = 0; j < canvas.width/TILESIZE; j++) {
                this.tiles[i].push(new Tile(j*TILESIZE, i*TILESIZE))
            }
        }
        console.log(this.tiles)

        //generate bombs
        // for(let i = 0; i < bombAmount; i++) {
        //     let coord = {r: Math.floor(Math.random()*this.tiles.length), c: Math.floor(Math.random()*this.tiles[0].length)}
        //     while(this.tiles[coord.r][coord.c].type == -1) {
        //         coord = {r: Math.floor(Math.random()*this.tiles.length), c: Math.floor(Math.random()*this.tiles[0].length)}
        //     }
        //     this.tiles[coord.r][coord.c].type = -1
        // }
        for(let i = 0; i < minion.length; i++) {
            for(let j = 0; j < minion[i].length; j++) {
                if(minion[i][j] == 0) {
                    this.tiles[i][j].type = 0
                } else {
                    this.tiles[i][j].type = -1
                    this.tiles[i][j].color = colorPalette[minion[i][j]]
                }
            }
        }
        console.log(this.tiles)

        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                if(this.tiles[i][j].type == 0) {
                    let adjacentTiles = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
                    for(let coords of adjacentTiles) {
                        try {
                            if(this.tiles[i+coords[0]][j+coords[1]].type == -1) {
                                this.tiles[i][j].type++;
                            }
                        } catch (error) {   
                            
                        }
                    }
                }
            }
        }
    }

    draw() {
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].draw()
            }
        }
    }

    flood(row, col) {
        let adjacentTiles = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        for(let coords of adjacentTiles) {
            try {
                if(this.tiles[col+coords[0]][row+coords[1]].covered == true && this.tiles[col+coords[0]][row+coords[1]].flagged == false) {
                    if(this.tiles[col+coords[0]][row+coords[1]].type == 0) {
                        this.tiles[col+coords[0]][row+coords[1]].covered = false
                        setTimeout(f => {this.flood(row+coords[1], col+coords[0])}, 30);
                    } else if(this.tiles[col+coords[0]][row+coords[1]].type > 0) {
                        this.tiles[col+coords[0]][row+coords[1]].covered = false
                    }
                }
            } catch (error) {   
                
            }
        }
    }

    uncoverAll() {
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].covered = false;
            }
        }
    }

    countLeft() {
        let num = 0
        for(let i = 0; i < this.tiles.length; i++) {
            for(let j = 0; j < this.tiles[i].length; j++) {
                if(this.tiles[i][j].covered) {
                    num++
                }
            }
        }
        return num
    }

}



let grid = new Grid()

window.addEventListener('mousedown', mouseDownHandler, false);
window.addEventListener("mousemove", mouseMoveHandler, false);
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
function mouseDownHandler(e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    if(lost == false && win == false) {
        for(let i = 0; i < grid.tiles.length; i++) {
            for(let j = 0; j < grid.tiles[i].length; j++) {
                if(grid.tiles[i][j].checkCollision(mouseX, mouseY)) {
                    let tile = grid.tiles[i][j]
                    if(!shiftHeld) {
                        if(tile.flagged == false) {
                            tile.covered = false
                            if(tile.type == -1) {
                                lost = true;
                                //grid.uncoverAll()
                            } else if(tile.type == 0) {
                                grid.flood(j, i)
                            }
                        }
                    } else {
                        if(tile.covered) {
                            if(tile.flagged) {
                                tile.flagged = false
                                flagsNum++
                            } else if(!tile.flagged && flagsNum > 0) {
                                tile.flagged = true
                                flagsNum--
                            }
                            document.getElementById("flagsNum").innerHTML = `${flagsNum} Flags`
                        }
                        
                    }
                }
            }
        }
        if(grid.countLeft() == bombAmount) {
            win = true;
            document.getElementById("restartButton").innerHTML = "Continue"
            grid.uncoverAll()
        }
    }
}

function keyDownHandler(e) {
    let code = event.keyCode
    if(code == 16) {
        shiftHeld = true
    }
}
function keyUpHandler(e) {
    let code = event.keyCode
    if(code == 16) {
        shiftHeld = false
    }
}
function mouseMoveHandler(e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    cursorPos = {x: mouseX, y: mouseY}
}



function animate() {
    requestAnimationFrame(animate)
    g.clearRect(0, 0, canvas.width, canvas.height)

    grid.draw();

    if(shiftHeld) {
        g.fillStyle = "yellow"
        g.fillRect(cursorPos.x+10, cursorPos.y+10, 20, 20)
    }

    if(lost) {
        g.globalAlpha = 0.4
        g.fillStyle = "black"
        g.fillRect(0, 0, canvas.width, canvas.height)
        g.globalAlpha = 1.0
        g.fillStyle = "white"
        g.font = " 80px arial"
        g.fillText("You Lose", canvas.width/2-160, canvas.height/2)
    }else if(win) {
        g.globalAlpha = 0.4
        g.fillStyle = "black"
        g.fillRect(0, 0, canvas.width, canvas.height)
        g.globalAlpha = 1.0
        g.fillStyle = "white"
        g.font = " 80px arial"
        g.fillText("You Win", canvas.width/2-160, canvas.height/2)
    }
}

animate()