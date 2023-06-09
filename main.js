// <!>
// TODO: make sure that the path don't go back towads the "start"
// by calculating the distance btween the current node and the start, and make sure that that distance
// is incrementing
// <!>

// BOARD_HEIGHT OR WIDTH: number of cells 

const cells = [...document.querySelectorAll(".cell")];
const cellsTable = cells2Darray();
const cellsClass = [...cells.map(x => new Cell(x))]
let timeBeetweenAnimationFrames = 50;
let tries = 3;
let count = 0;
let [start, end] = [document.querySelector(".START"), document.querySelector(".END")];
let [startNodeClass] = cellsClass.filter(cellClass => cellClass.element.classList.contains("START"));

// debug()


// logic for dragging elements and events
setEventListener();

function setObstacles() {
   cells.forEach(c => {
        c.classList.remove("obstacle")
        c.classList.remove("searchCell")
        c.classList.remove("path")
        c.classList.remove("validCell")
    })
    cells.forEach(c => {
        if(Math.random()*100 < 35) {
            if(c.classList.contains("START") || c.classList.contains("END")) return
            c.classList.add("obstacle")
        }
    })
}

function clearBoard() {
    cells.forEach(c => {
        c.classList.remove("obstacle")
        c.classList.remove("searchCell")
        c.classList.remove("path")
        c.classList.remove("validCell")
    })
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

// return a grid of cells, 2d array of the cells( divs )
function cells2Darray() {
    const arr = [[]];
    let count = 0;
    for(let i = 0;i < cells.length;i++) {
        if(( i + 1 ) % BOARD_WIDTH !== 0) {
            arr[count].push(cells[i]);
            continue;
        } 
        arr.push([]);
        arr[count].push(cells[i]);
        count++;
    }
    arr.pop();
    return arr;
}

function getPos(element) {
    let y = 0;
    for(let x = 0;x < cells.length;x++) {
        if(x % BOARD_WIDTH === 0 && x !== 0) y++;
        if(cells[x] !== element) continue;
        let widths = Math.floor(x / BOARD_WIDTH);
        x -= BOARD_WIDTH * widths;
        return [x, y];
    }    
    // if the element is not found
    return [0, 0];
}






function dist(a, b) {
    const [aX, aY] = getPos(a);
    const [bX, bY] = getPos(b);


    const distanceX = (aX  - bX) ** 2;
    const distanceY = (aY - bY) ** 2;
    return (
        Math.sqrt(distanceX*10 + distanceY*10)
    );
}




function removeFromArray(arr, elm) {
    for(let i = arr.length -1; i >= 0;i--) {
        if(arr[i] === elm) arr.splice(i, 1)
    }
}
function neighborsOf(elm) {
    let [c] = cellsClass.filter(x => x.element === elm)
    return c.neighboors()
}

async function AStar() {
    let closedSet = []
    let openSet = [start]

    while(openSet.length !== 0) {
        // uIndex: node index with lowest "f"
        let uIndex = 0
        for(let i = 0;i < openSet.length;i++) {
            if(openSet[i].f > openSet[uIndex].f) {
                uIndex = i
            }
        } 
        let current = openSet[uIndex]
        if(current === end) {
            // showPath: utility function that renders the path
            // n: node
            const showPath = async n => {
                if(n.previous.classList.contains("START")) 
                    return

                if(n.previous) {
                    await sleep(3)
                    n.previous.classList.remove("searchCell")
                    n.previous.classList.add("path")
                    showPath(n.previous)
                } 
            }
            showPath(current)
            break
        }

        removeFromArray(openSet, current)
        closedSet.push(current)
        current.classList.add("searchCell")
        for(const neighbor of neighborsOf(current)) {
            if(!closedSet.includes(neighbor)){
                let tempG = current.g + 1
                if(openSet.includes(neighbor)) {
                    if(tempG < neighbor.g) {
                        neighbor.g = tempG
                    }
                } else {
                    neighbor.g = tempG

                    openSet.push(neighbor)
                }
                neighbor.h = dist(neighbor, end)
                neighbor.f = neighbor.g + neighbor.h
                neighbor.previous = current
            }
            neighbor.g = current.g + 1       
        }
    }

}


// async function search(s, prevNodeToStartDistance=1) {

//     maxOpenSetLength = Math.floor((dist(start, end) - document.querySelectorAll(".obstacle").length) / 10);
//     let neighboors = s.neighboors();
//     console.log(neighboors.length === 0);
//     if(neighboors.length === 0) {
//         openSet.push([])
//         count++;
//         search(startNodeClass, prevNodeToStartDistance);
//         return 0;
//     }
//     if(openSet[count].length > maxOpenSetLength) return;
//     [endNodeClass] = cellsClass.filter(cellClass => cellClass.element.classList.contains("END"));
//     let distanceNodes = {
//         fromNodeToEnd: dist(neighboors[0], endNodeClass.element),
//         elm: neighboors[0], 
//     }

    
//     if(neighboors.length > 0 ) {
//         for(let j = 0;j < neighboors.length;j++) {
//             if(distanceNodes.fromNodeToEnd <= dist(neighboors[j], endNodeClass.element)) continue;
//             console.log(prevNodeToStartDistance < dist(neighboors[j], startNodeClass.element) && distanceNodes.fromNodeToEnd <= dist(neighboors[j], endNodeClass.element));
//             neighboors[j].classList.add("searchCell");
//             distanceNodes.fromNodeToEnd = dist(neighboors[j], endNodeClass.element);
//             prevNodeToStartDistance = dist(neighboors[j], startNodeClass.element)
//             distanceNodes.elm = neighboors[j];
//         }
//         openSet[count].push(distanceNodes);  
//         await sleep(timeBeetweenAnimationFrames*.3)
//         if(distanceNodes.elm) {
//             distanceNodes.elm.classList.remove("searchCell")
//             distanceNodes.elm.classList.add("validCell")
//             if(!startNodeClass.neighboors().includes(distanceNodes.elm)) distanceNodes.elm.classList.add("usedCell")
//             const [distanceNodesClassElement] = cellsClass.filter(cellClass => cellClass.element === distanceNodes.elm);
        
//             for(const n of distanceNodesClassElement.neighboors()) {
//                 if(n === endNodeClass.element) {
//                     count++;
//                     if(count < tries && document.querySelectorAll(".obstacle").length > 0) {
//                         openSet.push([])
//                         search(startNodeClass, prevNodeToStartDistance);
//                         return 0;
//                     }
//                     await sleep(timeBeetweenAnimationFrames);
//                     let bestPath = openSet[0];
//                    for(let i = 0;i < openSet.length;i++) {
//                         if(bestPath.length < openSet[i].length && openSet[i] !== bestPath) continue;
//                         bestPath = openSet[i];
//                     }
//                     var i = 0;
//                     var interval = setInterval(() => {
//                         if(i === bestPath.length) {
//                             clearInterval(interval);
//                             return;
//                         }
//                         try {
//                             bestPath[i].elm.classList.remove("validCell")
//                             bestPath[i].elm.classList.remove("searchCell")
//                             bestPath[i].elm.classList.add("path")
//                             i++;
//                         } catch(error) {
//                             // I have a nonesense error that doesn't harm the program
//                             // so I just ignore it
//                             return 0;
//                         }
//                     }, 100)
//                     return 1;
//                 }
//             }
//             if(openSet[count].length >= maxOpenSetLength && maxOpenSetLength) {
//                 await sleep(timeBeetweenAnimationFrames*3);
//                  count++;
//                 if(count < tries && document.querySelectorAll(".obstacle").length > 0) {
//                     openSet.push([])
//                     search(startNodeClass, prevNodeToStartDistance);
//                     return 0;
//                 }
//                 let bestPath = openSet[0];
//                 for(let i = 0;i < openSet.length;i++) {
//                     if(bestPath.length < openSet[i].length && openSet[i] !== bestPath) continue;
//                     bestPath = openSet[i];
//                 }
//                 var i = 0;
//                 var interval = setInterval(() => {
//                     if(i === bestPath.length) {
//                         clearInterval(interval);
//                         return;
//                     }
//                     try {
//                         bestPath[i].elm.classList.remove("validCell")
//                         bestPath[i].elm.classList.remove("searchCell")
//                         bestPath[i].elm.classList.add("path")
//                         i++;
//                     } catch(error) {
//                         // I have a nonesense error that doesn't harm the program
//                         // so I just ignore it
//                         return 0;
//                     }
//                 }, 100)
//                 return 1;
//             }
//             search(distanceNodesClassElement, prevNodeToStartDistance)
//         }
//     }

// }
window.addEventListener("keydown", ({ keyCode }) => (keyCode !== 13) ? "" : startSearch())

function startSearch() {
    cells.forEach(c => {
        c.classList.remove("searchCell")
        c.classList.remove("path")
        c.classList.remove("validCell")
    })
    AStar()
}

