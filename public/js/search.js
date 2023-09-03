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
        summonerLeaguePoints.text(`${summonerLeagueInfo.leaguePoints}` + "LP");
        summonerLeagueWinAndLose.text(`${summonerLeagueInfo.wins}승 ${summonerLeagueInfo.losses}패`);
    }
    
    if(!summonerLeagueInfo) {
        summonerLeagueImg.attr('src', `../img/unranked.png`);
        summonerLeagueTierAndRank.text("랭크 게임 정보가 존재하지 않습니다.");
    }

    //matchRecentInfo
    var coverCon = document.createElement('div');
    coverCon.setAttribute('class', 'detail-item d-flex m-3');
    
    if(!matchRecentInfo) {
        var pText = document.createElement('p');
        pText.textContent = "최근 게임 정보가 없습니다."
        coverCon.appendChild(pText);
        $('#detail-con').append(coverCon);
    }
    else {
        for(let i = 0; i < matchRecentInfo.length; i ++) {
            var coverCon2 = document.createElement('div');
            coverCon2.setAttribute('class', 'detail-item d-flex m-3');
            var imgCon = document.createElement('div');
            imgCon.setAttribute('class', 'm-2');
            var nameCon = document.createElement('div');
            nameCon.setAttribute('class', 'm-2');
            var kdaCon = document.createElement('div');
            kdaCon.setAttribute('class', 'm-2');
            var image = document.createElement('img');
            image.setAttribute('class', 'matchRecentInfo-imgURL');
            var pName = document.createElement('p');
            pName.setAttribute('class', 'matchRecentInfo-name');
            var pTotal = document.createElement('p');
            pTotal.setAttribute('class', 'matchRecentInfo-data-total');
            var pPercent = document.createElement('p');
            pPercent.setAttribute('class', 'matchRecentInfo-percent');
            var pKda = document.createElement('p');
            pKda.setAttribute('class', 'matchRecentInfo-kdaCalculate');

            
            image.setAttribute('src', matchRecentInfo[i].data.imgURL);
            pName.textContent = matchRecentInfo[i].championName;
            pTotal.textContent = matchRecentInfo[i].data.total + "게임";
            pPercent.textContent = Math.round(matchRecentInfo[i].data.win / matchRecentInfo[i].data.total * 100) + "%";
            if(matchRecentInfo[i].data.deaths == 0) pKda.textContent = "KDA " + (matchRecentInfo[i].data.kills + matchRecentInfo[i].data.assists).toFixed(2);
            else pKda.textContent = "KDA " + ((matchRecentInfo[i].data.kills + matchRecentInfo[i].data.assists) / matchRecentInfo[i].data.deaths).toFixed(2);

            imgCon.appendChild(image);
            nameCon.appendChild(pName);
            nameCon.appendChild(pTotal);
            kdaCon.appendChild(pPercent);
            kdaCon.appendChild(pKda);
            
            coverCon2.appendChild(imgCon);
            coverCon2.appendChild(nameCon);
            coverCon2.appendChild(kdaCon);
            
            document.getElementById('detail-con').appendChild(coverCon2);
        }
    }

    //matchDetailInfo
}