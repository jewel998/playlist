import { combineReducers } from 'redux';
import song from './currentSongReducer';
import playlist from './playlistReducer';

const reducer = combineReducers({
    song, playlist
});

export default reducer;