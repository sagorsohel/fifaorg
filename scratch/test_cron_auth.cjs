async function run() {
  const url = "http://localhost:3000/api/cron/sync";

  console.log("1. Testing unauthorized request (should fail)...");
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }

  console.log("\n2. Testing with query parameter ?secret=super_secret_token_123 (should succeed)...");
  try {
    const res = await fetch(`${url}?secret=super_secret_token_123`);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log("Response success status:", data.success);
    console.log("Synced details:", data.synced);
  } catch (err) {
    console.error("Error:", err.message);
  }

  console.log("\n3. Testing with Authorization Bearer header (should succeed)...");
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer super_secret_token_123",
      },
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log("Response success status:", data.success);
    console.log("Synced details:", data.synced);
  } catch (err) {
    console.error("Error:", err.message);
  }

  console.log("\n4. Testing with x-vercel-cron header (should succeed)...");
  try {
    const res = await fetch(url, {
      headers: {
        "x-vercel-cron": "true",
      },
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log("Response success status:", data.success);
    console.log("Synced details:", data.synced);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
