//-------Initialization-------
//actions
var playerId="YourID";
var gameUri="YourAddress";
var dataGameStart = JSON.stringify({"playerId":playerId,"action":"startGame"});
var dataGiveWord="";
var datamakeGuess="";
//datas
const charFreq=['U','S','R','L','T','N','D','C','Y','P',
                'M','H','G','B','K','F','W','V','Z','X','J','Q'];
const firstCharFreq=['A','E','O','I'];
//game playing
var sessionId="";
var dictTemp=new Array();
var firstShots=firstCharFreq.slice();
var charTemp=charFreq.slice();

var guessChar="";    
var wordToGuess="";
var totalWordAllowed=80;
var wrongGuessAllowed=10;
var lastWrgGuess=0;
var rightChar=[];

var correct=0;
var passed=0;
//---------------------------

//-------Play Game-------
//1. Start Game
function startGame(){
    $(".reslt").remove(); 
    correct=0;
    passed=0;
    console.clear();
    console.log("Game Start");
    doPost(dataGameStart,startGameSuccs);
}
function startGameSuccs(res){
    sessionId=res.sessionId;
    totalWordAllowed=res.data.numberOfWordsToGuess;
    wrongGuessAllowed=res.data.numberOfGuessAllowedForEachWord;
    givAWord();
}

//2. Give Me A Word
function givAWord(){
    console.clear();
    dicTemp=[];
    dataGiveWord=JSON.stringify({"sessionId": sessionId,"action" : "nextWord"});
    doPost(dataGiveWord,givAWordSuccs);
}

function givAWordSuccs(res){
    wordToGuess=res.data.word;            
    lastWrgGuess=res.data.wrongGuessCountOfCurrentWord;

    $("span").eq(0).text(totalWordAllowed-res.data.totalWordCount);
    $("span").eq(1).text(correct);
    $("span").eq(2).text(passed);

    console.log(totalWordAllowed-res.data.totalWordCount+" words to go");
    console.log(correct+" words correct");    
    console.log(passed+" words passed");    

    if(res.data.totalWordCount>totalWordAllowed){
    //if count of try reaches max
        getResult();
    }else{
        //initialize for first guess
        charTemp=[];
        charTemp=charFreq.slice();
        dictTemp=[];
        firstShots=firstCharFreq.slice();
        guessChar="";
        //first filter:length of word
        dict.forEach(function(e){
            if(e.length==wordToGuess.length){
                dictTemp.push(e); 
            }       
        })
        makAGuess(wordToGuess,lastWrgGuess,res.data.totalWordCount);
    }
}

//3. Make A Guess
function makAGuess(wordToGs,resWrgGuess,totalGuess){
    //some log
    console.log("-----------------------------------------");
    console.log("dict space: "+dictTemp.length);
    console.log("guess: "+guessChar);    
    console.log("word: "+wordToGs);
    console.log("wrg: "+resWrgGuess);   

    var dictLen=0;       
    var re1=new RegExp("\\w{"+wordToGs.length+"}");
    var ifRight=re1.test(wordToGs);
    
    if(!(ifRight)&&resWrgGuess<wrongGuessAllowed){
    //if we still have chance or if the word is not completely guessed
        if(lastWrgGuess==resWrgGuess){
        //last guess right

            //dictTemp filter(delete unmatched word in dictTemp)
            var re=new RegExp(wordToGs.replace(/\*/g,"."));
            dictLen=dictTemp.length-1;
            for(var i=dictLen;i>=0;i--){
                if(!re.test(dictTemp[i])){
                    dictTemp.splice(i,1);
                }
            }
            //pre-guess
            if(firstShots.length!=0){
                guessChar=firstShots.shift();
            }else{                   
                //find which is the most possible char in dictionary
                findLikeChar(wordToGs); 
            }            
            //ready to submit guesschar
        }else{
        //last guess wrong
            dictLen=dictTemp.length-1;
            for(var i=dictLen;i>=0;i--){
                if(dictTemp[i].indexOf(guessChar)>-1){
                    dictTemp.splice(i,1);
                }
            }
            lastWrgGuess=resWrgGuess;
            //pre guess
            if(firstShots.length!=0){
                guessChar=firstShots.shift();
            }else{               
                findLikeChar(wordToGs);
            }
        }
        //post some guess
        datamakeGuess=JSON.stringify({"sessionId": sessionId,"action" : "guessWord","guess" : guessChar}); 
        doPost(datamakeGuess,makAGuessSuccs);
    }else{        
    //wrong guess over 10 times
        if(totalGuess>=totalWordAllowed){
            getResult();
        }else{
            if(ifRight){
                correct++;
            }else{
                passed++;
            }
            givAWord();
        }
    }
    
}

function makAGuessSuccs(res) {             
    makAGuess(res.data.word,res.data.wrongGuessCountOfCurrentWord,res.data.totalWordCount);
}

//4. Get Your Result
function getResult(){
    //console.clear();
    console.log("Game End");
    var dataGetResult=JSON.stringify({"sessionId": sessionId,
                                        "action" : "getResult"});
    doPost(dataGetResult,getResultSuccs);
}

function getResultSuccs(res){
    console.log("sessionID is: "+res.sessionId);
    console.log("totalWordCount: "+res.data.totalWordCount);
    console.log("correctWordCount: "+res.data.correctWordCount);
    console.log("totalWrongGuessCount: "+res.data.totalWrongGuessCount);
    console.log("score: "+res.data.score);
    appResult(res.sessionId,res.data.totalWordCount,res.data.correctWordCount,
                res.data.totalWrongGuessCount,res.data.score);
}

//5. Submit Your Result
function submitResult(){
    var dataSubmit=JSON.stringify({"sessionId":sessionId,"action":"submitResult"});
    doPost(dataSubmit,submitResultSuccs);
}

function submitResultSuccs(res){
    console.log("submit success");
    alert("submit success");
    $("#subBtn").remove();
}

//-------some functions below-------

function doPost(dataAction,succsFunc){
//post actions
    $.ajax({
        type: "POST",
        url: gameUri,
        contentType: "application/json",
        dataType: "json", 
        data: dataAction, 
        success: function (res) {
            succsFunc(res);
        },
        error:function(res){
            console.log(res.message);
            alert(res.message);
        }
    });
}

function findLikeChar(wordToGs){
//find the most possible char
    //make a char list of dictTemp
    var charList=new Array();
    dictTemp.forEach(function(e){
        for(var i=0;i<e.length;i++){
            charList.push(e.charAt(i));
        }
    });

    rightChar=[];
    var re=/\w/;
    dictLen=wordToGs.length;
    for(var i=0;i<wordToGs.length;i++){
        if(re.test(wordToGs.charAt(i)))
        rightChar.push(wordToGs.charAt(i));
    }

    for(var i=charList.length-1;i>=0;i--){
        for(var j=0;j<rightChar.length;j++){
            if(charList[i]==rightChar[j])
                charList.splice(i,1);
        }
    }
    //find most freq char
    var mf = 1;
    var m = 0;
    var fqChar=charList[0];
    for (var i=0; i<charList.length; i++){
        for (var j=i; j<charList.length; j++){
            if (charList[i] == charList[j])
                m++;
            if (mf<m){
                mf=m; 
                fqChar = charList[i];
            }
        }
        m=0;
    }    
    if(fqChar==null||fqChar.length==0){
        guessChar=charTemp.shift();
    }else{
        guessChar=fqChar;
        for(var i=0; i<charTemp.length; i++) {
            if(charTemp[i] == guessChar) {
                charTemp.splice(i, 1);
                break;
            }
        }
    }
}


function appResult(sID,totWC,crctWC,totWGC,scr){
//append game result
    var $reslt=$('<div class="reslt">Result:</div><div class="reslt">sessionId is: '+sID+'</div><div>'+
                    '<div class="reslt">totalWordCount: '+totWC+'</div><div>'+
                    '<div class="reslt">correctWordCount: '+crctWC+'</div><div>'+
                    '<div class="reslt">totalWrongGuessCount: '+totWGC+'</div><div>'+
                    '<div class="reslt">score:: '+scr+'</div>');
    $reslt.appendTo($("body"));
    var $submit = $('<input type="button" id="subBtn" class="reslt" value="submit!!" onclick="submitResult()" />');
    $submit.appendTo($("body"));
    var $replay = $('<input type="button" class="reslt" value="replay" onclick="startGame()" />');
    $replay.appendTo($("body"));
}
