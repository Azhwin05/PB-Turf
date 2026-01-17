/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
    // Add other config here
    env: {
        NEXT_PUBLIC_SUPABASE_URL: "https://bsaicgzweugkzkyernvx.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzYWljZ3p3ZXVna3preWVybnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzcyMzgsImV4cCI6MjA4MjUxMzIzOH0.PU3WgKAxu0nZ5Gduj6V9t-oYMUddm711zONg3yTUlAM",
    }
};

module.exports = withPWA(nextConfig);
