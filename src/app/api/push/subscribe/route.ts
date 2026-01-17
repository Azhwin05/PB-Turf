import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient(); // Use await for the async createClient
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await request.json();

  if (!subscription) {
    return NextResponse.json({ error: "No subscription provided" }, { status: 400 });
  }

  // Upsert subscription
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ 
        user_id: user.id, 
        subscription: subscription 
    }, { onConflict: 'user_id' });

  if (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
