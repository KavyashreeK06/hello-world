import { supabase } from "../lib/supabaseClient";

export default async function ListPage() {
    const { data, error } = await supabase
        .from("captions") // keep your real table name here
        .select("content, created_datetime_utc, is_featured")
        .order("created_datetime_utc", { ascending: false })
        .limit(20);

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
            <h1>List</h1>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {data?.map((row) => (
                    <li
                        key={row.id}
                        style={{
                            marginBottom: 16,
                            padding: 12,
                            border: "1px solid #444",
                            borderRadius: 6,
                        }}
                    >
                        <p>{row.content}</p>
                        <small>
                            Likes: {row.like_count} ·{" "}
                            {new Date(row.created_datetime_utc).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>
        </main>
    );
}
