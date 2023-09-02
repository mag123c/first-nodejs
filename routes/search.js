const express = require('express');
const router = express.Router();
const searchControllers = require('../controllers/search');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/search', (req, res) => {
    const query = req.query;
    res.render('search', { query });
});

router.post('/search', async (req, res) => {
    console.log("routes");
    try {        
        //return summonerInfo, summonerLeagueInfo, matchDetailInfo, matchRecentInfo
        const searchData = await searchControllers.getSearchedInfo(req);
        res.json({ searchData });
    } catch (error) {
        console.error(error);
        res.status(500).send("search routes error");
    }
});

module.exports = router;