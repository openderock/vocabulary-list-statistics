const fs = require('fs-extra');
const { orderBy } = require('lodash');
const extract = require('extract-lemmatized-nonstop-words');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

(async () => {
    const data = await fs.readFile('./data/en/frequency-alpha-gcide.txt', 'utf8');
    let totalCount = 0;
    const words = new Map();
    data.split('\n').forEach(line => {
        // [RANKING,WORD,COUNT,PERCENT,CUMULATIVE]
        let [rank, word, count, percent, cumulative] = line.split(/[\s]+/);
        const parsed = extract(word);
        if (parsed.length != 1) return;
        word = parsed[0].vocabulary;
        try {
            count = parseInt(count.replace(/,/g, ''));
            totalCount += count;
            const record = words.get(word);
            if (record) {
                words.set(word, record + count);
            } else {
                words.set(word, count);
            }
        } catch (error) {
            debugger;
        }
    });
    let list = Array.from(words).map(record => ({ word: record[0], count: record[1], percent: (record[1] * 100 / totalCount) }));
    list = orderBy(list, 'count', 'desc');
    let rank = 1;
    list.reduce((cumulative, item) => {
        cumulative += item.percent;
        item.rank = rank++;
        item.cumulative = cumulative.toFixed(6);
        item.percent = item.percent.toFixed(6);
        delete item.count;
        return cumulative;
    }, 0);
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