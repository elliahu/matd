class DFA {
    constructor(pattern) {
        this.pattern = pattern;
        this.buildDFA();
    }

    buildDFA() {
        const M = this.pattern.length;
        const R = 256; // Radix
        this.states = Array.from({ length: M }, () => Array.from({ length: R }, () => 0));
        this.states[0][this.pattern.charCodeAt(0)] = 1;

        let X = 0; // restart state
        for (let j = 1; j < M; j++) {
            for (let c = 0; c < R; c++) {
                this.states[j][c] = this.states[X][c];
            }
            this.states[j][this.pattern.charCodeAt(j)] = j + 1; 
            X = this.states[X][this.pattern.charCodeAt(j)];
        }
    }

    search(text) {
        let i, j, N = text.length, M = this.pattern.length;
        for (i = 0, j = 0; i < N && j < M; i++) {
            j = this.states[j][text.charCodeAt(i)] || 0;
        }
        if (j === M) return i - M; // found
        else return -1; // not found
    }
}

module.exports = {DFA};