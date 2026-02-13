"use client";

import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
    const supabase = createClient();

    const signInWithGoogle = async () => {
        const origin = window.location.origin;

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`, // MUST be /auth/callback
            },
        });
    };

    return (
        <main style={{ padding: 24 }}>
            <h1>Login</h1>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </main>
    );
}
