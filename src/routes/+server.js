export async function GET({ url }) {
	const key = url.searchParams.get('key');

	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const dbUrl = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${key}`;
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};
	const response = await fetch(dbUrl, {
		method: 'GET',
		headers,
	});

	console.log(response);
	return new Response({
		'key': key,
		'name': response
	}, 200)
}