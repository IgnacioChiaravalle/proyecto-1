const imageQuantity = 57; //Quantity of possible Hidden Images.
var matrixOfImageRoutes; //Matrix that contains the routes of the hidden images in the positions where they are on the gameGrid.
var currentlyRevealedImages; //Array that contains the grid-cells that are currently revealed, so that they can be easily concealed or made to remain the way they are.
var revealedBombs; //Array of the cells that contain bombs and have already been revealed once.
var imagesInPlay; //Number of images that will be in the game. Depends on sideLength and bombsCount.
var revealedImageCount; //Count of the images of which both copies have been revealed. Does not apply to bombs.
var bombsCount; //Current quantity of bombs in the game.
var lastImageIsBomb; //Holds boolean value of whether the last revealed image is a bomb or not.
var script = null;


function createGrid(sideLength, bombsNum) { //Creates the Grid in HTML Document, which works as a GUI for the matrixOfImageRoutes.
	setDefaultValues(sideLength, bombsNum);
	defineMatrix(sideLength);

	var gameGrid = document.getElementById('gameGrid');
	var gridBody = document.createElement('tbody');
	for (i = 0; i < sideLength; i++) {
		var tr = document.createElement('tr');
		for (var j = 0; j < sideLength; j++) {
			var td = document.createElement('td');
			td.classList.add("covered-cell");
			td.id = i + " " + j;
			td.style.width = '' + (screen.width * 0.65 / sideLength) + 'px';
			td.style.height = '' + (screen.height * 0.65 / sideLength) + 'px';
			tr.appendChild(td);
		}
		gridBody.appendChild(tr);
	}
	gameGrid.appendChild(gridBody);
	if (gameGrid.childElementCount > 1) //If there was already a gameGrid in the game and a new difficulty was selected, the old grid one should be eliminated.
		gameGrid.removeChild(gameGrid.firstChild);

	setOnClicks();
}
	function setDefaultValues(sideLength, bombsNum) {
		bombsCount = bombsNum;
		imagesInPlay = (sideLength * sideLength - bombsCount)/ 2;
		revealedImageCount = 0;
		currentlyRevealedImages = [];
		revealedBombs = [];
		matrixOfImageRoutes = [];
		lastImageIsBomb = false;	
	}


function defineMatrix(sideLength) { //Creates a Matrix for handling the Grid.
	for(var i = 0; i < sideLength; i++)
		matrixOfImageRoutes[i] = new Array(sideLength);

	var imageNames = new Array(imageQuantity); //Array that contains an Integer for every possible hidden image.
	for (var i = 0; i < 57; i++)
		imageNames[i] = i;
	imageNames.sort(() => Math.random() - 0.5);
	imageNames = imageNames.slice(0, imagesInPlay); //The array has been randomly shuffled and turned into a subset of itself that contains only the amount of image names needed.

	for (var i = 0; i < bombsCount; i++) { //First cells of matrix are filled with bombs.
		matrixOfImageRoutes[0][i] = "Hidden Images/Neutrino Bomb.png";
	}
	var pos = 0;
	for (var i = 0; i < sideLength; i++) { //The rest matrix is filled with two copies of every image selected after slicing the array.
		for (var j = 0; j < sideLength; j++) {
			if (i == 0 && j < bombsCount) j = bombsCount - 1;
			else {
				matrixOfImageRoutes[i][j] = "Hidden Images/Image " + imageNames[pos] + ".png";
				if ((i%2==0 && j%2==0) || (i%2==1 && j%2==1)) pos++; //pos is modified on these two conditions because bombsCount and sideLength are odd numbers and that determines when pos should be updated.
			}
		}
	}
	for (var i = 0; i < sideLength; i++) { //The matrix is randomly shuffled.
		for (var j = 0; j < sideLength; j++) {
			var i1 = Math.floor(Math.random() * sideLength);
			var j1 = Math.floor(Math.random() * sideLength);
			var temp = matrixOfImageRoutes[i][j];
			matrixOfImageRoutes[i][j] = matrixOfImageRoutes[i1][j1];
			matrixOfImageRoutes[i1][j1] = temp;
		}
	}
}


function setOnClicks() {
	var table = document.getElementById("gameGrid");
	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		row = rows[i];
		for (var j = 0; j < rows.length; j++) {
			row.getElementsByTagName("td")[j].onclick = function() {
				var id = this.id.toString();
				posI = parseInt(id.substr(0, id.indexOf(' ')), 10);
				posJ = parseInt(id.substr(id.indexOf(' ' + 1), id.length), 10);
				onClickCell(this, posI, posJ);
			};
		}
	}
}

function onClickCell(cell, posI, posJ) {
	if (cell.classList.contains("covered-cell")) {
		cell.classList.remove("covered-cell");
		cell.classList.add("uncovered-cell");
		cell.style.backgroundImage = "url('" + matrixOfImageRoutes[posI][posJ] + "')";
		if (hasBomb(posI, posJ))
			handleBomb(cell);
		else if (!checkWin(cell))
			manageArray(cell);
	}
}

	function manageArray(cell) {
		if (currentlyRevealedImages.length == 2 || (currentlyRevealedImages.length == 1 && lastImageIsBomb))
			clearArray();
		lastImageIsBomb = false;
		currentlyRevealedImages.push(cell);
	}


	function hasBomb(posI, posJ) {
		return matrixOfImageRoutes[posI][posJ] == "Hidden Images/Neutrino Bomb.png";
	}

	function handleBomb(cell){
		clearArray();
		if (revealedBombs.includes(cell))
			triggerEnding(false);
		else {
			revealedBombs.push(cell);
			lastImageIsBomb = true;
			currentlyRevealedImages.push(cell);
		}
	}



function clearArray() { //Done in a for-loop because the length is unknown and irrelevant here.
	if (currentlyRevealedImages.length < 2 || differentImages()) {
		for (var i = currentlyRevealedImages.length - 1; i >= 0; i--) {
			currentlyRevealedImages[i].classList.remove("uncovered-cell");
			currentlyRevealedImages[i].classList.add("covered-cell");
			currentlyRevealedImages.pop();
		}
	}
	else { //There are two images in the array, and they are two copies of the same one.
		for (var i = currentlyRevealedImages.length - 1; i >= 0; i--) {
			currentlyRevealedImages[i].style.backgroundImage = null;
			currentlyRevealedImages.pop();
		}
		revealedImageCount++;
	}
}
	function differentImages() {
		return currentlyRevealedImages[0].style.backgroundImage != currentlyRevealedImages[1].style.backgroundImage;
	}


function checkWin(cell) { //If called, the last clicked-cell does not have a bomb. Necessary because last click on a valid image will not trigger clearArray() unless other cells are clicked, and all other cells wil contain bombs if the player won.
	if (revealedImageCount < imagesInPlay - 1)
		return false;
	if (currentlyRevealedImages.length == 1 && !lastImageIsBomb) {
		triggerEnding(true);
		return true;
	}
	return false;
}


function triggerEnding(win) {
	var script = document.createElement('script');
	document.body.appendChild(script);
	script.setAttribute('src', 'js/GameEnder.js');
	script.onload = function() { endGame(win, matrixOfImageRoutes); }
}