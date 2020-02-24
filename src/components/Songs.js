import React from "react";
import "bulma/css/bulma.min.css";
import { faStar as lineStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Songs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggler: true
    };
  }

  // returns an array of artists on the track
  getArtistsFromTrack() {
    let arrayOfArtists = [];
    const artists = this.props.info.artists;

    artists.forEach(artist => {
      if (arrayOfArtists.length !== 0) {
        arrayOfArtists.push(", " + artist.name);
      } else {
        arrayOfArtists.push(artist.name);
      }
    });
    return arrayOfArtists;
  }

  // adds the song to the local storage when favourited by the user
  addToLocalStorage() {
    const songsInStorage = localStorage.getItem("Songs");
    let currentArray = [];
    if (songsInStorage) {
      currentArray = JSON.parse(songsInStorage);
      currentArray.unshift(this.props.info);
      currentArray = Array.from(new Set(currentArray));
      localStorage.setItem("Songs", JSON.stringify(currentArray));
    } else {
      currentArray = [];
      currentArray.unshift(this.props.info);
      localStorage.setItem("Songs", JSON.stringify(currentArray));
    }
  }

  // returns the index of the song in the array
  indexContainingID(currentArray, id) {
    for (let i = 0; i < currentArray.length; i++) {
      if (JSON.stringify(currentArray[i]).includes(id)) {
        return i;
      }
    }
    return -1;
  }

  // removes the song from local storage
  removeFromLocalStorage() {
    const songsInStorage = localStorage.getItem("Songs");
    let currentArray = [];
    if (songsInStorage) {
      currentArray = JSON.parse(songsInStorage);
      const index = this.indexContainingID(currentArray, this.props.info.id);
      if (index > -1) {
        currentArray.splice(index, 1);
      }
    }
    localStorage.removeItem("Songs");
    localStorage.setItem("Songs", JSON.stringify(currentArray));
  }

  // determines if the song should be added or removed from the local storage
  iconClicked() {
    if (this.state.toggler) {
      this.addToLocalStorage();
    } else {
      this.removeFromLocalStorage();
    }
    this.setState({ toggler: !this.state.toggler });
  }

  // checks if the song was favourited before when the component is mounted
  componentDidMount() {
    const SongsInStorage = localStorage.getItem("Songs");
    let currentArray = [];
    if (SongsInStorage) {
      currentArray = JSON.parse(SongsInStorage);
      const index = this.indexContainingID(currentArray, this.props.info.id);
      if (index >= 0) {
        this.setState({ toggler: false });
      }
    }
  }

  // handles the state of the star icon
  getIcon() {
    if (!this.state.toggler) {
      return <FontAwesomeIcon icon={solid} color="#D5E84C" />;
    } else {
      return <FontAwesomeIcon icon={lineStar} />;
    }
  }

  render() {
    let icon = this.getIcon();

    if (this.props.info !== undefined) {
      return (
        <div onClick={() => this.iconClicked()}>
          <label class="checkbox">
            {this.props.info.name} - {this.getArtistsFromTrack()} {icon}
          </label>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Songs;
