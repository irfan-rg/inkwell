import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

export function MarkdownGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <QuestionMarkCircleIcon className="h-4 w-4" />
          Markdown Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold uppercase">Markdown Guide</DialogTitle>
          <DialogDescription>
            Basic syntax for formatting your content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2 text-sm">Headers</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                # Heading 1{'\n'}
                ## Heading 2{'\n'}
                ### Heading 3
              </pre>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-sm">Emphasis</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                *Italic*{'\n'}
                **Bold**{'\n'}
                ~~Strikethrough~~
              </pre>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-sm">Lists</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                - Item 1{'\n'}
                - Item 2{'\n'}
                {'\n'}
                1. First{'\n'}
                2. Second
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2 text-sm">Links & Images</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                [Link Text](url){'\n'}
                ![Alt Text](image-url)
              </pre>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-sm">Code</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                `inline code`{'\n'}
                {'\n'}
                ```language{'\n'}
                code block{'\n'}
                ```
              </pre>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-sm">Quotes</h4>
              <pre className="bg-muted p-2 rounded text-xs font-mono">
                &gt; Blockquote
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
