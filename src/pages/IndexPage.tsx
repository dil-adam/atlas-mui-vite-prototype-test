import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Card } from "@diligentcorp/atlas-react-bundle";
import { useNavigate } from "react-router";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import PageLayout from "../components/PageLayout.js";
import auditsData from "../data/audits.json";
import peopleData from "../data/people.json";
import groupsData from "../data/groups.json";

export default function IndexPage() {
  const navigate = useNavigate();
  const audits = auditsData;
  const people = peopleData;
  const groups = groupsData;

  const inProgressCount = audits.filter((a) => a.status === "in-progress").length;
  const overdueCount = audits.filter((a) => a.status === "overdue").length;
  const completedCount = audits.filter((a) => a.status === "completed").length;

  return (
    <PageLayout>
      <PageHeader
        pageTitle="Audit Management Dashboard"
        pageSubtitle="Overview of your enterprise audit operations"
      />
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {audits.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Audits
                </Typography>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {inProgressCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1, color: "error.main" }}>
                  {overdueCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overdue
                </Typography>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {completedCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Card>
          </Box>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box sx={{ flex: 2 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Audits
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {audits.slice(0, 5).map((audit) => (
                    <Box
                      key={audit.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:last-child": { borderBottom: 0, pb: 0 },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {audit.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {new Date(audit.scheduledDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <StatusIndicator
                        variant={
                          (audit.status === "completed"
                            ? "success"
                            : audit.status === "overdue"
                              ? "error"
                              : audit.status === "in-progress"
                                ? "warning"
                                : "info") as any
                        }
                        label={audit.status}
                      />
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/audits")}
                >
                  View All Audits
                </Button>
              </Box>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Team Overview
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="h4">{people.length}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Team Members
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4">{groups.length}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Groups
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/people")}
                >
                  Manage People & Groups
                </Button>
              </Box>
            </Card>
          </Box>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
