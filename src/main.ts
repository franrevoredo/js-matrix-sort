

let n:number = 3;
let m:number = n;
let sq_matrix_max = n * n;
let matrix:Array<Array<number>> = [];
let matrix_rnd:Array<Array<number>> = [];
let x = 1;

let step:number = 5000;

let tries:number = 0;

let zero_pos:Array<number> = [];

let next_move:Array<number> = [];

for (let i = 0; i < n; i++) {
    if (!matrix[i])
        matrix[i] = []
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

insertHTML("tablecontainer", createTable(matrix, "La Matriz Original"));




$('#random').on('click', function () {
    //Generar vector de numeros aleatorios

    let rand = generateRandomArray(sq_matrix_max);

    //Generar la tabla aleatoria

    //console.log(rand)

    matrix_rnd = fillMatrix(n, rand);

    //Crear el html de la tabla e insertarla en el div
    insertHTML("tablecontainer_random", createTable(matrix_rnd, "La Matriz Mezclada"));

    $('#calculate').show(200);

});

$('#calculate').on('click', function () {
    zero_pos = findZero(n, matrix_rnd);

    insertHTML("zero_result", "El lugar vacío es: (" + zero_pos[0] + "," + zero_pos[1] + ")");

    $('#zero_result').show(200);
    $('#nextmove').show(200);
});


$('#nextmove').on('click', function () {
    $('#nextmove').prop('disabled', true);
    //$('#tablecontainer_random').hide(200,function() {

        while(tries < step || arraysEqual(matrix, matrix_rnd)) {
            playPuzzle()
        }

        insertHTML("tablecontainer_random", createTable(matrix_rnd, "La Matriz Resultado"));
        console.log(tries)
        //$('#tablecontainer_random').show(200);
        $('#nextmove').prop('disabled', false);
        //step = step + 5000;
    });


    //insertHTML("nextmove_result", "El lugar vacío es: (" + zero_pos[0] + "," + zero_pos[1] + ")");

    //$('#nextmove_result').show(200);



});





function playPuzzle() {
        if (!next_move) {
            next_move = getRandomPlay();
        }

        if (isPossible(next_move, zero_pos)) {
            matrix_rnd = makeThePlay(zero_pos, next_move, matrix_rnd);
            tries++;
            console.log(tries);
            //insertHTML("tablecontainer_random", createTable(matrix_rnd, "La Matriz Mezclada"));

        } else {

            next_move = null;
        }
}

function makeThePlay(initial_pos:Array, final_pos:Array, matrix:Array) {
    let initial_val = matrix[initial_pos[0]][initial_pos[1]];
    let final_val = matrix[final_pos[0]][final_pos[1]];

    matrix[initial_pos[0]][initial_pos[1]] = final_val;
    matrix[final_pos[0]][final_pos[1]] = initial_val;

    zero_pos = final_pos;
    return matrix;
}

function isPossible(move:Array, point:Array) {
    let move_sum = move[0] + move[1];
    let point_sum = point[0] + point [1];
    if(getDistance(move_sum, point_sum) === 1) {
        return true;
    } else {
        return false;
    }
}

function getRandomPlay() {
    let randomPlay:Array = [];
    randomPlay[0] = getRandom(n-1);
    randomPlay[1] = getRandom(n-1);
    return randomPlay;
}

//Calcular los movimientos válidos desde la posicion indicada en la matriz
function possibleMoves(zero, aux_matrix) {
    let pos_sum = zero[0] + zero[1];
    let positionMatrix = getPositionMatrix();
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
            matrix_rnd[i][j] = pos_matrix[i][j] = i + j;
            x++;
        }
    }
    console.table(pos_matrix);
    return pos_matrix;
}

function fillMatrix(order, data_vector) {
    let x = 0;

    let matrix = [];

    for (let i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = []
        for (let j = 0; j < order; j++) {
            matrix[i][j] = data_vector[x];
            x++;
        }
    }
    return matrix;
}

function findZero(order, matrix) {

    let result = [];

    for (let i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = []
        for (let j = 0; j < order; j++) {
            if (matrix[i][j] === 0) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
}

function generateRandomArray(rand_dim) {

    let rand = []

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

function createTable(data:Array<Array<number>>, title:string) {
    let html = '';

    html += '<h2>' + title + '</h2><table class="table matrix">';


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

function insertHTML(id, html) {
    let element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

function getDistance(x, y) {
    return Math.abs(x - y);
}

function arraysEqual(arr1:Array<any>, arr2:Array<any>) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}
