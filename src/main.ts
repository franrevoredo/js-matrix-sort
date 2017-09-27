

let n:number = 4;
let m:number = n;
let sq_matrix_max = n * n;
let max_iterations:number = sq_matrix_max * 500000;
let matrix:Array<Array<number>> = [];
let matrix_rnd:Array<Array<number>> = [];
let x = 1;

let intervalId:number;

//let step:number = 5000;

let tries:number = 0;

let zero_pos:Array<number> = [];

let next_move:Array<number> = [];

for (let i = 0; i < n; i++) {
    if (!matrix[i])
        matrix[i] = [];
    for (let j = 0; j < m; j++) {
        if (i === (n - 1) && j === (m - 1)) {
            matrix[i][j] = 0;
        } else {
            matrix[i][j] = x;
        }
        //console.log("La posicion (" + i + "," + j + ") tiene el valor: " + matrix[i][j]);
        x++;
    }
}

insertHTML("tablecontainer", createTable(matrix, "La Matriz Original", "original"));




$('#random').on('click', function () {
    //Generar vector de numeros aleatorios

    let rand = generateRandomArray(sq_matrix_max);

    //Generar la tabla aleatoria

    //console.log(rand)

    matrix_rnd = fillMatrix(n, rand);

    //Crear el html de la tabla e insertarla en el div
    insertHTML("tablecontainer_random", createTable(matrix_rnd, "La Matriz Mezclada", "mezclada"));

    $('#calculate').show(200);
    goToBottom();
});

$('#calculate').on('click', function () {
    zero_pos = findZero(n, matrix_rnd);

    insertHTML("zero_result", "El lugar vacío es: (" + zero_pos[0] + "," + zero_pos[1] + ")");

    $('#zero_result').show(200);
    $('#nextmove').show(200);
    $('#stopplay').show(200);
    //getPositionMatrix();
    goToBottom();
});


$('#nextmove').on('click', function () {
    let nxtmv_button = $('#nextmove');
    nxtmv_button.prop('disabled', true);
    $('.loader').show(200, function () {
        let t0 = performance.now();
        while (checkVictory() === false && tries <= max_iterations) {
            playPuzzle();
        }
        let t1 = performance.now();

        $('.loader').hide(1000, function () {

            insertHTML("tablecontainer_random", createTable(matrix_rnd, "La Matriz Resultado", "mezclada"));

            if(tries >= max_iterations) {
                alert("SE LLEGO AL NUMERO MÁXIMO DE ITERACIONES(" + max_iterations + ") Y NO SE PUDO RESOLVER EL PUZZLE");
            } else {
                alert("RESUELTO EL PUZZLE, EN " + (t1 - t0) / 1000 + " SEGUNDOS y " + tries + " INTENTOS!");
            }
            tries = 0;
            nxtmv_button.prop('disabled', false);
        });
    });
});

$('#stopplay').on('click', function () {
    window.clearInterval(intervalId);
});

function checkVictory() {
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if(matrix_rnd[i][j] !== matrix[i][j])
                return false;
        }
    }
    return true;
}

function loaderShow() {
    $('.loader').show();
}

function loaderHide() {
    $('.loader').hide(700);
}

function matrixShow() {
    return $('.original').show();
}

function matrixHide() {
    $('.original').hide();
}

function goToBottom() {
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

function playPuzzle() {

    if(tries > 0 && tries % 25000 === 0)
        console.log(tries);

    if (!next_move) {
        next_move = getRandomPlay();
        //console.log("Next Move: " + next_move[0] + "," + next_move[1]);
    }

    if (isPossible(next_move, zero_pos)) {
        matrix_rnd = makeThePlay(zero_pos, next_move, matrix_rnd);
        tries++;
        //console.log(tries);
        next_move = null;

    } else {

        next_move = null;
    }

}

function makeThePlay(initial_pos:Array<number>, final_pos:Array<number>, matrix:Array<Array<number>>) {
    let initial_val = matrix[initial_pos[0]][initial_pos[1]];
    let final_val = matrix[final_pos[0]][final_pos[1]];

    matrix[initial_pos[0]][initial_pos[1]] = final_val;
    matrix[final_pos[0]][final_pos[1]] = initial_val;
    //console.log("ZERO: " + zero_pos[0] + "," + zero_pos[1]);
    zero_pos = final_pos;
    //console.log("FINAL: " + final_pos[0] + "," + final_pos[1]);

    return matrix;
}

/*
Para saber si una jugada es posible hay que verificar
primero que la distancia al bloque sea 1, es decir que sea contigua.
Luego se debe chequear que que el movimiento se encuentre en la misma fila
o columna de la posicion actual.
Por ultimo se chequea que el proximo movimiento no sea igual al anterior, para
no desperdiciar jugadas.
 */
function isPossible(move:Array<number>, base_point:Array<number>) {
    //console.log("Next Move: " + move[0] + "," + move[1]);
    //console.log("");

    let move_sum = move[0] + move[1];
    let point_sum = base_point[0] + base_point [1];
    if(getDistance(move_sum, point_sum) === 1) {
        //console.log("Distancia OK");
        if(isCongruentColumnOrRow(move, base_point)) {
            //console.log("Misma Fila/Columna OK");
                return true;
        } else {
            //console.log("Misma Fila/Columna FAIL");
        }
    } else {
       //console.log("Distancia FAIL");
    }
    //console.log("--");
    //console.log("");
    //console.log("");
    return false;
}


function isCongruentColumnOrRow(move:Array<number>, base_point:Array<number>) {
    return (move[0] === base_point[0] || move[1] === base_point[1]);
}

function getRandomPlay() {
    let randomPlay:Array<number> = [];
    randomPlay[0] = getRandom(n);
    randomPlay[1] = getRandom(n);
    return randomPlay;
}

//Calcular el array de posiciones para la matriz, es decir
//un arreglo en que cada posicion
function getPositionMatrix() {

    let pos_matrix = [];
    for(let i = 0; i < n; i++) { //incializar la matriz auxiliar de posicion con ceros
        pos_matrix[i] = new Array(n);
    }

    let x = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            pos_matrix[i][j] = i + j;
            x++;
        }
    }
    console.table(pos_matrix);
    return pos_matrix;
}

function fillMatrix(order:number, data_vector:Array<number>) {
    let x = 0;

    let matrix:Array<Array<number>> = [];

    for (let i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = [];
        for (let j = 0; j < order; j++) {
            matrix[i][j] = data_vector[x];
            x++;
        }
    }
    return matrix;
}

function findZero(order:number, matrix:Array<Array<number>>) {

    let result = [];

    for (let i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = [];
        for (let j = 0; j < order; j++) {
            if (matrix[i][j] === 0) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
}

function generateRandomArray(rand_dim:number) {

    let rand = [];

    let aux_rand;

    x = 0;

    for (let i = 0; i < rand_dim; i++) {
        //console.log(x++);
        aux_rand = getRandom(rand_dim);
        if (rand.indexOf(aux_rand) == -1) {
            rand[i] = aux_rand;
        } else {
            i--;
        }
    }
    return rand;
}

function getRandom(max:number) {
    return Math.floor((Math.random() * max));
}

function createTable(data:Array<Array<number>>, title:string, id:string) {
    let html = '';

    html += '<h2>' + title + '</h2><table class="table matrix" id="'+ id +'">';


    for (let row in data) {
        let rowData:Array<number> = data[row];

            html += '<tr>';

        for (let col in rowData) {
            let colData = rowData[col];

            html += '<td>';
            html += colData;
            html += '</td>';
        }

        html += '</tr>';
    }

    html += '</table>';

    return html;
}

function insertHTML(id:string, html:string) {
    let element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

function getDistance(x:number, y:number) {
    return Math.abs(x - y);
}
