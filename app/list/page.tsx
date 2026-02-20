import { createClient } from "@/lib/supabase/server";
import SignOutButton from "../protected/signout-button";
import VoteButtons from "../components/VoteButtons";

type CaptionRow = {
    id: string; // uuid
    content: string | null;
    is_public: boolean | null;
    like_count: number | null;
};

export default async function ListPage() {
    const supabase = await createClient();

    // Auth (your page is gated via middleware, but this keeps the UI consistent)
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        return (
            <main style={{ padding: 24 }}>
                <h1>List</h1>
                <pre>{JSON.stringify(userError, null, 2)}</pre>
            </main>
        );
    }

    // Fetch captions (your caption text column is `content`)
    const { data: captions, error: captionsError } = await supabase
        .from("captions")
        .select("id, content, is_public, like_count")
        .eq("is_public", true)
        .order("created_datetime_utc", { ascending: false })
        .returns<CaptionRow[]>();

    if (captionsError) {
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

                <h2>Error loading captions</h2>
                <pre>{JSON.stringify(captionsError, null, 2)}</pre>
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

            <h2>Public Captions</h2>

            {!captions || captions.length === 0 ? (
                <p>No captions found.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
                    {captions.map((c) => (
                        <li
                            key={c.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                padding: 12,
                            }}
                        >
                            {/* ✅ CAPTION TEXT */}
                            <p style={{ margin: 0, marginBottom: 10 }}>
                                {c.content ?? "(no content)"}
                            </p>

                            {/* optional display */}
                            <p style={{ margin: 0, marginBottom: 10, fontSize: 12 }}>
                                like_count: {c.like_count ?? 0}
                            </p>

                            {/* ✅ Voting UI */}
                            <VoteButtons captionId={c.id} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}