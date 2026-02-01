import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Search, 
  Filter,
  Mail,
  MailOpen,
  Reply,
  Archive,
  Calendar,
  User,
  RefreshCw
} from "lucide-react";
import { api, ContactMessage, ContactMessageStatus } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusColors = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  read: "bg-gray-500/10 text-gray-500 border-gray-500/20", 
  replied: "bg-green-500/10 text-green-500 border-green-500/20",
  archived: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
};

const statusIcons = {
  new: Mail,
  read: MailOpen,
  replied: Reply,
  archived: Archive
};

export function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "all">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const filters = {
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await api.admin.getAllContactMessages(filters);
      
      if (response.status === 'success' && response.data) {
        setMessages(response.data.messages);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: ContactMessageStatus) => {
    try {
      setUpdating(messageId);
      const response = await api.admin.updateContactMessageStatus(messageId, status);
      
      if (response.status === 'success') {
        setMessages(messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, status, updated_at: new Date().toISOString() }
            : msg
        ));
        
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status, updated_at: new Date().toISOString() });
        }
        
        toast({
          title: "Success",
          description: `Message marked as ${status}`,
        });
      }
    } catch (error: any) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, searchTerm]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchTerm || 
      message.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages Management</h1>
            <p className="text-muted-foreground">
              Manage contact form submissions from users
            </p>
          </div>
          <Button onClick={fetchMessages} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card 
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              statusFilter === "all" && "ring-2 ring-primary"
            )}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.all}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {(['new', 'read', 'replied', 'archived'] as const).map((status) => {
            const Icon = statusIcons[status];
            return (
              <Card 
                key={status}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  statusFilter === status && "ring-2 ring-primary"
                )}
                onClick={() => setStatusFilter(status)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="text-2xl font-bold">{statusCounts[status]}</p>
                      <p className="text-sm text-muted-foreground capitalize">{status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Contact Messages ({filteredMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading messages...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => {
                  const StatusIcon = statusIcons[message.status];
                  return (
                    <div
                      key={message.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={statusColors[message.status]}>
                              {message.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="font-medium">{message.full_name}</p>
                              <p className="text-sm text-muted-foreground">{message.email}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-medium text-sm">{message.subject}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message);
                                  if (message.status === 'new') {
                                    updateMessageStatus(message.id, 'read');
                                  }
                                }}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5" />
                                  Contact Message
                                </DialogTitle>
                                <DialogDescription>
                                  Message from {message.full_name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedMessage && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">From</label>
                                      <p className="text-sm">{selectedMessage.full_name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm">{selectedMessage.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Date</label>
                                      <p className="text-sm">
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Badge className={statusColors[selectedMessage.status]}>
                                        {selectedMessage.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Subject</label>
                                    <p className="text-sm font-medium mt-1">{selectedMessage.subject}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Message</label>
                                    <div className="mt-1 p-3 bg-muted rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2 pt-4 border-t">
                                    {selectedMessage.status !== 'replied' && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                        disabled={updating === selectedMessage.id}
                                      >
                                        <Reply className="w-4 h-4 mr-2" />
                                        Mark as Replied
                                      </Button>
                                    )}
                                    {selectedMessage.status !== 'archived' && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                                        disabled={updating === selectedMessage.id}
                                      >
                                        <Archive className="w-4 h-4 mr-2" />
                                        Archive
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Select
                            value={message.status}
                            onValueChange={(value: ContactMessageStatus) => 
                              updateMessageStatus(message.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default MessagesManagement;