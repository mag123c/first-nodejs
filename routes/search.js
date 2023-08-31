const express = require('express');
const router = express.Router();
const searchControllers = require('../controllers/search');

router.get('/search', async (req, res) => {
    try {
        //return summonerInfo, summonerLeagueInfo, matchDetailInfo, matchRecentInfo
        const searchData = await searchControllers.getSearchedInfo(req);
        console.log(searchData.matchRecentInfo);
        res.render('search', { searchData });
    } catch (error) {
        console.error(error);
        res.status(500).send("search routes error");
    }
});
module.exports = router;