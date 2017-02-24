//single player mode

//-------raise a question--------
var key;
var quest;
var t = '';
var correct = 0;
var passed = 0;
var chance = 0;

function raiseQuest() {
    var questIndex = Math.ceil(Math.random() * dict.length);
    key = 'HELLO';
    quest = key.replace(/./g, '*');
    dict.slice(questIndex, 1);
    chance=key.length;
    $('span').eq(0).text(quest);    
}

//-------input--------
    
$('#input').on('keypress', function (e) {
    if ((e.key >= 'A' && e.key <= 'z')) {
        if (e.key>='a') {
            $('input').val(e.key.toUpperCase());
        }
    }else{
        return false;
    }
});
$('#input').on('keyup', function (e) {
    var gsChar = $('#input').val();
    //console.log(e.keyCode);
    if (e.keyCode === 13 && gsChar != '') {
        $('#input').val('');
        console.log(quest);
        postAGuess(gsChar);
    }
});

//---------make guess--------

function postAGuess(gsChar) {
    t += gsChar;
    var reg = new RegExp('[^' + t + ']', 'g');
    var isRight=quest;
    quest = key.replace(reg, '*');
    if(isRight===quest){
        chance--;
        console.log(chance);
    }
    var reg2 = new RegExp('\\w{' + key.length + '}', 'g');
    if (reg2.test(quest)) {
        //$('span').eq(1).text(totalWordAllowed-res.data.totalWordCount);
        correct++;
        $('span').eq(2).text(correct);
        $('span').eq(3).text(passed);
        raiseQuest();
    };
    $('span').eq(0).text(quest);
}

function nextQuest() {
    alert();
}