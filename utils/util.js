const _fgj = {
  // 格式化日期
  formatTimeDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(this.formatNumber).join('-');
  },
  // 格式化时间
  formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },
  // 把对象拼接成url参数
  param(data) {
    let url = ''
    for (let k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      url += '&' + k + '=' + value
    };
    return url ? url.substring(1) : ''
  },
  // 字段验证
  verify (strings, type) {
    let value = strings.replace(/\s/g, '');   // 去掉空白字符
    // 非空验证
    if (type === 'require') {
      return !!value
    }
    // 单词字符和数字
    if (type === 'word') {
      return /^[\w]+$/.test(value);
    }
    // 只能是数字
    if (type === 'number') {
      return /^\d+$/.test(value);
    }
    // 数字或有小数位
    if (type === 'number-dot') {
      return /^\d+[\.]?\d+$/.test(value)
    }
    // 手机号验证
    if (type === 'phone') {
      return /^1[3-9]\d{9}$/.test(value);
    }
    // 邮箱号验证
    if (type === 'email') {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
    }
  },
};

export default _fgj;