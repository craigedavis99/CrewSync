import { Fragment, useState } from "react";
import type { FormEvent } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import logoImage from "@assets/image_1762998239376.png";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Trash,
  Paperclip,
  PhoneCall,
  Home,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  Sparkles,
  Timer,
} from "lucide-react";

type MessageStatus = "called-back" | "todo";
type JobStatus = "scheduled" | "completed" | "complete-invoice";

const messageStatusOptions: Record<MessageStatus, string> = {
  "called-back": "Called back",
  todo: "To-Do",
};

type CompletionDetails = {
  date: string;
  notes: string;
  materials: string;
  attachments: string[];
};

const jobStatusOptions: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  "complete-invoice": "Complete invoice",
};

const todayISO = new Date().toISOString().split("T")[0];
const tomorrowISO = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
const NEW_JOB_CREW_FLAG = "__new_job_crew__";
const UNASSIGNED_CREW_VALUE = "__unassigned_crew__";

const initialCrewMembers = [
  { id: "crew-1", name: "Crew A", role: "Install" },
  { id: "crew-2", name: "Crew B", role: "Service" },
];

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
    status: "todo" as MessageStatus,
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

const initialJobs = [
  {
    id: "j1",
    job: "Water heater install",
    customer: "Gus Plumbing HQ",
    window: "9:00a - 11:00a",
    address: "214 Indigo Ct, Austin, TX",
    status: "scheduled" as JobStatus,
    estimateId: "#EST-1042",
    date: todayISO,
    crewMemberId: "crew-1",
  },
  {
    id: "j2",
    job: "AC tune-up",
    customer: "Maria Sanchez",
    window: "11:30a - 1:00p",
    address: "718 Maple Grove, Austin, TX",
    status: "scheduled" as JobStatus,
    estimateId: "#EST-1120",
    date: todayISO,
    crewMemberId: "crew-2",
  },
  {
    id: "j3",
    job: "Drywall patch + paint",
    customer: "Nora Wilson",
    window: "2:30p - 4:00p",
    address: "911 Pine Ridge, Austin, TX",
    status: "scheduled" as JobStatus,
    estimateId: "#EST-1175",
    date: tomorrowISO,
    crewMemberId: null,
  },
];

const initialInvoices = [
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
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "complete-invoice": "bg-cyan-100 text-cyan-800 border-cyan-200",
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
  { value: "settings", label: "Settings", icon: Settings },
];

export default function WorkspaceShell() {
  const [activeTab, setActiveTab] = useState("home");
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState(threads);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createCrewOpen, setCreateCrewOpen] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    job: "",
    customer: "",
    date: todayISO,
    window: "",
    address: "",
    crewMemberId: UNASSIGNED_CREW_VALUE,
  });
  const [jobs, setJobs] = useState(initialJobs);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [crewMembers, setCrewMembers] = useState(initialCrewMembers);
  const [newCrewForm, setNewCrewForm] = useState({ name: "", role: "" });
  const [jobPendingCrewAssignment, setJobPendingCrewAssignment] = useState<string | null>(null);
  const [completionDetails, setCompletionDetails] = useState<Record<string, CompletionDetails>>({});
  const [expandedCompletionJob, setExpandedCompletionJob] = useState<string | null>(null);
  const filteredJobs = jobs.filter((job) => job.date === selectedDate);
  const resetJobForm = (dateValue = selectedDate) =>
    setNewJobForm({
      job: "",
      customer: "",
      date: dateValue,
      window: "",
      address: "",
      crewMemberId: UNASSIGNED_CREW_VALUE,
    });
  const createEmptyCompletionDetails = (dateValue: string): CompletionDetails => ({
    date: dateValue,
    notes: "",
    materials: "",
    attachments: [],
  });

  const handleCreateJobSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newJobDate = newJobForm.date || selectedDate;
    const newJob = {
      id: `job-${Date.now()}`,
      job: newJobForm.job || "New job",
      customer: newJobForm.customer || "Customer",
      window: newJobForm.window || "TBD",
      address: newJobForm.address || "Pending address",
      status: "scheduled" as JobStatus,
      estimateId: `#EST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: newJobDate,
      crewMemberId: newJobForm.crewMemberId === UNASSIGNED_CREW_VALUE ? null : newJobForm.crewMemberId || null,
    };
    setJobs((prev) => [...prev, newJob]);
    setSelectedDate(newJobDate);
    resetJobForm(newJobDate);
    setCreateJobOpen(false);
  };
  const handleCreateJobOpenChange = (open: boolean) => {
    setCreateJobOpen(open);
    if (open) {
      resetJobForm();
    } else {
      resetJobForm(selectedDate);
    }
  };

  const handleJobStatusChange = (jobId: string, newStatus: JobStatus) => {
    const job = jobs.find((entry) => entry.id === jobId);
    setJobs((prev) =>
      prev.map((entry) => (entry.id === jobId ? { ...entry, status: newStatus } : entry)),
    );
    if (newStatus === "completed" && job) {
      setExpandedCompletionJob(jobId);
      setCompletionDetails((prev) => ({
        ...prev,
        [jobId]: prev[jobId] ?? createEmptyCompletionDetails(job.date),
      }));
    }
    if (newStatus !== "completed") {
      setExpandedCompletionJob((prev) => (prev === jobId ? null : prev));
    }
  };

  const handleCompletionDetailChange = (jobId: string, field: keyof CompletionDetails, value: string | string[]) => {
    setCompletionDetails((prev) => {
      const existing = prev[jobId] ?? createEmptyCompletionDetails(selectedDate);
      const nextValue = field === "attachments" ? (value as string[]) : (value as string);
      return {
        ...prev,
        [jobId]: {
          ...existing,
          [field]: nextValue,
        },
      };
    });
  };

  const handleCompletionAttachmentsChange = (jobId: string, files: FileList | null) => {
    const names = files ? Array.from(files).map((file) => file.name) : [];
    handleCompletionDetailChange(jobId, "attachments", names);
  };

  const handleCompletionFormSubmit = (event: FormEvent<HTMLFormElement>, jobId: string) => {
    event.preventDefault();
    const job = jobs.find((entry) => entry.id === jobId);
    if (!job) {
      return;
    }
    const detail = completionDetails[jobId] ?? createEmptyCompletionDetails(job.date);
    const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice = {
      id: invoiceId,
      customer: job.customer,
      serviceDate: detail.date || todayISO,
      total: "$0.00",
      status: "To be paid",
      taxRate: "8.25%",
      jobId: job.id,
      notes: detail.notes,
      materials: detail.materials,
      attachments: detail.attachments,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setJobs((prev) =>
      prev.map((entry) => (entry.id === jobId ? { ...entry, status: "complete-invoice" } : entry)),
    );
    setExpandedCompletionJob(null);
  };

  const handleDeleteThread = (threadId: string) => {
    setMessageThreads((prev) => prev.filter((thread) => thread.id !== threadId));
    if (expandedThread === threadId) {
      setExpandedThread(null);
    }
  };

  const getCrewMemberName = (crewId: string | null | undefined) =>
    crewMembers.find((member) => member.id === crewId)?.name ?? "Unassigned";

  const handleCrewSelect = (jobId: string, value: string) => {
    if (value === "__add_new") {
      setJobPendingCrewAssignment(jobId);
      setCreateCrewOpen(true);
      return;
    }
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, crewMemberId: value === UNASSIGNED_CREW_VALUE ? null : value }
          : job,
      ),
    );
  };

  const handleCreateCrewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newCrewForm.name.trim()) {
      return;
    }
    const newCrewId = `crew-${Date.now()}`;
    const newCrewMember = {
      id: newCrewId,
      name: newCrewForm.name.trim(),
      role: newCrewForm.role.trim() || "Crew",
    };
    setCrewMembers((prev) => [...prev, newCrewMember]);
    if (jobPendingCrewAssignment) {
      if (jobPendingCrewAssignment === NEW_JOB_CREW_FLAG) {
        setNewJobForm((prev) => ({ ...prev, crewMemberId: newCrewId }));
      } else {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobPendingCrewAssignment ? { ...job, crewMemberId: newCrewId } : job,
          ),
        );
      }
    }
    setNewCrewForm({ name: "", role: "" });
    setJobPendingCrewAssignment(null);
    setCreateCrewOpen(false);
  };

  const handleNewJobCrewSelect = (value: string) => {
    if (value === "__add_new") {
      setJobPendingCrewAssignment(NEW_JOB_CREW_FLAG);
      setCreateCrewOpen(true);
      return;
    }
    setNewJobForm((prev) => ({ ...prev, crewMemberId: value }));
  };

  const handleCreateCrewOpenChange = (open: boolean) => {
    setCreateCrewOpen(open);
    if (!open) {
      setJobPendingCrewAssignment(null);
    }
  };

  const renderCompletionForm = (job: (typeof initialJobs)[number]) => {
    const detail = completionDetails[job.id] ?? createEmptyCompletionDetails(job.date);
    return (
      <form className="space-y-4" onSubmit={(event) => handleCompletionFormSubmit(event, job.id)}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor={`completion-date-${job.id}`}>Completion date</Label>
            <Input
              id={`completion-date-${job.id}`}
              type="date"
              value={detail.date}
              onChange={(event) => handleCompletionDetailChange(job.id, "date", event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor={`completion-materials-${job.id}`}>Materials used</Label>
            <Input
              id={`completion-materials-${job.id}`}
              placeholder="Filters, copper pipe, etc."
              value={detail.materials}
              onChange={(event) => handleCompletionDetailChange(job.id, "materials", event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`completion-notes-${job.id}`}>Job notes</Label>
          <Textarea
            id={`completion-notes-${job.id}`}
            rows={3}
            placeholder="Scope completed, crew notes, follow-ups..."
            value={detail.notes}
            onChange={(event) => handleCompletionDetailChange(job.id, "notes", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`completion-attachments-${job.id}`}>Attachments</Label>
          <Input
            id={`completion-attachments-${job.id}`}
            type="file"
            multiple
            onChange={(event) => handleCompletionAttachmentsChange(job.id, event.target.files)}
          />
          {detail.attachments.length > 0 && (
            <p className="text-xs text-muted-foreground">Attached: {detail.attachments.join(", ")}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark complete & invoice
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setExpandedCompletionJob(null)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const scheduledJobsTodayCount = jobs.filter(
    (job) => job.status === "scheduled" && job.date === todayISO,
  ).length;
  const estimatesAwaitingApprovalCount = estimates.filter(
    (estimate) => estimate.status === "Awaiting approval",
  ).length;
  const estimatesReadyToCompleteCount = estimates.filter((estimate) => estimate.status === "Approved").length;
  const unreturnedMessagesCount = messageThreads.filter((thread) => thread.status === "todo").length;
    const unpaidInvoicesCount = invoices.filter((invoice) => invoice.status !== "Paid").length;
  const dashboardCards = [
    {
      key: "scheduled",
      title: "Jobs today",
      value: scheduledJobsTodayCount,
      caption: "Stops locked in for crews today.",
      buttonLabel: "Review schedule",
      targetTab: "schedule",
    },
    {
      key: "estimates-approval",
      title: "Est waiting appr",
      value: estimatesAwaitingApprovalCount,
      caption: "Waiting on customer thumbs-up.",
      buttonLabel: "Open estimates",
      targetTab: "estimates",
    },
    {
      key: "estimates-complete",
      title: "Estimates to Complete",
      value: estimatesReadyToCompleteCount,
      caption: "Approved scopes needing work orders.",
      buttonLabel: "Plan work",
      targetTab: "estimates",
    },
    {
      key: "messages",
      title: "Unreturned Messages",
      value: unreturnedMessagesCount,
      caption: "Voicemails/texts waiting on a reply.",
      buttonLabel: "Go to messages",
      targetTab: "messages",
    },
    {
      key: "invoices",
      title: "Unpaid Invoices",
      value: unpaidInvoicesCount,
      caption: "Outstanding balances to close.",
      buttonLabel: "Invoice center",
      targetTab: "invoices",
    },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="grid gap-6 md:grid-cols-[90px_1fr] lg:grid-cols-[110px_1fr]">
          <aside className="hidden md:flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl transition-colors">
            <div className="flex h-14 items-center justify-center rounded-xl bg-white/10">
              <img src={logoImage} alt="CrewSync" className="h-10" />
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium transition ${
                    isActive ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted/60"
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
            <header className="rounded-2xl border border-border bg-card px-5 py-6 shadow-xl transition-colors">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-primary/80">CrewSync workspace</p>
                  <h1 className="text-3xl font-semibold text-foreground">Command Center</h1>
                  <p className="text-sm text-muted-foreground">Messages, schedules, invoices, and estimates at a glance.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="border-primary/40 bg-transparent text-primary">
                    <Sparkles className="mr-1 h-3.5 w-3.5" /> Auto-reply on
                  </Badge>
                  <ThemeToggle />
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => setActiveTab("settings")}
                      aria-label="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">Settings</span>
                  </div>
                </div>
              </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="hidden" aria-hidden />

              <TabsContent value="home" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="space-y-6 p-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Welcome back</p>
                    <h2 className="text-2xl font-bold text-foreground">Today's focus</h2>
                    <p className="text-sm text-muted-foreground">
                      Start with new messages, then confirm stops and send receipts. The home hub is now your dashboard with live counts and shortcuts.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {dashboardCards.map((card) => (
                      <Card
                        key={card.key}
                        className="border-border bg-muted/70 transition-colors dark:bg-white/10 dark:border-white/20 dark:text-white/90"
                      >
                        <CardHeader className="pb-1 text-center">
                          <CardTitle className="text-sm font-bold text-muted-foreground">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-4xl font-bold text-red-600 text-center">{card.value}</p>
                          <CardDescription className="text-sm text-muted-foreground text-center">
                            {card.caption}
                          </CardDescription>
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setActiveTab(card.targetTab)}
                          >
                            {card.buttonLabel}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
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
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {messageThreads.map((thread) => (
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
                                    <TableCell className="text-right">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteThread(thread.id)}
                                        aria-label={`Delete message from ${thread.customer}`}
                                      >
                                        <Trash className="h-4 w-4 text-rose-500" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  {expandedThread === thread.id && (
                                    <TableRow className="bg-muted/30">
                                      <TableCell colSpan={6} className="text-sm text-muted-foreground leading-relaxed">
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
                        {messageThreads.map((thread) => {
                          const isOpen = expandedThread === thread.id;
                          return (
                            <div key={thread.id} className="rounded-lg border border-border/70 bg-background p-3 shadow-sm">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{thread.customer}</p>
                                  <p className="text-xs text-muted-foreground">{thread.time}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <StatusBadge label={messageStatusOptions[thread.status]} tone={thread.status} />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteThread(thread.id)}
                                    aria-label={`Delete message from ${thread.customer}`}
                                  >
                                    <Trash className="h-4 w-4 text-rose-500" />
                                  </Button>
                                </div>
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
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">Jobs today</h3>
                        <Badge variant="outline" className="border-primary/40 text-primary">
                          {filteredJobs.length} {filteredJobs.length === 1 ? "stop" : "stops"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Pick a date, assign a crew, and keep jobs moving.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="w-[180px]"
                      />
                      <Button onClick={() => handleCreateJobOpenChange(true)} className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create job
                      </Button>
                    </div>
                  </div>
                  <Card className="border-border/70">
                    <CardContent className="p-0">
                      {filteredJobs.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          No jobs scheduled for {selectedDate}. Use Create job to add one.
                        </div>
                      ) : (
                        <>
                          <div className="hidden lg:block">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Job</TableHead>
                                  <TableHead>Window</TableHead>
                                  <TableHead>Customer</TableHead>
                                  <TableHead>Address</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Crew</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredJobs.map((job) => (
                                  <Fragment key={job.id}>
                                    <TableRow>
                                      <TableCell className="font-semibold text-foreground">
                                        <div className="flex flex-col">
                                          <span>{job.job}</span>
                                          <span className="text-xs text-muted-foreground">Estimate {job.estimateId}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">{job.window}</TableCell>
                                      <TableCell className="text-muted-foreground">{job.customer}</TableCell>
                                      <TableCell className="text-muted-foreground">
                                        <div className="flex items-center gap-1 text-xs">
                                          <MapPin className="h-3.5 w-3.5 text-primary" />
                                          <span>{job.address}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="space-y-2">
                                        <StatusBadge label={jobStatusOptions[job.status]} tone={job.status} />
                                        <Select
                                          value={job.status}
                                          onValueChange={(value) => handleJobStatusChange(job.id, value as JobStatus)}
                                        >
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
                                      </TableCell>
                                      <TableCell className="space-y-2">
                                        <Select
                                          value={job.crewMemberId ?? UNASSIGNED_CREW_VALUE}
                                          onValueChange={(value) => handleCrewSelect(job.id, value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Assign crew" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value={UNASSIGNED_CREW_VALUE}>Unassigned</SelectItem>
                                            {crewMembers.map((member) => (
                                              <SelectItem key={member.id} value={member.id}>
                                                {member.name} {member.role ? `- ${member.role}` : ""}
                                              </SelectItem>
                                            ))}
                                            <SelectItem value="__add_new">+ Add new crew member</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">{getCrewMemberName(job.crewMemberId)}</p>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                          <Button size="sm" variant="outline">
                                            <Compass className="mr-1.5 h-4 w-4" />
                                            Map
                                          </Button>
                                          <Button size="sm" variant="ghost">
                                            <Send className="mr-1.5 h-4 w-4" />
                                            On My Way
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                    {job.status === "completed" && expandedCompletionJob === job.id && (
                                      <TableRow className="bg-muted/40">
                                        <TableCell colSpan={7}>{renderCompletionForm(job)}</TableCell>
                                      </TableRow>
                                    )}
                                  </Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="lg:hidden divide-y divide-border/70">
                            {filteredJobs.map((job) => (
                              <div key={job.id} className="space-y-3 p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-foreground">{job.job}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {job.window} - {job.customer}
                                    </p>
                                  </div>
                                  <StatusBadge label={jobStatusOptions[job.status]} tone={job.status} />
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                                  {job.address}
                                </div>
                                <p className="text-xs font-medium text-primary">Estimate {job.estimateId}</p>
                                <Select
                                  value={job.status}
                                  onValueChange={(value) => handleJobStatusChange(job.id, value as JobStatus)}
                                >
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
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Crew</Label>
                                  <Select
                                    value={job.crewMemberId ?? UNASSIGNED_CREW_VALUE}
                                    onValueChange={(value) => handleCrewSelect(job.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Assign crew" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value={UNASSIGNED_CREW_VALUE}>Unassigned</SelectItem>
                                      {crewMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                          {member.name} {member.role ? `- ${member.role}` : ""}
                                        </SelectItem>
                                      ))}
                                      <SelectItem value="__add_new">+ Add new crew member</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <p className="text-xs text-muted-foreground">{getCrewMemberName(job.crewMemberId)}</p>
                                </div>
                                {job.status === "completed" && expandedCompletionJob === job.id && (
                                  <div className="rounded-lg bg-muted/40 p-3">{renderCompletionForm(job)}</div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline">
                                    <Compass className="mr-2 h-4 w-4" />
                                    Open maps
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Send className="mr-2 h-4 w-4" />
                                    On My Way
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>              <TabsContent value="invoices" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
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
                          {invoice.materials && (
                            <p className="text-xs text-muted-foreground">Materials: {invoice.materials}</p>
                          )}
                          {invoice.notes && (
                            <p className="text-xs text-muted-foreground">Notes: {invoice.notes}</p>
                          )}
                          {invoice.attachments && invoice.attachments.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Attachments: {invoice.attachments.join(", ")}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="secondary">
                              <Send className="mr-2 h-4 w-4" />
                              Email PDF
                            </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                SMS PDF link
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

              <TabsContent value="settings" className="bg-background/80 shadow-sm rounded-2xl border border-border/60">
                <div className="grid gap-6 p-6 lg:grid-cols-2">
                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Account & security</CardTitle>
                      <CardDescription>Update password, recovery email, and security preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="password">New password</Label>
                        <Input id="password" type="password" placeholder="********" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="recovery">Recovery email</Label>
                        <Input id="recovery" type="email" placeholder="you@company.com" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button>Save changes</Button>
                      <Button variant="outline">Require re-login</Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-border/70">
                    <CardHeader>
                      <CardTitle className="text-xl">Crew settings</CardTitle>
                      <CardDescription>Manage crew member names and notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="crew-member">Add crew member</Label>
                        <Input id="crew-member" placeholder="Name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Notifications</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Auto replies</Badge>
                          <Badge variant="outline">Daily summary</Badge>
                          <Badge variant="outline">Payment alerts</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="secondary">Save crew</Button>
                      <Button variant="outline">Invite via SMS</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={createJobOpen} onOpenChange={handleCreateJobOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form className="space-y-4" onSubmit={handleCreateJobSubmit}>
            <DialogHeader>
              <DialogTitle>Create job</DialogTitle>
              <DialogDescription>Log a new stop, pick the date, and route it to the crew.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="job-title">Job title</Label>
              <Input
                id="job-title"
                placeholder="Example: AC tune-up"
                value={newJobForm.job}
                onChange={(event) => setNewJobForm((prev) => ({ ...prev, job: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job-customer">Customer</Label>
              <Input
                id="job-customer"
                placeholder="Customer name"
                value={newJobForm.customer}
                onChange={(event) => setNewJobForm((prev) => ({ ...prev, customer: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="grid gap-2">
                <Label htmlFor="job-date">Date</Label>
                <Input
                  id="job-date"
                  type="date"
                  value={newJobForm.date}
                  onChange={(event) => setNewJobForm((prev) => ({ ...prev, date: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-window">Time window</Label>
                <Input
                  id="job-window"
                  placeholder="9:00a - 11:00a"
                  value={newJobForm.window}
                  onChange={(event) => setNewJobForm((prev) => ({ ...prev, window: event.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job-address">Address</Label>
              <Input
                id="job-address"
                placeholder="123 Main St, City, ST"
                value={newJobForm.address}
                onChange={(event) => setNewJobForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job-crew">Assign crew</Label>
              <Select value={newJobForm.crewMemberId} onValueChange={handleNewJobCrewSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_CREW_VALUE}>Unassigned</SelectItem>
                  {crewMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} {member.role ? `- ${member.role}` : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="__add_new">+ Add new crew member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => handleCreateJobOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save job</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={createCrewOpen} onOpenChange={handleCreateCrewOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form className="space-y-4" onSubmit={handleCreateCrewSubmit}>
            <DialogHeader>
              <DialogTitle>Add crew member</DialogTitle>
              <DialogDescription>Save commonly assigned crew so you can route jobs in one click.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="crew-name">Name</Label>
              <Input
                id="crew-name"
                placeholder="Crew name"
                value={newCrewForm.name}
                onChange={(event) => setNewCrewForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crew-role">Role</Label>
              <Input
                id="crew-role"
                placeholder="Install - Service - HVAC"
                value={newCrewForm.role}
                onChange={(event) => setNewCrewForm((prev) => ({ ...prev, role: event.target.value }))}
              />
            </div>
            <DialogFooter className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateCrewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save crew</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="grid grid-cols-6 gap-1 rounded-2xl border border-border bg-card/95 text-foreground shadow-2xl backdrop-blur">
          {navItems.map((item) => {
            const isActive = activeTab === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
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










