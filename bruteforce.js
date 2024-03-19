function bruteForceSearch(needle, haystack) {
    for (let i = 0; i < haystack.length; i++) {
        let j = 0;

        while (haystack[i + j] == needle[j]) {
            j++;
            if (j == needle.length) {
                return i;
            }
        }
    }

    return -1;
}

module.exports = {bruteForceSearch};