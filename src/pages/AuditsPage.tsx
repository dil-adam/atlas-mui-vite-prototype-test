import { useState, useMemo } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { DataGridPro, type GridColDef } from '@mui/x-data-grid-pro';
import { PageHeader } from '@diligentcorp/atlas-react-bundle';
import PageLayout from '../components/PageLayout';
import { StatusIndicator } from '@diligentcorp/atlas-react-bundle';
import { AuditDialog } from '../components/AuditDialog';
import AddIcon from '@diligentcorp/atlas-react-bundle/icons/Add';
import EditIcon from '@diligentcorp/atlas-react-bundle/icons/Edit';
import TrashIcon from '@diligentcorp/atlas-react-bundle/icons/Trash';
import type { Audit, Person, Group } from '../types/audit';
import auditsData from '../data/audits.json';
import peopleData from '../data/people.json';
import groupsData from '../data/groups.json';

const STATUS_CONFIG = {
  scheduled: { variant: 'info' as const, label: 'Scheduled' },
  'in-progress': { variant: 'warning' as const, label: 'In Progress' },
  completed: { variant: 'success' as const, label: 'Completed' },
  overdue: { variant: 'error' as const, label: 'Overdue' },
  cancelled: { variant: 'info' as const, label: 'Cancelled' },
};

export function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>(auditsData as Audit[]);
  const [people] = useState<Person[]>(peopleData as Person[]);
  const [groups] = useState<Group[]>(groupsData as Group[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);

  const peopleMap = useMemo(() => {
    return new Map(people.map((p) => [p.id, p]));
  }, [people]);

  const columns: GridColDef<Audit>[] = [
    {
      field: 'name',
      headerName: 'Audit Name',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => {
        const config = STATUS_CONFIG[params.value as keyof typeof STATUS_CONFIG];
        return <StatusIndicator variant={config.variant as any} label={config.label} />;
      },
    },
    {
      field: 'assigneeId',
      headerName: 'Assignee',
      width: 180,
      valueGetter: (value) => {
        if (!value) return 'Unassigned';
        const person = peopleMap.get(value);
        return person?.name || 'Unknown';
      },
    },
    {
      field: 'scheduledDate',
      headerName: 'Scheduled Date',
      type: 'date',
      width: 150,
      valueGetter: (value) => value ? new Date(value) : null,
    },
    {
      field: 'groupId',
      headerName: 'Group',
      width: 150,
      valueGetter: (value) => value || 'None',
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
            onClick={() => handleEdit(params.row.id)}
            sx={{ minWidth: 'auto', padding: 0.5 }}
          >
            <EditIcon />
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => handleDelete(params.row.id)}
            sx={{ minWidth: 'auto', padding: 0.5, color: 'error.main' }}
          >
            <TrashIcon />
          </Button>
        </Stack>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    const audit = audits.find((a) => a.id === id);
    if (audit) {
      setEditingAudit(audit);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setAudits((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAudit = () => {
    setEditingAudit(null);
    setDialogOpen(true);
  };

  const handleSaveAudit = (auditData: Partial<Audit>) => {
    if (editingAudit) {
      setAudits((prev) =>
        prev.map((a) => (a.id === editingAudit.id ? { ...a, ...auditData } : a))
      );
    } else {
      setAudits((prev) => [...prev, auditData as Audit]);
    }
  };

  return (
    <PageLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <PageHeader
          pageTitle="Audits"
          pageSubtitle="Manage and track enterprise audits"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAudit}
        >
          New Audit
        </Button>
      </Stack>
      <Box sx={{ height: 'calc(100vh - 280px)', width: '100%' }}>
        <DataGridPro
          rows={audits}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 25, page: 0 } },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
      {dialogOpen && (
        <AuditDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveAudit}
          audit={editingAudit}
          people={people}
          groups={groups}
        />
      )}
    </PageLayout>
  );
}
