const	http = require('http');
const iconv = require('iconv-lite');

function post (host, params) {
	const str = iconv.encode(params, 'GBK');
	const length = Buffer.byteLength(str);
	console.log("==========", str);
	console.log("==========", length, str.length);

	return new Promise((resolve)=>{
		const items = host.split(':');
		const request = http.request({
			host: items[0],
			port: items[1],
			path: '/test',
			method: 'Post',
			headers: {
				'Content-Type': 'text/plain',
				'Content-Length': length,
			}
		}, function(res) {
			const buffer=[];
		    let size = 0;
		    res.on('data', function (data) {
				console.log("=========xx", data);
		      buffer.push(data);
		      size += data.length;
		    });
		    res.on('end', function () {
		      resolve(iconv.decode(Buffer.concat(buffer, size), 'GBK'));
		    });
		});
		request.write(str);
		request.end();
	})
}

async function main() {
	const data = '1方运江1';
	// const result = await post('192.168.1.109:449', data);
	const result = await post('localhost:4000', data);
	console.log(result);
}

main();
