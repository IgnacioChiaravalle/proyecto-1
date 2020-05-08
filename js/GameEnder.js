function endGame(win, matrixOfImageRoutes) {
	var msg = win ? "Victoria!!" : "Derrota!!";
	setTimeout(() => {
		console.log(msg);

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
		} //All images are revealed.

		setResultsCount(win);

	}, 2000);
}

function setResultsCount(win) {
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
	console.log("Victorias en esta dificultad: " + winsCount + "\nDerrotas en esta dificultad: " + lossesCount);

}