import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Role = "owner" | "admin" | "manager" | "member" | "viewer";
type MembershipStatus = "invited" | "active" | "suspended";

type MemberDTO = {
  membership: {
    id: string;
    role: Role;
    status: MembershipStatus;
    userId: string;
    tenantId: string;
    invitedBy?: string | null;
  };
  user?: {
    id: string;
    username: string;
  };
};

type MembersResponse = {
  members: MemberDTO[];
};

const roles: Role[] = ["owner", "admin", "manager", "member", "viewer"];

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{ username: string; role: Role }>({
    username: "",
    role: "member",
  });
  const [error, setError] = useState<string | null>(null);

  const owner = useMemo(
    () => members.find((m) => m.membership.role === "owner"),
    [members],
  );

  useEffect(() => {
    const existingToken = localStorage.getItem("authToken");
    const existingTenant = localStorage.getItem("tenantId");
    if (existingToken && existingTenant) {
      setToken(existingToken);
      setTenantId(existingTenant);
      return;
    }

    (async () => {
      const username = `owner+${Date.now()}@demo.local`;
      const password = "changeme";
      const tenantName = "My Crew";
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, tenantName }),
      });
      if (!resp.ok) {
        setError("Unable to create tenant. Is the server running?");
        return;
      }
      const data = await resp.json();
      if (data?.token && data?.tenant?.id) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("tenantId", data.tenant.id);
        setToken(data.token);
        setTenantId(data.tenant.id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!tenantId || !token) return;
    void loadMembers(tenantId, token);
  }, [tenantId, token]);

  const authHeaders = useMemo(
    () =>
      token
        ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" },
    [token],
  );

  const loadMembers = async (id: string, authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/tenants/${id}/members`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!resp.ok) {
        setError("Unable to load team. Is the server running?");
        return;
      }
      const data: MembersResponse = await resp.json();
      setMembers(data.members);
    } catch (err) {
      setError("Unable to load team. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tenantId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/tenants/${tenantId}/invite`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          username: formState.username.trim(),
          password: "changeme",
          role: formState.role,
          status: "active",
        }),
      });
      if (!resp.ok) {
        setError("Could not add member.");
        return;
      }
      setFormState({ username: "", role: "member" });
      await loadMembers(tenantId, token);
    } catch (err) {
      setError("Could not add member.");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (membershipId: string, role: Role) => {
    if (!token || !tenantId) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/memberships/${membershipId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ role }),
      });
      if (!resp.ok) {
        setError("Could not update role.");
        return;
      }
      await loadMembers(tenantId, token);
    } catch (err) {
      setError("Could not update role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Settings</p>
            <h1 className="text-2xl font-semibold">Team & Roles</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              Tenant: {tenantId ? tenantId.slice(0, 8) : "creating..."}
            </Badge>
            <Button variant="outline" onClick={() => setLocation("/workspace")}>
              Back to workspace
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team members</CardTitle>
              <p className="text-sm text-muted-foreground">
                Owners can delegate access to admins/managers. Invited members are active here immediately for demo purposes.
              </p>
            </div>
            {owner && (
              <Badge variant="secondary">Owner: {owner.user?.username ?? "owner@demo"}</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-destructive" data-testid="text-team-error">
                {error}
              </div>
            )}
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.membership.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border px-4 py-3"
                  data-testid={`row-member-${member.membership.id}`}
                >
                  <div>
                    <p className="font-medium">
                      {member.user?.username ?? "Unspecified user"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {member.membership.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <Select
                      defaultValue={member.membership.role}
                      onValueChange={(value) =>
                        updateRole(member.membership.id, value as Role)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline">{member.membership.role}</Badge>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground" data-testid="text-no-members">
                  No team members yet. Invite someone to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite a crew member</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={addMember}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email or username</label>
                  <Input
                    required
                    value={formState.username}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, username: e.target.value }))
                    }
                    placeholder="sam@example.com"
                    data-testid="input-member-username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={formState.role}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, role: value as Role }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={loading || !tenantId}
                  data-testid="button-invite-member"
                >
                  {loading ? "Working..." : "Invite"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
