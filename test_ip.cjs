async function test() {
  const urls = [
    "https://ipapi.co/json/",
    "https://ipwhois.app/json/",
    "http://ip-api.com/json/"
  ];

  for (const url of urls) {
    try {
      console.log(`\nQuerying ${url}...`);
      const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const d = await r.json();
        console.log("Response:", JSON.stringify({
          ip: d.ip || d.query,
          country: d.country_code || d.countryCode,
          timezone: d.timezone
        }, null, 2));
      } else {
        console.log(`Failed with status: ${r.status}`);
      }
    } catch (e) {
      console.error(`Error querying ${url}:`, e.message);
    }
  }
}

test();
