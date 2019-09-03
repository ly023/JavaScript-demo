import 'common/common.scss'
import './scroll-bar.scss'

const scrollBox = document.getElementById("scroll-box");
const scrollCont = document.getElementById("scroll-cont");
const dragBox = document.getElementById("drag-box");
const drag = document.getElementById("drag");
const scrollBoxHeight = scrollBox.clientHeight
const scrollContHeight = scrollCont.clientHeight
const dragHeight = drag.clientHeight
const dragBoxHeight = dragBox.clientHeight
const overflowHeight = scrollContHeight - scrollBoxHeight
let isDrag = false;
let dragTop;
let dragStartPosY;

// 拖动滚动条
drag.addEventListener('mousedown', function (e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }

    if (isDrag) {
        return;
    }

    isDrag = true
    dragStartPosY = e.clientY
    dragTop = parseInt(window.getComputedStyle(drag).top, 10)
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
})

function mousemove(e) {
    if (!isDrag) {
        return;
    }

    let moveY = e.clientY - dragStartPosY
    let currentDragTop = dragTop + moveY
    if (currentDragTop >= (scrollBoxHeight - dragHeight)) {
        currentDragTop = scrollBoxHeight - dragHeight
    }
    if (currentDragTop < 0) {
        currentDragTop = 0
    }
    let rate = currentDragTop / (dragBoxHeight - dragHeight);
    let currentScrollContentTop = rate * overflowHeight;
    scrollCont.style.top = -currentScrollContentTop + "px"
    drag.style.top = currentDragTop + "px"
}

function mouseup() {
    isDrag = false
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
}

// 鼠标滚轮事件
scrollBox.addEventListener('wheel', function (e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }

    let styleTop = scrollCont.style.top
    let startTop = styleTop ? parseInt(styleTop, 10) : 0
    // wheelDelta：获取滚轮滚动方向，向上120，向下-120，但为常量，与滚轮速率无关
    // deltaY：垂直滚动幅度，正值向下滚动
    // wheelDelta只有部分浏览器支持，deltaY几乎所有浏览器都支持
    let deltaY = -e.deltaY || e.wheelDelta
    // firefox
    if (e.deltaMode) {
        let lineHeight = parseFloat(window.getComputedStyle(scrollCont).lineHeight)
        deltaY = deltaY > 0 ? lineHeight : -lineHeight
    }

    if (deltaY > 0) {
        if (startTop !== 0) {
            let scrollContTop = startTop + deltaY > 0 ? 0 : startTop + deltaY
            scrollCont.style.top = scrollContTop + "px";
            let rate = scrollContTop / overflowHeight
            let dragTop = rate * (scrollBoxHeight - dragHeight)
            drag.style.top = -dragTop + "px";
        }
    } else {
        if (startTop > -overflowHeight) {
            let scrollContTop = startTop + deltaY < 0 ? startTop + deltaY : 0
            if (scrollContTop < -overflowHeight) {
                scrollContTop = -overflowHeight
            }
            scrollCont.style.top = scrollContTop + "px";
            let rate = scrollContTop / overflowHeight
            let dragTop = rate * (scrollBoxHeight - dragHeight)
            drag.style.top = -dragTop + "px";
        }
    }
})
