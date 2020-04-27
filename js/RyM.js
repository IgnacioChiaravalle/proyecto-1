const imageQuantity = 57;

var activeDD; //Active Drop-Down-Menu Item (i.e., the difficulty).
var gameGrid;
var matrixOfImageRoutes;

function setDefaultActiveDD(defaultDD) {
	activeDD = document.getElementById(defaultDD);
}

function setActiveDD(selectionDD) {
	activeDD.classList.remove("active");
	selectionDD.classList.add("active");
	activeDD = selectionDD;
}

function setBackground(bgURL) {
	document.body.style.backgroundImage = "url('" + bgURL + "')";
}


function createGrid(sideLength, bombsNum) { //Creates the Grid in HTML Document, which works basically as a GUI for the matrixOfImageRoutes.
	defineMatrix(sideLength, bombsNum);
	gameGrid = document.getElementById('gameGrid');
	var gridBody = document.createElement('tbody');

	for (var i = 0; i < sideLength; i++) {
		var tr = document.createElement('tr');

		for (var j = 0; j < sideLength; j++) {
			var td = document.createElement('td');
			td.classList.add("covered-cell");
			td.style.width = '' + (screen.width * 0.65 / sideLength) + 'px';
			td.style.height = '' + (screen.height * 0.65 / sideLength) + 'px';
			tr.appendChild(td);
		}

		gridBody.appendChild(tr);
	}
	gameGrid.appendChild(gridBody);
	if (gameGrid.childElementCount > 1)
		gameGrid.removeChild(gameGrid.firstChild);
}

	function defineMatrix(sideLength, bombsNum) { //Creates a Matrix for handling the Grid.
		matrixOfImageRoutes = [];
		for(var i = 0; i < sideLength; i++)
			matrixOfImageRoutes[i] = new Array(sideLength);

		var imageNames = new Array(imageQuantity); //Array that contains an Integer for every possible hidden image.
		for (var i = 0; i < 57; i++)
			imageNames[i] = i;
		imageNames.sort(() => Math.random() - 0.5);
		imageNames = imageNames.slice(0, (sideLength * sideLength - bombsNum)/ 2); //The array has been randomly shuffled and turned into a subset of itself that contains only the amount of image names needed.

		for (var i = 0; i < bombsNum; i++) { //First cells of matrix are filled with bombs.
			matrixOfImageRoutes[0][i] = "Neutrino Bomb.png";
		}
		var pos = 0;
		for (var i = 0; i < sideLength; i++) { //The rest matrix is filled with two copies of every image selected after slicing the array.
			for (var j = 0; j < sideLength; j++) {
				if (i == 0 && j < bombsNum) j = bombsNum - 1;
				else {
					matrixOfImageRoutes[i][j] = "Image " + imageNames[pos] + ".png";
					if ((i%2==0 && j%2==0) || (i%2==1 && j%2==1)) pos++; //pos is modified on these two conditions because bombsNum and sideLength are odd numbers and that determines when pos should be updated.
				}
			}
		}

		var string = "";
		for (var i = 0; i < sideLength; i++) {
			for (var j = 0; j < sideLength; j++) {
				if (j == 0) string += "[ ";
				string += matrixOfImageRoutes[i][j] + ", ";
				if (j == sideLength - 1) string += " ]\n";
			}
		}
		console.log(string);

		for (var i = 0; i < sideLength; i++) { //The matrix is randomly shuffled.
			for (var j = 0; j < sideLength; j++) {
				var i1 = Math.floor(Math.random() * sideLength);
				var j1 = Math.floor(Math.random() * sideLength);
				var temp = matrixOfImageRoutes[i][j];
				matrixOfImageRoutes[i][j] = matrixOfImageRoutes[i1][j1];
				matrixOfImageRoutes[i1][j1] = temp;
			}
		}
		var string = "";
		for (var i = 0; i < sideLength; i++) {
			for (var j = 0; j < sideLength; j++) {
				if (j == 0) string += "[ ";
				string += matrixOfImageRoutes[i][j] + ", ";
				if (j == sideLength - 1) string += " ]\n";
			}
		}
		console.log(string);

		/*PARA CADA CELDA DE LA MATRIZ SELECCIONAR UN ELEMENTO DE LA CARPETA "Hidden Images".
		* Se me ocurre hacer un arreglo con tantos nombres de imágenes como sean necesarios [(sideLength^2 - bombsNum) / 2],
		* y asignarle a dos celdas random cada nombre. Al resto de las celdas se le ponen bombas.
		* Para esto, los nombres tienen que ser, por ejemplo, "image 1", "image 2", etcétera.
		*
		* Preguntas:
		* - ¿Puedo tomar un subset random de estas imágenes, sin tomar ninguna repetida? En StackOverflow parece haber una forma de
		*   tomar un arreglo, hacerle shuffle, y tomar un subset del resultado. Podría tomar todas las imágenes que haya en un arreglo
		*   y hacer eso con lo obtenido.
		* - ¿Cómo hago para saber si a una celda ya le fue asignada una imágen? Guardar los i-j ya asignados en un arreglo auxiliar y
		*   y recorrerlo cada vez que avance en un for que recorra la matriz me parece una pésima solución. Lo ideal sería hacer una
		*   clase CeldaMatriz y darle por lo menos estos atributos: "hasImage" (booleano), "imageRoute" (cadena de texto con la ruta
		*   de la imagen que le corresponda), "iInMatrix" (número de fila que representa en la matriz), y "jInMatrix" (número de columna
		*   que representa en la matriz). De este modo, puedo hacer un for en la matriz y para cada celda si hasImage es falso asignar una
		*   ruta de imagen en la celda actual y en otra al azar (que tendría que ser buscada).
		* - EY!! PARÁ!!!11!1uno! ¿¿¿¿Y si lleno la matriz de dos en dos con imágenes iguales (es decir, una imagen y su compañera) juntas y
		*   después hago shuffle en la matriz????
		*
		* Solución genial para tomar un subset de las imágenes:
		* Hacer un arreglo con tantos enteros como imágenes haya. Shufflearlo. Tomar un subset del tamaño necesario (la cantidad de imágenes
		* que se necesite poner). Buscar las imágenes cuyos nombres tengan esos números ("image 1", "image 88", "image 66", etcétera).
		* ¿Qué resuelve? Tengo el subset de imágenes que quería, y varía en cada ejecución.
		* ¿Por qué no hacer un for, obtener un número al azar y buscar la imágen con ese número en cada iteración? Porque podría obtener
		* imágenes repetidas. Hacer el arreglo me garantiza que los números no se repitan.
		* ¿Por qué no hacer un arreglo con las imágenes, subsetearlo y listo, en vez de usar un arreglo de números, subsetearlo y después
		* buscar las imágenes? Porque demanda mucho tiempo. Tengo que buscar cada imágen para usar sólo algunas. Por ejemplo, si estoy en la
		* dificultad más fácil tomo sólo 12 de las 57 (o algo así) imágenes. Un arreglo de enteros es mucho más rápido a nivel de ejecución,
		* y va a funcionar igual de bien. 
		*/

	}

/* DE ACÁ EN ADELANTE TENGO CÓDIGO DE UNA PRUEBA QUE ESTUVE HACIENDO QUE TAL VEZ ME SIRVA MÁS ADELANTE EN EL DESARROLLO, PERO ES EN PRINCIPIO INÚTIL.

var contenidos = new Array();
contenidos[0] = "3ntr3t3n1m13nt0";
contenidos[1] = "QUARANTINE ALERT";
contenidos[2] = "Asereje";

function fontChange() {
	elemento = document.getElementById("qsy");
	elemento.style.fontFamily = "Verdana";
	elemento.innerHTML = "Hello, World!!";
}
function undo() {
	elemento = document.getElementById("qsy");
	elemento.style.fontFamily = "Arial";
	elemento.innerHTML = "Hola, Mundo!!";
}

function noEstoy() {
	document.getElementById("imagenAguila").style.visibility = "hidden";
}
function akita() {
	document.getElementById("imagenAguila").style.visibility = "visible";
}

function funcionTabla(elemento) {
	random = Math.floor(Math.random() * 3);
	palabra = contenidos[random];
	elemento.innerHTML = palabra;
}*/
