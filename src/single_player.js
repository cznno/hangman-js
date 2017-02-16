//single player mode
//-------initialization--------
var key;
var quest;
var t="";
var correct=0;
var passed=0;
$("#input").on('keypress', function (e) {
    var gsChar=$("#input").val();
    if (e.keyCode == 13 && gsChar!="" ) {
        if(gsChar.charCodeAt(0)>97){
            gsChar=gsChar.toUpperCase();
        }
        $("#input").val("");
        postAGuess(gsChar);
    }else if(e.keyCode>=65 && e.keyCode<=122){
        return;
    }else{
        return false;
    }
});

//-------raise a question--------

function raiseQuest(){
    var questIndex=Math.ceil(Math.random()*dict.length);
    key="HELLO";
    quest=key.replace(/./g,"*");
    dict.slice(questIndex,1);
    $("span").eq(0).text(quest);
}

function postAGuess(gsChar){
    t+=gsChar;
    var reg=new RegExp("[^"+t+"]","g");
    quest=key.replace(reg,"*");
    var reg2=new RegExp("\\w{"+key.length+"}","g");
    if(reg2.test(quest)){
        //$("span").eq(1).text(totalWordAllowed-res.data.totalWordCount);
        correct++;
        $("span").eq(2).text(correct);
        $("span").eq(3).text(passed);
        raiseQuest();
    };
    $("span").eq(0).text(quest);
}

function nextQuest(){
    alert();
}