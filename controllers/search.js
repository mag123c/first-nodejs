const services = require('../services/search');

module.exports.getSearchedInfo = (req, res) => {
    const selectedGame = req.query.game;
    const searchedId = req.query.id;
    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
    console.log(selectedGame, searchedId);
    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
    const userInfo = services.searchService(selectedGame, searchedId);

    if(userInfo == null) return "로직작성";
    
    else res.json(userInfo);
};