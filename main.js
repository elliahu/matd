const vm = require('./vector_model.js')

async function main() {
   
    const collection = (await vm.create().data('gutenberg_processed')).uniqueSet().tf();

    console.log(collection.idf("stranger"));
    console.log(collection.tfidf("stranger", 0));
    console.log(collection.s("stranger afflict", 0));

    let best = new Map();
    for (let id = 0; id < collection._data.size; id++) {
        best.set(id, collection.s("stranger afflict", id));
    }

    console.log([...best.entries()].sort((a,b)=> b[1] - a[1]).slice(0,10));
}

main();