export async function createNametagImage(name, org) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 160;
	canvas.height = 160;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';

	const nameX = canvas.width / 2;
	const nameY = canvas.height / 2;
	const orgX = canvas.width / 2;
	const orgY = canvas.height / 2 + 40;

	ctx.font = '40px Arial';
	ctx.fillText(name, nameX, nameY);
	ctx.font = '15px Arial';
	ctx.fillText(org, orgX, orgY);
	const dataURL = canvas.toDataURL('image/png');
	return dataURL;
	// const binaryString = atob(dataURL.split(',')[1]);
	// const length = binaryString.length;
	// const uint8Array = new Uint8Array(length);
	// for (let i = 0; i < length; i++) {
	// 	uint8Array[i] = binaryString.charCodeAt(i);
	// }
	// return uint8Array;
}
