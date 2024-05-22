export async function createNametagImage(name, org) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 600;
	canvas.height = 600;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';

	const nameX = canvas.width / 2;
	const nameY = canvas.height / 2;
	const orgX = canvas.width / 2;
	const orgY = canvas.height / 2 + 120;

	ctx.font = '140px Arial';
	ctx.fillText(name, nameX, nameY);
	ctx.font = '40px Arial';
	ctx.fillText(org, orgX, orgY);
	const dataURL = canvas.toDataURL('image/png');
	return dataURL;
}
