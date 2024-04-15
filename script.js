var wordPairs = [
    { theme: "our past date locations", associatedWords: ["movies", "bowling", "sushi", "restaurant"], color: "#f9da6d" },
    { theme: "tree", associatedWords: ["leaf", "branch", "bark", "wood"], color: "#a4c45c" },
    { theme: "car", associatedWords: ["drive", "engine", "road", "wheel"], color: "#b5c3e7" },
    { theme: "yo", associatedWords: ["huh", "bruh", "bro", "pal"], color: "#bb84c2" }
];

var lives = 4;
var selectedWords = [];
var successfulPairs = [];

var buttonGrid = document.getElementById("button-grid");
var submitButton = document.getElementById("submit");
var deselectAllButton = document.getElementById("deselect-all");
var shuffleButton = document.getElementById("shuffle");
var resultDisplay = document.getElementById("result");
var livesDisplay = document.getElementById("lives");

function startGame() {
    var startScreen = document.getElementById("start_screen");
    startScreen.style.display = "none"; 

    var startBackground = document.getElementById("start_screen");
    startBackground.style.display = "none"; 
    initializeGame();
}

function initializeGame() {
    displayWords();
    shuffleWords();

    var mergeButtons = document.querySelectorAll('.theme-button');

    submitButton.addEventListener("click", submitAnswer);
    deselectAllButton.addEventListener("click", deselectAll);
    shuffleButton.addEventListener("click", shuffleWords);
}

function displayWords() {
    buttonGrid.innerHTML = "";
    var mergeButtonCreated = false;

    var remainingPairs = wordPairs.filter(function (pair) {
        return !successfulPairs.includes(pair);
    });

    var currentRow;

    successfulPairs.forEach(function (wordPair, index) {
        if (index % 4 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("button-grid");
            buttonGrid.appendChild(currentRow);
        }
        var mergeButton = createMergeButton(wordPair.theme, wordPair.color, wordPair.associatedWords);
        currentRow.appendChild(mergeButton);
        mergeButtonCreated = true;
    });

    remainingPairs.forEach(function (wordPair) {
        var groupIndex = successfulPairs.indexOf(wordPair);
        if (groupIndex === -1) {
            var shuffledWords = shuffleArray(wordPair.associatedWords);
            var shuffledButtons = shuffledWords.map(function (word) {
                return createButton(word);
            });
            shuffledButtons.forEach(function (button) {
                if (!mergeButtonCreated) {
                    currentRow = document.createElement("div");
                    currentRow.classList.add("button-grid");
                    buttonGrid.appendChild(currentRow);
                    mergeButtonCreated = true;
                }
                currentRow.appendChild(button);
            });
        }
    });
    shuffleWords();
}

function createButton(word) {
    var button = document.createElement("button");
    button.textContent = word;
    button.addEventListener("click", function () {
        toggleSelection(this);
    });
    return button;
}

function createMergeButton(theme, color, associatedWords) {
    var button = document.createElement("button");
    button.classList.add("theme-button");
    button.style.backgroundColor = color;

    var themeTitle = document.createElement("strong");
    themeTitle.textContent = theme;
    button.appendChild(themeTitle);

    var associatedWordsDiv = document.createElement("div");
    associatedWordsDiv.textContent = associatedWords.join(", ");
    associatedWordsDiv.style.fontFamily = "'WordlistFont', sans-serif";
    button.appendChild(associatedWordsDiv);

    return button;
}

function toggleSelection(button) {
    if (selectedWords.length === 4 && !button.classList.contains("selected")) {
        return;
    }

    button.classList.toggle("selected");
    var word = button.textContent;
    if (button.classList.contains("selected")) {
        selectedWords.push(word);
        deselectAllButton.removeAttribute("disabled");
    } else {
        selectedWords = selectedWords.filter(w => w !== word);
        if (selectedWords.length === 0) {
            deselectAllButton.setAttribute("disabled", "disabled");
        }
    }
    if (selectedWords.length === 4) {
        submitButton.removeAttribute("disabled");
        submitButton.classList.add("selected");
    } else {
        submitButton.setAttribute("disabled", "disabled");
        submitButton.classList.remove("selected");
    }
}

function submitAnswer() {
    var currentPair = findWordPair(selectedWords[0]);
    if (selectedWords.every(word => currentPair.associatedWords.includes(word))) {
        successfulPairs.push(currentPair);
        displayWords();
    } else {
        updateLives(-1);
    }
    selectedWords = [];
    submitButton.classList.remove("selected");
    submitButton.setAttribute("disabled", "disabled");
}

function gameOver() {
    alert("Game Over!");
}

function findWordPair(word) {
    return wordPairs.find(pair => pair.associatedWords.includes(word));
}

function updateLives(change) {
    lives += change;
    var livesText = "";
    for (var i = 0; i < lives; i++) {
        livesText += "● ";
    }
    livesDisplay.textContent = livesText;
    if (lives === 0) {
        gameOver();
    }
}

function deselectAll() {
    var buttons = document.querySelectorAll(".selected");
    buttons.forEach(function (button) {
        button.classList.remove("selected");
    });
    selectedWords = [];
    submitButton.setAttribute("disabled", "disabled");
}

function shuffleWords() {
    var regularButtons = Array.from(document.querySelectorAll(".button-grid button:not(.theme-button)"));
    var mergeButtons = Array.from(document.querySelectorAll('.theme-button'));

    var shuffledRegularButtons = shuffleArray(regularButtons);
    buttonGrid.innerHTML = "";
    mergeButtons.forEach(function (button) {
        buttonGrid.appendChild(button);
    });
    shuffledRegularButtons.forEach(function (button) {
        buttonGrid.appendChild(button);
    });
}

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

initializeGame();
