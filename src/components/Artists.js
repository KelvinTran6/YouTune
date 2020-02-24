import React from "react";
import "bulma/css/bulma.min.css";
import { faStar as lineStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solid } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Artists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggler: true
    };
  }

  // adds a favourited artist to the local store
  addToLocalStorage() {
    const artistsInStorage = localStorage.getItem("Artists");
    let currentArray = [];
    if (artistsInStorage) {
      currentArray = JSON.parse(artistsInStorage);
      currentArray.unshift(this.props.info);
      currentArray = Array.from(new Set(currentArray));
      localStorage.setItem("Artists", JSON.stringify(currentArray));
    } else {
      currentArray = [];
      currentArray.unshif(this.props.info);
      localStorage.setItem("Artists", JSON.stringify(currentArray));
    }
  }

  // finds the index of the specificied artist in the array
  indexContainingID(currentArray, id) {
    for (let i = 0; i < currentArray.length; i++) {
      if (JSON.stringify(currentArray[i]).includes(id)) {
        return i;
      }
    }
    return -1;
  }

  // removes and artists from the local storage
  removeFromLocalStorage() {
    const artistsInStorage = localStorage.getItem("Artists");
    let currentArray = [];
    if (artistsInStorage) {
      currentArray = JSON.parse(artistsInStorage);
      const index = this.indexContainingID(currentArray, this.props.info.id);
      if (index > -1) {
        currentArray.splice(index, 1);
      }
    }
    localStorage.removeItem("Artists");
    localStorage.setItem("Artists", JSON.stringify(currentArray));
  }

  // determines if the artists should be added or deleted from the local store
  iconClicked() {
    if (this.state.toggler) {
      this.addToLocalStorage();
    } else {
      this.removeFromLocalStorage();
    }
    this.setState({ toggler: !this.state.toggler });
  }

  // checks if the artists was favourited before when the component is mounted
  componentDidMount() {
    const artistsInStorage = localStorage.getItem("Artists");
    let currentArray = [];
    if (artistsInStorage) {
      currentArray = JSON.parse(artistsInStorage);
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
            {this.props.info.name + " "}
            {icon}
          </label>
        </div>
      );
    }
  }
}
