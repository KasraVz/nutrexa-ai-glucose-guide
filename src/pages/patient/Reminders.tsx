import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Pencil, Trash2, Bell, Clock } from 'lucide-react';
import { useAuth, MedicationReminder } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const reminderSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
});

type ReminderForm = z.infer<typeof reminderSchema>;

const Reminders = () => {
  const navigate = useNavigate();
  const { user, addMedicationReminder, updateMedicationReminder, deleteMedicationReminder } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null);

  const reminders = user?.profile?.medicationReminders || [];

  const form = useForm<ReminderForm>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      medicationName: '',
      dosage: '',
      time: '',
      notes: '',
    },
  });

  const handleAddReminder = (data: ReminderForm) => {
    if (editingReminder) {
      updateMedicationReminder(editingReminder.id, {
        medicationName: data.medicationName,
        dosage: data.dosage,
        times: [data.time],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        notes: data.notes,
      });
      toast({
        title: 'Reminder Updated',
        description: `${data.medicationName} reminder has been updated.`,
      });
    } else {
      addMedicationReminder({
        medicationName: data.medicationName,
        dosage: data.dosage,
        times: [data.time],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        notes: data.notes,
        enabled: true,
      });
      toast({
        title: 'Reminder Added',
        description: `${data.medicationName} reminder has been set successfully.`,
      });
    }
    form.reset();
    setIsAddDialogOpen(false);
    setEditingReminder(null);
  };

  const handleEdit = (reminder: MedicationReminder) => {
    setEditingReminder(reminder);
    form.setValue('medicationName', reminder.medicationName);
    form.setValue('dosage', reminder.dosage);
    form.setValue('time', reminder.times[0] || '');
    form.setValue('notes', reminder.notes || '');
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    deleteMedicationReminder(id);
    toast({
      title: 'Reminder Deleted',
      description: `${name} reminder has been removed.`,
    });
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateMedicationReminder(id, { enabled: !enabled });
    toast({
      title: enabled ? 'Reminder Disabled' : 'Reminder Enabled',
      description: enabled ? 'You will no longer receive this reminder.' : 'You will now receive this reminder.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Medication Reminders</h1>
              <p className="text-muted-foreground">Manage your medication schedule</p>
            </div>
          </div>
          <Button onClick={() => {
            setEditingReminder(null);
            form.reset();
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Reminders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Medication Schedule
            </CardTitle>
            <CardDescription>
              Set reminders to never miss your medication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reminders Set</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first medication reminder to stay on track
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Reminder
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.medicationName}</TableCell>
                      <TableCell>{reminder.dosage}</TableCell>
                      <TableCell>{reminder.times.join(', ')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={reminder.enabled}
                            onCheckedChange={() => handleToggle(reminder.id, reminder.enabled)}
                          />
                          <Badge variant={reminder.enabled ? 'default' : 'secondary'}>
                            {reminder.enabled ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(reminder)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(reminder.id, reminder.medicationName)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingReminder ? 'Edit Reminder' : 'Add Medication Reminder'}
              </DialogTitle>
              <DialogDescription>
                Set a reminder for your medication schedule
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddReminder)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  {...form.register('medicationName')}
                  placeholder="e.g., Metformin"
                />
                {form.formState.errors.medicationName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.medicationName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  {...form.register('dosage')}
                  placeholder="e.g., 500mg"
                />
                {form.formState.errors.dosage && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.dosage.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...form.register('time')}
                />
                {form.formState.errors.time && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.time.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Any special instructions..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingReminder(null);
                    form.reset();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reminders;
