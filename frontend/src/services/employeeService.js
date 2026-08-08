import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
    return localStorage.getItem("token");
};

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

export const getEmployees = () =>
    axios.get(API_URL, authHeader());

export const addEmployee = (employee) =>
    axios.post(API_URL, employee, authHeader());

export const updateEmployee = (id, employee) =>
    axios.put(`${API_URL}/${id}`, employee, authHeader());


export const deleteEmployee = (id) =>
    axios.delete(`${API_URL}/${id}`, authHeader());

export const searchEmployee = (name) =>
    axios.get(`${API_URL}/search?name=${name}`, authHeader());

export const getEmployeeById = (id) =>
    axios.get(`${API_URL}/${id}`, authHeader());

export const getEmployeesPage = (page, size) =>
    axios.get(`${API_URL}/page?page=${page}&size=${size}`, authHeader());

export const getMyProfile = () =>
    axios.get(`${API_URL}/employees/me`, authHeader());

export const login = (user) =>
    axios.post(`${API_URL}/auth/login`, user);

export const registerUser = (user) =>
    axios.post(`${API_URL}/auth/register`, user);

const DASHBOARD_URL = `${API_URL}/dashboard`;

export const getDashboardStats = () =>
    axios.get(`${DASHBOARD_URL}/stats`, authHeader());

export const getDashboardDepartments = () =>
    axios.get(`${DASHBOARD_URL}/departments`, authHeader());

export const getDashboardSalaries = () =>
    axios.get(`${DASHBOARD_URL}/salary`, authHeader());

export const getRecentEmployees = () =>
    axios.get(`${DASHBOARD_URL}/recent`, authHeader());

const ATTENDANCE_URL = `${API_URL}/attendance`;

export const checkInAttendance = () =>
    axios.post(`${ATTENDANCE_URL}/checkin`, {}, authHeader());

export const checkOutAttendance = () =>
    axios.post(`${ATTENDANCE_URL}/checkout`, {}, authHeader());

export const getTodayAttendanceStatus = () =>
    axios.get(`${ATTENDANCE_URL}/today`, authHeader());

export const getMyAttendanceHistory = () =>
    axios.get(`${ATTENDANCE_URL}/my-history`, authHeader());

export const getAllAttendanceHistory = () =>
    axios.get(`${ATTENDANCE_URL}/all`, authHeader());

export const searchAttendanceHistory = (query) =>
    axios.get(`${ATTENDANCE_URL}/search?query=${query}`, authHeader());

const LEAVES_URL = `${API_URL}/leaves`;

export const applyLeave = (request) =>
    axios.post(LEAVES_URL, request, authHeader());

export const getMyLeaves = () =>
    axios.get(`${LEAVES_URL}/my-requests`, authHeader());

export const getPendingLeaves = () =>
    axios.get(`${LEAVES_URL}/pending`, authHeader());

export const getAllLeaves = () =>
    axios.get(`${LEAVES_URL}/all`, authHeader());

export const updateLeaveStatus = (id, status, comment) =>
    axios.put(`${LEAVES_URL}/${id}/status`, { status, comment }, authHeader());

const NOTIFICATIONS_URL = `${API_URL}/notifications`;

export const getMyNotifications = () =>
    axios.get(NOTIFICATIONS_URL, authHeader());

export const markNotificationRead = (id) =>
    axios.put(`${NOTIFICATIONS_URL}/${id}/read`, {}, authHeader());

export const markAllNotificationsRead = () =>
    axios.put(`${NOTIFICATIONS_URL}/read-all`, {}, authHeader());

const REPORTS_URL = `${API_URL}/reports`;

export const getAttendanceReport = () =>
    axios.get(`${REPORTS_URL}/attendance`, authHeader());

export const getLeaveReport = () =>
    axios.get(`${REPORTS_URL}/leaves`, authHeader());

export const getDepartmentReport = () =>
    axios.get(`${REPORTS_URL}/departments`, authHeader());

export const getSalaryReport = () =>
    axios.get(`${REPORTS_URL}/salary`, authHeader());

export const updateMyProfile = (employee) =>
    axios.put(`${API_URL}/employees/me/profile`, employee, authHeader());

export const changePassword = (currentPassword, newPassword) =>
    axios.put(`${API_URL}/auth/change-password`, { currentPassword, newPassword }, authHeader());