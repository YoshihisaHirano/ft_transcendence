/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
    cookies.set('user-id', '', {
        path: '/',
        maxAge: 0
    });
    cookies.set('user-token', '', {
        path: '/',
        maxAge: 0
    });
    cookies.set('user-login', '', {
        path: '/',
        maxAge: 0
    });
    return new Response(null);
}