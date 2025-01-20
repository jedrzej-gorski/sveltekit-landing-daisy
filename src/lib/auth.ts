import { redirect, type Cookies } from '@sveltejs/kit';

async function sendSignInRequest(username: string | null, password: string | null) {
    const response = await fetch('http://localhost:8000/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
        console.error('Login failed:', responseData);
        return null;
    }

    return responseData.token;

}

export async function signIn({ request, cookies }: { request: Request; cookies: Cookies }) {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    try {
        console.log("signIn called")
        const token: string | null = await sendSignInRequest(username as string, password as string);
        
        if (!token) {
            return {
                success: false,
                error: "Invalid credentials"
            }
        }

        // Store the token in an HTTP-only cookie
        cookies.set('session', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    } catch (error) {
        console.error('Sign in error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred during sign in' 
        };
    }

    // Redirect outside the try-catch block
    throw redirect(303, '/');
}

export async function signUp({ request, cookies }: { request: Request; cookies: Cookies }) {
    const data = await request.formData();

    const username = data.get('username_new');
    const first_name = data.get('first_name');
    const last_name = data.get('last_name');
    const password = data.get('password_register');
    const email = data.get('email');

    try {
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, first_name, last_name, password }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Sign-up failed:', responseData);
            return { 
                success: false, 
                error: responseData.detail || 'Invalid credentials' 
            };
        }

        const token: string | null = await sendSignInRequest(username as string, password as string);

        if (!token) {
            return {
                success: false,
                error: "Invalid credentials (during sign-up)"
            }
        }
        
        // Store the token in an HTTP-only cookie
        cookies.set('session', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    } catch (error) {
        console.error('Sign up error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An error occurred during sign up' 
        };
    }

    // Redirect outside the try-catch block
    throw redirect(303, '/');
}

export async function getCurrentUser(fetch: Function, token: string) {
    console.log("called getCurrentUser")
    console.log(token)
    try {
        const response = await fetch('http://localhost:8000/api/user/current/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to get current user:', await response.text());
            return null;
        }

        const userData = await response.json();
        console.log('Current user data:', userData);
        return userData;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

export async function signOut({ cookies }: { cookies: Cookies }) {
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/');
}