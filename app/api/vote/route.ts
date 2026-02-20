import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const caption_id = body?.caption_id;
    const vote = body?.vote;

    if (!caption_id || (vote !== 1 && vote !== -1)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const now = new Date().toISOString(); // works for timestamptz

    const { error: insertError } = await supabase.from("caption_votes").insert({
        caption_id,
        profile_id: authData.user.id,
        vote_value: vote,
        created_datetime_utc: now,
        modified_datetime_utc: now,
    });

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}