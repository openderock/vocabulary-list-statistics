const fs = require('fs-extra');
const { orderBy, includes } = require('lodash');
const extract = require('extract-lemmatized-nonstop-words');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const words = new Map();
const blackList = [
    'don',
    'didn',
    'doesn',
    'isn',
    'wasn',
    'wouldn',
    'haven',
    'couldn',
    'shouldn',
    'weren',
    'hasn',
    'hadn',
    'goin',
    // Proper names
    'john',
    'jeff',
    'jeffrey',
    'google',
    'mumbai',
    // ?
    'huh',
    'ces',
];

function addWord(word, count) {
    if (includes(blackList, word)) return;
    const record = words.get(word);
    if (record) {
        words.set(word, record + count);
    } else {
        words.set(word, count);
    }
}


(async () => {
    let data = await fs.readFile('./data/en/frequency-alpha-gcide.txt', 'utf8');
    data.split('\n').forEach(line => {
        // [RANKING,WORD,COUNT,PERCENT,CUMULATIVE]
        let [rank, word, count, percent, cumulative] = line.split(/[\s]+/);
        const parsed = extract(word);
        if (parsed.length != 1) return;
        word = parsed[0].vocabulary;
        count = parseInt(count.replace(/,/g, ''));
        addWord(word, count);
    });
    data = await fs.readFile('./data/en/en_2016_50k.txt', 'utf8');
    data += `\n` + await fs.readFile('./data/en/en_2018_50k.txt', 'utf8');
    data.split('\n').forEach(line => {
        // [WORD,COUNT]
        let [word, count] = line.split(/[\s]+/);
        const parsed = extract(word);
        if (parsed.length != 1) return;
        word = parsed[0].vocabulary;
        // if (word == 'hunting') {
        //     console.log(parsed);
        //     debugger;
        // }
        count = parseInt(count) * (348412387855 / 653789027); // scaling en_2018_50k.txt counts to the frequency-alpha-gcide.txt counts
        addWord(word, count);
    });
    let list = orderBy(Array.from(words).map(record => ({ word: record[0], count: record[1] })), 'count', 'desc').slice(0, 50000);
    const totalCount = list.reduce((totalCount, word) => totalCount + word.count, 0);
    let rank = 1;
    list.reduce((cumulative, item) => {
        item.percent = item.count * 100 / totalCount;// .toFixed(6);
        cumulative += item.percent;
        item.rank = rank++;
        item.cumulative = cumulative;// .toFixed(6);
        delete item.count;
        return cumulative;
    }, 0);
    debugger;
    try {
        // saving as JSON
        await fs.writeJSON('./dist/en.json', list);
        // saving as CSV
        const csvWriter = createCsvWriter({
            header: [
                { id: 'rank', title: 'Rank' },
                { id: 'word', title: 'Word' },
                { id: 'percent', title: 'Percent' },
                { id: 'cumulative', title: 'Cumulative' },
            ],
            // header: ['RANKING', 'WORD', 'COUNT', 'PERCENT', 'CUMULATIVE'],
            path: './dist/en.csv'
        });
        await csvWriter.writeRecords(list);
    } catch (error) {
        console.log(error);
    }
    console.log('...Done');
})();