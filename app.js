const fs = require('fs');
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const options = [];

rl.question('Please, enter search term:', (searchValue) => {
    rl.question('Do you want to see the most popular joke?[y/n]\n', (answer) => {
        if(answer !== 'y' && answer !== 'n') return;
        options.push(searchValue, answer);
        rl.close();
    });
})

rl.on('close', () => {
    const { searchTerm, leaderboard } = options;
    const url = `https://icanhazdadjoke.com/search?term=${searchTerm}`;
    https.get(url, (res) => {
        res.on('data', (info) => {
            fs.appendFile('./file.txt', info, (err) => {
                if (err) throw err;
            })
        });
    });
    //process.exit(0);
});