var wordPairs = [
    { theme: "our past date locations", associatedWords: ["movies", "bowling", "sushi", "restaurant"], color: "#f9da6d" },
    { theme: "tree", associatedWords: ["leaf", "branch", "bark", "wood"], color: "#a4c45c" },
    { theme: "car", associatedWords: ["drive", "engine", "road", "wheel"], color: "#b5c3e7" },
    { theme: "yo", associatedWords: ["huh", "bruh", "bro", "pal"], color: "#bb84c2" }
];

var lives = 4;
var selectedWords = [];
var successfulPairs = [];
var pastGuesses = [];

var buttonGrid = document.getElementById("button-grid");
var submitButton = document.getElementById("submit");
var deselectAllButton = document.getElementById("deselect-all");
var shuffleButton = document.getElementById("shuffle");
var resultDisplay = document.getElementById("result");
var livesDisplay = document.getElementById("lives");

function startGame() {
    var startScreen = document.querySelector(".start_screen");
    startScreen.style.display = "none";

    var startBackground = document.querySelector(".start_background");
    startBackground.style.display = "none";

    deselectAllButton.style.display = "inline-block";
    submitButton.style.display = "inline-block";

    pastGuesses = [];

    initializeGame();
}

function initializeGame() {
    displayWords();
    shuffleWords();

    // Show the action buttons
    document.getElementById("shuffle").removeAttribute("hidden");
    document.getElementById("deselect-all").removeAttribute("hidden");
    document.getElementById("submit").removeAttribute("hidden");

    deselectAllButton.setAttribute("disabled", "disabled");
    
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
    // Toggling the 'selected' class on the button
    button.classList.toggle("selected");

    var word = button.textContent;

    if (button.classList.contains("selected")) {
        if (selectedWords.length < 4) {
            selectedWords.push(word);
        } else {
            button.classList.remove("selected");
            return; // Exit function if more than four buttons are selected
        }
    } else {
        selectedWords = selectedWords.filter(w => w !== word);
    }

    // Enable/disable 'Deselect All' button based on selected words
    if (selectedWords.length > 0) {
        deselectAllButton.removeAttribute("disabled");
    } else {
        deselectAllButton.setAttribute("disabled", "disabled");
    }

    // Check if there are 4 selected words to enable/disable submit button
    if (selectedWords.length === 4) {
        submitButton.removeAttribute("disabled");
        submitButton.classList.add("selected");
    } else {
        submitButton.setAttribute("disabled", "disabled");
        submitButton.classList.remove("selected");
    }

    // If there are fewer than 4 selected buttons, ensure the submit button remains disabled
    if (selectedWords.length < 4) {
        submitButton.setAttribute("disabled", "disabled");
    }
}




// Submit Answer logic functions
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function setsEqual(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (var item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
}

function arraysToSets(arrays) {
    return arrays.map(array => new Set(array));
}

// Submit answer
function submitAnswer() {
    var currentSet = new Set(selectedWords);

    var alreadyGuessed = pastGuesses.some(function (guess) {
        return setsEqual(guess, currentSet);
    });

    if (alreadyGuessed) {
        showNotification("Already guessed!");
        submitButton.classList.remove("selected");
        submitButton.setAttribute("disabled", "disabled");
        return;
    }

    var currentPair = findWordPair(selectedWords[0]);

    if (selectedWords.every(word => currentPair.associatedWords.includes(word))) {
        successfulPairs.push(currentPair);
        pastGuesses.push(currentSet);
        selectedWords = [];
        displayWords(); 
        if (successfulPairs.length === wordPairs.length) {
            gameOverWin(); 
        }
    } else {
        updateLives(-1);
        pastGuesses.push(currentSet);

    }

    if (oneAway(selectedWords)) {
        showNotification("One away...");
    }

    submitButton.classList.remove("selected");
    submitButton.setAttribute("disabled", "disabled");
}


function oneAway(selectedWords) {
    for (var i = 0; i < wordPairs.length; i++) {
        var wordPair = wordPairs[i];
        var count = 0;
        for (var j = 0; j < selectedWords.length; j++) {
            if (wordPair.associatedWords.includes(selectedWords[j])) {
                count++;
            }
        }

        if (count === 3) {
            return true;
        }
    }

    return false;
}

function showNotification(message) {
    var notificationPopup = document.getElementById("notification-popup");
    notificationPopup.style.display = "inline-block";
    notificationPopup.style.opacity = "1";
    notificationPopup.textContent = message;
    setTimeout(function () {
        notificationPopup.style.opacity = "0"; 
        setTimeout(function () {
            notificationPopup.style.display = "none";
        }, 2000); 
    }, 1000);

}

function gameOverLose() {
    showNotification("Next Time");
    clearSelectedState();
    submitRemainingWordPairs()

}

function submitRemainingWordPairs() {
    var remainingPairs = wordPairs.filter(pair => !successfulPairs.includes(pair));

    remainingPairs.forEach(pair => {
        // Simulate selecting associated words
        pair.associatedWords.forEach(word => {
            var buttons = document.querySelectorAll('.button-grid button:not(.theme-button)');
            buttons.forEach(button => {
                if (button.textContent === word) {
                    button.classList.add("selected");
                    selectedWords.push(word);
                }
            });
        });

        // Simulate submitting the selected words
        submitAnswer();

        // Clear selected words for the next iteration
        selectedWords = [];
    });
}


function gameOverWin() {
    showNotification("Good job!");

}

function clearSelectedState() {
    var selectedButtons = document.querySelectorAll(".selected");
    selectedButtons.forEach(function (button) {
        button.classList.remove("selected");
    });
    selectedWords = [];

    // Hide the action buttons
    document.getElementById("shuffle").setAttribute("hidden", "hidden");
    document.getElementById("deselect-all").setAttribute("hidden", "hidden");
    document.getElementById("submit").setAttribute("hidden", "hidden");
}

function findWordPair(word) {
    return wordPairs.find(pair => pair.associatedWords.includes(word));
}

function updateLives(change) {
    lives += change;
    var livesText = "";
    for (var i = 0; i < lives; i++) {
        livesText += "●";
    }
    livesDisplay.textContent = livesText;
    if (lives === 0) {
        gameOverLose();
    }
}

function deselectAll() {
    var buttons = document.querySelectorAll(".selected");
    buttons.forEach(function (button) {
        button.classList.remove("selected");
    });
    selectedWords = [];
    submitButton.classList.remove("selected");
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


//function mergeRemainingButtons() {
//    var remainingButtons = document.querySelectorAll('.button-grid button:not(.theme-button)');
//    var remainingPairs = wordPairs.filter(pair => !successfulPairs.includes(pair));

//    remainingButtons.forEach(remainingButton => {
//        var word = remainingButton.textContent;
//        remainingPairs.forEach(wordPair => {
//            if (wordPair.associatedWords.includes(word)) {
//                var mergeButton = createMergeButton(wordPair.theme, wordPair.color, wordPair.associatedWords);
//                var parentRow = remainingButton.parentNode;
//                parentRow.replaceChild(mergeButton, remainingButton);
//                remainingPairs.splice(remainingPairs.indexOf(wordPair), 1); // Remove the pair from the remaining pairs array
//            }
//        });
//    });

//    // Remove any remaining non-merge buttons
//    remainingButtons.forEach(remainingButton => {
//        remainingButton.parentNode.removeChild(remainingButton);
//    });

//    /*removeExcessButtons();*/
//}

////function removeExcessButtons() {
////    var remainingButtons = document.querySelectorAll('.button-grid button:not(.theme-button)');
////    var numRows = Math.ceil(remainingButtons.length / 4);

////    // Remove excess buttons if the number of rows exceeds 4
////    if (numRows > 4) {
////        for (let i = 4; i < numRows; i++) {
////            var excessButtons = document.querySelectorAll('.button-grid button:not(.theme-button):nth-last-child(-n+' + (remainingButtons.length - (i - 1) * 4) + ')');
////            excessButtons.forEach(button => button.parentNode.removeChild(button));
////        }
////    }
//}


initializeGame();