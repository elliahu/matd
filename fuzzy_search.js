function fuzzySearch(text, pattern, k) {
    let textLength = text.length;
    let patternLength = pattern.length;

    // Initialize the DP table
    let dp = Array.from({ length: patternLength + 1 }, () => new Array(textLength + 1).fill(0));
    for (let i = 0; i <= patternLength; i++) {
        dp[i][0] = i;
    }

    // Fill the DP table
    for (let i = 1; i <= patternLength; i++) {
        for (let j = 1; j <= textLength; j++) {
            if (pattern[i - 1] === text[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
            }
        }
    }

    // Find and return the starting indices of all occurrences of the pattern in the text with up to k mistakes
    let result = [];
    for (let j = 1; j <= textLength; j++) {
        if (dp[patternLength][j] <= k) {
            if(j - patternLength >= 0)
                result.push(j - patternLength);
        }
    }
    return result;
}

module.exports = {fuzzySearch}; 
