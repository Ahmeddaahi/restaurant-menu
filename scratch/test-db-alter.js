async function run() {
  const url = "https://ezfcqeavtbbigakszruk.supabase.co/rest/v1/rpc/exec_sql";
  const anonKey = "sb_publishable_oIbZPQzDmTm2yRe7DRWXqg_ofoijtu3";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql: "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url text;",
    }),
  });

  console.log("Status:", res.status);
  const data = await res.text();
  console.log("Response:", data);
}
run();
