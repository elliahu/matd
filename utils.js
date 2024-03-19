function generateRandomWords(text, n) {
    // Remove all non-letter characters and split the text into words
    let words = text.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(Boolean);

    // Check if n is greater than the number of words
    if (n > words.length) {
        throw new Error('n cannot be greater than the number of words in the text');
    }

    // Array to hold the random words
    let randomWords = [];

    for (let i = 0; i < n; i++) {
        // Generate a random index
        let index = Math.floor(Math.random() * words.length);

        // Add the word at the random index to the array
        randomWords.push(words[index]);

        // Remove the word from the original array to avoid duplicates
        words.splice(index, 1);
    }

    return randomWords;
}


module.exports = {generateRandomWords};