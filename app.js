require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

// require spotify-web-api-node package here:

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
hbs.registerPartials(`${__dirname}/views/partials`)

// setting the spotify-api goes here:

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  )
// Our routes go here:

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  const { artist } = req.query

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artist = data.body.artists.items
      res.render('artist-search-results', { artist })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})

app.get('/albums/:artist_id', (req, res) => {
  const { artist_id } = req.params

  spotifyApi
    .getArtistAlbums(artist_id)
    .then((data) => {
      const albums = data.body.items

      res.render('albums', { albums })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})

app.get('/albums/tracks/:album_id', (req, res) => {
  const { album_id } = req.params

  spotifyApi
    .getAlbumTracks(album_id)
    .then((data) => {
      const tracks = data.body.items

      res.render('tracks', { tracks })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
)
