const crypto = require('crypto');
const sha1 = crypto.createHash('sha1');
const bcadd = require('locutus/php/bc/bcadd');
const bcsub = require('locutus/php/bc/bcsub');
const bcmul = require('locutus/php/bc/bcmul');
const bcdiv = require('locutus/php/bc/bcdiv');
const bccomp = require('locutus/php/bc/bccomp');
const chr = require('locutus/php/strings/chr');
const str_pad = require('locutus/php/strings/str_pad');
const strpos = require('locutus/php/strings/strpos');
const pack = require('locutus/php/misc/pack');
const hexdec = require('locutus/php/math/hexdec');
const bcmod = (a, b)=>bcsub(a, bcmul(b, bcdiv(a, b)));

const BCCOMP_LARGER = 1;

function rsa_encrypt(message, public_key, modulus, keylength) {
    padded = add_PKCS1_padding(message, true, keylength / 8);
    number = binary_to_number(padded);
    encrypted = pow_mod(number, public_key, modulus);
    result = number_to_binary(encrypted, keylength / 8);
    return result;
}
function rsa_decrypt(message, private_key, modulus, keylength) {
    number = binary_to_number(message);
    decrypted = pow_mod(number, private_key, modulus);
    result = number_to_binary(decrypted, keylength / 8);
    return remove_PKCS1_padding(result, keylength / 8);
}
function rsa_sign(message, private_key, modulus, keylength) {
    sha1.update(message);
    const mssage_digest_info_hex = sha1.digest('hex');
    const mssage_digest_info_bin = hexTobin(mssage_digest_info_hex);
    const padded = add_PKCS1_padding(mssage_digest_info_bin, false, keylength / 8);
    const number = binary_to_number(padded);
    const signed = pow_mod(number, private_key, modulus);
    const result = new Buffer(signed).toString('base64');
    return result;
}
function rsa_verify(doc, signature, public_key, modulus, keylength) {
    sha1.update(doc);
    const doc_digest_info = sha1.digest('hex');
    const number = binary_to_number(new Buffer(signature, 'base64'));
    const decrypted = pow_mod(number, public_key, modulus);
    const decrypted_bytes = number_to_binary(decrypted, keylength / 8);
    const result = remove_PKCS1_padding_sha1(decrypted_bytes, keylength / 8);
    return( hexTobin(doc_digest_info) == result);
}
function pow_mod(p, q, r) {
    const factors = [];
    let div = q;
    let power_of_two = 0;
    while(bccomp(div, '0') == BCCOMP_LARGER) {
        let rem = bcmod(div, 2);
        div = bcdiv(div, 2);
        if (rem*1) {
            factors.push(power_of_two);
        }
        power_of_two++;
    }
    const partial_results = [];
    let part_res = p;
    let idx = 0;
    for (const factor of factors) {
        while(idx < factor) {
            part_res = bcmul(part_res, part_res);
            part_res = bcmod(part_res, r);
            idx++;
        }
        partial_results.push(part_res);
    }

    let result = '1';
    for (const part_res of partial_results) {
        result = bcmul(result, part_res);
        result = bcmod(result, r);
    }
    return result;
}
function add_PKCS1_padding(data, isPublicKey, blocksize) {
    const pad_length = blocksize - 3 - data.length;
    if(isPublicKey) {
        const block_type = '\x02';
        let padding = '';
        for(i = 0; i < pad_length; i++) {
            const rnd = mt_rand(1, 255);
            padding += chr(rnd);
        }
    } else {
        const block_type = '\x01';
        let padding = str_repeat('\xFF', pad_length);
    }

    return '\x00' + block_type + padding + '\x00' + data;
}
function remove_PKCS1_padding(data, blocksize) {
    data = data.substr(1);
    const offset = strpos(data, '\0', 1);
    return data.substr(offset + 1);
}
function remove_PKCS1_padding_sha1(data, blocksize) {
    const digestinfo = remove_PKCS1_padding(data, blocksize);
    return digestinfo.substr(digestinfo.length-20);
}
function binary_to_number(data) {
    const base = '256';
    let radix = '1';
    let result = '0';

    for (let i = data.length - 1; i >= 0; i--) {
        const part_res = bcmul(data[i], radix);
        result = bcadd(result, part_res);
        radix = bcmul(radix, base);
    }
    return result;
}
function number_to_binary(number, blocksize) {
    const base = '256';
    let result = '';
    let div = number;
    while(div > 0) {
        let mod = bcmod(div, base);
        div = bcdiv(div, base);
        result = chr(mod)+result;
    }
    return str_pad(result, blocksize, '\x00', 'STR_PAD_LEFT');
}
function hexTobin(data) {
    const len = data.length;
    let newdata = '';
    for(let i = 0; i < len; i += 2) {
        newdata += pack('C', hexdec(data.substr(i, 2)));
    }
    return newdata;
}

module.exports = {
    verify: rsa_verify,
};
