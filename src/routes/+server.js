async function checkIn(key) {
	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split("_")[0];
	const baseName = "UCK24-Attendee";
	const dbUrl = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${key}`;
	const headers = {
		"X-API-Key": dataKey,
		"Content-Type": "application/json",
	};
	const body = {
		// "key": key,
		"set": {
			"checkInTime": new Date().toLocaleString("ko-kr"),
			"checkedIn": true
		}
	}
	const response = await fetch(dbUrl, {
		method: "PATCH",
		headers: headers,
		body: JSON.stringify(body)
	});
	if (!response.ok)
		return false;
	return true;
}

export async function GET({ url }) {
	const key = url.searchParams.get('key');

	// Ensure the key is present
	if (!key) {
		return new Response('Key is required', { status: 400 });
	}

	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const dbUrl = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${key}`;
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};

	try {
		const response = await fetch(dbUrl, {
			method: 'GET',
			headers,
		});

		// Check if the response is successful
		if (!response.ok) {
			return new Response(`Failed to fetch data: ${response.statusText}`, { status: response.status });
		}

		const data = await response.json();
		if (data.checkedIn === true) {
			return new Response('User already checked in', { status: 501 })
		}

		if (checkIn(key) === false) {
			return new Response('Failed to check in');
		}

		return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		console.error(error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
