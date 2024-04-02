const fs = require('fs').promises;

function create(){
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

        const terms =  Array.from(collection._uniqueSet);
        const docs = Array.from(collection._data);

        for(const term of terms){
            collection._tf[term] = {};
            let id = 0;
            for(const doc of docs){
                collection._tf[term][id] = 0;
                id++;
            }
        }
        
        let id = 0;
        for(const doc of docs){
            const words = doc.split(/\s+/);
            for(const word of words){
                collection._tf[word][id]++;
            }
            id++;
        }

        return collection;
    }

    collection.idf = (t) => {
        let dt = 0;
        let N = collection._data.size;

        for(const id of Object.keys(collection._tf[t])){
            if(collection._tf[t][id] > 0)
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
        for(const word of words){
            score += collection.tfidf(word, d);
        }
        return score;
    }

    collection.data = async (dir) => {
        const files = await fs.readdir(dir);
        for (let file of files){
            // raw data
            const data = await fs.readFile(`${dir}/${file}`, 'utf8');
            collection._data.add(data);
        }

        return collection;
    }

    return collection;
}

module.exports = {create};