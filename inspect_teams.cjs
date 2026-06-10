async function run() {
  let res;
  try {
    res = await fetch("http://worldcup26.ir:3050/get/teams");
  } catch (err) {
    console.warn("Domain failed, trying IP...");
    res = await fetch("http://82.115.13.31:3050/get/teams");
  }
  const data = await res.json();
  const teams = data.teams || [];
  const arg = teams.find(t => t.name_en.toLowerCase().includes("argentina"));
  console.log("Remote Argentina:", JSON.stringify(arg, null, 2));
  console.log("Remote Team keys:", Object.keys(teams[0] || {}));
}
run();
