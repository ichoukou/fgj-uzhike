const _fgj = {
  // 字段验证
  verify: function (strings, type) {
    let value = strings.replace(/\s/g, '');   // 去掉空白字符
    // 非空验证
    if (type === 'require') {
      return !!value
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