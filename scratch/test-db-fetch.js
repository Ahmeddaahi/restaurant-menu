async function run() {
  const url =
    "https://ezfcqeavtbbigakszruk.supabase.co/rest/v1/categories?limit=1";
  const anonKey = "sb_publishable_oIbZPQzDmTm2yRe7DRWXqg_ofoijtu3";

  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  const data = await res.json();
  console.log("Categories row:", JSON.stringify(data));
}
run();
