// Import modules and api keys
require("dotenv").config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require(`axios`);
const moment = require(`moment`);
const omdbkey = keys.omdb.key;
const bandsAppID = keys.bands.appID;
const fs = require(`fs`);
const inquirer = require(`inquirer`);
const chalk = require(`chalk`);

let command, string;

inquirer.prompt([
    {
        type: 'list',
        name: 'command',
        message: chalk.green('What would you like to do?'),
        choices: ['spotify-this-song', 'concert-this', 'movie-this', 'do-what-it-says']
    },
    {
        type: 'input',
        name: 'argument',
        message: chalk.yellow('What song would you like to search?'),
        when: function(answers) {
            return answers.command === 'spotify-this-song'
        }
    },
    {
        type: 'input',
        name: 'argument',
        message: chalk.yellow('What concert would you like to search?'),
        when: function(answers) {
            return answers.command === 'concert-this'
        }
    },
    {
        type: 'input',
        name: 'argument',
        message: chalk.yellow('What movie would you like to search?'),
        when: function(answers) {
            return answers.command === 'movie-this'
        }
    },
])
.then((res)=>{
    command = res.command;
    string = res.argument;
    runCommand(command, string);
})

// Grab the command and argument for the command and assign them to variables
// let command = process.argv[2];
// let string = process.argv.splice(3).join(" ");

// A function to append a string to a log and line break
function appendToFile(string) {
    fs.appendFile(`log.txt`, `${string}\n`, (err) => { if (err) throw err })
}

// The main function, takes in the command and string argument, depending on the command it will take the argument and input it into different API Calls
function runCommand(command, string) {
    // If the command is 'spotify-this' then insert the argument into the Spotify API to search for a song.
    if (command == `spotify-this-song`) {
        spotify.search({ type: `track`, query: string })
        // After the response comes back, console log the results and log them in log.txt
            .then((res) => {
                let song = res.tracks.items[0];
                console.log(chalk.blue.bold(`-------------------------------------`));
                appendToFile(`-------------------------------------`);
                console.log(`Artist name: ${chalk.red.underline(`${song.artists[0].name}`)}`);
                appendToFile(`Artist name: ${song.artists[0].name}`);
                console.log(`Track name: ${song.name}`);
                appendToFile(`Track name: ${song.name}`);
                console.log(`Album name: ${song.album.name}`);
                appendToFile(`Album name: ${song.album.name}`);
                if (song.preview_url) {
                    console.log(`Spotify Preview: ${song.preview_url}`);
                    appendToFile(`Spotify Preview: ${song.preview_url}`);
                } else {
                    console.log(`Link to song: ${song.external_urls.spotify}`);
                    appendToFile(`Link to song: ${song.external_urls.spotify}`);
                }
                console.log(chalk.blue.bold(`-------------------------------------`));
                appendToFile(`-------------------------------------`);
            })
            .catch((err) => console.log(err));
    // If the command is concert-this then take the argument and put it into the bandsintown API
    } else if (command == `concert-this`) {
        axios.get(`https://rest.bandsintown.com/artists/${string}/events?app_id=${bandsAppID}`)
            .then((res) => {
                // Iterate through the data and console log the results and append it to log.txt
                for (i in res.data) {
                    let data = res.data[i];
                    console.log(chalk.blue.bold(`-------------------------------------`));
                    appendToFile(`-------------------------------------`);
                    console.log(`Lineup: ${chalk.red.underline(`${data.lineup.join(", ")}`)}`);
                    appendToFile(`Lineup: ${data.lineup.join(", ")}`);
                    console.log(`Location: ${data.venue.city}, ${data.venue.region}, ${data.venue.country}`);
                    appendToFile(`Location: ${data.venue.city}, ${data.venue.region}, ${data.venue.country}`);
                    console.log(`Venue: ${data.venue.name}`);
                    appendToFile(`Venue: ${data.venue.name}`);
                    console.log(`Event Time: ${moment(data.datetime).format(`dddd, MMMM Do YYYY, hh:mm a`)}`);
                    appendToFile(`Event Time: ${moment(data.datetime).format(`dddd, MMMM Do YYYY, hh:mm a`)}`);
                    if (data.offers[0].status == `available`) {
                        console.log(`Tickets: ${data.offers[0].url}`);
                        appendToFile(`Tickets: ${data.offers[0].url}`);
                    };
                    if (data.offers[1].status == `available`) {
                        console.log(`VIP Tickets: ${data.offers[1].url}`);
                        appendToFile(`VIP Tickets: ${data.offers[1].url}`);
                    };
                    console.log(chalk.blue.bold(`-------------------------------------`));
                    appendToFile(`-------------------------------------`);
                }
            })
            .catch((err) => console.log(err));
    // Check if the command is 'movie-this' then input the string argument into the OMDB database
    } else if (command == `movie-this`) {
        // If the argument doesn't exist then set it to 'Mr. Nobody'
        string = (string) ? string : `Mr. Nobody`;
        axios.get(`http://www.omdbapi.com/?apikey=${omdbkey}&t=${string}`)
            // Iterate through the data and console log the results and append it to log.txt
                .then((res) => {
                let data = res.data;
                console.log(chalk.blue.bold(`-------------------------------------`));
                appendToFile(`-------------------------------------`);
                console.log(`Title: ${chalk.red.underline(`${data.Title}`)}`);
                appendToFile(`Title: ${data.Title}`);
                console.log(`Year: ${data.Year}`);
                appendToFile(`Year: ${data.Year}`);
                console.log(`IMDB Rating: ${data.imdbRating}`);
                appendToFile(`IMDB Rating: ${data.imdbRating}`);
                console.log(`Rotten Tomatoes Rating: ${data.Ratings[1].Value}`);
                appendToFile(`Rotten Tomatoes Rating: ${data.Ratings[1].Value}`);
                console.log(`Country Produced: ${data.Country}`);
                appendToFile(`Country Produced: ${data.Country}`);
                console.log(`Language: ${data.Language}`);
                appendToFile(`Language: ${data.Language}`);
                console.log(`Plot: ${data.Plot}`);
                appendToFile(`Plot: ${data.Plot}`);
                console.log(`Actors: ${data.Actors}`);
                appendToFile(`Actors: ${data.Actors}`);
                console.log(chalk.blue.bold(`-------------------------------------`));
                appendToFile(`-------------------------------------`);
            })
            .catch((err) => console.log(err));
    // If the command is 'do-what-it-says' then read the random.txt and execute a random command:string pair
    } else if (command == `do-what-it-says`) {
        fs.readFile(`random.txt`, `utf-8`, (err, data) => {
            if (err) throw err;
            function grabCommand() {
                let index = Math.floor(Math.random()* 6);
                if (index % 2 == 0) {
                    let dataArray = data.split(`,`);
                    command = dataArray[index];
                    string = dataArray[(index+1)];
                    runCommand(command, string);
                } else {
                    grabCommand()
                }
            }
            grabCommand();
        })
    }
}
