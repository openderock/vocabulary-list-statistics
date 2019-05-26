# Vocabulary List Statistics
Gives some statistics about english language vocabulary. the base vocabulary list is gain using [hackerb9/gwordlist](https://github.com/hackerb9/gwordlist) and [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords) lists.

## Features
- 50,000 english cleaned vocabulary. cleaned using [extract-lemmatized-nonstop-words](https://github.com/openderock/extract-lemmatized-nonstop-words).
- Based on revising 349,066,176,882 words.
- Sorted by relative frequency.
- Relative Frequency percent per word.
- Cumulative Relative Frequency percent perword sorted by relative frequency.

## Install
Using Yarn
```
yarn add vocabulary-list-statistics
```
Using NPM
```
npm i --save vocabulary-list-statistics
```

You can also use the [Excel version](https://github.com/openderock/vocabulary-list-statistics/blob/master/dist/en.csv).

## Usage
```javascript
const vocabulary = require('vocabulary-list-statistics');

console.log(vocabulary[12].cumulative);
// logs Cumulative Relative Frequency of 12th word in the list 
```