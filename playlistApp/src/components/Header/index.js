import React, { Component } from 'react';
import './_style.scss';
import { connect } from 'react-redux';
import { showPlaylist } from '../../actions';

class Header extends Component{
    togglePlaylist = () => {
        let { setShowPlaylist, showPlaylistBool } = this.props;
        setShowPlaylist(!showPlaylistBool);
    }
    render(){
        let { song_name, artist_name, showPlaylistBool } = this.props;
        let showPlaylistBoolClass = (showPlaylistBool)?"hide": "";
        return (
            <header>
                <div id="top-bar" className="flex vrtlCenter">
                    <button id="back" onClick={this.togglePlaylist}><i className="fa fa-arrow-left"></i></button>
                    <div id="about-song" className={`${showPlaylistBoolClass}`}>
                        <h2 className="song-name">{song_name}</h2>
                        <h4 className="artist-name low-text-opacity">{artist_name}</h4></div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    song_name: state.song.song_name,
    artist_name: state.song.artist_name,
    showPlaylistBool: state.playlist.showPlaylist
})
const mapDispatchToProps = dispatch => ({
    setShowPlaylist: data => dispatch(showPlaylist(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);