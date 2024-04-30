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

function processTextInChunks(text, chunkSize, callback) {
    const textLength = text.length;
    let start = 0;

    while (start < textLength) {
        const chunk = text.substr(start, chunkSize);
        callback(chunk);
        start += chunkSize;
    }
}

function fib(number){
    if (number === 0) return '0';
    
    let fibSeq = [1, 2]; 
    let fibIndex = 1;
    let roof;

    while (fibSeq[fibIndex] <= number) {
        fibSeq.push(fibSeq[fibIndex] + fibSeq[fibIndex - 1]);
        fibIndex++;
    }

    for(let i = fibSeq.length - 1; i >= 0; i--){
        if(fibSeq[i] <= number){
            roof = fibSeq[i];
            break;
        }
    }

    let encodedBinary = '';
    for (let i = roof; i >= 0; i--) {
        if (fibSeq[i] <= number) {
            encodedBinary += '1';
            number -= fibSeq[i];
        } else {
            encodedBinary += '0';
        }
    }

    encodedBinary = encodedBinary.split("").reverse().join("");
    encodedBinary = encodedBinary.replace(/0+$/, '');
    return encodedBinary + "1";
}

function defib(encodedBinary) {

    encodedBinary = encodedBinary.slice(0, -1);

    let fibSeq = [1,2];
    let decodedNumber = 0;
    let i = 0;

    while (i < encodedBinary.length) {
        if (encodedBinary[i] === '1') {
            decodedNumber += fibSeq[i];
            i++;
        } else {
            i++;
        }
        fibSeq.push(fibSeq[fibSeq.length - 1] + fibSeq[fibSeq.length - 2]);
    }

    return decodedNumber;
}

function generateRandomNumbers(n) {
    // Create an array of numbers from 1 to n
    var numbers = [];
    for (var i = 1; i <= n; i++) {
        numbers.push(i);
    }

    // Shuffle the array
    for (var i = numbers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
    }

    // Take the first n numbers
    var randomNumbers = numbers.slice(0, n);
    return randomNumbers;
}

function objectFromArrays(keys, values) {
    if (keys.length !== values.length) {
        throw new Error('Arrays must have the same length');
    }

    const reconstructedObject = {};
    for (let i = 0; i < keys.length; i++) {
        reconstructedObject[keys[i]] = values[i];
    }
    return reconstructedObject;
}

module.exports = {generateRandomWords, processTextInChunks, fib, defib, generateRandomNumbers, objectFromArrays};