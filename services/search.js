const axios = require('axios');

module.exports.searchService = (selectedGame, searchedId) => {
    // return {"game" : selectedGame, "id" : searchedId};
    switch (selectedGame) {
        case "메이플스토리":
            return getMapleStoryInfo(searchedId);
        case "리그오브레전드":
            //return summonerInfo, summonerLeagueInfo, summonerMatchesInfo, matchDetailInfo, matchRecentInfo
            return getLeagueOfLegendsInfo(searchedId);
        case "전략적 팀 전투":
            return getTeamFightTacticsInfo(searchedId);
    }
};

function getMapleStoryInfo(searchedId) {

}

//League Of Legends
async function getLeagueOfLegendsInfo(searchedId) {
    const encodedSummonerName = encodeURIComponent(searchedId);
    const apiDefault = {
        'region': "https://kr.api.riotgames.com",
        'regionAsia': "https://asia.api.riotgames.com",
        'key': "RGAPI-a95638a4-92ec-40fc-b1a7-fa6cabc87bce"
    }
    const { region, regionAsia, key } = apiDefault;
    //summonerInfo
    const summonerInfoURL = region + `/lol/summoner/v4/summoners/by-name/${encodedSummonerName}?api_key=${key}`;
    const summonerInfo = await getSummonerInfo(summonerInfoURL);
    const { id, accountId, puuid } = summonerInfo;    

    //summonerLeagueInfo
    const summonerLeagueInfoURL = region + `/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`
    const summonerLeagueInfo = await getSummonerLeague5x5Info(summonerLeagueInfoURL);

    //summonerMatchesInfo
    const summonerMatchesInfoURL = regionAsia + `/lol/match/v5/matches/by-puuid/${puuid}/ids?count=100&api_key=${key}`
    const summonerMatchesInfo = await getSummonerMatchesInfo(summonerMatchesInfoURL);

    //summonerMatchesDetailInfo
    let matchDetailInfo = [];
    let matchRecentInfo = [];
    let size = 0;
    for(let i = 0; i < summonerMatchesInfo.length; i ++) {
        if(size == 20) break;
        const summonerMatchesDetailInfoURL = regionAsia + `/lol/match/v5/matches/${summonerMatchesInfo[i]}?api_key=${key}`;
        const detailInfo = await getMatchDetailInfo(summonerMatchesDetailInfoURL, searchedId);

        //matchDetailData
        matchDetailInfo.push(detailInfo);
        size++;
        
        //recentMatchData
        //duplicated check
        if (detailInfo) {
            const detailInfoChampionName = detailInfo.championName;    
            const existingChampionIndex = matchRecentInfo.findIndex(info => info.championName === detailInfoChampionName);
    
            if (existingChampionIndex !== -1) {
                matchRecentInfo[existingChampionIndex].data.total++;
                matchRecentInfo[existingChampionIndex].data.win += detailInfo.win ? 1 : 0;
                matchRecentInfo[existingChampionIndex].data.kills += detailInfo.kills;
                matchRecentInfo[existingChampionIndex].data.deaths += detailInfo.deaths;
                matchRecentInfo[existingChampionIndex].data.assists += detailInfo.assists;
            } else {
                matchRecentInfo.push({
                    championName: detailInfoChampionName,
                    data: {
                        total: 1,
                        win: detailInfo.win ? 1 : 0,
                        kills: detailInfo.kills,
                        deaths: detailInfo.deaths,
                        assists: detailInfo.assists
                    }
                });
            }
        }
    }
    matchRecentInfo.sort((a, b) => b.data.total - a.data.total);
    return { summonerInfo, summonerLeagueInfo, summonerMatchesInfo, matchDetailInfo, matchRecentInfo };
}

async function getSummonerInfo(URL) {
    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            response.data.iconURL = `http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${response.data.profileIconId}.png`;
            return response.data;
        }
    } catch (error) {
        console.log("getSummonerInfoError");
        return null;
    }
}

//솔로랭크 정보만 파싱.
async function getSummonerLeague5x5Info(URL) {
    //전체 랭크 정보
    const summonerLeague5x5Data = await getSummonerLeagueInfo(URL);

    for(let i = 0; i < summonerLeague5x5Data.length; i ++) {
        if(summonerLeague5x5Data[i].queueType === "RANKED_SOLO_5x5") {
            return summonerLeague5x5Data[i];
        }
    }
    return null;
}

//유저의 전체 랭크 정보 파싱( -> getSummonerLeague5x5Info로 전달)
async function getSummonerLeagueInfo(URL) {   
    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log("getSummonerLeagueInfoError");
        return null;
    }
}

//소환사의 게임 정보(ID값 리턴)
async function getSummonerMatchesInfo(URL) {
    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log("getSummonerMatchesInfoError");
        return null;
    }
}

//game ID 마다 view를 위한 game detail info 파싱 및 return
async function getMatchDetailInfo(URL, searchedId) {
    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            for(let i = 0; i < response.data.info.participants.length; i ++) {
                const currentData = response.data.info.participants[i];
                const summonerName = currentData.summonerName;
                //검색한 ID와 일치한 데이터 파싱
                if(summonerName.toLowerCase() === searchedId.toLowerCase()) {
                    const { gameStartTimestamp, gameEndTimestamp, gameVersion, gameMode, gameType } = response.data.info;
                    const { kills, deaths, assists, championName, timePlayed, win, totalMinionsKilled } = currentData;
                    const { kda } = currentData.challenges;

                    const versionSegments = gameVersion.split(".");
                    const versionURLFormat = versionSegments[0] + "." + versionSegments[1] + ".1"
                    const imgURL = `https://ddragon.leagueoflegends.com/cdn/${versionURLFormat}/img/champion/${championName}.png`;                    
                    const minionsKilledPerMinutes = (totalMinionsKilled / (timePlayed / 60)).toFixed(1);
                    const playTime = Math.floor(timePlayed / 60) + "분" + timePlayed % 60 + "초";
                    const playDate = calculateDate(gameEndTimestamp);

                    /**
                     * view params
                     * 챔피언 사진
                     * 승패
                     * 게임타입(아직 어떤 format들이 있는지 모름)
                     * kda(+ 킬관여)
                     * 분당cs(+ 총cs)
                     * 게임시간(+ 몇일 전인지)
                     */
                    const matchDetailInfo = {
                        imgURL, championName,
                        win,
                        gameType,
                        kda, kills, deaths, assists,
                        minionsKilledPerMinutes, totalMinionsKilled,
                        playTime, playDate                        
                    };

                    return matchDetailInfo;                    
                };                
            }
            return null;
        }
    } catch (error) {
        console.log("getMatchDetailInfoError");
        return null;
    }
}

//unix timestamp를 일 단위까지만 비교하여 몇 일 전 게임인지 리턴
function calculateDate(unixTimeStamp) {
    const changeUnixToDate = new Date(unixTimeStamp);
    const curDate = new Date();
    const daysAgoCalculate = (curDate - changeUnixToDate) / (1000 * 60 * 60 * 24);
    return Math.floor(daysAgoCalculate) + "일전";
}
//League Of Legends finished

function getTeamFightTacticsInfo(searchedId) {

}