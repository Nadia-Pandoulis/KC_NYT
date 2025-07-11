﻿var wordPairs = [
    { theme: " ", associatedWords: [" ", " ", " ", " "], color: "#f9da6d" },
    { theme: " ", associatedWords: [" ", " ", " ", " "], color: "#f9da6d" },
    { theme: " ", associatedWords: [" ", " ", " ", " "], color: "#f9da6d" },
    { theme: " ", associatedWords: [" ", " ", " ", " "], color: "#f9da6d" }
]

var wordPairs1 = [
    { theme: "future plans", associatedWords: ["Skydiving", "Candlelight Concert", "vivid", "Thredbo"], color: "#f9da6d" },
    { theme: "our past date locations", associatedWords: ["movies", "bowling", "sushi", "restaurant"], color: "#a4c45c" },
    { theme: "favourite drinks", associatedWords: ["coke", "monster", "juice", "Passionfruit"], color: "#b5c3e7" },
    { theme: "movie treats", associatedWords: ["grapes", "thins chips", "sour skittles", "frozen coke"], color: "#bb84c2" }
];

var wordPairs2 = [
    { theme: "quick bites", associatedWords: ["yallah", "hsp", "iga", "maccas"], color: "#f9da6d" },
    { theme: "Kane Starterpack", associatedWords: ["motorbike", "aviators", "desk setup", "chelsea boots"], color: "#a4c45c" },
    { theme: "Hobbies", associatedWords: ["rubiks cube", "piano", "coding", "movies"], color: "#b5c3e7" },
    { theme: "Related to other groups (but not quite right)", associatedWords: ["stellini's", "guitar", "tie", "ramen"], color: "#bb84c2" }
];

var wordPairs3 = [
    { theme: "past couples costumes", associatedWords: ["barb", "perry", "love", "y2k"], color: "#f9da6d" },
    { theme: "dislikes", associatedWords: ["Mayo", "Blue Cheese", "Trump", "Black Licorice"], color: "#a4c45c" },
    { theme: "things i like to chomp", associatedWords: ["arm", "nutella", "percy", "nuggets"], color: "#b5c3e7" },
    { theme: "things i stab", associatedWords: ["ribs", "stomach", "cheeks", "steak"], color: "#bb84c2" }
]; 

var wordPairs4 = [
    { theme: "Travel Foods", associatedWords: ["onigiri", "sandwiches", "yakult", "chicken"], color: "#f9da6d" },
    { theme: "Places to go together", associatedWords: ["Greece", "Gold Coast", "Switzerland", "Italy"], color: "#a4c45c" },
    { theme: "Places Skied", associatedWords: ["Japan", "New Zealand", "Thredbo", "Perisher"], color: "#b5c3e7" },
    { theme: "Where friends (plushies) were found", associatedWords: ["Ikea", "Hakuba", "Newcastle", "Audrey"], color: "#bb84c2" }
]; 

var wordPairs5 = [
    { theme: "Captial Cities", associatedWords: ["Cairo", "Tokyo", "Belém", "Washington"], color: "#f9da6d" },
    { theme: "To Surpass", associatedWords: ["Trump", "Beat", "Eclipse", "Top"], color: "#a4c45c" },
    { theme: "One Word Tech Names", associatedWords: ["Nest", "Drift", "Stripe", "Meta"], color: "#b5c3e7" },
    { theme: "80s/90s Songs", associatedWords: ["I ran", "Civil War", "Istanbul", "Jump"], color: "#bb84c2" }
]; 

var lives = 4;
var selectedWords = [];
var successfulPairs = [];
var pastGuesses = [];
var currentMerge = 0;
var gameOver = false;

var buttonGrid = document.getElementById("button-grid");
var submitButton = document.getElementById("submit");
var gameSelectorButton = document.getElementById("game-selector-button");
var deselectAllButton = document.getElementById("deselect-all");
var shuffleButton = document.getElementById("shuffle");
var resultDisplay = document.getElementById("result");
var livesDisplay = document.getElementById("lives");

function fadeOutLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(function () {
        loadingScreen.style.display = 'none';
        showStartScreen();
    }, 2000); 
}

function showStartScreen() {
    var startScreen = document.querySelector('.start_screen');
    startScreen.style.display = 'block';
}

function startGame() {
    var startScreen = document.querySelector(".start_screen");
    startScreen.style.display = "none";

    var startBackground = document.querySelector(".start_background");
    startBackground.style.display = "none";

    var gameSelector = document.getElementById("game-selector-box");
    gameSelector.style.display = "inline-block";
}

function startGame2() {
    deselectAllButton.style.display = "none";
    submitButton.style.display = "none";
    shuffleButton.style.display = "none";

    var mistakesRemaining = document.getElementById("lives-display");
    mistakesRemaining.style.display = "none";

    var lives = document.getElementById("lives");
    lives.style.display = "none";

    gameSelectorButton.style.display = "inline-block";
    document.getElementById("game-selector-button").classList.add("disable-hover");
    setTimeout(function () {
        var gameSelector = document.getElementById("game-selector-box");
        var closeGameSelector = document.getElementById("close-selector");

        // Start with 0 opacity
        gameSelector.style.opacity = 0;
        closeGameSelector.style.opacity = 0;

        // Display the elements
        gameSelector.style.display = "inline-block";
        closeGameSelector.style.display = "block";

        // Fade in animation
        var fadeInInterval = setInterval(function () {
            // Increase opacity by 0.2 every 50 milliseconds
            gameSelector.style.opacity = parseFloat(gameSelector.style.opacity) + 0.2;
            closeGameSelector.style.opacity = parseFloat(closeGameSelector.style.opacity) + 0.2;

            // Stop the interval when opacity reaches 1
            if (parseFloat(gameSelector.style.opacity) >= 1) {
                clearInterval(fadeInInterval);
            }
        }, 50); 
    }, 2000); // delay before starting fade-in



}

function clearButtonGrid(currentWordPairs) {
    buttonGrid.innerHTML = ""; 
    selectedWords = []; 
    successfulPairs = []; 
    pastGuesses = []; 
    currentMerge = 0;
    gameOver = false;
    gameSelectorButton.style.display = "none";
    lives = 4; 
    updateLives(0, currentWordPairs); 
}

function closeGameSelector() {
    var gameSelector = document.getElementById("game-selector-box");
    gameSelector.style.display = "none";

    // Enable hover effect on selector button
    document.getElementById("game-selector-button").classList.remove("disable-hover");
}

function openGameSelector() {
    var gameSelector = document.getElementById("game-selector-box");
    gameSelector.style.display = "inline-block";

    var closeGameSelector = document.getElementById("close-selector");
    closeGameSelector.style.display = "block";

    // Disable hover effect on selector button
    document.getElementById("game-selector-button").classList.add("disable-hover");
}

function preInitialiseGame(selectedWordPair) {
    wordPairs = selectedWordPair;
    clearButtonGrid(selectedWordPair);

    deselectAllButton.style.display = "inline-block";
    submitButton.style.display = "inline-block";
    shuffleButton.style.display = "inline-block";

    var mistakesRemaining = document.getElementById("lives-display");
    mistakesRemaining.style.display = "inline-block";

    var lives = document.getElementById("lives");
    lives.style.display = "inline-block";

    pastGuesses = [];
    currentMerge = 0;
    gameOver = false;

    closeGameSelector();

    gameSelectorButton.style.display = "none";

    initializeGame();
}

function initializeGame() {
    var mainContent = document.querySelector(".start_screen");
    mainContent.style.filter = "none";

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

    successfulPairs.forEach(function (wordPairs, index) {
        if (index % 4 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("button-grid");
            buttonGrid.appendChild(currentRow);
        }
        if (index > currentMerge) {
            currentMerge = index;
        }
        var mergeButton = createMergeButton(wordPairs.theme, wordPairs.color, wordPairs.associatedWords, index, currentMerge);
        currentRow.appendChild(mergeButton);
        mergeButtonCreated = true;
        if (index == currentMerge) {
            currentMerge += 1;
        }
    });

    remainingPairs.forEach(function (wordPairs) {
        var groupIndex = successfulPairs.indexOf(wordPairs);
        if (groupIndex === -1) {
            var shuffledWords = shuffleArray(wordPairs.associatedWords);
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

function createMergeButton(theme, color, associatedWords, index, currentMerge) {
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

    // Only add the pop-out animation class for the current indexed button
    if (gameOver) {
        setTimeout(function () {
            button.classList.add("pop-out");
        }, index * 400);
    } else if (index === currentMerge) {
        button.classList.add("pop-out");
    }

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
    } else if (!gameOver) {
        var selectedButtons = document.querySelectorAll('.selected:not(#submit)');
        selectedButtons.forEach(function (button, index) {
            setTimeout(function () {
                button.style.animation = 'bounce 0.5s ease-in-out';
                setTimeout(function () {
                    button.style.animation = ''; // Reset animation after it finishes
                }, 500);
            }, index * 100); // Adjust the delay as needed
        });

        setTimeout(function () {
            continueSubmit();
        }, selectedButtons.length * 100 + 500); // Adjust the delay for continuation
    } else {
        continueSubmit();
    }

    function continueSubmit() {
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
            var selectedButtons = document.querySelectorAll('.selected:not(#submit)');
            selectedButtons.forEach(function (button) {
                button.style.backgroundColor = '#999888'; 
                button.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(function () {
                    button.style.animation = '';
                    button.style.backgroundColor = '';
                }, 500);
            });
            updateLives(-1);
            pastGuesses.push(currentSet);
        }

        if (oneAway(selectedWords)) {
            showNotification("One away...");
        }

        submitButton.classList.remove("selected");
        submitButton.setAttribute("disabled", "disabled");
    }
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
    gameOver = true;
    submitRemainingWordPairs();
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
    startGame2();
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
        setTimeout(function () {
            gameOverLose();
        }, 1000);
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
    deselectAllButton.setAttribute("disabled", "disabled");
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