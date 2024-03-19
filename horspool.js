class Horspool {
    constructor() {
        this.table = {};
    }

    preprocess(pattern) {
        pattern = pattern.toLowerCase();
        let m = pattern.length;
        for (let i = 0; i < m - 1; i++) {
            this.table[pattern[i]] = m - i - 1;
        }
        this.table[pattern[m - 1]] = m;
    }

    search(text, pattern) {
        text = text.toLowerCase();
        pattern = pattern.toLowerCase();
        this.preprocess(pattern);
        let n = text.length;
        let m = pattern.length;
        let i = m - 1;
        while (i < n) {
            let k = 0;
            while (k < m && text[i - k] === pattern[m - 1 - k]) {
                k++;
            }
            if (k === m) {
                return i - m + 1; // match found at this index
            } else {
                i += this.table[text[i]] || m;
            }
        }
        return -1; // no match found
    }
}

module.exports = {Horspool};