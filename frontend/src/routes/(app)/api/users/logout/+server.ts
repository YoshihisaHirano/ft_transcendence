/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies }) {
    cookies.delete('user-id', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: false
    });
    cookies.delete('user-token', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: false
    });
    cookies.delete('user-login', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: false
    });
    return new Response(null);
}