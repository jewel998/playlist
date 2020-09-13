import React, { Component } from 'react';
import './_style.scss';
import { connect } from 'react-redux';
import { currentSongData, setAudioData, setCurrentSongIndex, setPlayState, showPlaylist } from '../../actions';

class Footer extends Component{
    constructor(props){
        super(props);
        let audio = new Audio();
        props.setAudioData(audio);
        this.state = {
            totalTime: undefined,
            currentTime: "-:--",
            audio: audio,
            timer: undefined,
            percent: 0,
            src: undefined,
            play: false,
            seek: false,
            repeat: false,
            shuffle: false
        }
    }
    componentDidMount(){
        let audio = this.state.audio;
        audio.addEventListener('playing',(e) => {
            console.log("Audio is Playing");
            this.setState({
                timer: setInterval(this.setCurrentTime,1000)
            });
        });
        audio.addEventListener('pause',(e) => {
            console.log("Audio is Paused");
            clearInterval(this.state.timer);
        });
        audio.addEventListener('loadeddata',(e) => {
            console.log("Total Time is set!");
            this.setTotalTime();
        });
        audio.addEventListener('ended',(e) => {
            console.log("Song ended!");
            this.nextSong();
        });
        window.addEventListener('mouseup', (e) => {
            window.removeEventListener('mousemove', this.handleDrag);
            if(this.state.play)
                this.state.audio.play();
            this.setState({
                audio: audio,
                seek: false
            })
        });
        window.addEventListener('touchend', (e) => {
            window.removeEventListener('touchmove', this.handleDrag);
            if(this.state.play)
                this.state.audio.play();
            this.setState({
                audio: audio,
                seek: false
            })
        });
        window.addEventListener('keyup',this.bindKeysHandler);
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.song_audio_link !== this.props.song_audio_link){
            console.log("Audio is Changed");
            let audio = this.state.audio;
            audio.src = this.props.song_audio_link;
            if(this.state.play){ audio.play(); }
            this.setState({
                totalTime: "-:--",
                currentTime: "0:00",
                percent: 0,
                src: this.props.song_audio_link
            });
        }
        if(this.state.play !== prevState.play){
            this.props.setPlayState(this.state.play);
        }
        else if(this.state.play === prevState.play && this.state.play !== this.props.play){
            this.togglePlay();
        }
    }
    handleTouchDrag = (e) => {
        let time,totalTime = this.state.audio.duration, width, offsetX;
        let audio = this.state.audio;
        width = document.querySelector('#progress-bar').clientWidth;
        offsetX = document.querySelector('#progress-bar').getBoundingClientRect().left;
        var percent = parseInt(e.touches[0].clientX-offsetX)/parseInt(width)*100;
        time = parseInt(totalTime * (percent/100));
        if(percent > 100) percent = 100;
        document.querySelector('#progress').style.width = percent + "%";
        if(!audio.paused)
            audio.pause();
        if(time >= totalTime)
            audio.currentTime = totalTime-1;
        else
            audio.currentTime = time;
        this.setState({
            audio: audio,
            seek: true
        })
    }
    handleDrag = (e) => {
        let time,totalTime = this.state.audio.duration, width, offsetX;
        let audio = this.state.audio;
        width = document.querySelector('#progress-bar').clientWidth;
        offsetX = document.querySelector('#progress-bar').getBoundingClientRect().left;
        var percent = parseInt(e.clientX-offsetX)/parseInt(width)*100;
        time = parseInt(totalTime * (percent/100));
        if(percent > 100) percent = 100;
        document.querySelector('#progress').style.width = percent + "%";
        if(!audio.paused)
            audio.pause();
        if(time >= totalTime)
            audio.currentTime = totalTime-1;
        else
            audio.currentTime = time;
        this.setState({
            audio: audio,
            seek: true
        })
    }
    togglePlay = () => {
        let e = document.querySelector('#menu #play');
        if(e.children[0].classList.contains("fa-play")){
            e.children[0].classList.remove("fa-play");
            e.children[0].classList.add("fa-pause");
            this.state.audio.play();
            this.setState({
                play: true
            });
        }
        else{
            e.children[0].classList.remove("fa-pause");
            e.children[0].classList.add("fa-play");
            this.state.audio.pause();
            this.setState({
                play: false
            });
        }
    }
    bindKeysHandler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode === 32) {
            this.togglePlay();
        }
        else if(keycode === 82) {
            this.setState({repeat:!this.state.repeat});
        }
        else if(keycode === 83) {
            this.setState({shuffle:!this.state.shuffle});
        }
        else if(keycode === 78) {
            this.nextSong();
        }
        else if(keycode === 80) {
            this.prevSong();
        }
        else if(keycode === 27) {
            this.togglePlaylist();
        }
        else if(keycode === 39) {
            let audio = this.state.audio;
            let addedTime = ((audio.currentTime * 1000) + 5000)/1000;
            if(addedTime >= audio.duration){
                audio.currentTime = ((audio.duration*1000) - 1000) / 1000;
            }
            else{
                audio.currentTime = addedTime;
            }
            this.setState({ audio: audio });
        }
        else if(keycode === 37) {
            let audio = this.state.audio;
            let addedTime = ((audio.currentTime * 1000) - 5000)/1000;
            if(addedTime <= 0){
                audio.currentTime = 0;
            }
            else{
                audio.currentTime = addedTime;
            }
            this.setState({ audio: audio });
        }
    }
    togglePlaylist = () => {
        let { setShowPlaylist, showPlaylistBool } = this.props;
        setShowPlaylist(!showPlaylistBool);
    }
    parseTime = (time) => {
        let minutes = parseInt(time/60000);
        var seconds = parseInt((time%60000)/1000);
        if(seconds < 10){ seconds = `0${seconds}`; }
        return `${minutes}:${seconds}`;
    }
    setTotalTime = () => {
        this.setState({
            totalTime: this.parseTime(parseInt(this.state.audio.duration*1000))
        });
        this.state.audio.removeEventListener('loadeddata',(e) => {
            console.log("Total Time is set!");
            this.setTotalTime();
        });
    }
    setCurrentTime = () => {
        let { audio } = this.state;
        this.setState({
            currentTime: this.parseTime(parseInt(audio.currentTime*1000)),
            percent: (audio.currentTime/audio.duration)*100
        });
    }
    prevSong = () => {
        let { playlistData, currentSongIndex, setCurrentSongIndex, setSongData } = this.props;
        if(playlistData !== undefined && playlistData.length > 0){
            let index = ((currentSongIndex-1+playlistData.length)%playlistData.length);
            setCurrentSongIndex(index)
            setSongData(playlistData[index]);
        }
    }
    getNextNum = (shuffle,except) => {
        while(shuffle){
            let val = parseInt(Math.random()*100);
            if((val%except) !== 0){
                return val;
            }
        }
        return 1;
    }
    nextSong = () => {
        let { playlistData, currentSongIndex, setCurrentSongIndex, setSongData } = this.props;
        let { shuffle, repeat } = this.state;
        if(playlistData !== undefined && playlistData.length > 0){
            let next = this.getNextNum(shuffle, playlistData.length);
            let index = ((currentSongIndex+next)%playlistData.length);
            if((currentSongIndex+1) === playlistData.length && repeat === false){
                this.setState({
                    play:false
                });
            }
            setCurrentSongIndex(index)
            setSongData(playlistData[index]);
        }
    }
    render(){
        let { totalTime, currentTime, percent, repeat, shuffle } = this.state;
        return (
            <footer>
                <div id="player">
                    <div id="bar" className="flex vrtlCenter hrtlCenter">
                        <div id="currentTime">{currentTime}</div>
                        <div id="progress-bar" onTouchStart={
                            (e) => {
                                e.stopPropagation();
                                this.handleTouchDrag(e);
                                window.addEventListener('touchmove', this.handleTouchDrag)
                                }
                            } onMouseDown={
                            (e) => {
                                e.stopPropagation();
                                this.handleDrag(e);
                                window.addEventListener('mousemove', this.handleDrag)
                                }
                            }>
                            <div id="progress" style={{width: `${percent}%`}}>
                                <i id="progressButton" className="fa fa-circle" onTouchStart={
                                    (e) => {
                                        e.stopPropagation();
                                        window.addEventListener('touchmove', this.handleTouchDrag)
                                        }
                                    } onMouseDown={
                                    (e) => {
                                        e.stopPropagation();
                                        window.addEventListener('mousemove', this.handleDrag)
                                        }
                                    }></i>
                            </div>
                        </div>
                        <div id="totalTime">{(totalTime === undefined)?currentTime:totalTime}</div>
                    </div>
                    <div id="menu">
                        <button id="repeat" className={(!repeat)?`off`:``} onClick={(e)=>this.setState({repeat:!repeat})}><i className="fa fa-repeat"></i></button>
                        <button id="prev" onClick={this.prevSong}><i className="fa fa-step-backward"></i></button>
                        <button id="play" onClick={(e) => this.togglePlay()}><i className="fa fa-play"></i></button>
                        <button id="next" onClick={this.nextSong}><i className="fa fa-step-forward"></i></button>
                        <button id="shuffle" className={(!shuffle)?`off`:``} onClick={(e)=>this.setState({shuffle:!shuffle})}><i className="fa fa-random"></i></button>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = state => ({
    song_audio_link: state.song.song_audio_link,
    currentSongIndex: state.playlist.currentSongIndex,
    playlistData: state.playlist.playlistData,
    play: state.song.play,
    showPlaylistBool: state.playlist.showPlaylist
})
const mapDispatchToProps = (dispatch) => ({
    setSongData: data => dispatch(currentSongData(data)),
    setCurrentSongIndex: data => dispatch(setCurrentSongIndex(data)),
    setAudioData: data => dispatch(setAudioData(data)),
    setPlayState: data => dispatch(setPlayState(data)),
    setShowPlaylist: data => dispatch(showPlaylist(data))
})

export default connect(mapStateToProps,mapDispatchToProps)(Footer);