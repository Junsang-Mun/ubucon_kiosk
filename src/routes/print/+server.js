import { usb, findByIds } from 'usb';
import { Buffer } from 'buffer';
import Jimp from "jimp";

function getImageData(base64, cb) {
	let prefix = "data:image/png;base64,";
	let path = base64.replace(prefix, "");
	let imgBuffer = Buffer.from(path, 'base64');
	Jimp.read(imgBuffer, (err, img) => {
		if (err) {
			console.error(err);
			return new Response('Failed to print', { status: 500 });
		}
		const widthInBytes = Math.ceil(img.getWidth() / 8);
		const data = new Array(img.getHeight());
		for (let y = 0; y < img.getHeight(); y++) {
			const row = new Array(widthInBytes);
			for (let b = 0; b < widthInBytes; b++) {
				let byte = 0;
				let mask = 128;
				for (let x = b * 8; x < (b + 1) * 8; x++) {
					const color = Jimp.intToRGBA(img.getPixelColor(x, y));
					if (color.a < 65) byte = byte ^ mask;
					mask = mask >> 1;
				}
				row[b] = byte;
			}
			data[y] = row;
		}
		cb(data);
	});
}

function print(buffer) {
	// you can get all available devices with usb.getDeviceList()
	let device = findByIds(/*vid*/8137, /*pid*/8214);
	device.open();
	device.interfaces[0].claim();
	const outEndpoint = device.interfaces[0].endpoints.find(e => e.direction === 'out');
	outEndpoint.transferType = 2;
	outEndpoint.transfer(buffer, (err) => {
		device.close();
		if (err) {
			console.error(err);
			return new Response('Failed to print', { status: 500 });
		}
	});
}

export async function POST(event) {
	const body = await event.request.json();
	let pngData = body.data;
	try {
		getImageData(pngData, (data) => {
			const imgWidthInBytes = data[0].length;
			const imgHeightInDots = data.length;
			const buffer = Buffer.concat([
				Buffer.from('SIZE 70 mm,70 mm\r\n'),
				Buffer.from('CLS\r\n'),
				Buffer.from(`BITMAP 0,0,${imgWidthInBytes},${imgHeightInDots},0,`),
				Buffer.from(data.flat()),
				Buffer.from('PRINT 1\r\n'),
				Buffer.from('END\r\n'),
			]);
			print(buffer);
		});
	} catch (error) {
		console.error(error);
		return new Response('Failed to print', { status: 500 });
	}
	return new Response('200');
}