class Cell {
    constructor(element) {
        this.x = getPos(element)[0];
        this.y = getPos(element)[1];
        this.element = element;
        this.g = undefined
        this.h = dist(this.element, document.querySelector(".START"))
        this.f;
        this.previous = null;
    }

    isConnectedTo(node) {
        return this.neighboors().contains(node);
    }

    neighboors() {
        // try {
        //     const neighboorsList = [];
        //     for(let y = this.y - 1;y <= this.y + 1;y++) {
        //         for(let x = this.x - 1;x <= this.x + 1;x++){
        //             if(y < 0 || x < 0 || (y === this.y && x === this.x)) continue;
        //             if(x > BOARD_WIDTH || y > BOARD_HEIGHT) continue;
        //             if(!cellsTable[y][x]) continue;
        //             if(cellsTable[y][x].classList.contains("obstacle")) continue;
        //             if(cellsTable[y][x].classList.contains("usedCell")) continue;
        //             // if(cellsTable[y][x].classList.contains("searchCell")) continue
        //             neighboorsList.push(cellsTable[y][x]);
        //         }
        //     }
        //     return neighboorsList
        // } catch(error) {
        //     // console.error(error);
        //     return [];
        // }
        let n = []
        let x = this.x;
        let y = this.y
        if(y > 0 && !cellsTable[y-1][x].classList.contains("obstacle")) {
            n.push(cellsTable[y-1][x])
        }
        if(x > 0 && !cellsTable[y][x-1].classList.contains("obstacle")) {
            n.push(cellsTable[y][x-1])
        }
        if(x < BOARD_WIDTH-1 && !cellsTable[y][x+1].classList.contains("obstacle")) {
            n.push(cellsTable[y][x+1])
        }
        if(y < BOARD_HEIGHT-1 && !cellsTable[y+1][x].classList.contains("obstacle")) {
            try {
                n.push(cellsTable[y+1][x])
            } catch(e) {
                console.log(y);
            }
        }
        return n
        // if(this.y < 0) return [
        //     cellsTable[this.y - 1][this.x],
        //     cellsTable[this.y][this.x - 1],
        //     cellsTable[this.y + 1][this.x],
        // ];
        // if(this.x > 0 && this.x < BOARD_WIDTH && this.y > 0 && this.y < BOARD_WIDTH) return [
        //     cellsTable[this.y - 1][this.x], 
        //     cellsTable[this.y][this.x - 1],
        //     cellsTable[this.y][this.x + 1],
        //     cellsTable[this.y + 1][this.x]
        // ]
    }

}