let main;
let ormain;

if (process.env.NODE_ENV === "production")
    ormain = "https://www.yusifmorley.com";
else
    ormain = "http://192.168.128.13:8080";

main = ormain + "/theme";

// 定义URL映射对象
// 定义URL映射对象，所有属性名都放在引号内
const urlMap = {
    "desk":"/desk",
    "attheme":"/attheme"
};

export function getUrl(str) {

    if (urlMap.hasOwnProperty(str)) {
        return main + urlMap[str];
    }

    if(str==="orgin")
        return ormain

    return main + "/default-url"; // 或者抛出错误
}

export const botUrl = (themeName) => {
    if (process.env.NODE_ENV === "production"){
        return `https://t.me/Playsmybot?start=${themeName}`
    }else {
        return `https://t.me/Mywtestbot?start=${themeName}`
    }
}
export const pubFile=(themeName)=>{

    return `${ormain}/${themeName}`

}
