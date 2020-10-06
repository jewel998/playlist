import consts from '../consts';

const initialState = {
    playlistData: undefined,
    loading: false,
    error: null,
    currentSongIndex: undefined,
    audioData: undefined,
    showPlaylist: false
}

export default function setSongData(state=initialState,action){
    switch(action.type){
        case consts.FETCH_PLAYLIST_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            }
        case consts.FETCH_PLAYLIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }
        case consts.SET_PLAYLIST_DATA:
            return {
                ...state,
                loading:false,
                playlistData: action.payload.playlistData,
                error: null
            }
        case consts.SET_CURRENT_SONG_INDEX:
            return {
                ...state,
                currentSongIndex: action.payload.currentSongIndex
            }
        case consts.SET_AUDIO_DATA:
            return {
                ...state,
                audioData: action.payload.audioData
            }
        case consts.SHOW_PLAYLIST:
            return {
                ...state,
                showPlaylist: action.payload.showPlaylist
            }
        default:
            return {
                ...state
            }
    }
}