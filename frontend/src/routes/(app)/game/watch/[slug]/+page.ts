/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	let slug = params.slug;
	return { slug };
}