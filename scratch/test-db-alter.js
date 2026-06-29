async function run() {
  const url = 'https://yrsthptcicraywyzlrfc.supabase.co/rest/v1/rpc/exec_sql';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyc3RocHRjaWNyYXl3eXpscmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDc0MzgsImV4cCI6MjA5MjUyMzQzOH0.aIXHyA0j20gwIMi5XXhupiYDcan2tWkJq4D_WMjaWC0';
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url text;'
    })
  });
  
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Response:', data);
}
run();
