
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Direct content of en/translation.json
const enTranslation = {
  "taskManager": "Task Manager",
  "totalTasks": "Total Tasks",
  "inProgressTasks": "In Progress",
  "completedTasks": "Completed",
  "profile": "Profile",
  "settings": "Settings",
  "adminPanel": "Admin Panel",
  "logout": "Logout",
  "login": "Login",
  // "register": "Register", // Removed
  "switchToLightMode": "Switch to light mode",
  "switchToDarkMode": "Switch to dark mode",
  "changeProfilePicture": "Change profile picture",
  "addNewTask": "Add New Task",
  "yourTasks": "Your Tasks",
  "title": "Title",
  "description": "Description",
  "startTime": "Start Time",
  "endTime": "End Time",
  "status": "Status",
  "category": "Category",
  "assignedUsers": "Assigned Users/Groups (comma separated)",
  "addTaskButton": "Add Task",
  "updateTaskButton": "Update Task",
  "deleteTask": "Delete Task",
  "editTask": "Edit Task",
  "markAsComplete": "Mark as Complete",
  "markAsIncomplete": "Mark as Incomplete",
  "completed": "Completed",
  "yes": "Yes",
  "no": "No",
  "created": "Created",
  "noTasksYet": "No tasks yet. Add a new task to get started!",
  "dashboard": "Dashboard",
  "pendingTasks": "Pending Tasks",
  "dueThisWeek": "Due This Week",
  "taskCategories": "Task Categories",
  "mostUsedCategory": "Most used category",
  "noTasksWithCategories": "No tasks with categories yet.",
  "taskCreatedSuccess": "Task created successfully!",
  "taskDeletedSuccess": "Task deleted.",
  "taskUpdatedSuccess": "Task status updated.",
  "taskUpdatedFullSuccess": "Task updated successfully!",
  "profilePictureUpdatedSuccess": "Profile picture updated!",
  "errorRequired": "Title and Description are required.",
  "closeModal": "Close modal",
  "closeNotification": "Close notification",
  "email": "Email", // Retained for general use if any, login uses emailOrUsername
  "emailOrUsername": "Email or Username",
  "emailOrUsernamePlaceholder": "your.email@example.com or username",
  "password": "Password",
  "name": "Name",
  // "confirmPassword": "Confirm Password", // Removed
  // "alreadyHaveAccount": "Already have an account? Login", // Removed
  // "dontHaveAccount": "Don't have an account? Register", // Removed
  "loginFailed": "Login failed. Please check your credentials.",
  // "registrationFailed": "Registration failed. Please try again.", // Removed
  "loggedInSuccess": "Logged in successfully!",
  // "registeredSuccess": "Registered successfully! Please login.", // Removed
  "loggedInAsGuest": "Logged in as Guest!",
  "guestUser": "Guest User",
  "loginAsGuest": "Login as Guest",
  "language": "Language",
  "english": "English",
  "persian": "فارسی",
  "urgent": "URGENT",
  "backToApp": "Back to App",
  "profileInformation": "Profile Information",
  "noEmailProvided": "No email provided",
  "admin": "Admin",
  "appearanceSettings": "Appearance Settings",
  "appearanceSettingsDescription": "Customize the look and feel of the application.",
  "darkMode": "Dark Mode",
  "notificationPreferences": "Notification Preferences",
  "notificationPreferencesDescription": "Manage how you receive notifications. (Feature coming soon)",
  "emailNotificationsPlaceholder": "Email Notifications: On (Placeholder)",
  "accountManagement": "Account Management",
  "accountManagementDescription": "Manage your account settings. (Feature coming soon)",
  "deleteAccountPlaceholder": "Delete Account (Placeholder)",
  // "passwordsDoNotMatch": "Passwords do not match!", // Removed
  "errorLoginFieldsMissing": "Email/Username and Password are required.",
  // "errorRequired_register": "Name, Email, and Password are required.", // Removed
  "errorFetchingTasks": "Error fetching tasks.",
  "errorCreatingTask": "Error creating task.",
  "errorDeletingTask": "Error deleting task.",
  "errorUpdatingTask": "Error updating task.",
  "errorUpdatingProfilePic": "Error updating profile picture.",
  "errorNetwork": "Network error, please try again.",
  "guestActionRestriction.actionNotAllowed": "{{action}} is not available for guest users. Please log in.",
  "guestAction.createTasks": "Creating tasks",
  "guestAction.deleteTasks": "Deleting tasks",
  "guestAction.updateTasks": "Updating tasks",
  "guestAction.updateProfilePicture": "Updating profile picture",
  "guestNotification.tasksNotSaved": "You are viewing as a guest. Tasks are not saved to the server.",
  "notFound": {
    "title": "Oops! Page Not Found.",
    "message": "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    "goHomeButton": "Go Back Home"
  },
  "status.todo": "To Do",
  "status.inprogress": "In Progress",
  "status.done": "Done",
  "status.blocked": "Blocked",
  "category.work": "Work",
  "category.personal": "Personal",
  "category.study": "Study",
  "category.shopping": "Shopping",
  "category.other": "Other"
};

// Direct content of fa/translation.json
const faTranslation = {
  "taskManager": "مدیریت وظایف",
  "totalTasks": "کل وظایف",
  "inProgressTasks": "در حال انجام",
  "completedTasks": "تکمیل شده",
  "profile": "پروفایل",
  "settings": "تنظیمات",
  "adminPanel": "پنل ادمین",
  "logout": "خروج",
  "login": "ورود",
  // "register": "ثبت نام", // Removed
  "switchToLightMode": "تغییر به حالت روشن",
  "switchToDarkMode": "تغییر به حالت تاریک",
  "changeProfilePicture": "تغییر عکس پروفایل",
  "addNewTask": "افزودن وظیفه جدید",
  "yourTasks": "وظایف شما",
  "title": "عنوان",
  "description": "توضیحات",
  "startTime": "زمان شروع",
  "endTime": "زمان پایان",
  "status": "وضعیت",
  "category": "دسته بندی",
  "assignedUsers": "کاربران/گروه های اختصاص داده شده (جدا شده با کاما)",
  "addTaskButton": "افزودن وظیفه",
  "updateTaskButton": "بروزرسانی وظیفه",
  "deleteTask": "حذف وظیفه",
  "editTask": "ویرایش وظیفه",
  "markAsComplete": "علامت گذاری به عنوان تکمیل شده",
  "markAsIncomplete": "علامت گذاری به عنوان تکمیل نشده",
  "completed": "تکمیل شده",
  "yes": "بله",
  "no": "خیر",
  "created": "ایجاد شده در",
  "noTasksYet": "هنوز وظیفه ای وجود ندارد. برای شروع یک وظیفه جدید اضافه کنید!",
  "dashboard": "داشبورد",
  "pendingTasks": "وظایف در انتظار",
  "dueThisWeek": "موعد این هفته",
  "taskCategories": "دسته بندی وظایف",
  "mostUsedCategory": "پراستفاده ترین دسته بندی",
  "noTasksWithCategories": "هنوز وظیفه ای با دسته بندی وجود ندارد.",
  "taskCreatedSuccess": "وظیفه با موفقیت ایجاد شد!",
  "taskDeletedSuccess": "وظیفه حذف شد.",
  "taskUpdatedSuccess": "وضعیت وظیفه بروزرسانی شد.",
  "taskUpdatedFullSuccess": "وظیفه با موفقیت بروزرسانی شد!",
  "profilePictureUpdatedSuccess": "عکس پروفایل بروزرسانی شد!",
  "errorRequired": "عنوان و توضیحات الزامی هستند.",
  "closeModal": "بستن مودال",
  "closeNotification": "بستن اعلان",
  "email": "ایمیل", // Retained for general use if any, login uses emailOrUsername
  "emailOrUsername": "ایمیل یا نام کاربری",
  "emailOrUsernamePlaceholder": "your.email@example.com یا نام کاربری",
  "password": "رمز عبور",
  "name": "نام",
  // "confirmPassword": "تکرار رمز عبور", // Removed
  // "alreadyHaveAccount": "قبلا ثبت نام کرده اید؟ ورود", // Removed
  // "dontHaveAccount": "حساب کاربری ندارید؟ ثبت نام", // Removed
  "loginFailed": "ورود ناموفق بود. لطفا اطلاعات خود را بررسی کنید.",
  // "registrationFailed": "ثبت نام ناموفق بود. لطفا دوباره تلاش کنید.", // Removed
  "loggedInSuccess": "با موفقیت وارد شدید!",
  // "registeredSuccess": "ثبت نام با موفقیت انجام شد! لطفا وارد شوید.", // Removed
  "loggedInAsGuest": "به عنوان مهمان وارد شدید!",
  "guestUser": "کاربر مهمان",
  "loginAsGuest": "ورود به عنوان مهمان",
  "language": "زبان",
  "english": "English",
  "persian": "فارسی",
  "urgent": "فوری",
  "backToApp": "بازگشت به برنامه",
  "profileInformation": "اطلاعات پروفایل",
  "noEmailProvided": "ایمیل ارائه نشده است",
  "admin": "ادمین",
  "appearanceSettings": "تنظیمات ظاهری",
  "appearanceSettingsDescription": "ظاهر و احساس برنامه را سفارشی کنید.",
  "darkMode": "حالت تاریک",
  "notificationPreferences": "تنظیمات اعلان ها",
  "notificationPreferencesDescription": "نحوه دریافت اعلان ها را مدیریت کنید. (این ویژگی به زودی ارائه می شود)",
  "emailNotificationsPlaceholder": "اعلان های ایمیل: روشن (جایگزین)",
  "accountManagement": "مدیریت حساب",
  "accountManagementDescription": "تنظیمات حساب خود را مدیریت کنید. (این ویژگی به زودی ارائه می شود)",
  "deleteAccountPlaceholder": "حذف حساب (جایگزین)",
  // "passwordsDoNotMatch": "رمزهای عبور مطابقت ندارند!", // Removed
  "errorLoginFieldsMissing": "ایمیل/نام کاربری و رمز عبور الزامی هستند.",
  // "errorRequired_register": "نام، ایمیل و رمز عبور الزامی هستند.", // Removed
  "errorFetchingTasks": "خطا در دریافت وظایف.",
  "errorCreatingTask": "خطا در ایجاد وظیفه.",
  "errorDeletingTask": "خطا در حذف وظیفه.",
  "errorUpdatingTask": "خطا در بروزرسانی وظیفه.",
  "errorUpdatingProfilePic": "خطا در بروزرسانی عکس پروفایل.",
  "errorNetwork": "خطای شبکه، لطفا دوباره تلاش کنید.",
  "guestActionRestriction.actionNotAllowed": "{{action}} برای کاربران مهمان در دسترس نیست. لطفا با یک حساب کاربری وارد شوید.",
  "guestAction.createTasks": "ایجاد وظایف",
  "guestAction.deleteTasks": "حذف وظایف",
  "guestAction.updateTasks": "بروزرسانی وظایف",
  "guestAction.updateProfilePicture": "بروزرسانی تصویر پروفایل",
  "guestNotification.tasksNotSaved": "شما به عنوان مهمان در حال مشاهده هستید. وظایف در سرور ذخیره نمی شوند.",
  "notFound": {
    "title": "اوه! صفحه پیدا نشد.",
    "message": "صفحه ای که به دنبال آن هستید ممکن است حذف شده باشد، نام آن تغییر کرده باشد یا به طور موقت در دسترس نباشد.",
    "goHomeButton": "بازگشت به صفحه اصلی"
  },
  "status.todo": "برای انجام",
  "status.inprogress": "در حال انجام",
  "status.done": "انجام شده",
  "status.blocked": "مسدود شده",
  "category.work": "کاری",
  "category.personal": "شخصی",
  "category.study": "مطالعه",
  "category.shopping": "خرید",
  "category.other": "دیگر"
};


const resources = {
  en: {
    translation: enTranslation,
  },
  fa: {
    translation: faTranslation,
  },
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources,
    fallbackLng: 'en', 
    debug: true, // Changed for development visibility. Set to false for production.
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export const updateHtmlLangAndDir = (lng: string) => {
  const htmlTag = document.documentElement;
  htmlTag.lang = lng;
  htmlTag.dir = i18n.dir(lng);
};

if (i18n.isInitialized) {
  updateHtmlLangAndDir(i18n.language);
} else {
  i18n.on('initialized', () => {
    updateHtmlLangAndDir(i18n.language);
  });
}

i18n.on('languageChanged', (lng) => {
  updateHtmlLangAndDir(lng);
});

export default i18n;
