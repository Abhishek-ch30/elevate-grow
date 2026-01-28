import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { UserLayout } from "../components/layout/UserLayout";
import { User, Mail, Phone, Calendar, Lock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasCertificate, setHasCertificate] = useState(false);

  useEffect(() => {
    if (userProfile) {
      const name = userProfile.full_name || "";
      setFullName(name);
      setOriginalName(name);
      checkCertificateStatus();
    }
  }, [userProfile]);

  const checkCertificateStatus = async () => {
    if (!user) return;
    
    try {
      const certificates = await api.getUserCertificates();
      setHasCertificate(certificates.length > 0);
    } catch (error) {
      console.error('Error checking certificate status:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !fullName.trim() || hasCertificate || fullName === originalName) return;

    setLoading(true);
    setMessage(null);

    try {
      await api.updateUserProfile({ full_name: fullName.trim() });
      setMessage({ type: 'success', text: 'Name updated successfully!' });
      setOriginalName(fullName.trim());
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update name' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const hasChanges = fullName !== originalName && fullName.trim() !== "";

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account details.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="flex items-center gap-3">
                {hasChanges && !hasCertificate && (
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
                {hasCertificate && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Name locked after certificate issue</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Avatar Section */}
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{userProfile?.full_name || user?.email?.split('@')[0]}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">
                    Full Name
                    {hasCertificate && (
                      <span className="ml-2 text-xs text-amber-600">(Locked)</span>
                    )}
                  </Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading || hasCertificate}
                    className={hasCertificate ? "bg-muted cursor-not-allowed" : ""}
                    placeholder={hasCertificate ? "Name cannot be changed after certificate issue" : "Enter your full name"}
                  />
                  {!hasCertificate && hasChanges && (
                    <p className="text-xs text-blue-600 mt-1">
                      Click "Save Changes" to update your name
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userProfile?.phone || ""}
                    disabled
                    className="bg-muted"
                    placeholder="Not editable"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Phone number cannot be changed
                  </p>
                </div>
                <div>
                  <Label>Account Status</Label>
                  <Input
                    value="Active"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userProfile ? new Date().getFullYear() - new Date(userProfile.created_at).getFullYear() : 0}
                </div>
                <div className="text-sm text-muted-foreground">Years as Member</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Completed Courses</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Certificates Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
