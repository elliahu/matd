const fs = require('node:fs');
const dfa = require('./dfa.js')
const hp = require('./horspool.js')
const bf = require('./bruteforce.js')
const utils = require('./utils.js')
const fuzzy = require('./fuzzy_search.js')
const ps = require('./PorterStemmer1980.js')
const books = require('./books.js')


const collection = books.getBookCollection('gutenberg');
console.log(collection['11-0.txt']);


