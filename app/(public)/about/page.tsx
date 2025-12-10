export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-8 md:p-16 lg:p-24">
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]">
          The<br />Manifesto
        </h1>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Section 1: Mission */}
        <div className="lg:col-span-4 p-8 md:p-12 border-r border-b border-border lg:border-b-0">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4 block">
            01 — Mission
          </span>
          <h2 className="text-3xl font-display font-bold uppercase mb-6">
            Clarity in Chaos
          </h2>
        </div>
        <div className="lg:col-span-8 p-8 md:p-12 border-b border-border lg:border-b-0">
          <p className="text-xl md:text-2xl font-sans leading-relaxed text-muted-foreground max-w-3xl">
            We believe the internet has become cluttered. Pop-ups, ads, and infinite scrolls distract us from what matters: <span className="text-foreground font-medium">the story</span>. 
            Inkwell is a reaction to the noise. It is a sanctuary for writers who value precision, and readers who appreciate focus.
          </p>
        </div>

        <div className="col-span-full h-px bg-border" />

        {/* Section 2: Craft */}
        <div className="lg:col-span-4 p-8 md:p-12 border-r border-b border-border lg:border-b-0">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4 block">
            02 — Craft
          </span>
          <h2 className="text-3xl font-display font-bold uppercase mb-6">
            Swiss Precision
          </h2>
        </div>
        <div className="lg:col-span-8 p-8 md:p-12 border-b border-border lg:border-b-0">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="font-bold font-mono uppercase tracking-widest text-sm">Typography</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use a pairing of <span className="text-foreground">Playfair Display</span> for impact and <span className="text-foreground">Inter</span> for utility. This high-contrast approach ensures legibility while maintaining a distinct editorial voice.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold font-mono uppercase tracking-widest text-sm">Grid System</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every element on Inkwell aligns to a strict grid. We eschew soft shadows and rounded corners for the honest clarity of lines and right angles.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-full h-px bg-border" />

        {/* Section 3: Platform */}
        <div className="lg:col-span-4 p-8 md:p-12 border-r border-border">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4 block">
            03 — Platform
          </span>
          <h2 className="text-3xl font-display font-bold uppercase mb-6">
            Open & Free
          </h2>
        </div>
        <div className="lg:col-span-8 p-8 md:p-12">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
            Inkwell is built on modern, open-source technologies. We don&rsquo;t track you across the web. We don&rsquo;t sell your data. We just provide the canvas; you provide the art.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
            {['Next.js 15', 'Supabase', 'Tailwind', 'Vercel'].map((tech) => (
              <div key={tech} className="p-4 border border-border bg-muted/5 text-center">
                <span className="font-mono text-xs font-bold uppercase tracking-widest">{tech}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}