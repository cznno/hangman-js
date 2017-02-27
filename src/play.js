//single player mode

//-------raise a question--------
var key
var quest
var t = ''
var correct = 0
var passed = 0
var chance = 0
var dict=new Array()
dict=dict.concat(test_dict)
var guessNumLeft=dict.length

function raiseQuest() {
    guessNumLeft--
    if (guessNumLeft<0){
        //TODO: gameover?
        gameOver()
        return
    }
    var questIndex = Math.floor(Math.random() * dict.length)
    key = dict[questIndex]
    quest = key.replace(/./g, '*')
    dict.splice(questIndex, 1)
    chance=10
    t=''
    $('#word').text(quest)    
}

//-------input--------
    
$('#input').on('keypress', function (e) {
    if ((e.key >= 'A' && e.key <= 'z')) {
        if (e.key>='a') {
            $('input').val(e.key.toUpperCase())
        }
    }else{
        return false
    }
})
$('#input').on('keyup', function (e) {
    var gsChar = $('#input').val()
    if (e.keyCode === 13 && gsChar != '') {
        $('#input').val('')
        postAGuess(gsChar)
    }
})

//---------make guess--------

function postAGuess(gsChar) {
    t += gsChar
    var reg = new RegExp('[^' + t + ']', 'g')
    console.log(reg)
    var isRight=quest
    quest = key.replace(reg, '*')
    if(isRight===quest){
        chance--
        console.log(chance)
        if (chance<=0){
            //TODO: game over?
            gameOver()
        }
    }
    var reg2 = new RegExp('\\w{' + key.length + '}', 'g')
    if (reg2.test(quest)) {
        correct++
        $('span').eq(2).text(correct)
        $('span').eq(3).text(passed)        
        raiseQuest()
    }
    $('#word').text(quest)   
}

function gameOver() {
    alert()
}