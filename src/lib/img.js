export function createNametagImagePng(name, org) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 500;
	canvas.height = 500;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';

	const nameX = canvas.width / 2;
	const nameY = canvas.height / 2;
	const orgX = canvas.width / 2;
	const orgY = canvas.height / 2 + 70;

	ctx.font = '100px Arial';
	ctx.fillText(name, nameX, nameY);
	ctx.font = '35px Arial';
	ctx.fillText(org, orgX, orgY);

	const dataUrl = canvas.toDataURL("image/png");
	return dataUrl;
}


export function pngToUint8(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const imgData = ctx.getImageData(0, 0, img.width, img.height);
			const data = new Uint8Array(imgData.data);
			resolve(data);
		};
		img.src = url;
	});
}