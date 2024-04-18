export async function requestUSBDevice() {
	if (!('usb' in navigator)) {
		console.log('WebUSB API is not supported!');
	} else {
		console.log('WebUSB API is supported!');
	}

	try {
		const device = await navigator.usb.requestDevice({ filters: [] });
		console.log(device);
	} catch (e) {
		console.error(e);
	}
}

export async function getDevices() {
	const devices = await navigator.usb.getDevices();
	devices.forEach((device) => {
		console.log(`Name: ${device.productName}, Serial: ${device.serialNumber}`);
	});
	return devices;
}
