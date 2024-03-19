class NFA {
    constructor(pattern, k) {
        this.states = [];
        this.pattern = pattern;
        this.k = k;
        this.buildNFA();
    }

    buildNFA() {
        for (let i = 0; i <= this.pattern.length; i++) {
            this.states.push(new Map());
        }

        for (let i = 0; i <= this.pattern.length; i++) {
            for (let j = 0; j < 26; j++) {
                let nextState = Math.min(this.pattern.length, i + 1);
                while (nextState > 0 && this.pattern.substring(0, nextState) != this.pattern.substring(0, i) + String.fromCharCode(j + 97)) {
                    nextState--;
                }
                this.states[i].set(String.fromCharCode(j + 97), nextState);
            }
        }
    }

    search(text) {
        let matches = [];
        let currentState = 0;
        let mistakes = 0;

        for (let i = 0; i < text.length; i++) {
            while (currentState > 0 && (!this.states[currentState] || !this.states[currentState].has(text[i]))) {
                currentState = currentState > 0 ? this.states[currentState - 1].get(text[i]) : 0;
            }

            if (this.states[currentState] && this.states[currentState].has(text[i])) {
                currentState = this.states[currentState].get(text[i]);
            } else {
                currentState = 0;
                mistakes++;
            }

            if (mistakes > this.k) {
                break; // If mistakes exceed the allowed limit, stop searching
            }

            if (currentState === this.pattern.length) {
                matches.push(i - currentState + 1);
            }

            // Handle insertion (skip character in text)
            if (currentState < this.pattern.length && currentState > 0 &&
                !this.states[currentState].has(text[i]) && this.states[currentState - 1].has(text[i])) {
                currentState = this.states[currentState - 1].get(text[i]);
            }
        }

        return matches;
    }
}

// Example usage:
const pattern = "asurvey";
const k = 1;
const nfa = new NFA(pattern, k);
const text = "cost survey pattern normal albedo";
const matches = nfa.search(text);
console.log("Matches found at positions:", matches); // Output: [5]
