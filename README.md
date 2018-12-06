# Liri Bot
### Liri is a Language Interpretation and Recognition Interface

She'll take a command that you input and what you'd like to search and display information back to you.

This application was built with Node.js

To get started, install the required modules according to the package.json file.

Then you'll need to set up an env file with your Spotify, Bands in Town, and OMDB API Keys.

Afterwards just run liri.js in your terminal.

Once you run the command you'll be presented with a list of choices of what you'd like to search for.

## spotify-this-song
Spotify this song will take in a song name and return the most relevent song in Spotify's database. It will display the track name, artist(s), album name, and a link to preview or listen to the song.

![Liri searching for the song 'Believer'](/assets/LIRIspotify-this-song.gif)

## concert-this
Concert this will take in an artist and search for their concerts with Bands in Town. It will display the Lineup for the event, the date and time of the event, the venue name, venue location, and links to buy regular and VIP tickets if available.

![Liri searching for Ariana Grande concerts](/assets/LIRIconcert-this.gif)

## movie-this
Movie this will take a movie title and search it using the OMDB API. It will then display:
Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country Produced, Language, Plot, and Actors.

![Liri searching for the movie 'Princess Bride'](/assets/LIRImovie-this.gif)

## do-what-it-says
Liri will pick a random command and a matching search term and display it to the user.

![Liri randomly selecting to search for the movie 'Shrek'](/assets/LIRIdo-what-it-says.gif)