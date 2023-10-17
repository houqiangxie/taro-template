/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-08-14 16:11:42
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-17 14:21:40
 */
/**
 * 
 * @param target 源数据 
 * @returns  copyTarget
 */
export const deepClone = (target: any): any => {
    if (target && typeof target === "object") {
        const result: any = Array.isArray(target) ? [] : {};
        for (const key in target) {
            if (typeof target[key] === "object") {
                result[key] = deepClone(target[key]);
            } else {
                result[key] = target[key];
            }
        }
        return result;
    }
    return target;
}

// 根据key返回配置列
export const getConfigCol = (key: string, list: Array<{ [key: string]: string }>, fieldKey: string = 'key'): any => {
    return list.find((listItem) => listItem[fieldKey] == key) ?? {};
}

// 文件下载
export class Download {
    constructor(url: string, name: string = '下载文件') {
        this.openDownload(url, name);
    }
    openDownload(urls: string, name: string) {
        const nameStr = name.replace(/(.*)(\..*)/, "$1");
        const link = urls;
        const lastIndex = link.split(".").length - 1;
        const type = link.split(".")[lastIndex];
        if (["jpg", "png", "jpeg", "gif"].includes(type)) {
            // 图片
            this.getBase64Image2(link, (image: string) => {
                this.XMLHttpRequest(image, `${nameStr}.${type}`, "image");
            });
        } else {
            // 非图片
            this.XMLHttpRequest(link, name, 'file');
        }
    }
    XMLHttpRequest(link: string, name: string, type: string) {
        const x = new XMLHttpRequest();
        x.open("GET", link, true);
        x.responseType = "blob";
        x.onload = function () {
            console.log("onload");
            const blob = x.response;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name || "";
            a.click();
        };
        x.send();
    }
    getBase64Image2(img: string, cb: Function) {
        const canvas = document.createElement("canvas");
        const image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.src = `${img}?v=${Math.random()}`;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            ctx?.drawImage(image, 0, 0, image.width, image.height);
            const ext = image.src
                .substring(image.src.lastIndexOf(".") + 1)
                .toLowerCase();
            const base64 = canvas.toDataURL(`image/${ext}`);
            cb(base64);
        };
    }
    dataURLtoBlob(base64: string, cb: Function) {
        const arr = base64.split(",");
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n > 0) {
            n -= 1;
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr]);
        cb(blob);
    }
}

export const dateFormat = (time, type = 'date') => {
    let date = new Date(time);
    let year = date.getFullYear();
    // 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 拼接
    // return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return type == 'date' ? (year + "-" + month + "-" + day) : (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
}