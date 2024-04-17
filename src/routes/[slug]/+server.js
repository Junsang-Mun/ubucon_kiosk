export async function GET({ url }) {
	const key = url.searchParams.get('userKey');
	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};
	const patchUrl = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${key}`;
	const data = {
		set: {
			checkedIn: true,
			checkInTime: new Date().toJSON()
		}
	}

	const postResponse = await fetch(patchUrl, {
		method: 'PATCH',
		headers,
		body: JSON.stringify(data)
	});

	if (!postResponse.ok) {
		console.error('Failed to post data to the database');
		return new Response(500);
	}

	if (!postResponse.ok)
		return new Response(404);

	return new Response(200);
}