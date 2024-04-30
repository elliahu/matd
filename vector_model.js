const fs = require('fs').promises;
const utils = require('./utils');


function dotProduct(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must have the same length');
    }

    let result = 0;
    for (let i = 0; i < vector1.length; i++) {
        result += vector1[i] * vector2[i];
    }
    return result;
}

function l2Norm(vector) {
    let sumOfSquares = 0;
    for (let i = 0; i < vector.length; i++) {
        sumOfSquares += vector[i] * vector[i];
    }
    return Math.sqrt(sumOfSquares);
}

function normalize(vector) {
    const norm = l2Norm(vector);
    if (norm === 0) {
        throw new Error('Cannot normalize the zero vector');
    }
    return vector.map(component => component / norm);
}

function normalizeRows(table) {
    const normalizedTable = {};
    for (const word in table) {
        if (table.hasOwnProperty(word)) {
            const row = table[word];
            const values = Object.values(row);
            const norm = Math.sqrt(values.reduce((acc, val) => acc + val ** 2, 0));
            normalizedTable[word] = values.map(val => val / norm);
        }
    }
    return normalizedTable;
}

function getColumnVector(table, column) {
    const columnVector = [];
    for (const word in table) {
        if (table.hasOwnProperty(word)) {
            const row = table[word];
            if (row.hasOwnProperty(column.toString())) {
                columnVector.push(row[column.toString()]);
            } else {
                throw new Error(`Column ${column} not found in row ${word}`);
            }
        }
    }
    return columnVector;
}

function getRowVector(table, word) {
    if (!table.hasOwnProperty(word)) {
        throw new Error('Word not found in table');
    }

    const wordRow = table[word];
    return Object.keys(wordRow).map(key => wordRow[key]);
}

function create() {
    var collection = {};

    collection._data = new Set();
    collection._tf = {};
    collection._uniqueSet = new Set();

    collection.uniqueSet = () => {
        collection._uniqueSet = new Set();

        const docs = Array.from(collection._data);

        for (const doc of docs) {
            var terms = doc.split(/\s+/);

            for (const term of terms) {
                collection._uniqueSet.add(term);
            }
        }

        return collection;
    }

    collection.tf = () => {
        collection._tf = {};

        const terms = Array.from(collection._uniqueSet);
        const docs = Array.from(collection._data);

        for (const term of terms) {
            collection._tf[term] = {};
            let id = 0;
            for (const doc of docs) {
                collection._tf[term][id] = 0;
                id++;
            }
        }

        let id = 0;
        for (const doc of docs) {
            const words = doc.split(/\s+/);
            for (const word of words) {
                collection._tf[word][id]++;
            }
            id++;
        }

        return collection;
    }

    collection.idf = (t) => {
        let dt = 0;
        let N = collection._data.size;

        for (const id of Object.keys(collection._tf[t])) {
            if (collection._tf[t][id] > 0)
                dt++;
        }

        return Math.log(N / dt);
    }

    collection.tfidf = (t, d) => {
        return collection._tf[t][d] * collection.idf(t);
    }

    collection.s = (q, d) => {
        const words = q.split(/\s+/);
        let score = 0;
        for (const word of words) {
            score += collection.tfidf(word, d);
        }
        return score;
    }

    collection.data = async (dir) => {
        const files = await fs.readdir(dir);
        for (let file of files) {
            // raw data
            const data = await fs.readFile(`${dir}/${file}`, 'utf8');
            collection._data.add(data);
        }

        return collection;
    }

    collection.findSimilarDoc = (id) => {
        let vectors = {};

        const keys = Object.keys(collection._tf);
        for (const [docId, value] of Object.entries(collection._tf[keys[0]])) {
            let v = normalize(getColumnVector(collection._tf, docId));
            vectors[docId] = v;
        }

        const targetVector = vectors[id];
        if (!targetVector) {
            throw new Error(`Document with id ${id} not found`);
        }

        let maxSimilarity = -Infinity;
        let mostSimilarDocId = null;

        for (const [docId, vector] of Object.entries(vectors)) {
            if (docId !== id) {
                const similarity = dotProduct(targetVector, vector);
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    mostSimilarDocId = docId;
                }
            }
        }

        console.log(maxSimilarity);
        return mostSimilarDocId;

    }

    collection.findSimilarWord = (word) => {
        let vectors = {};

        for (const [word, docs] of Object.entries(collection._tf)) {
            let v = normalize(getRowVector(collection._tf, word));
            vectors[word] = v;
        }

        const targetVector = vectors[word];
        if (!targetVector) {
            throw new Error(`Word ${word} not found`);
        }

        let maxSimilarity = -Infinity;
        let mostSimilarWord = null;

        for (const [otherWord, vector] of Object.entries(vectors)) {
            if (otherWord !== word) {
                const similarity = dotProduct(targetVector, vector);
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    mostSimilarWord = otherWord;
                }
            }
        }

        console.log(maxSimilarity);
        return mostSimilarWord;
    }

    return collection;
}


module.exports = {
    create,
    dotProduct,
    l2Norm,
    normalize,
    getRowVector,
    getColumnVector
};