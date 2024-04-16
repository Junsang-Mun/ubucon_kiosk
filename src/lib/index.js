export async function postDataToDatabase(slug) {
	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};
	const url = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${slug}`;
	const data = {
		set: {
			checkedIn: true,
			checkInTime: new Date().toJSON()
		}
	}
	// Make a PATCH request to the database
	const postResponse = await fetch(url, {
		method: 'PATCH',
		headers,
		body: JSON.stringify(data)
	});

	if (!postResponse.ok) {
		// Handle error if the PATCH request fails
		console.error('Failed to post data to the database');
		return {
			status: postResponse.status,
			body: {
				error: 'Failed to post data to the database'
			}
		};
	}

	// If the PATCH request is successful, return the response
	return await postResponse.json();
}
