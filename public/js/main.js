$('.dropdown-item').on('click', function () {
    var selectedItemText = $(this).text();
    $('#dropdownMenuButton1').text(selectedItemText);
});

const idSearchBtn = document.getElementById('idSearch-btn');

idSearchBtn.addEventListener('click', () => {
    let inputID = $('#searchedId').val();
    let selectedGame = $('#dropdownMenuButton1').text();

    //id validation
    if(!validateID(inputID, selectedGame)) {
        alert("잘못된 ID 형식입니다.");
        return;
    }

    //game select validation
    if(selectedGame.length == 0 || selectedGame == "게임 선택") {
        alert("게임을 선택해주세요");
        return;
    }
    
    else {        
        $('#game').val(selectedGame);

        document.searchForm.submit();
    }
});

function validateID(inputID, selectedGame) {
    if(inputID.length == 0) return false;

    const regexpMaple = /^[가-힣a-zA-Z0-9]*$/;
    const regexpLiot = /^[가-힣a-zA-Z0-9\s]*$/;
    
    if(selectedGame == "메이플스토리") return regexpMaple;
    else return regexpLiot;
}