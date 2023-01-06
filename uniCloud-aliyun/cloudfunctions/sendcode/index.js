// 发送单条短信示例
'use strict';
exports.main = async (event, context) => {
  try {
    const res = await uniCloud.sendSms({
      appid: '__UNI__1640995',
      smsKey: 'c8c2d96338a10536419b2cc22d9ef642',
      smsSecret: '304216845ad8ba2e29406950dac484c9',
      phone: event.phone,
      templateId: '14306', // 请替换为自己申请的模板id
      data: {
        name: event.oldname,
        location: event.location
      }
    })
    // 调用成功，请注意这时不代表发送成功
    return res
  } catch(err) {
    // 调用失败
    console.log(err.errCode)
    console.log(err.errMsg)
    return {
      code: err.errCode,
      msg: err.errMsg
    }
  }
};