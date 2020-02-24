import React from "react";
import "bulma/css/bulma.min.css";
import Songs from "./components/Songs";
import Artists from "./components/Artists";
import axios from "axios";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      songs: [],
      loading: false,
      text: ""
    };
  }
  //changes the state of the textbox when the user types
  handleTextbox(event) {
    this.setState({ text: event.target.value });
  }

  // given a list of artists create and add new Artists component instances
  pushNewArtists(artistList) {
    const artists = artistList;
    let artistRows = [];
    artists.forEach(artist => {
      const currentArtist = <Artists info={artist} />;
      artistRows.push(currentArtist);
    });
    this.setState({ artists: artistRows });
  }

  // given a list of songs create and add new Song component instances
  pushNewSongs(songList) {
    const songs = songList;
    let songRows = [];

    songs.forEach(song => {
      const currentSong = <Songs info={song} />;
      songRows.push(currentSong);
    });
    this.setState({ songs: songRows });
  }

  // handles the search
  async submit() {
    if (this.state.text === "") {
      alert("please enter an artist or song");
      return;
    }

    this.setState({ artists: [] });
    this.setState({ songs: [] });
    this.setState({ loading: true });

    await axios
      .get(
        "https://6jgvj675p5.execute-api.us-west-2.amazonaws.com/production",
        {
          params: {
            q: this.state.text
          }
        }
      )
      .then(res => {
        const numberOfArtists = res.data.artists.total;
        const numberOfSongs = res.data.tracks.total;

        if (numberOfArtists == 0 && numberOfSongs == 0) {
          alert("No results");
        }

        console.log(res);
        this.pushNewArtists(res.data.artists.items);
        this.pushNewSongs(res.data.tracks.items);
      });

    this.setState({ loading: false });
  }

  //determines what button should be displayed normal or loading
  getButton() {
    if (this.state.loading) {
      return <button class="button is-info is-loading">Search</button>;
    } else {
      return (
        <a class="button is-info" onClick={this.submit.bind(this)}>
          Search
        </a>
      );
    }
  }

  //Checks the local storage for songs that have been favourited
  checkFavouriteArtists() {
    let artistsInStorage = localStorage.getItem("Artists");
    if (artistsInStorage) {
      artistsInStorage = JSON.parse(artistsInStorage);
      this.pushNewArtists(artistsInStorage);
    }
  }

  //Checks the local storage for songs that have been favourited
  checkFavouriteSongs() {
    let songsInStorage = localStorage.getItem("Songs");
    if (songsInStorage) {
      songsInStorage = JSON.parse(songsInStorage);
      this.pushNewSongs(songsInStorage);
    }
  }

  //when App is mounted check if there are any artists/songs that have been favourited
  componentDidMount() {
    this.checkFavouriteArtists();
    this.checkFavouriteSongs();
  }

  render() {
    let button = this.getButton();
    return (
      <section class="section">
        <div>
          <h1 class="title is-0">Music Search</h1>
          <div class="field has-addons">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter an Arists or a Song"
                value={this.state.text}
                onChange={this.handleTextbox.bind(this)}
              />
            </div>
            <div class="control">{button}</div>
          </div>
          <section class="section">
            <div class="is-medium" />
          </section>

          <div class="columns is-6">
            <div class="column">
              <h1 class="title is-5">Songs</h1> {this.state.songs}
            </div>
            <div class="column">
              <h1 class="title is-5">Artists</h1> {this.state.artists}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
