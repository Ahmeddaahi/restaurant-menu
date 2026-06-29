async function run() {
  const url = 'https://yrsthptcicraywyzlrfc.supabase.co/rest/v1/categories?limit=1';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyc3RocHRjaWNyYXl3eXpscmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDc0MzgsImV4cCI6MjA5MjUyMzQzOH0.aIXHyA0j20gwIMi5XXhupiYDcan2tWkJq4D_WMjaWC0';
  
  const res = await fetch(url, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  });
  
  const data = await res.json();
  console.log('Categories row:', JSON.stringify(data));
}
run();
