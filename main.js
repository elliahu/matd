const books = require('./books.js')

async function main(){
    const collection = await books.getBookCollection('gutenberg');
    console.log(collection['11-0.txt'].substring(0,1000));
    await books.saveCollection('gutenberg_processed',collection);
}

main();