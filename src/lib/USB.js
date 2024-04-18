export async function requestUSBDevice() {
	try {
		const device = await navigator.usb.requestDevice({ filters: [] });
		device.open();
		return device;
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

export async function forgetDevice(device) {
	try {
		await device.forget();
		console.log('Device forgotten successfully!');
	} catch (e) {
		console.error('Failed to forget device:', e);
	}
}
