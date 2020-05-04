var activeDD = null; //Active Drop-Down-Menu Item (i.e., the difficulty). Starts as null (no selection has been done).

function retrieveStorage() {
	var idDD = localStorage.getItem("idDD");
	if (idDD != null) {
		var selectionDD = document.getElementById(idDD);
		selectionDD.onclick.apply(selectionDD);
	}
	else
		setBackground("Backgrounds/Rick and Morty Portal.png");
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