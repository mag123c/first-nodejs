let loader;
let maincon;

//로드 -> 로딩화면 view -> post요청 -> 파싱 -> view
window.onload = function() {
    loader = $("div.loader");
    maincon = $("div#cover-con");
    _hidePage();

    renderData();
};

function _hidePage() {    
    loader.css("display", "block");
    // maincon.attr("style", "display: none !important");
};

function _showPage() {
    loader.css("display", "none");
    maincon.addClass("show");
};

function renderData() {
    var queryString = window.location.search;
    var queryParams = new URLSearchParams(queryString);
    var game = queryParams.get("game");
    var id = queryParams.get("id");

    $.ajax({
        url: '/search',
        type: 'POST',
        data: {"game" : game, "id" : id},
        success: function(res) {
            if(!res.searchData) {
                document.open();
                document.write(res);
                document.close();
            }
            
            else {
                dataParsing(res);
                _showPage();
            }
        },
        error: function(error){
            console.error(error, "ajax post error");
        }        
    })    
}

//summonerInfo, summonerLeagueInfo, matchDetailInfo, matchRecentInfo
function dataParsing(res) {
    var { summonerInfo, summonerLeagueInfo, matchDetailInfo, matchRecentInfo } = res.searchData;
    console.log(summonerInfo, summonerLeagueInfo, matchDetailInfo, matchRecentInfo);
    //summonerInfo
    if(!summonerInfo) {
        
        return;
    }

    var summonerImg = $("img.summoner-img");
    var summonerName = $("h3.summoner-name");
    
    summonerImg.attr('src', summonerInfo.iconURL);
    summonerName.text(summonerInfo.name);

    //summonerLeagueInfo
    var summonerLeagueImg = $('img.summonerLeagueInfo-img');
    var summonerLeagueTierAndRank = $('p.summonerLeagueInfo-tierRank');
    var summonerLeaguePoints = $('p.summonerLeagueInfo-points');
    var summonerLeagueWinAndLose = $('p.summonerLeagueInfo-winlose');

    if(summonerLeagueInfo) {
        summonerLeagueImg.attr('src', `../img/${summonerLeagueInfo.tier}.png`);
        summonerLeagueTierAndRank.text(`${summonerLeagueInfo.tier} ${summonerLeagueInfo.rank}`);
        summonerLeaguePoints.text(`${summonerLeagueInfo.leaguePoints}`);
        summonerLeagueWinAndLose.text(`${summonerLeagueInfo.wins}승 ${summonerLeagueInfo.losses}패`);
    }
    
    if(!summonerLeagueInfo) {
        summonerLeagueImg.attr('src', `../img/unranked.png`);
        summonerLeagueTierAndRank.text("랭크 게임 정보가 존재하지 않습니다.");
    }

    //matchDetailInfo

    //matchRecentInfo
}