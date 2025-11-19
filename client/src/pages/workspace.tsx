import { Fragment, useState } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bell,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileDown,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Paperclip,
  PhoneCall,
  Home,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  Sparkles,
  Timer,
} from "lucide-react";

type MessageStatus = "called-back" | "todo" | "scheduled";
type JobStatus = "to-be-scheduled" | "scheduled" | "reschedule" | "completed";

const messageStatusOptions: Record<MessageStatus, string> = {
  "called-back": "Called back",
  todo: "To-Do",
  scheduled: "Scheduled",
};

const jobStatusOptions: Record<JobStatus, string> = {
  "to-be-scheduled": "To be scheduled",
  scheduled: "Scheduled",
  reschedule: "Reschedule",
  completed: "Completed",
};

const threads = [
  {
    id: "t1",
    customer: "Maria Sanchez",
    summary: "Voicemail about a hot upstairs zone, asks for a callback.",
    status: "todo" as MessageStatus,
    channel: "Call -> transcript",
    time: "2m ago",
    transcript:
      "Hey, this is Maria. The upstairs zone is really hot again. It was fine yesterday. Can you take a look today or tomorrow? Call me back, please.",
  },
  {
    id: "t2",
    customer: "Gus Plumbing",
    summary: "Texted in pictures of a broken disposal, wants price check.",
    status: "scheduled" as MessageStatus,
    channel: "Text",
    time: "15m ago",
    transcript:
      "Sent photos of the disposal. It's buzzing but won't spin. Need an estimate before noon if possible.",
  },
  {
    id: "t3",
    customer: "Nora Wilson",
    summary: "Follow-up on last week's invoice before paying online.",
    status: "called-back" as MessageStatus,
    channel: "Call -> transcript",
    time: "42m ago",
    transcript:
      "I just want to confirm the invoice total before I pay online. Also, can you send the receipt to my email?",
  },
];

const jobsToday = [
  {
    id: "j1",
    job: "Water heater install",
    customer: "Gus Plumbing HQ",
    window: "9:00a - 11:00a",
    address: "214 Indigo Ct, Austin, TX",
    status: "scheduled" as JobStatus,
    estimateId: "#EST-1042",
  },
  {
    id: "j2",
    job: "AC tune-up",
    customer: "Maria Sanchez",
    window: "11:30a - 1:00p",
    address: "718 Maple Grove, Austin, TX",
    status: "reschedule" as JobStatus,
    estimateId: "#EST-1120",
  },
  {
    id: "j3",
    job: "Drywall patch + paint",
    customer: "Nora Wilson",
    window: "2:30p - 4:00p",
    address: "911 Pine Ridge, Austin, TX",
    status: "to-be-scheduled" as JobStatus,
    estimateId: "#EST-1175",
  },
];

const invoices = [
  {
    id: "INV-3021",
    customer: "Maria Sanchez",
    serviceDate: "Today",
    total: "$680.00",
    status: "Unpaid",
    taxRate: "8.25%",
  },
  {
    id: "INV-2994",
    customer: "Gus Plumbing HQ",
    serviceDate: "Yesterday",
    total: "$1,240.00",
    status: "Paid",
    taxRate: "8.25%",
  },
];

const estimates = [
  {
    id: "EST-1120",
    customer: "Maria Sanchez",
    scope: "AC tune-up + filters",
    value: "$280",
    status: "Awaiting approval",
  },
  {
    id: "EST-1042",
    customer: "Gus Plumbing HQ",
    scope: "Replacement water heater & haul away",
    value: "$1,200",
    status: "Approved",
  },
];

const statusTone: Record<MessageStatus | JobStatus, string> = {
  "called-back": "bg-emerald-100 text-emerald-700 border-emerald-200",
  todo: "bg-amber-100 text-amber-800 border-amber-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  "to-be-scheduled": "bg-slate-100 text-slate-800 border-slate-200",
  reschedule: "bg-rose-100 text-rose-800 border-rose-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function StatusBadge({ label, tone }: { label: string; tone: MessageStatus | JobStatus }) {
  return <Badge className={`border ${statusTone[tone]}`}>{label}</Badge>;
}

const navItems = [
  { value: "home", label: "Home", icon: Home },
  { value: "messages", label: "Messages", icon: MessageSquare },
  { value: "schedule", label: "Schedule", icon: CalendarDays },
  { value: "invoices", label: "Invoices", icon: FileText },
  { value: "estimates", label: "Estimates", icon: ClipboardList },
];

export default function WorkspaceShell() {
  const [activeTab, setActiveTab] = useState("home");
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a] pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid gap-6 md:grid-cols-[90px_1fr] lg:grid-cols-[110px_1fr]">
          <aside className="hidden md:flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#1e293b] p-3 text-white shadow-xl">
            <div className="flex h-14 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold">
              CrewSync
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium transition ${
                    isActive ? "bg-[#38bdf8] text-[#0f172a] shadow-lg" : "text-white/80 hover:bg-white/10"
                  }`}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          <div className="space-y-6">
            <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#1e293b] via-[#16243a] to-[#0b1324] px-5 py-6 text-white shadow-xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">CrewSync workspace</p>
                  <h1 className="text-3xl font-semibold">Field Ops Command</h1>
                  <p className="text-sm text-white/70">Messages, schedules, invoices, and estimates at a glance.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-cyan-200/60 bg-white/10 text-cyan-100">
                    <Sparkles className="mr-1 h-3.5 w-3.5" /> Auto-reply on
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white/80">
                    <Bell className="mr-1 h-3.5 w-3.5" /> Live notifications
                  </Badge>
                  <Button variant="secondary" size="sm" className="bg-[#fbbf24] text-[#1e293b] hover:bg-[#fbbf24]/90">
                    <Timer className="mr-2 h-4 w-4" />
                    Set crew status
                  </Button>
                </div>
              </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="hidden" aria-hidden />

              <TabsContent value="home" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="grid gap-4 p-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-3">
                    <p className="text-sm font-semibold text-[#1e293b]">Welcome back</p>
                    <h2 className="text-2xl font-bold text-foreground">Today's focus</h2>
                    <p className="text-sm text-muted-foreground">
                      Start with new messages, then confirm stops and send receipts. The home hub will become your dashboard with metrics and shortcuts.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#38bdf8]/15 text-[#0f172a] border-[#38bdf8]/50">Navy + Cyan accents</Badge>
                      <Badge className="bg-[#fbbf24]/20 text-[#1e293b] border-[#fbbf24]/50">Yellow CTA</Badge>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-[#38bdf8]/50 bg-[#38bdf8]/10 p-4 text-sm text-foreground">
                    <p className="font-semibold text-[#1e293b]">Quick actions</p>
                    <ul className="mt-2 space-y-2 text-muted-foreground">
                      <li>- Acknowledge new voicemails with auto-text</li>
                      <li>- Confirm today's stops and send on-my-way links</li>
                      <li>- Push invoices with PDF + payment link</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="messages" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="space-y-4 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Message Center</h3>
                      <p className="text-sm text-muted-foreground">Caller, time, quick summary, and status. Expand to read the full voicemail text.</p>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary whitespace-nowrap">
                      Auto-reply: Busy
                    </Badge>
                  </div>

                  <Card className="border-border/70">
                    <CardContent className="p-0">
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Caller</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Summary</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Transcript</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {threads.map((thread) => (
                              <Fragment key={thread.id}>
                                <TableRow>
                                  <TableCell className="font-semibold text-foreground">{thread.customer}</TableCell>
                                  <TableCell className="text-muted-foreground whitespace-nowrap">{thread.time}</TableCell>
                                  <TableCell className="text-sm text-foreground max-w-[360px]">
                                    <p className="line-clamp-2">{thread.summary}</p>
                                  </TableCell>
                                  <TableCell className="w-[200px]">
                                    <Select defaultValue={thread.status}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(messageStatusOptions).map(([value, label]) => (
                                          <SelectItem key={value} value={value}>
                                            {label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
                                    >
                                      {expandedThread === thread.id ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                {expandedThread === thread.id && (
                                  <TableRow className="bg-muted/30">
                                    <TableCell colSpan={5} className="text-sm text-muted-foreground leading-relaxed">
                                      {thread.transcript}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="grid gap-3 p-4 md:hidden">
                        {threads.map((thread) => {
                          const isOpen = expandedThread === thread.id;
                          return (
                            <div key={thread.id} className="rounded-lg border border-border/70 bg-background p-3 shadow-sm">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{thread.customer}</p>
                                  <p className="text-xs text-muted-foreground">{thread.time}</p>
                                </div>
                                <StatusBadge label={messageStatusOptions[thread.status]} tone={thread.status} />
                              </div>
                              <p className="mt-2 text-sm text-foreground">{thread.summary}</p>
                              <div className="mt-3 space-y-2">
                                <Select defaultValue={thread.status}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(messageStatusOptions).map(([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline" className="border-primary/50 text-primary">
                                    <Send className="mr-2 h-4 w-4" />
                                    Auto-text busy
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <PhoneCall className="mr-2 h-4 w-4" />
                                    Call back
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setExpandedThread(isOpen ? null : thread.id)}
                                  >
                                    {isOpen ? (
                                      <span className="inline-flex items-center gap-1">
                                        <ChevronUp className="h-4 w-4" /> Hide
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1">
                                        <ChevronDown className="h-4 w-4" /> View
                                      </span>
                                    )}
                                  </Button>
                                </div>
                              </div>
                              {isOpen && (
                                <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                                  {thread.transcript}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="schedule" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="grid gap-6 p-6 lg:grid-cols-[380px_1fr]">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Jobs today</h3>
                    <ScrollArea className="h-[520px] pr-2">
                      <div className="space-y-3">
                        {jobsToday.map((job) => (
                          <Card key={job.id} className="border-border/70">
                            <CardHeader className="pb-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-foreground">{job.job}</p>
                                    <p className="text-xs text-muted-foreground">for {job.customer}</p>
                                  </div>
                                  <StatusBadge label={jobStatusOptions[job.status]} tone={job.status} />
                                </div>
                                <p className="text-sm text-muted-foreground">{job.window}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                                  {job.address}
                                </div>
                                <p className="text-xs font-medium text-primary">Linked estimate {job.estimateId}</p>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Select defaultValue={job.status}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Update job status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(jobStatusOptions).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary">
                                  <CalendarDays className="mr-2 h-4 w-4" />
                                  Confirm appointment
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Compass className="mr-2 h-4 w-4" />
                                  Open maps
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Send className="mr-2 h-4 w-4" />
                                  On my way
                                </Button>
                              </div>
                              <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                                Marking this job completed will open the invoice + receipts screen to collect payment and upload photos.
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-border/70">
                      <CardHeader>
                        <CardTitle className="text-xl">Crew timeline</CardTitle>
                        <CardDescription>Track where techs are headed and what is next in their queue.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-sm text-muted-foreground">
                            Live map & GPS routing placeholder - choose Google Maps or Apple CarPlay to launch navigation from the browser.
                          </div>
                          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-sm text-muted-foreground">
                            Calendar feed placeholder - show promises, reschedules, and capacity across the crew.
                          </div>
                        </div>
                        <Separator />
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Slot new job
                          </Button>
                          <Button variant="outline" size="sm">
                            <PhoneCall className="mr-2 h-4 w-4" />
                            Notify customer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="invoices" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="grid gap-6 p-6 lg:grid-cols-[420px_1fr]">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Invoices & receipts</h3>
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <Card key={invoice.id} className="border-border/70">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{invoice.id}</p>
                                <p className="text-xs text-muted-foreground">for {invoice.customer}</p>
                              </div>
                              <Badge variant="outline" className={invoice.status === "Paid" ? "border-emerald-200 text-emerald-700" : "border-amber-200 text-amber-700"}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{invoice.serviceDate}</p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Subtotal + tax ({invoice.taxRate})</span>
                              <span className="font-semibold text-foreground">{invoice.total}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline">Attach photos</Badge>
                              <Badge variant="outline">Notes</Badge>
                              <Badge variant="outline">Send PDF</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="secondary">
                                <FileDown className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                              <Button size="sm" variant="outline">
                                <Send className="mr-2 h-4 w-4" />
                                Text secure link
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Email customer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Invoice build-out</CardTitle>
                      <CardDescription>Header, line items, taxes, notes, attachments, and payment status tracking.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="company">Company name</Label>
                          <Input id="company" placeholder="CrewSync Services" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="customer">Customer</Label>
                          <Input id="customer" placeholder="Customer name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="service-date">Date of service</Label>
                          <Input id="service-date" type="date" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tax-rate">Tax rate</Label>
                          <Input id="tax-rate" placeholder="8.25%" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">Line items</p>
                          <Button variant="ghost" size="sm">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add item
                          </Button>
                        </div>
                        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
                          Line item table placeholder - description, qty, rate, and amount. Totals update live as you edit.
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes for customer</Label>
                        <Textarea id="notes" placeholder="Warranty, scope details, crew notes..." rows={3} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="attachments">Attachments</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Upload photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Add receipt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Text invoice link
                      </Button>
                      <Button variant="secondary">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Email PDF
                      </Button>
                      <Button variant="outline">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark paid
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="estimates" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="grid gap-6 p-6 lg:grid-cols-[360px_1fr]">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Estimate drafts</h3>
                    <div className="space-y-3">
                      {estimates.map((estimate) => (
                        <Card key={estimate.id} className="border-border/70">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{estimate.id}</p>
                                <p className="text-xs text-muted-foreground">for {estimate.customer}</p>
                              </div>
                              <Badge variant="outline">{estimate.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{estimate.scope}</p>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-foreground">
                              <span>Est. value</span>
                              <span className="font-semibold">{estimate.value}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="secondary">
                                <Send className="mr-2 h-4 w-4" />
                                Send for approval
                              </Button>
                              <Button size="sm" variant="outline">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Book as job
                              </Button>
                              <Button size="sm" variant="ghost">
                                <FileText className="mr-2 h-4 w-4" />
                                Convert to invoice
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Estimate builder</CardTitle>
                      <CardDescription>Mobile-friendly layout that mirrors the invoice experience for quick handoff.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="estimate-title">Estimate title</Label>
                          <Input id="estimate-title" placeholder="Example: AC tune-up, 2 zones" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="estimate-customer">Customer</Label>
                          <Input id="estimate-customer" placeholder="Customer name" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="estimate-scope">Scope</Label>
                        <Textarea id="estimate-scope" placeholder="Describe the work, materials, and options" rows={3} />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div className="grid gap-2">
                          <Label htmlFor="estimate-amount">Estimated amount</Label>
                          <Input id="estimate-amount" placeholder="$0.00" />
                        </div>
                        <Button className="mt-3 sm:mt-6" variant="secondary">
                          <Send className="mr-2 h-4 w-4" />
                          Share to customer
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Label>Attachments</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="mr-2 h-4 w-4" />
                            Add photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Add terms
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      <Button variant="secondary">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Awaiting approval
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send reminder
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="grid grid-cols-5 gap-1 rounded-2xl border border-white/10 bg-[#1e293b]/95 text-white shadow-2xl backdrop-blur">
          {navItems.map((item) => {
            const isActive = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
                  isActive ? "bg-[#38bdf8] text-[#0f172a]" : "text-white/80"
                }`}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
