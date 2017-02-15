//single player mode
//-------initialization--------
var key;
var quest;
var t="";
$("#input").on('keyup', function (e) {
    if (e.keyCode === 13) {
        // Do something
        postAGuess($("#input").val());
    }else{
        return false;
    }    
});

//-------raise a question--------

function raiseQuest(){
    var questIndex=Math.ceil(Math.random()*dict.length);
    key=dict[questIndex];
    quest=key.replace(/./g,"*");
    dict.slice(questIndex,1);
    $("span").eq(0).text(quest);
}

function postAGuess(gsChar){
    t+=gsChar;
    var reg=new RegExp("[^"+t+"]","g");
    quest=key.replace(reg,"*");
    var reg2=new RegExp( /\w/g);
    if(reg2.test(quest)){
        
    };
    console.log(reg2);
    $("span").eq(0).text(quest);
}