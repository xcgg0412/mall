export function formatDate(date, fmt) {
  //1.获取年份
  //查询第二个参数包含几个Y
  // +表示一个或多个
  // *表示0个或多个
  // ？表示个或1个
  //replace替换，substr截取，
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  //2.
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

//不足两位，用0补齐
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

export function debounce(func,delay){
  let timer=null;
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      func.apply(this,args)
    },delay)
  }
}
