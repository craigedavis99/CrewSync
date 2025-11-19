import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock3, ShieldCheck, Smartphone } from "lucide-react";
import logoImage from "@assets/image_1762998239376.png";

const highlights = [
  { icon: ShieldCheck, title: "Secure by default", body: "Keep customer notes, photos, and payments safe in one workspace." },
  { icon: Smartphone, title: "Built for the field", body: "Mobile-first controls so techs can message, schedule, and invoice on the go." },
  { icon: Clock3, title: "Real-time follow-up", body: "Auto-replies, statuses, and reminders that keep every job moving." },
];

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="CrewSync" className="h-14" />
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">CrewSync</p>
              <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
            </div>
          </div>
          <Badge variant="outline" className="w-fit text-sm">Demo access ready</Badge>
        </header>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Log in to your crew space</CardTitle>
              <CardDescription>Use your company email to continue. We will wire this to the real auth flow later.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" />
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Button className="w-full md:w-auto" onClick={() => setLocation("/workspace")} data-testid="button-login-continue">
                  Continue to workspace
                </Button>
                <Button variant="outline" className="w-full md:w-auto" onClick={() => setLocation("/workspace")} data-testid="button-login-demo">
                  Preview the shell
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>Need an invite? Contact us to set up your crew.</span>
              <span className="font-medium text-primary">We'll add SSO + magic links next.</span>
            </CardFooter>
          </Card>

          <Card className="border-primary/30 bg-card/70 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">What you'll see next</CardTitle>
              <CardDescription>Messaging, scheduling, invoicing, and estimates in one tabbed workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-lg border border-border/60 bg-background/50 p-3">
                  <item.icon className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
