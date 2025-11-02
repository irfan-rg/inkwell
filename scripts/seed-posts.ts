import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Post {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryIds: string[];
  published: boolean;
}

interface Category {
  name: string;
  slug: string;
  description: string;
}

const categories: Category[] = [
  {
    name: "Technology",
    slug: "technology",
    description: "Latest trends, tools, and insights in tech",
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Travel stories and destination guides",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Personal growth, wellness, and daily life",
  },
  {
    name: "Food",
    slug: "food",
    description: "Recipes, food reviews, and culinary adventures",
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Photography tips, techniques, and inspiration",
  },
];

const charonPosts: Post[] = [
  {
    title: "The Future of AI: Transforming Our Digital Landscape",
    slug: "future-of-ai-transforming-digital",
    excerpt: "Exploring how artificial intelligence is reshaping industries, society, and our daily lives.",
    content: `# The Future of AI: Transforming Our Digital Landscape

Artificial intelligence has transcended the realm of science fiction and become an integral part of our reality. From virtual assistants to autonomous vehicles, AI is reshaping how we live, work, and interact with technology.

## Current State of AI

The AI revolution is already underway. Machine learning models are processing unprecedented amounts of data, enabling:

- **Healthcare Breakthroughs**: Early disease detection and personalized treatment plans
- **Business Automation**: Intelligent systems handling complex workflows
- **Creative Tools**: AI-assisted design, writing, and content creation
- **Scientific Research**: Accelerating discoveries in physics, biology, and chemistry

## The Challenges Ahead

While promising, AI development faces significant hurdles:

\`\`\`python
# Example: Ethical AI consideration
def make_decision(data):
    # Must consider bias and fairness
    prediction = model.predict(data)
    if is_biased(prediction):
        return manual_review(data)
    return prediction
\`\`\`

### Key Concerns:

1. **Bias and Fairness**: Ensuring AI systems don't perpetuate discrimination
2. **Privacy**: Protecting personal data used in training
3. **Job Displacement**: Rethinking education and workforce development
4. **Accountability**: Establishing clear responsibility frameworks

## The Road Ahead

The next decade will be crucial. We need:

> *"AI should amplify human capabilities, not replace human judgment. The goal is augmented intelligence, not artificial replacement."* — Industry Expert

Investment in ethical AI, diverse teams, and regulatory frameworks will determine whether AI becomes a force for universal benefit or concentrated power.

## Conclusion

AI's future isn't predetermined. Through thoughtful development, inclusive practices, and wise governance, we can shape AI to solve humanity's greatest challenges while respecting human values and dignity.

The future is being written now.`,
    coverImage: "https://images.unsplash.com/photo-1677442d019cecf8d87b1c2a64c4d048?w=1200",
    categoryIds: ["technology"],
    published: true,
  },
  {
    title: "Minimalism: A Life of Less, Freedom of More",
    slug: "minimalism-less-freedom-more",
    excerpt: "Discover how embracing minimalism can declutter your space, mind, and life.",
    content: `# Minimalism: A Life of Less, Freedom of More

In a world of endless consumption, minimalism emerges as a radical act of freedom. It's not just about having fewer possessions—it's a philosophy of intentional living.

## What Is Minimalism?

Minimalism is the deliberate practice of owning only what adds value to your life. It's about:

- Reducing physical clutter
- Simplifying decision-making
- Focusing on experiences over possessions
- Creating mental clarity

## The Benefits

### Financial Freedom
By consuming less, you:
- Save more money
- Reduce debt
- Invest in meaningful pursuits

### Mental Clarity
\`\`\`
Clutter → Stress
Simplicity → Peace
\`\`\`

A minimalist space leads to a minimalist mind. Less mental noise means more focus on what truly matters.

### Environmental Impact
- Reduced consumption = smaller carbon footprint
- Fewer resources wasted
- Sustainable lifestyle choices

## How to Start

**Week 1-2**: Assess your possessions
- Go through each room
- Ask: "Does this add value?"
- Create piles: Keep, Donate, Sell

**Week 3-4**: Simplify systems
- Implement storage solutions
- Digitize documents
- Organize remaining items

**Ongoing**: Mindful consumption
- Before buying, ask "Do I need this?"
- Invest in quality over quantity
- Embrace the "one in, one out" rule

## Common Challenges

> "Minimalism sounds nice, but what about memories and sentimental items?"

Keep what truly matters. Digitize photos, display meaningful items, and let go of guilt-driven possessions.

## The Ultimate Goal

Minimalism isn't about deprivation—it's about liberation. By owning less, you free yourself to:

1. Pursue your passions
2. Spend time with loved ones
3. Explore new experiences
4. Build a life aligned with your values

The goal isn't zero possessions; it's intentional living.`,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    categoryIds: ["lifestyle"],
    published: true,
  },
  {
    title: "Capturing Moments: A Beginner's Guide to Photography",
    slug: "capturing-moments-beginners-guide",
    excerpt: "Learn the fundamentals of photography and start capturing stunning images today.",
    content: `# Capturing Moments: A Beginner's Guide to Photography

Photography is the art of capturing light and transforming it into visual stories. Whether you're using a smartphone or a professional camera, these fundamentals will elevate your photography game.

## Understanding the Triangle: Exposure

Every photograph is determined by three elements:

### Aperture (f-stop)
- Controls the amount of light entering the lens
- Lower f-number (f/1.8) = wider aperture, more light, blurred background
- Higher f-number (f/16) = narrower aperture, less light, sharp background

### Shutter Speed
- Determines how long light hits the sensor
- Fast shutter (1/1000s) = freezes action
- Slow shutter (1s) = captures motion blur

### ISO
- Sensor's sensitivity to light
- Low ISO (100) = less noise, needs more light
- High ISO (3200) = more noise, works in dim light

## Composition Techniques

### The Rule of Thirds
Divide your frame into 9 sections and place subjects on the lines or intersections.

### Leading Lines
Use natural lines (roads, rivers, horizons) to guide the viewer's eye.

### Depth of Field
Create dimension by having clear foreground, subject, and background.

## Lighting: The Soul of Photography

| Lighting Type | Best For | Time |
|---|---|---|
| Golden Hour | Portraits, landscapes | Sunrise/Sunset |
| Harsh Midday | Dramatic shadows, contrast | Noon |
| Blue Hour | Moody, atmospheric | Twilight |
| Overcast | Soft, even lighting | Cloudy days |

## Practical Tips

1. **Practice the fundamentals** before investing in expensive gear
2. **Shoot in RAW format** for maximum editing flexibility
3. **Study composition** by analyzing photos you admire
4. **Experiment constantly** - delete bad shots, learn from good ones
5. **Tell a story** with your images, not just document

## Editing: The Final Touch

\`\`\`
Raw File → Exposure Correction → Color Grading → Details → Export
\`\`\`

Great photography is 50% capture, 50% editing.

## Your Photography Journey

> "The best camera is the one you have with you."

Start wherever you are. Every master photographer began as a beginner. The only difference between them and you is persistence.`,
    coverImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200",
    categoryIds: ["photography"],
    published: true,
  },
  {
    title: "Japan: A Journey Through Tradition and Innovation",
    slug: "japan-tradition-innovation-journey",
    excerpt: "Explore Japan's unique blend of ancient temples and cutting-edge technology.",
    content: `# Japan: A Journey Through Tradition and Innovation

Japan is a land where centuries-old temples stand beside gleaming skyscrapers, where traditional tea ceremonies coexist with robot restaurants. It's a destination that challenges your perceptions of what's possible.

## The Spiritual Side: Kyoto

### Fushimi Inari Shrine
Thousands of vermillion torii gates form tunnels up the mountainside. The scale is overwhelming, the experience transcendent.

### Arashiyama Bamboo Grove
Walking through towering bamboo groves, you're transported to another world. The light filters through in ethereal rays, and silence envelops you.

## The Modern Marvel: Tokyo

Tokyo is a sensory overload in the best way:

- **Shibuya Crossing**: 3,000 people cross simultaneously
- **Akihabara**: Electric wonderland of anime and tech
- **Teamlab Borderless**: Mind-bending digital art installations

## Culinary Discoveries

### Must-Try Experiences
1. **Ramen Alley**: Steaming bowls of soul-warming noodles
2. **Izakaya**: Casual pubs with sake and small plates
3. **Convenience Stores**: Surprisingly excellent meals 24/7

> "Japanese convenience store food rivals many restaurants."

### The Philosophy of Food
- **Seasonality**: Each season has its signature dishes
- **Presentation**: Food is art plated beautifully
- **Simplicity**: Letting ingredients shine

## Practical Tips

\`\`\`markdown
- Get a JR Pass for unlimited train travel
- Cash is king (many places don't accept cards)
- Respect temple etiquette
- Learn basic phrases for gratitude
- Don't pour your own drinks
\`\`\`

## Hidden Gems

- **Kanazawa**: Stunning gardens away from crowds
- **Takayama**: Mountain town with traditional charm
- **Naoshima**: Island sanctuary of contemporary art

## Why Japan?

Japan teaches us that progress and tradition aren't mutually exclusive. In Kyoto, you see centuries of wisdom. In Tokyo, you see tomorrow's possibilities. Together, they create a destination that forever changes how you see the world.

Your next adventure awaits.`,
    coverImage: "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=1200",
    categoryIds: ["travel"],
    published: true,
  },
  {
    title: "The Art of Sourdough: Mastering Ancient Bread",
    slug: "art-sourdough-mastering-ancient-bread",
    excerpt: "Learn the science and soul behind crafting perfect sourdough bread at home.",
    content: `# The Art of Sourdough: Mastering Ancient Bread

Sourdough is more than bread—it's a living ecosystem. It's fermentation, biology, patience, and passion combined into one perfect loaf.

## The Foundation: The Starter

Your sourdough starter is a living culture of wild yeast and bacteria. Creating one:

**Days 1-3**: Mix flour and water daily
**Days 4-7**: Starter becomes active and bubbly
**Day 7+**: Ready to bake

\`\`\`
Day 1: 50g flour + 50g water
Day 2: Discard half, add 50g flour + 50g water
Day 3: Repeat
...continue for 7 days
\`\`\`

## The Fermentation Process

### Bulk Fermentation (4-6 hours)
- Mix flour, water, salt, and starter
- Perform "stretch and folds" every 30 minutes for 2 hours
- Allow dough to rise and develop flavor

### Cold Fermentation (8-48 hours)
- Refrigerate shaped dough
- Develops complex flavors
- Makes scoring easier

## The Crumb Structure

| Fermentation Time | Characteristics |
|---|---|
| Short (8 hours) | Tight crumb, less sour |
| Medium (18 hours) | Open crumb, balanced flavor |
| Long (48 hours) | Very open, tangy, digestible |

## Scoring & Baking

The score isn't decorative—it controls how your bread expands:

1. Score with a sharp blade at 45-degree angle
2. Bake in Dutch oven at 450°F
3. 20 minutes covered, 25 minutes uncovered
4. Internal temperature should reach 205-210°F

## Troubleshooting

> **Dense crumb?** Your starter might not be active enough. Feed it more frequently and ensure it doubles after feeding.

> **Flat loaves?** You may be overproofing. The "poke test" is your guide—if dough springs back slowly, it's ready.

## The Reward

There's nothing quite like:
- The crackle of the crust breaking under your knife
- The open, irregular crumb structure
- The complex, tangy flavor developed over days of fermentation
- The aroma filling your entire home

## Why Sourdough?

Sourdough is slower, it requires attention, and it teaches patience. In a world of instant gratification, sourdough reminds us that the best things take time.

Start your starter today. Your future self will thank you.`,
    coverImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
    categoryIds: ["food"],
    published: true,
  },
];

const jamiePosts: Post[] = [
  {
    title: "Web3 and the Decentralized Future: Beyond the Hype",
    slug: "web3-decentralized-future-beyond-hype",
    excerpt: "Understanding blockchain, crypto, and the real potential of decentralized technology.",
    content: `# Web3 and the Decentralized Future: Beyond the Hype

Web3 represents a fundamental shift in how we think about the internet. But beneath the NFT bubble and crypto volatility lies a genuine technological revolution.

## Understanding the Layers

### Web1: The Read Internet (1990s-2000s)
- Static websites
- One-way communication
- Limited user participation

### Web2: The Read-Write Internet (2000s-Present)
- Social media, user-generated content
- Centralized platforms own your data
- Algorithm-driven feeds

### Web3: The Read-Write-Own Internet
- Decentralized ownership
- Users control their data
- Direct peer-to-peer transactions

## The Technology Behind Web3

### Blockchain
\`\`\`
Block 1 → Block 2 → Block 3
[Hash] [Data] → [Hash] [Data] → [Hash] [Data]
\`\`\`

An immutable ledger creating trust without a central authority.

### Smart Contracts
Self-executing code that powers:
- Defi (Decentralized Finance)
- NFTs (Digital ownership)
- DAOs (Decentralized Autonomous Organizations)

## Real-World Applications

| Use Case | Current Reality | Web3 Potential |
|---|---|---|
| Financial Services | Banks as intermediaries | Peer-to-peer transactions |
| Identity | Centralized databases | Self-sovereign identity |
| Creative Work | Platform ownership | Direct artist-to-fan sales |
| Voting | Centralized systems | Transparent, verifiable voting |

## The Challenges

1. **Environmental Impact**: Energy consumption of Proof-of-Work systems
2. **Regulatory Uncertainty**: Governments still defining frameworks
3. **User Experience**: Still too complex for mainstream adoption
4. **Scalability**: Network congestion and high fees
5. **Irreversibility**: Mistakes can't be undone on-chain

## The Promise vs. The Reality

> "Web3 isn't about making everything decentralized. It's about choosing what should be decentralized based on the problem."

Not everything needs blockchain. Some applications genuinely benefit from decentralization:
- Financial systems
- Censorship-resistant publishing
- Transparent governance
- Creative ownership

## The Future Landscape

By 2030, we'll likely see:
- Hybrid systems combining centralization and decentralization
- Mainstream adoption of self-sovereign identity
- Environmental improvements in blockchain technology
- Clearer regulatory frameworks
- Consumer applications seamlessly using Web3 without users knowing

## Conclusion

Web3 isn't the internet revolution that will happen tomorrow. It's a gradual shift in how value and data flow through the internet. The companies built on these principles over the next 5-10 years will shape the digital landscape for decades.

The future is decentralized, but not overnight.`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-adf4e566c539?w=1200",
    categoryIds: ["technology"],
    published: true,
  },
  {
    title: "The Nordic Lifestyle: Finding Balance in Modern Life",
    slug: "nordic-lifestyle-finding-balance",
    excerpt: "Exploring Scandinavian principles of hygge, work-life balance, and well-being.",
    content: `# The Nordic Lifestyle: Finding Balance in Modern Life

The Nordic countries consistently rank highest in happiness indices. What's their secret? It's not about luxury—it's about balance, simplicity, and intentional living.

## Hygge: The Danish Concept of Coziness

Hygge (pronounced 'hoo-gah') isn't just candles and blankets. It's:

- **Connection**: Spending quality time with loved ones
- **Atmosphere**: Warm lighting, comfortable spaces
- **Presence**: Being fully engaged without distractions
- **Simple Pleasures**: Hot drinks, good conversation, laughter

## Work-Life Balance: The Nordic Model

Nordic countries have cracked the code:

### The Numbers
- Average work week: 37-40 hours
- Vacation time: 25-30 days annually
- Parental leave: 12+ months
- High productivity despite fewer hours

### The Philosophy
Work is important, but not at the expense of well-being. The result? Healthier, more productive workers and stronger communities.

## Nature Connection

Scandinavians have a tradition called "Friluftsliv" (open-air life):

\`\`\`
Friluftsliv = Freedom + Air + Life
\`\`\`

Whether hiking, cycling, or simply being outdoors, nature is medicine.

## Design: Function Meets Minimalism

Nordic design is:
- **Functional**: Everything serves a purpose
- **Minimal**: No unnecessary ornamentation
- **Quality**: Built to last generations
- **Sustainable**: Environmentally conscious

## The Social Safety Net

Nordic success isn't just individual—it's systemic:

| System | Benefit |
|---|---|
| Universal Healthcare | Health without financial burden |
| Education (Free) | Equal opportunity for all |
| Strong Labor Laws | Worker protection |
| Social Welfare | Safety net for all |

## How to Embrace Nordic Principles

### 1. Prioritize Presence
- Create tech-free family time
- Practice active listening
- Engage fully in conversations

### 2. Simplify Your Space
- Invest in quality, minimal furniture
- Create a cozy nook
- Let go of excess

### 3. Connect with Nature
- Weekly outdoor time
- Embrace all seasons
- Find peace in stillness

### 4. Advocate for Balance
- Set work boundaries
- Use your vacation time
- Protect family time fiercely

## The Takeaway

> "Happiness isn't about having everything. It's about appreciating what you have and who you're with."

You don't need to move to Denmark to embrace Nordic principles. Start today by choosing balance, quality, and connection.

Your well-being is worth it.`,
    coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
    categoryIds: ["lifestyle"],
    published: true,
  },
  {
    title: "Street Photography: Finding Stories in Urban Life",
    slug: "street-photography-urban-stories",
    excerpt: "Master the art of candid street photography and capture the essence of city life.",
    content: `# Street Photography: Finding Stories in Urban Life

Street photography is the art of finding decisive moments in everyday urban life. It's about patience, observation, and the courage to see beauty in the mundane.

## The Philosophy

Street photography isn't about tourists and monuments. It's about:

- **Real moments**: Unposed, authentic emotions
- **Human connection**: Stories of everyday people
- **Visual narrative**: Telling stories with images
- **Serendipity**: Being ready when moments happen

> "Your first 10,000 photographs are your worst." — Henri Cartier-Bresson

## Essential Techniques

### Composition for Street Photography

**Layering**: Create depth with foreground, subject, background
- Adds dimension and story
- Makes simple scenes complex

**Framing**: Use architecture to frame subjects
- Creates natural focus
- Adds context and environment

**Lines and Patterns**: Guide the viewer through the image
- Converging lines create depth
- Patterns draw and hold attention

## The Technical Side

### Camera Settings

\`\`\`
Shutter Speed: 1/125 - 1/250 (freeze motion without blur)
Aperture: f/5.6 - f/11 (deep focus for street scenes)
ISO: Auto (balance grain with exposure)
Focus: Zone or zone focus for ready shots
\`\`\`

### Lens Choice
- 35mm: Natural, close-up perspective
- 50mm: Versatile, classic street photography
- 85mm: Compressed, more intimate views

## Ethical Considerations

Street photography lives in a gray area. Be respectful:

1. **Ask permission** when comfortable
2. **Respect privacy** - blur faces if requested
3. **Know local laws** regarding photography in public
4. **Photograph with intention**, not exploitation
5. **Be discrete** - blend in, don't draw attention

## Finding Your Vision

### Location Scouting
- Find neighborhoods with visual interest
- Study light at different times
- Revisit locations repeatedly
- Notice human patterns and behaviors

### Timing and Light
- Golden hour: warm, flattering light
- Overcast days: even, shadowless light
- Shadows: dramatic, graphic elements
- Night: neon, artificial light creates mood

## Building Your Series

Great street photography isn't single images—it's series with themes:

| Theme | Focus |
|---|---|
| Reflections | Using windows and puddles for layers |
| Isolation | Solitude in crowded spaces |
| Contrast | Playing with light and shadow |
| Geometry | Urban lines and patterns |
| Emotion | Capturing decisive human moments |

## Processing and Presentation

Street photography editing should be subtle:
- Maintain blacks and whites
- Preserve grain
- Enhance contrast
- Tell the story, don't manipulate it

## The Journey

Street photography teaches you to:
- See differently
- Be patient and observant
- Embrace spontaneity
- Find beauty everywhere
- Appreciate human moments

Start with your camera and a curious mind. The best photograph is waiting in your neighborhood.`,
    coverImage: "https://images.unsplash.com/photo-1491796014055-e3835cdcd4c9?w=1200",
    categoryIds: ["photography"],
    published: true,
  },
  {
    title: "Iceland: Land of Fire and Ice",
    slug: "iceland-fire-ice-adventure",
    excerpt: "Discover Iceland's otherworldly landscapes, waterfalls, glaciers, and geothermal wonders.",
    content: `# Iceland: Land of Fire and Ice

Iceland is a contradiction: volcanoes and glaciers, midnight sun and polar darkness, dramatic cliffs and serene lakes. It's a destination where the raw power of nature is on full display.

## The Golden Circle: Iceland's Greatest Hits

### Þingvellir National Park
Where the North American and Eurasian tectonic plates literally pull apart. You can see (and walk between) the rift.

### Geysir Geothermal Area
Hot springs erupting from the earth. The Strokkur geyser shoots water 40 meters into the air every few minutes.

### Gullfoss Waterfall
Glacial water crashes down two cascading drops. The sheer volume and power is humbling.

## Hidden Gems Beyond the Golden Circle

\`\`\`
Route 1: Black Sand Beaches
Route 64: Glacier Hiking
Route 35: Skaftafell National Park
\`\`\`

### Reynisfjara Black Sand Beach
Dark volcanic sand, powerful waves, basalt columns. It's dramatic and dangerous—respect the ocean.

### Vatnajökull Glacier
Europe's largest glacier dominates the landscape. Glacier hiking and ice cave exploration available.

### Skaftafell
Hiking trails through forests, waterfalls, and glacier views. Less crowded than the Golden Circle.

## The Unique Experiences

### Northern Lights Hunting
Chasing the Aurora Borealis across winter skies. Check forecasts, drive to dark areas, and wait.

| Month | Probability |
|---|---|
| September-March | Best chance (clear skies required) |
| November-January | Longest nights |
| February-March | Warmer, good viewing rates |

### Blue Lagoon
Geothermal hot spring heated to 37-39°C. Surreal to bathe in warm water surrounded by black lava fields.

### Midnight Sun
In summer, the sun never fully sets. Experience endless daylight and the unique mental effects.

## Practical Considerations

**Best Time to Visit**
- Summer (June-August): Midnight sun, warm, accessible
- Winter (November-February): Dark for northern lights, ice hotels

**Getting Around**
- Rent a 4WD vehicle (roads require it)
- Ring Road takes 1-2 weeks
- Gas stations are far apart

**Budget**
Iceland is expensive, but worth it:
- $100-150/night for accommodation
- $20-30 for meals
- Free natural attractions

## Photography Paradise

Every direction offers stunning shots:
- **Golden Hour**: Magic light on black sand
- **Waterfalls**: Misty, moody atmosphere
- **Glaciers**: Blue ice formations
- **Northern Lights**: Green dancing skies

## The Emotional Impact

Iceland isn't just a destination—it's an experience that recalibrates your sense of scale. Standing before a glacier or waterfall, you feel the planet's raw power and your smallness within it.

Go, be humbled, be amazed.`,
    coverImage: "https://images.unsplash.com/photo-1500522144775-86e282df74ac?w=1200",
    categoryIds: ["travel"],
    published: true,
  },
  {
    title: "Fermentation Beyond Sourdough: Kimchi, Kombucha & Sauerkraut",
    slug: "fermentation-beyond-sourdough",
    excerpt: "Explore the world of fermented foods and learn to make nutritious, delicious ferments at home.",
    content: `# Fermentation Beyond Sourdough: Kimchi, Kombucha & Sauerkraut

Fermentation is humanity's oldest form of food preservation and one of our greatest culinary discoveries. Beyond sourdough, a world of tangy, probiotic-rich foods awaits.

## The Science of Fermentation

Fermentation is anaerobic respiration by microorganisms (lactobacillus bacteria):

\`\`\`
Sugars + Lactobacillus → Lactic Acid + Probiotics + Flavor
\`\`\`

The lactic acid:
- Preserves the food naturally
- Creates distinctive tangy flavor
- Produces beneficial probiotics
- Aids digestion

## Sauerkraut: The Foundation

Sauerkraut is the easiest ferment to start:

**Recipe:**
1. Shred 1kg cabbage
2. Add 2% salt (20g)
3. Massage until brine forms
4. Pack into jar, press down
5. Keep submerged (use a weight)
6. Ferment 3-10 days at room temperature
7. Taste and refrigerate when desired tanginess reached

**Variations:**
- Add juniper berries and caraway
- Include ginger and turmeric
- Mix with other vegetables

## Kimchi: Korean Fire

Kimchi is spicy, complex, and addictive:

| Component | Flavor Profile |
|---|---|
| Cabbage | Base, mild |
| Gochugaru (Korean chili) | Heat, depth |
| Garlic & Ginger | Pungency, warmth |
| Fish sauce or shrimp paste | Umami |
| Sugar | Fermentation fuel |

**The Process:**
1. Salt and cure cabbage overnight
2. Rinse thoroughly
3. Prepare paste with chili, garlic, ginger, paste
4. Layer paste between cabbage leaves
5. Pack tightly
6. Ferment 2-5 days (room temp) then refrigerate

## Kombucha: Effervescent Elixir

Kombucha uses a SCOBY (Symbiotic Culture of Bacteria and Yeast):

### Two-Stage Fermentation

**Stage 1: The Primary Ferment (7-10 days)**
- Sweet tea + SCOBY
- Becomes acidic, reduces sugar
- Develops base flavor

**Stage 2: Flavoring & Carbonation (3-7 days)**
- Bottle with fruit juice or herbs
- Secondary fermentation creates fizz
- Temperature and time control carbonation level

### Flavor Combinations
- Ginger + lemon = Warming, zesty
- Berry + hibiscus = Floral, fruity
- Turmeric + black pepper = Golden milk vibes
- Mango + chili = Sweet heat

## Miso & Tempeh: Long-Term Ferments

These require more patience but offer rewards:

### Miso (6 months - 2 years)
- Soybeans + koji (mold) + salt
- Umami powerhouse
- Use in soups, dressings, marinades

### Tempeh (1 day)
- Cooked soybeans + rhizopus mold
- Nutty, firm texture
- Excellent vegetarian protein

## The Health Benefits

Regular fermented food consumption:
- Improves gut health and digestion
- Boosts immune system
- Enhances nutrient absorption
- May improve mental health (gut-brain axis)
- Provides natural probiotics

> "Good health starts in the gut."

## Common Mistakes

❌ **Exposing to air** → Mold growth
✓ Keep ferments submerged

❌ **Wrong temperature** → Sluggish fermentation
✓ 65-75°F is ideal

❌ **Too much salt** → Inhibits fermentation
✓ Use 2% salt by weight

❌ **Impatience** → Under-fermented flavor
✓ Taste after 3 days, let it develop

## Your Fermentation Journey

Start with sauerkraut. Master it. Then explore kimchi, kombucha, and beyond. Each ferment teaches you about this ancient, living process.

Your future self will thank you with every probiotic-rich spoonful.`,
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
    categoryIds: ["food"],
    published: true,
  },
];

async function seedPosts() {
  console.log("🌱 Starting post seeding...\n");

  const accounts = [
    { email: "charon.vi.001@gmail.com", password: "Charonhere", posts: charonPosts },
    { email: "jamie@icloud.com", password: "Jamiehere", posts: jamiePosts },
  ];

  for (const account of accounts) {
    console.log(`\n📧 Processing account: ${account.email}`);
    
    try {
      // Initialize Supabase client for this account
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (authError) {
        console.error(`❌ Login failed for ${account.email}:`, authError.message);
        continue;
      }

      const userId = authData.user?.id;
      if (!userId) {
        console.error(`❌ No user ID found for ${account.email}`);
        continue;
      }

      const authorName = authData.user?.user_metadata?.name || account.email.split('@')[0];

      console.log(`✅ Logged in as ${account.email}`);

      // Create categories for this user
      const categoryMap: { [key: string]: string } = {};
      
      for (const category of categories) {
        try {
          const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .insert([
              {
                name: category.name,
                slug: category.slug,
                description: category.description,
              },
            ])
            .select()
            .single();

          if (categoryError && !categoryError.message.includes("duplicate")) {
            console.warn(`⚠️  Category creation error:`, categoryError.message);
          } else if (categoryData) {
            categoryMap[category.slug] = categoryData.id;
            console.log(`✓ Category created: ${category.name}`);
          }
        } catch (e) {
          console.warn(`⚠️  Error creating category ${category.slug}`);
        }
      }

      // Create posts
      for (const post of account.posts) {
        const categoryIds = post.categoryIds
          .map((slug) => categoryMap[slug])
          .filter(Boolean);

        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert([
            {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              cover_image: post.coverImage,
              published: post.published,
              author_id: userId,
              author_name: authorName,
              author_email: account.email,
            },
          ])
          .select()
          .single();

        if (postError) {
          console.error(`❌ Post creation error for "${post.title}":`, postError.message);
          continue;
        }

        if (postData && categoryIds.length > 0) {
          // Link post to categories
          const postCategoryLinks = categoryIds.map((catId) => ({
            postId: postData.id,
            categoryId: catId,
          }));

          const { error: linkError } = await supabase
            .from("postCategories")
            .insert(postCategoryLinks);

          if (linkError) {
            console.warn(`⚠️  Error linking categories:`, linkError.message);
          }
        }

        console.log(`✓ Post created: "${post.title}" (${postData?.id})`);
      }

      // Sign out
      await supabase.auth.signOut();
      console.log(`\n✅ Completed for ${account.email}\n`);
    } catch (error) {
      console.error(`❌ Error processing ${account.email}:`, error);
    }
  }

  console.log("\n🎉 Post seeding completed!");
}

seedPosts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
