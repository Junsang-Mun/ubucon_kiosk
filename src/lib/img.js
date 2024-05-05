export async function createNametagImage(name, org) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 800;
	canvas.height = 800;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';

	const nameX = canvas.width / 2;
	const nameY = canvas.height / 2;
	const orgX = canvas.width / 2;
	const orgY = canvas.height / 2 + 150;

	ctx.font = '200px Arial';
	ctx.fillText(name, nameX, nameY);
	ctx.font = '50px Arial';
	ctx.fillText(org, orgX, orgY);
	const dataURL = canvas.toDataURL('image/png');
	return dataURL;
}
