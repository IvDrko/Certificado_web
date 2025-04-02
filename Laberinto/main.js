const filas = 10;
const columnas = 10;

const laberinto = [ 
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
];

let jugadorPos = {x : 1, y: 1};
let objetivoJugador = {x:9, y: 9};

const tablero = document.getElementById('tablero');

let celdas= [];

function crearTablero(){
    for(let i = 0; i < filas; i++){
        for(let j=0; j<columnas; j++){
            const celda = document.createElement('div');
            celda.classList.add('celda');

            if(laberinto[i][j] === 1){
                celda.classList.add('muro');
            }

            if(i === objetivoJugador.x && j === objetivoJugador.y){
                celda.classList.add('meta');
            }

            if(j === jugadorPos.x && i === jugadorPos.y){
                celda.classList.add('jugador');
            }
            celdas.push(celda);
            tablero.appendChild(celda);
        }
    }
}

function moverJugador(e){
    let newX = jugadorPos.x;
    let newY = jugadorPos.y;

    if(e.key === 'ArrowUp') newY--;
    if(e.key === 'ArrowDown') newY++;
    if(e.key === 'ArrowLeft') newX--;
    if(e.key === 'ArrowRight') newX++;

    if(newX >=0 && newX < filas && newY >=0 && newY < columnas && laberinto[newY][newX] === 0){
        console.log('Entra');
        celdas[jugadorPos.y * columnas + jugadorPos.x].classList.remove('jugador');
        jugadorPos.x = newX;
        jugadorPos.y = newY;
        celdas[jugadorPos.y * columnas + jugadorPos.x].classList.add('jugador');
    }

    if(jugadorPos.x === objetivoJugador.x && jugadorPos.y === objetivoJugador.y){
        alert('Has ganado');
    }

}

document.addEventListener('keydown', moverJugador);

crearTablero();

