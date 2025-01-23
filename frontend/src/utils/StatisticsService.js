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

export function transformReleaseYearData(releaseYearData) {
    const transformedData = []
    for (const [key, value] of Object.entries(releaseYearData)) {
        transformedData.push({ "year": key, "value": value })
    }
    return transformedData
}

export function transformAudioFeatureData(audioFeatures) {
    const transformedData = [
        {
            "feature": "Acousticness",
            "Average": audioFeatures[0]["average_score"]
        },
        {
            "feature": "Danceability",
            "Average": audioFeatures[1]["average_score"]
        },
        {
            "feature": "Energy",
            "Average": audioFeatures[2]["average_score"]
        },
        {
            "feature": "Instrumentalness",
            "Average": audioFeatures[3]["average_score"]
        },
        {
            "feature": "Liveness",
            "Average": audioFeatures[4]["average_score"]
        },
        // {
        //     "feature": "Loudness",
        //     "Average": audioFeatures[5]
        // },
        {
            "feature": "Speechiness",
            "Average": audioFeatures[6]["average_score"]
        },
        // {
        //     "feature": "Tempo",
        //     "Average": audioFeatures[7]]
        // },
    ]
    return transformedData
}

export function  makeTrackLengthString(length_data) {
    if (length_data.days !== 0) {
        return (length_data.days + ":" + length_data.hours.toString().padStart(2, "0") + ":" + length_data.minutes.toString().padStart(2, "0") + ":" + length_data.seconds.toString().padStart(2, "0"))
    } else if (length_data.hours !== 0) {
        return (length_data.hours.toString().padStart(2, "0") + ":" + length_data.minutes.toString().padStart(2, "0") + ":" + length_data.seconds.toString().padStart(2, "0"))
    } else {
        return (length_data.minutes.toString().padStart(2, "0") + ":" + length_data.seconds.toString().padStart(2, "0"))
    }
}

export function formatNumberWithCommas(number) {
  if (number !== null && number > 0) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return null
}