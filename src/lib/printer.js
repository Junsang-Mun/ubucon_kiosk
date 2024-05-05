const textEncoder = new TextEncoder();

export function buildBitmapPrintTsplCmd(x, y, imgWidthPx, imgHeightPx,
	canvasWidthMm, canvasHeightMm, imageBitmap) {
	const widthInBytes = Math.ceil(imgWidthPx / 8);
	const cmddata = textEncoder.encode(`SIZE ${canvasWidthMm} mm,${canvasHeightMm} mm\r\n` +
		"CLS\r\n" +
		`BITMAP ${x},${y},${widthInBytes},${imgHeightPx},1, ` +
		imageBitmap +
		"\r\nPRINT 1\r\n" +
		"END\r\n");
	return cmddata;
}

export function buildTestPrintTsplCmd(canvasWidthMm, canvasHeightMm, text) {
	const cmddata = textEncoder.encode(`SIZE ${canvasWidthMm} mm,${canvasHeightMm} mm\r\n` +
		"CLS\r\n" +
		`TEXT 10,50,\"3\",0,1,1,\"${text}\"\r\n` +
		"PRINT 1\r\n" +
		"END\r\n");
	return cmddata;
}

export async function sendDataToPrinter(device, data) {
	await device.open();
	await device.selectConfiguration(1);
	await device.claimInterface(0);
	await device.transferOut(
		device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber, data
	);
	await device.close();
}