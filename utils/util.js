const _fgj = {
  // 把对象拼接成url参数
  param(data) {
    let url = ''
    for (var k in data) {
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