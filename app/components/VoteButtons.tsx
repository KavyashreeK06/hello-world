"use client";

import { useState } from "react";

export default function VoteButtons({ captionId }: { captionId: string }) {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    async function submitVote(vote: 1 | -1) {
        setLoading(true);
        setMsg(null);

        const res = await fetch("/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption_id: captionId, vote }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            setMsg(data?.error ?? "Vote failed");
        } else {
            setMsg("Saved!");
        }

        setLoading(false);
    }

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button disabled={loading} onClick={() => submitVote(1)}>
                👍 Upvote
            </button>
            <button disabled={loading} onClick={() => submitVote(-1)}>
                👎 Downvote
            </button>
            {msg && <span style={{ fontSize: 12 }}>{msg}</span>}
        </div>
    );
}