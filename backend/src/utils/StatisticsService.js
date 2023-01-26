import axios from "axios";

const STATISTICS_URL = process.env.REACT_APP_BACKEND_PATH + "/api/statistics/overall";

export function getStatisticsApi(setTrackCounter, setPlaylistCounter) {
  axios.get(STATISTICS_URL)
    .then(result => {
        setTrackCounter(result.data.track_counter)
        setPlaylistCounter(result.data.playlist_counter)
    })
    .catch(error => {
        console.debug("Error while retrieving statistics " + error)
    });
}
