async function run() {
  let res;
  try {
    res = await fetch("http://worldcup26.ir:3050/get/groups");
  } catch (err) {
    console.warn("Domain failed, trying IP...");
    res = await fetch("http://82.115.13.31:3050/get/groups");
  }
  const data = await res.json();
  console.log("Groups keys:", Object.keys(data));
  if (data.groups && data.groups.length > 0) {
    console.log("First group:", JSON.stringify(data.groups[0], null, 2));
  } else {
    console.log("No groups found, full response:", JSON.stringify(data, null, 2));
  }
}
run();
