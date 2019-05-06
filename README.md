# Vocabulary List Statistics
Gives some statistics about english language vocabulary. the base vocabulary list is gain using [hackerb9/gwordlist](https://github.com/hackerb9/gwordlist) list.

## Install
Using Yarn
```
yarn add vocabulary-list-statistics
```
Using NPM
```
npm i --save vocabulary-list-statistics
```

## Features
- 54,712 english cleaned vocabulary. using [extract-lemmatized-nonstop-words](https://github.com/openderock/extract-lemmatized-nonstop-words).
- Based on revising 348,415,810,278 words.
- Sorted by relative frequency.
- Relative Frequency percent per word.
- Cumulative Relative Frequency percent perword sorted by relative frequency.

## Usage
```javascript
const vocabulary = require('vocabulary-list-statistics');

console.log(vocabulary[12].cumulative);
// logs Cumulative Relative Frequency of 12th word in the list 
```