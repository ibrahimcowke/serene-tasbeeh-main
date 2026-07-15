import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, X, Plus, Copy, Check, LogOut, RefreshCw, Send } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { createGroup, joinGroup, updateGroupMemberCount, subscribeToGroup, type GroupData } from '@/lib/groupSync';
import { toast } from 'sonner';

interface GroupCircleViewProps {
  children: React.ReactNode;
}

export function GroupCircleView({ children }: GroupCircleViewProps) {
  const [open, setOpen] = useState(false);
  const totalAllTime = useTasbeehStore((s) => s.totalAllTime);
  const deviceUuid = useTasbeehStore((s) => s.deviceUuid) || 'user_' + Math.random().toString(36).substring(2, 6);

  // Group persistence states in local storage
  const [currentGroupId, setCurrentGroupId] = useState(() => localStorage.getItem('tasbeehly_group_id') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('tasbeehly_group_user_name') || '');
  const [group, setGroup] = useState<GroupData | null>(null);

  const [groupNameInput, setGroupNameInput] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Real-time listener for group changes
  useEffect(() => {
    if (!open || !currentGroupId) return;

    const unsubscribe = subscribeToGroup(
      currentGroupId,
      (data) => {
        setGroup(data);
      },
      (err) => {
        console.error('Subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [open, currentGroupId]);

  // Sync count on load or manual trigger
  const handleSyncMyCount = async () => {
    if (!currentGroupId || !group) return;
    try {
      await updateGroupMemberCount(currentGroupId, deviceUuid, totalAllTime);
      toast.success('Your count synced with the circle!');
    } catch (e) {
      toast.error('Failed to sync counts.');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupNameInput.trim() || !nameInput.trim()) {
      toast.error('Please enter both Group Name and Your Name.');
      return;
    }
    try {
      const gId = await createGroup(groupNameInput.trim(), nameInput.trim(), deviceUuid);
      localStorage.setItem('tasbeehly_group_id', gId);
      localStorage.setItem('tasbeehly_group_user_name', nameInput.trim());
      setCurrentGroupId(gId);
      setUserName(nameInput.trim());
      toast.success(`Group Created! Code: ${gId}`);
    } catch (e) {
      toast.error('Failed to create group.');
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCodeInput.trim() || !nameInput.trim()) {
      toast.error('Please enter both Group Code and Your Name.');
      return;
    }
    const code = joinCodeInput.trim().toUpperCase();
    try {
      const res = await joinGroup(code, nameInput.trim(), deviceUuid);
      if (res) {
        localStorage.setItem('tasbeehly_group_id', code);
        localStorage.setItem('tasbeehly_group_user_name', nameInput.trim());
        setCurrentGroupId(code);
        setUserName(nameInput.trim());
        setGroup(res);
        toast.success(`Joined ${res.name}!`);
      } else {
        toast.error('Group not found. Double check the code.');
      }
    } catch (e) {
      toast.error('Failed to join group.');
    }
  };

  const handleLeaveGroup = () => {
    localStorage.removeItem('tasbeehly_group_id');
    setCurrentGroupId('');
    setGroup(null);
    toast.success('Left the circle.');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentGroupId);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations
  const membersList = group ? Object.entries(group.members).map(([userId, data]) => ({ userId, ...data })) : [];
  const groupTotal = membersList.reduce((sum, m) => sum + m.count, 0);
  const progressPercent = group ? Math.min(100, (groupTotal / group.targetCount) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col p-0">
        <SheetDescription className="sr-only">
          Join a shared dhikr circle with family and friends.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <SheetTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Group Circle
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                Dhikr is most powerful in congregation. Set shared goals and track progress together.
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6">
              {currentGroupId && group ? (
                /* IN A GROUP */
                <div className="space-y-6 pb-12">
                  {/* Group Header Card */}
                  <div
                    className="p-5 rounded-2xl border flex justify-between items-start"
                    style={{
                      background: 'hsl(var(--card) / 0.6)',
                      borderColor: 'hsl(var(--border) / 0.4)'
                    }}
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">Active Circle</span>
                      <h3 className="text-base font-extrabold text-foreground mt-0.5">{group.name}</h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-muted-foreground font-mono bg-foreground/5 border border-border/40 px-2 py-0.5 rounded-lg">
                          CODE: {group.id}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-1 hover:bg-white/5 rounded-lg text-primary transition-colors cursor-pointer"
                        >
                          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleLeaveGroup}
                      className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all cursor-pointer"
                      title="Leave Group"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Shared Progress</span>
                      <span className="text-primary">{groupTotal.toLocaleString()} / {group.targetCount.toLocaleString()} dhikr</span>
                    </div>
                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/20">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Members ({membersList.length})</span>
                      <button
                        onClick={handleSyncMyCount}
                        className="text-xs text-primary flex items-center gap-1 hover:underline font-semibold cursor-pointer"
                      >
                        <RefreshCw size={12} /> Sync My Count
                      </button>
                    </div>

                    <div className="space-y-2">
                      {membersList.map((m) => {
                        const isMe = m.userId === deviceUuid;
                        const pct = Math.min(100, (m.count / (group.targetCount / membersList.length)) * 100);
                        return (
                          <div
                            key={m.userId}
                            className="p-4 rounded-2xl border space-y-2"
                            style={{
                              background: isMe ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--card) / 0.4)',
                              borderColor: isMe ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border) / 0.2)'
                            }}
                          >
                            <div className="flex justify-between text-xs font-medium">
                              <span className="flex items-center gap-1.5">
                                {m.name} {isMe && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">ME</span>}
                              </span>
                              <span className="text-foreground">{m.count.toLocaleString()}</span>
                            </div>
                            <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary/60 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* NOT IN A GROUP */
                <div className="space-y-6 flex-grow flex flex-col justify-center py-6">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Your Display Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-foreground/5 border border-border/20 text-sm text-foreground focus:outline-none focus:border-primary/50"
                      placeholder="E.g., Ibrahim"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Create Group Box */}
                    <div
                      className="p-5 rounded-2xl border space-y-4"
                      style={{
                        background: 'hsl(var(--card) / 0.6)',
                        borderColor: 'hsl(var(--border) / 0.4)'
                      }}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Create New Circle</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">Start a fresh group and invite family members with a code.</p>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={groupNameInput}
                          onChange={(e) => setGroupNameInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-xs text-foreground focus:outline-none"
                          placeholder="Group Name (e.g. Al-Kawthar)"
                        />
                        <button
                          onClick={handleCreateGroup}
                          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-primary/95 transition-all cursor-pointer shadow-md"
                        >
                          Create Group
                        </button>
                      </div>
                    </div>

                    {/* Join Group Box */}
                    <div
                      className="p-5 rounded-2xl border space-y-4"
                      style={{
                        background: 'hsl(var(--card) / 0.6)',
                        borderColor: 'hsl(var(--border) / 0.4)'
                      }}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Join Existing Circle</h4>
                        <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">Enter a 6-character code sent by a family member to join them.</p>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={joinCodeInput}
                          onChange={(e) => setJoinCodeInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-xs text-foreground uppercase focus:outline-none"
                          placeholder="Enter 6-char Code"
                        />
                        <button
                          onClick={handleJoinGroup}
                          className="w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all text-primary text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          Join Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
