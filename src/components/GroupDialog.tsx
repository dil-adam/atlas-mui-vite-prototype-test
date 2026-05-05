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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip as MuiChip,
  Box,
} from '@mui/material';
import type { Group, Person } from '../types/audit';

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: Partial<Group>) => void;
  group?: Group | null;
  people: Person[];
}

export function GroupDialog({ open, onClose, onSave, group, people }: GroupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'team' as 'department' | 'team' | 'project',
    memberIds: [] as string[],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        type: group.type,
        memberIds: group.memberIds,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'team',
        memberIds: [],
      });
    }
  }, [group, open]);

  const handleSubmit = () => {
    const groupData: Partial<Group> = {
      ...formData,
    };

    if (group) {
      groupData.id = group.id;
    } else {
      groupData.id = `g${Date.now()}`;
      groupData.createdAt = new Date().toISOString();
    }

    onSave(groupData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{group ? 'Edit Group' : 'Create New Group'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Group Name"
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
            label="Type"
            fullWidth
            select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
          >
            <MenuItem value="department">Department</MenuItem>
            <MenuItem value="team">Team</MenuItem>
            <MenuItem value="project">Project</MenuItem>
          </TextField>
          <FormControl fullWidth>
            <InputLabel>Members</InputLabel>
            <Select
              multiple
              value={formData.memberIds}
              onChange={(e) => setFormData({ ...formData, memberIds: e.target.value as string[] })}
              input={<OutlinedInput label="Members" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const person = people.find((p) => p.id === id);
                    return person ? (
                      <MuiChip key={id} label={person.name} size="small" />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {people.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name} - {person.role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
          {group ? 'Save Changes' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
