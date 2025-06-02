// Select Input, Button, and Display Elements
const inputBox = document.querySelector('#input');
const searchButton = document.querySelector('#search');
const notFoundBox = document.querySelector('.not-found');
const definitionBox = document.querySelector('.def');
const audioContainer = document.querySelector('.audio');
const loadingIndicator = document.querySelector('.Loading');


// Merriam-Webster API Key
const API_KEY = 'c1e6c848-cbb8-4920-944b-401da1a3cd64';


// Add click event listener to Search Button
searchButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Clear previous data
    audioContainer.innerHTML = '';
    notFoundBox.innerText = '';
    definitionBox.innerText = '';

    // Get word from input
    const word = inputBox.value.trim();
    if (word === '') {
        alert('Word is required!');
        return;
    }

    // Fetch data from API
    fetchWordData(word);
});


// Function to fetch data from Dictionary API
async function fetchWordData(word) {
    loadingIndicator.style.display = 'block';

    try {
        const url = `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        loadingIndicator.style.display = 'none';

        if (!data.length) {
            notFoundBox.innerText = "No result found.";
            return;
        }

        // If suggestions are returned
        if (typeof data[0] === 'string') {
            showSuggestions(data);
            return;
        }

        // If correct result is found
        const definition = data[0].shortdef && data[0].shortdef.length
            ? data[0].shortdef[0]
            : "No definition found.";
        definitionBox.innerText = definition;

        // If sound is available, play it
        const soundObj = data[0].hwi && data[0].hwi.prs && data[0].hwi.prs[0].sound;
        if (soundObj && soundObj.audio) {
            playSound(soundObj.audio);
        }

    } catch (error) {
        loadingIndicator.style.display = 'none';
        notFoundBox.innerText = "Something went wrong. Please try again.";
        console.error(error);
    }
}


// Function to show suggestions
function showSuggestions(suggestions) {
    notFoundBox.innerHTML = '';
    const heading = document.createElement('h3');
    heading.innerText = "Did you mean?";
    notFoundBox.appendChild(heading);

    suggestions.forEach(suggestion => {
        const suggestionSpan = document.createElement('span');
        suggestionSpan.classList.add('suggested');
        suggestionSpan.innerText = suggestion;
        notFoundBox.appendChild(suggestionSpan);
    });
}


// Function to play sound
function playSound(soundName) {
    const subFolder = soundName.charAt(0);
    const soundUrl = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${API_KEY}`;
    const audioElement = document.createElement('audio');
    audioElement.src = soundUrl;
    audioElement.controls = true;
    audioContainer.appendChild(audioElement);
}
