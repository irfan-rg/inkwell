/**
 * Database Seed Script
 * Populates the database with initial sample data
 * Run with: npm run seed
 */

import { db } from '../server/db';
import { categories } from '../server/db/schema';

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Sample categories to seed
 */
const sampleCategories = [
  {
    name: 'Technology',
    description: 'Articles about programming, software development, AI, and emerging tech trends',
  },
  {
    name: 'Lifestyle',
    description: 'Personal development, health, wellness, and life improvement tips',
  },
  {
    name: 'Tutorial',
    description: 'Step-by-step guides and how-to articles for learning new skills',
  },
  {
    name: 'Opinion',
    description: 'Thought-provoking pieces and personal perspectives on various topics',
  },
  {
    name: 'News',
    description: 'Latest updates, announcements, and trending topics',
  },
];

/**
 * Main seed function
 */
async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Check database connection
    console.log('📡 Checking database connection...');
    
    // Seed categories
    console.log('📚 Seeding categories...');
    
    for (const category of sampleCategories) {
      try {
        const slug = generateSlug(category.name);
        
        await db.insert(categories).values({
          name: category.name,
          slug: slug,
          description: category.description,
        });
        
        console.log(`  ✅ Created category: ${category.name} (${slug})`);
      } catch (error: any) {
        // Handle duplicate entries gracefully
        if (error.code === '23505') {
          console.log(`  ⚠️  Category "${category.name}" already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${sampleCategories.length} items`);
    console.log('\n💡 Next steps:');
    console.log('   1. Verify data in Supabase → Table Editor → categories');
    console.log('   2. Create some blog posts in your application');
    console.log('   3. Assign categories to your posts\n');

  } catch (error) {
    console.error('\n❌ Seed failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    // Close database connection
    console.log('🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the seed function
seed();
