$('.dropdown-item').on('click', function () {
    var selectedItemText = $(this).text();
    $('#dropdownMenuButton1').text(selectedItemText);
});

const idSearchBtn = document.getElementById('idSearch-btn');
const searchedId = document.getElementById('searchedId');

idSearchBtn.addEventListener('click', search);
searchedId.addEventListener('keydown', function(event) {    
    if(event.key === "Enter") {
        event.preventDefault();
        search();
    }
});

function search() {    
    let inputID = $('#searchedId').val();
    let selectedGame = $('#dropdownMenuButton1').text();

    if(!validateID(inputID, selectedGame)) {
        if(selectedGame == "게임 선택") alert("게임을 선택해주세요");
        else alert("잘못된 ID 형식입니다.");
        return;
    }

    //개발 중
    else if(selectedGame == "메이플스토리" || selectedGame == "전략적 팀 전투") {
        alert("미구현된 게임입니다.");
        return;
    }
    
    else {
        $('#game').val(selectedGame);

        document.searchForm.submit();
    }
}

function validateID(inputID, selectedGame) {
    if(inputID.length == 0) return false;

    const regexpMaple = /^[가-힣a-zA-Z0-9]*$/;
    const regexpLiot = /^[가-힣a-zA-Z0-9\s]*$/;
    
    if(selectedGame == "게임 선택") return false;
    if(selectedGame == "메이플스토리") return regexpMaple;
    else return regexpLiot;
}