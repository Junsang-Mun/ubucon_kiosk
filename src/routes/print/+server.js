import { findByIds } from 'usb';
import { Buffer } from 'buffer';
import Jimp from "jimp";
import fs from 'fs';

function getImageData(base64, cb) {
	let prefix = "data:image/png;base64,";
	let path = base64.replace(prefix, "");
	let imgBuffer = Buffer.from(path, 'base64');

	// Ensure the image is saved before reading
	fs.writeFile('image.png', imgBuffer, (err) => {
		if (err) {
			console.error("Error saving image:", err);
			return new Response('Failed to save', { status: 500 });
		}
		Jimp.read('./image.png').then(img => {
			const widthInBytes = Math.ceil(img.getWidth() / 8);
			const data = new Array(img.getHeight());
			for (let y = 0; y < img.getHeight(); y++) {
				const row = new Array(widthInBytes);
				for (let b = 0; b < widthInBytes; b++) {
					let byte = 0;
					let mask = 128;
					for (let x = b * 8; x < (b + 1) * 8; x++) {
						if (x < img.getWidth()) {
							const color = Jimp.intToRGBA(img.getPixelColor(x, y));
							if (color.a > 128) { // Consider pixel visible if alpha is greater than 128
								if ((color.r + color.g + color.b) / 3 < 128) { // Check if the pixel is dark
									byte |= mask;
								}
							}
						}
						mask >>= 1;
					}
					row[b] = byte;
				}
				data[y] = row;
			}
			cb(data);
		}).catch(err => {
			console.error("Error reading image:", err);
			return new Response('Failed to process image', { status: 500 });
		});
		try {
			fs.unlinkSync('./image.png')
		} catch (err) {
			console.error(err)
		}
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
	let buffer;
	try {
		getImageData(pngData, (data) => {
			const imgWidthInBytes = data[0].length;
			const imgHeightInDots = data.length;
			buffer = Buffer.concat([
				Buffer.from('SIZE 70 mm,70 mm\r\n'),
				Buffer.from('CLS\r\n'),
				Buffer.from(`BITMAP 0,0,${imgWidthInBytes},${imgHeightInDots},0,`),
				Buffer.from(data.flat()),
				Buffer.from('PRINT 1\r\n'),
				Buffer.from('END\r\n'),
			]);
			// Write buffer to file
			fs.writeFile('buffer.bin', buffer, (err) => {
				if (err) {
					console.error('Failed to write buffer to file', err);
					return new Response('Failed to print', { status: 500 });
				} else {
					console.log('Buffer written to file successfully');
				}
			});
			print(buffer);
		});
		return new Response({ status: 200 });
	} catch (error) {
		console.error(error);
		return new Response('Failed to print', { status: 500 });
	}
}
