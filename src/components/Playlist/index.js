import React, { Component } from 'react'
import { connect } from 'react-redux';
import './_style.scss';
import { currentSongData, setCurrentSongIndex, setPlayState } from '../../actions';

class Playlist extends Component{
    playThisSong(index){
        let { setCurrentSongIndex, setSongData, currentSongIndex, setPlayState, play, playlistData } = this.props;
        if(index !== currentSongIndex && play === false){
            setPlayState(true);
        }
        else if(currentSongIndex === index){
            setPlayState(!play);
        }
        setCurrentSongIndex(index)
        setSongData(playlistData[index]);
    }
    searchSongs = (e) => {
        let query = e.currentTarget.value.toLowerCase().trim();
        document.querySelectorAll('.song-list-row').forEach(element=>{
            if(element.textContent.toLowerCase().includes(query))
                element.style.display = "flex";
            else
                element.style.display = "none";
        });
    }
    render(){
        let { playlistData, song_name, play, showPlaylist } = this.props;
        let showPlaylistClass;
        if(showPlaylist)
            showPlaylistClass = "show";
        else
            showPlaylistClass = "";
        let songs_list = [];
        if(playlistData !== undefined && playlistData.length > 0){
            songs_list = [];
            playlistData.forEach((element,index) => {
                songs_list.push(
                    <div key={index} data-index={index} className="flex vrtlCenter hrtlCenter song-list-row">
                        <div className="album-art">
                            <img alt={element.song} src={element.albumart}/>
                        </div>
                        <div className="song-details">
                            <h2 className="song">{element.song}</h2>
                            <h4 className="artist">{element.author}</h4>
                        </div>
                        <div className="options" onClick={(e) => this.playThisSong(index)}>
                            {(song_name === element.song && play) && (<i className="fa fa-pause"></i>)}
                            {(song_name !== element.song || !play) && (<i className="fa fa-play"></i>)}
                        </div>
                    </div>
                );
            });
        }
        return (
            <div id="playlist" className={`${showPlaylistClass}`}>
                <div id="label">
                    <h1>Playlist</h1>
                    <input id="search" type="text" placeholder="&#xF002; Search from all songs" autoComplete="off" onKeyUp={(e) => {e.stopPropagation(); this.searchSongs(e);}}></input>
                </div>
                <div id="show-box">
                    <div id="show-list">
                        {(songs_list.length > 0) && (
                            <div className="song-list">
                                {songs_list}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    playlistData: state.playlist.playlistData,
    song_name: state.song.song_name,
    currentSongIndex: state.playlist.currentSongIndex,
    play: state.song.play,
    showPlaylist: state.playlist.showPlaylist
});
const mapDispatchToProps = (dispatch) => ({
    setSongData: data => dispatch(currentSongData(data)),
    setCurrentSongIndex: data => dispatch(setCurrentSongIndex(data)),
    setPlayState: data => dispatch(setPlayState(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);