/**
 * Created by Administrator on 2015/12/25.
 */
var main = document.querySelector('#main');
var oLis = document.querySelectorAll(".slide>li");
var winW = window.innerWidth;
var winH = window.innerHeight;
var desW = 640;
var desH = 960;
var index=0;
var hide = document.getElementById("hide")
var pageList = [].slice.call(document.querySelectorAll(".ro>span"),0);
main.style.webkitTransform = "scale(" + winH / desH + ")";
moveRo();
[].forEach.call(oLis, function () {
    arguments[0].index = arguments[1];
    arguments[0].addEventListener('touchstart', start, false);
    arguments[0].addEventListener('touchmove', move, false);
    arguments[0].addEventListener('touchend', end, false);
});
function start(e) {
    this.startY = e.changedTouches[0].pageY;
}
function move(e) {
    e.preventDefault();
    /*��ֹĬ����Ϊ*/
    var touchMove = e.changedTouches[0].pageY;
    var changePos = touchMove - this.startY;
    var cur = this.index;
    var step = 1/2;
    var scalePos =(Math.abs(changePos)/winH)*step;
    [].forEach.call(oLis,function(){
        if(arguments[1]!=cur){
            arguments[0].style.display="none";
        }
        arguments[0].className="";
        arguments[0].firstElementChild.id="";
    });
    if (changePos > 0) {/*��*/
        var pos = -winH+changePos;
        this.preSIndex = cur == 0 ? oLis.length - 1 : cur - 1;

    } else if (changePos < 0) {/*��*/
        var pos = winH+changePos;
        this.preSIndex = cur == oLis.length - 1 ? 0 : cur + 1;

    }
    oLis[this.preSIndex].style.webkitTransform = "translate(0,"+pos+"px)";
    oLis[this.preSIndex].className = "zIndex";
    oLis[this.preSIndex].style.display="block";
    oLis[cur].style.webkitTransform = "scale("+(1-scalePos)+") translate(0,"+changePos+"px)";
}
function end(e) {
    oLis[this.preSIndex].style.webkitTransform ="translate(0,0)";
    oLis[this.preSIndex].style.webkitTransition="0.5s";
    oLis[this.preSIndex].addEventListener('webkitTransitionEnd',function(){
        this.style.webkitTransition="";
        this.firstElementChild.id = "a"+(this.index+1);
    })
}
document.addEventListener('touchstart',function(){
},false);


window.addEventListener("load", function () {
    var musicAudio = document.querySelector("#musicAudio");
    var music = document.querySelector(".music");

    musicAudio.addEventListener("canplay", function () {
        music.style.display = "block";
        music.className = "music move";
         
    }, false);
   musicAudio.play();

    $t.tap(music, {
        end: function (e) {
            if (musicAudio.paused) {
                musicAudio.play();
                this.className = "music move";
                return;
            }
            musicAudio.pause();
            this.className = "music";
        }
    });
}, false);


function moveRo() {
    pageList.forEach(function (item, i) {

            item.className = "ro move";

    });
}
 function clickEle (){
	this.addEventListener('click',function(){
			hide.style.display="block"
	},false)
}
 function closeEle(){
 	this.addEventListener('click',function(){
			hide.style.display="none"
	},false)
 }
