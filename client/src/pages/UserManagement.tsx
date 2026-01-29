import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Shield, User, Trash2 } from "lucide-react";

interface User {
  id: number;
  openId: string;
  name: string;
  email: string;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: string; // Dates might come as strings from API
  updatedAt: string;
  lastSignedIn: string;
}

export default function UserManagement() {
  const { user: currentUser, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  
  const { data: usersData, isLoading, refetch } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: !!currentUser && currentUser.role === "admin",
  });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const updateUserRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You must be an admin to access user management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRoleChange = (openId: string, newRole: "user" | "admin") => {
    updateUserRole.mutate({ openId, role: newRole });
  };

  const handleDeleteUser = (openId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate({ openId });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Management
            </CardTitle>
            <Button onClick={() => refetch()} variant="outline">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Login Method</th>
                    <th className="text-left py-2">Last Signed In</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">
                        <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-2">{user.loginMethod || "-"}</td>
                      <td className="py-2">
                        {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.openId, e.target.value as "user" | "admin")}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.openId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}