import './drag.scss'

/**
 * 将mouseover与mouseup绑定到document上，这样鼠标快速拖动超出div范围时依然能够拖动并释放div
 */

var minTop = 8;
var minLeft = 8;
var maxTop;
var maxLeft;

var isDrag = false;
var startX = null;
var startY = null
var top;
var left;

var box = document.querySelector('.box');

window.addEventListener('load', function () {
    var boxWidth = box.offsetWidth
    var boxHeight = box.offsetHeight
    maxTop = window.document.documentElement.clientHeight - (boxHeight + minTop)
    maxLeft = window.document.documentElement.clientWidth - (boxWidth + minLeft)
})

function handleMouseDown() {
    box.addEventListener('mousedown', function (e) {
        isDrag = true;

        startX = e.clientX;
        startY = e.clientY;

        var obj = box.getBoundingClientRect();
        top = obj.top;
        left = obj.left;

        handleMouseMove();
        handleMouseUp();
    })
}


function handleMouseMove() {
    document.addEventListener('mousemove', function (e) {
        if (!isDrag) {
            return
        }

        var moveX = e.clientX - startX;
        var moveY = e.clientY - startY;

        var styleTop = top + moveY;
        var styleLeft = left + moveX;

        if (styleTop < minTop) {
            styleTop = minTop
        } else if (styleTop > maxTop) {
            styleTop = maxTop
        }
        if (styleLeft < minLeft) {
            styleLeft = minLeft
        } else if (styleLeft > maxLeft) {
            styleLeft = maxLeft
        }

        box.style.top = styleTop + 'px';
        box.style.left = styleLeft + 'px';
    })
}


function handleMouseUp() {
    document.addEventListener('mouseup', function () {
        isDrag = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    })
}

handleMouseDown();



