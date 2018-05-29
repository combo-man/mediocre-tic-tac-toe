function tic() {
    var SIZE = 3;

    var previous;

    var board = [
        [],[],[]
    ];

    var player = 'x';
    var computer = 'o';

    var emptyBoard = [
        [' ',' ',' '],
        [' ',' ',' '],
        [' ',' ',' ']
    ];
 
    function renderStart() {
        function start() {
            var tileMap = {[' ']: turn};
            var tiles = [
                [' ',' ',' '],
                [' ',' ',' '],
                [' ',' ',' ']
            ];
            setBoard(tiles)
            if(player =='o') {
                placeRandom('x');
            }
            render(tileMap)
        }

        var tileMap = {
            x: function(){computer='o';player='x';start();},
            o: function(){computer='x';player='o';start();}
        };
        var tiles = [
            ['p','i','c'],
            [' ',' ',' '],
            ['x','?','o']
        ];
        render(tileMap,tiles);
    };

    function turn(x,y) {

        placePiece(x,y,player);
        placeRandom(computer);
        var win = testWin(board);
        render({x: clickFull,y: clickFull,[' ']: turn});
        if(win) {
            return winGame(win);
        }
        if(boardFull()) {
            return tieGame();
        }
    }

    function clickFull() {
        var win = testWin(board);
        if(win) {
            return winGame(win);
        } 
        if(boardFull()) {
            return tieGame();
        }
    }

    function winGame(winner) {
        var tileMap = {
            ['-']: renderStart,
            ['>']: renderStart
        };
        var tiles;
        if(winner == player) {
            tiles = [
                ['*','U','*'],
                ['W','I','N'],
                [player,'-','>']
            ];
        } else {
            tiles = [
                ['~',';','~'],
                ['L','O','S'],
                [player,'-','>']
            ];
        }
        render(tileMap,tiles);
    }; 

    function tieGame() {
        var tileMap = {
            ['-']: renderStart,
            ['>']: renderStart
        };
        var tiles = [
            [' ','U',' '],
            ['T','I','E'],
            [' ','-','>']
        ];
        render(tileMap,tiles);
    }

    function boardFull() {
        for(let y=0;y<SIZE;y++) {
            for(let x=0;x<SIZE;x++) {
                if(board[y][x] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }

    function testWin(tiles) {
        var valMap = {
            x: -1,
            o: 1,
        };
        function getVal(x,y) {
            return valMap[tiles[y][x]] || 0;
        };
        function hasWon(n) {
            return Math.abs(n) == SIZE;
        };
        function whoWon(n) {
            return n < 0 ? 'x' : 'o';
        };
        var sumDiag = 0;
        var sumAntiDiag = 0;
        for(let i=0;i<SIZE;i++) {
            let sumRow = 0;
            let sumColumn = 0;
            sumDiag += getVal(i,i);
            sumAntiDiag += getVal((SIZE-1)-i,i);
            for(let j=0;j<SIZE;j++) {
                let valRow = getVal(i,j);
                let valColumn = getVal(j,i);
                sumRow += valRow;
                sumColumn += valColumn;
            }
            if(hasWon(sumRow)) {
                return whoWon(sumRow);
            }
            if(hasWon(sumColumn)) {
                return whoWon(sumColumn);
            }
        }
        if(hasWon(sumDiag)) {
            return whoWon(sumDiag);
        }
        if(hasWon(sumAntiDiag)) {
            return whoWon(sumAntiDiag);
        }
    };

    function setBoard(tiles) {
        for(let y=0;y<SIZE;y++) {
            for(let x=0;x<SIZE;x++) {
                board[y][x] = tiles[y][x];
            }
        }
    }

    function getAvailable() {
        var tiles = [];
        for(let y=0;y<SIZE;y++) {
            for(let x=0;x<SIZE;x++) {
                if(board[y][x] == ' ') {
                    tiles.push([x,y]);
                }
            }
        }
        return tiles;
    };

    function pickRandom () {
        var available = getAvailable();
        if(available.length == 0) {
            return false;
        } else {
            return available[Math.floor(Math.random()*available.length)];  
        }
    }

    function placePiece(x,y,v) {
        if(board[y][x] == ' ') {
            board[y][x] = v;
            return true;
        } else {
            return false; 
        }
    }

    function placeRandom(v) {
        var tile = pickRandom();
        if(tile) {
            placePiece(tile[0],tile[1],v);
        }
    }
 
    function render(map,tiles) {
        if(tiles) {
            setBoard(tiles); 
        } else {
            tiles = board;
        }
        var container = document.createElement('div');
        for(let y=0;y<SIZE;y++) {
            let row = document.createElement('div');
            for(let x=0;x<SIZE;x++) {
                let tile = document.createElement('span');
                let type = tiles[y][x];
                if(map[type]) { 
                    tile.style.cursor = 'pointer';
                    tile.onclick = function() {
                        return map[type](x,y);
                    };
                }
                tile.textContent = '(' + type + ')';
                row.appendChild(tile);
            }
            container.appendChild(row);
        }

        var maxLen = 8;
        var childNodes = document.body.children;
        document.body.insertBefore(container,document.body.childNodes[0]);
        if(childNodes.length > maxLen) {
            document.body.removeChild(childNodes[childNodes.length-1]);
        }
        for(let i=childNodes.length-1;i>=0;i--) {
            let size = i == 0 ? 4 : 2-(i/(maxLen-1) * 2);
            let align = i == 0 ? 'center' : 'center';
            let bright = (i/(maxLen-1) * 256);
            console.log(childNodes[i]);
            childNodes[i].style.fontSize = size + 'vmax';
            childNodes[i].style.textAlign = align;
            childNodes[i].style.color = 'rgb('+bright+','+bright+','+bright+')';
        }

        return container;
    };

    renderStart();
}

window.onload = function() {
    tic();
}
