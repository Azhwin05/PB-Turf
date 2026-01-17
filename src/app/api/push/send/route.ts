import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Optional: Restrict sending to admins only
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body for specific message or target (defaulting to test)
  const body = await request.json().catch(() => ({}));
  const { message = "Hello from PB Turf!", title = "Notification Test", userId } = body;

  let query = supabase.from("push_subscriptions").select("*");
  
  // If userId provided, target specific user, else confirm it's a test for the sender
  if (userId) {
      query = query.eq("user_id", userId);
  } else {
      // Default to sending to the requesting user for testing
      query = query.eq("user_id", user.id);
  }

  const { data: subscriptions, error } = await query;

  if (error || !subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ error: "No subscriptions found" }, { status: 404 });
  }

  const payload = JSON.stringify({
    title,
    message,
    icon: "/icon-192x192.png", // Ensure these exist
    url: "/"
  });

  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        return { success: true, id: sub.id };
      } catch (err) {
        console.error("Error sending push:", err);
        return { success: false, id: sub.id, error: err };
      }
    })
  );

  return NextResponse.json({ results });
}
