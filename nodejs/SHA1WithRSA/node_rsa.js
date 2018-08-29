const NodeRSA = require('node-rsa');
const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync('./cert/rsa_private.key');
const PUBLIC_KEY = fs.readFileSync('./cert/rsa_public.key');

const text = 'fangyunjiang';

const publicKey = new NodeRSA(PUBLIC_KEY);
const privateKey = new NodeRSA(PRIVATE_KEY);


const signature = privateKey.sign(new Buffer(text), 'base64');
console.log(signature);
const ret = publicKey.verify(new Buffer(text), new Buffer(signature, 'base64'));
console.log(ret);


// 公钥进行加密
const encrypted = publicKey.encrypt(new Buffer(text), 'base64');
console.log(encrypted);
// 私钥进行解密
const decrypted = privateKey.decrypt(new Buffer(encrypted, 'base64'), 'utf8');
console.log(decrypted);
