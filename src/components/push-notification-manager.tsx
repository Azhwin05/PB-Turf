"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    // next-pwa registers the SW automatically, we just need to wait for it
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      setSubscription(sub);
      
      // Send subscription to backend
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sub),
          });
          toast.success("Notifications enabled!");
      } else {
          toast.error("Please login to enable notifications");
      }

    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast.error("Failed to enable notifications. Please check your browser settings.");
    }
  }

  async function unsubscribeFromPush() {
    try {
        if(subscription) {
            await subscription.unsubscribe();
            setSubscription(null);
            toast.success("Notifications disabled");
        }
    } catch (error) {
        console.error("Failed to unsubscribe", error);
    }
  }

  async function sendTestNotification() {
    try {
      await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "This is a test notification!", title: "Hello from PB Turf" }),
      });
      toast.success("Test notification sent!");
    } catch (error) {
      console.error("Failed to send test:", error);
      toast.error("Failed to send test notification");
    }
  }

  if (!isSupported) {
    return null; // Or show a message that push is not supported
  }

  return (
    <div className="flex flex-col gap-2 p-4 glass-card rounded-ios-md">
      <h3 className="text-headline font-semibold">Notifications</h3>
      <p className="text-subheadline text-muted-foreground">
        Get notified about booking confirmations and special deals.
      </p>
      
      <div className="flex gap-2 mt-2">
          {subscription ? (
            <>
                <Button variant="outline" onClick={unsubscribeFromPush} className="flex-1">
                <BellOff className="mr-2 h-4 w-4" />
                Disable
                </Button>
                <Button variant="secondary" onClick={sendTestNotification} className="flex-1">
                    Test
                </Button>
            </>
          ) : (
            <Button onClick={subscribeToPush} className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          )}
      </div>
    </div>
  );
}
