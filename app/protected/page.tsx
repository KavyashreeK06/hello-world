import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./signout-button";

export default async function ProtectedPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        // Middleware should prevent reaching here, but keep this as backup
        return (
            <main style={{ padding: 24 }}>
                <h1>Not authorized</h1>
            </main>
        );
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Protected</h1>
            <p>Signed in as: {data.user.email}</p>
            <SignOutButton />
        </main>
    );
}
