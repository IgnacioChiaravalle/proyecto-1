var activeDD = null; //Active Drop-Down-Menu Item (i.e., the difficulty). Starts as null (no selection has been done).

function retrieveStorage() {
	var idDD = localStorage.getItem("idDD");
	if (idDD != null) {
		var selectionDD = document.getElementById(idDD);
		selectionDD.onclick.apply(selectionDD);
	}
	else {
		localStorage.setItem("Jerry Wins", 0); localStorage.setItem("Jerry Losses", 0);
		localStorage.setItem("Summer Wins", 0); localStorage.setItem("Summer Losses", 0);
		localStorage.setItem("Morty Wins", 0); localStorage.setItem("Morty Losses", 0);
		localStorage.setItem("Rick Wins", 0); localStorage.setItem("Rick Losses", 0);
		setBackground("Backgrounds/Rick and Morty Portal.png");
	}
}

function setDifficulty(selectionDD, bgURL) {
	setActiveDD(selectionDD);
	setBackground(bgURL);
	localStorage.setItem("idDD", selectionDD.id);
}

function setActiveDD(selectionDD) {
	if (activeDD != null)
		activeDD.classList.remove("activeDD");
	selectionDD.classList.add("activeDD");
	activeDD = selectionDD;
}

function setBackground(bgURL) {
	document.body.style.backgroundImage = "url('" + bgURL + "')";
}

function clearStorage() { //This is for testing purposes only. It clears the localStorage so that the user is shown what they would see for the first time.
	localStorage.removeItem("idDD");
}