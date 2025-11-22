import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutUsDialog({ open, onOpenChange }: AboutUsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-about-us">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-6" data-testid="text-about-title">
            About Us
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video bg-muted/50 rounded-xl flex items-center justify-center" data-testid="placeholder-about-image">
            <p className="text-muted-foreground text-lg">Image Placeholder</p>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p data-testid="text-about-paragraph-1">
              We come from small-business families. Our parents and siblings run their own shops and service businesses, so we've seen firsthand what it's like to juggle phone calls, jobs, and invoices while still trying to do the actual work.
            </p>

            <p data-testid="text-about-paragraph-2">
              We also know you don't have the time or the desire to learn some over-engineered system that feels as painful as doing the admin work by hand. That's why we're building CrewSynch: a super simple tool that helps you stay organized, serve customers better, and run your business like you've got a 24/7 receptionist on your side.
            </p>

            <p data-testid="text-about-paragraph-3">
              Our mission is to help small businesses compete with the "big guys" without needing a big team or a big budget. You get more control, fewer mistakes, and happier customers without living in spreadsheets and software tutorials.
            </p>

            <p data-testid="text-about-paragraph-4">
              And we want you to try it 100% risk free. Use CrewSynch, see how it fits your day, and if you don't love it, you can simply stop using it without paying a single dollar. If it earns its keep, we think you'll quickly see it's worth the small monthly fee.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
