import consts from '../consts';
import Utils from '../Utils'

export const fetchPlaylistBegin = () => ({
    type: consts.FETCH_PLAYLIST_BEGIN
});

export const fetchPlaylistSuccess = playlistData => ({
    type: consts.SET_PLAYLIST_DATA,
    payload: { playlistData }
});
  
export const fetchPlaylistFailure = error => ({
    type: consts.FETCH_PLAYLIST_FAILURE,
    payload: { error }
});

export function getPlaylist(){
    return dispatch => {
        dispatch(fetchPlaylistBegin());
        return fetch('https://jewel998.github.io/playlist/playlist.json', {
                credentials: 'omit',
                method: "GET"
            })
            .then(Utils.handleErrors)
            .then(res => res.json())
            .then(json => {
                dispatch(fetchPlaylistSuccess(json.songs));
            })
            .catch(error => {
                dispatch(fetchPlaylistFailure(error));
            });
    };
}
export const parseSongData = data => ({
    type: consts.SET_SONG_DATA,
    payload: {
        song_name: data.song,
        artist_name: data.author,
        song_album_art: data.albumart,
        song_lyrics_link: data.json,
        song_audio_link: data.audio
    }
})
export function currentSongData(data){
    return dispatch => {
        dispatch(parseSongData(data));
    }
}

export const setLyricsData = song_lyrics_data => ({
    type: consts.SET_LYRICS_DATA,
    payload: { song_lyrics_data }
});

export function getLyricsData(data){
    return dispatch => {
        dispatch(setLyricsData([{line:'Loading', time: 0}]));
        return fetch(data, {
                credentials: 'omit',
                method: "GET"
            })
            .then(Utils.handleErrors)
            .then(res => res.json())
            .then(json => {
                dispatch(setLyricsData(json.lyrics));
            })
            .catch(error => {
                dispatch(setLyricsData([{'line':'Unable to load lyrics'}]));
            });
    };
}
export const setCurrentSongIndex = index => ({
    type: consts.SET_CURRENT_SONG_INDEX,
    payload: {
        currentSongIndex: index
    }
})
export const setAudioData = audioData => ({
    type: consts.SET_AUDIO_DATA,
    payload: { audioData }
})

export const setPlayState = play => ({
    type: consts.SET_PLAY_STATE,
    payload: { play }
})
export const showPlaylist = showPlaylist => ({
    type: consts.SHOW_PLAYLIST,
    payload: { showPlaylist }
})