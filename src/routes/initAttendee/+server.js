export async function GET({ url }) {
	const key = url.searchParams.get('key');
	const mail = url.searchParams.get('email');
	const name = url.searchParams.get('name');
	const org = url.searchParams.get('org');

	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const dbUrl = `https://database.deta.sh/v1/${projectId}/${baseName}/items`;
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({
		item: {
			key,
			mail,
			name,
			organization: org,
			checkedIn: false,
			checkInTime: null
		}
	});

	const postResponse = await fetch(dbUrl, {
		method: 'POST',
		headers,
		body
	});

	if (!postResponse.ok) {
		console.error('Failed to post data to the database');
		return new Response('Failed to post data to the database', { status: 500 });
	} else {
		console.log('Data posted to the database');
	}

	return new Response('200');
}
