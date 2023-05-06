import axios from "axios";

const STATISTICS_URL = process.env.REACT_APP_BACKEND_PATH + "/api/statistics/overall";

export function getStatisticsApi(setTrackCounter, setPlaylistCounter, setAnalysisCounter) {
    axios.get(STATISTICS_URL)
        .then(result => {
            setTrackCounter(result.data.track_counter)
            setPlaylistCounter(result.data.playlist_counter)
            setAnalysisCounter(result.data.analysis_counter)
        })
        .catch(error => {
            console.debug("Error while retrieving statistics " + error)
        });
}

// Use for artists and albums
export function orderAndSubsetMostCommonData(mostCommonsArray, startIndex, endIndex) {
    // Sort in descending order
    mostCommonsArray.sort((a, b) => (parseInt(b["count"]) - parseInt(a["count"])))
    // Get subset to transform
    return mostCommonsArray.slice(startIndex, endIndex)
}

export function transformMostCommonArtists(mostCommonsArtists, startIndex, endIndex) {
    const subset = orderAndSubsetMostCommonData(mostCommonsArtists, startIndex, endIndex)
    const transformedData = []
    subset.forEach(entry => {
        transformedData.push({ "value": entry["count"], "id": entry["name"], "label": entry["name"] })
    });
    return transformedData
}

export function transformMostCommonAlbums(mostCommonsAlbums, startIndex, endIndex) {
    const subset = orderAndSubsetMostCommonData(mostCommonsAlbums, startIndex, endIndex)
    const transformedData = []
    subset.forEach(entry => {
        transformedData.push({ "value": entry["count"], "id": entry["name"], "label": entry["name"] })
    });
    return transformedData
}

export function transformTrackerData(likedTracksTracker, id) {
    const transformedData = []
    likedTracksTracker.forEach(entry => {
        var date = new Date(entry["created"]["$date"]).toISOString().split('T')[0]
        transformedData.push({ "x": date, "y": entry["count"] })
    })
    return [{ "id": id, "data": transformedData }]
}

export function transformAudioFeatureData(audioFeatures) {
    const transformedData = [
        {
            "feature": "Acousticness",
            "Average": audioFeatures["average_acousticness"]
        },
        {
            "feature": "Danceability",
            "Average": audioFeatures["average_danceability"]
        },
        {
            "feature": "Energy",
            "Average": audioFeatures["average_energy"]
        },
        {
            "feature": "Instrumentalness",
            "Average": audioFeatures["average_instrumentalness"]
        },
        {
            "feature": "Liveness",
            "Average": audioFeatures["average_liveness"]
        },
        // {
        //     "feature": "Loudness",
        //     "Average": audioFeatures["average_loudness"]
        // },
        {
            "feature": "Speechiness",
            "Average": audioFeatures["average_speechiness"]
        },
        // {
        //     "feature": "Tempo",
        //     "Average": audioFeatures["average_tempo"]
        // },
    ]
    return transformedData
}