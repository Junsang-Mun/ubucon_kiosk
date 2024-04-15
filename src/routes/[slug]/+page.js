export async function load({ params }) {
	const dataKey = import.meta.env.VITE_API_KEY;
	const projectId = dataKey.split('_')[0];
	const baseName = 'UCK24-Attendee';
	const headers = {
		'X-API-Key': dataKey,
		'Content-Type': 'application/json',
	};
	const url = `https://database.deta.sh/v1/${projectId}/${baseName}/items/${params.slug}`;

	const res = await fetch(url, { headers });
	const data = await res.json();
	return data;
}
