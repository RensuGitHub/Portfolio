import React, { useState } from 'react';
import Sidebar from '@/ui/components/Layout/Sidebar';
import payrollData from '@/data/payroll.json';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputBase, Select, MenuItem, FormControl, InputLabel, Chip, Button, IconButton, Checkbox, Avatar, Stack, Tooltip, Divider, Collapse, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Menu } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useSidebar } from '@/ui/context/SidebarContext';

interface PayrollData {
  id: string;
  name: string;
  empId: string;
  department: string;
  salary: string;
  hours: number;
  status: 'Paid' | 'Not Paid';
  avatar: string;
}

// Initialize with data from JSON file
const payrollRows: PayrollData[] = payrollData.payrollData as PayrollData[];

const ROWS_PER_PAGE = 5;

interface FilterState {
  departments: string[];
  status: string[];
  salaryRange: {
    min: string;
    max: string;
  };
}

interface PayrollFormData {
  name: string;
  empId: string;
  department: string;
  salary: string;
  hours: number;
  status: 'Paid' | 'Not Paid';
}

const initialFormData: PayrollFormData = {
  name: '',
  empId: '',
  department: '',
  salary: '',
  hours: 0,
  status: 'Not Paid'
};

const Payroll: React.FC = () => {
  const { isMinimized } = useSidebar();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    departments: [],
    status: [],
    salaryRange: {
      min: '',
      max: '',
    },
  });

  // New states for dialogs and menus
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollData | null>(null);
  const [formData, setFormData] = useState<PayrollFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  // Developer Note: Card data calculations. These will need to be updated with backend integration.
  // The 'Total Payroll Amount' should be calculated from the 'payrolls' table, summing 'net_pay' for the current month.
  const totalPayrollAmount = payrollRows.reduce((acc, row) => {
    const salary = parseFloat(row.salary.replace(/[^0-9.-]+/g,""));
    return acc + salary;
  }, 0);

  // The counts for 'Pending' and 'Successful' payments should be derived from the 'status' or 'is_finalized' field in the 'payrolls' table.
  const pendingPaymentCount = payrollRows.filter(row => row.status === 'Not Paid').length;
  const successfulPaymentCount = payrollRows.filter(row => row.status === 'Paid').length;

  // Get unique departments for filter options
  const departments = Array.from(new Set(payrollRows.map(row => row.department)));
  const statusOptions = ['Paid', 'Not Paid'];

  const handleDepartmentFilterChange = (department: string) => {
    setFilters(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department],
    }));
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      departments: [],
      status: [],
      salaryRange: {
        min: '',
        max: '',
      },
    });
  };

  // Updated filter logic
  const filteredRows = payrollRows
    .filter(row => {
      const searchMatch = row.name.toLowerCase().includes(search.toLowerCase()) || 
                        row.empId.toLowerCase().includes(search.toLowerCase());
      
      const departmentMatch = filters.departments.length === 0 || 
                             filters.departments.includes(row.department);
      
      const statusMatch = filters.status.length === 0 || 
                         filters.status.includes(row.status);
      
      const salary = parseFloat(row.salary.replace('₱', '').replace(',', ''));
      const minSalary = filters.salaryRange.min ? parseFloat(filters.salaryRange.min) : 0;
      const maxSalary = filters.salaryRange.max ? parseFloat(filters.salaryRange.max) : Infinity;
      const salaryMatch = salary >= minSalary && salary <= maxSalary;

      return searchMatch && departmentMatch && statusMatch && salaryMatch;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'empId') return a.empId.localeCompare(b.empId);
      return 0;
    });

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const paginatedRows = filteredRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(filteredRows.map(row => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isAllCurrentPageSelected = paginatedRows.length > 0 && paginatedRows.every(row => selected.includes(row.id));
  const isSomeCurrentPageSelected = paginatedRows.some(row => selected.includes(row.id));

  const handleDeleteSelected = () => {
    // Handle delete functionality here
    console.log('Deleting selected items:', selected);
    setSelected([]);
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: PayrollData) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Add/Edit handlers
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setAddEditDialogOpen(true);
  };

  const handleEdit = (employee: PayrollData) => {
    setIsEditing(true);
    setFormData({
      name: employee.name,
      empId: employee.empId,
      department: employee.department,
      salary: employee.salary.replace('₱', ''),
      hours: employee.hours,
      status: employee.status
    });
    setSelectedEmployee(employee);
    setAddEditDialogOpen(true);
    handleMenuClose();
  };

  const handleFormSubmit = () => {
    // Here you would typically make an API call to save the data
    console.log('Saving payroll data:', formData);
    setAddEditDialogOpen(false);
    // Reset form
    setFormData(initialFormData);
    setSelectedEmployee(null);
  };

  // View handler
  const handleView = (employee: PayrollData) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  // Delete handlers
  const handleDeleteClick = (employeeIds: string[]) => {
    setSelectedForDelete(employeeIds);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to delete the data
    console.log('Deleting employees:', selectedForDelete);
    setDeleteDialogOpen(false);
    setSelectedForDelete([]);
    setSelected([]);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box 
        sx={{ 
          flex: 1, 
          ml: { xs: 0, md: isMinimized ? '90px' : '270px' }, 
          p: 0, 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, pt: { xs: 6, md: 8 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1.5, 
                color: '#1E293B',
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}
            >
              Payroll Management
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748B', 
                fontSize: '1rem',
                fontWeight: 400
              }}
            >
              Manage employee salaries, payments, and generate payroll reports
            </Typography>
          </Box>

          {/* Developer Note: Summary cards for Payroll. These are placeholders and will need backend data. */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Total Payroll Amount (This Month)
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>
                    ₱{totalPayrollAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>💰</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Pending Payment
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>
                    {pendingPaymentCount}
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>⏳</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Payment Successful
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>
                    {successfulPaymentCount}
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>✅</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Placeholder Card
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>
                    --
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>❓</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              px: 3,
              py: 1.5,
              mb: 3,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            Add New Employee
          </Button>

          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            background: '#fff',
            mb: 3
          }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Paper
                  component="form"
                  sx={{
                    p: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '100%', sm: 300 },
                    borderRadius: 2,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                    },
                    '&:focus-within': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  <SearchIcon sx={{ color: '#64748B', mr: 1 }} />
                  <InputBase
                    sx={{ 
                      flex: 1, 
                      fontSize: '0.875rem', 
                      fontFamily: 'Inter, sans-serif',
                      '& input::placeholder': {
                        color: '#94A3B8',
                        opacity: 1,
                      }
                    }}
                    placeholder="Search by name or employee ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Paper>

                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      sx={{ 
                        fontSize: '0.875rem', 
                        height: 40,
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    >
                      <MenuItem value="name">Sort by Name</MenuItem>
                      <MenuItem value="empId">Sort by Employee ID</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setFilterDialogOpen(true)}
                    sx={{
                      borderColor: filters.departments.length > 0 || filters.status.length > 0 || filters.salaryRange.min || filters.salaryRange.max ? '#3b82f6' : '#E2E8F0',
                      color: filters.departments.length > 0 || filters.status.length > 0 || filters.salaryRange.min || filters.salaryRange.max ? '#3b82f6' : '#64748B',
                      borderRadius: 2,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      px: 3,
                      '&:hover': {
                        borderColor: filters.departments.length > 0 || filters.status.length > 0 || filters.salaryRange.min || filters.salaryRange.max ? '#2563eb' : '#CBD5E1',
                        background: '#F8FAFC',
                      },
                    }}
                  >
                    Filters {(filters.departments.length > 0 || filters.status.length > 0 || filters.salaryRange.min || filters.salaryRange.max) && 
                      `(${[
                        filters.departments.length > 0,
                        filters.status.length > 0,
                        filters.salaryRange.min || filters.salaryRange.max
                      ].filter(Boolean).length})`
                    }
                  </Button>
                </Stack>
              </Box>

              {/* Developer Note: This block shows the number of selected employees and a delete button, as requested. */}
              {selected.length > 0 && (
                <Box sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#EDF7ED',
                  borderBottom: '1px solid #E0E0E0',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#4CAF50',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <CloseIcon sx={{ transform: 'rotate(45deg)', width: 16, height: 16, fontWeight: 'bold' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: '#1E4620' }}>
                      {selected.length} selected
                    </Typography>
                  </Box>
                  <Tooltip title="Delete Selected">
                    <IconButton onClick={() => handleDeleteClick(selected)} sx={{ color: '#1E4620' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Stack>

            {/* Filter Dialog */}
            <Dialog 
              open={filterDialogOpen} 
              onClose={() => setFilterDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }}
            >
              <DialogTitle sx={{ 
                borderBottom: '1px solid #E2E8F0',
                px: 3,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>
                  Filter Payroll
                </Typography>
                <IconButton
                  onClick={() => setFilterDialogOpen(false)}
                  size="small"
                  sx={{
                    color: '#64748B',
                    '&:hover': {
                      background: '#F1F5F9',
                      color: '#475569'
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </DialogTitle>
              
              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', mb: 1.5 }}>
                    Department
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {departments.map((department) => (
                      <Chip
                        key={department}
                        label={department}
                        onClick={() => handleDepartmentFilterChange(department)}
                        sx={{
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          px: 1,
                          ...(filters.departments.includes(department)
                            ? {
                                bgcolor: '#3b82f6',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: '#2563eb',
                                },
                              }
                            : {
                                bgcolor: '#F1F5F9',
                                color: '#64748B',
                                '&:hover': {
                                  bgcolor: '#E2E8F0',
                                },
                              }),
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', mb: 1.5 }}>
                    Payment Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {statusOptions.map((status) => (
                      <Chip
                        key={status}
                        label={status}
                        onClick={() => handleStatusFilterChange(status)}
                        sx={{
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          px: 1,
                          ...(filters.status.includes(status)
                            ? {
                                bgcolor: status === 'Paid' ? '#10b981' : '#ef4444',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: status === 'Paid' ? '#059669' : '#dc2626',
                                },
                              }
                            : {
                                bgcolor: '#F1F5F9',
                                color: '#64748B',
                                '&:hover': {
                                  bgcolor: '#E2E8F0',
                                },
                              }),
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', mb: 1.5 }}>
                    Salary Range
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      type="number"
                      size="small"
                      label="Min Amount"
                      value={filters.salaryRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        salaryRange: { ...prev.salaryRange, min: e.target.value }
                      }))}
                      InputProps={{
                        startAdornment: <Typography sx={{ color: '#64748B', mr: 1 }}>₱</Typography>
                      }}
                      sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          '& fieldset': { borderColor: '#E2E8F0' },
                          '&:hover fieldset': { borderColor: '#CBD5E1' },
                          '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                        }
                      }}
                    />
                    <TextField
                      type="number"
                      size="small"
                      label="Max Amount"
                      value={filters.salaryRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        salaryRange: { ...prev.salaryRange, max: e.target.value }
                      }))}
                      InputProps={{
                        startAdornment: <Typography sx={{ color: '#64748B', mr: 1 }}>₱</Typography>
                      }}
                      sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          '& fieldset': { borderColor: '#E2E8F0' },
                          '&:hover fieldset': { borderColor: '#CBD5E1' },
                          '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </DialogContent>

              <DialogActions sx={{ 
                borderTop: '1px solid #E2E8F0',
                px: 3,
                py: 2,
              }}>
                <Button
                  onClick={handleClearFilters}
                  sx={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: '#F1F5F9',
                    },
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setFilterDialogOpen(false)}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    },
                  }}
                >
                  Apply Filters
                </Button>
              </DialogActions>
            </Dialog>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#F8FAFC' }}>
                    <TableCell sx={{ width: 50, padding: '16px 8px' }}>
                      <Checkbox
                        checked={isAllCurrentPageSelected}
                        indeterminate={!isAllCurrentPageSelected && isSomeCurrentPageSelected}
                        onChange={handleSelectAll}
                        sx={{
                          color: '#CBD5E1',
                          '&.Mui-checked': {
                            color: '#3B82F6',
                          },
                          '&.MuiCheckbox-indeterminate': {
                            color: '#3B82F6',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      EMPLOYEE
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      DEPARTMENT
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      SALARY
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      HOURS
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      STATUS
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, idx) => (
                    <TableRow 
                      key={row.id} 
                      sx={{ 
                        background: idx % 2 === 0 ? '#fff' : '#F8FAFC',
                        transition: 'background 0.2s',
                        '&:hover': { 
                          background: '#F1F5F9',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <TableCell sx={{ padding: '16px 8px' }}>
                        <Checkbox
                          checked={selected.includes(row.id)}
                          onChange={() => handleSelect(row.id)}
                          sx={{
                            color: '#CBD5E1',
                            '&.Mui-checked': {
                              color: '#3B82F6',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px 12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={row.avatar}
                            sx={{ 
                              width: 44, 
                              height: 44,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}
                          >
                            {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.875rem', 
                              color: '#1F2937',
                              lineHeight: 1.4
                            }}>
                              {row.name}
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '0.75rem', 
                              color: '#6B7280', 
                              fontWeight: 500 
                            }}>
                              ID: {row.empId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151' }}>
                        <Chip 
                          label={row.department} 
                          size="small"
                          sx={{
                            background: '#E0F2FE',
                            color: '#0277BD',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151', fontWeight: 600 }}>
                        {row.salary}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151' }}>
                        {row.hours}h
                      </TableCell>
                      <TableCell sx={{ padding: '16px 12px' }}>
                        <Chip 
                          label={row.status} 
                          size="small"
                          color={row.status === 'Paid' ? 'success' : 'error'}
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px 12px' }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleView(row)}
                              sx={{ 
                                color: '#6B7280',
                                '&:hover': { 
                                  color: '#3B82F6',
                                  background: '#EFF6FF'
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Payroll">
                            <IconButton 
                              onClick={() => handleEdit(row)}
                              sx={{ 
                                color: '#6B7280',
                                '&:hover': { 
                                  color: '#10B981',
                                  background: '#ECFDF5'
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Options">
                            <IconButton 
                              onClick={(e) => handleMenuOpen(e, row)}
                              sx={{ 
                                color: '#6B7280',
                                '&:hover': { 
                                  color: '#6B7280',
                                  background: '#F1F5F9'
                                }
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 3,
              borderTop: '1px solid #E2E8F0',
              background: '#F8FAFC'
            }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                {`${(page - 1) * ROWS_PER_PAGE + 1}-${Math.min(page * ROWS_PER_PAGE, filteredRows.length)} of ${filteredRows.length}`}
              </Typography>
              
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                shape="rounded"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    '&.Mui-selected': {
                      background: '#3B82F6',
                      color: '#fff',
                      '&:hover': {
                        background: '#2563EB',
                      },
                    },
                    '&:hover': {
                      background: '#F1F5F9',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* More Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
            }
          }}
        >
          <MenuItem 
            onClick={() => selectedEmployee && handleView(selectedEmployee)}
            sx={{ 
              fontSize: '0.875rem',
              py: 1,
              px: 2,
              '&:hover': { background: '#F1F5F9' }
            }}
          >
            <VisibilityIcon fontSize="small" sx={{ mr: 2, color: '#3B82F6' }} />
            View Details
          </MenuItem>
          <MenuItem 
            onClick={() => selectedEmployee && handleEdit(selectedEmployee)}
            sx={{ 
              fontSize: '0.875rem',
              py: 1,
              px: 2,
              '&:hover': { background: '#F1F5F9' }
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 2, color: '#10B981' }} />
            Edit Payroll
          </MenuItem>
          <MenuItem 
            onClick={() => selectedEmployee && handleDeleteClick([selectedEmployee.id])}
            sx={{ 
              fontSize: '0.875rem',
              py: 1,
              px: 2,
              color: '#EF4444',
              '&:hover': { background: '#FEF2F2' }
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Add/Edit Dialog */}
        <Dialog
          open={addEditDialogOpen}
          onClose={() => setAddEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minHeight: '600px',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid #E2E8F0',
            px: 4,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B' }}>
              {isEditing ? 'Edit Payroll' : 'Add New Employee'}
            </Typography>
            <IconButton
              onClick={() => setAddEditDialogOpen(false)}
              size="small"
              sx={{
                color: '#64748B',
                '&:hover': {
                  background: '#F1F5F9',
                  color: '#475569'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '0.875rem', color: 'black', mb: 0.5 }}>
                  <b>Employee Information</b> <br />
                  Fill in the employee's basic information below
                </Typography>
              </Box>

              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
              <TextField
                label="Employee ID"
                value={formData.empId}
                onChange={(e) => setFormData(prev => ({ ...prev, empId: e.target.value }))}
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '0.875rem' }}>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  label="Department"
                  sx={{
                    fontSize: '1rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                  }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', mb: 1 }}>
                  Payroll Details
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 3 }}>
                  Specify the employee's salary and working hours
                </Typography>
              </Box>

              <TextField
                label="Salary"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                fullWidth
                size="medium"
                type="number"
                InputProps={{
                  startAdornment: <Typography sx={{ color: '#64748B', mr: 1 }}>₱</Typography>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
              <TextField
                label="Hours"
                value={formData.hours}
                onChange={(e) => setFormData(prev => ({ ...prev, hours: Number(e.target.value) }))}
                fullWidth
                size="medium"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Paid' | 'Not Paid' }))}
                  label="Status"
                  sx={{
                    fontSize: '1rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                  }}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Not Paid">Not Paid</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ 
            borderTop: '1px solid #E2E8F0',
            px: 4,
            py: 3,
          }}>
            <Button
              onClick={() => setAddEditDialogOpen(false)}
              sx={{
                color: '#64748B',
                fontSize: '0.875rem',
                fontWeight: 500,
                px: 4,
                '&:hover': {
                  background: '#F1F5F9',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                },
              }}
            >
              {isEditing ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: '1px solid #E2E8F0',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>
              Employee Details
            </Typography>
            <IconButton
              onClick={() => setViewDialogOpen(false)}
              size="small"
              sx={{
                color: '#64748B',
                '&:hover': {
                  background: '#F1F5F9',
                  color: '#475569'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {selectedEmployee && (
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={selectedEmployee.avatar}
                    sx={{ 
                      width: 64, 
                      height: 64,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                      {selectedEmployee.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>
                      ID: {selectedEmployee.empId}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 1 }}>
                    Department
                  </Typography>
                  <Chip 
                    label={selectedEmployee.department}
                    sx={{
                      background: '#E0F2FE',
                      color: '#0277BD',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 1 }}>
                    Status
                  </Typography>
                  <Chip 
                    label={selectedEmployee.status}
                    color={selectedEmployee.status === 'Paid' ? 'success' : 'error'}
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 1 }}>
                    Salary
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B' }}>
                    {selectedEmployee.salary}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 1 }}>
                    Hours Worked
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B' }}>
                    {selectedEmployee.hours}h
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>

          <DialogActions sx={{ 
            borderTop: '1px solid #E2E8F0',
            px: 3,
            py: 2,
          }}>
            <Button
              onClick={() => setViewDialogOpen(false)}
              sx={{
                color: '#64748B',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  background: '#F1F5F9',
                },
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setViewDialogOpen(false);
                if (selectedEmployee) handleEdit(selectedEmployee);
              }}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                },
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ 
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>
              Confirm Delete
            </Typography>
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              size="small"
              sx={{
                color: '#64748B',
                '&:hover': {
                  background: '#F1F5F9',
                  color: '#475569'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography sx={{ color: '#64748B' }}>
              Are you sure you want to delete {selectedForDelete.length === 1 ? 'this employee' : 'these employees'}? This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: '#64748B',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  background: '#F1F5F9',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                backgroundColor: '#EF4444',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Payroll; 