

var n = 3;
var m = n;
var sq_matrix_max = n * n;
var matrix = [];
var matrix_rnd = [];

var max = n * m;

var x = 1;

var zero_pos = [];

var next_move = [];

for (var i = 0; i < n; i++) {
    if (!matrix[i])
        matrix[i] = []
    for (var j = 0; j < m; j++) {
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

    var rand = generateRandomArray(sq_matrix_max);

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
    //next_move = findZero(n, matrix_rnd);

    possibleMoves(zero_pos, matrix_rnd)
    insertHTML("nextmove_result", "El lugar vacío es: (" + zero_pos[0] + "," + zero_pos[1] + ")");

    $('#nextmove_result').show(200);
});


//Calcular los movimientos válidos desde la posicion indicada en la matriz
function possibleMoves(zero, aux_matrix) {
    var pos_sum = zero[0] + zero[1];
    var positionMatrix = getPositionMatrix();
}

//Calcular el array de posiciones para la matriz, es decir
//un arreglo en que cada posicion
function getPositionMatrix() {

    var pos_matrix = [];
    for(i = 0; i < n; i++) { //incializar la matriz auxiliar de posicion con ceros
        pos_matrix[i] = new Array(n);
    }

    var x = 0;
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            matrix_rnd[i][j] = pos_matrix[i][j] = i + j;
            x++;
        }
    }

    console.table(pos_matrix);
}

function fillMatrix(order, data_vector) {
    var x = 0;

    var matrix = [];

    for (i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = []
        for (j = 0; j < order; j++) {
            matrix[i][j] = data_vector[x];
            x++;
        }
    }
    return matrix;
}

function findZero(order, matrix) {

    var result = [];

    for (i = 0; i < order; i++) {
        if (!matrix[i])
            matrix[i] = []
        for (j = 0; j < order; j++) {
            if (matrix[i][j] === 0) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
}

function generateRandomArray(rand_dim) {

    var rand = []

    var aux_rand;

    x = 0;

    for (i = 0; i < rand_dim; i++) {
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

function getRandom(max) {
    return Math.floor((Math.random() * max));
}

function createTable(data, title) {
    var html = '';

    html += '<h2>' + title + '</h2><table class="table matrix">';


    for (var row in data) {
        var rowData = data[row];

            html += '<tr>';

        for (var col in rowData) {
            var colData = rowData[col];

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
    var element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

function getDistance(x, y) {
    return Math.abs(x - y);
}