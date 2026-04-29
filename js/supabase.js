/**
 * Supabase Client Initialization
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://yrsthptcicraywyzlrfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyc3RocHRjaWNyYXl3eXpscmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDc0MzgsImV4cCI6MjA5MjUyMzQzOH0.aIXHyA0j20gwIMi5XXhupiYDcan2tWkJq4D_WMjaWC0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
