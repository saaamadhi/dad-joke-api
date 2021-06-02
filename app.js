const fs = require('fs');
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const properties = [];

const randomizer = (max) => {
    return Math.floor(Math.random() * max);
}

rl.question('Please, enter search term: ', (searchValue) => {
    rl.question('Do you want to see the most popular joke?[y/n]\n', (answer) => {
        if(answer !== 'y' && answer !== 'n'){rl.close(); process.exit()} 
        if(searchValue === ''){rl.close(); process.exit()} 
        properties.push(searchValue, answer);
        rl.close();
    });
})

rl.on('close', () => {
    const [ searchTerm, leaderboard ] = properties;
    
    const options = {
        hostname: 'icanhazdadjoke.com',
        path: `/search?term=${searchTerm}`,
        headers: {
            'Accept': 'application/json'
        }
    }

    https.get(options, (res) => {
        let data = '';

        res.on('data', info => {
            data += info;
        })

        res.on('end', () => {
            const results = JSON.parse(data).results;
            const randomJoke = randomizer(results.length);
            if(results.length !== 0){
                fs.appendFile('./jokes.txt', JSON.stringify(results[randomJoke]) + ',\n', (err) => {
                    if(err) throw err;
                })
            } else console.log("Oops!No matches were found for that search term!");
        });

        res.on('close', () => {
            if(leaderboard === 'y'){
                fs.readFile('./jokes.txt', (err, fileData) => {
                    let counter = 0, mostPopularJoke;
        
                    if(err) throw err;
                    const data = JSON.parse(`[${fileData.slice(0, -2)}]`);
                    data.forEach(element => {
                        let count = 0;
                        data.forEach(item => {
                            if(element.id === item.id){
                                count++;
                            }
                            if(counter < count){
                                counter = count;
                                mostPopularJoke = element;
                            }
                        });
                    });
        
                    console.log(mostPopularJoke);
                })
            }
        })
    }).on('error', (e) => {
        console.error(e);
    });
});