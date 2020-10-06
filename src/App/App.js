import React, { Component } from 'react';
import './App.scss';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MusicPlayer from '../views/Music Player';
import { getPlaylist } from '../actions';
import Playlist from '../components/Playlist';

class App extends Component {
  constructor(props){
    super(props);
    let { playlistData, loading, getPlaylist } = props;
    if(playlistData === undefined && loading === false){
      getPlaylist();
    }
  }
  render() {
    let { song_album_art } = this.props;
    return (
      <Router>
        <img className="album-art-background" alt="album-art-background" src={song_album_art}/>
        <Header/>
        <Switch>
          <Route exact path="/" component={() => <MusicPlayer/>}/>
        </Switch>
        <Playlist/>
        <Footer/>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  playlistData: state.playlist.playlistData,
  loading: state.playlist.loading,
  song_album_art: state.song.song_album_art
});

const mapDispatchToProps = (dispatch) => {
  return {
    getPlaylist: () => dispatch(getPlaylist()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);