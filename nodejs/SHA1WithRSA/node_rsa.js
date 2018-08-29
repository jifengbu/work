const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync('./cert/rsa_private.key');
const PUBLIC_KEY = fs.readFileSync('./cert/rsa_public.key');

const text = 'fangyunjiang';

const publicKey = new NodeRSA(PUBLIC_KEY);
const privateKey = new NodeRSA(PRIVATE_KEY);


const signature = privateKey.sign(new Buffer(text), 'base64');
console.log(signature);

// const sign = crypto.createSign('RSA-SHA256');
// sign.update(text);
// const signature = sign.sign(PRIVATE_KEY, 'base64');

// const ret = publicKey.verify(new Buffer(text), new Buffer(signature, 'base64'));
// console.log(ret);

const verify = crypto.createVerify('RSA-SHA256');
verify.update(text);
const result = verify.verify(PUBLIC_KEY, signature, 'base64');
console.log('verify:', result);


// 公钥进行加密
const encrypted = publicKey.encrypt(new Buffer(text), 'base64');
console.log(encrypted);

// const encrypted = crypto.publicEncrypt(PUBLIC_KEY, new Buffer(text)).toString('base64');
// console.log('signed:', encrypted);
// 私钥进行解密
// const decrypted = privateKey.decrypt(new Buffer(encrypted, 'base64'), 'utf8');
// console.log(decrypted);

const dist = crypto.privateDecrypt(PRIVATE_KEY, new Buffer(encrypted, 'base64')).toString();
console.log('dist:', dist);
