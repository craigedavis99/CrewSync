import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Activity,
  BarChart3,
  Download,
  Filter,
  ImageIcon,
  Mail,
  MessageCircle,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";

const mockCustomers = [
  { id: "cust-1", name: "Gus Plumbing HQ", contact: "(512) 555-1998", jobs: 18, invoices: 42 },
  { id: "cust-2", name: "Maria Sanchez", contact: "(512) 555-4433", jobs: 5, invoices: 6 },
  { id: "cust-3", name: "Nora Wilson", contact: "(512) 555-7832", jobs: 9, invoices: 12 },
];

const mockDocuments = [
  { id: "INV-3021", type: "Invoice", customer: "Maria Sanchez", date: "Today", total: "$680.00" },
  { id: "EST-1175", type: "Estimate", customer: "Nora Wilson", date: "Yesterday", total: "$480.00" },
  { id: "RCPT-2212", type: "Receipt", customer: "Gus Plumbing HQ", date: "Nov 18", total: "$1,200.00" },
];

const reportCards = [
  { title: "Jobs completed", value: "42", trend: "+12% vs last week", icon: UserCheck },
  { title: "Outstanding invoices", value: "$7,860", trend: "6 open", icon: Activity },
  { title: "Avg. response time", value: "7m", trend: "-90s faster", icon: MessageCircle },
];

const summaryExamples = {
  invoice: {
    customer: "Gus Plumbing HQ",
    total: 1280,
    lineItems: [
      { description: "Water heater install labor", quantity: 1, rate: 950 },
      { description: "Copper piping / misc", quantity: 1, rate: 180 },
      { description: "Disposal fee", quantity: 1, rate: 150 },
    ],
    notes: "Customer signed paper invoice on-site. Replace serial #WH-99123 in CRM.",
  },
  estimate: {
    customer: "Maria Sanchez",
    total: 285,
    lineItems: [
      { description: "AC tune-up (2 zones)", quantity: 1, rate: 220 },
      { description: "Filters 20x25", quantity: 2, rate: 32.5 },
    ],
    notes: "Requested visit early AM. Mention loyalty discount on approval.",
  },
};

export default function Admin() {
  const [intakeFile, setIntakeFile] = useState<File | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "processing" | "done">("idle");
  const [aiResult, setAiResult] = useState<typeof summaryExamples.invoice | typeof summaryExamples.estimate | null>(
    null,
  );
  const [aiType, setAiType] = useState<"invoice" | "estimate">("invoice");

  const handleIntakeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!intakeFile) return;
    setAiStatus("processing");
    setAiResult(null);
    setTimeout(() => {
      const mock = summaryExamples[aiType];
      setAiResult(mock);
      setAiStatus("done");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Admin
            </Badge>
            <h1 className="text-3xl font-semibold text-foreground">Back office</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track customers, pull documents, and capture hand-written invoices with AI intake. Start with the tabs
            below; everything is optimized for thumbs and fast confirmation.
          </p>
        </header>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="documents">Docs & AI intake</TabsTrigger>
            <TabsTrigger value="reports">Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Customer directory</CardTitle>
                <CardDescription>Tap a customer to view history, resend invoices, or call/Text.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filters
                  </Button>
                  <Button onClick={() => alert("Invite flow goes here")} size="sm" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Add customer
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Jobs</TableHead>
                      <TableHead>Invoices</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <button className="inline-flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" />
                              {customer.contact}
                            </button>
                            <button className="inline-flex items-center gap-1 text-primary">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>{customer.jobs}</TableCell>
                        <TableCell>{customer.invoices}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View history
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Document locker</CardTitle>
                <CardDescription>Search or export invoices, estimates, and receipts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="rounded-xl border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {doc.id} · {doc.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.customer} · {doc.date}
                        </p>
                        <p className="text-sm font-medium text-foreground">{doc.total}</p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary">
                  <Filter className="h-4 w-4" />
                  Advanced filter / export
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed border-primary/40 bg-primary/5">
              <CardHeader>
                <CardTitle>AI intake: handwritten invoice / estimate</CardTitle>
                <CardDescription>
                  Snap a photo or upload a scan; we’ll parse line items, totals, and notes so you can review before
                  saving.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleIntakeSubmit}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="grid gap-2">
                      <Label htmlFor="ai-type">Document type</Label>
                      <select
                        id="ai-type"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                        value={aiType}
                        onChange={(event) => setAiType(event.target.value as "invoice" | "estimate")}
                      >
                        <option value="invoice">Invoice</option>
                        <option value="estimate">Estimate</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="intake-file">Photo or PDF</Label>
                      <Input
                        id="intake-file"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(event) => setIntakeFile(event.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Optional notes for AI (e.g., 'customer approved 10% discount')."
                    className="min-h-[80px]"
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="submit"
                      disabled={!intakeFile || aiStatus === "processing"}
                      className="inline-flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      {aiStatus === "processing" ? "Processing photo…" : "Create draft"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAiStatus("idle");
                        setAiResult(null);
                        setIntakeFile(null);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
                {aiStatus === "processing" && (
                  <p className="mt-3 text-sm text-muted-foreground">Reading handwriting and extracting line items…</p>
                )}
                {aiResult && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">AI draft preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Customer: <span className="font-medium text-foreground">{aiResult.customer}</span>
                    </p>
                    <div className="space-y-1">
                      {aiResult.lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.description}</span>
                          <span className="font-medium">${item.rate.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-foreground">Total: ${aiResult.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Notes: {aiResult.notes}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        Accept & save
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {reportCards.map((card) => (
                <Card key={card.title} className="border-border/70">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.trend}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Weekly performance</CardTitle>
                <CardDescription>Summary of completed jobs, quotes sent, and outstanding balances.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Jobs by status</Label>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>Scheduled</span>
                    <span className="font-semibold text-foreground">18</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>Completed</span>
                    <span className="font-semibold text-foreground">42</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>Awaiting payment</span>
                    <span className="font-semibold text-foreground">6</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quick exports</Label>
                  <Button variant="outline" className="flex w-full items-center justify-between">
                    Download CSV
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="flex w-full items-center justify-between text-primary">
                    Email weekly digest
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="flex w-full items-center justify-between text-primary">
                    Send SMS summary
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

