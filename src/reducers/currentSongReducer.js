import consts from '../consts';

const initialState = {
    song_name: undefined,
    artist_name: undefined,
    song_duration: undefined,
    song_album_art: undefined,
    song_audio_link: undefined,
    song_lyrics_data: undefined,
    song_lyrics_link: undefined,
    play: false
}

export default function setSongData(state=initialState,action){
    switch(action.type){
        case consts.SET_SONG_DATA:
            return {
                ...state,
                song_name: action.payload.song_name,
                artist_name: action.payload.artist_name,
                song_album_art: action.payload.song_album_art,
                song_lyrics_link: action.payload.song_lyrics_link,
                song_audio_link: action.payload.song_audio_link
            }
        case consts.SET_SONG_DURATION:
            return {
                ...state,
                song_duration: action.payload.song_duration
            }
        case consts.SET_LYRICS_DATA:
            return {
                ...state,
                song_lyrics_data: action.payload.song_lyrics_data,
            }
        case consts.SET_PLAY_STATE:
            return {
                ...state,
                play: action.payload.play
            }
        default:
            return {
                ...state
            }
    }
}