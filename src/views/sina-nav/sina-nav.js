import 'common/common.scss'
import './sina-nav.scss'

let getElementById = function (id) {
  return document.getElementById(id);
}

let getByClass = function (parent, sClass) {
  let ele = parent.getElementsByTagName('*');
  let re = new RegExp('\\b' + sClass + '\\b');
  let arr = [];
  for (let i = 0; i < ele.length; i++) {
    if (re.test(ele[i].className)) {
      arr.push(ele[i]);
    }
  }
  return arr;
}

let addEvents = function (target, type, func) {
  if (target.addEventListener) { // 非IE 和IE9
    target.addEventListener(type, func, false);
  } else if (target.attachEvent) { // IE6-IE8
    target.attachEvent('on' + type, func);
  } else {
    target['on' + type] = func; // IE5
  }
}

let setMainNav = function () {
  let mainNav = getElementById('main-nav');
  let aLi = getByClass(mainNav, 'list')[0].getElementsByTagName('li');
  let aGameHover = getByClass(mainNav, 'game-hover');
  let aHoverCont = getByClass(mainNav, 'hover-cont');
  for (let i = 0; i < aGameHover.length; i++) {
    aGameHover[i].index = i;

    addEvents(aGameHover[i], 'mouseover', function (){
      this.className += ' '+'game-hover-current';
      for (let j = 0; j < aHoverCont.length; j++) {
        aHoverCont[j].indexJ = j;
        aHoverCont[j].style.display = 'none';

        addEvents(aHoverCont[j], 'mouseover', function() {
          this.style.display = 'block';
          aGameHover[this.indexJ].className += ' '+'game-hover-current';
        })

        addEvents(aHoverCont[j], 'mouseout', function() {
          this.style.display = 'none';
        })
      }
      if (aHoverCont[this.index]) {
        aHoverCont[this.index].style.display = 'block';
      }
    });
  }
  for (let i = 0; i < aLi.length; i++) {
    aLi[i].index = i;

    addEvents(aLi[i], 'mouseout', function () {
      if (aHoverCont[this.index]) {
        aHoverCont[this.index].style.display = 'none';
      }
      aGameHover[this.index].className = 'game-hover';
    })
  }
}

addEvents(window, 'load', function () {
  setMainNav();
})

