const board = document.querySelector(".board");
let isDebug = true;
// board width:  1000px &&
// board height: 1000px to work with
// clientWidth: board width: 1000
// clientHeight: board height: 1000


const BOARD_HEIGHT = 60 // number of cells
const BOARD_WIDTH = 60 // number of cells
let CELL_HEIGHT = board.clientHeight / BOARD_HEIGHT
let CELL_WIDTH = board.clientWidth / BOARD_WIDTH
// n: total number of cells

let n = BOARD_HEIGHT * BOARD_WIDTH

for(let i = 0;i < n;i++) {
    // c: cell element
    let c = document.createElement("div")
    c.classList.add("cell")
    board.append(c)
}

board.style["grid-template-columns"] = `repeat(${BOARD_WIDTH}, ${CELL_WIDTH}px)`
board.style["grid-template-rows"] = `repeat(${BOARD_HEIGHT}, ${CELL_HEIGHT}px)`



board.children[Math.floor(Math.random()*board.children.length)].classList.add("START");
board.children[Math.floor(Math.random()*board.children.length)].classList.add("END");

[...document.querySelectorAll(".cell")].forEach(cell => {
    cell.style.border = "none"
    let dot = document.createElement("div");
    dot.classList.add("dot");
    cell.append(dot)
})

function setEventListener() {   

    for(const cell of cells) {
        cell.draggable = true;
        if(cell === start || cell === end) continue;
        cell.ondrag =  _ => {
            _.preventDefault();
            for(const _cell of cells) {
                _cell.ondragover = ({ target }) => {
                    if(target.classList.contains("obstacle")) {
                        target.classList.remove("obstacle")
                    } else {
                        target.classList.add("obstacle");
                    }
                    _cell.ondragover = null;
                }
            }
            cell.ondrag = null;
        }

        cell.onclick = ({ target }) => {
            if(target.classList.contains("obstacle")) {
                target.classList.remove("obstacle")
            } else {
                target.classList.add("obstacle")
            }
        }
        cell.ondragend = _ => clearCellsEvent(false);
    }

    start.addEventListener("dragstart", (e) => {
        clearCellsEvent(false);
        cells.forEach(cell => {
            if(cell.classList.contains("END") || cell.classList.contains("obstacle")) return;
            cell.ondragover = (evt) => {
                const {target} = evt;
                evt.preventDefault();
                // s for start the lime cell
                let s = document.querySelector(".START");
                s.classList.remove("START");
                target.classList.add("START");
                start.draggable = false;
                start = target;
                start.draggable = true;
            };
        });
    });
    
    end.addEventListener("dragstart", _ => {
        clearCellsEvent(false);
        cells.forEach(cell => {
            if(cell.classList.contains("START") || cell.classList.contains("obstacle")) return;
            cell.ondragover = (evt) => {
                const {target} = evt;
                evt.preventDefault();
                // e for end the red cell
                let e = document.querySelector(".END");
                e.classList.remove("END");
                target.classList.add("END");
                end.draggable = false;
                end = target;
                end.draggable = true;
            };
        });
    });

    
    start.addEventListener("dragend", clearCellsEvent);
    end.addEventListener("dragend", clearCellsEvent);
}


function clearCellsEvent(startAgain=true) {
    cells.forEach(c => {
        c.ondragover = null;
        c.ondrag = null;
    });
    // if(startAgain) startSearch();
    setEventListener();
}


function debug() {
    isDebug = !isDebug;
    if(isDebug) {
        [...document.querySelectorAll(".cell")].forEach(cell => {
            cell.style.border = "none"
            // let dot = document.createElement("div");
            // dot.classList.add("dot");
            // cell.append(dot)
            cell.childNodes[0].style.visibility = "visible"
        })
        return;
    }


    [...document.querySelectorAll(".cell")].forEach(cell => {
        cell.style.border = "1px solid black"
        cell.childNodes[0].style.visibility = "hidden"
    })
}
