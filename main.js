const vm = require('./vector_model.js')


async function main() {
   
    const collection = (await vm.create().data('gutenberg_processed')).uniqueSet().tf();

    console.log(collection.idf("stranger"));
    console.log(collection.tfidf("stranger", 0));
    console.log(collection.s("stranger afflict", 0));

    console.log(collection.findSimilarDoc('45'));
    console.log(collection.findSimilarWord('stranger'));

    console.log(vm.dotProduct(vm.normalize(vm.getRowVector(collection._tf, "stranger")),vm.normalize(vm.getRowVector(collection._tf, "stranger"))))
}

main();