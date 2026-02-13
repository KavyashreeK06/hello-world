import { createClient } from "@/lib/supabase/server";
import SignOutButton from "../protected/signout-button";

export default async function ListPage() {
    const supabase = await createClient();

    const { data: userData, error } = await supabase.auth.getUser();

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>List</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </main>
        );
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Gated List Page</h1>

            <div style={{ marginBottom: 16 }}>
                <p>
                    <strong>Signed in as:</strong> {userData.user?.email}
                </p>
                <SignOutButton />
            </div>

            <hr style={{ margin: "24px 0" }} />

            <p>This page is protected via middleware.</p>
            <p>If you can see this, you are authenticated.</p>
        </main>
    );
}
