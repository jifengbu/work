var crypto = require('crypto');
var sha1 = crypto.createHash('sha1');
var a = 'merchantId=100020091218001&version=v1.0&signType=1&payType=0&paymentOrderId=201803061649550018&orderNo=NO20180306165520&orderDatetime=20180306165520&orderAmount=200&payDatetime=20180306164958&payAmount=200&payResult=1&returnDatetime=20180306165404';
sha1.update(a);
console.log(sha1.digest('hex'));
