import 'common/common.scss'
import './copy.scss'

const copyContent = document.querySelector('.copyContent')
const copyButton = document.getElementById('copyButton')
const pasteButton = document.getElementById('pasteButton')
copyButton.addEventListener('click', writeDataToClipboard)
pasteButton.addEventListener('click', readDataFromClipboard)

const text = 'hello world'
const imageUrl = 'https://crm-new-test-1256249764.image.myqcloud.com/3/26/e14e26f3870f7f1d0a321884955cd9c3.png'
// 不支持jpg Chrome 87
// const imageUrl = 'https://crm-new-test-1256249764.image.myqcloud.com/3/26299/ca5f34e4637c6f5b1b888b5d96ed8aef.jpg'

// 向用户请求剪贴板读取权限
async function askReadPermission() {
    try {
        const {state} = await navigator.permissions.query({
            name: "clipboard-read"
        });
        return state === "granted";
    } catch (error) {
        return false;
    }
}

// 向用户请求剪贴板的写入权限
async function askWritePermission() {
    try {
        const {state} = await navigator.permissions.query({
            name: "clipboard-write"
        });
        return state === "granted";
    } catch (error) {
        return false;
    }
}

// 获取图片 blob
const getBlob = (url) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject();
            }
        };
        xhr.ontimeout = () => {
            reject();
        };
        xhr.onerror = () => {
            reject();
        };
        xhr.send();
    });

// 把普通文本转换为 Blob 对象
function createTextBlob(text) {
    return new Blob([text], {type: "text/plain"});
}

// 选择要复制的部分
function select(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

// 用图片和文本的 Blob 对象来创建 ClipboardItem 对象，然后再调用 write 方法将数据写入到剪贴板中
async function writeDataToClipboard() {
    if (askWritePermission()) {
        if (navigator.clipboard && navigator.clipboard.write) {
            const textBlob = createTextBlob(text);
            const imageBlob = await getBlob(imageUrl);
            try {
                const item = new ClipboardItem({
                    [textBlob.type]: textBlob,
                    [imageBlob.type]: imageBlob
                });
                let data = new DataTransfer();
                data.items.add("text/plain", text);
                // 选择要复制的部分
                select(copyContent);
                await navigator.clipboard.write([item]);
                console.log("文本和图像复制成功");
            } catch (error) {
                console.error("文本和图像复制失败", error);
            }
        }
    }
}

// navigator.clipboard.read 读取剪贴板的数据
async function readDataFromClipboard() {
    if (askReadPermission()) {
        if (navigator.clipboard && navigator.clipboard.read) {
            try {
                const clipboardItems = await navigator.clipboard.read();
                for (const clipboardItem of clipboardItems) {
                    console.dir(clipboardItem);
                    for (const type of clipboardItem.types) {
                        const blob = await clipboardItem.getType(type);
                        console.log("已读取剪贴板中的内容：", await blob.text());
                    }
                }
            } catch (err) {
                console.error("读取剪贴板内容失败: ", err);
            }
        }
    }
}

// 除了点击 粘贴 按钮手动触发之外，还可以通过监听 paste 事件来读取剪贴板中的数据
// 如果当前的浏览器不支持异步 Clipboard API，可以通过 clipboardData.getData 方法来读取剪贴板中的文本数据
document.addEventListener("paste", async (e) => {
    console.log('text paste')
    e.preventDefault();
    let text;
    if (navigator.clipboard) {
        text = await navigator.clipboard.readText();
    } else {
        text = e.clipboardData.getData("text/plain");
    }
    console.log("已获取的文本数据: ", text);
});

// 把复制的图片插入到当前选区已选择的区域中
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
    };
    reader.readAsDataURL(file);
}

// 读取图像数据
const IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png)$/i;
document.addEventListener('paste', async (e) => {
    e.preventDefault();
    console.log('image paste')
    if (navigator.clipboard) {
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (IMAGE_MIME_REGEX.test(type)) {
                    const blob = await clipboardItem.getType(type);
                    loadImage(blob);
                    return;
                }
            }
        }
    } else {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (IMAGE_MIME_REGEX.test(items[i].type)) {
                loadImage(items[i].getAsFile());
                return;
            }
        }
    }
});

