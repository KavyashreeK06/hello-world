"use client";

import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const supabase = createClient();
    const router = useRouter();

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return <button onClick={signOut}>Sign out</button>;
}
