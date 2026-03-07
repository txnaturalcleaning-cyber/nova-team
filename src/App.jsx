import { useState, useRef, useEffect, createContext, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";


/* ─── FIREBASE ─── */
const firebaseConfig = {
  apiKey: "AIzaSyCe6xKkp_aOnEolWPGFAxi5iFwxlGqZ3Jo",
  authDomain: "nova-launch-system.firebaseapp.com",
  projectId: "nova-launch-system",
  storageBucket: "nova-launch-system.firebasestorage.app",
  messagingSenderId: "563032399847",
  appId: "1:563032399847:web:57288456478398044fe742"
};
const fbApp = initializeApp(firebaseConfig);
const db    = getFirestore(fbApp);

/* ═══════════════════════════════════════════════════════════
   NOVA LAUNCH SYSTEM — Production v1.0 (Bilingual RU/EN)
   Super Admin: contact@naturalcleaning4u.com / NLS2025!
═══════════════════════════════════════════════════════════ */

/* ─── TRANSLATIONS ─── */
const T = {
  ru: {
    appName: "Nova Launch System", appSub: "Business Platform",
    login: "Вход в систему", loginSub: "Введите ваши данные для входа",
    email: "Email", password: "Пароль", enter: "Войти →", checking: "Проверяем...",
    wrongCreds: "Неверный email или пароль", fillAll: "Введите email и пароль",
    superAdmin: "Супер-админ", owner: "Владелец", employee: "Сотрудник",
    logout: "Выйти",
    dashboard: "Дашборд", partners: "Партнёры", departments: "Отделы и сотрудники",
    branches: "Города", tasks: "Задачи", schedule: "Расписание",
    salary: "Зарплаты", performance: "Эффективность", chat: "Чат", kb: "База знаний", pnl: "Финансы P&L",
    main: "Главное", workspace: "Рабочее пространство",
    addPartner: "+ Добавить партнёра", addEmployee: "+ Добавить пользователя",
    addDept: "+ Новый отдел", addBranch: "+ Добавить город",
    addTask: "+ Создать задачу", addShift: "+ Добавить смену",
    addPayment: "+ Добавить", addMaterial: "+ Добавить материал",
    addPnl: "+ Добавить запись", pnlIncome: "Доходы", pnlExpense: "Расходы", pnlNet: "Чистая прибыль", pnlMargin: "Маржа", pnlCategory: "Категория", pnlAmount: "Сумма", pnlType: "Тип", pnlInc: "Доход", pnlExp: "Расход", pnlDate: "Дата", pnlNote: "Описание", pnlNoData: "Нет записей", pnlSummary: "Сводка за месяц",
    save: "Сохранить", cancel: "Отмена", delete: "Удалить", create: "Создать",
    createAccount: "Создать аккаунт",
    active: "Активен", inactive: "Неактивен", blocked: "Заблокирован",
    block: "Блокировать", unblock: "Разблокировать",
    enterCabinet: "Войти в кабинет", exitCabinet: "← Выйти из кабинета",
    viewingPartner: "Вы просматриваете кабинет партнёра:",
    noPartners: "Партнёров пока нет", noPartnersDesc: "Нажмите «+ Добавить партнёра» чтобы создать первый White Label аккаунт",
    noEmployees: "Сотрудников пока нет", noTasks: "Задач пока нет",
    noBranches: "Городов пока нет", noSchedule: "Расписание пусто",
    noPayments: "Нет записей", noKb: "Материалов пока нет",
    totalPartners: "Партнёров всего", totalEmployees: "Сотрудников",
    monthlyRevenue: "Ежемес. выручка", blockedCount: "Заблокировано",
    activePartners: "активных", inAllCompanies: "Во всех компаниях",
    byActivePlans: "По активным тарифам",
    empCount: "Сотрудников", taskCount: "Задач", inProgress: "В работе",
    deptCount: "Отделов", done: "Выполнено", created: "Создано",
    recentTasks: "Последние задачи", employees: "Сотрудники",
    allPartners: "Все партнёры", company: "Компания", plan: "Тариф",
    createdAt: "Дата", status: "Статус", actions: "Действия",
    name: "Имя и фамилия", role: "Роль", emailLogin: "Email (логин)",
    companyName: "Название компании", logo: "Логотип (эмодзи)",
    brandColor: "Цвет бренда (Pro+)", partnerEmail: "Email (логин партнёра)",
    partnerPass: "Пароль",
    planBasic: "Basic — $97/мес (до 10 сотр., 1 город)",
    planPro: "Pro — $197/мес (до 50 сотр., 5 городов + брендинг)",
    planVIP: "VIP — $297/мес (∞ сотр., брендинг + SOPы)",
    newPartner: "Новый партнёр White Label",
    partnerInfo: "🏢 Партнёр получит изолированный кабинет с доступами согласно тарифу. Вы всегда можете войти в его кабинет.",
    addUser: "Добавить пользователя",
    empInfo: "🔐 Логин и пароль создаёт администратор. Сотрудник не может изменить свои данные.",
    accessSections: "Доступы к разделам",
    accessWarn: "Выберите только те разделы к которым сотрудник будет иметь доступ.",
    statusLabel: "Статус",
    newDept: "Новый отдел", deptName: "Название отдела", deptIcon: "Иконка", deptColor: "Цвет",
    preview: "Предпросмотр:",
    newBranch: "Новый город / офис", branchName: "Название офиса", branchCity: "Город",
    branchLimit: "Лимит городов для тарифа",
    newTask: "Новая задача", taskTitle: "Название задачи", assignee: "Исполнитель",
    priority: "Приоритет", due: "Срок", selectAssignee: "Выберите...",
    high: "Высокий", medium: "Средний", low: "Низкий",
    todo: "📋 К выполнению", inProgressCol: "⚡ В работе", doneCol: "✅ Готово",
    back: "← Назад", forward: "В работу →", markDone: "✓ Готово",
    newShift: "Добавить смену", shiftEmp: "Сотрудник",
    startTime: "Начало", endTime: "Конец", address: "Адрес объекта",
    clientName: "Клиент", notes: "Заметки", confirmed: "✓ Подтв.", pending: "Ожид.",
    newPayment: "Добавить выплату", amount: "Сумма $", payDate: "Дата выплаты",
    note: "Примечание", payStatus: "Статус",
    paid: "✓ Оплачено", notPaid: "⏳ Ожидает",
    markPaid: "✓ Оплатить", unmarkPaid: "↩ Отменить",
    totalPaid: "Выплачено", totalPending: "Ожидает", totalRecords: "Записей",
    allTime: "Всего оплачено", toPay: "К выплате", inHistory: "В истории",
    efficiency: "эффективность", noPerf: "Добавьте сотрудников чтобы отслеживать эффективность",
    channels: "Каналы", general: "Общий", typeMessage: "Написать сообщение...",
    all: "Все", sop: "SOP", youtube: "YouTube", gdocs: "Документы",
    newKb: "Добавить материал в базу знаний",
    kbType: "Тип", kbDept: "Отдел", kbIcon: "Иконка", kbTitle: "Название",
    kbUrl: "Ссылка YouTube", kbDesc: "Описание", kbContent: "Содержание SOP",
    kbGdocUrl: "Ссылка на Google Doc / внешний документ",
    kbGdocDesc: "Краткое описание документа",
    kbGdocHint: "Вставьте ссылку на Google Docs, Notion, Dropbox Paper или любой другой документ",
    openYt: "Открыть на YouTube", openDoc: "🔗 Открыть документ",
    opensNewTab: "Откроется в новой вкладке",
    backToKb: "← Назад к базе знаний",
    sopType: "📄 SOP Документ", ytType: "▶ YouTube Урок", gdocType: "🔗 Google Doc / Ссылка",
    changePlan: "⬆ Тариф", confirmPlan: "Сменить тариф на",
    confirmDelete: "Удалить партнёра?",
    empPerPlan: "Сотрудников:", citiesPerPlan: "Городов:",
    noAccess: "Нет доступа к этому разделу",
    copyright: "Nova Launch System © 2025",
    loading: "Загрузка...",
  },
  en: {
    appName: "Nova Launch System", appSub: "Business Platform",
    login: "Sign In", loginSub: "Enter your credentials to continue",
    email: "Email", password: "Password", enter: "Sign In →", checking: "Checking...",
    wrongCreds: "Incorrect email or password", fillAll: "Please enter email and password",
    superAdmin: "Super Admin", owner: "Owner", employee: "Employee",
    logout: "Sign Out",
    dashboard: "Dashboard", partners: "Partners", departments: "Departments & Staff",
    branches: "Cities", tasks: "Tasks", schedule: "Schedule",
    salary: "Payroll", performance: "Performance", chat: "Chat", kb: "Knowledge Base",
    main: "Main", workspace: "Workspace",
    addPartner: "+ Add Partner", addEmployee: "+ Add User",
    addDept: "+ New Department", addBranch: "+ Add City",
    addTask: "+ Create Task", addShift: "+ Add Shift",
    addPayment: "+ Add", addMaterial: "+ Add Material",
    save: "Save", cancel: "Cancel", delete: "Delete", create: "Create",
    createAccount: "Create Account",
    active: "Active", inactive: "Inactive", blocked: "Blocked",
    block: "🔒 Block", unblock: "🔓 Unblock",
    enterCabinet: "👁 View Cabinet", exitCabinet: "← Exit Cabinet",
    viewingPartner: "You are viewing partner cabinet:",
    noPartners: "No partners yet", noPartnersDesc: "Click «+ Add Partner» to create your first White Label account",
    noEmployees: "No employees yet", noTasks: "No tasks yet",
    noBranches: "No cities yet", noSchedule: "Schedule is empty",
    noPayments: "No records", noKb: "No materials yet",
    totalPartners: "Total Partners", totalEmployees: "Employees",
    monthlyRevenue: "Monthly Revenue", blockedCount: "Blocked",
    activePartners: "active", inAllCompanies: "Across all companies",
    byActivePlans: "By active plans",
    empCount: "Employees", taskCount: "Tasks", inProgress: "In Progress",
    deptCount: "Departments", done: "Completed", created: "Created",
    recentTasks: "Recent Tasks", employees: "Employees",
    allPartners: "All Partners", company: "Company", plan: "Plan",
    createdAt: "Date", status: "Status", actions: "Actions",
    name: "Full Name", role: "Role", emailLogin: "Email (login)",
    companyName: "Company Name", logo: "Logo (emoji)",
    brandColor: "Brand Color (Pro+)", partnerEmail: "Email (partner login)",
    partnerPass: "Password",
    planBasic: "Basic — $97/mo (up to 10 staff, 1 city)",
    planPro: "Pro — $197/mo (up to 50 staff, 5 cities + branding)",
    planVIP: "VIP — $297/mo (∞ staff, branding + SOPs)",
    newPartner: "New White Label Partner",
    partnerInfo: "🏢 Partner will get an isolated cabinet with access per their plan. You can always view their cabinet.",
    addUser: "Add User",
    empInfo: "🔐 Login and password are set by the admin. The employee cannot change their credentials.",
    accessSections: "Section Access",
    accessWarn: "Select only the sections this employee should have access to.",
    statusLabel: "Status",
    newDept: "New Department", deptName: "Department Name", deptIcon: "Icon", deptColor: "Color",
    preview: "Preview:",
    newBranch: "New City / Office", branchName: "Office Name", branchCity: "City",
    branchLimit: "City limit for plan",
    newTask: "New Task", taskTitle: "Task Title", assignee: "Assignee",
    priority: "Priority", due: "Due Date", selectAssignee: "Select...",
    high: "High", medium: "Medium", low: "Low",
    todo: "📋 To Do", inProgressCol: "⚡ In Progress", doneCol: "✅ Done",
    back: "← Back", forward: "Start →", markDone: "✓ Done",
    newShift: "Add Shift", shiftEmp: "Employee",
    startTime: "Start", endTime: "End", address: "Object Address",
    clientName: "Client", notes: "Notes", confirmed: "✓ Confirmed", pending: "Pending",
    newPayment: "Add Payment", amount: "Amount $", payDate: "Payment Date",
    note: "Note", payStatus: "Status",
    paid: "✓ Paid", notPaid: "⏳ Pending",
    markPaid: "✓ Mark Paid", unmarkPaid: "↩ Undo",
    totalPaid: "Paid", totalPending: "Pending", totalRecords: "Records",
    allTime: "Total Paid", toPay: "To Pay", inHistory: "In History",
    efficiency: "efficiency", noPerf: "Add employees to track performance",
    channels: "Channels", general: "General", typeMessage: "Type a message...",
    all: "All", sop: "SOP", youtube: "YouTube", gdocs: "Documents",
    newKb: "Add Knowledge Base Material",
    kbType: "Type", kbDept: "Department", kbIcon: "Icon", kbTitle: "Title",
    kbUrl: "YouTube Link", kbDesc: "Description", kbContent: "SOP Content",
    kbGdocUrl: "Google Doc / External Document Link",
    kbGdocDesc: "Brief description",
    kbGdocHint: "Paste a link to Google Docs, Notion, Dropbox Paper or any other document",
    openYt: "Open on YouTube", openDoc: "🔗 Open Document",
    opensNewTab: "Opens in a new tab",
    backToKb: "← Back to Knowledge Base",
    sopType: "📄 SOP Document", ytType: "▶ YouTube Lesson", gdocType: "🔗 Google Doc / Link",
    changePlan: "⬆ Plan", confirmPlan: "Change plan to",
    confirmDelete: "Delete this partner?",
    empPerPlan: "Employees:", citiesPerPlan: "Cities:",
    noAccess: "No access to this section",
    copyright: "Nova Launch System © 2025",
    loading: "Loading...",
  }
};

const LangCtx = createContext({ lang:"ru", t: T.ru, setLang:()=>{} });
const useLang = () => useContext(LangCtx);

/* ─── CONSTANTS ─── */
const SUPER_ADMIN = {
  id:"sa_1", name:"Zalina Karimova",
  email:"contact@naturalcleaning4u.com", password:"Zalina2025",
  type:"superadmin",
};

/* ─── SVG ICONS ─── */
const IC = {
  dashboard:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  departments: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  branches:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  tasks:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  schedule:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  salary:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  performance: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  chat:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  kb:          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  pnl:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  partners:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  attach:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  mic:         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  send:        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  lock:        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  unlock:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  eye:         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  plus:        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

const ALL_SECTIONS = [
  { id:"dashboard",   icon:IC.dashboard },
  { id:"departments", icon:IC.departments },
  { id:"branches",    icon:IC.branches },
  { id:"tasks",       icon:IC.tasks },
  { id:"schedule",    icon:IC.schedule },
  { id:"salary",      icon:IC.salary },
  { id:"performance", icon:IC.performance },
  { id:"chat",        icon:IC.chat },
  { id:"kb",          icon:IC.kb },
  { id:"pnl",         icon:IC.pnl },
];

const PLAN_SECTIONS = {
  Basic: ["dashboard","departments","tasks","chat","kb","pnl"],
  Pro:   ["dashboard","departments","branches","tasks","schedule","salary","performance","chat","kb","pnl"],
  VIP:   ["dashboard","departments","branches","tasks","schedule","salary","performance","chat","kb","pnl"],
};

const PLAN_LIMITS = {
  Basic: { employees:10,  branches:1,   price:97  },
  Pro:   { employees:50,  branches:5,   price:197 },
  VIP:   { employees:999, branches:999, price:297 },
};

const ROLES_RU = ["CEO / Основатель","Операционный менеджер","Менеджер по продажам","Буккипер / Бухгалтер","HR Специалист","Супервайзер","Клинер","Представитель компании","SMM Менеджер","Маркетолог","Администратор продаж","Другое"];
const ROLES_EN = ["CEO / Founder","Operations Manager","Sales Manager","Bookkeeper / Accountant","HR Specialist","Supervisor","Cleaner","Company Representative","SMM Manager","Marketer","Sales Administrator","Other"];

/* ─── STYLES ─── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#07090f;--s1:#0d1119;--s2:#131825;--s3:#1a2030;--bdr:#ffffff0b;--bdr2:#ffffff14;--tx:#e6eaf4;--mu:#576070;--mu2:#333d50;--acc:#f0a500;--gr:#22c55e;--rd:#ef4444;--bl:#3b82f6;--pu:#a855f7;}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;}
button,input,select,textarea{font-family:'DM Sans',sans-serif;cursor:pointer;}
input,select,textarea{cursor:text;}
.app{display:flex;height:100vh;overflow:hidden;}
.sb{width:232px;min-width:232px;background:var(--s1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;overflow:hidden;}
.sb-logo{padding:16px 14px 12px;border-bottom:1px solid var(--bdr);}
.sb-logo-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:800;letter-spacing:-.3px;line-height:1.2;}
.sb-logo-sub{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.8px;margin-top:2px;}
.sb-user{display:flex;align-items:center;gap:8px;padding:9px 13px;border-bottom:1px solid var(--bdr);}
.sb-nav{flex:1;padding:5px 7px;overflow-y:auto;display:flex;flex-direction:column;}
.sb-sec{font-size:10px;color:var(--mu2);text-transform:uppercase;letter-spacing:.8px;padding:9px 8px 3px;font-weight:600;}
.nb{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:8px;border:none;background:none;color:var(--mu);font-size:13px;font-weight:500;width:100%;text-align:left;transition:all .15s;}
.nb:hover{background:var(--s2);color:var(--tx);}
.nb.act{color:var(--acc);background:var(--acc)10;}
.nb .ni{width:15px;text-align:center;font-size:13px;flex-shrink:0;}
.nb .cnt{margin-left:auto;background:var(--acc);color:#000;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;}
.sb-foot{padding:9px 13px;border-top:1px solid var(--bdr);}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{padding:11px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--s1);flex-shrink:0;}
.pg-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;}
.pg-sub{font-size:11px;color:var(--mu);margin-top:1px;}
.content{flex:1;overflow-y:auto;padding:20px;}
.btn{padding:7px 14px;border-radius:8px;border:none;font-size:13px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px;}
.btn-p{background:var(--acc);color:#000;} .btn-p:hover{background:#fbbf24;}
.btn-g{background:var(--s2);color:var(--tx);border:1px solid var(--bdr);} .btn-g:hover{background:var(--s3);}
.btn-d{background:#ef444415;color:var(--rd);border:1px solid #ef444425;}
.btn-bl{background:#3b82f615;color:var(--bl);border:1px solid #3b82f625;}
.btn-sm{padding:4px 10px;font-size:11px;}
.card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:17px;}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}
.card-t{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;}
.stat{background:var(--s1);border:1px solid var(--bdr);border-radius:11px;padding:14px 16px;}
.stat-l{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;}
.stat-v{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;margin-top:4px;}
.stat-s{font-size:11px;color:var(--mu);margin-top:2px;}
.tw{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:7px 10px;color:var(--mu);font-size:10px;text-transform:uppercase;letter-spacing:.5px;font-weight:500;border-bottom:1px solid var(--bdr);}
td{padding:10px 10px;border-bottom:1px solid var(--bdr);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--s2);}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;}
.b-gr{background:#22c55e15;color:var(--gr);} .b-rd{background:#ef444415;color:var(--rd);}
.b-yw{background:#f0a50015;color:var(--acc);} .b-bl{background:#3b82f615;color:var(--bl);}
.b-pu{background:#a855f715;color:var(--pu);} .b-mu{background:#ffffff0b;color:var(--mu);}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.av-lg{width:38px;height:38px;font-size:13px;}
.flex-c{display:flex;align-items:center;gap:10px;}
.ovl{position:fixed;inset:0;background:#00000092;display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(4px);}
.modal{background:var(--s1);border:1px solid var(--bdr2);border-radius:16px;padding:24px;width:520px;max-width:95vw;max-height:92vh;overflow-y:auto;}
.modal-t{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:16px;}
.fg{margin-bottom:12px;}
.lbl{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:block;}
.inp{width:100%;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:8px 10px;color:var(--tx);font-size:13px;outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--acc);}
select.inp option{background:var(--s2);}
textarea.inp{resize:vertical;min-height:80px;line-height:1.6;}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
.ma{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;}
.info{background:var(--bl)10;border:1px solid var(--bl)20;border-radius:8px;padding:9px 12px;font-size:12px;color:#93c5fd;margin-bottom:13px;line-height:1.5;}
.warn{background:var(--acc)10;border:1px solid var(--acc)20;border-radius:8px;padding:9px 12px;font-size:12px;color:#fcd34d;margin-bottom:12px;line-height:1.5;}
.imp-banner{background:var(--pu)15;border-bottom:1px solid var(--pu)30;padding:7px 20px;display:flex;align-items:center;gap:10px;font-size:12px;color:#c4b5fd;flex-shrink:0;}
.chat-wrap{display:flex;height:100%;min-height:0;}
.content.chat-page{padding:0;overflow:hidden;display:flex;flex-direction:column;}
.chat-sb{width:190px;min-width:190px;border-right:1px solid var(--bdr);padding:8px;overflow-y:auto;}
.chat-ch{padding:6px 8px;border-radius:7px;cursor:pointer;font-size:12px;color:var(--mu);display:flex;align-items:center;gap:7px;transition:all .15s;}
.chat-ch:hover{background:var(--s2);color:var(--tx);}
.chat-ch.act{background:var(--acc)12;color:var(--acc);font-weight:500;}
.chat-main{flex:1;display:flex;flex-direction:column;}
.chat-hd{padding:10px 14px;border-bottom:1px solid var(--bdr);font-weight:600;font-size:13px;display:flex;align-items:center;gap:8px;}
.chat-msgs{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;}
.chat-bbl{background:var(--s2);border-radius:10px;padding:10px 12px;max-width:68%;}
.chat-ia{padding:9px 12px;border-top:1px solid var(--bdr);display:flex;gap:8px;}
.chat-inp{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:9px;padding:8px 11px;color:var(--tx);font-size:13px;outline:none;}
.chat-inp:focus{border-color:var(--acc);}
.kb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:12px;}
.kb-card{background:var(--s1);border:1px solid var(--bdr);border-radius:11px;padding:16px;cursor:pointer;transition:all .15s;}
.kb-card:hover{border-color:var(--bdr2);transform:translateY(-1px);}
.task-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px;}
.task-col{background:var(--s1);border:1px solid var(--bdr);border-radius:11px;padding:12px;}
.task-item{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:11px;margin-bottom:7px;}
.partner-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:13px;}
.partner-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:17px;transition:all .15s;}
.partner-card:hover{border-color:var(--bdr2);}
.lang-toggle{display:flex;gap:3px;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:3px;}
.lang-btn{padding:4px 10px;border-radius:6px;border:none;font-size:11px;font-weight:600;background:none;color:var(--mu);transition:all .15s;}
.lang-btn.act{background:var(--acc);color:#000;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px;}

/* ── MOBILE RESPONSIVE ── */
@media (max-width: 768px) {
  .app{flex-direction:column;}
  .sb{display:none;}
  .main{height:100vh;padding-bottom:62px;}
  .content{padding:14px;}
  .stats{grid-template-columns:1fr 1fr !important;}
  .task-cols{grid-template-columns:1fr !important;}
  .partner-grid{grid-template-columns:1fr !important;}
  .kb-grid{grid-template-columns:1fr 1fr !important;}
  .fr{grid-template-columns:1fr !important;}
  .tw{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .modal{width:100% !important;max-width:100vw;max-height:88vh;border-radius:20px 20px 0 0;position:fixed;bottom:0;left:0;top:auto;}
  .ovl{align-items:flex-end;}
  .topbar{padding:10px 14px;}
  .pg-title{font-size:15px;}
  .imp-banner{padding:6px 14px;font-size:11px;flex-wrap:wrap;}
  .chat-sb{display:none;}
  .chat-sb.mob-open{display:flex !important;flex-direction:column;position:fixed;inset:0;z-index:200;background:var(--s1);width:100%;padding:56px 14px 14px;}
  .mob-nav{display:flex !important;}
  .mob-ch-btn{display:flex !important;}
}
.mob-nav{
  display:none;position:fixed;bottom:0;left:0;right:0;height:60px;
  background:var(--s1);border-top:1px solid var(--bdr2);
  z-index:100;align-items:center;justify-content:space-around;padding:0 2px;
}
.mob-nb{
  display:flex;flex-direction:column;align-items:center;gap:1px;
  border:none;background:none;color:var(--mu);
  font-size:9px;font-weight:500;padding:6px 4px;
  flex:1;cursor:pointer;transition:color .15s;min-width:0;max-width:60px;
}
.mob-nb .mi{font-size:21px;line-height:1.2;}
.mob-nb.act{color:var(--acc);}
.mob-ch-btn{display:none;}
`;

/* ─── HELPERS ─── */
const AVC = ["#f0a500","#e05c2a","#22c55e","#3b82f6","#a855f7","#ec4899","#06b6d4","#f97316"];
const avColor = n => AVC[(n||"?").charCodeAt(0) % AVC.length];

function Av({ name="?", color, size="" }) {
  const c = color || avColor(name);
  const i = (name||"?").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
  return <div className={`av ${size}`} style={{background:c+"22",color:c}}>{i}</div>;
}
function Bdg({ children, cls="b-mu" }) { return <span className={`badge ${cls}`}>{children}</span>; }
const planBdg = p => ({ Basic:"b-bl", Pro:"b-yw", VIP:"b-pu" }[p]||"b-mu");

/* ─── LOGIN ─── */
function LoginScreen({ partners, onLogin, lang, setLang }) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [pw, setPw]       = useState("");
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState("");
  const [loading, setL]   = useState(false);

  function tryLogin() {
    if (!email.trim()||!pw.trim()) { setErr(t.fillAll); return; }
    setL(true); setErr("");
    setTimeout(()=>{
      const e = email.trim().toLowerCase();
      if (e===SUPER_ADMIN.email&&pw===SUPER_ADMIN.password) { onLogin({...SUPER_ADMIN}); return; }
      const partner = partners.find(p=>p.email===e&&p.password===pw&&p.status==="active");
      if (partner) { onLogin({...partner,type:"partner"}); return; }
      let found = null;
      for (const p of partners) {
        const emp=(p.employees||[]).find(em=>em.email===e&&em.password===pw&&em.status==="active");
        if (emp) { found={...emp,type:"employee",partnerId:p.id}; break; }
      }
      if (found) { onLogin(found); return; }
      setErr(t.wrongCreds); setL(false);
    },600);
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",flexDirection:"column"}}>
      <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",width:500,height:500,background:"var(--acc)",opacity:.04,borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none"}}/>
      {/* Language toggle */}
      <div style={{position:"absolute",top:20,right:24}} className="lang-toggle">
        <button className={`lang-btn ${lang==="ru"?"act":""}`} onClick={()=>setLang("ru")}>RU</button>
        <button className={`lang-btn ${lang==="en"?"act":""}`} onClick={()=>setLang("en")}>EN</button>
      </div>
      <div style={{textAlign:"center",marginBottom:26}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,color:"var(--mu)",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>{t.appName}</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,letterSpacing:-1.5,lineHeight:1.1}}>
          {lang==="ru"?"Платформа управления":"Business Management"}<br/>
          <span style={{color:"var(--acc)"}}>{lang==="ru"?"клининговым бизнесом":"for Cleaning Companies"}</span>
        </div>
      </div>
      <div style={{background:"var(--s1)",border:"1px solid var(--bdr2)",borderRadius:16,padding:"26px 30px",width:390}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,marginBottom:3}}>{t.login}</div>
        <div style={{fontSize:12,color:"var(--mu)",marginBottom:20}}>{t.loginSub}</div>
        <div className="fg">
          <label className="lbl">{t.email}</label>
          <input className="inp" placeholder="your@email.com" value={email}
            onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/>
        </div>
        <div className="fg">
          <label className="lbl">{t.password}</label>
          <div style={{position:"relative"}}>
            <input className="inp" type={show?"text":"password"} placeholder="••••••••" value={pw}
              style={{paddingRight:38}}
              onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/>
            <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--mu)",fontSize:14,padding:2}}>{show?"🙈":"👁"}</button>
          </div>
        </div>
        {err&&<div style={{background:"#ef444415",border:"1px solid #ef444428",borderRadius:8,padding:"8px 11px",fontSize:12,color:"var(--rd)",marginBottom:13}}>⚠️ {err}</div>}
        <button onClick={tryLogin} disabled={loading}
          style={{width:"100%",background:loading?"var(--s3)":"var(--acc)",color:loading?"var(--mu)":"#000",border:"none",borderRadius:10,padding:"10px",fontSize:14,fontWeight:600,fontFamily:"'Syne',sans-serif",transition:"all .2s"}}>
          {loading?t.checking:t.enter}
        </button>
      </div>
      <div style={{marginTop:14,fontSize:11,color:"var(--mu2)"}}>{t.copyright}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [lang, setLang]           = useState("ru");
  const t = T[lang];
  const roles = lang==="ru" ? ROLES_RU : ROLES_EN;

  const [partners,    setPartners]    = useState([]);
  const [fbLoading,   setFbLoading]   = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewPartner, setViewPartner] = useState(null);
  const [saMode,      setSaMode]      = useState("workspace"); // "workspace" | "partners"
  const [page,        setPage]        = useState("dashboard");
  const [modal,       setModal]       = useState(null);
  const [chatChannel, setChatChannel] = useState("general");
  const [chatMsgs,    setChatMsgs]    = useState({});
  const [kbView,      setKbView]      = useState(null);
  const [kbFilter,    setKbFilter]    = useState("all");
  const chatEndRef = useRef(null);

  const isSA      = currentUser?.type==="superadmin";
  const isPartner = currentUser?.type==="partner";
  const isEmp     = currentUser?.type==="employee";

  const workspace  = viewPartner || (isPartner ? partners.find(p=>p.id===currentUser.id) : null);
  const empPartner = isEmp ? partners.find(p=>p.id===currentUser.partnerId) : null;
  // SA gets a special built-in workspace "nce_main"
  const saPartner  = isSA ? (partners.find(p=>p.id==="nce_main") || { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP", employees:[], departments:[], branches:[], tasks:[], kb:[], schedule:[], salaryPayments:[] }) : null;
  const activeWS   = isEmp ? empPartner : (isSA && !viewPartner) ? saPartner : workspace;

  const myAccess = (() => {
    if (isSA) return ALL_SECTIONS.map(s=>s.id);
    if (isPartner) return PLAN_SECTIONS[workspace?.plan]||PLAN_SECTIONS.Basic;
    if (isEmp) {
      const planS = PLAN_SECTIONS[empPartner?.plan]||PLAN_SECTIONS.Basic;
      return (currentUser.sections||[]).filter(s=>planS.includes(s));
    }
    return [];
  })();

  // ── Firebase: load & sync partners in real-time ──
  useEffect(()=>{
    const ref = doc(db, "app", "data");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPartners(data.partners || []);
      }
      setFbLoading(false);
    }, (err) => {
      console.error("Firebase error:", err);
      setFbLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Save to Firebase whenever partners change ──
  const isMounted = useRef(false);
  useEffect(()=>{
    if (!isMounted.current) { isMounted.current = true; return; }
    if (fbLoading) return;
    const ref = doc(db, "app", "data");
    setDoc(ref, { partners }, { merge: true }).catch(console.error);
  }, [partners]);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[chatMsgs,chatChannel]);

  function updatePartner(id, upd) { setPartners(ps=>ps.map(p=>p.id===id?{...p,...upd}:p)); }
  function getPartner(id) { return partners.find(p=>p.id===id); }

  // Forms
  const defP   = { companyName:"", email:"", password:"", plan:"Basic", status:"active", logo:"", accentColor:"#f0a500" };
  const defE   = { name:"", email:"", password:"", role:roles[0], sections:["dashboard","tasks","chat"], chatChannels:["general"], deptId:"", branchId:"", status:"active" };
  const defD   = { name:"", icon:"🏢", color:"#3b82f6", branchId:"" };
  const defBr  = { name:"", city:"" };
  const defT   = { title:"", assigneeId:"", priority:"medium", due:"", status:"todo" };
  const defK   = { type:"sop", title:"", thumb:"📄", url:"", content:"", desc:"" };
  const defSc  = { employeeId:"", date:"", startTime:"09:00", endTime:"17:00", notes:"", status:"confirmed" };
  const defPay = { employeeId:"", amount:"", date:"", note:"", status:"pending" };

  const [pF,  setPF]  = useState(defP);
  const [eF,  setEF]  = useState(defE);
  const [dF,  setDF]  = useState(defD);
  const [brF, setBrF] = useState(defBr);
  const [tF,  setTF]  = useState(defT);
  const [kF,  setKF]  = useState(defK);
  const [scF, setScF] = useState(defSc);
  const [paF, setPaF] = useState(defPay);

  // CRUD
  function createPartner() {
    if (!pF.companyName.trim()||!pF.email.trim()||!pF.password.trim()) return;
    const em=pF.email.trim().toLowerCase();
    if (partners.find(p=>p.email===em)) { alert("Email already in use"); return; }
    const id="p_"+Date.now();
    setPartners(ps=>[...ps,{...pF,id,email:em,employees:[],departments:[],branches:[],tasks:[],kb:[],schedule:[],salaryPayments:[],createdAt:new Date().toISOString().split("T")[0]}]);
    setPF(defP); setModal(null);
  }
  function deletePartner(id) {
    if (!window.confirm(t.confirmDelete)) return;
    setPartners(ps=>ps.filter(p=>p.id!==id));
    if (viewPartner?.id===id) setViewPartner(null);
  }
  function createEmployee() {
    if (!eF.name.trim()||!eF.email.trim()||!eF.password.trim()) return;
    const em  = eF.email.trim().toLowerCase();
    const pid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    const newEmp = {...eF, id:"e_"+Date.now(), email:em, partnerId:pid};
    const existing = partners.find(p => p.id === pid);
    if (existing) {
      if (existing.employees?.find(e=>e.email===em)) { alert("Email already in use"); return; }
      setPartners(ps => ps.map(x => x.id===pid ? {...x, employees:[...(x.employees||[]), newEmp]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[newEmp], departments:[], branches:[], tasks:[], kb:[],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setEF(defE); setModal(null);
  }
  function deleteEmployee(pid,eid) {
    setPartners(ps => ps.map(x => x.id===pid ? {...x, employees:(x.employees||[]).filter(e=>e.id!==eid)} : x));
  }
  // Ensures nce_main workspace exists, returns current or newly created object
  function ensureWS(pid) {
    const existing = partners.find(p => p.id === pid);
    if (existing) return existing;
    if (pid === "nce_main") {
      const ws = { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[], tasks:[], kb:[],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] };
      setPartners(ps => [...ps, ws]);
      return ws;
    }
    return null;
  }

  function createDept() {
    if (!dF.name.trim()) return;
    const pid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    const existing = partners.find(p => p.id === pid);
    const newDept  = {...dF, id:"d_"+Date.now()};
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, departments:[...(x.departments||[]), newDept]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[newDept], branches:[], tasks:[], kb:[],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setDF(defD); setModal(null);
  }

  function createBranch() {
    if (!brF.name.trim()) return;
    const pid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    const existing = partners.find(p => p.id === pid);
    const plan = existing?.plan || "VIP";
    const lim  = PLAN_LIMITS[plan]?.branches || 999;
    if ((existing?.branches||[]).length >= lim) { alert(`${t.branchLimit} ${plan}: ${lim}`); return; }
    const newBranch = {...brF, id:"b_"+Date.now()};
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, branches:[...(x.branches||[]), newBranch]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[newBranch], tasks:[], kb:[],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setBrF(defBr); setModal(null);
  }
  function createTask() {
    if (!tF.title.trim()) return;
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const newItem = {...tF, id:"t_"+Date.now(), createdBy:currentUser.id};
    const existing = partners.find(p => p.id === pid);
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, tasks:[...(x.tasks||[]), newItem]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[], tasks:[newItem], kb:[],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setTF(defT); setModal(null);
  }
  function updateTask(pid,tid,upd) {
    setPartners(ps => ps.map(x => x.id===pid ? {...x, tasks:(x.tasks||[]).map(t=>t.id===tid?{...t,...upd}:t)} : x));
  }
  function createKb() {
    if (!kF.title.trim()) return;
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const newItem = {...kF, id:"k_"+Date.now()};
    const existing = partners.find(p => p.id === pid);
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, kb:[...(x.kb||[]), newItem]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[], tasks:[], kb:[newItem],
        schedule:[], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setKF(defK); setModal(null);
  }
  function createSched() {
    if (!scF.employeeId||!scF.date) return;
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const newItem = {...scF, id:"sc_"+Date.now()};
    const existing = partners.find(p => p.id === pid);
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, schedule:[...(x.schedule||[]), newItem]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[], tasks:[], kb:[],
        schedule:[newItem], salaryPayments:[], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setScF(defSc); setModal(null);
  }
  function createPayment() {
    if (!paF.employeeId||!paF.amount||!paF.date) return;
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const newItem = {...paF, id:"sp_"+Date.now(), amount:Number(paF.amount)};
    const existing = partners.find(p => p.id === pid);
    if (existing) {
      setPartners(ps => ps.map(x => x.id===pid ? {...x, salaryPayments:[...(x.salaryPayments||[]), newItem]} : x));
    } else if (pid === "nce_main") {
      setPartners(ps => [...ps, { id:"nce_main", companyName:"Natural Cleaning Experts", plan:"VIP",
        email:"", password:"", status:"active", logo:"🏢", accentColor:"#f0a500",
        employees:[], departments:[], branches:[], tasks:[], kb:[],
        schedule:[], salaryPayments:[newItem], createdAt:new Date().toISOString().split("T")[0] }]);
    } else return;
    setPaF(defPay); setModal(null);
  }
  function togglePay(pid,id) {
    setPartners(ps => ps.map(x => x.id===pid ? {...x, salaryPayments:(x.salaryPayments||[]).map(s=>s.id===id?{...s,status:s.status==="paid"?"pending":"paid"}:s)} : x));
  }


  /* ── LOGIN GATE ── */
  if (fbLoading) {
    return (
      <>
        <style>{S}</style>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",flexDirection:"column",gap:16}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:-1}}>Nova Launch System<span style={{color:"var(--acc)"}}>.</span></div>
          <div style={{width:36,height:36,border:"3px solid var(--bdr2)",borderTop:"3px solid var(--acc)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{fontSize:12,color:"var(--mu)"}}>Загрузка данных...</div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <style>{S}</style>
        <LoginScreen partners={partners} lang={lang} setLang={setLang}
          onLogin={u=>{setCurrentUser(u);setPage("dashboard");}}/>
      </>
    );
  }

  /* ════════ PAGES ════════ */

  /* ── SA: PARTNERS ── */
  const SAPartners = () => (
    <>
      <div style={{marginBottom:14,display:"flex",gap:8}}>
        <button className="btn btn-p" onClick={()=>{setPF(defP);setModal("partner");}}>{t.addPartner}</button>
      </div>
      {!partners.length && (
        <div style={{textAlign:"center",padding:60,color:"var(--mu)"}}>
          <div style={{fontSize:40,marginBottom:12}}>🤝</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:16,marginBottom:6}}>{t.noPartners}</div>
          <div style={{fontSize:13}}>{t.noPartnersDesc}</div>
        </div>
      )}
      <div className="partner-grid">
        {partners.map(p=>(
          <div key={p.id} className="partner-card">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:42,height:42,borderRadius:10,background:(p.accentColor||"#f0a500")+"20",border:`1px solid ${p.accentColor||"#f0a500"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{p.logo||"🏢"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.companyName}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>{p.email}</div>
              </div>
              <Bdg cls={planBdg(p.plan)}>{p.plan}</Bdg>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
              {[
                {l:t.empCount,   v:(p.employees||[]).length},
                {l:t.deptCount,  v:(p.departments||[]).length},
                {l:t.branches,   v:(p.branches||[]).length},
              ].map((s,i)=>(
                <div key={i} style={{background:"var(--s2)",borderRadius:8,padding:"7px 9px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17}}>{s.v}</div>
                  <div style={{fontSize:10,color:"var(--mu)"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button className="btn btn-bl btn-sm" onClick={()=>{setViewPartner(p);setPage("dashboard");}}>{t.enterCabinet}</button>
              <button className="btn btn-g btn-sm" onClick={()=>{
                const pl=["Basic","Pro","VIP"],next=pl[(pl.indexOf(p.plan)+1)%pl.length];
                if(window.confirm(`${t.confirmPlan} ${next}?`)) updatePartner(p.id,{plan:next});
              }}>{t.changePlan}</button>
              <button className="btn btn-sm" style={{background:p.status==="active"?"#ef444415":"#22c55e15",color:p.status==="active"?"var(--rd)":"var(--gr)",border:`1px solid ${p.status==="active"?"#ef444425":"#22c55e25"}`}}
                onClick={()=>updatePartner(p.id,{status:p.status==="active"?"blocked":"active"})}>
                {p.status==="active"?t.block:t.unblock}
              </button>
              <button className="btn btn-d btn-sm" onClick={()=>deletePartner(p.id)}>× {t.delete}</button>
            </div>
            <div style={{fontSize:10,color:"var(--mu)",marginTop:9}}>{t.createdAt}: {p.createdAt} · ${PLAN_LIMITS[p.plan]?.price}/mo</div>
          </div>
        ))}
      </div>
    </>
  );

  /* ── DASHBOARD ── */
  const Dashboard = () => {
    if (isSA&&!viewPartner) {
      const totalE=partners.reduce((s,p)=>s+(p.employees||[]).length,0);
      const rev=partners.filter(p=>p.status==="active").reduce((s,p)=>s+(PLAN_LIMITS[p.plan]?.price||0),0);
      return (
        <>
          <div className="stats">
            {[
              {l:t.totalPartners,  v:partners.length,                                sub:`${partners.filter(p=>p.status==="active").length} ${t.activePartners}`, c:"var(--acc)"},
              {l:t.totalEmployees, v:totalE,                                         sub:t.inAllCompanies,c:"var(--bl)"},
              {l:t.monthlyRevenue, v:`$${rev.toLocaleString()}`,                     sub:t.byActivePlans, c:"var(--gr)"},
              {l:t.blockedCount,   v:partners.filter(p=>p.status==="blocked").length,sub:t.partners,      c:"var(--rd)"},
            ].map((s,i)=>(
              <div className="stat" key={i}>
                <div className="stat-l">{s.l}</div>
                <div className="stat-v" style={{color:s.c}}>{s.v}</div>
                <div className="stat-s">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-t">{t.allPartners}</div></div>
            <div className="tw">
              <table>
                <thead><tr><th>{t.company}</th><th>{t.plan}</th><th>{t.empCount}</th><th>{t.createdAt}</th><th>{t.status}</th><th>{t.actions}</th></tr></thead>
                <tbody>
                  {partners.map(p=>(
                    <tr key={p.id}>
                      <td><div className="flex-c"><div style={{fontSize:18}}>{p.logo||"🏢"}</div><div><div style={{fontWeight:500}}>{p.companyName}</div><div style={{fontSize:11,color:"var(--mu)"}}>{p.email}</div></div></div></td>
                      <td><Bdg cls={planBdg(p.plan)}>{p.plan} — ${PLAN_LIMITS[p.plan]?.price}/mo</Bdg></td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600}}>{(p.employees||[]).length}</td>
                      <td style={{color:"var(--mu)",fontSize:12}}>{p.createdAt}</td>
                      <td><Bdg cls={p.status==="active"?"b-gr":"b-rd"}>{p.status==="active"?t.active:t.blocked}</Bdg></td>
                      <td><button className="btn btn-bl btn-sm" onClick={()=>{setViewPartner(p);setPage("dashboard");}}>{t.enterCabinet}</button></td>
                    </tr>
                  ))}
                  {!partners.length&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--mu)",padding:24}}>{t.noPartners}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }
    const ws=activeWS; const emps=ws?.employees||[]; const tasks=ws?.tasks||[]; const depts=ws?.departments||[];
    return (
      <>
        <div className="stats">
          {[
            {l:t.empCount,   v:emps.length,                                     sub:`${emps.filter(e=>e.status==="active").length} ${t.activePartners}`, c:"var(--acc)"},
            {l:t.taskCount,  v:tasks.length,                                    sub:`${tasks.filter(t=>t.status==="done").length} ${t.done}`,             c:"var(--bl)"},
            {l:t.inProgress, v:tasks.filter(t=>t.status==="in_progress").length,sub:t.tasks,                                                              c:"var(--gr)"},
            {l:t.deptCount,  v:depts.length,                                    sub:t.created,                                                            c:"var(--pu)"},
          ].map((s,i)=>(
            <div className="stat" key={i}>
              <div className="stat-l">{s.l}</div>
              <div className="stat-v" style={{color:s.c}}>{s.v}</div>
              <div className="stat-s">{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}>
          <div className="card">
            <div className="card-hd"><div className="card-t">{t.recentTasks}</div></div>
            {tasks.slice(0,5).map(task=>{
              const emp=emps.find(e=>e.id===task.assigneeId);
              return (
                <div key={task.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                  {emp&&<Av name={emp.name}/>}
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.title}</div><div style={{fontSize:11,color:"var(--mu)"}}>{emp?.name||"—"}</div></div>
                  <Bdg cls={task.status==="done"?"b-gr":task.status==="in_progress"?"b-yw":"b-mu"}>{task.status==="done"?t.done:task.status==="in_progress"?t.inProgress:t.todo.replace("📋 ","")}</Bdg>
                </div>
              );
            })}
            {!tasks.length&&<div style={{textAlign:"center",color:"var(--mu)",padding:18,fontSize:13}}>{t.noTasks}</div>}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-t">{t.employees}</div></div>
            {emps.slice(0,6).map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:"1px solid var(--bdr)"}}>
                <Av name={e.name}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{e.role}</div></div>
                <Bdg cls={e.status==="active"?"b-gr":"b-rd"}>{e.status==="active"?t.active:t.inactive}</Bdg>
              </div>
            ))}
            {!emps.length&&<div style={{textAlign:"center",color:"var(--mu)",padding:18,fontSize:13}}>{t.noEmployees}</div>}
          </div>
        </div>
      </>
    );
  };

  /* ── EMPLOYEES + DEPARTMENTS ── */
  const Employees = () => {
    const pid   = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p     = getPartner(pid)||{employees:[],departments:[],branches:[]};
    const emps  = p?.employees||[];
    const depts = p?.departments||[];
    const brs   = p?.branches||[];
    const canEdit = isSA||isPartner;
    const lim   = PLAN_LIMITS[p?.plan]?.employees||10;
    const [selDept, setSelDept] = useState(null); // clicked dept id

    if (selDept) {
      const dept    = depts.find(d=>d.id===selDept);
      const branch  = brs.find(b=>b.id===dept?.branchId);
      const members = emps.filter(e=>e.deptId===selDept);
      return (
        <>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer",color:"var(--mu)",fontSize:13}} onClick={()=>setSelDept(null)}>
            ← {lang==="ru"?"Все отделы":"All departments"}
          </div>
          <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:18,marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:36}}>{dept?.icon}</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:dept?.color}}>{dept?.name}</div>
                {branch&&<div style={{fontSize:12,color:"var(--mu)",marginTop:2}}>📍 {branch.name}{branch.city?`, ${branch.city}`:""}</div>}
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"var(--acc)"}}>{members.length}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>{lang==="ru"?"сотрудников":"employees"}</div>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {members.map(e=>(
              <div key={e.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:11,padding:14,display:"flex",alignItems:"center",gap:12}}>
                <Av name={e.name} color={dept?.color} size="av-lg"/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14}}>{e.name}</div>
                  <div style={{fontSize:12,color:"var(--mu)"}}>{e.role}</div>
                  <div style={{fontSize:11,color:"var(--mu)",marginTop:2}}>{e.email}</div>
                </div>
                <Bdg cls={e.status==="active"?"b-gr":"b-rd"}>{e.status==="active"?t.active:t.inactive}</Bdg>
              </div>
            ))}
            {!members.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:32,color:"var(--mu)"}}>
              <div style={{fontSize:28,marginBottom:8}}>👤</div>
              <div>{lang==="ru"?"В отделе нет сотрудников":"No employees in this department"}</div>
            </div>}
          </div>
        </>
      );
    }

    return (
      <>
        {canEdit&&(
          <div style={{display:"flex",gap:8,marginBottom:15,flexWrap:"wrap",alignItems:"center"}}>
            <button className="btn btn-p" onClick={()=>{setEF({...defE,role:roles[0]});setModal("emp");}}>{t.addEmployee}</button>
            <button className="btn btn-g" onClick={()=>{setDF({...defD,branchId:""});setModal("dept");}}>{t.addDept}</button>
            <span style={{marginLeft:"auto",fontSize:12,color:"var(--mu)"}}>{t.empCount} {emps.length}/{lim}</span>
          </div>
        )}
        {depts.length>0&&(
          <>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>
              {lang==="ru"?"Отделы (нажмите чтобы открыть)":"Departments (click to open)"}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
              {depts.map(d=>{
                const branch = brs.find(b=>b.id===d.branchId);
                const count  = emps.filter(e=>e.deptId===d.id).length;
                return (
                  <div key={d.id} onClick={()=>setSelDept(d.id)}
                    style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:10,padding:"14px",cursor:"pointer",transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--bdr2)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bdr)"}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:24}}>{d.icon}</div>
                      <Bdg cls="b-mu">{count} {lang==="ru"?"чел.":"ppl"}</Bdg>
                    </div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:3,color:d.color}}>{d.name}</div>
                    {branch
                      ? <div style={{fontSize:11,color:"var(--mu)"}}>📍 {branch.name}</div>
                      : <div style={{fontSize:11,color:"var(--mu2)"}}>{lang==="ru"?"Город не указан":"No city assigned"}</div>
                    }
                    <div style={{height:2,borderRadius:1,background:d.color,marginTop:10,opacity:.6}}/>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="card">
          <div className="card-hd"><div className="card-t">{t.employees}</div><Bdg cls="b-mu">{emps.length}</Bdg></div>
          <div className="tw">
            <table>
              <thead><tr><th>{t.name}</th><th>{t.role}</th><th>{lang==="ru"?"Отдел / Город":"Dept / City"}</th><th>{t.accessSections}</th><th>{t.status}</th>{canEdit&&<th></th>}</tr></thead>
              <tbody>
                {emps.map(e=>{
                  const d = depts.find(x=>x.id===e.deptId);
                  const b = brs.find(x=>x.id===e.branchId);
                  return (
                    <tr key={e.id}>
                      <td><div className="flex-c"><Av name={e.name} color={d?.color}/><div><div style={{fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{e.role}</div></div></div></td>
                      <td style={{color:"var(--mu)",fontSize:11}}>{e.email}</td>
                      <td>
                        {d&&<div style={{fontSize:12}}><span style={{color:d.color}}>{d.icon} {d.name}</span></div>}
                        {b&&<div style={{fontSize:11,color:"var(--mu)"}}>📍 {b.name}</div>}
                        {!d&&!b&&<span style={{color:"var(--mu2)",fontSize:11}}>—</span>}
                      </td>
                      <td><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(e.sections||[]).slice(0,3).map(s=><Bdg key={s} cls="b-mu">{ALL_SECTIONS.find(x=>x.id===s)?.icon}</Bdg>)}{(e.sections||[]).length>3&&<Bdg cls="b-mu">+{(e.sections||[]).length-3}</Bdg>}</div></td>
                      <td><Bdg cls={e.status==="active"?"b-gr":"b-rd"}>{e.status==="active"?t.active:t.inactive}</Bdg></td>
                      {canEdit&&<td><button className="btn btn-d btn-sm" onClick={()=>deleteEmployee(pid,e.id)}>×</button></td>}
                    </tr>
                  );
                })}
                {!emps.length&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--mu)",padding:24}}>{t.noEmployees}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  /* ── BRANCHES ── */
  const Branches = () => {
    const pid   = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p     = getPartner(pid)||{branches:[],employees:[],departments:[]};
    const brs   = p?.branches||[];
    const emps  = p?.employees||[];
    const depts = p?.departments||[];
    const canEdit = isSA||isPartner;
    const lim   = PLAN_LIMITS[p?.plan]?.branches||1;
    const [selBr, setSelBr] = useState(null);

    if (selBr) {
      const branch     = brs.find(b=>b.id===selBr);
      const brDepts    = depts.filter(d=>d.branchId===selBr);
      const brEmps     = emps.filter(e=>e.branchId===selBr);
      return (
        <>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer",color:"var(--mu)",fontSize:13}} onClick={()=>setSelBr(null)}>
            ← {lang==="ru"?"Все города":"All cities"}
          </div>
          <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:18,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:36}}>🏙️</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700}}>{branch?.name}</div>
                {branch?.city&&<div style={{fontSize:13,color:"var(--mu)",marginTop:2}}>📍 {branch.city}</div>}
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:18,textAlign:"center"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"var(--acc)"}}>{brEmps.length}</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{lang==="ru"?"сотрудников":"employees"}</div>
                </div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"var(--bl)"}}>{brDepts.length}</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{lang==="ru"?"отделов":"departments"}</div>
                </div>
              </div>
            </div>
          </div>

          {brDepts.length>0&&(
            <>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>
                {lang==="ru"?"Отделы в этом городе":"Departments in this city"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
                {brDepts.map(d=>{
                  const cnt=emps.filter(e=>e.deptId===d.id).length;
                  return (
                    <div key={d.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:10,padding:14}}>
                      <div style={{fontSize:22,marginBottom:6}}>{d.icon}</div>
                      <div style={{fontWeight:600,fontSize:13,color:d.color,marginBottom:3}}>{d.name}</div>
                      <div style={{fontSize:11,color:"var(--mu)"}}>{cnt} {lang==="ru"?"сотрудников":"employees"}</div>
                      <div style={{height:2,borderRadius:1,background:d.color,marginTop:9,opacity:.6}}/>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {brEmps.length>0&&(
            <>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>
                {lang==="ru"?"Сотрудники":"Employees"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
                {brEmps.map(e=>{
                  const d=depts.find(x=>x.id===e.deptId);
                  return (
                    <div key={e.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:11,padding:13,display:"flex",alignItems:"center",gap:11}}>
                      <Av name={e.name} color={d?.color} size="av-lg"/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600}}>{e.name}</div>
                        <div style={{fontSize:12,color:"var(--mu)"}}>{e.role}</div>
                        {d&&<div style={{fontSize:11,color:d.color,marginTop:2}}>{d.icon} {d.name}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!brDepts.length&&!brEmps.length&&(
            <div style={{textAlign:"center",padding:40,color:"var(--mu)"}}>
              <div style={{fontSize:32,marginBottom:8}}>🏙️</div>
              <div>{lang==="ru"?"В этом городе ещё нет отделов и сотрудников":"No departments or employees in this city yet"}</div>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        {canEdit&&<div style={{marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
          <button className="btn btn-p" onClick={()=>{setBrF(defBr);setModal("branch");}}>{t.addBranch}</button>
          <span style={{fontSize:12,color:"var(--mu)"}}>{t.branches}: {brs.length}/{lim}</span>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {brs.map(b=>{
            const cnt  = emps.filter(e=>e.branchId===b.id).length;
            const dcnt = depts.filter(d=>d.branchId===b.id).length;
            return (
              <div key={b.id} onClick={()=>setSelBr(b.id)}
                style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16,cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--bdr2)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bdr)"}>
                <div style={{fontSize:28,marginBottom:8}}>🏙️</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:12,color:"var(--mu)",marginBottom:12}}>{b.city}</div>
                <div style={{display:"flex",gap:16}}>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"var(--acc)"}}>{cnt}</div>
                    <div style={{fontSize:10,color:"var(--mu)"}}>{lang==="ru"?"сотрудников":"employees"}</div>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"var(--bl)"}}>{dcnt}</div>
                    <div style={{fontSize:10,color:"var(--mu)"}}>{lang==="ru"?"отделов":"departments"}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {!brs.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"var(--mu)"}}><div style={{fontSize:36,marginBottom:8}}>📍</div><div>{t.noBranches}</div></div>}
        </div>
      </>
    );
  };

  /* ── TASKS ── */
  const Tasks = () => {
    const pid=viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p=getPartner(pid)||{tasks:[],employees:[]}; const tasks=p?.tasks||[]; const emps=p?.employees||[];
    const canEdit=isSA||isPartner||isEmp;
    const cols=[["todo",t.todo,"var(--mu)"],["in_progress",t.inProgressCol,"var(--acc)"],["done",t.doneCol,"var(--gr)"]];
    return (
      <>
        {canEdit&&<div style={{marginBottom:13}}><button className="btn btn-p" onClick={()=>{setTF({...defT,assigneeId:isEmp?currentUser.id:""});setModal("task");}}>{t.addTask}</button></div>}
        <div className="task-cols">
          {cols.map(([col,label,color])=>{
            const colT=tasks.filter(x=>x.status===col);
            return (
              <div key={col} className="task-col">
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,color,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  {label}<span style={{marginLeft:"auto",background:"var(--s3)",color:"var(--mu)",fontSize:10,padding:"2px 7px",borderRadius:10}}>{colT.length}</span>
                </div>
                {colT.map(task=>{
                  const emp=emps.find(e=>e.id===task.assigneeId);
                  return (
                    <div key={task.id} className="task-item">
                      <div style={{fontSize:13,fontWeight:500,marginBottom:7,lineHeight:1.4}}>{task.title}</div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                        {emp&&<div className="flex-c" style={{gap:5}}><Av name={emp.name}/><span style={{fontSize:11,color:"var(--mu)"}}>{emp.name.split(" ")[0]}</span></div>}
                        <Bdg cls={task.priority==="high"?"b-rd":task.priority==="medium"?"b-yw":"b-gr"}>{t[task.priority]||task.priority}</Bdg>
                        {task.due&&<span style={{fontSize:10,color:"var(--mu)"}}>📅 {task.due}</span>}
                      </div>
                      {canEdit&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {col!=="todo"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"todo"})}>{t.back}</button>}
                        {col==="todo"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"in_progress"})}>{t.forward}</button>}
                        {col==="in_progress"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"done"})}>{t.markDone}</button>}
                      </div>}
                    </div>
                  );
                })}
                {!colT.length&&<div style={{textAlign:"center",color:"var(--mu)",fontSize:12,padding:"18px 0"}}>{t.noTasks}</div>}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── SCHEDULE ── */
  const Schedule = () => {
    const pid=viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p=getPartner(pid)||{schedule:[],employees:[]}; const sch=p?.schedule||[]; const emps=p?.employees||[];
    const canEdit=isSA||isPartner;
    const byDate={}; sch.forEach(s=>{if(!byDate[s.date])byDate[s.date]=[];byDate[s.date].push(s);});
    const dates=Object.keys(byDate).sort();
    return (
      <>
        {canEdit&&<div style={{marginBottom:13}}><button className="btn btn-p" onClick={()=>{setScF(defSc);setModal("schedule");}}>{t.addShift}</button></div>}
        {dates.map(date=>(
          <div key={date} style={{marginBottom:16}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--acc)",marginBottom:10}}>
              📅 {new Date(date+"T12:00:00").toLocaleDateString(lang==="ru"?"ru":"en",{weekday:"long",day:"numeric",month:"long"})}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>
              {byDate[date].map(s=>{
                const emp=emps.find(e=>e.id===s.employeeId);
                return (
                  <div key={s.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:10,padding:13}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      {emp&&<Av name={emp.name} color={p?.departments?.find(d=>d.id===emp?.deptId)?.color}/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:13}}>{emp?.name||"—"}</div>
                        <div style={{fontSize:11,color:"var(--mu)"}}>{emp?.role}</div>
                      </div>
                      <Bdg cls={s.status==="confirmed"?"b-gr":"b-yw"}>{s.status==="confirmed"?t.confirmed:t.pending}</Bdg>
                    </div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:5}}>🕐 {s.startTime} – {s.endTime}</div>
                    {(()=>{
                      const dept   = p?.departments?.find(d=>d.id===emp?.deptId);
                      const branch = p?.branches?.find(b=>b.id===emp?.branchId);
                      return (
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {dept   && <span style={{fontSize:11,color:dept.color,background:dept.color+"18",borderRadius:5,padding:"2px 7px"}}>{dept.icon} {dept.name}</span>}
                          {branch && <span style={{fontSize:11,color:"var(--mu)",background:"var(--s2)",borderRadius:5,padding:"2px 7px"}}>📍 {branch.name}</span>}
                        </div>
                      );
                    })()}
                    {s.notes&&<div style={{fontSize:11,color:"var(--mu)",marginTop:6,fontStyle:"italic"}}>💬 {s.notes}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {!dates.length&&<div style={{textAlign:"center",padding:48,color:"var(--mu)"}}><div style={{fontSize:36,marginBottom:8}}>📅</div><div>{t.noSchedule}</div></div>}
      </>
    );
  };

  /* ── SALARY ── */
  const Salary = () => {
    const pid=viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p=getPartner(pid)||{salaryPayments:[],employees:[]}; const pays=p?.salaryPayments||[]; const emps=p?.employees||[];
    const canEdit=isSA||isPartner;
    const paid=pays.filter(x=>x.status==="paid").reduce((s,x)=>s+x.amount,0);
    const pend=pays.filter(x=>x.status==="pending").reduce((s,x)=>s+x.amount,0);
    return (
      <>
        <div className="stats" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
          {[
            {l:t.totalPaid,   v:`$${paid.toLocaleString()}`,sub:t.allTime,    c:"var(--gr)"},
            {l:t.totalPending,v:`$${pend.toLocaleString()}`,sub:t.toPay,      c:"var(--acc)"},
            {l:t.totalRecords,v:pays.length,                sub:t.inHistory,  c:"var(--bl)"},
          ].map((s,i)=>(
            <div className="stat" key={i}>
              <div className="stat-l">{s.l}</div>
              <div className="stat-v" style={{color:s.c}}>{s.v}</div>
              <div className="stat-s">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd">
            <div className="card-t">💵 {t.salary}</div>
            {canEdit&&<button className="btn btn-p btn-sm" onClick={()=>{setPaF(defPay);setModal("pay");}}>{t.addPayment}</button>}
          </div>
          <div className="tw">
            <table>
              <thead><tr><th>{t.name}</th><th>{t.amount}</th><th>{t.payDate}</th><th>{t.note}</th><th>{t.status}</th>{canEdit&&<th></th>}</tr></thead>
              <tbody>
                {pays.map(x=>{
                  const emp=emps.find(e=>e.id===x.employeeId);
                  return (
                    <tr key={x.id}>
                      <td><div className="flex-c"><Av name={emp?.name||"?"}/><span style={{fontWeight:500}}>{emp?.name||"—"}</span></div></td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--gr)"}}>${Number(x.amount).toLocaleString()}</td>
                      <td style={{color:"var(--mu)",fontSize:12}}>{x.date}</td>
                      <td style={{color:"var(--mu)",fontSize:12}}>{x.note}</td>
                      <td><Bdg cls={x.status==="paid"?"b-gr":"b-yw"}>{x.status==="paid"?t.paid:t.notPaid}</Bdg></td>
                      {canEdit&&<td><button className="btn btn-g btn-sm" onClick={()=>togglePay(pid,x.id)}>{x.status==="paid"?t.unmarkPaid:t.markPaid}</button></td>}
                    </tr>
                  );
                })}
                {!pays.length&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--mu)",padding:24}}>{t.noPayments}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  /* ── PERFORMANCE ── */
  const Performance = () => {
    const pid=viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p=getPartner(pid)||{employees:[],tasks:[]}; const emps=p?.employees||[]; const tasks=p?.tasks||[];
    return (
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:13}}>
        {emps.map(emp=>{
          const myT=tasks.filter(t=>t.assigneeId===emp.id);
          const done=myT.filter(t=>t.status==="done").length;
          const pct=myT.length?Math.round(done/myT.length*100):0;
          return (
            <div key={emp.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16}}>
              <div className="flex-c" style={{marginBottom:11}}>
                <Av name={emp.name} size="av-lg"/>
                <div><div style={{fontWeight:600,fontSize:14}}>{emp.name}</div><div style={{fontSize:11,color:"var(--mu)"}}>{emp.role}</div></div>
                <div style={{marginLeft:"auto",textAlign:"right"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:pct>=80?"var(--gr)":pct>=50?"var(--acc)":"var(--mu)"}}>{myT.length?`${pct}%`:"—"}</div>
                  <div style={{fontSize:10,color:"var(--mu)"}}>{t.efficiency}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:10,fontSize:12}}>
                <span style={{color:"var(--mu)"}}>{t.taskCount}: <b style={{color:"var(--tx)"}}>{myT.length}</b></span>
                <span style={{color:"var(--mu)"}}>{t.done}: <b style={{color:"var(--gr)"}}>{done}</b></span>
                <span style={{color:"var(--mu)"}}>{t.inProgress}: <b style={{color:"var(--acc)"}}>{myT.filter(x=>x.status==="in_progress").length}</b></span>
              </div>
            </div>
          );
        })}
        {!emps.length&&<div style={{textAlign:"center",padding:48,color:"var(--mu)"}}><div style={{fontSize:36,marginBottom:8}}>📊</div><div>{t.noPerf}</div></div>}
      </div>
    );
  };

  /* ── CHAT ── */
  const Chat = () => {
    const pid = viewPartner?.id||(isSA?"nce_main":activeWS?.id||"sa");
    const wsData = viewPartner
      ? getPartner(viewPartner.id)
      : isSA
        ? (getPartner("nce_main")||{departments:[]})
        : activeWS;
    const depts = wsData?.departments||[];
    const allChannels = [
      {id:"general", label:t.general, icon:"📢"},
      ...depts.map(d=>({id:d.id, label:d.name, icon:d.icon}))
    ];
    // Employees only see channels they have access to
    const channels = isEmp
      ? allChannels.filter(ch => (currentUser.chatChannels||["general"]).includes(ch.id))
      : allChannels;
    const key  = pid+"_"+chatChannel;
    const msgs = chatMsgs[key]||[];

    const fileRef    = useRef(null);
    const [rec,setRec]       = useState(false);
    const [mrec,setMrec]     = useState(null);
    const chunks             = useRef([]);

    function pushMsg(extra) {
      const ts = new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});
      const m  = { id:"m_"+Date.now(), authorId:currentUser.id,
                   authorName:currentUser.name||currentUser.companyName,
                   type:"text", text:"", ts, ...extra };
      setChatMsgs(prev=>({...prev,[key]:[...(prev[key]||[]),m]}));
    }

    function handleFile(e) {
      const file=e.target.files?.[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=ev=>{
        const isImg=file.type.startsWith("image/");
        pushMsg({type:isImg?"image":"file", content:ev.target.result, fileName:file.name});
      };
      reader.readAsDataURL(file);
      e.target.value="";
    }

    async function startRec() {
      try {
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        const mr=new MediaRecorder(stream);
        chunks.current=[];
        mr.ondataavailable=e=>chunks.current.push(e.data);
        mr.onstop=()=>{
          const blob=new Blob(chunks.current,{type:"audio/webm"});
          pushMsg({type:"audio", content:URL.createObjectURL(blob)});
          stream.getTracks().forEach(t=>t.stop());
        };
        mr.start(); setMrec(mr); setRec(true);
      } catch { alert(lang==="ru"?"Нет доступа к микрофону":"No microphone access"); }
    }

    function stopRec(){mrec?.stop();setRec(false);setMrec(null);}

    const curCh = channels.find(c=>c.id===chatChannel)||channels[0];
    const [showChSb, setShowChSb] = useState(false);
    const [chatInput, setChatInput] = useState("");

    function sendChat() {
      if (!chatInput.trim()) return;
      pushMsg({ type:"text", text:chatInput.trim() });
      setChatInput("");
    }

    return (
      <div className="chat-wrap">

        {/* LEFT: channel list */}
        <div className={`chat-sb ${showChSb?"mob-open":""}`}>
          {/* Close button on mobile */}
          {showChSb&&(
            <button className="btn btn-g btn-sm" style={{position:"absolute",top:14,right:14,zIndex:210}}
              onClick={()=>setShowChSb(false)}>✕</button>
          )}
          <div style={{fontSize:10,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:.8,padding:"8px 8px 4px",fontWeight:600}}>
            {t.channels}
          </div>
          {channels.map(ch=>(
            <div key={ch.id}
              className={`chat-ch ${chatChannel===ch.id?"act":""}`}
              onClick={()=>setChatChannel(ch.id)}>
              <span style={{flexShrink:0}}>{ch.icon}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12}}>{ch.label}</span>
            </div>
          ))}
          {(isSA||isPartner)&&(
            <button
              className="btn btn-g btn-sm"
              style={{width:"100%",marginTop:8,justifyContent:"center",fontSize:11}}
              onClick={()=>{setDF({name:"",icon:"💬",color:"#3b82f6"});setModal("dept");}}>
              + {lang==="ru"?"Новый канал":"New channel"}
            </button>
          )}
          {depts.length===0&&(
            <div style={{fontSize:11,color:"var(--mu2)",padding:"6px 8px 0",lineHeight:1.5}}>
              {lang==="ru"
                ? "Создайте канал для отдела"
                : "Create a channel for a department"}
            </div>
          )}
        </div>

        {/* RIGHT: messages */}
        <div className="chat-main">
          <div className="chat-hd" style={{position:"relative"}}>
            {/* Mobile: open channels button */}
            <button className="btn btn-g btn-sm mob-ch-btn"
              style={{marginRight:8,padding:"5px 8px",fontSize:13}}
              onClick={()=>setShowChSb(true)}>☰</button>
            {curCh?.icon} {curCh?.label}
          </div>

          <div className="chat-msgs">
            {msgs.map(m=>{
              const isMe=m.authorId===currentUser.id;
              const color=isMe?"var(--acc)":avColor(m.authorName);
              return (
                <div key={m.id} style={{display:"flex",gap:9,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
                  <Av name={m.authorName} color={color}/>
                  <div className="chat-bbl" style={{background:isMe?"#f0a50012":"var(--s2)",maxWidth:"68%"}}>
                    <div style={{fontSize:11,fontWeight:600,color,marginBottom:4}}>{m.authorName}</div>
                    {m.type==="image"&&(
                      <img src={m.content} alt="" style={{maxWidth:200,maxHeight:180,borderRadius:8,display:"block",cursor:"pointer",marginBottom:4}} onClick={()=>window.open(m.content)}/>
                    )}
                    {m.type==="audio"&&(
                      <audio controls src={m.content} style={{maxWidth:210,height:34,display:"block",marginBottom:4}}/>
                    )}
                    {m.type==="file"&&(
                      <a href={m.content} download={m.fileName}
                        style={{display:"flex",alignItems:"center",gap:6,background:"var(--s3)",borderRadius:7,padding:"6px 10px",fontSize:12,color:"var(--bl)",textDecoration:"none",marginBottom:4}}>
                        📎 {m.fileName}
                      </a>
                    )}
                    {m.text&&<div style={{fontSize:13,color:"#c8d3e0",lineHeight:1.5}}>{m.text}</div>}
                    <div style={{fontSize:10,color:"var(--mu)",marginTop:3,textAlign:"right"}}>{m.ts}</div>
                  </div>
                </div>
              );
            })}
            {!msgs.length&&(
              <div style={{textAlign:"center",color:"var(--mu)",padding:40,fontSize:13}}>
                <div style={{fontSize:30,marginBottom:8,opacity:.4}}>{IC.chat}</div>
                {lang==="ru"?"Начните общение...":"Start the conversation..."}
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>

          {/* Input area */}
          <div style={{flexShrink:0}}>
            {rec&&(
              <div style={{textAlign:"center",padding:"5px",fontSize:12,color:"var(--rd)",background:"#ef444410",borderTop:"1px solid #ef444420"}}>
                🔴 {lang==="ru"?"Запись... Отпустите кнопку для отправки":"Recording... Release to send"}
              </div>
            )}
            <div className="chat-ia" style={{alignItems:"center",gap:6}}>
              {/* Attach file */}
              <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={handleFile}/>
              <button title={lang==="ru"?"Прикрепить файл / фото":"Attach file / photo"}
                className="btn btn-g btn-sm"
                style={{padding:"7px 9px",flexShrink:0,fontSize:16,lineHeight:1}}
                onClick={()=>fileRef.current?.click()}>
                {IC.attach}
              </button>
              {/* Voice — hold to record */}
              <button title={lang==="ru"?"Удерживайте для записи голосового":"Hold to record voice message"}
                className="btn btn-g btn-sm"
                style={{padding:"7px 9px",flexShrink:0,fontSize:16,lineHeight:1,
                  background:rec?"#ef444420":"",color:rec?"var(--rd)":""}}
                onMouseDown={startRec} onMouseUp={stopRec}
                onTouchStart={e=>{e.preventDefault();startRec();}}
                onTouchEnd={e=>{e.preventDefault();stopRec();}}>
                rec ? <span style={{width:16,height:16,background:"var(--rd)",borderRadius:2,display:"inline-block"}}/> : IC.mic
              </button>
              {/* Text input */}
              <input className="chat-inp"
                placeholder={t.typeMessage}
                value={chatInput}
                onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                style={{flex:1}}/>
              <button className="btn btn-p" style={{flexShrink:0,padding:"8px 13px"}} onClick={sendChat}>{IC.send}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  /* ══════════════════════════════════════
     P&L — ФИНАНСЫ
  ══════════════════════════════════════ */
  const PnL = () => {
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p   = getPartner(pid)||{pnl:[]};
    const entries = p?.pnl||[];
    const canEdit = isSA||isPartner;

    const [pnlF, setPnlF] = useState({type:"income",amount:"",category:"",date:new Date().toISOString().split("T")[0],note:""});
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0,7));

    const CAT_INC = lang==="ru"
      ? ["Выручка от услуг","Абонентская оплата","Другой доход"]
      : ["Service Revenue","Subscription","Other Income"];
    const CAT_EXP = lang==="ru"
      ? ["Зарплата","Аренда","Маркетинг","Расходные материалы","Налоги","Страховка","Оборудование","Другой расход"]
      : ["Payroll","Rent","Marketing","Supplies","Taxes","Insurance","Equipment","Other Expense"];

    function addEntry() {
      if (!pnlF.amount||!pnlF.category||!pnlF.date) return;
      const newItem = {...pnlF, id:"pnl_"+Date.now(), amount:parseFloat(pnlF.amount)};
      const existing = partners.find(x=>x.id===pid);
      if (existing) {
        setPartners(ps=>ps.map(x=>x.id===pid?{...x,pnl:[...(x.pnl||[]),newItem]}:x));
      } else if (pid==="nce_main") {
        setPartners(ps=>[...ps,{id:"nce_main",companyName:"Natural Cleaning Experts",plan:"VIP",
          email:"",password:"",status:"active",logo:"🏢",accentColor:"#f0a500",
          employees:[],departments:[],branches:[],tasks:[],kb:[],schedule:[],salaryPayments:[],
          pnl:[newItem],createdAt:new Date().toISOString().split("T")[0]}]);
      }
      setPnlF(f=>({...f,amount:"",note:"",category:""}));
      setModal(null);
    }

    function delEntry(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,pnl:(x.pnl||[]).filter(e=>e.id!==id)}:x));
    }

    // Filter by month
    const filtered = entries.filter(e=>e.date?.startsWith(filterMonth));
    const totalInc = filtered.filter(e=>e.type==="income").reduce((s,e)=>s+e.amount,0);
    const totalExp = filtered.filter(e=>e.type==="expense").reduce((s,e)=>s+e.amount,0);
    const net      = totalInc - totalExp;
    const margin   = totalInc>0 ? ((net/totalInc)*100).toFixed(1) : 0;

    // Build chart data — last 6 months
    const months6 = Array.from({length:6},(_,i)=>{
      const d = new Date(); d.setMonth(d.getMonth()-5+i);
      return d.toISOString().slice(0,7);
    });
    const chartData = months6.map(m=>{
      const inc = entries.filter(e=>e.date?.startsWith(m)&&e.type==="income").reduce((s,e)=>s+e.amount,0);
      const exp = entries.filter(e=>e.date?.startsWith(m)&&e.type==="expense").reduce((s,e)=>s+e.amount,0);
      return {name:m.slice(5),income:inc,expense:exp,net:inc-exp};
    });

    const fmt = v => "$"+v.toLocaleString("en",{minimumFractionDigits:0,maximumFractionDigits:0});

    return (
      <>
        {/* Top controls */}
        <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          {canEdit&&(
            <button className="btn btn-p" onClick={()=>setModal("pnl")}>
              {IC.plus} {t.addPnl}
            </button>
          )}
          <input type="month" className="inp" value={filterMonth}
            onChange={e=>setFilterMonth(e.target.value)}
            style={{width:"auto",padding:"6px 10px"}}/>
        </div>

        {/* Summary cards */}
        <div className="stats" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:18}}>
          {[
            {label:t.pnlIncome,  value:fmt(totalInc), color:"var(--gr)",  sub:lang==="ru"?"за месяц":"this month"},
            {label:t.pnlExpense, value:fmt(totalExp), color:"var(--rd)",  sub:lang==="ru"?"за месяц":"this month"},
            {label:t.pnlNet,     value:fmt(net),       color:net>=0?"var(--gr)":"var(--rd)", sub:lang==="ru"?"чистая":"net"},
            {label:t.pnlMargin,  value:margin+"%",     color:"var(--acc)", sub:lang==="ru"?"маржа":"margin"},
          ].map(c=>(
            <div key={c.label} className="stat">
              <div className="stat-l">{c.label}</div>
              <div className="stat-v" style={{color:c.color,fontSize:20}}>{c.value}</div>
              <div className="stat-s">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card" style={{marginBottom:18}}>
          <div className="card-hd"><div className="card-t">{lang==="ru"?"Динамика за 6 месяцев":"6-Month Trend"}</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08"/>
              <XAxis dataKey="name" tick={{fill:"#576070",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#576070",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`$${v/1000}k`:`$${v}`}/>
              <Tooltip contentStyle={{background:"#0d1119",border:"1px solid #ffffff14",borderRadius:9,fontSize:12}}
                formatter={(v,n)=>[fmt(v), n==="income"?(lang==="ru"?"Доходы":"Revenue"):n==="expense"?(lang==="ru"?"Расходы":"Expenses"):(lang==="ru"?"Прибыль":"Profit")]}/>
              <Bar dataKey="income"  fill="#22c55e" radius={[4,4,0,0]} maxBarSize={32}/>
              <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} maxBarSize={32}/>
              <Bar dataKey="net"     fill="#f0a500" radius={[4,4,0,0]} maxBarSize={32}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8}}>
            {[["#22c55e",lang==="ru"?"Доходы":"Revenue"],["#ef4444",lang==="ru"?"Расходы":"Expenses"],["#f0a500",lang==="ru"?"Прибыль":"Profit"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--mu)"}}>
                <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Entries table */}
        <div className="card">
          <div className="card-hd">
            <div className="card-t">{lang==="ru"?"Все записи":"All Entries"}</div>
            <Bdg cls="b-mu">{filtered.length}</Bdg>
          </div>
          {filtered.length>0?(
            <div className="tw">
              <table>
                <thead><tr>
                  <th>{t.pnlDate}</th><th>{t.pnlType}</th><th>{t.pnlCategory}</th>
                  <th>{t.pnlAmount}</th><th>{t.pnlNote}</th>
                  {canEdit&&<th></th>}
                </tr></thead>
                <tbody>
                  {filtered.sort((a,b)=>b.date.localeCompare(a.date)).map(e=>(
                    <tr key={e.id}>
                      <td style={{fontSize:12,color:"var(--mu)"}}>{e.date}</td>
                      <td><Bdg cls={e.type==="income"?"b-gr":"b-rd"}>{e.type==="income"?t.pnlInc:t.pnlExp}</Bdg></td>
                      <td style={{fontSize:12}}>{e.category}</td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:e.type==="income"?"var(--gr)":"var(--rd)"}}>{fmt(e.amount)}</td>
                      <td style={{fontSize:11,color:"var(--mu)"}}>{e.note||"—"}</td>
                      {canEdit&&<td><button className="btn btn-d btn-sm" onClick={()=>delEntry(e.id)}>{IC.trash}</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ):(
            <div style={{textAlign:"center",padding:40,color:"var(--mu)"}}>
              <div style={{marginBottom:8,opacity:.4}}>{IC.pnl}</div>
              <div>{t.pnlNoData}</div>
            </div>
          )}
        </div>

        {/* PnL Modal */}
        {modal==="pnl"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.addPnl}</div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.pnlType}</label>
                  <select className="inp" value={pnlF.type} onChange={e=>setPnlF(f=>({...f,type:e.target.value,category:""}))}>
                    <option value="income">{t.pnlInc}</option>
                    <option value="expense">{t.pnlExp}</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.pnlDate}</label>
                  <input type="date" className="inp" value={pnlF.date} onChange={e=>setPnlF(f=>({...f,date:e.target.value}))}/>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.pnlCategory}</label>
                  <select className="inp" value={pnlF.category} onChange={e=>setPnlF(f=>({...f,category:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Выберите —":"— Select —"}</option>
                    {(pnlF.type==="income"?CAT_INC:CAT_EXP).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.pnlAmount} (USD)</label>
                  <input type="number" className="inp" placeholder="0.00" value={pnlF.amount} onChange={e=>setPnlF(f=>({...f,amount:e.target.value}))}/>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">{t.pnlNote}</label>
                <input className="inp" value={pnlF.note} onChange={e=>setPnlF(f=>({...f,note:e.target.value}))} placeholder={lang==="ru"?"Комментарий...":"Note..."}/>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={addEntry}>{t.create}</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  /* ── KNOWLEDGE BASE ── */
  const KnowledgeBase = () => {
    const pid=viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p=getPartner(pid)||{kb:[]}; const items=p?.kb||[];
    const canEdit=isSA||isPartner;
    const filtered=kbFilter==="all"?items:items.filter(a=>a.type===kbFilter);
    if (kbView) {
      const a=items.find(x=>x.id===kbView);
      if (!a){setKbView(null);return null;}
      return (
        <>
          <div style={{display:"flex",alignItems:"center",gap:6,color:"var(--mu)",cursor:"pointer",fontSize:13,marginBottom:15}} onClick={()=>setKbView(null)}>{t.backToKb}</div>
          <div style={{maxWidth:680}}>
            <div style={{fontSize:28,marginBottom:8}}>{a.thumb}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:4}}>{a.title}</div>
            <div style={{fontSize:12,color:"var(--mu)",marginBottom:16}}><Bdg cls={a.type==="youtube"?"b-rd":a.type==="gdoc"?"b-bl":"b-pu"}>{a.type==="youtube"?t.ytType:a.type==="gdoc"?t.gdocType:t.sopType}</Bdg></div>
            {a.type==="youtube"&&<div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:12,padding:22,textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>▶️</div><div style={{fontSize:14,marginBottom:12,color:"var(--mu)"}}>{a.desc}</div><a href={a.url} target="_blank" rel="noreferrer" className="btn btn-p" style={{textDecoration:"none"}}>{t.openYt}</a></div>}
            {a.type==="gdoc"&&<div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:12,padding:22}}><div style={{display:"flex",alignItems:"center",gap:11,marginBottom:13}}><span style={{fontSize:34}}>📄</span><div><div style={{fontWeight:600,marginBottom:3}}>{a.title}</div><div style={{fontSize:12,color:"var(--mu)"}}>{a.desc}</div></div></div><a href={a.url} target="_blank" rel="noreferrer" className="btn btn-p" style={{textDecoration:"none",marginRight:8}}>{t.openDoc}</a><span style={{fontSize:11,color:"var(--mu)"}}>{t.opensNewTab}</span><div style={{marginTop:11,background:"var(--s3)",borderRadius:8,padding:"7px 10px",fontSize:11,color:"var(--mu)",wordBreak:"break-all"}}>{a.url}</div></div>}
            {a.type==="sop"&&<div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:20,whiteSpace:"pre-line",lineHeight:1.9,fontSize:14,color:"#bec8da"}}>{a.content}</div>}
          </div>
        </>
      );
    }
    return (
      <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:15,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",gap:3,background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:9,padding:3}}>
            {[[" all",t.all],["sop",t.sop],["youtube",t.youtube],["gdoc",t.gdocs]].map(([v,l])=>(
              <button key={v} onClick={()=>setKbFilter(v.trim())}
                style={{padding:"5px 11px",borderRadius:7,border:"none",background:kbFilter===v.trim()?"var(--acc)":"none",color:kbFilter===v.trim()?"#000":"var(--mu)",fontSize:12,fontWeight:500}}>
                {l}
              </button>
            ))}
          </div>
          {canEdit&&<button className="btn btn-p" onClick={()=>{setKF(defK);setModal("kb");}}>{t.addMaterial}</button>}
        </div>
        <div className="kb-grid">
          {filtered.map(a=>(
            <div key={a.id} className="kb-card" onClick={()=>setKbView(a.id)}>
              <div style={{fontSize:26,marginBottom:7}}>{a.thumb}</div>
              <div style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{a.type==="youtube"?t.ytType:a.type==="gdoc"?t.gdocType:t.sopType}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,marginBottom:5}}>{a.title}</div>
              <div style={{fontSize:12,color:"var(--mu)",lineHeight:1.4}}>{a.desc||a.content?.slice(0,65)+"..."}</div>
            </div>
          ))}
          {!filtered.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:48,color:"var(--mu)"}}><div style={{fontSize:34,marginBottom:8}}>📭</div><div>{t.noKb}</div></div>}
        </div>
      </>
    );
  };

  /* ════════ NAV ════════ */
  const sectionLabels = {
    dashboard:t.dashboard, departments:t.departments, branches:t.branches,
    tasks:t.tasks, schedule:t.schedule, salary:t.salary,
    performance:t.performance, chat:t.chat, kb:t.kb, pnl:t.pnl,
  };

  const allWsPages = ALL_SECTIONS.map(s=>({key:s.id,icon:s.icon,label:sectionLabels[s.id]||s.id,sec:t.workspace}));
  const wsPages    = ALL_SECTIONS.filter(s=>myAccess.includes(s.id)).map(s=>({key:s.id,icon:s.icon,label:sectionLabels[s.id]||s.id,sec:t.workspace}));
  const navPages   = viewPartner ? wsPages
    : isSA ? [...allWsPages, {key:"partners",icon:IC.partners,label:t.partners,sec:"Nova Launch System"}]
    : wsPages;
  const pageMap   = {dashboard:<Dashboard/>,partners:<SAPartners/>,departments:<Employees/>,branches:<Branches/>,tasks:<Tasks/>,schedule:<Schedule/>,salary:<Salary/>,performance:<Performance/>,chat:<Chat/>,kb:<KnowledgeBase/>,pnl:<PnL/>};

  const activePid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
  const activePart= getPartner(activePid);
  const pendingT  = (activePart?.tasks||[]).filter(x=>x.status!=="done").length;

  const useBranding = viewPartner&&["Pro","VIP"].includes(viewPartner?.plan);
  const brandName   = useBranding?viewPartner.companyName:"Nova Launch System";
  const brandColor  = useBranding?(viewPartner.accentColor||"var(--acc)"):"var(--acc)";

  return (
    <LangCtx.Provider value={{lang,t,setLang}}>
      <style>{S}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sb">
          <div className="sb-logo">
            <div className="sb-logo-name">{brandName}<span style={{color:brandColor}}>.</span></div>
            <div className="sb-logo-sub">{t.appSub}</div>
          </div>
          <div className="sb-user">
            <Av name={currentUser.name||currentUser.companyName||"?"} color={brandColor}/>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(currentUser.name||currentUser.companyName||"User").split(" ")[0]}</div>
              <div style={{fontSize:10,color:"var(--mu)"}}>{isSA?t.superAdmin:isPartner?t.owner:currentUser.role||t.employee}</div>
            </div>
          </div>
          <nav className="sb-nav">
            {[...new Set(navPages.map(p=>p.sec))].map(sec=>(
              <div key={sec}>
                <div className="sb-sec">{sec}</div>
                {navPages.filter(p=>p.sec===sec).map(p=>(
                  <button key={p.key} className={`nb ${page===p.key?"act":""}`} onClick={()=>{setPage(p.key);setKbView(null);}}>
                    <span className="ni">{p.icon}</span>{p.label}
                    {p.key==="tasks"&&pendingT>0&&<span className="cnt">{pendingT}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            {/* Language toggle */}
            <div className="lang-toggle" style={{marginBottom:8,width:"100%",justifyContent:"center",display:"flex"}}>
              <button className={`lang-btn ${lang==="ru"?"act":""}`} onClick={()=>setLang("ru")}>RU</button>
              <button className={`lang-btn ${lang==="en"?"act":""}`} onClick={()=>setLang("en")}>EN</button>
            </div>
            <button className="btn btn-g btn-sm" style={{width:"100%",justifyContent:"center"}}
              onClick={()=>{setCurrentUser(null);setViewPartner(null);setPage("dashboard");}}>
              ⏏ {IC.logout} {t.logout}
            </button>
          </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          {navPages.slice(0,5).map(p=>(
            <button key={p.key} className={`mob-nb ${page===p.key?"act":""}`} onClick={()=>{setPage(p.key);setKbView(null);}}>
              <span className="mi">{p.icon}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{p.label}</span>
            </button>
          ))}
          {navPages.length>5&&(
            <button className={`mob-nb`} onClick={()=>setModal("mob_menu")}>
              <span className="mi">⋯</span>
              <span>{lang==="ru"?"Ещё":"More"}</span>
            </button>
          )}
        </nav>

        {/* MOBILE MORE MENU */}
        {modal==="mob_menu"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{lang==="ru"?"Все разделы":"All sections"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {navPages.map(p=>(
                  <button key={p.key} className="btn btn-g" style={{justifyContent:"flex-start",gap:10,padding:"12px 14px"}}
                    onClick={()=>{setPage(p.key);setKbView(null);setModal(null);}}>
                    <span style={{fontSize:18}}>{p.icon}</span>
                    <span style={{fontSize:13}}>{p.label}</span>
                  </button>
                ))}
              </div>
              <div style={{marginTop:14}}>
                <button className="btn btn-d" style={{width:"100%",justifyContent:"center"}}
                  onClick={()=>{setCurrentUser(null);setViewPartner(null);setPage("dashboard");setModal(null);}}>
                  ⏏ {t.logout}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN */}
        <div className="main">
          {viewPartner&&(
            <div className="imp-banner">
              👁 {t.viewingPartner} <strong>{viewPartner.companyName}</strong>
              <Bdg cls={planBdg(viewPartner.plan)}>{viewPartner.plan}</Bdg>
              <button className="btn btn-g btn-sm" style={{marginLeft:"auto"}} onClick={()=>{setViewPartner(null);setPage("dashboard");}}>{t.exitCabinet}</button>
            </div>
          )}
          {page!=="chat"&&(
            <div className="topbar">
              <div>
                <div className="pg-title">{sectionLabels[page]||(page==="partners"?t.partners:t.dashboard)}</div>
                <div className="pg-sub">{viewPartner?viewPartner.companyName:isSA?"Nova Launch System — "+t.superAdmin:isPartner?(currentUser.companyName||""):currentUser.role||""}</div>
              </div>
            </div>
          )}
          <div className={`content${page==="chat"?" chat-page":""}`}>
            {pageMap[page]||<Dashboard/>}
          </div>
        </div>

        {/* ══ MODALS ══ */}

        {modal==="partner"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newPartner}</div>
              <div className="info">{t.partnerInfo}</div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.companyName}</label><input className="inp" value={pF.companyName} onChange={e=>setPF(p=>({...p,companyName:e.target.value}))} placeholder="iRing Cleaning Service"/></div>
                <div className="fg">
                  <label className="lbl">{t.plan}</label>
                  <select className="inp" value={pF.plan} onChange={e=>setPF(p=>({...p,plan:e.target.value}))}>
                    <option value="Basic">{t.planBasic}</option>
                    <option value="Pro">{t.planPro}</option>
                    <option value="VIP">{t.planVIP}</option>
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.partnerEmail}</label><input className="inp" value={pF.email} onChange={e=>setPF(p=>({...p,email:e.target.value}))} placeholder="owner@company.com"/></div>
                <div className="fg"><label className="lbl">{t.partnerPass}</label><input className="inp" type="text" value={pF.password} onChange={e=>setPF(p=>({...p,password:e.target.value}))} placeholder="Pass2025!"/></div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.logo}</label><input className="inp" value={pF.logo} onChange={e=>setPF(p=>({...p,logo:e.target.value}))} placeholder="💎"/></div>
                <div className="fg">
                  <label className="lbl">{t.brandColor}</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                    {["#f0a500","#3b82f6","#22c55e","#ef4444","#a855f7","#ec4899","#06b6d4","#f97316"].map(c=>(
                      <div key={c} onClick={()=>setPF(p=>({...p,accentColor:c}))} style={{width:26,height:26,borderRadius:6,background:c,cursor:"pointer",border:pF.accentColor===c?"2px solid #fff":"2px solid transparent"}}/>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createPartner}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {modal==="emp"&&(()=>{
          const pid2  = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
          const p2    = getPartner(pid2)||{departments:[],branches:[]};
          const depts2= p2.departments||[];
          const brs2  = p2.branches||[];
          const allChannels = [{id:"general",label:lang==="ru"?"Общий":"General",icon:"📢"},...depts2.map(d=>({id:d.id,label:d.name,icon:d.icon}))];
          return (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.addUser}</div>
              <div className="info">{t.empInfo}</div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.name}</label><input className="inp" value={eF.name} onChange={e=>setEF(p=>({...p,name:e.target.value}))} placeholder="Anna Smith"/></div>
                <div className="fg">
                  <label className="lbl">{t.role}</label>
                  <select className="inp" value={eF.role} onChange={e=>setEF(p=>({...p,role:e.target.value}))}>
                    {roles.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.emailLogin}</label><input className="inp" value={eF.email} onChange={e=>setEF(p=>({...p,email:e.target.value}))} placeholder="anna@company.com"/></div>
                <div className="fg"><label className="lbl">{t.password}</label><input className="inp" type="text" value={eF.password} onChange={e=>setEF(p=>({...p,password:e.target.value}))} placeholder="Anna2025!"/></div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">🏢 {lang==="ru"?"Отдел":"Department"}</label>
                  <select className="inp" value={eF.deptId} onChange={e=>setEF(p=>({...p,deptId:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Не указан —":"— Not assigned —"}</option>
                    {depts2.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">📍 {lang==="ru"?"Город":"City"}</label>
                  <select className="inp" value={eF.branchId} onChange={e=>setEF(p=>({...p,branchId:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Не указан —":"— Not assigned —"}</option>
                    {brs2.map(b=><option key={b.id} value={b.id}>🏙️ {b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">{t.accessSections}</label>
                <div className="warn">{t.accessWarn}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {ALL_SECTIONS.filter(s=>myAccess.includes(s.id)||isSA).map(s=>{
                    const chk=(eF.sections||[]).includes(s.id);
                    return (
                      <label key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px",background:chk?"var(--acc)10":"var(--s2)",border:`1px solid ${chk?"var(--acc)30":"var(--bdr)"}`,borderRadius:8,cursor:"pointer"}}>
                        <input type="checkbox" checked={chk} style={{accentColor:"var(--acc)"}}
                          onChange={()=>setEF(p=>({...p,sections:chk?p.sections.filter(x=>x!==s.id):[...p.sections,s.id]}))}/>
                        <span style={{fontSize:14}}>{s.icon}</span>
                        <span style={{fontSize:13,fontWeight:500}}>{sectionLabels[s.id]||s.id}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="fg">
                <label className="lbl">💬 {lang==="ru"?"Доступ к каналам чата":"Chat channel access"}</label>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {allChannels.map(ch=>{
                    const chk=(eF.chatChannels||["general"]).includes(ch.id);
                    return (
                      <label key={ch.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:chk?"#3b82f615":"var(--s2)",border:`1px solid ${chk?"#3b82f630":"var(--bdr)"}`,borderRadius:8,cursor:"pointer"}}>
                        <input type="checkbox" checked={chk} style={{accentColor:"var(--bl)"}}
                          onChange={()=>setEF(p=>({...p,chatChannels:chk?(p.chatChannels||[]).filter(x=>x!==ch.id):[...(p.chatChannels||[]),ch.id]}))}/>
                        <span style={{fontSize:14}}>{ch.icon}</span>
                        <span style={{fontSize:13,fontWeight:500}}>{ch.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="fg">
                <label className="lbl">{t.statusLabel}</label>
                <select className="inp" value={eF.status} onChange={e=>setEF(p=>({...p,status:e.target.value}))}>
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createEmployee}>{t.createAccount}</button>
              </div>
            </div>
          </div>
          );
        })()}

        {modal==="dept"&&(()=>{
          const pid2 = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
          const brs2 = getPartner(pid2)?.branches||[];
          return (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newDept}</div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.deptName}</label><input className="inp" value={dF.name} onChange={e=>setDF(p=>({...p,name:e.target.value}))} placeholder={lang==="ru"?"Отдел продаж":"Sales Department"}/></div>
                <div className="fg">
                  <label className="lbl">📍 {lang==="ru"?"Город / офис":"City / office"}</label>
                  <select className="inp" value={dF.branchId} onChange={e=>setDF(p=>({...p,branchId:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Не привязан —":"— Not assigned —"}</option>
                    {brs2.map(b=><option key={b.id} value={b.id}>🏙️ {b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.deptIcon}</label><input className="inp" value={dF.icon} onChange={e=>setDF(p=>({...p,icon:e.target.value}))} placeholder="💼"/></div>
                <div className="fg">
                  <label className="lbl">{t.deptColor}</label>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>
                    {["#f0a500","#3b82f6","#a855f7","#22c55e","#ec4899","#f97316","#06b6d4","#ef4444"].map(c=>(
                      <div key={c} onClick={()=>setDF(p=>({...p,color:c}))} style={{width:26,height:26,borderRadius:6,background:c,cursor:"pointer",border:dF.color===c?"2px solid #fff":"2px solid transparent"}}/>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:9,padding:"10px 13px",marginBottom:13}}>
                <div style={{fontSize:11,color:"var(--mu)",marginBottom:6}}>{t.preview}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{dF.icon}</span>
                  <span style={{fontWeight:600,color:dF.color}}>{dF.name||t.deptName}</span>
                  {dF.branchId&&brs2.find(b=>b.id===dF.branchId)&&<span style={{fontSize:11,color:"var(--mu)"}}>· 📍 {brs2.find(b=>b.id===dF.branchId)?.name}</span>}
                </div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createDept}>{t.create}</button>
              </div>
            </div>
          </div>
          );
        })()}

        {modal==="branch"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newBranch}</div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.branchName}</label><input className="inp" value={brF.name} onChange={e=>setBrF(p=>({...p,name:e.target.value}))} placeholder="Austin HQ"/></div>
                <div className="fg"><label className="lbl">{t.branchCity}</label><input className="inp" value={brF.city} onChange={e=>setBrF(p=>({...p,city:e.target.value}))} placeholder="Austin, TX"/></div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createBranch}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {modal==="task"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newTask}</div>
              <div className="fg"><label className="lbl">{t.taskTitle}</label><input className="inp" value={tF.title} onChange={e=>setTF(p=>({...p,title:e.target.value}))} placeholder={lang==="ru"?"Описание задачи...":"Task description..."}/></div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.assignee}</label>
                  <select className="inp" value={tF.assigneeId} onChange={e=>setTF(p=>({...p,assigneeId:e.target.value}))}>
                    <option value="">{t.selectAssignee}</option>
                    {(activeWS?.employees||[]).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.priority}</label>
                  <select className="inp" value={tF.priority} onChange={e=>setTF(p=>({...p,priority:e.target.value}))}>
                    <option value="high">🔴 {t.high}</option>
                    <option value="medium">🟡 {t.medium}</option>
                    <option value="low">🟢 {t.low}</option>
                  </select>
                </div>
              </div>
              <div className="fg"><label className="lbl">{t.due}</label><input className="inp" type="date" value={tF.due} onChange={e=>setTF(p=>({...p,due:e.target.value}))}/></div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createTask}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {modal==="schedule"&&(()=>{
          const pid2   = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
          const p2     = getPartner(pid2)||{employees:[],departments:[],branches:[]};
          const selEmp = p2.employees?.find(e=>e.id===scF.employeeId);
          const selDept= p2.departments?.find(d=>d.id===selEmp?.deptId);
          const selBr  = p2.branches?.find(b=>b.id===selEmp?.branchId);
          return (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newShift}</div>
              <div className="fg">
                <label className="lbl">{t.shiftEmp}</label>
                <select className="inp" value={scF.employeeId} onChange={e=>setScF(p=>({...p,employeeId:e.target.value}))}>
                  <option value="">{t.selectAssignee}</option>
                  {p2.employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              {selEmp&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  {selDept&&<span style={{fontSize:12,color:selDept.color,background:selDept.color+"18",borderRadius:6,padding:"3px 9px"}}>{selDept.icon} {selDept.name}</span>}
                  {selBr  &&<span style={{fontSize:12,color:"var(--mu)",background:"var(--s2)",borderRadius:6,padding:"3px 9px"}}>📍 {selBr.name}{selBr.city?`, ${selBr.city}`:""}</span>}
                  {!selDept&&!selBr&&<span style={{fontSize:11,color:"var(--mu2)"}}>{lang==="ru"?"Отдел и город не указаны":"No dept or city assigned"}</span>}
                </div>
              )}
              <div className="fr">
                <div className="fg"><label className="lbl">{t.due}</label><input className="inp" type="date" value={scF.date} onChange={e=>setScF(p=>({...p,date:e.target.value}))}/></div>
                <div className="fg">
                  <label className="lbl">{t.statusLabel}</label>
                  <select className="inp" value={scF.status} onChange={e=>setScF(p=>({...p,status:e.target.value}))}>
                    <option value="confirmed">{t.confirmed}</option>
                    <option value="pending">{t.pending}</option>
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.startTime}</label><input className="inp" type="time" value={scF.startTime} onChange={e=>setScF(p=>({...p,startTime:e.target.value}))}/></div>
                <div className="fg"><label className="lbl">{t.endTime}</label><input className="inp" type="time" value={scF.endTime} onChange={e=>setScF(p=>({...p,endTime:e.target.value}))}/></div>
              </div>
              <div className="fg"><label className="lbl">{t.notes}</label><input className="inp" value={scF.notes} onChange={e=>setScF(p=>({...p,notes:e.target.value}))} placeholder={lang==="ru"?"Заметка о смене...":"Shift note..."}/></div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createSched}>{t.create}</button>
              </div>
            </div>
          </div>
          );
        })()}

        {modal==="pay"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newPayment}</div>
              <div className="fg">
                <label className="lbl">{t.assignee}</label>
                <select className="inp" value={paF.employeeId} onChange={e=>setPaF(p=>({...p,employeeId:e.target.value}))}>
                  <option value="">{t.selectAssignee}</option>
                  {(activeWS?.employees||[]).map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.amount}</label><input className="inp" type="number" value={paF.amount} onChange={e=>setPaF(p=>({...p,amount:e.target.value}))} placeholder="3500"/></div>
                <div className="fg"><label className="lbl">{t.payDate}</label><input className="inp" type="date" value={paF.date} onChange={e=>setPaF(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.note}</label><input className="inp" value={paF.note} onChange={e=>setPaF(p=>({...p,note:e.target.value}))} placeholder={lang==="ru"?"Июнь 2025":"June 2025"}/></div>
                <div className="fg">
                  <label className="lbl">{t.payStatus}</label>
                  <select className="inp" value={paF.status} onChange={e=>setPaF(p=>({...p,status:e.target.value}))}>
                    <option value="pending">⏳ {t.notPaid}</option>
                    <option value="paid">✓ {t.paid}</option>
                  </select>
                </div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createPayment}>{t.addPayment}</button>
              </div>
            </div>
          </div>
        )}

        {modal==="kb"&&(
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newKb}</div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.kbType}</label>
                  <select className="inp" value={kF.type} onChange={e=>setKF(p=>({...p,type:e.target.value}))}>
                    <option value="sop">{t.sopType}</option>
                    <option value="youtube">{t.ytType}</option>
                    <option value="gdoc">{t.gdocType}</option>
                  </select>
                </div>
                <div className="fg"><label className="lbl">{t.kbIcon}</label><input className="inp" value={kF.thumb} onChange={e=>setKF(p=>({...p,thumb:e.target.value}))}/></div>
              </div>
              <div className="fg"><label className="lbl">{t.kbTitle}</label><input className="inp" value={kF.title} onChange={e=>setKF(p=>({...p,title:e.target.value}))} placeholder={lang==="ru"?"Название материала":"Material title"}/></div>
              {kF.type==="sop"&&<div className="fg"><label className="lbl">{t.kbContent}</label><textarea className="inp" value={kF.content} onChange={e=>setKF(p=>({...p,content:e.target.value}))} placeholder={lang==="ru"?"Пропишите шаги...":"Write steps..."}/></div>}
              {kF.type==="youtube"&&<>
                <div className="fg"><label className="lbl">{t.kbUrl}</label><input className="inp" value={kF.url} onChange={e=>setKF(p=>({...p,url:e.target.value}))} placeholder="https://youtube.com/watch?v=..."/></div>
                <div className="fg"><label className="lbl">{t.kbDesc}</label><input className="inp" value={kF.desc} onChange={e=>setKF(p=>({...p,desc:e.target.value}))}/></div>
              </>}
              {kF.type==="gdoc"&&<>
                <div className="fg">
                  <label className="lbl">{t.kbGdocUrl}</label>
                  <input className="inp" value={kF.url} onChange={e=>setKF(p=>({...p,url:e.target.value}))} placeholder="https://docs.google.com/document/d/..."/>
                  <div style={{fontSize:11,color:"var(--mu)",marginTop:4}}>{t.kbGdocHint}</div>
                </div>
                <div className="fg"><label className="lbl">{t.kbGdocDesc}</label><input className="inp" value={kF.desc} onChange={e=>setKF(p=>({...p,desc:e.target.value}))}/></div>
              </>}
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createKb}>{t.addMaterial}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LangCtx.Provider>
  );
}
