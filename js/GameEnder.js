const navbar = document.getElementById("navbar");
const dDMenu = document.getElementById("drop-down-menu");
const popUp = document.getElementById("ending-pop-up");
const overlay = document.getElementById("overlay");

function endGame(win, matrixOfImageRoutes) {
	var msg = win ? "VICTORIA" : "DERROTA";
	setTimeout(() => { setResultsCounts(win); openPopUp(msg); }, 100);
	setTimeout(() => { //Reveal all images.
		var table = document.getElementById("gameGrid");
		var rows = table.getElementsByTagName("tr");
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			for (var j = 0; j < rows.length; j++) {
				var td = row.getElementsByTagName("td")[j];
				if (td.classList.contains("covered-cell"))
					td.classList.remove("covered-cell");
				td.classList.add("uncovered-cell");
				td.style.backgroundImage = "url('" + matrixOfImageRoutes[i][j] + "')";
			}
		}
	}, 300);
}

function setResultsCounts(win) {
	var selectionDD = document.getElementsByClassName("activeDD");
	var difficulty = selectionDD[0].id;
	difficulty = difficulty.substr(0, difficulty.indexOf('D'));
	var winsCount = localStorage.getItem(difficulty + " Wins");
	var lossesCount = localStorage.getItem(difficulty + " Losses");
	if (win) {
		winsCount++;
		localStorage.setItem(difficulty + " Wins", winsCount)
	}
	else {
		lossesCount++;
		localStorage.setItem(difficulty + " Losses", lossesCount);
	}
	document.getElementById("pop-up-text-wins").innerHTML = "Victorias en Modo " + difficulty + ":"
	document.getElementById("pop-up-text-wins-number").innerHTML = winsCount;
	document.getElementById("pop-up-text-losses").innerHTML = "Derrotas en Modo " + difficulty + ":";
	document.getElementById("pop-up-text-losses-number").innerHTML = lossesCount;
}


function openPopUp(msg) {
	popUp.classList.add('active');
	overlay.classList.add('active');
	navbar.style.pointerEvents = "none";
	dDMenu.style.pointerEvents = "none";
	document.getElementById("pop-up-title").innerHTML = msg;
}