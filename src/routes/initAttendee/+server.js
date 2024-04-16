export async function GET({ url }) {
	// console.log('Received data:', url);
	const key = url.searchParams.get('key');
	const mail = url.searchParams.get('email');
	const name = url.searchParams.get('name');
	const org = url.searchParams.get('org');
	console.log('Received data:', key, mail, name, org);

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

// try {
// 	const { key, mail, name, org } = request.body;
// 	// const key = request.key;
// 	// const mail = request.mail;
// 	// const name = request.name;
// 	// const org = request.org;

// 	console.log('Received data:', key, mail, name, org);

// 	const dataKey = import.meta.env.VITE_API_KEY;
// 	const projectId = dataKey.split('_')[0];
// 	const baseName = 'UCK24-Attendee';
// 	const url = `https://database.deta.sh/v1/${projectId}/${baseName}/items`;
// 	const headers = {
// 		'X-API-Key': dataKey,
// 		'Content-Type': 'application/json',
// 	};
// 	const body = JSON.stringify({
// 		item: {
// 			key,
// 			mail,
// 			name,
// 			organization: org,
// 			checkedIn: false,
// 			checkInTime: null
// 		}
// 	});

// 	// Make a POST request to the database
// 	const postResponse = await fetch(url, {
// 		method: 'POST',
// 		headers,
// 		body
// 	});

// 	if (!postResponse.ok) {
// 		console.error('Failed to post data to the database');
// 		return new Response('Failed to post data to the database', { status: 500 });
// 	}

// 	// If the POST request is successful, return the response
// 	return new Response('200');
// } catch (error) {
// 	console.error('An error occurred:', error);
// 	return new Response('Internal Server Error', { status: 500 });
// }
