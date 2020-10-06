import React, { Component } from 'react';
import './_style.scss';
import { connect } from 'react-redux';
import { currentSongData, getLyricsData, setCurrentSongIndex } from '../../actions';

class MusicPlayer extends Component{
    constructor(props){
        super(props);
        let { playlistData, setSongData, setCurrentSongIndex, song_name } = props;
        if(playlistData !== undefined && playlistData.length > 0 && song_name === undefined){
            let index = 0;
            setCurrentSongIndex(index)
            setSongData(playlistData[index]);
        }
        this.state = {
            timer: undefined
        }
    }
    componentDidMount(){
        let audio = this.props.audioData;
        if(audio === undefined) return;
        else if(this.props.song_lyrics_link !== undefined){
            audio.addEventListener('playing',this.setIntervalFunction);
            audio.addEventListener('pause',this.clearIntervalFunction);
            console.log("Lyrics Updated!");
            this.props.getLyricsData(this.props.song_lyrics_link);
        }
    }
    componentWillUnmount(){
        let audio = this.props.audioData;
        if(audio === undefined) return;
        audio.removeEventListener('playing',this.setIntervalFunction);
        audio.removeEventListener('pause',this.clearIntervalFunction);
    }
    setIntervalFunction = () => {
        console.log("Lyrics Synchronization is resumed");
        this.setState({
            timer: setInterval(this.updateLyricsOnTop,1000)
        });
    }
    clearIntervalFunction = () => {
        console.log("Lyrics Synchronization is paused");
        clearInterval(this.state.timer);
    }
    centerize() {
        if(document.querySelectorAll(".on-top").length === 0) return;
        let onTopElement = document.querySelector(".on-top");
        var a = onTopElement.getBoundingClientRect().height;
        var c = document.querySelector("#lyrics").getBoundingClientRect().height;
        var d = onTopElement.getBoundingClientRect().top - onTopElement.parentNode.getBoundingClientRect().top;
        let factor = 1/3;
        if(c < 200){
            factor = 1/50;
        }
        var e = d + (a/2) - (c*factor);
        if(e < 0) e = 0;
        document.querySelector("#lyrics").scrollTo(0,e);
    }
    updateLyricsOnTop = () => {
        let lyrics_elements = document.querySelectorAll("#lyrics-content > h2");
        let totalOnTop = document.querySelectorAll("#lyrics-content > h2.on-top");
        let set_once = true;
        try{
            lyrics_elements.forEach((element,index) => {
                if(index === 0){
                    let thisTime = parseInt(element.getAttribute("data-time"));
                    let currentTime = parseInt(this.props.audioData.currentTime*1000);
                    if(currentTime < thisTime){
                        if(totalOnTop.length > 0){
                            totalOnTop.forEach(e => {
                                e.classList.remove("on-top");
                            });
                        }
                        throw new Error("No need to iterate further");
                    }
                }
                if(element.classList.contains("on-top")){
                    element.classList.remove("on-top");
                }
                if((index+1)<lyrics_elements.length && set_once === true){
                    let nextTime = parseInt(lyrics_elements[index+1].getAttribute("data-time"));
                    let currentTime = parseInt(this.props.audioData.currentTime*1000);
                    if(currentTime<nextTime){
                        if(!element.classList.contains("on-top")){
                            element.classList.add("on-top");
                            this.centerize();
                            set_once = false;
                            return;
                        }
                    }
                }
                else if(element !== undefined && (index+1) === lyrics_elements.length){
                    let nextTime = parseInt(lyrics_elements[index].getAttribute("data-time"));
                    let currentTime = parseInt(this.props.audioData.currentTime*1000);
                    if(currentTime>=nextTime){
                        if(!element.classList.contains("on-top")){
                            element.classList.add("on-top");
                        }
                    }
                }
            });
        }
        catch(e){
            return;
        }
    }
    render(){
        let { song_name, artist_name, song_lyrics_data } = this.props;
        let lyrics_content = [];

        if(song_lyrics_data !== undefined && song_lyrics_data.length > 0){
            lyrics_content = [];
            song_lyrics_data.forEach((element,index) => {
                lyrics_content.push(<h2 key={index} data-time={element.time}>{element.line}</h2>);
            });
        }
        return (
            <>
                <section>
                    <div id="lyrics">
                        <h2 className="song-name">{song_name}</h2>
                        <h4 className="artist-name">{artist_name}</h4>
                        <div id="lyrics-content">
                            {lyrics_content}
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
const mapStateToProps = state => ({
    playlistData: state.playlist.playlistData,
    song_name: state.song.song_name,
    artist_name: state.song.artist_name,
    song_lyrics_link: state.song.song_lyrics_link,
    song_lyrics_data: state.song.song_lyrics_data,
    audioData: state.playlist.audioData
})
const mapDispatchToProps = (dispatch) => ({
    setSongData: data => dispatch(currentSongData(data)),
    getLyricsData: data => dispatch(getLyricsData(data)),
    setCurrentSongIndex: data => dispatch(setCurrentSongIndex(data))
})
export default connect(mapStateToProps,mapDispatchToProps)(MusicPlayer);