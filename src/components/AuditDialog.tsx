import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { Audit, AuditStatus, Person, Group } from '../types/audit';

interface AuditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (audit: Partial<Audit>) => void;
  audit?: Audit | null;
  people: Person[];
  groups: Group[];
}

export function AuditDialog({ open, onClose, onSave, audit, people, groups }: AuditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'scheduled' as AuditStatus,
    assigneeId: '',
    scheduledDate: new Date(),
    groupId: '',
  });

  useEffect(() => {
    if (audit) {
      setFormData({
        name: audit.name,
        description: audit.description,
        status: audit.status,
        assigneeId: audit.assigneeId || '',
        scheduledDate: new Date(audit.scheduledDate),
        groupId: audit.groupId || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'scheduled',
        assigneeId: '',
        scheduledDate: new Date(),
        groupId: '',
      });
    }
  }, [audit, open]);

  const handleSubmit = () => {
    const auditData: Partial<Audit> = {
      ...formData,
      assigneeId: formData.assigneeId || null,
      groupId: formData.groupId || null,
      scheduledDate: formData.scheduledDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (audit) {
      auditData.id = audit.id;
    } else {
      auditData.id = `a${Date.now()}`;
      auditData.createdAt = new Date().toISOString();
    }

    onSave(auditData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{audit ? 'Edit Audit' : 'Create New Audit'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Audit Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Status"
            fullWidth
            select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as AuditStatus })}
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Assignee"
            fullWidth
            select
            value={formData.assigneeId}
            onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {people.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                {person.name} - {person.role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Group"
            fullWidth
            select
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
          >
            <MenuItem value="">No Group</MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Scheduled Date"
              value={formData.scheduledDate}
              onChange={(date) => date && setFormData({ ...formData, scheduledDate: date })}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
          {audit ? 'Save Changes' : 'Create Audit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
