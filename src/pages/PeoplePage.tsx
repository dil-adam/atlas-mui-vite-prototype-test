import { useState, useMemo } from 'react';
import { Box, Button, Tabs, Tab, Stack, Chip as MuiChip } from '@mui/material';
import { DataGridPro, type GridColDef } from '@mui/x-data-grid-pro';
import { PageHeader } from '@diligentcorp/atlas-react-bundle';
import PageLayout from '../components/PageLayout';
import AddIcon from '@diligentcorp/atlas-react-bundle/icons/Add';
import EditIcon from '@diligentcorp/atlas-react-bundle/icons/Edit';
import TrashIcon from '@diligentcorp/atlas-react-bundle/icons/Trash';
import type { Person, Group } from '../types/audit';
import peopleData from '../data/people.json';
import groupsData from '../data/groups.json';
import { GroupDialog } from '../components/GroupDialog';

export function PeoplePage() {
  const [tabValue, setTabValue] = useState(0);
  const [people] = useState<Person[]>(peopleData as Person[]);
  const [groups, setGroups] = useState<Group[]>(groupsData as Group[]);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const groupMap = useMemo(() => {
    return new Map(groups.map((g) => [g.id, g]));
  }, [groups]);

  const peopleColumns: GridColDef<Person>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
    },
    {
      field: 'groupIds',
      headerName: 'Groups',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {params.value.map((groupId: string) => {
            const group = groupMap.get(groupId);
            return group ? (
              <MuiChip key={groupId} label={group.name} size="small" />
            ) : null;
          })}
        </Stack>
      ),
    },
  ];

  const groupColumns: GridColDef<Group>[] = [
    {
      field: 'name',
      headerName: 'Group Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 300,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 140,
      valueFormatter: (value) => {
        const types: Record<string, string> = {
          department: 'Department',
          team: 'Team',
          project: 'Project',
        };
        return types[value] || value;
      },
    },
    {
      field: 'memberIds',
      headerName: 'Members',
      width: 100,
      valueGetter: (value) => value.length,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => handleEditGroup(params.row.id)}
            sx={{ minWidth: 'auto', padding: 0.5 }}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            variant="text"
            color="error"
            onClick={() => handleDeleteGroup(params.row.id)}
            sx={{ minWidth: 'auto', padding: 0.5 }}
          >
            <TrashIcon />
          </Button>
        </Stack>
      ),
    },
  ];

  const handleEditGroup = (id: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      setEditingGroup(group);
      setGroupDialogOpen(true);
    }
  };

  const handleDeleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupDialogOpen(true);
  };

  const handleSaveGroup = (groupData: Partial<Group>) => {
    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? { ...g, ...groupData } : g))
      );
    } else {
      setGroups((prev) => [...prev, groupData as Group]);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="People & Groups"
        description="Manage team members and organizational groups"
        actions={
          tabValue === 1 ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddGroup}
            >
              New Group
            </Button>
          ) : null
        }
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          <Tab label="People" />
          <Tab label="Groups" />
        </Tabs>
      </Box>
      {tabValue === 0 && (
        <Box sx={{ height: 'calc(100vh - 340px)', width: '100%' }}>
          <DataGridPro
            rows={people}
            columns={peopleColumns}
            pagination
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Box>
      )}
      {tabValue === 1 && (
        <Box sx={{ height: 'calc(100vh - 340px)', width: '100%' }}>
          <DataGridPro
            rows={groups}
            columns={groupColumns}
            pagination
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Box>
      )}
      <GroupDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        onSave={handleSaveGroup}
        group={editingGroup}
        people={people}
      />
    </PageLayout>
  );
}
