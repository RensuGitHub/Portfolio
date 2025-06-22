import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  Button,
  Stack,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Radio,
  RadioGroup,
  InputLabel,
  Divider,
  Grid,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '@/ui/components/Layout/Sidebar';
import { useSidebar } from '@/ui/context/SidebarContext';
import { IMaskInput } from 'react-imask';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import employees data
import employeesData from '@/data/employees.json';

// Define type for raw employee data from JSON
type Gender = 'Male' | 'Female' | 'Other';
type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';

interface RawEmployeeData {
  id: number;
  user_id: number;
  employee_no: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name: string;
  gender: Gender;
  date_of_birth: string;
  civil_status: CivilStatus;
  email_address: string;
  mobile_number: string;
  home_address: string;
  current_address: string;
  sss_number: string;
  philhealth_number: string;
  pagibig_number: string;
  tin_number: string;
  empNo: string;
  department: string;
  position: string;
}

// Add these interfaces for type safety
interface FilterState {
  departments: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

// Add Employee interface to match database schema
interface Employee {
  id: number;
  user_id?: number;
  
  // Personal Info
  employee_no: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name: string;  // Will be generated from first, middle, and last name
  profile_picture_url?: string;
  gender?: Gender;
  date_of_birth?: string;
  civil_status?: CivilStatus;
  email_address?: string;
  mobile_number?: string;

  // Address Info
  home_address?: string;
  current_address?: string;

  // Government IDs
  sss_number?: string;
  philhealth_number?: string;
  pagibig_number?: string;
  tin_number?: string;

  // Additional fields from current implementation
  empNo: string;
  department: string;
  position: string;
}

// Form data interface
interface EmployeeFormData {
  empNo: string;
  department: string;
  position: string;
  email_address: string;
  mobile_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  civil_status: CivilStatus;
  home_address: string;
  current_address: string;
  sss_number: string;
  philhealth_number: string;
  pagibig_number: string;
  tin_number: string;
}

// Add validation interface
interface FormValidation {
  empNo: boolean;
  first_name: boolean;
  last_name: boolean;
  email_address: boolean;
  mobile_number: boolean;
  sss_number: boolean;
  philhealth_number: boolean;
  pagibig_number: boolean;
  tin_number: boolean;
}

// Add validation messages interface
interface ValidationMessages {
  empNo?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  mobile_number?: string;
  sss_number?: string;
  philhealth_number?: string;
  pagibig_number?: string;
  tin_number?: string;
}

const initialFormData: EmployeeFormData = {
  empNo: '',
  department: '',
  position: '',
  email_address: '',
  mobile_number: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: 'Male',
  date_of_birth: '',
  civil_status: 'Single',
  home_address: '',
  current_address: '',
  sss_number: '',
  philhealth_number: '',
  pagibig_number: '',
  tin_number: ''
};

const initialValidation: FormValidation = {
  empNo: true,
  first_name: true,
  last_name: true,
  email_address: true,
  mobile_number: true,
  sss_number: true,
  philhealth_number: true,
  pagibig_number: true,
  tin_number: true
};

// Add function to generate display name
const generateDisplayName = (firstName: string, middleName: string, lastName: string): string => {
  const middleInitial = middleName ? ` ${middleName.charAt(0)}. ` : ' ';
  return `${firstName}${middleInitial}${lastName}`;
};

// Type assertion for the imported data
const rawEmployees = (employeesData as { employeesData: RawEmployeeData[] }).employeesData;

// Map the raw data to Employee type
const employees: Employee[] = rawEmployees.map(emp => ({
  id: emp.id,
  user_id: emp.user_id,
  employee_no: emp.employee_no,
  display_name: emp.display_name,
  first_name: emp.first_name,
  middle_name: emp.middle_name || '',
  last_name: emp.last_name,
  gender: emp.gender,
  date_of_birth: emp.date_of_birth,
  civil_status: emp.civil_status,
  email_address: emp.email_address,
  mobile_number: emp.mobile_number,
  home_address: emp.home_address,
  current_address: emp.current_address,
  sss_number: emp.sss_number,
  philhealth_number: emp.philhealth_number,
  pagibig_number: emp.pagibig_number,
  tin_number: emp.tin_number,
  empNo: emp.empNo,
  department: emp.department,
  position: emp.position,
  profile_picture_url: undefined
}));

// Remove the mockEmployees array since we're using the imported data

// Add interface for masked input props
interface CustomMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  inputRef?: React.Ref<HTMLInputElement>;
  [key: string]: any;
}

// Create masked input components
const PhoneMaskCustom = React.forwardRef<HTMLElement, CustomMaskProps>(
  function PhoneMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+63 000 000 0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as React.Ref<HTMLInputElement>}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const SSSMaskCustom = React.forwardRef<HTMLElement, CustomMaskProps>(
  function SSSMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00-0000000-0"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as React.Ref<HTMLInputElement>}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const PhilHealthMaskCustom = React.forwardRef<HTMLElement, CustomMaskProps>(
  function PhilHealthMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00-000000000-0"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as React.Ref<HTMLInputElement>}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const PagIbigMaskCustom = React.forwardRef<HTMLElement, CustomMaskProps>(
  function PagIbigMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="0000-0000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as React.Ref<HTMLInputElement>}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const TINMaskCustom = React.forwardRef<HTMLElement, CustomMaskProps>(
  function TINMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="000-000-000-000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as React.Ref<HTMLInputElement>}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const Employees: React.FC = () => {
  const { isMinimized } = useSidebar();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    departments: [],
    dateRange: {
      start: '',
      end: '',
    },
  });

  // New states for dialogs
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);

  // Add validation states
  const [validation, setValidation] = useState<FormValidation>(initialValidation);
  const [validationMessages, setValidationMessages] = useState<ValidationMessages>({});
  const [formProgress, setFormProgress] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      console.log('Employees component mounted');
      console.log('Raw employees data:', employeesData);
      console.log('Processed employees:', employees);
    } catch (err) {
      console.error('Error in Employees component:', err);
      setError(err as Error);
    }
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error loading employees</Typography>
        <Typography>{error.message}</Typography>
      </Box>
    );
  }

  // Get unique departments for filter options
  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  // Filter logic
  const applyFilters = (emp: typeof employees[0]) => {
    const departmentMatch = filters.departments.length === 0 || filters.departments.includes(emp.department);
    return departmentMatch;
  };

  // Combined filtering (search + filters)
  const filtered = employees.filter(
    (emp) => {
      const searchMatch = 
        emp.display_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.empNo.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());
      
      return searchMatch && applyFilters(emp);
    }
  );

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(paginated.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (empId: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, empId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== empId));
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Handle filter changes
  const handleDepartmentFilterChange = (department: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      departments: [],
      dateRange: {
        start: '',
        end: '',
      },
    });
  };

  // Add/Edit handlers
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setAddEditDialogOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setIsEditing(true);
    setFormData({
      empNo: employee.empNo,
      department: employee.department,
      position: employee.position,
      email_address: employee.email_address || '',
      mobile_number: employee.mobile_number || '',
      first_name: employee.first_name,
      middle_name: employee.middle_name || '',
      last_name: employee.last_name,
      gender: employee.gender || 'Male',
      date_of_birth: employee.date_of_birth || '',
      civil_status: employee.civil_status || 'Single',
      home_address: employee.home_address || '',
      current_address: employee.current_address || '',
      sss_number: employee.sss_number || '',
      philhealth_number: employee.philhealth_number || '',
      pagibig_number: employee.pagibig_number || '',
      tin_number: employee.tin_number || ''
    });
    setSelectedEmployee(employee);
    setAddEditDialogOpen(true);
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (number: string) => {
    const mobileRegex = /^(\+63|0)[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const validateSSSNumber = (number: string) => {
    const sssRegex = /^\d{2}-\d{7}-\d{1}$/;
    return sssRegex.test(number);
  };

  const validatePhilHealthNumber = (number: string) => {
    const philhealthRegex = /^\d{2}-\d{9}-\d{1}$/;
    return philhealthRegex.test(number);
  };

  const validatePagIbigNumber = (number: string) => {
    const pagibigRegex = /^\d{4}-\d{4}-\d{4}$/;
    return pagibigRegex.test(number);
  };

  const validateTINNumber = (number: string) => {
    const tinRegex = /^\d{3}-\d{3}-\d{3}-\d{3}$/;
    return tinRegex.test(number);
  };

  // Form field change handler with validation
  const handleFormChange = (field: keyof EmployeeFormData, value: string) => {
    setHasUnsavedChanges(true);
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate the changed field
    let isValid = true;
    let message = '';

    switch (field) {
      case 'email_address':
        isValid = validateEmail(value);
        message = isValid ? '' : 'Please enter a valid email address';
        break;
      case 'mobile_number':
        isValid = validateMobileNumber(value);
        message = isValid ? '' : 'Please enter a valid mobile number (+63 or 0 followed by 10 digits)';
        break;
      case 'sss_number':
        isValid = validateSSSNumber(value);
        message = isValid ? '' : 'Please enter a valid SSS number (XX-XXXXXXX-X)';
        break;
      case 'philhealth_number':
        isValid = validatePhilHealthNumber(value);
        message = isValid ? '' : 'Please enter a valid PhilHealth number (XX-XXXXXXXXX-X)';
        break;
      case 'pagibig_number':
        isValid = validatePagIbigNumber(value);
        message = isValid ? '' : 'Please enter a valid Pag-IBIG number (XXXX-XXXX-XXXX)';
        break;
      case 'tin_number':
        isValid = validateTINNumber(value);
        message = isValid ? '' : 'Please enter a valid TIN number (XXX-XXX-XXX-XXX)';
        break;
      case 'first_name':
      case 'last_name':
      case 'empNo':
        isValid = value.trim().length > 0;
        message = isValid ? '' : 'This field is required';
        break;
      default:
        // For optional fields
        isValid = true;
        message = '';
    }

    if (field in validation) {
      setValidation(prev => ({ ...prev, [field]: isValid }));
      setValidationMessages(prev => ({ ...prev, [field]: message }));
    }

    // Update form progress
    const totalFields = Object.keys(validation).length;
    const filledFields = Object.entries(formData).filter(([key, value]) => 
      value && (key in validation ? validation[key as keyof FormValidation] : true)
    ).length;
    setFormProgress((filledFields / totalFields) * 100);
  };

  // Handle form submission with validation
  const handleFormSubmit = () => {
    // Validate all fields
    const newValidation: FormValidation = { ...initialValidation };
    const newMessages: ValidationMessages = {};
    let hasErrors = false;

    // Validate required fields
    const requiredFields: (keyof EmployeeFormData)[] = ['first_name', 'last_name', 'empNo'];
    requiredFields.forEach(field => {
      const value = formData[field];
      const isValid = value.trim().length > 0;
      if (!isValid) {
        hasErrors = true;
        newValidation[field as keyof FormValidation] = false;
        newMessages[field as keyof ValidationMessages] = 'This field is required';
      }
    });

    // Validate format fields
    if (formData.email_address) {
      const isValid = validateEmail(formData.email_address);
      if (!isValid) {
        hasErrors = true;
        newValidation.email_address = false;
        newMessages.email_address = 'Please enter a valid email address';
      }
    }

    if (formData.mobile_number) {
      const isValid = validateMobileNumber(formData.mobile_number);
      if (!isValid) {
        hasErrors = true;
        newValidation.mobile_number = false;
        newMessages.mobile_number = 'Please enter a valid mobile number';
      }
    }

    if (formData.sss_number) {
      const isValid = validateSSSNumber(formData.sss_number);
      if (!isValid) {
        hasErrors = true;
        newValidation.sss_number = false;
        newMessages.sss_number = 'Please enter a valid SSS number';
      }
    }

    if (formData.philhealth_number) {
      const isValid = validatePhilHealthNumber(formData.philhealth_number);
      if (!isValid) {
        hasErrors = true;
        newValidation.philhealth_number = false;
        newMessages.philhealth_number = 'Please enter a valid PhilHealth number';
      }
    }

    if (formData.pagibig_number) {
      const isValid = validatePagIbigNumber(formData.pagibig_number);
      if (!isValid) {
        hasErrors = true;
        newValidation.pagibig_number = false;
        newMessages.pagibig_number = 'Please enter a valid Pag-IBIG number';
      }
    }

    if (formData.tin_number) {
      const isValid = validateTINNumber(formData.tin_number);
      if (!isValid) {
        hasErrors = true;
        newValidation.tin_number = false;
        newMessages.tin_number = 'Please enter a valid TIN number';
      }
    }

    setValidation(newValidation);
    setValidationMessages(newMessages);

    if (!hasErrors) {
      // Generate display name from components
      const displayName = generateDisplayName(formData.first_name, formData.middle_name, formData.last_name);
      
      // Proceed with form submission
      console.log('Saving employee data:', {
        ...formData,
        display_name: displayName
      });
      setAddEditDialogOpen(false);
      setFormData(initialFormData);
      setSelectedEmployee(null);
      setHasUnsavedChanges(false);
    }
  };

  // Handle dialog close with unsaved changes
  const handleDialogClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      setAddEditDialogOpen(false);
      setFormData(initialFormData);
      setSelectedEmployee(null);
    }
  };

  // View handler
  const handleView = (employee: typeof employees[0]) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  // Delete handlers
  const handleDeleteClick = (employeeIds: number[]) => {
    setSelectedForDelete(employeeIds);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Here you would typically make an API call to delete the data
    console.log('Deleting employees:', selectedForDelete);
    setDeleteDialogOpen(false);
    setSelectedForDelete([]);
    setSelectedEmployees([]);
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
          {/* Header Section */}
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
              Employees Management
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748B', 
                fontSize: '1rem',
                fontWeight: 400
              }}
            >
              Manage your organization's employee information, departments, and contact details
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Total Employees
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>
                    {employees.length}
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
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>👥</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Developer Note: This card was changed from "Active Employees" to "Number of Positions". */}
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Number of Positions
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>
                    {new Set(employees.map(emp => emp.position)).size}
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
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>💼</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Departments
                  </Typography>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E293B' }}>
                    {new Set(employees.map(emp => emp.department)).size}
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
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>🏢</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Developer Note: This "Selected" card is now a placeholder. Selection count is shown in the table header. */}
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', background: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Card View
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

          {/* Search and Actions Bar */}
          <Paper sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            background: '#fff' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 'auto' } }}>
                <Paper
                  component="form"
                  sx={{
                    p: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 400,
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
                    placeholder="Search by name, employee number, or department..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Paper>
              </Box>

              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={sort}
                    displayEmpty
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
                    inputProps={{ 'aria-label': 'Sort by' }}
                  >
                    <MenuItem value="">
                      <em>Sort by</em>
                    </MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                    <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                    <MenuItem value="department">Department</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setFilterDialogOpen(true)}
                  sx={{
                    borderColor: filters.departments.length > 0 ? '#3b82f6' : '#E2E8F0',
                    color: filters.departments.length > 0 ? '#3b82f6' : '#64748B',
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 3,
                    '&:hover': {
                      borderColor: filters.departments.length > 0 ? '#2563eb' : '#CBD5E1',
                      background: '#F8FAFC',
                    },
                  }}
                >
                  Filters {(filters.departments.length > 0) && `(${filters.departments.length})`}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 3,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  Add Employee
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Table */}
          <Paper sx={{ 
            borderRadius: 3, 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            background: '#fff', 
            overflow: 'hidden' 
          }}>
            {/* Developer Note: This block shows the number of selected employees and a delete button, as requested. */}
            {selectedEmployees.length > 0 && (
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#EDF7ED',
                borderBottom: '1px solid #E0E0E0'
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
                    {selectedEmployees.length} selected
                  </Typography>
                </Box>
                <Tooltip title="Delete Selected">
                  <IconButton onClick={() => handleDeleteClick(selectedEmployees)} sx={{ color: '#1E4620' }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#F8FAFC' }}>
                    <TableCell sx={{ width: 50, padding: '16px 8px' }}>
                      <input 
                        type="checkbox" 
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                        checked={selectedEmployees.length === paginated.length && paginated.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      EMPLOYEE DETAILS
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
                      POSITION
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      EMAIL
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontSize: '0.875rem', 
                      background: '#F8FAFC',
                      padding: '16px 12px'
                    }}>
                      CONTACT
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
                  {paginated.map((emp, idx) => (
                    <TableRow 
                      key={emp.id} 
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
                        <input 
                          type="checkbox" 
                          style={{ width: 18, height: 18, cursor: 'pointer' }}
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={(e) => handleSelectEmployee(emp.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px 12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 44, 
                              height: 44, 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}
                          >
                            {getInitials(emp.display_name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.875rem', 
                              color: '#1F2937',
                              lineHeight: 1.4
                            }}>
                              {emp.display_name}
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '0.75rem', 
                              color: '#6B7280', 
                              fontWeight: 500 
                            }}>
                              {emp.empNo}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px' }}>
                        <Chip 
                          label={emp.department} 
                          size="small"
                          sx={{
                            background: '#E0F2FE',
                            color: '#0277BD',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151' }}>
                        {emp.position}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151' }}>
                        {emp.email_address}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', padding: '16px 12px', color: '#374151' }}>
                        {emp.mobile_number}
                      </TableCell>
                      <TableCell sx={{ padding: '16px 12px' }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleView(emp)}
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
                          <Tooltip title="Edit Employee">
                            <IconButton 
                              onClick={() => handleEdit(emp)}
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
                          <Tooltip title="Delete Employee">
                            <IconButton 
                              onClick={() => handleDeleteClick([emp.id])}
                              sx={{ 
                                color: '#6B7280',
                                '&:hover': { 
                                  color: '#EF4444',
                                  background: '#FEF2F2'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
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
                {`${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filtered.length)} of ${filtered.length}`}
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

          {/* Footer: Date and Time */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            mt: 4, 
            gap: 2,
            p: 2,
            background: '#fff',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
              Monday, June 17, 2025
            </Typography>
            <span role="img" aria-label="weather" style={{ fontSize: '1rem' }}>🌤️</span>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
              09:03 PM
            </Typography>
          </Box>
        </Box>
      </Box>

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
            Filter Employees
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={addEditDialogOpen}
        onClose={handleDialogClose}
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
          <Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B' }}>
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mt: 1 }}>
              Form Completion: {formProgress.toFixed(0)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={formProgress} 
              sx={{ 
                mt: 1, 
                height: 4, 
                borderRadius: 2,
                backgroundColor: '#E2E8F0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#3b82f6'
                }
              }} 
            />
          </Box>
          <IconButton
            onClick={handleDialogClose}
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

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', mb: 1 }}>
                Employee Information
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#64748B', mb: 3 }}>
                Fill in the employee's basic information below
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                Add/Edit Form
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="First Name"
                      value={formData.first_name}
                      onChange={(e) => handleFormChange('first_name', e.target.value)}
                      error={!validation.first_name}
                      helperText={validationMessages.first_name}
                      required
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
                      label="Middle Name"
                      value={formData.middle_name}
                      onChange={(e) => handleFormChange('middle_name', e.target.value)}
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
                      label="Last Name"
                      value={formData.last_name}
                      onChange={(e) => handleFormChange('last_name', e.target.value)}
                      error={!validation.last_name}
                      helperText={validationMessages.last_name}
                      required
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
                  </Stack>
                </Box>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Employee Number"
                      value={formData.empNo}
                      onChange={(e) => handleFormChange('empNo', e.target.value)}
                      error={!validation.empNo}
                      helperText={validationMessages.empNo}
                      required
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
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => handleFormChange('department', e.target.value)}
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
              </Box>
              <Box>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>Position</InputLabel>
                  <Select
                    value={formData.position}
                    onChange={(e) => handleFormChange('position', e.target.value)}
                    label="Position"
                    sx={{
                      fontSize: '1rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                    }}
                  >
                    {/* Add your position options here */}
                    <MenuItem value="Position 1">Position 1</MenuItem>
                    <MenuItem value="Position 2">Position 2</MenuItem>
                    <MenuItem value="Position 3">Position 3</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                Personal Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="First Name"
                      value={formData.first_name}
                      onChange={(e) => handleFormChange('first_name', e.target.value)}
                      error={!validation.first_name}
                      helperText={validationMessages.first_name}
                      required
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
                      label="Middle Name"
                      value={formData.middle_name}
                      onChange={(e) => handleFormChange('middle_name', e.target.value)}
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
                      label="Last Name"
                      value={formData.last_name}
                      onChange={(e) => handleFormChange('last_name', e.target.value)}
                      error={!validation.last_name}
                      helperText={validationMessages.last_name}
                      required
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
                  </Stack>
                </Box>
                <Box>
                  <Stack spacing={2}>
                    <FormControl fullWidth size="medium">
                      <InputLabel sx={{ fontSize: '0.875rem' }}>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={(e) => handleFormChange('gender', e.target.value as Gender)}
                        label="Gender"
                        sx={{
                          fontSize: '1rem',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleFormChange('date_of_birth', e.target.value)}
                      fullWidth
                      size="medium"
                      InputLabelProps={{ shrink: true }}
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
                      <InputLabel sx={{ fontSize: '0.875rem' }}>Civil Status</InputLabel>
                      <Select
                        value={formData.civil_status}
                        onChange={(e) => handleFormChange('civil_status', e.target.value as CivilStatus)}
                        label="Civil Status"
                        sx={{
                          fontSize: '1rem',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                        }}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                        <MenuItem value="Separated">Separated</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Email Address"
                      type="email"
                      value={formData.email_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
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
                      label="Mobile Number"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
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
                  </Stack>
                </Box>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Home Address"
                      multiline
                      rows={2}
                      value={formData.home_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, home_address: e.target.value }))}
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
                      label="Current Address"
                      multiline
                      rows={2}
                      value={formData.current_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, current_address: e.target.value }))}
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
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                Government IDs
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="SSS Number"
                      value={formData.sss_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, sss_number: e.target.value }))}
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
                      label="PhilHealth Number"
                      value={formData.philhealth_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, philhealth_number: e.target.value }))}
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
                  </Stack>
                </Box>
                <Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Pag-IBIG Number"
                      value={formData.pagibig_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, pagibig_number: e.target.value }))}
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
                      label="TIN Number"
                      value={formData.tin_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, tin_number: e.target.value }))}
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
                  </Stack>
                </Box>
              </Box>
            </Box>
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
        maxWidth="md"
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
            <Stack spacing={3}>
              {/* Header with Avatar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar 
                  src={selectedEmployee.profile_picture_url}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.75rem',
                    fontWeight: 600
                  }}
                >
                  {getInitials(selectedEmployee.display_name)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                    {selectedEmployee.display_name}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{selectedEmployee.empNo}</span>
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Personal Information Section */}
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                  Personal Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          First Name
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.first_name || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Middle Name
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.middle_name || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Last Name
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.last_name || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Gender
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.gender || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Date of Birth
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.date_of_birth || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Civil Status
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.civil_status || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Contact Information Section */}
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Email Address
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.email_address || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Mobile Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.mobile_number || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Home Address
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.home_address || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Current Address
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.current_address || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Government IDs Section */}
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                  Government IDs
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          SSS Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.sss_number || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          PhilHealth Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.philhealth_number || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          Pag-IBIG Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.pagibig_number || '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                          TIN Number
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                          {selectedEmployee.tin_number || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Employment Information */}
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 2 }}>
                  Employment Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
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
                  </Box>
                  <Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748B', mb: 0.5 }}>
                        Employee Number
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: '#1E293B' }}>
                        {selectedEmployee.empNo}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
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
  );
};

export default Employees; 