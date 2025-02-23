import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  X,
  Edit,
  Trash,
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isAfter, isBefore, addDays } from "date-fns";
// Theme configuration for light and dark modes
const colorPalette = {
  light: {
    primary: "from-violet-500 to-indigo-500",
    secondary: "from-pink-500 to-rose-500",
    tertiary: "from-emerald-500 to-teal-500",
    background: "bg-slate-50",
    card: "bg-white/70",
    border: "border-slate-200",
    text: "text-slate-900",
    textMuted: "text-slate-500",
    hover: "hover:bg-slate-100",
    input: "bg-white/50",
    calendar: {
      today: "bg-violet-50",
      past: "bg-slate-50",
      todayBorder: "border-violet-200",
      active: "hover:border-violet-200",
    },
  },
  dark: {
    primary: "from-violet-400 to-indigo-400",
    secondary: "from-pink-400 to-rose-400",
    tertiary: "from-emerald-400 to-teal-400",
    background: "bg-gray-950",
    card: "bg-gray-900/90",
    border: "border-gray-700",
    text: "text-gray-100",
    textMuted: "text-gray-400",
    hover: "hover:bg-gray-800",
    input: "bg-gray-800/90",
    calendar: {
      today: "bg-violet-900/30",
      past: "bg-gray-900/50",
      todayBorder: "border-violet-700",
      active: "hover:border-violet-600",
    },
  },
};

// Mock data for doctors and patients
const doctors = [
  { id: 1, name: "Dr. Sarah Smith", specialty: "Cardiologist" },
  { id: 2, name: "Dr. John Doe", specialty: "Pediatrician" },
  { id: 3, name: "Dr. Emily Brown", specialty: "Neurologist" },
];

const patients = [
  { id: 1, name: "James Wilson" },
  { id: 2, name: "Maria Garcia" },
  { id: 3, name: "Robert Johnson" },
];

// Application Context for global state management
const AppContext = createContext();

// Main provider component for global state
const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);
  // Notification handler with auto-dismiss
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        appointments,
        setAppointments,
        notification,
        showNotification,
        searchQuery,
        setSearchQuery,
      }}
    >
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>{children}</div>
    </AppContext.Provider>
  );
};

// Form component for creating and editing appointments
const AppointmentForm = ({ onClose, editAppointment }) => {
  const { appointments, setAppointments, showNotification } =
    useContext(AppContext);
  const [formData, setFormData] = useState({
    doctorId: editAppointment?.doctorId || "",
    patientId: editAppointment?.patientId || "",
    startTime: editAppointment?.startTime || "09:00",
    startDate:
      editAppointment?.startDate || new Date().toISOString().split("T")[0],
    endDate: editAppointment?.endDate || new Date().toISOString().split("T")[0],
    description: editAppointment?.description || "",
  });
  // Form submission handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // Validate appointment dates
    if (isBefore(startDate, now)) {
      showNotification("Cannot book appointments in the past!");
      return;
    }

    if (isBefore(endDate, startDate)) {
      showNotification("End date cannot be before start date!");
      return;
    }
    // Update or create appointment
    if (editAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === editAppointment.id
          ? { ...formData, id: editAppointment.id }
          : apt
      );
      setAppointments(updatedAppointments);
      showNotification("Appointment updated successfully!");
    } else {
      setAppointments([...appointments, { ...formData, id: Date.now() }]);
      showNotification("Appointment booked successfully!");
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium dark:text-gray-200">
          Doctor
        </label>
        <Select
          value={formData.doctorId}
          onValueChange={(value) =>
            setFormData({ ...formData, doctorId: value })
          }
        >
          <SelectTrigger className="w-full bg-white/50 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select Doctor" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id.toString()}>
                <div className="flex flex-col">
                  <span className="dark:text-gray-200">{doctor.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {doctor.specialty}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-2 font-medium dark:text-gray-200">
          Patient
        </label>
        <Select
          value={formData.patientId}
          onValueChange={(value) =>
            setFormData({ ...formData, patientId: value })
          }
        >
          <SelectTrigger className="w-full bg-white/50 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select Patient" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id.toString()}>
                <span className="dark:text-gray-200">{patient.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium dark:text-gray-200">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium dark:text-gray-200">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium dark:text-gray-200">
          Time
        </label>
        <input
          type="time"
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium dark:text-gray-200">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100"
          rows="3"
          placeholder="Add appointment details..."
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
      >
        {editAppointment ? "Update Appointment" : "Book Appointment"}
      </Button>
    </form>
  );
};

// Component for displaying upcoming appointments
const UpcomingAppointments = () => {
  const { appointments, searchQuery } = useContext(AppContext);
  const now = new Date();
  // Filter and sort upcoming appointments
  const upcomingAppointments = appointments
    .filter((apt) => {
      const startDate = new Date(apt.startDate);
      const matchesSearch =
        searchQuery.toLowerCase() === "" ||
        doctors
          .find((d) => d.id.toString() === apt.doctorId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        patients
          .find((p) => p.id.toString() === apt.patientId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        apt.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return isAfter(startDate, now) && matchesSearch;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <motion.div className="w-96" {...fadeInUp} transition={{ delay: 0.2 }}>
      <div
        className={`${colorPalette.light.card} dark:${colorPalette.dark.card} backdrop-blur-xl rounded-2xl shadow-xl border ${colorPalette.light.border} dark:${colorPalette.dark.border} p-6 mb-6`}
      >
        <h2
          className={`text-xl font-bold bg-gradient-to-r ${colorPalette.light.primary} dark:${colorPalette.dark.primary} bg-clip-text text-transparent mb-4`}
        >
          Upcoming Appointments
        </h2>
        <div className="space-y-4">
          <AnimatePresence>
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
            {upcomingAppointments.length === 0 && (
              <motion.p
                {...fadeInUp}
                className={`text-center py-4 ${colorPalette.light.textMuted} dark:${colorPalette.dark.textMuted}`}
              >
                No upcoming appointments
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Individual appointment card component
const AppointmentCard = ({ appointment }) => {
  const { appointments, setAppointments, showNotification } =
    useContext(AppContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const doctor = doctors.find((d) => d.id.toString() === appointment.doctorId);
  const patient = patients.find(
    (p) => p.id.toString() === appointment.patientId
  );
  // Style configuration based on doctor ID
  const getAppointmentStyle = () => {
    const styles = {
      1: {
        bg: "bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30",
        border: "border-violet-200/20 dark:border-violet-700/30",
        text: "text-violet-700 dark:text-violet-300",
        avatar: "bg-gradient-to-r from-violet-500 to-indigo-500",
        description: "text-gray-600 dark:text-gray-400",
      },
      2: {
        bg: "bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30",
        border: "border-pink-200/20 dark:border-pink-700/30",
        text: "text-pink-700 dark:text-pink-300",
        avatar: "bg-gradient-to-r from-pink-500 to-rose-500",
        description: "text-gray-600 dark:text-gray-400",
      },
      3: {
        bg: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30",
        border: "border-emerald-200/20 dark:border-emerald-700/30",
        text: "text-emerald-700 dark:text-emerald-300",
        avatar: "bg-gradient-to-r from-emerald-500 to-teal-500",
        description: "text-gray-600 dark:text-gray-400",
      },
    };
    return styles[doctor.id] || styles[1];
  };

  const style = getAppointmentStyle();
  const isMultiDay = appointment.startDate !== appointment.endDate;

  return (
    <>
      <motion.div
        {...scaleIn}
        whileHover={{ scale: 1.02, translateY: -2 }}
        className={`p-4 rounded-xl border backdrop-blur-lg shadow-lg ${style.bg} ${style.border}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 rounded-xl ${style.avatar} flex items-center justify-center text-white shadow-lg`}
            >
              {doctor.name.charAt(0)}
            </motion.div>
            <div>
              <h3 className={`font-semibold ${style.text}`}>
                {patient.name} with {doctor.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {appointment.startTime} -{" "}
                  {format(new Date(appointment.startDate), "MMM dd, yyyy")}
                  {isMultiDay &&
                    ` to ${format(
                      new Date(appointment.endDate),
                      "MMM dd, yyyy"
                    )}`}
                </p>
              </div>
              {appointment.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {appointment.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            editAppointment={appointment}
            onClose={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Calendar view component
const AppointmentCalendar = () => {
  const { darkMode, appointments, searchQuery, setSearchQuery } =
    useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  // Helper function to get days in current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    // Fill in empty days at start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    // Fill in days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };
  // Filter appointments for specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter((apt) => {
      const aptStartDate = new Date(apt.startDate);
      const aptEndDate = new Date(apt.endDate);
      const currentDate = new Date(date);

      // Reset time components for date comparison
      aptStartDate.setHours(0, 0, 0, 0);
      aptEndDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      // Check if the appointment falls within the date range
      return (
        currentDate >= aptStartDate &&
        currentDate <= aptEndDate &&
        (searchQuery.toLowerCase() === "" ||
          doctors
            .find((d) => d.id.toString() === apt.doctorId)
            ?.name.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          patients
            .find((p) => p.id.toString() === apt.patientId)
            ?.name.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };

  return (
    <div className="flex gap-6">
      <motion.div className="flex-1" {...fadeInUp}>
        <div className="bg-white/70 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <motion.div
            className="flex items-center justify-between mb-8"
            {...fadeInUp}
          >
            <div className="flex items-center space-x-4">
              <h2
                className={`text-2xl font-bold bg-gradient-to-r ${colorPalette.light.primary} dark:${colorPalette.dark.primary} bg-clip-text text-transparent`}
              >
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl ${colorPalette.light.hover} dark:${colorPalette.dark.hover} transition-colors`}
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl ${colorPalette.light.hover} dark:${colorPalette.dark.hover} transition-colors`}
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Search and New Appointment buttons */}
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAppointmentModal(true)}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>New Appointment</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={`text-sm font-medium ${colorPalette.light.textMuted} dark:${colorPalette.dark.textMuted} text-center py-2`}
              >
                {day}
              </div>
            ))}

            <AnimatePresence>
              {getDaysInMonth(currentDate).map((date, index) => {
                const isToday =
                  date && date.toDateString() === new Date().toDateString();
                const isPast = date && isBefore(date, new Date());

                return (
                  <motion.div
                    key={index}
                    {...scaleIn}
                    transition={{ delay: index * 0.02 }}
                    className={`min-h-28 p-2 rounded-xl border 
                        ${
                          date
                            ? `${colorPalette.light.border} dark:${
                                colorPalette.dark.border
                              } 
                             ${
                               !isPast &&
                               "hover:border-violet-200 dark:hover:border-violet-700 cursor-pointer"
                             } 
                             transition-colors`
                            : "border-transparent"
                        } 
                        ${
                          isToday
                            ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
                            : isPast
                            ? "bg-slate-50 dark:bg-slate-800/30"
                            : `${colorPalette.light.card} dark:${colorPalette.dark.card}`
                        }`}
                  >
                    {date && (
                      <>
                        <div
                          className={`font-medium mb-2 ${
                            isToday
                              ? "text-blue-600 dark:text-blue-400"
                              : isPast
                              ? "text-gray-400 dark:text-gray-600"
                              : ""
                          }`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getAppointmentsForDate(date).map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="w-96">
        <UpcomingAppointments />
      </div>

      <Dialog
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
      >
        <DialogContent className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Book Appointment
            </DialogTitle>
          </DialogHeader>
          <AppointmentForm onClose={() => setShowAppointmentModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// App Component
const App = () => {
  const { darkMode, toggleDarkMode, notification } = useContext(AppContext);

  return (
    <div
      className={`min-h-screen ${colorPalette.light.background} dark:${colorPalette.dark.background}`}
    >
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <nav className="flex space-x-4">
              <a href="#" className="text-blue-600 font-medium">
                Calendar
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              >
                Doctors
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              >
                Patients
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  {notification}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AppointmentCalendar />
      </div>
    </div>
  );
};
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: springTransition,
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: springTransition,
};

// Sidebar Component
const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={springTransition}
      className="w-64 bg-white/70 dark:bg-gray-900/90 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Scheduler
          </span>
        </motion.div>

        <nav className="space-y-2">
          {[
            { icon: Calendar, label: "Calendar", active: true },
            { icon: User, label: "Doctors" },
            { icon: Users, label: "Patients" },
            { icon: Settings, label: "Settings" },
          ].map((item, index) => (
            <motion.a
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30 text-violet-700 dark:text-violet-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  item.active ? "text-violet-600 dark:text-violet-400" : ""
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </motion.a>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-8 left-0 right-0 px-6"
        >
          <a
            href="#"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};
// Layout and RootApp components
const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
};

const RootApp = () => {
  return (
    <AppProvider>
      <Layout>
        <App />
      </Layout>
    </AppProvider>
  );
};

export default RootApp;
