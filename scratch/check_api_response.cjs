async function run() {
  try {
    const res = await fetch('http://localhost:3001/api/teams');
    if (res.ok) {
      const data = await res.json();
      console.log("First team translations from API:");
      console.log(JSON.stringify(data.teams[0].translations, null, 2));
    } else {
      console.error("API response status:", res.status);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
