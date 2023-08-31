const services = require('../services/search');

module.exports.getSearchedInfo = async (req, res) => {
    const selectedGame = req.query.game;
    const searchedId = req.query.id;
    //return summonerInfo, summonerLeagueInfo, summonerMatchesInfo, matchDetailInfo, matchRecentInfo
    try {
        const userInfo = await services.searchService(selectedGame, searchedId);
        return userInfo;
    } catch (error) {
        console.error(error);
        res.status(500).json({error : "search Controller error occured"});
    }    
};