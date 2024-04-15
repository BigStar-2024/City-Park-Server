function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname: string, cvalue: string, expires = 24 * 60 * 60, path = "/") {
    let cookie = `${cname}=${cvalue};`;
    if (expires) {
        const d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        cookie += `expires=${d.toUTCString()};`;
    }
    if (path) {
        cookie += `path=${path};`;
    }
    document.cookie = cookie;
}

function clearCookie(cname: string, path = "/") {
    let cookie = `${cname}=;`;
    const d = new Date();
    d.setTime(d.getTime() - 50 * 1000);
    cookie += `expires=${d.toUTCString()};`;
    cookie += `path=${path};`;
    document.cookie = cookie;
}

export { getCookie, setCookie, clearCookie };
