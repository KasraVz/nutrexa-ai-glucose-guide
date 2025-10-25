import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Eye, Loader2 } from 'lucide-react';
import GlucoseChart from '@/components/GlucoseChart';

const ManagePatients = () => {
  const { specialistPatients, addPatientByUid, getPatientData } = useAuth();
  const { toast } = useToast();
  const [patientUid, setPatientUid] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPatient = async () => {
    if (!patientUid.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const result = await addPatientByUid(patientUid.trim());
      
      if (result.success) {
        toast({
          title: "Patient added!",
          description: `${result.patient?.name} has been added to your patient list.`,
        });
        setPatientUid('');
      } else {
        toast({
          title: "Failed to add patient",
          description: result.error || "Patient not found or already added.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = (patientId: string) => {
    setSelectedPatient(patientId);
    setIsDialogOpen(true);
  };

  const patientData = selectedPatient ? getPatientData(selectedPatient) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Patients</h1>
        <p className="text-muted-foreground mt-2">
          Add patients by their ID and monitor their glucose levels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Patient
          </CardTitle>
          <CardDescription>
            Ask your patient to share their Patient ID from their dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="patient-uid">Patient ID</Label>
              <Input
                id="patient-uid"
                placeholder="Enter patient ID (e.g., patient-uuid-1)"
                value={patientUid}
                onChange={(e) => setPatientUid(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPatient()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Try: patient-uuid-1, patient-uuid-2, or patient-uuid-3
              </p>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddPatient} disabled={isAdding}>
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
          <CardDescription>
            {specialistPatients.length} patient{specialistPatients.length !== 1 ? 's' : ''} under your care
          </CardDescription>
        </CardHeader>
        <CardContent>
          {specialistPatients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No patients added yet.</p>
              <p className="text-sm mt-2">Add your first patient using their ID above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialistPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell className="font-mono text-sm">{patient.id}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(patient.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Patient Glucose Data</DialogTitle>
            <DialogDescription>
              {patientData?.name} - 24-Hour Glucose Trends
            </DialogDescription>
          </DialogHeader>
          {patientData && (
            <div className="mt-4">
              <GlucoseChart />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePatients;
