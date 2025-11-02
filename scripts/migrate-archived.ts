// Run this migration to add archived field to posts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running migration: Add archived field to posts...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'drizzle', '0003_add_archived_field.sql'),
      'utf8'
    );

    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      // If rpc doesn't exist, try direct SQL execution
      console.log('Trying direct SQL execution...');
      
      // Add column if not exists
      const { error: error1 } = await supabase.from('posts').select('archived').limit(1);
      
      if (error1?.message?.includes('column "archived" does not exist')) {
        console.log('Column does not exist, needs manual migration via Supabase dashboard');
        console.log('Please run this SQL in your Supabase SQL Editor:');
        console.log(sql);
        process.exit(1);
      } else {
        console.log('Migration already applied or column exists');
      }
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
