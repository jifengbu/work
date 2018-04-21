const crypto = require('crypto');
const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync('cert/rsa_private.key');
const PUBLIC_KEY = fs.readFileSync('cert/rsa_public.key');

// // 私钥进行加密
const text = 'fangyunjiang';
// const sign = crypto.createSign('RSA-SHA1');
const sign = crypto.createSign('RSA-SHA256');
sign.update(text);
const signedMsg = sign.sign(PRIVATE_KEY, 'hex');
console.log('orign:', text);
console.log('signed:', signedMsg);
// 公钥进行验证
// const verify = crypto.createVerify('RSA-SHA1');
const verify = crypto.createVerify('RSA-SHA256');
verify.update(text);
const result = verify.verify(PUBLIC_KEY, signedMsg, 'hex');
console.log('verify:', result);


// 公钥进行加密
const data = crypto.publicEncrypt(PUBLIC_KEY, new Buffer(text)).toString('hex');
console.log('signed:', data);
// 私钥进行解密
const dist = crypto.privateDecrypt(PRIVATE_KEY, new Buffer(data, 'hex')).toString();
console.log('dist:', dist);
