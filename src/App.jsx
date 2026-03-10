import { useState, useRef, useEffect, createContext, useContext, Component } from "react";
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
    hrcards: "HR Картотека", hrCardsTitle: "Картотека сотрудников",
    booking: "Бронирования", bookingNew: "Новая заявка", bookingCalendar: "Календарь", bookingClients: "Клиенты", bookingCalc: "Калькулятор", bookingSettings: "Настройки",
    crm: "CRM / Контакты", crmContacts: "Контакты", crmPipeline: "Воронка", crmTags: "Теги", addContact: "+ Контакт", contactName: "Имя", contactPhone: "Телефон", contactEmail: "Email", contactTags: "Теги", contactStatus: "Статус", contactNote: "Заметка", contactHistory: "История", addNote: "+ Заметка", noContacts: "Контактов пока нет", searchContacts: "Поиск по имени, телефону...", filterByTag: "Фильтр по тегу", crmStage: "Стадия воронки", stageLead: "Лид", stageContact: "Контакт", stageNegotiation: "Переговоры", stageClient: "Клиент", stageLost: "Потерян", addTag: "+ Тег", manageTagsTitle: "Управление тегами", automations: "Автоматизации", addAutomation: "+ Автоматизация", triggerTag: "Триггер: тег добавлен", actionSms: "Действие: отправить SMS", delayHours: "Задержка (часов)", msgTemplate: "Шаблон сообщения",
    training: "Обучение", addLesson: "+ Урок", assignLesson: "Назначить", myLessons: "Мои уроки", allLessons: "Все уроки", assignees: "Назначения", progressTab: "Прогресс", lessonTitle: "Название урока", lessonType: "Тип контента", lessonDept: "Отдел", lessonBranch: "Город", lessonContent: "Контент (текст)", lessonUrl: "Ссылка (YouTube / PDF)", lessonDuration: "Длительность (мин)", notStarted: "Не начат", inProgress: "В процессе", completed: "Завершён", markComplete: "Отметить как выполнено", startLesson: "Начать урок", continueLesson: "Продолжить", quizQuestion: "Вопрос", quizAnswer: "Ответ", quizAddQ: "+ Вопрос", certificate: "Сертификат", completionRate: "Выполнено", assignTo: "Назначить сотруднику", noLessons: "Уроков пока нет", noAssignments: "Нет назначений",
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
// SA accounts — primary is always in code, extras managed in Firebase (saAccounts)
const PRIMARY_SA = {
  id:"sa_1", name:"Zalina Struchalina",
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
  booking:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  hrcards:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M14 8h4"/><path d="M14 12h4"/><path d="M4 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/></svg>,
  crm:         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-4-4h0"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  phone:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  sms:         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  tag:         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  funnel:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  training:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  play:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  check2:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  award:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  assign:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
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
  { id:"training",    icon:IC.training },
  { id:"crm",         icon:IC.crm },
  { id:"hrcards",     icon:IC.hrcards },
  { id:"booking",     icon:IC.booking },
];

const PLAN_SECTIONS = {
  Basic: ["dashboard","departments","tasks","chat","kb","pnl","training","crm","hrcards","booking"],
  Pro:   ["dashboard","departments","branches","tasks","schedule","salary","performance","chat","kb","pnl","training","crm","hrcards","booking"],
  VIP:   ["dashboard","departments","branches","tasks","schedule","salary","performance","chat","kb","pnl","training","crm","hrcards","booking"],
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
html.light-mode{--bg:#f0f4fb;--s1:#ffffff;--s2:#f4f6fb;--s3:#e8ecf4;--bdr:#00000012;--bdr2:#00000022;--tx:#1a2030;--mu:#4b5563;--mu2:#9ca3af;}
html.light-mode body{background:#f0f4fb;color:#111827;}
html.light-mode .sb{background:#fff;box-shadow:2px 0 16px #0000000f;border-right-color:#0000001a;}
html.light-mode .topbar{background:#fff;box-shadow:0 2px 8px #00000008;border-bottom-color:#0000001a;}
html.light-mode .inp,html.light-mode .chat-inp{background:#f4f6fb;border-color:#0000001a;color:#111827;}
html.light-mode .inp:focus,html.light-mode .chat-inp:focus{border-color:#0000003a;}
html.light-mode .btn-g{background:#f4f6fb;color:#111827;border-color:#0000001a;}
html.light-mode .btn-g:hover{background:#e8ecf4;}
html.light-mode .nb{color:#374151;}
html.light-mode .nb:hover{background:#f4f6fb;}
html.light-mode .nb.act{color:var(--acc);}
html.light-mode .sb-logo-name{color:#111827;}
html.light-mode .sb-logo-sub{color:#6b7280;}
html.light-mode .card{background:#fff;border-color:#0000001a;}
html.light-mode .stat{background:#fff;border-color:#0000001a;}
html.light-mode .modal{background:#fff;border-color:#00000020;}
html.light-mode .ovl{background:rgba(0,0,0,0.35);}
html.light-mode .task-col{background:#fff;border-color:#0000001a;}
html.light-mode .task-item{background:#f4f6fb;border-color:#0000001a;}
html.light-mode .partner-card{background:#fff;border-color:#0000001a;}
html.light-mode .kb-card{background:#fff;border-color:#0000001a;}
html.light-mode .chat-wrap,html.light-mode .chat-sb{background:#fff;border-color:#0000001a;}
html.light-mode .chat-msg-wrap .bubble{background:#e8ecf4;color:#111827;}
html.light-mode .lang-toggle{background:#f4f6fb;border-color:#0000001a;}
html.light-mode .lang-btn{color:#6b7280;}
.light-mode select option{background:#fff;color:#111827;}
html.light-mode .tw table{color:#111827;}
html.light-mode .tw thead tr{background:#f4f6fb;}
html.light-mode .tw tbody tr:hover{background:#f8faff;}
html.light-mode .content{background:#f0f4fb;}
html.light-mode .pg-title{color:#111827;}
html.light-mode .pg-sub{color:#6b7280;}
html.light-mode .modal-t{color:#111827;}
html.light-mode .lbl{color:#6b7280;}
html.light-mode .card-t{color:#111827;}
html.light-mode .stat-v{color:#111827;}
html.light-mode .sb-sec{color:#9ca3af;}
html.light-mode .sb-user{color:#111827;}
html.light-mode select,html.light-mode textarea{background:#f4f6fb;border-color:#0000001a;color:#111827;}
html.light-mode .task-col .card-t{color:#111827;}
html.light-mode .partner-card *:not([style*="color"]){color:#111827;}
html.light-mode [class*="recharts"] text{fill:#4b5563;}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;transition:background .2s,color .2s;}
button,input,select,textarea{font-family:'DM Sans',sans-serif;cursor:pointer;}
input,select,textarea{cursor:text;}
.app{display:flex;height:100vh;overflow:hidden;}
.sb{width:232px;min-width:232px;background:var(--s1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;overflow:hidden;transition:background .2s,border-color .2s;}
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
  .mob-tabs-bar{display:flex !important;}
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
.mob-tabs-bar{display:none;}
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
function LoginScreen({ partners, saAccounts, onLogin, lang, setLang }) {
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
      if (e===PRIMARY_SA.email&&pw===PRIMARY_SA.password) { onLogin({...PRIMARY_SA}); return; }
      // Check extra SA accounts from Firebase
      const extraSA = (saAccounts||[]).find(a=>a.email.toLowerCase()===e&&a.password===pw);
      if (extraSA) { onLogin({...extraSA,type:"superadmin"}); return; }
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
   ERROR BOUNDARY — prevents white screen
═══════════════════════════════════════════ */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = {hasError:false,error:null}; }
  static getDerivedStateFromError(error) { return {hasError:true,error}; }
  componentDidCatch(error,info) { console.error("App crash:", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#0f172a",color:"#fff",fontFamily:"sans-serif",padding:32,gap:16}}>
        <div style={{fontSize:48}}>⚠️</div>
        <div style={{fontSize:20,fontWeight:700}}>Что-то пошло не так</div>
        <div style={{fontSize:13,color:"#94a3b8",maxWidth:420,textAlign:"center"}}>
          {this.state.error?.message||"Произошла неожиданная ошибка."}
        </div>
        <button onClick={()=>{ this.setState({hasError:false,error:null}); }}
          style={{marginTop:8,padding:"10px 24px",background:"#6366f1",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>
          ↺ Перезагрузить приложение
        </button>
        <button onClick={()=>{ localStorage.clear(); window.location.reload(); }}
          style={{padding:"8px 24px",background:"transparent",color:"#ef4444",border:"1px solid #ef444450",borderRadius:8,cursor:"pointer",fontSize:12}}>
          🗑 Сбросить данные и перезагрузить
        </button>
      </div>
    );
  }
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
function AppInner() {
  const [lang, setLang]           = useState(()=>localStorage.getItem("nls_lang")||"ru");
  const [theme, setTheme]         = useState(()=>localStorage.getItem("nls_theme")||"dark");

  // ── Persist preferences to localStorage ──
  useEffect(()=>{ localStorage.setItem("nls_lang",  lang);  }, [lang]);
  useEffect(()=>{
    localStorage.setItem("nls_theme", theme);
    if (theme==="light") document.documentElement.classList.add("light-mode");
    else document.documentElement.classList.remove("light-mode");
  }, [theme]);
  useEffect(()=>{
    const saved = localStorage.getItem("nls_theme");
    if (saved==="light") document.documentElement.classList.add("light-mode");
    else document.documentElement.classList.remove("light-mode");
  }, []);
  useEffect(()=>{
    const html = document.documentElement;
    const body = document.body;
    if (theme==="light") {
      html.classList.add("light-mode");
      body.style.cssText = "background:#f0f4fb!important;color:#1a2030!important;";
    } else {
      html.classList.remove("light-mode");
      body.style.cssText = "background:#07090f!important;color:#e6eaf4!important;";
    }
  }, [theme]);
  const t = T[lang];
  const roles = lang==="ru" ? ROLES_RU : ROLES_EN;

  const [partners,    setPartners]    = useState([]);
  const [saAccounts,  setSaAccounts]  = useState([]);
  const [fbLoading,   setFbLoading]   = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewPartner, setViewPartner] = useState(null);
  const [saMode,      setSaMode]      = useState("workspace"); // "workspace" | "partners"
  const [page,        setPage]        = useState(()=>localStorage.getItem("nls_page")||"dashboard");
  useEffect(()=>{ if(page) localStorage.setItem("nls_page", page); }, [page]);
  const [modal,       setModal]       = useState(null);
  const [chatChannel, setChatChannel] = useState("general");
  const [chatMsgs,    setChatMsgs]    = useState({});
  // lastRead: { [channelKey]: lastReadMsgId } — persisted in localStorage
  const [lastRead, setLastRead] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("nls_lastRead")||"{}"); } catch{ return {}; }
  });
  const [kbView,      setKbView]      = useState(null);
  const [kbFilter,    setKbFilter]    = useState("all");
  const [bookingTab,  setBookingTab]  = useState("calendar");
  const [bkExpanded,  setBkExpanded]  = useState(false);
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

  // ── Firebase helpers: Firestore doesn't support nested arrays ──
  // Serialize: convert 2D arrays inside bkSettings to JSON strings
  function serializePartner(p) {
    if (!p.bkSettings) return p;
    const bs = {...p.bkSettings};
    if (bs.matrix)    bs.matrix    = JSON.stringify(bs.matrix);
    if (bs.durMatrix) bs.durMatrix = JSON.stringify(bs.durMatrix);
    return {...p, bkSettings: bs};
  }
  function deserializePartner(p) {
    if (!p.bkSettings) return p;
    const bs = {...p.bkSettings};
    try { if (typeof bs.matrix    === "string") bs.matrix    = JSON.parse(bs.matrix);    } catch(e){}
    try { if (typeof bs.durMatrix === "string") bs.durMatrix = JSON.parse(bs.durMatrix); } catch(e){}
    return {...p, bkSettings: bs};
  }

  // ── Firebase: load & sync partners in real-time ──
  useEffect(()=>{
    const ref = doc(db, "app", "data");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPartners((data.partners || []).map(deserializePartner));
        setSaAccounts(data.saAccounts || []);
        if (data.chatMsgs) setChatMsgs(data.chatMsgs);
        // Restore session
        if (data.session) {
          const saved = data.session;
          const stillValid = saved.type==="superadmin"
            ? (saved.email===PRIMARY_SA.email || (data.saAccounts||[]).some(a=>a.id===saved.id))
            : saved.type==="partner"
              ? (data.partners||[]).some(p=>p.id===saved.id&&p.status==="active")
              : (data.partners||[]).some(p=>(p.employees||[]).some(e=>e.id===saved.id&&e.status==="active"));
          if (stillValid && !currentUser) {
            setCurrentUser(saved);
            // Restore last page — will be validated by myAccess in render
          }
        }
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
    const serialized = partners.map(serializePartner);
    setDoc(ref, { partners: serialized }, { merge: true }).catch(console.error);
  }, [partners]);

  // ── Save chatMsgs to Firebase ──
  const chatMounted = useRef(false);
  useEffect(()=>{
    if (!chatMounted.current) { chatMounted.current = true; return; }
    if (fbLoading) return;
    const ref = doc(db, "app", "data");
    setDoc(ref, { chatMsgs }, { merge: true }).catch(console.error);
  }, [chatMsgs]);

  // ── Save saAccounts to Firebase ──
  const saMounted = useRef(false);
  useEffect(()=>{
    if (!saMounted.current) { saMounted.current = true; return; }
    if (fbLoading) return;
    const ref = doc(db, "app", "data");
    setDoc(ref, { saAccounts }, { merge: true }).catch(console.error);
  }, [saAccounts]);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[chatMsgs,chatChannel]);

  // Auto-mark read when chat page is active and new messages arrive
  useEffect(()=>{
    if (page!=="chat"||!currentUser) return;
    const pid = viewPartner?.id||(isSA?"nce_main":activePart?.id||"sa");
    const key = pid+"_"+chatChannel;
    const msgs = chatMsgs[key]||[];
    if (msgs.length) markRead(key, msgs);
  }, [page, chatChannel, chatMsgs]);

  // ── Persist lastRead to localStorage ──
  useEffect(()=>{ localStorage.setItem("nls_lastRead", JSON.stringify(lastRead)); }, [lastRead]);

  // Mark all messages in a channel key as read
  function markRead(channelKey, msgs) {
    if (!msgs||!msgs.length) return;
    const lastId = msgs[msgs.length-1].id;
    setLastRead(prev=>({...prev,[channelKey]:lastId}));
  }

  // Count unread in a channel key for current user
  function countUnread(channelKey) {
    const msgs = chatMsgs[channelKey]||[];
    if (!msgs.length) return 0;
    const lastId = lastRead[channelKey];
    if (!lastId) return msgs.filter(m=>m.authorId!==currentUser?.id).length;
    const idx = msgs.findIndex(m=>m.id===lastId);
    if (idx===-1) return msgs.filter(m=>m.authorId!==currentUser?.id).length;
    return msgs.slice(idx+1).filter(m=>m.authorId!==currentUser?.id).length;
  }

  function updatePartner(id, upd) { setPartners(ps=>ps.map(p=>p.id===id?{...p,...upd}:p)); }
  function getPartner(id) { return partners.find(p=>p.id===id); }

  // Forms
  const defP   = { companyName:"", email:"", password:"", plan:"Basic", status:"active", logo:"", accentColor:"#f0a500", logoUrl:"" };
  const defE   = { name:"", email:"", password:"", role:roles[0], sections:["dashboard","tasks","chat"], chatChannels:["general"], deptId:"", branchId:"", status:"active" };
  const defD   = { name:"", icon:"🏢", color:"#3b82f6", branchId:"" };
  const defBr  = { name:"", city:"" };
  const defT   = { title:"", assigneeId:"", deptId:"", priority:"medium", due:"", status:"todo", description:"" };
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
    // Edit mode
    if (dF._editId) {
      updateDept(dF._editId, {name:dF.name, icon:dF.icon, color:dF.color, branchId:dF.branchId});
      setDF(defD); setModal(null); return;
    }
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

  function updateDept(deptId, patch) {
    const pid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    setPartners(ps=>ps.map(x=>x.id===pid?{...x,departments:(x.departments||[]).map(d=>d.id===deptId?{...d,...patch}:d)}:x));
  }

  function deleteDept(deptId) {
    const pid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    setPartners(ps=>ps.map(x=>x.id===pid?{...x,departments:(x.departments||[]).filter(d=>d.id!==deptId)}:x));
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
    // Auto-fill deptId from assignee if not set
    const pid0 = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    const p0 = partners.find(x=>x.id===pid0)||{};
    const assigneeEmp = (p0.employees||[]).find(e=>e.id===tF.assigneeId);
    const taskData = (!tF.deptId && assigneeEmp?.deptId) ? {...tF, deptId:assigneeEmp.deptId} : {...tF};
    if (!taskData.deptId && isEmp && currentUser.deptId) taskData.deptId = currentUser.deptId;
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const newItem = {...taskData, id:"t_"+Date.now(), createdBy:currentUser.id};
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
          <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}`}</style>
          <div style={{fontSize:12,color:"var(--mu)"}}>Загрузка данных...</div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <style>{S}</style>
        <LoginScreen partners={partners} saAccounts={saAccounts} lang={lang} setLang={setLang}
          onLogin={u=>{setCurrentUser(u);setPage("dashboard");setDoc(doc(db,"app","data"),{session:u},{merge:true}).catch(console.error);}}/>
      </>
    );
  }

  /* ════════ PAGES ════════ */

  /* ── SA: PARTNERS ── */
  const SAPartners = () => {
    const [showSaForm, setShowSaForm] = useState(false);
    const [saF, setSaF] = useState({name:"",email:"",password:""});

    function createSA() {
      if (!saF.name.trim()||!saF.email.trim()||!saF.password.trim()) return;
      const newSA = {id:"sa_"+Date.now(), name:saF.name.trim(), email:saF.email.trim().toLowerCase(), password:saF.password, type:"superadmin", createdAt:new Date().toISOString().split("T")[0]};
      setSaAccounts(prev=>[...prev, newSA]);
      setSaF({name:"",email:"",password:""});
      setShowSaForm(false);
    }

    return (
      <>
        {/* ── SA ACCOUNTS BLOCK ── */}
        <div className="card" style={{marginBottom:20}}>
          <div className="card-hd">
            <div className="card-t" style={{display:"flex",alignItems:"center",gap:8}}>
              {IC.lock} {lang==="ru"?"Супер-администраторы":"Super Admins"}
            </div>
            <button className="btn btn-g btn-sm" onClick={()=>setShowSaForm(s=>!s)}>
              {IC.plus} {lang==="ru"?"Добавить SA":"Add SA"}
            </button>
          </div>
          {showSaForm&&(
            <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:14,marginBottom:12}}>
              <div className="fr" style={{marginBottom:10}}>
                <div className="fg" style={{marginBottom:0}}>
                  <label className="lbl">{t.name}</label>
                  <input className="inp" value={saF.name} onChange={e=>setSaF(f=>({...f,name:e.target.value}))} placeholder="Denis Struchalin"/>
                </div>
                <div className="fg" style={{marginBottom:0}}>
                  <label className="lbl">Email</label>
                  <input className="inp" value={saF.email} onChange={e=>setSaF(f=>({...f,email:e.target.value}))} placeholder="denis@company.com"/>
                </div>
              </div>
              <div className="fr">
                <div className="fg" style={{marginBottom:0}}>
                  <label className="lbl">{t.password}</label>
                  <input className="inp" type="text" value={saF.password} onChange={e=>setSaF(f=>({...f,password:e.target.value}))} placeholder="Denis2025!"/>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",gap:6,paddingBottom:0}}>
                  <button className="btn btn-p" onClick={createSA}>{lang==="ru"?"Создать":"Create"}</button>
                  <button className="btn btn-g" onClick={()=>setShowSaForm(false)}>{t.cancel}</button>
                </div>
              </div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {/* Primary SA — always shown */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"var(--s2)",borderRadius:9,border:"1px solid var(--acc)20"}}>
              <Av name={PRIMARY_SA.name} color="var(--acc)"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{PRIMARY_SA.name}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>{PRIMARY_SA.email}</div>
              </div>
              <Bdg cls="b-yw">{lang==="ru"?"Основной":"Primary"}</Bdg>
            </div>
            {/* Extra SA accounts */}
            {saAccounts.map(sa=>(
              <div key={sa.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"var(--s2)",borderRadius:9}}>
                <Av name={sa.name} color="var(--pu)"/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{sa.name}</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{sa.email}</div>
                </div>
                <Bdg cls="b-pu">SA</Bdg>
                <button className="btn btn-d btn-sm" onClick={()=>setSaAccounts(prev=>prev.filter(a=>a.id!==sa.id))}>{IC.trash}</button>
              </div>
            ))}
            {!saAccounts.length&&(
              <div style={{fontSize:12,color:"var(--mu2)",padding:"4px 8px"}}>{lang==="ru"?"Дополнительных администраторов нет":"No additional admins yet"}</div>
            )}
          </div>
        </div>

        {/* ── PARTNERS ── */}
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
                <div style={{width:42,height:42,borderRadius:10,background:(p.accentColor||"#f0a500")+"20",border:`1px solid ${p.accentColor||"#f0a500"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,overflow:"hidden"}}>
                {p.logoUrl ? <img src={p.logoUrl} alt="logo" style={{width:"100%",height:"100%",objectFit:"contain",padding:3}}/> : (p.logo||"🏢")}
              </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.companyName}</div>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{p.email}</div>
                </div>
                <Bdg cls={planBdg(p.plan)}>{p.plan}</Bdg>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>
                {[
                  {l:t.empCount,  v:(p.employees||[]).length},
                  {l:t.deptCount, v:(p.departments||[]).length},
                  {l:t.branches,  v:(p.branches||[]).length},
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
  };

  /* ── DASHBOARD ── */
  const Dashboard = () => {
    const [logoInput, setLogoInput] = useState("");
    const [showLogoEdit, setShowLogoEdit] = useState(false);
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
    const myPid = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
    const myLogo = getPartner(myPid)?.logoUrl||"";
    return (
      <>
        {/* Logo upload widget — visible to partner and SA in cabinet */}
        {(isPartner||viewPartner)&&(
          <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:12,background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:"12px 16px"}}>
            <div style={{width:52,height:52,borderRadius:10,background:"var(--s2)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
              {myLogo ? <img src={myLogo} alt="logo" style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/> : <span style={{fontSize:26}}>{ws?.logo||"🏢"}</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{lang==="ru"?"Логотип компании":"Company Logo"}</div>
              {showLogoEdit ? (
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input className="inp" value={logoInput} onChange={e=>setLogoInput(e.target.value)}
                    placeholder="https://...logo.png" style={{fontSize:11,padding:"4px 8px",flex:1}}/>
                  <button className="btn btn-p btn-sm" onClick={()=>{
                    setPartners(ps=>ps.map(x=>x.id===myPid?{...x,logoUrl:logoInput}:x));
                    setShowLogoEdit(false);
                  }}>{lang==="ru"?"Сохранить":"Save"}</button>
                  <button className="btn btn-g btn-sm" onClick={()=>setShowLogoEdit(false)}>{lang==="ru"?"Отмена":"Cancel"}</button>
                </div>
              ) : (
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"var(--mu)"}}>{myLogo ? (lang==="ru"?"Логотип загружен":"Logo set") : (lang==="ru"?"Логотип не загружен":"No logo yet")}</span>
                  <button className="btn btn-g btn-sm" onClick={()=>{setLogoInput(myLogo);setShowLogoEdit(true);}}>
                    {IC.plus} {lang==="ru"?"Изменить":"Change"}
                  </button>
                  {myLogo&&<button className="btn btn-d btn-sm" onClick={()=>setPartners(ps=>ps.map(x=>x.id===myPid?{...x,logoUrl:""}:x))}>{IC.trash}</button>}
                </div>
              )}
            </div>
          </div>
        )}
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
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:dept?.color}}>{dept?.name}</div>
                  <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
                    <button className="btn btn-g btn-sm" style={{padding:"3px 7px",fontSize:11}} title={t.edit}
                      onClick={e=>{e.stopPropagation();setDF({name:dept.name,icon:dept.icon,color:dept.color,branchId:dept.branchId||"",_editId:dept.id});setModal("dept");}}>✏️</button>
                    <button className="btn btn-d btn-sm" style={{padding:"3px 7px",fontSize:11}} title={t.delete}
                      onClick={e=>{e.stopPropagation();if(window.confirm(lang==="ru"?`Удалить отдел "${dept.name}"?`:`Delete department "${dept.name}"?`))deleteDept(dept.id);}}>×</button>
                  </div>
                </div>
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
            <button className="btn btn-g" onClick={()=>{setDF({...defD,branchId:"",_editId:null});setModal("dept");}}>{t.addDept}</button>
            <button className="btn btn-g" onClick={()=>{
              // Create standard departments if none exist
              const stdDepts = [
                {name:lang==="ru"?"HR / Кадры":"HR / Recruiting",         icon:"👥", color:"#a855f7"},
                {name:lang==="ru"?"Операционный":"Operations Manager",    icon:"⚙️", color:"#3b82f6"},
                {name:lang==="ru"?"Продажи":"Sales",                      icon:"💰", color:"#22c55e"},
                {name:lang==="ru"?"Маркетинг":"Marketing",                icon:"📣", color:"#f0a500"},
                {name:lang==="ru"?"SMM":"SMM",                            icon:"📱", color:"#ec4899"},
                {name:lang==="ru"?"Финансы":"Finance",                    icon:"📊", color:"#06b6d4"},
                {name:lang==="ru"?"Супервайзеры":"Supervisors",           icon:"🎯", color:"#ef4444"},
                {name:lang==="ru"?"Представители":"Representatives",      icon:"🤝", color:"#84cc16"},
              ];
              const pid2 = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
              const existing2 = partners.find(p=>p.id===pid2);
              const currentDepts = existing2?.departments||[];
              const toAdd = stdDepts.filter(s=>!currentDepts.some(d=>d.name===s.name));
              if (!toAdd.length) { alert(lang==="ru"?"Все стандартные отделы уже созданы":"All standard departments already exist"); return; }
              const newDepts = toAdd.map(d=>({...d,id:"d_"+Date.now()+Math.random().toString(36).slice(2)}));
              setPartners(ps=>ps.map(x=>x.id===pid2?{...x,departments:[...currentDepts,...newDepts]}:x));
            }} title={lang==="ru"?"Создать стандартные отделы":"Create standard departments"}>
              ✦ {lang==="ru"?"Стандартные отделы":"Standard depts"}
            </button>
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
    const pid  = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p    = getPartner(pid)||{tasks:[],employees:[],departments:[]};
    const allTasks = p?.tasks||[];
    const emps = p?.employees||[];
    const depts= p?.departments||[];

    // ── Dept filter for employee isolation ──
    const myDeptId = isEmp ? currentUser.deptId : null;

    // Employee sees only: tasks assigned to them OR tasks in their dept (if no assignee)
    const visibleTasks = isEmp
      ? allTasks.filter(tk =>
          tk.assigneeId === currentUser.id ||
          (!tk.assigneeId && tk.deptId === myDeptId) ||
          (tk.createdBy === currentUser.id)
        )
      : allTasks;

    // SA/Partner can filter by dept
    const [deptFilter, setDeptFilter] = useState("");
    const filteredTasks = (!isEmp && deptFilter)
      ? visibleTasks.filter(tk => tk.deptId === deptFilter || (!tk.deptId && !deptFilter))
      : visibleTasks;

    const canEdit = isSA||isPartner||isEmp;
    const canDelete = isSA||isPartner;
    const cols = [["todo",t.todo,"var(--mu)"],["in_progress",t.inProgressCol,"var(--acc)"],["done",t.doneCol,"var(--gr)"]];

    // Dept tabs for SA/Partner
    const deptTaskCounts = depts.map(d=>({...d, cnt: allTasks.filter(tk=>tk.deptId===d.id).length}));

    return (
      <>
        {/* Header row */}
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          {canEdit&&(
            <button className="btn btn-p" onClick={()=>{
              setTF({...defT,
                assigneeId: isEmp?currentUser.id:"",
                deptId: myDeptId||(deptFilter||"")
              });
              setModal("task");
            }}>{t.addTask}</button>
          )}

          {/* Dept filter tabs — only for SA/Partner */}
          {!isEmp&&depts.length>0&&(
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginLeft:"auto"}}>
              <button onClick={()=>setDeptFilter("")}
                style={{padding:"4px 10px",borderRadius:7,fontSize:11,cursor:"pointer",
                  border:`1px solid ${!deptFilter?"var(--acc)":"var(--bdr)"}`,
                  background:!deptFilter?"var(--acc)18":"transparent",
                  color:!deptFilter?"var(--acc)":"var(--mu)"}}>
                {lang==="ru"?"Все":"All"} <span style={{opacity:.7}}>({allTasks.length})</span>
              </button>
              {deptTaskCounts.filter(d=>d.cnt>0||true).map(d=>(
                <button key={d.id} onClick={()=>setDeptFilter(deptFilter===d.id?"":d.id)}
                  style={{padding:"4px 10px",borderRadius:7,fontSize:11,cursor:"pointer",
                    border:`1px solid ${deptFilter===d.id?d.color:"var(--bdr)"}`,
                    background:deptFilter===d.id?d.color+"18":"transparent",
                    color:deptFilter===d.id?d.color:"var(--mu)"}}>
                  {d.icon} {d.name} <span style={{opacity:.7}}>({d.cnt})</span>
                </button>
              ))}
            </div>
          )}

          {/* Employee sees their dept label */}
          {isEmp&&myDeptId&&(()=>{
            const myD = depts.find(d=>d.id===myDeptId);
            return myD ? (
              <span style={{marginLeft:"auto",fontSize:11,color:myD.color,padding:"4px 10px",borderRadius:7,
                background:myD.color+"15",border:`1px solid ${myD.color}30`}}>
                {myD.icon} {myD.name}
              </span>
            ) : null;
          })()}
        </div>

        {/* Kanban board */}
        <div className="task-cols">
          {cols.map(([col,label,color])=>{
            const colT = filteredTasks.filter(x=>x.status===col);
            return (
              <div key={col} className="task-col">
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,color,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  {label}
                  <span style={{marginLeft:"auto",background:"var(--s3)",color:"var(--mu)",fontSize:10,padding:"2px 7px",borderRadius:10}}>{colT.length}</span>
                </div>
                {colT.map(task=>{
                  const emp  = emps.find(e=>e.id===task.assigneeId);
                  const dept = depts.find(d=>d.id===task.deptId);
                  const isOwn = task.assigneeId===currentUser?.id || task.createdBy===currentUser?.id;
                  return (
                    <div key={task.id} className="task-item" style={{opacity: isEmp&&!isOwn?.7:1}}>
                      {/* Dept badge */}
                      {dept&&!isEmp&&(
                        <div style={{fontSize:9,color:dept.color,marginBottom:5,display:"flex",alignItems:"center",gap:3}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:dept.color,display:"inline-block"}}/>
                          {dept.name}
                        </div>
                      )}
                      <div style={{fontSize:13,fontWeight:500,marginBottom:6,lineHeight:1.4}}>{task.title}</div>
                      {task.description&&<div style={{fontSize:11,color:"var(--mu)",marginBottom:6,lineHeight:1.4}}>{task.description}</div>}
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7,alignItems:"center"}}>
                        {emp&&<div className="flex-c" style={{gap:4}}>
                          <Av name={emp.name} style={{width:18,height:18,fontSize:9}}/>
                          <span style={{fontSize:11,color:"var(--mu)"}}>{emp.name.split(" ")[0]}</span>
                        </div>}
                        <Bdg cls={task.priority==="high"?"b-rd":task.priority==="medium"?"b-yw":"b-gr"}>{t[task.priority]||task.priority}</Bdg>
                        {task.due&&<span style={{fontSize:10,color:"var(--mu)"}}>📅 {task.due}</span>}
                      </div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                        {col!=="todo"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"todo"})}>{t.back}</button>}
                        {col==="todo"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"in_progress"})}>{t.forward}</button>}
                        {col==="in_progress"&&<button className="btn btn-g btn-sm" onClick={()=>updateTask(pid,task.id,{status:"done"})}>{t.markDone}</button>}
                        {canDelete&&(
                          <button className="btn btn-d btn-sm" style={{marginLeft:"auto"}} title={lang==="ru"?"Удалить":"Delete"}
                            onClick={()=>setPartners(ps=>ps.map(x=>x.id===pid?{...x,tasks:(x.tasks||[]).filter(tk=>tk.id!==task.id)}:x))}>
                            {IC.trash}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {!colT.length&&(
                  <div style={{textAlign:"center",color:"var(--mu)",fontSize:12,padding:"18px 0"}}>
                    {t.noTasks}
                  </div>
                )}
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

  /* ── AUDIO MESSAGE PLAYER — works on iOS/Android ── */
  const AudioMsg = ({src, mimeType}) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    function toggle() {
      const a = audioRef.current;
      if (!a) return;
      if (playing) { a.pause(); setPlaying(false); }
      else {
        // On iOS, play must be triggered directly in user gesture handler
        a.play().then(()=>setPlaying(true)).catch(err=>{
          console.error("Audio play error:", err);
          setError(true);
        });
      }
    }

    function fmt(s) {
      if (!s||isNaN(s)) return "0:00";
      return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
    }

    return (
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",
        background:"var(--s3)",borderRadius:10,marginBottom:4,minWidth:180,maxWidth:220}}>
        <audio ref={audioRef} src={src} preload="metadata"
          onTimeUpdate={e=>setProgress(e.target.currentTime)}
          onLoadedMetadata={e=>setDuration(e.target.duration)}
          onEnded={()=>{setPlaying(false);setProgress(0);}}
          onError={()=>setError(true)}
          style={{display:"none"}}/>
        <button onClick={toggle}
          style={{width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",flexShrink:0,
            background:"var(--acc)",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {error ? "⚠" : playing ? "⏸" : "▶"}
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{height:3,borderRadius:2,background:"var(--bdr)",marginBottom:3,cursor:"pointer"}}
            onClick={e=>{
              const a=audioRef.current; if(!a||!duration) return;
              const rect=e.currentTarget.getBoundingClientRect();
              a.currentTime=(e.clientX-rect.left)/rect.width*duration;
            }}>
            <div style={{height:3,borderRadius:2,background:"var(--acc)",
              width:`${duration>0?Math.min(progress/duration*100,100):0}%`,transition:"width .1s"}}/>
          </div>
          <div style={{fontSize:9,color:"var(--mu)",display:"flex",justifyContent:"space-between"}}>
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
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
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        // Pick MIME type supported by this browser (iOS needs mp4/aac, Android/Chrome supports webm)
        const mimeType = [
          "audio/mp4",
          "audio/aac",
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/ogg",
        ].find(t => MediaRecorder.isTypeSupported(t)) || "";
        const mr = new MediaRecorder(stream, mimeType ? {mimeType} : {});
        chunks.current = [];
        mr.ondataavailable = e => { if(e.data.size>0) chunks.current.push(e.data); };
        mr.onstop = () => {
          const blob = new Blob(chunks.current, {type: mr.mimeType||"audio/webm"});
          // Convert to base64 so it survives Firebase/state and works on mobile playback
          const reader = new FileReader();
          reader.onload = ev => {
            pushMsg({type:"audio", content:ev.target.result, mimeType:blob.type});
          };
          reader.readAsDataURL(blob);
          stream.getTracks().forEach(t=>t.stop());
        };
        mr.start(250); // collect data every 250ms for reliability
        setMrec(mr); setRec(true);
      } catch(err) {
        alert(lang==="ru"
          ? "Нет доступа к микрофону. Разрешите доступ в настройках браузера."
          : "No microphone access. Please allow it in browser settings.");
        console.error(err);
      }
    }

    function stopRec() { mrec?.stop(); setRec(false); setMrec(null); }

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
          {channels.map(ch=>{
            const chKey = pid+"_"+ch.id;
            const chUnread = countUnread(chKey);
            return (
              <div key={ch.id}
                className={`chat-ch ${chatChannel===ch.id?"act":""}`}
                onClick={()=>{
                  setChatChannel(ch.id);
                  markRead(chKey, chatMsgs[chKey]||[]);
                  setShowChSb(false);
                }}>
                <span style={{flexShrink:0}}>{ch.icon}</span>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12,flex:1}}>{ch.label}</span>
                {chUnread>0&&(
                  <span style={{flexShrink:0,minWidth:18,height:18,background:"#ef4444",color:"#fff",
                    borderRadius:9,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",
                    justifyContent:"center",padding:"0 4px",lineHeight:1}}>
                    {chUnread>99?"99+":chUnread}
                  </span>
                )}
              </div>
            );
          })}
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
                      <AudioMsg src={m.content} mimeType={m.mimeType}/>
                    )}
                    {m.type==="file"&&(
                      <a href={m.content} download={m.fileName}
                        style={{display:"flex",alignItems:"center",gap:6,background:"var(--s3)",borderRadius:7,padding:"6px 10px",fontSize:12,color:"var(--bl)",textDecoration:"none",marginBottom:4}}>
                        📎 {m.fileName}
                      </a>
                    )}
                    {m.text&&<div style={{fontSize:13,color:"var(--tx)",lineHeight:1.5}}>{m.text}</div>}
                    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6,marginTop:3}}>
                      <span style={{fontSize:10,color:"var(--mu)"}}>{m.ts}</span>
                      {isSA&&<button onClick={()=>setChatMsgs(prev=>({...prev,[key]:(prev[key]||[]).filter(x=>x.id!==m.id)}))}
                        style={{background:"none",border:"none",color:"var(--mu)",cursor:"pointer",padding:"0 2px",fontSize:12,opacity:.5,lineHeight:1}}
                        title="Delete message">×</button>}
                    </div>
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
              {/* Voice — click to start/stop */}
              <button title={rec?(lang==="ru"?"Остановить запись":"Stop recording"):(lang==="ru"?"Записать голосовое":"Record voice message")}
                className="btn btn-g btn-sm"
                style={{padding:"7px 9px",flexShrink:0,position:"relative",
                  background:rec?"#ef444415":"",
                  border:rec?"1px solid #ef444440":"1px solid var(--bdr)",
                  color:rec?"var(--rd)":"var(--mu)"}}
                onClick={rec ? stopRec : startRec}>
                {IC.mic}
                {rec&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,background:"var(--rd)",borderRadius:"50%",animation:"pulse 1s infinite"}}/>}
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



  /* ══════════════════════════════════════════════════════
     CRM — КОНТАКТЫ / ВОРОНКА / АВТОМАТИЗАЦИИ
  ══════════════════════════════════════════════════════ */
  const CRM = () => {
    const pid      = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p        = getPartner(pid)||{};
    const contacts = p?.contacts||[];
    const crmTags  = p?.crmTags||[];
    const automations = p?.automations||[];
    const canEdit  = isSA||isPartner||isEmp;

    const STAGES = [
      {id:"lead",       label:t.stageLead,        color:"var(--mu)"},
      {id:"contact",    label:t.stageContact,     color:"var(--bl)"},
      {id:"negotiation",label:t.stageNegotiation, color:"var(--acc)"},
      {id:"client",     label:t.stageClient,      color:"var(--gr)"},
      {id:"lost",       label:t.stageLost,        color:"var(--rd)"},
    ];

    // HR Pipeline — fixed English keys, bilingual labels
    const HR_PIPELINE = {
      cleaner: [
        {tag:"Cleaner-Candidate",  label:lang==="ru"?"Клинер-кандидат":"Cleaner-Candidate",   color:"#94a3b8", dept:"hr",  hired:false},
        {tag:"Cleaner-Trainee",    label:lang==="ru"?"Клинер-ученик":"Cleaner-Trainee",        color:"#f0a500", dept:"hr",  hired:false},
        {tag:"Cleaner-Intern",     label:lang==="ru"?"Клинер-стажер":"Cleaner-Intern",         color:"#3b82f6", dept:"ops", hired:false},
        {tag:"Cleaner-Active",     label:lang==="ru"?"Клинер-активный":"Cleaner-Active",       color:"#22c55e", dept:"ops", hired:true},
      ],
      manager: [
        {tag:"Manager-Candidate",  label:lang==="ru"?"Менеджер-кандидат":"Manager-Candidate", color:"#94a3b8", dept:"hr",  hired:false},
        {tag:"Manager-Trainee",    label:lang==="ru"?"Менеджер-ученик":"Manager-Trainee",      color:"#f0a500", dept:"hr",  hired:false},
        {tag:"Manager-Intern",     label:lang==="ru"?"Менеджер-стажер":"Manager-Intern",       color:"#3b82f6", dept:"ops", hired:false},
        {tag:"Manager-Active",     label:lang==="ru"?"Менеджер-активный":"Manager-Active",     color:"#22c55e", dept:"ops", hired:true},
      ],
    };
    const ALL_HR_TAGS = [...HR_PIPELINE.cleaner, ...HR_PIPELINE.manager];
    const HIRED_TAGS  = ALL_HR_TAGS.filter(t=>t.hired).map(t=>t.tag);

    // Check if contact is "hired" (semi-transparent in HR view)
    function isHired(c) {
      return (c.tags||[]).some(tag=>HIRED_TAGS.includes(tag));
    }

    // Get HR pipeline stage info for a contact
    function getHRStage(c) {
      const tags = c.tags||[];
      // Find the most advanced HR tag
      for (let i=ALL_HR_TAGS.length-1; i>=0; i--) {
        if (tags.includes(ALL_HR_TAGS[i].tag)) return ALL_HR_TAGS[i];
      }
      return null;
    }

    const TAG_COLORS = ["#f0a500","#3b82f6","#22c55e","#ef4444","#a855f7","#ec4899","#06b6d4","#f97316","#84cc16","#14b8a6"];

    const [cTab,     setCTab]     = useState("contacts");
    const [search,   setSearch]   = useState("");
    const [tagFilter,setTagFilter]= useState("");
    const [openId,   setOpenId]   = useState(null);
    const [cF, setCF] = useState({name:"",phone:"",email:"",stage:"lead",tags:[],notes:[]});
    const [cModal,   setCModal]   = useState(false);
    const [noteText, setNoteText] = useState("");
    const [tagMgr,   setTagMgr]   = useState(false);
    const [newTag,   setNewTag]   = useState({name:"",color:"#f0a500"});
    const [aF, setAF] = useState({triggerTag:"",delayHours:"1",msgTemplate:"",name:"",routeToDept:"",routeType:"copy"});
    const [aModal,   setAModal]   = useState(false);
    const [smsModal, setSmsModal] = useState(null); // contactId
    const [smsText,  setSmsText]  = useState("");
    const [smsSending,setSmsSending] = useState(false);
    const [smsLog,   setSmsLog]   = useState({}); // {contactId: [{text,ts,dir}]}

    // ── TWILIO VOICE ──
    const [twilioDevice, setTwilioDevice]   = useState(null);
    const [callState,    setCallState]      = useState("idle"); // idle|connecting|active|incoming
    const [activeCall,   setActiveCall]     = useState(null);
    const [callContact,  setCallContact]    = useState(null);
    const [callDuration, setCallDuration]   = useState(0);
    const [sdkReady,     setSdkReady]       = useState(false);
    const callTimerRef = useRef(null);

    useEffect(()=>{
      if (window.Twilio?.Device) { setSdkReady(true); return; }
      const script = document.createElement("script");
      script.src = "https://sdk.twilio.com/js/client/releases/2.7.2/twilio.js";
      script.async = true;
      script.onload = () => { setSdkReady(true); console.log("Twilio Voice SDK loaded"); };
      document.head.appendChild(script);
      return ()=>{};
    },[]);

    async function initTwilioDevice() {
      if (twilioDevice) return twilioDevice;
      if (!window.Twilio?.Device) {
        console.log("Twilio SDK not ready yet");
        return null;
      }
      try {
        const r = await fetch("/api/voice-token", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({identity: currentUser?.email?.replace(/[^a-zA-Z0-9]/g,"_")||"nova_user"})
        });
        const {token} = await r.json();
        const device = new window.Twilio.Device(token, {logLevel:1, codecPreferences:["opus","pcmu"]});
        device.on("incoming", call => {
          setCallState("incoming");
          setActiveCall(call);
        });
        device.on("error", err => {
          console.error("Twilio Device error:", err);
          setCallState("idle");
        });
        await device.register();
        setTwilioDevice(device);
        return device;
      } catch(e) {
        console.error("Init device error:", e);
        alert(lang==="ru"?`Ошибка инициализации: ${e.message}`:`Init error: ${e.message}`);
        return null;
      }
    }

    async function startCall(contact) {
      const device = await initTwilioDevice();
      if (!device) return;
      if (!contact.phone) return;
      setCallContact(contact);
      setCallState("connecting");
      try {
        const call = await device.connect({
          params: { To: contact.phone }
        });
        setActiveCall(call);
        call.on("accept", ()=>{
          setCallState("active");
          callTimerRef.current = setInterval(()=>setCallDuration(d=>d+1), 1000);
        });
        call.on("disconnect", ()=>{
          setCallState("idle");
          setActiveCall(null);
          clearInterval(callTimerRef.current);
          const dur = callDuration;
          setCallDuration(0);
          addHistoryEntry(contact.id, `📞 ${lang==="ru"?"Звонок":"Call"} ${formatDur(dur)}`);
        });
        call.on("error", err=>{
          setCallState("idle");
          setActiveCall(null);
          console.error("Call error:", err);
        });
      } catch(e) {
        setCallState("idle");
        console.error("Call failed:", e);
        alert(lang==="ru"?`Не удалось позвонить: ${e.message}`:`Call failed: ${e.message}`);
      }
    }

    function hangUp() {
      if (activeCall) activeCall.disconnect();
      setCallState("idle");
      setActiveCall(null);
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }

    function formatDur(sec) {
      const m = Math.floor(sec/60), s = sec%60;
      return `${m}:${s.toString().padStart(2,"0")}`;
    }

    async function sendSMS(contactId, phone, text) {
      if (!phone||!text.trim()) return;
      setSmsSending(true);
      try {
        const r = await fetch("/api/send-sms", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({to: phone, message: text.trim()})
        });
        const d = await r.json();
        if (d.success) {
          const entry = {id:"sms_"+Date.now(), text:text.trim(), ts:new Date().toLocaleString(), dir:"out", sid:d.sid};
          setSmsLog(prev=>({...prev,[contactId]:[...(prev[contactId]||[]),entry]}));
          addHistoryEntry(contactId, `📤 SMS отправлено: ${text.trim()}`);
          setSmsText("");
          setSmsModal(null);
        } else {
          alert(lang==="ru"?`Ошибка: ${d.error}`:`Error: ${d.error}`);
        }
      } catch(e) {
        alert(lang==="ru"?"Ошибка соединения":"Connection error");
      }
      setSmsSending(false);
    }

    // ── CRUD contacts ──
    function saveContact() {
      if (!cF.name.trim()) return;
      const item = {...cF, id:"c_"+Date.now(), createdAt:new Date().toISOString().split("T")[0], history:[], deptIds: cF.deptId?[cF.deptId]:[]};
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:[...(x.contacts||[]),item]}:x));
      setCF({name:"",phone:"",email:"",stage:"lead",tags:[],notes:[]});
      setCModal(false);
    }

    function deleteContact(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:(x.contacts||[]).filter(c=>c.id!==id)}:x));
      if (openId===id) setOpenId(null);
    }

    function updateContact(id, patch) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:(x.contacts||[]).map(c=>c.id===id?{...c,...patch}:c)}:x));
    }

    function moveStage(id, stage) { updateContact(id,{stage}); }

    function addNote(contactId) {
      if (!noteText.trim()) return;
      const note = {id:"n_"+Date.now(), text:noteText.trim(), ts:new Date().toLocaleString(), author:currentUser.name||currentUser.companyName||"SA"};
      const c = contacts.find(x=>x.id===contactId);
      updateContact(contactId, {history:[...(c?.history||[]),note]});
      setNoteText("");
    }

    function toggleTag(contactId, tag) {
      const c = contacts.find(x=>x.id===contactId);
      const tags = c?.tags||[];
      const newTags = tags.includes(tag) ? tags.filter(t=>t!==tag) : [...tags,tag];
      updateContact(contactId, {tags:newTags});
      // trigger automations
      if (!tags.includes(tag)) {
        const triggered = automations.filter(a=>a.triggerTag===tag&&a.active);
        triggered.forEach(a=>{
          // SMS automation
          if (a.msgTemplate) {
            const delay = parseInt(a.delayHours||0)*3600*1000;
            setTimeout(()=>{
              const msg = a.msgTemplate.replace("{name}", c?.name||"").replace("{phone}", c?.phone||"");
              addHistoryEntry(contactId, `🤖 Auto SMS: ${msg}`);
            }, delay);
          }
          // Department routing automation
          if (a.routeToDept) {
            const dept = p?.departments?.find(d=>d.id===a.routeToDept);
            if (a.routeType==="move") {
              updateContact(contactId, {deptId: a.routeToDept});
              addHistoryEntry(contactId, `🔀 ${lang==="ru"?"Передано в отдел":"Routed to dept"}: ${dept?.name||a.routeToDept}`);
            } else {
              // copy — add dept to deptIds array
              const c2 = contacts.find(x=>x.id===contactId);
              const deptIds = c2?.deptIds||[];
              if (!deptIds.includes(a.routeToDept)) {
                updateContact(contactId, {deptIds:[...deptIds, a.routeToDept]});
                addHistoryEntry(contactId, `📋 ${lang==="ru"?"Добавлен в отдел":"Added to dept"}: ${dept?.name||a.routeToDept}`);
              }
            }
          }
        });
      }
    }

    function addHistoryEntry(contactId, text) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:(x.contacts||[]).map(c=>{
        if (c.id!==contactId) return c;
        const note = {id:"n_"+Date.now(), text, ts:new Date().toLocaleString(), author:"System"};
        return {...c, history:[...(c.history||[]),note]};
      })}:x));
    }

    // ── Tag management ──
    function saveTag() {
      if (!newTag.name.trim()) return;
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,crmTags:[...(x.crmTags||[]),{...newTag,id:"tag_"+Date.now()}]}:x));
      setNewTag({name:"",color:"#f0a500"});
    }
    function deleteTag(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,crmTags:(x.crmTags||[]).filter(t=>t.id!==id)}:x));
    }

    // ── Automations ──
    function saveAutomation() {
      if (!aF.triggerTag||!aF.msgTemplate.trim()) return;
      const item = {...aF, id:"auto_"+Date.now(), active:true, createdAt:new Date().toISOString().split("T")[0], sentCount:0};
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,automations:[...(x.automations||[]),item]}:x));
      setAF({triggerTag:"",delayHours:"1",msgTemplate:"",name:""});
      setAModal(false);
    }
    function toggleAuto(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,automations:(x.automations||[]).map(a=>a.id===id?{...a,active:!a.active}:a)}:x));
    }
    function deleteAuto(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,automations:(x.automations||[]).filter(a=>a.id!==id)}:x));
    }

    // ── Filtered contacts ──
    // Dept-based visibility
    const myDeptId = isEmp ? currentUser.deptId : null;
    const myDept   = myDeptId ? p?.departments?.find(d=>d.id===myDeptId) : null;
    const isHR     = myDept?.name?.toLowerCase().includes("hr") || myDept?.name?.toLowerCase().includes("кадр") || myDept?.name?.toLowerCase().includes("персонал");
    const canSeeAll= isSA || isPartner || isHR;

    const deptContacts = canSeeAll ? contacts : contacts.filter(c=>{
      if (c.deptId===myDeptId) return true;
      if ((c.deptIds||[]).includes(myDeptId)) return true;
      return false;
    });

    const filtered = deptContacts.filter(c=>{
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone||"").includes(search) || (c.email||"").toLowerCase().includes(search.toLowerCase());
      const matchTag    = !tagFilter || (c.tags||[]).includes(tagFilter);
      return matchSearch && matchTag;
    });

    // ── Open contact detail ──
    const openContact = contacts.find(c=>c.id===openId);

    if (openContact) {
      const stage = STAGES.find(s=>s.id===openContact.stage)||STAGES[0];
      // Merge SMS log + notes into unified chat timeline
      const smsHistory = (smsLog[openContact.id]||[]).map(m=>({...m, type:"sms"}));
      const noteHistory = (openContact.history||[]).map(m=>({...m, type:"note"}));
      const allMessages = [...smsHistory, ...noteHistory].sort((a,b)=>new Date(a.ts)-new Date(b.ts));

      return (
        <div style={{display:"flex",gap:14,maxWidth:1000,margin:"0 auto",height:"calc(100vh - 160px)",minHeight:500}}>

          {/* LEFT: Contact info panel */}
          <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",color:"var(--mu)",fontSize:12,marginBottom:4}}
              onClick={()=>setOpenId(null)}>← {lang==="ru"?"Назад":"Back"}
            </div>
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:14,display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center"}}>
              <Av name={openContact.name} color={stage.color} style={{width:48,height:48,fontSize:18}}/>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>{openContact.name}</div>
              {openContact.phone&&<div style={{fontSize:12,color:"var(--mu)"}}>{openContact.phone}</div>}
              {openContact.email&&<div style={{fontSize:11,color:"var(--mu2)",wordBreak:"break-all"}}>{openContact.email}</div>}
              {/* Dept badges */}
              {((openContact.deptIds||[]).length>0||(openContact.deptId))&&(
                <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>
                  {[...(openContact.deptIds||[]), ...(openContact.deptId&&!(openContact.deptIds||[]).includes(openContact.deptId)?[openContact.deptId]:[])].map(did=>{
                    const dept=p?.departments?.find(d=>d.id===did);
                    return dept?<span key={did} style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"var(--bl)15",color:"var(--bl)",border:"1px solid var(--bl)25"}}>{dept.name}</span>:null;
                  })}
                </div>
              )}
              <div style={{fontSize:10,color:"var(--mu2)"}}>📅 {openContact.createdAt}</div>
            </div>

            {/* Stage */}
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:12}}>
              <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t.crmStage}</div>
              {STAGES.map(s=>(
                <button key={s.id} onClick={()=>moveStage(openContact.id,s.id)}
                  style={{width:"100%",padding:"5px 10px",borderRadius:7,marginBottom:3,border:`1px solid ${s.id===openContact.stage?s.color:"transparent"}`,
                    background:s.id===openContact.stage?s.color+"18":"transparent",
                    color:s.id===openContact.stage?s.color:"var(--mu)",
                    fontSize:11,fontWeight:s.id===openContact.stage?700:400,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:12}}>
              <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t.crmTags}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {(openContact.tags||[]).map(tag=>{
                  const td=crmTags.find(t=>t.name===tag);
                  return <span key={tag} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:(td?.color||"var(--acc)")+"20",color:td?.color||"var(--acc)",cursor:"pointer",border:`1px solid ${td?.color||"var(--acc)"}30`}}
                    onClick={()=>toggleTag(openContact.id,tag)}>{tag} ×</span>;
                })}
              </div>
              {/* HR Pipeline quick-set */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:9,color:"var(--mu2)",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>HR Pipeline</div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {ALL_HR_TAGS.map(ht=>{
                    const active=(openContact.tags||[]).includes(ht.tag);
                    return (
                      <button key={ht.tag} onClick={()=>toggleTag(openContact.id,ht.tag)}
                        style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${active?ht.color:"var(--bdr)"}`,
                          background:active?ht.color+"22":"transparent",
                          color:active?ht.color:"var(--mu2)",fontSize:10,cursor:"pointer",
                          textAlign:"left",display:"flex",alignItems:"center",gap:5,
                          fontWeight:active?700:400}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:ht.color,flexShrink:0,opacity:active?1:.4}}/>
                        {ht.label||ht.tag}
                        {ht.hired&&<span style={{marginLeft:"auto",fontSize:8,background:"#22c55e20",color:"#22c55e",padding:"1px 4px",borderRadius:3}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <select style={{width:"100%",fontSize:11,padding:"4px 6px",borderRadius:6,background:"var(--s2)",border:"1px solid var(--bdr)",color:"var(--mu)",cursor:"pointer"}}
                value="" onChange={e=>{if(e.target.value)toggleTag(openContact.id,e.target.value);}}>
                <option value="">+ {lang==="ru"?"добавить тег":"add tag"}</option>
                {crmTags.filter(t=>!(openContact.tags||[]).includes(t.name)).map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            {/* Delete */}
            {(isSA||isPartner)&&(
              <button className="btn btn-d btn-sm" onClick={()=>deleteContact(openContact.id)}>{IC.trash} {t.delete}</button>
            )}
          </div>

          {/* RIGHT: Chat window */}
          <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:14,overflow:"hidden"}}>

            {/* Chat header */}
            <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <Av name={openContact.name} color={stage.color}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{openContact.name}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>{openContact.phone||openContact.email||""}</div>
              </div>
              {openContact.phone&&(
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {callState==="idle"&&(
                    <button className="btn btn-p btn-sm" style={{gap:5,display:"flex",alignItems:"center",opacity:sdkReady?1:0.5}}
                      disabled={!sdkReady}
                      title={!sdkReady?(lang==="ru"?"Загрузка...":"Loading..."):undefined}
                      onClick={()=>startCall(openContact)}>
                      {IC.phone} {sdkReady?(lang==="ru"?"Позвонить":"Call"):(lang==="ru"?"Загрузка...":"Loading...")}
                    </button>
                  )}
                  {(callState==="connecting"||callState==="active")&&callContact?.id===openContact.id&&(
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,background:"var(--gr)15",border:"1px solid var(--gr)30",borderRadius:8,padding:"5px 10px",fontSize:12,color:"var(--gr)"}}>
                        <span style={{width:7,height:7,borderRadius:"50%",background:"var(--gr)",animation:"pulse 1s infinite"}}/>
                        {callState==="connecting"?(lang==="ru"?"Соединение...":"Connecting..."):`${lang==="ru"?"Звонок":"Call"} ${formatDur(callDuration)}`}
                      </div>
                      <button className="btn btn-d btn-sm" onClick={hangUp} style={{background:"var(--rd)20",color:"var(--rd)",border:"1px solid var(--rd)30"}}>
                        📵 {lang==="ru"?"Завершить":"Hang up"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages area */}
            <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
              {allMessages.length===0&&(
                <div style={{textAlign:"center",color:"var(--mu)",marginTop:60}}>
                  <div style={{fontSize:32,marginBottom:8}}>💬</div>
                  <div style={{fontSize:13}}>{lang==="ru"?"Начните общение — отправьте SMS или добавьте заметку":"Start the conversation — send an SMS or add a note"}</div>
                </div>
              )}
              {allMessages.map(m=>{
                const isOut = m.dir==="out"||m.type==="note";
                const isSmsOut = m.type==="sms"&&m.dir==="out";
                const isSmsIn  = m.type==="sms"&&m.dir==="in";
                const isNote   = m.type==="note";
                return (
                  <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isSmsIn?"flex-start":"flex-end"}}>
                    <div style={{
                      maxWidth:"72%",padding:"9px 13px",borderRadius:isSmsIn?"4px 14px 14px 14px":"14px 4px 14px 14px",
                      background: isSmsIn?"var(--s2)": isSmsOut?"var(--acc)22": "var(--bl)12",
                      border:`1px solid ${isSmsIn?"var(--bdr)":isSmsOut?"var(--acc)35":"var(--bl)25"}`,
                      fontSize:13,lineHeight:1.5,color:"var(--tx)"
                    }}>
                      {isNote&&<div style={{fontSize:9,color:"var(--mu)",marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>📝 {lang==="ru"?"Заметка":"Note"}</div>}
                      {isSmsOut&&<div style={{fontSize:9,color:"var(--acc)",marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>📤 SMS</div>}
                      {isSmsIn&&<div style={{fontSize:9,color:"var(--mu)",marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>📥 SMS</div>}
                      <div>{m.text}</div>
                    </div>
                    <div style={{fontSize:9,color:"var(--mu2)",marginTop:2,paddingLeft:4,paddingRight:4}}>{m.author&&m.type==="note"?`${m.author} · `:""}{m.ts}</div>
                  </div>
                );
              })}
            </div>

            {/* Input area */}
            <div style={{borderTop:"1px solid var(--bdr)",padding:12,flexShrink:0}}>
              {/* Quick templates */}
              <div style={{display:"flex",gap:5,marginBottom:8,overflowX:"auto",paddingBottom:2}}>
                {[
                  lang==="ru"?"Спасибо за интерес!":"Thanks for your interest!",
                  lang==="ru"?"Уборка запланирована ✓":"Cleaning scheduled ✓",
                  lang==="ru"?"Можем ли мы помочь?":"Can we help you?",
                  lang==="ru"?"Свяжемся скоро!":"We'll be in touch!",
                ].map((tmpl,i)=>(
                  <button key={i} className="btn btn-g btn-sm" style={{fontSize:10,padding:"2px 8px",whiteSpace:"nowrap",flexShrink:0}}
                    onClick={()=>setSmsText(tmpl)}>{tmpl}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <textarea className="inp" value={smsText} onChange={e=>setSmsText(e.target.value)}
                  style={{flex:1,minHeight:40,maxHeight:100,resize:"none",padding:"8px 12px"}}
                  placeholder={lang==="ru"?"SMS или заметка... (Enter = заметка, Shift+Enter = строка)":"SMS or note... (Enter = note, Shift+Enter = newline)"}
                  onKeyDown={e=>{
                    if(e.key==="Enter"&&!e.shiftKey){
                      e.preventDefault();
                      if(smsText.trim()) addNote(openContact.id); // Enter adds note
                    }
                  }}/>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {openContact.phone&&(
                    <button className="btn btn-p btn-sm" style={{padding:"7px 10px"}} disabled={smsSending||!smsText.trim()}
                      title="Send SMS" onClick={()=>sendSMS(openContact.id,openContact.phone,smsText)}>
                      {smsSending?"...":IC.sms}
                    </button>
                  )}
                  <button className="btn btn-g btn-sm" style={{padding:"7px 10px"}} title={lang==="ru"?"Добавить заметку":"Add note"}
                    disabled={!smsText.trim()} onClick={()=>addNote(openContact.id)}>
                    {IC.send}
                  </button>
                </div>
              </div>
              <div style={{fontSize:10,color:"var(--mu2)",marginTop:4}}>
                💬 = SMS · ➤ = {lang==="ru"?"заметка":"note"} · {smsText.length}/160
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Tab bar */}
        <div style={{display:"flex",gap:6,marginBottom:18,borderBottom:"1px solid var(--bdr)",paddingBottom:10,flexWrap:"wrap"}}>
          {[{id:"contacts",label:t.crmContacts},{id:"pipeline",label:t.crmPipeline},{id:"tags",label:t.crmTags},{id:"auto",label:t.automations}].map(tb=>(
            <button key={tb.id} className={`btn ${cTab===tb.id?"btn-p":"btn-g"}`} style={{fontSize:12}} onClick={()=>setCTab(tb.id)}>{tb.label}</button>
          ))}
          {cTab==="contacts"&&(
            <button className="btn btn-p" style={{fontSize:12,marginLeft:"auto"}} onClick={()=>setCModal(true)}>{IC.plus} {t.addContact}</button>
          )}
          {cTab==="tags"&&(
            <button className="btn btn-p" style={{fontSize:12,marginLeft:"auto"}} onClick={()=>setTagMgr(s=>!s)}>{IC.tag} {t.manageTagsTitle}</button>
          )}
          {cTab==="auto"&&(
            <button className="btn btn-p" style={{fontSize:12,marginLeft:"auto"}} onClick={()=>setAModal(true)}>{IC.plus} {t.addAutomation}</button>
          )}
        </div>

        {/* ── TAB: CONTACTS ── */}
        {cTab==="contacts"&&(
          <>
            {/* Search + filter */}
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <input className="inp" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={t.searchContacts} style={{flex:1,minWidth:200}}/>
              <select className="inp" value={tagFilter} onChange={e=>setTagFilter(e.target.value)} style={{width:160}}>
                <option value="">{lang==="ru"?"Все теги":"All tags"}</option>
                {crmTags.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            {/* HR Pipeline stats */}
            {canSeeAll&&(
              <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:"10px 14px",marginBottom:12}}>
                <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>HR Pipeline</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {ALL_HR_TAGS.map(ht=>{
                    const cnt=contacts.filter(c=>(c.tags||[]).includes(ht.tag)).length;
                    return (
                      <div key={ht.tag} onClick={()=>setTagFilter(ht.tag===tagFilter?"":ht.tag)}
                        style={{padding:"5px 10px",borderRadius:7,cursor:"pointer",
                          border:`1px solid ${ht.tag===tagFilter?ht.color:"var(--bdr)"}`,
                          background:ht.tag===tagFilter?ht.color+"18":"var(--s2)",
                          transition:"all .15s"}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:ht.color}}>{cnt}</div>
                        <div style={{fontSize:9,color:ht.tag===tagFilter?ht.color:"var(--mu)",whiteSpace:"nowrap"}}>{ht.label||ht.tag}</div>
                      </div>
                    );
                  })}
                  <div style={{padding:"5px 10px",borderRadius:7,border:"1px solid #22c55e30",background:"#22c55e08",marginLeft:"auto"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#22c55e"}}>{contacts.filter(c=>isHired(c)).length}</div>
                    <div style={{fontSize:9,color:"#22c55e"}}>{lang==="ru"?"✓ Нанято":"✓ Hired"}</div>
                  </div>
                </div>
              </div>
            )}
            {/* Funnel stages row */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {STAGES.map(s=>{
                const cnt = filtered.filter(c=>c.stage===s.id).length;
                return (
                  <div key={s.id} style={{background:"var(--s1)",border:`1px solid ${cnt>0?s.color+"30":"var(--bdr)"}`,borderRadius:9,padding:"7px 14px",cursor:"pointer",transition:"all .15s"}}
                    onClick={()=>setSearch("")}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:s.color}}>{cnt}</div>
                    <div style={{fontSize:10,color:"var(--mu)"}}>{s.label}</div>
                  </div>
                );
              })}
            </div>
            {/* Contact cards */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map(c=>{
                const stage = STAGES.find(s=>s.id===c.stage)||STAGES[0];
                return (
                  <div key={c.id} style={{background:isHired(c)&&canSeeAll?"var(--s1)":"var(--s1)",
                    border:`1px solid ${isHired(c)&&canSeeAll?"#22c55e30":"var(--bdr)"}`,
                    borderRadius:11,padding:"12px 16px",opacity:isHired(c)&&canSeeAll?.75:1,
                    display:"flex",alignItems:"center",gap:14,cursor:"pointer",
                    transition:"all .15s",position:"relative",overflow:"hidden"}}
                    onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.borderColor=isHired(c)&&canSeeAll?"#22c55e50":"var(--bdr2)"}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity=isHired(c)&&canSeeAll?".75":"1";e.currentTarget.style.borderColor=isHired(c)&&canSeeAll?"#22c55e30":"var(--bdr)"}}>
                    <div onClick={()=>setOpenId(c.id)} style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                      <Av name={c.name} color={stage.color}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:14}}>{c.name}</div>
                        <div style={{fontSize:11,color:"var(--mu)",display:"flex",gap:10,flexWrap:"wrap"}}>
                          {c.phone&&<span>{c.phone}</span>}
                          {c.email&&<span>{c.email}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end",alignItems:"center"}}>
                      {(c.tags||[]).slice(0,3).map(tag=>{
                        const td=crmTags.find(t=>t.name===tag);
                        return <span key={tag} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:(td?.color||"var(--acc)")+"20",color:td?.color||"var(--acc)"}}>{tag}</span>;
                      })}
                      {(c.tags||[]).length>3&&<span style={{fontSize:10,color:"var(--mu)"}}>+{(c.tags||[]).length-3}</span>}
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:stage.color+"18",color:stage.color,border:`1px solid ${stage.color}30`,whiteSpace:"nowrap"}}>{stage.label}</span>
                      {c.phone&&<a href={`tel:${c.phone}`} className="btn btn-g btn-sm" style={{padding:"4px 7px"}} onClick={e=>e.stopPropagation()}>{IC.phone}</a>}
                      {c.phone&&<button className="btn btn-bl btn-sm" style={{padding:"4px 7px"}} onClick={e=>{e.stopPropagation();setSmsModal(c.id);setSmsText("");}}>{IC.sms}</button>}
                    </div>
                  </div>
                );
              })}
              {!filtered.length&&(
                <div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
                  <div style={{marginBottom:8,opacity:.4,display:"flex",justifyContent:"center"}}>{IC.crm}</div>
                  <div>{contacts.length?lang==="ru"?"Нет совпадений":"No matches":t.noContacts}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB: PIPELINE (Kanban) ── */}
        {cTab==="pipeline"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,overflowX:"auto"}}>
            {STAGES.map(stage=>{
              const stageContacts = contacts.filter(c=>c.stage===stage.id);
              return (
                <div key={stage.id} style={{background:"var(--s1)",border:`1px solid ${stage.color}20`,borderTop:`3px solid ${stage.color}`,borderRadius:10,padding:12,minHeight:300}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:stage.color}}>{stage.label}</span>
                    <span style={{marginLeft:"auto",background:stage.color+"18",color:stage.color,fontSize:10,padding:"2px 7px",borderRadius:10}}>{stageContacts.length}</span>
                  </div>
                  {stageContacts.map(c=>(
                    <div key={c.id} style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:8,padding:"9px 10px",marginBottom:7,cursor:"pointer"}}
                      onClick={()=>setOpenId(c.id)}>
                      <div style={{fontWeight:600,fontSize:12,marginBottom:3}}>{c.name}</div>
                      <div style={{fontSize:10,color:"var(--mu)",marginBottom:5}}>{c.phone||c.email||""}</div>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {(c.tags||[]).slice(0,2).map(tag=>{
                          const td=crmTags.find(t=>t.name===tag);
                          return <span key={tag} style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:(td?.color||"var(--acc)")+"20",color:td?.color||"var(--acc)"}}>{tag}</span>;
                        })}
                      </div>
                    </div>
                  ))}
                  {!stageContacts.length&&<div style={{textAlign:"center",color:"var(--mu2)",fontSize:11,padding:"16px 0"}}>{lang==="ru"?"Пусто":"Empty"}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: TAGS ── */}
        {cTab==="tags"&&(
          <>
            {tagMgr&&(
              <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12}}>{t.manageTagsTitle}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                  {crmTags.map(tag=>(
                    <div key={tag.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",borderRadius:7,background:tag.color+"18",border:`1px solid ${tag.color}30`}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:tag.color,flexShrink:0}}/>
                      <span style={{fontSize:12,color:tag.color,fontWeight:600}}>{tag.name}</span>
                      <span style={{fontSize:10,color:"var(--mu)",marginLeft:2}}>{contacts.filter(c=>(c.tags||[]).includes(tag.name)).length}</span>
                      <button onClick={()=>deleteTag(tag.id)} style={{background:"none",border:"none",color:"var(--mu)",cursor:"pointer",fontSize:13,padding:0,lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <input className="inp" value={newTag.name} onChange={e=>setNewTag(f=>({...f,name:e.target.value}))}
                    placeholder={lang==="ru"?"Название тега...":"Tag name..."} style={{flex:1,minWidth:150}}
                    onKeyDown={e=>{if(e.key==="Enter")saveTag();}}/>
                  <div style={{display:"flex",gap:4}}>
                    {TAG_COLORS.map(c=>(
                      <div key={c} onClick={()=>setNewTag(f=>({...f,color:c}))}
                        style={{width:22,height:22,borderRadius:5,background:c,cursor:"pointer",border:newTag.color===c?"2px solid #fff":"2px solid transparent"}}/>
                    ))}
                  </div>
                  <button className="btn btn-p btn-sm" onClick={saveTag}>{IC.plus} {t.addTag}</button>
                </div>
              </div>
            )}
            {/* Tags overview */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
              {crmTags.map(tag=>{
                const tagContacts = contacts.filter(c=>(c.tags||[]).includes(tag.name));
                return (
                  <div key={tag.id} style={{background:"var(--s1)",border:`1px solid ${tag.color}25`,borderLeft:`4px solid ${tag.color}`,borderRadius:10,padding:14,cursor:"pointer"}}
                    onClick={()=>{setTagFilter(tag.name);setCTab("contacts");}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:tag.color,flexShrink:0}}/>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:tag.color}}>{tag.name}</span>
                      <span style={{marginLeft:"auto",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:tag.color}}>{tagContacts.length}</span>
                    </div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{lang==="ru"?"контактов":"contacts"}</div>
                    <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                      {tagContacts.slice(0,4).map(c=><Av key={c.id} name={c.name} color={tag.color}/>)}
                      {tagContacts.length>4&&<span style={{fontSize:10,color:"var(--mu)",alignSelf:"center"}}>+{tagContacts.length-4}</span>}
                    </div>
                  </div>
                );
              })}
              {!crmTags.length&&(
                <div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"var(--mu)"}}>
                  <div style={{marginBottom:8,opacity:.4,display:"flex",justifyContent:"center"}}>{IC.tag}</div>
                  <div>{lang==="ru"?"Тегов пока нет — создай первый":"No tags yet — create the first one"}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB: AUTOMATIONS ── */}
        {cTab==="auto"&&(
          <>
            <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"var(--mu)",display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:16}}>🤖</span>
              <span>{lang==="ru"?"Воронка работает автоматически: когда контакту добавляется тег — система ждёт заданное время и отправляет SMS шаблон. (SMS отправка активируется после подключения Twilio)":"Funnel works automatically: when a tag is added to a contact — the system waits the set time and sends the SMS template. (SMS sending activates after Twilio connection)"}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {automations.map(a=>{
                const tag = crmTags.find(t=>t.name===a.triggerTag);
                return (
                  <div key={a.id} style={{background:"var(--s1)",border:`1px solid ${a.active?"var(--gr)20":"var(--bdr)"}`,borderRadius:11,padding:16,opacity:a.active?1:.6}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                      <div style={{fontWeight:600,fontSize:14,flex:1}}>{a.name||lang==="ru"?"Автоматизация":"Automation"}</div>
                      <Bdg cls={a.active?"b-gr":"b-mu"}>{a.active?(lang==="ru"?"Активна":"Active"):(lang==="ru"?"Пауза":"Paused")}</Bdg>
                      <button className="btn btn-g btn-sm" onClick={()=>toggleAuto(a.id)}>{a.active?(lang==="ru"?"Пауза":"Pause"):(lang==="ru"?"Активировать":"Activate")}</button>
                      <button className="btn btn-d btn-sm" onClick={()=>deleteAuto(a.id)}>{IC.trash}</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontSize:12}}>
                      <div style={{background:"var(--s2)",borderRadius:7,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}>
                        {IC.tag} <span>{lang==="ru"?"Тег:":"Tag:"}</span>
                        <span style={{color:tag?.color||"var(--acc)",fontWeight:600}}>{a.triggerTag}</span>
                      </div>
                      <span style={{color:"var(--mu)"}}>→</span>
                      <div style={{background:"var(--s2)",borderRadius:7,padding:"6px 10px"}}>
                        ⏱ {a.delayHours}h
                      </div>
                      <span style={{color:"var(--mu)"}}>→</span>
                      {a.msgTemplate&&<div style={{background:"var(--s2)",borderRadius:7,padding:"6px 10px",display:"flex",alignItems:"center",gap:6,flex:1,minWidth:120}}>
                        💬 <span style={{color:"var(--mu)",fontSize:11}}>{a.msgTemplate.slice(0,40)}{a.msgTemplate.length>40?"...":""}</span>
                      </div>}
                      {a.routeToDept&&(()=>{
                        const dept=p?.departments?.find(d=>d.id===a.routeToDept);
                        return <div style={{background:"var(--bl)12",border:"1px solid var(--bl)25",borderRadius:7,padding:"6px 10px",display:"flex",alignItems:"center",gap:5,fontSize:11}}>
                          🔀 <span style={{color:"var(--bl)"}}>{a.routeType==="move"?"→":"📋"} {dept?.name||a.routeToDept}</span>
                        </div>;
                      })()}
                    </div>
                  </div>
                );
              })}
              {!automations.length&&(
                <div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
                  <div style={{fontSize:32,marginBottom:8}}>🤖</div>
                  <div>{lang==="ru"?"Автоматизаций пока нет":"No automations yet"}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── CONTACT CREATE MODAL ── */}
        {cModal&&(
          <div className="ovl" onClick={()=>setCModal(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.addContact}</div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.contactName} *</label><input className="inp" value={cF.name} onChange={e=>setCF(f=>({...f,name:e.target.value}))} placeholder="Jane Smith"/></div>
                <div className="fg"><label className="lbl">{t.contactPhone}</label><input className="inp" value={cF.phone} onChange={e=>setCF(f=>({...f,phone:e.target.value}))} placeholder="+1 (512) 000-0000"/></div>
              </div>
              <div className="fr">
                <div className="fg"><label className="lbl">{t.contactEmail}</label><input className="inp" value={cF.email} onChange={e=>setCF(f=>({...f,email:e.target.value}))} placeholder="jane@example.com"/></div>
                <div className="fg">
                  <label className="lbl">{t.crmStage}</label>
                  <select className="inp" value={cF.stage} onChange={e=>setCF(f=>({...f,stage:e.target.value}))}>
                    {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">{lang==="ru"?"Отдел (назначить)":"Assign to dept"}</label>
                <select className="inp" value={cF.deptId||""} onChange={e=>setCF(f=>({...f,deptId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Не назначен —":"— Unassigned —"}</option>
                  {(p?.departments||[]).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="lbl">{t.contactTags}</label>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"6px 0"}}>
                  {crmTags.map(tag=>(
                    <button key={tag.id} type="button"
                      style={{fontSize:11,padding:"3px 10px",borderRadius:6,cursor:"pointer",border:`1px solid ${(cF.tags||[]).includes(tag.name)?tag.color:"var(--bdr)"}`,
                        background:(cF.tags||[]).includes(tag.name)?tag.color+"22":"transparent",
                        color:(cF.tags||[]).includes(tag.name)?tag.color:"var(--mu)"}}
                      onClick={()=>{
                        const tags=cF.tags||[];
                        setCF(f=>({...f,tags:tags.includes(tag.name)?tags.filter(t=>t!==tag.name):[...tags,tag.name]}));
                      }}>{tag.name}</button>
                  ))}
                  {!crmTags.length&&<span style={{fontSize:11,color:"var(--mu2)"}}>{lang==="ru"?"Сначала создайте теги во вкладке Теги":"Create tags first in the Tags tab"}</span>}
                </div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setCModal(false)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={saveContact}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SMS MODAL ── */}
        {smsModal&&(()=>{
          const c = contacts.find(x=>x.id===smsModal);
          const history = smsLog[smsModal]||[];
          return (
            <div className="ovl" onClick={()=>setSmsModal(null)}>
              <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
                <div className="modal-t" style={{display:"flex",alignItems:"center",gap:10}}>
                  {IC.sms} SMS → {c?.name}
                  <span style={{fontSize:12,color:"var(--mu)",fontWeight:400,marginLeft:4}}>{c?.phone}</span>
                </div>
                {/* SMS history */}
                {history.length>0&&(
                  <div style={{maxHeight:180,overflowY:"auto",marginBottom:14,display:"flex",flexDirection:"column",gap:6}}>
                    {history.map(m=>(
                      <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.dir==="out"?"flex-end":"flex-start"}}>
                        <div style={{background:m.dir==="out"?"var(--acc)18":"var(--s2)",border:`1px solid ${m.dir==="out"?"var(--acc)30":"var(--bdr)"}`,
                          borderRadius:9,padding:"7px 11px",maxWidth:"80%",fontSize:12}}>
                          {m.text}
                        </div>
                        <div style={{fontSize:9,color:"var(--mu)",marginTop:2}}>{m.ts}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="fg">
                  <label className="lbl">{lang==="ru"?"Сообщение":"Message"}</label>
                  <textarea className="inp" value={smsText} onChange={e=>setSmsText(e.target.value)}
                    style={{minHeight:80}} placeholder={lang==="ru"?"Введите сообщение...":"Type your message..."}
                    onKeyDown={e=>{if(e.key==="Enter"&&e.metaKey)sendSMS(smsModal,c?.phone,smsText);}}/>
                  <div style={{fontSize:10,color:"var(--mu)",marginTop:3,textAlign:"right"}}>{smsText.length}/160</div>
                </div>
                {/* Templates */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:"var(--mu)",marginBottom:6}}>{lang==="ru"?"Быстрые шаблоны:":"Quick templates:"}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {[
                      lang==="ru"?"Спасибо за интерес! Свяжемся в ближайшее время.":"Thanks for your interest! We'll be in touch soon.",
                      lang==="ru"?"Ваша уборка запланирована. Увидимся!":"Your cleaning is scheduled. See you soon!",
                      lang==="ru"?"Хотите узнать подробнее о наших услугах?":"Want to learn more about our services?",
                    ].map((tmpl,i)=>(
                      <button key={i} className="btn btn-g btn-sm" style={{fontSize:10,padding:"3px 8px",textAlign:"left"}}
                        onClick={()=>setSmsText(tmpl)}>{tmpl.slice(0,30)}...</button>
                    ))}
                  </div>
                </div>
                <div className="ma">
                  <button className="btn btn-g" onClick={()=>setSmsModal(null)}>{t.cancel}</button>
                  <button className="btn btn-p" disabled={smsSending||!smsText.trim()} onClick={()=>sendSMS(smsModal,c?.phone,smsText)}>
                    {smsSending?(lang==="ru"?"Отправка...":"Sending..."):<>{IC.send} {lang==="ru"?"Отправить":"Send"}</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── AUTOMATION CREATE MODAL ── */}
        {aModal&&(
          <div className="ovl" onClick={()=>setAModal(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.addAutomation}</div>
              <div className="fg"><label className="lbl">{lang==="ru"?"Название автоматизации":"Automation name"}</label><input className="inp" value={aF.name} onChange={e=>setAF(f=>({...f,name:e.target.value}))} placeholder={lang==="ru"?"Приветственное SMS":"Welcome SMS"}/></div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.triggerTag}</label>
                  <select className="inp" value={aF.triggerTag} onChange={e=>setAF(f=>({...f,triggerTag:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Выберите тег —":"— Select tag —"}</option>
                    {crmTags.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.delayHours}</label>
                  <input type="number" className="inp" value={aF.delayHours} onChange={e=>setAF(f=>({...f,delayHours:e.target.value}))} min="0" placeholder="1"/>
                </div>
              </div>
              <div style={{background:"var(--s2)",borderRadius:10,padding:12,marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:600,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>🔀 {lang==="ru"?"Маршрутизация в отдел":"Route to department"}</div>
                <div className="fr">
                  <div className="fg">
                    <label className="lbl">{lang==="ru"?"Назначить в отдел":"Assign to dept"}</label>
                    <select className="inp" value={aF.routeToDept} onChange={e=>setAF(f=>({...f,routeToDept:e.target.value}))}>
                      <option value="">{lang==="ru"?"— Не назначать —":"— Don't route —"}</option>
                      {(p?.departments||[]).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="fg">
                    <label className="lbl">{lang==="ru"?"Тип":"Type"}</label>
                    <select className="inp" value={aF.routeType} onChange={e=>setAF(f=>({...f,routeType:e.target.value}))}>
                      <option value="copy">{lang==="ru"?"Копировать (виден в обоих)":"Copy (visible in both)"}</option>
                      <option value="move">{lang==="ru"?"Перенести (только новый отдел)":"Move (new dept only)"}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">{lang==="ru"?"SMS шаблон (опционально)":"SMS template (optional)"}</label>
                <textarea className="inp" value={aF.msgTemplate} onChange={e=>setAF(f=>({...f,msgTemplate:e.target.value}))} style={{minHeight:60}}
                  placeholder={lang==="ru"?"Привет, {name}! Благодарим за интерес...":"Hi {name}! Thanks for your interest..."}/>
                <div style={{fontSize:10,color:"var(--mu)",marginTop:3}}>{"{name}"} = {lang==="ru"?"имя контакта":"contact name"}, {"{phone}"} = {lang==="ru"?"телефон":"phone"}</div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setAModal(false)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={saveAutomation}>{t.create}</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };


  /* ══════════════════════════════════════════════════════
     LMS — ОБУЧЕНИЕ (Training / Learning Management)
  ══════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════
     HR STAFF CARDS — карточки кандидатов/сотрудников
  ══════════════════════════════════════════════════════ */
  const HRCards = () => {
    const pid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p   = getPartner(pid)||{};
    const hrCards = p?.hrCards||[];
    const depts   = p?.departments||[];

    const HR_TAGS_LIST = [
      {tag:"Cleaner-Candidate",  label:lang==="ru"?"Клинер-кандидат":"Cleaner-Candidate",   color:"#94a3b8"},
      {tag:"Cleaner-Trainee",    label:lang==="ru"?"Клинер-ученик":"Cleaner-Trainee",        color:"#f0a500"},
      {tag:"Cleaner-Intern",     label:lang==="ru"?"Клинер-стажер":"Cleaner-Intern",         color:"#3b82f6"},
      {tag:"Cleaner-Active",     label:lang==="ru"?"Клинер-активный":"Cleaner-Active",       color:"#22c55e"},
      {tag:"Manager-Candidate",  label:lang==="ru"?"Менеджер-кандидат":"Manager-Candidate", color:"#94a3b8"},
      {tag:"Manager-Trainee",    label:lang==="ru"?"Менеджер-ученик":"Manager-Trainee",      color:"#f0a500"},
      {tag:"Manager-Intern",     label:lang==="ru"?"Менеджер-стажер":"Manager-Intern",       color:"#3b82f6"},
      {tag:"Manager-Active",     label:lang==="ru"?"Менеджер-активный":"Manager-Active",     color:"#22c55e"},
    ];
    const HIRED = ["Cleaner-Active","Manager-Active"];

    const [cards,    setCards]    = useState(hrCards);
    const [openCard, setOpenCard] = useState(null);
    const [search,   setSearch]   = useState("");
    const [tagF,     setTagF]     = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId,   setEditId]   = useState(null);
    const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",tag:"",deptId:"",branchId:"",comment:"",status:"active"});

    // Sync with Firebase partner data
    useEffect(()=>{ setCards(p?.hrCards||[]); },[p?.hrCards]);

    function saveCard() {
      if (!form.firstName.trim()) return;
      const item = editId
        ? (p?.hrCards||[]).map(c=>c.id===editId?{...c,...form,updatedAt:new Date().toISOString().split("T")[0]}:c)
        : [...(p?.hrCards||[]), {...form, id:"hr_"+Date.now(), createdAt:new Date().toISOString().split("T")[0], notes:[]}];
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,hrCards:item}:x));
      setShowForm(false); setEditId(null);
      setForm({firstName:"",lastName:"",email:"",phone:"",tag:"",deptId:"",branchId:"",comment:"",status:"active"});
    }

    function deleteCard(id) {
      if (!window.confirm(lang==="ru"?"Удалить карточку?":"Delete card?")) return;
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,hrCards:(x.hrCards||[]).filter(c=>c.id!==id)}:x));
    }

    function addNote(cardId, text) {
      if (!text.trim()) return;
      const note = {id:"n_"+Date.now(), text:text.trim(), ts:new Date().toLocaleString(), author:currentUser?.name||"HR"};
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,hrCards:(x.hrCards||[]).map(c=>c.id===cardId?{...c,notes:[...(c.notes||[]),note]}:c)}:x));
    }

    function updateTag(cardId, tag) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,hrCards:(x.hrCards||[]).map(c=>c.id===cardId?{...c,tag,updatedAt:new Date().toISOString().split("T")[0]}:c)}:x));
      // Trigger CRM automations if contact exists
      const hrC = (p?.hrCards||[]).find(c=>c.id===cardId);
      const crmContact = (p?.contacts||[]).find(c=>c.email===hrC?.email||c.phone===hrC?.phone);
      if (crmContact) {
        // sync tag to CRM contact
        const cTags = crmContact.tags||[];
        if (!cTags.includes(tag)) {
          setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:(x.contacts||[]).map(c=>c.id===crmContact.id?{...c,tags:[...cTags,tag]}:c)}:x));
        }
      }
    }

    const [noteInputs, setNoteInputs] = useState({});
    const filtered = (p?.hrCards||[]).filter(c=>{
      const q = search.toLowerCase();
      const matchS = !q||(c.firstName+" "+c.lastName).toLowerCase().includes(q)||(c.phone||"").includes(q)||(c.email||"").toLowerCase().includes(q);
      const matchT = !tagF||c.tag===tagF;
      return matchS&&matchT;
    });

    const openC = openCard ? (p?.hrCards||[]).find(c=>c.id===openCard) : null;
    const tagInfo = t => HR_TAGS_LIST.find(h=>h.tag===t);

    if (openC) {
      const ti = tagInfo(openC.tag);
      const hired = HIRED.includes(openC.tag);
      return (
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer",color:"var(--mu)",fontSize:12}} onClick={()=>setOpenCard(null)}>
            ← {lang==="ru"?"Назад к списку":"Back to list"}
          </div>
          <div style={{background:"var(--s1)",border:`1px solid ${hired?"#22c55e30":"var(--bdr)"}`,borderRadius:14,padding:20,marginBottom:14,opacity:hired?.85:1}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
              <Av name={openC.firstName+" "+openC.lastName} color={ti?.color||"var(--acc)"} style={{width:52,height:52,fontSize:20}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800}}>{openC.firstName} {openC.lastName}</div>
                  {hired&&<span style={{background:"#22c55e20",color:"#22c55e",fontSize:10,padding:"2px 8px",borderRadius:5,fontWeight:700}}>✓ {lang==="ru"?"НАНЯТ":"HIRED"}</span>}
                </div>
                <div style={{fontSize:12,color:"var(--mu)",display:"flex",gap:14,flexWrap:"wrap",marginBottom:8}}>
                  {openC.phone&&<span>📞 {openC.phone}</span>}
                  {openC.email&&<span>✉ {openC.email}</span>}
                  <span>📅 {openC.createdAt}</span>
                  {openC.branchId&&p?.branches?.find(b=>b.id===openC.branchId)&&(
                    <span>📍 {p.branches.find(b=>b.id===openC.branchId)?.name}</span>
                  )}
                </div>
                {openC.comment&&<div style={{fontSize:12,color:"var(--mu2)",fontStyle:"italic",marginBottom:8}}>"{openC.comment}"</div>}
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn btn-g btn-sm" onClick={()=>{setForm({firstName:openC.firstName,lastName:openC.lastName,email:openC.email||"",phone:openC.phone||"",tag:openC.tag||"",deptId:openC.deptId||"",branchId:openC.branchId||"",comment:openC.comment||"",status:openC.status||"active"});setEditId(openC.id);setShowForm(true);setOpenCard(null);}}>✏️</button>
                <button className="btn btn-d btn-sm" onClick={()=>deleteCard(openC.id)}>{IC.trash}</button>
              </div>
            </div>
            {/* Pipeline tags */}
            <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--bdr)"}}>
              <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Pipeline</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {HR_TAGS_LIST.map(ht=>(
                  <button key={ht.tag} onClick={()=>updateTag(openC.id,ht.tag)}
                    style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${openC.tag===ht.tag?ht.color:"var(--bdr)"}`,
                      background:openC.tag===ht.tag?ht.color+"20":"transparent",
                      color:openC.tag===ht.tag?ht.color:"var(--mu)",
                      fontSize:11,cursor:"pointer",fontWeight:openC.tag===ht.tag?700:400}}>
                    {ht.label||ht.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Notes */}
          <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:14,padding:20}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12}}>{lang==="ru"?"Комментарии":"Comments"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12,maxHeight:280,overflowY:"auto"}}>
              {!(openC.notes?.length)&&<div style={{textAlign:"center",color:"var(--mu2)",padding:20,fontSize:12}}>{lang==="ru"?"Комментариев нет":"No comments yet"}</div>}
              {[...(openC.notes||[])].reverse().map(n=>(
                <div key={n.id} style={{background:"var(--s2)",borderRadius:9,padding:"9px 12px"}}>
                  <div style={{fontSize:13}}>{n.text}</div>
                  <div style={{fontSize:10,color:"var(--mu)",marginTop:3}}>{n.author} · {n.ts}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" value={noteInputs[openC.id]||""} style={{flex:1}}
                placeholder={lang==="ru"?"Добавить комментарий...":"Add comment..."}
                onChange={e=>setNoteInputs(p=>({...p,[openC.id]:e.target.value}))}
                onKeyDown={e=>{if(e.key==="Enter"&&noteInputs[openC.id]?.trim()){addNote(openC.id,noteInputs[openC.id]);setNoteInputs(p=>({...p,[openC.id]:""}))}}}/>
              <button className="btn btn-p" onClick={()=>{if(noteInputs[openC.id]?.trim()){addNote(openC.id,noteInputs[openC.id]);setNoteInputs(p=>({...p,[openC.id]:""}))}}}>{IC.send}</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Header */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>{lang==="ru"?"HR — Картотека кандидатов":"HR — Staff Cards"}</div>
          <button className="btn btn-p" style={{marginLeft:"auto"}} onClick={()=>{setForm({firstName:"",lastName:"",email:"",phone:"",tag:"",deptId:"",branchId:"",comment:"",status:"active"});setEditId(null);setShowForm(true);}}>
            {IC.plus} {lang==="ru"?"Новая карточка":"New Card"}
          </button>
        </div>

        {/* Pipeline stats */}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {HR_TAGS_LIST.map(ht=>{
            const cnt=(p?.hrCards||[]).filter(c=>c.tag===ht.tag).length;
            return cnt>0?(
              <div key={ht.tag} onClick={()=>setTagF(ht.tag===tagF?"":ht.tag)}
                style={{padding:"5px 10px",borderRadius:7,cursor:"pointer",border:`1px solid ${ht.tag===tagF?ht.color:"var(--bdr)"}`,background:ht.tag===tagF?ht.color+"18":"var(--s1)"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:ht.color}}>{cnt}</div>
                <div style={{fontSize:9,color:"var(--mu)",whiteSpace:"nowrap"}}>{ht.tag}</div>
              </div>
            ):null;
          })}
        </div>

        {/* Search */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <input className="inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="ru"?"Поиск по имени, телефону...":"Search name, phone..."} style={{flex:1}}/>
          {tagF&&<button className="btn btn-g btn-sm" onClick={()=>setTagF("")}>× {tagF}</button>}
        </div>

        {/* Card form */}
        {showForm&&(
          <div style={{background:"var(--s1)",border:"1px solid var(--acc)30",borderRadius:14,padding:18,marginBottom:16}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>
              {editId?(lang==="ru"?"✏️ Редактировать карточку":"✏️ Edit Card"):(lang==="ru"?"+ Новая карточка":"+ New Card")}
            </div>
            <div className="fr">
              <div className="fg"><label className="lbl">{lang==="ru"?"Имя *":"First Name *"}</label><input className="inp" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} placeholder={lang==="ru"?"Имя":"First name"}/></div>
              <div className="fg"><label className="lbl">{lang==="ru"?"Фамилия":"Last Name"}</label><input className="inp" value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} placeholder={lang==="ru"?"Фамилия":"Last name"}/></div>
            </div>
            <div className="fr">
              <div className="fg"><label className="lbl">{lang==="ru"?"Телефон":"Phone"}</label><input className="inp" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 (512) 000-0000"/></div>
              <div className="fg"><label className="lbl">{lang==="ru"?"Email":"Email"}</label><input className="inp" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="name@email.com"/></div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="lbl">{lang==="ru"?"Тег (статус)":"Tag (status)"}</label>
                <select className="inp" value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Выберите —":"— Select —"}</option>
                  {HR_TAGS_LIST.map(ht=><option key={ht.tag} value={ht.tag}>{ht.label||ht.tag}</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="lbl">📍 {lang==="ru"?"Город работы":"City"}</label>
                <select className="inp" value={form.branchId} onChange={e=>setForm(f=>({...f,branchId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Выберите город —":"— Select city —"}</option>
                  {(p?.branches||[]).map(b=><option key={b.id} value={b.id}>🏙️ {b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="lbl">{lang==="ru"?"Отдел":"Department"}</label>
                <select className="inp" value={form.deptId} onChange={e=>setForm(f=>({...f,deptId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Не назначен —":"— Unassigned —"}</option>
                  {depts.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="fg"><label className="lbl">{lang==="ru"?"Комментарий":"Comment"}</label>
              <input className="inp" value={form.comment} onChange={e=>setForm(f=>({...f,comment:e.target.value}))} placeholder={lang==="ru"?"Откуда узнал, особые заметки...":"How they found us, notes..."}/>
            </div>
            <div className="ma">
              <button className="btn btn-g" onClick={()=>{setShowForm(false);setEditId(null);}}>{t.cancel}</button>
              <button className="btn btn-p" onClick={saveCard}>{editId?t.save:t.create}</button>
            </div>
          </div>
        )}

        {/* Cards grid */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {!filtered.length&&<div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
            <div style={{fontSize:32,marginBottom:8}}>👥</div>
            <div>{lang==="ru"?"Карточек пока нет":"No cards yet"}</div>
          </div>}
          {filtered.map(c=>{
            const ti=tagInfo(c.tag);
            const hired=HIRED.includes(c.tag);
            return (
              <div key={c.id} style={{background:"var(--s1)",border:`1px solid ${hired?"#22c55e25":"var(--bdr)"}`,borderRadius:11,padding:"12px 16px",
                display:"flex",alignItems:"center",gap:14,cursor:"pointer",opacity:hired?.8:1,transition:"all .15s",position:"relative"}}
                onClick={()=>setOpenCard(c.id)}
                onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                onMouseLeave={e=>e.currentTarget.style.opacity=hired?.8+"":"1"}>
                {hired&&<div style={{position:"absolute",top:0,right:0,background:"#22c55e",color:"#fff",fontSize:9,padding:"2px 8px",borderRadius:"0 11px 0 8px",fontWeight:700}}>✓ {lang==="ru"?"НАНЯТ":"HIRED"}</div>}
                <Av name={c.firstName+" "+c.lastName} color={ti?.color||"var(--acc)"}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14}}>{c.firstName} {c.lastName}</div>
                  <div style={{fontSize:11,color:"var(--mu)",display:"flex",gap:10,flexWrap:"wrap"}}>
                    {c.phone&&<span>{c.phone}</span>}
                    {c.email&&<span>{c.email}</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {ti&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:6,background:ti.color+"20",color:ti.color,border:`1px solid ${ti.color}30`,fontWeight:600,whiteSpace:"nowrap"}}>{ti.label||ti.tag}</span>}
                  {c.branchId&&p?.branches?.find(b=>b.id===c.branchId)&&(
                    <span style={{fontSize:10,color:"var(--mu)",padding:"2px 6px",borderRadius:5,background:"var(--s2)",whiteSpace:"nowrap"}}>
                      📍 {p.branches.find(b=>b.id===c.branchId)?.name}
                    </span>
                  )}
                  {depts.find(d=>d.id===c.deptId)&&<span style={{fontSize:10,color:"var(--mu)",padding:"2px 6px",borderRadius:5,background:"var(--s2)"}}>{depts.find(d=>d.id===c.deptId)?.icon}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };


  /* ══════════════════════════════════════════════════════
     BOOKING MODULE v2 — BookingKoala-style
  ══════════════════════════════════════════════════════ */
  const Booking = () => {
    const pid    = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p      = getPartner(pid)||{};
    const emps   = p?.employees||[];
    const bookings  = p?.bookings||[];
    const bkClients = p?.bkClients||[];
    const BK_DEFAULTS = {
      cleanTypes:[
        {id:"standard",  label:lang==="ru"?"Стандартная":"Standard Clean", mult:1.0},
        {id:"deep",      label:lang==="ru"?"Глубокая":"Deep Clean",         mult:1.5},
        {id:"moveinout", label:lang==="ru"?"Переезд":"Move In/Out",         mult:1.8},
        {id:"airbnb",    label:"Airbnb",                                    mult:1.3},
      ],
      addons:[
        {id:"fridge",  label:lang==="ru"?"Внутри холодильника":"Inside Fridge", price:45},
        {id:"oven",    label:lang==="ru"?"Внутри духовки":"Inside Oven",         price:35},
        {id:"windows", label:lang==="ru"?"Мытьё окон":"Window Washing",          price:60},
        {id:"laundry", label:lang==="ru"?"Глажка/стирка":"Laundry/Ironing",      price:40},
      ],
      matrix:[
        [80, 100,120,140,160,175,190,205,220,235],
        [100,120,140,160,180,195,210,225,240,255],
        [120,140,165,185,205,220,235,250,265,280],
        [145,165,190,210,230,245,260,275,290,305],
        [170,195,220,245,265,280,295,310,325,340],
        [195,220,245,270,290,305,320,335,350,365],
        [220,245,270,295,315,330,345,360,375,390],
        [245,270,295,320,340,355,370,385,400,415],
        [270,295,320,345,365,380,395,410,425,440],
        [295,320,345,370,390,405,420,435,450,465],
      ],
      durMatrix:[
        [1.0,1.3,1.5,1.8,2.0,2.2,2.5,2.7,3.0,3.2],
        [1.3,1.7,2.0,2.3,2.5,2.8,3.0,3.3,3.5,3.8],
        [2.0,2.5,3.0,3.3,3.5,3.8,4.0,4.3,4.5,4.8],
        [2.5,3.0,3.5,4.0,4.3,4.5,4.8,5.0,5.3,5.5],
        [3.0,3.5,4.0,4.5,5.0,5.3,5.5,5.8,6.0,6.3],
        [3.5,4.0,4.5,5.0,5.5,6.0,6.3,6.5,6.8,7.0],
        [4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.3,7.5,7.8],
        [4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.3,8.5],
        [5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.3],
        [5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10.0],
      ],
      freqDiscounts:{weekly:10,biweekly:5,monthly:3},
      currency:"$",
    };
    // Always deep-merge with defaults so no key is ever missing
    const bkSettings = {
      ...BK_DEFAULTS,
      ...(p?.bkSettings||{}),
      cleanTypes: (p?.bkSettings?.cleanTypes)||BK_DEFAULTS.cleanTypes,
      addons:     (p?.bkSettings?.addons)||BK_DEFAULTS.addons,
      freqDiscounts: {...BK_DEFAULTS.freqDiscounts,...((p?.bkSettings?.freqDiscounts)||{})},
      currency:   p?.bkSettings?.currency||"$",
    };

    // ── Helpers ──
    function saveBkSettings(upd) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,
        bkSettings:{...BK_DEFAULTS,...(x.bkSettings||{}),...upd}
      }:x));
    }
    function saveBooking(bk) {
      const exists = bookings.find(b=>b.id===bk.id);
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,
        bookings:exists?(x.bookings||[]).map(b=>b.id===bk.id?bk:b):[...(x.bookings||[]),bk]
      }:x));
    }
    function deleteBooking(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,bookings:(x.bookings||[]).filter(b=>b.id!==id)}:x));
    }
    function saveClient(cl) {
      const exists = bkClients.find(c=>c.id===cl.id);
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,
        bkClients:exists?(x.bkClients||[]).map(c=>c.id===cl.id?cl:c):[...(x.bkClients||[]),cl]
      }:x));
    }
    function deleteClient(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,bkClients:(x.bkClients||[]).filter(c=>c.id!==id)}:x));
    }
    function calcPrice(beds,baths,cleanTypeId,addons,frequency) {
      const m=bkSettings.matrix||[]; const r=Math.min(beds,m.length-1); const c=Math.min(Math.max(baths-1,0),(m[0]||[]).length-1);
      const base=(m[r]||[])[c]||0;
      const mult=(bkSettings.cleanTypes||[]).find(x=>x.id===cleanTypeId)?.mult||1;
      const addTotal=(addons||[]).reduce((s,aid)=>s+((bkSettings.addons||[]).find(x=>x.id===aid)?.price||0),0);
      const subtotal=Math.round(base*mult)+addTotal;
      // Apply frequency discount
      const fd=bkSettings.freqDiscounts||{};
      const discPct = frequency&&frequency!=="once" ? (fd[frequency]||0) : 0;
      return discPct>0 ? Math.round(subtotal*(1-discPct/100)) : subtotal;
    }
    function calcDuration(beds,baths,cleanTypeId,cleanerCount) {
      const dm=bkSettings.durMatrix;
      let base;
      if (dm&&dm.length>0) {
        const r=Math.min(beds,dm.length-1); const c=Math.min(Math.max(baths-1,0),(dm[0]||[]).length-1);
        base=(dm[r]||[])[c]||1;
      } else {
        base = 1 + beds*0.5 + baths*0.3;
      }
      const mult=(bkSettings.cleanTypes||[]).find(x=>x.id===cleanTypeId)?.mult||1;
      const cnt=Math.max(cleanerCount||1,1);
      return Math.round(base*mult/cnt*10)/10;
    }

    // ── State ──
    const tab    = bookingTab;
    const setTab = setBookingTab;
    const [calView,     setCalView]   = useState("week"); // "month" | "week"
    const [viewDate,    setViewDate]  = useState(new Date());
    const [popupBk,     setPopupBk]   = useState(null);  // quick-view popup
    const [showBkForm,  setBkForm]    = useState(false);
    const [showClForm,  setClForm]    = useState(false); // client form
    const [editClId,    setEditClId]  = useState(null);
    const [showCrForm,  setCrForm]    = useState(false); // cleaner form
    const [editCrId,    setEditCrId]  = useState(null);
    const [cleanerFilter, setCleanerFilter] = useState(""); // "" = all
    const [clientSearch,  setClientSearch]  = useState("");
    const [settingsTab,   setSettTab]       = useState("smart");
    const defBkF = {id:null,clientId:"",cleanerId:"",date:"",time:"09:00",cleanType:"standard",beds:2,baths:1,addons:[],notes:"",status:"pending",price:0,frequency:"once",tip:0,tipType:"$",parking:0,paymentMethod:"cc",salesTax:0,priceOverride:null,durOverride:null,cleanerCount:1};
    const [bkF,  setBkF]  = useState(defBkF);
    const [clF,  setClF]  = useState({name:"",phone:"",email:"",address:"",city:"",notes:""});

    // ── SettingsPanel state — lifted here to survive re-renders ──
    const SETT_SIZE = 10;
    const [settLM,  setSettLM]  = useState(()=>Array.from({length:SETT_SIZE},(_,r)=>Array.from({length:SETT_SIZE},(_,c)=>(bkSettings.matrix||[])[r]?.[c]||0)));
    const [settLDM, setSettLDM] = useState(()=>Array.from({length:SETT_SIZE},(_,r)=>Array.from({length:SETT_SIZE},(_,c)=>(bkSettings.durMatrix||[])[r]?.[c]||0)));
    const [settLT,  setSettLT]  = useState(bkSettings.cleanTypes||[]);
    const [settLA,  setSettLA]  = useState(bkSettings.addons||[]);
    const [settLFD, setSettLFD] = useState(bkSettings.freqDiscounts||{weekly:10,biweekly:5,monthly:3});
    const [settP1,  setSettP1]  = useState({beds:1,baths:1,price:120,dur:1.33});
    const [settP2,  setSettP2]  = useState({beds:2,baths:2,price:180,dur:3.0});
    const [settSaved, setSettSaved] = useState(false);
    const [settSmartTab, setSettSmartTab] = useState("standard"); // standard | deep | moveinout | airbnb
    // Per-type anchors for non-standard types
    const [typeAnchors, setTypeAnchors] = useState({
      deep:      {p1:{beds:1,baths:1,price:170,dur:2.0}, p2:{beds:2,baths:2,price:250,dur:4.5}},
      moveinout: {p1:{beds:1,baths:1,price:210,dur:2.5}, p2:{beds:2,baths:2,price:320,dur:5.5}},
      airbnb:    {p1:{beds:1,baths:1,price:150,dur:1.5}, p2:{beds:2,baths:2,price:220,dur:3.5}},
    });
    const [typeSaved, setTypeSaved] = useState({}); // success flash

    const livePrice    = calcPrice(bkF.beds,bkF.baths,bkF.cleanType,bkF.addons,bkF.frequency);
    const liveDuration = calcDuration(bkF.beds,bkF.baths,bkF.cleanType,bkF.cleanerCount);

    // ── Calendar data ──
    const today = new Date().toISOString().split("T")[0];
    const yr=viewDate.getFullYear(), mo=viewDate.getMonth();
    const MONTH_NAMES = lang==="ru"
      ?["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
      :["January","February","March","April","May","June","July","August","September","October","November","December"];
    const DAY_NAMES_SHORT = lang==="ru"?["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]:["Su","Mo","Tu","We","Th","Fr","Sa"];
    const DAY_NAMES_FULL  = lang==="ru"?["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"]:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    // Get week dates
    function getWeekDates(d) {
      const start = new Date(d); start.setDate(d.getDate()-d.getDay());
      return Array.from({length:7},(_,i)=>{const x=new Date(start);x.setDate(start.getDate()+i);return x;});
    }
    const weekDates = getWeekDates(viewDate);

    // Cleaner color palette (consistent per cleaner id)
    const CLEANER_COLORS = ["#3b82f6","#a855f7","#22c55e","#f0a500","#ec4899","#06b6d4","#ef4444","#84cc16","#f97316","#8b5cf6"];
    function cleanerColor(empId) {
      if (!empId) return "#94a3b8";
      const emp = emps.find(e=>e.id===empId);
      if (emp?.color) return emp.color;
      const idx = emps.findIndex(e=>e.id===empId);
      return CLEANER_COLORS[Math.abs(idx)%CLEANER_COLORS.length]||"#94a3b8";
    }

    const STATUS_COLORS = {pending:"#f0a500",confirmed:"#3b82f6",done:"#22c55e",cancelled:"#ef4444"};
    const STATUS_LABELS = {
      pending:lang==="ru"?"Ожидает":"Pending",
      confirmed:lang==="ru"?"Подтверждено":"Confirmed",
      done:lang==="ru"?"Выполнено":"Done",
      cancelled:lang==="ru"?"Отменено":"Cancelled",
    };
    const FREQ_LABELS = {
      once:     lang==="ru"?"Разово":"One-time",
      weekly:   lang==="ru"?"Каждую неделю":"Weekly",
      biweekly: lang==="ru"?"Раз в 2 нед":"Every 2 weeks",
      monthly:  lang==="ru"?"Раз в 4 нед":"Every 4 weeks",
    };

    function getDateStr(d) { return d.toISOString().split("T")[0]; }
    // Expand recurring bookings — given a dateStr, return all bookings that fall on that date
    // including recurrences from bookings with frequency != "once"
    function getDayBks(dateStr) {
      const result = [];
      const [ty,tm,td] = dateStr.split("-").map(Number);
      const targetMs = Date.UTC(ty, tm-1, td);
      for (const b of bookings) {
        if (cleanerFilter!==""&&b.cleanerId!==cleanerFilter) continue;
        if (!b.date) continue;
        if (b.frequency==="once"||!b.frequency) {
          if (b.date===dateStr) result.push(b);
          continue;
        }
        // recurring — check if dateStr falls on the pattern
        if (b.date===dateStr) {
          result.push({...b, _recurring:true});
          continue;
        }
        const [sy,sm,sd] = b.date.split("-").map(Number);
        const startMs = Date.UTC(sy, sm-1, sd);
        if (targetMs < startMs) continue;
        const diffDays = Math.round((targetMs - startMs) / 86400000);
        const interval = b.frequency==="weekly"?7:b.frequency==="biweekly"?14:28;
        if (diffDays % interval === 0) result.push({...b, date:dateStr, _recurring:true});
      }
      return result;
    }

    // ── Booking Form Modal ──
    const BookingForm = ({onClose}) => {
      const cleaners = emps.filter(e=>e.status!=="fired");
      const [showNewClient, setShowNewClient] = useState(false);
      const [newClientF, setNewClientF] = useState({name:"",lastName:"",phone:"",email:"",address:"",city:"",notes:""});

      const autoPrice = calcPrice(bkF.beds,bkF.baths,bkF.cleanType,bkF.addons,bkF.frequency);
      const autoDur   = calcDuration(bkF.beds,bkF.baths,bkF.cleanType,bkF.cleanerCount);
      const price     = bkF.priceOverride!=null ? bkF.priceOverride : autoPrice;
      const dur       = bkF.durOverride!=null   ? bkF.durOverride   : autoDur;
      const tipAmt    = bkF.tipType==="pct" ? Math.round(price*(bkF.tip||0)/100) : (bkF.tip||0);
      const taxAmt    = Math.round(price*(bkF.salesTax||0)/100);
      const total     = price + tipAmt + (bkF.parking||0) + taxAmt;

      const PAYMENT_METHODS = [
        {k:"cc",    l:lang==="ru"?"Карта":"Credit Card",      ico:"💳"},
        {k:"cash",  l:lang==="ru"?"Наличные":"Cash",           ico:"💵"},
        {k:"zelle", l:"Zelle",                                 ico:"📲"},
        {k:"venmo", l:"Venmo",                                 ico:"📱"},
        {k:"check", l:lang==="ru"?"Чек":"Check",               ico:"📝"},
      ];

      function createAndSelectClient() {
        if (!newClientF.name.trim()) return;
        const fullName = [newClientF.name, newClientF.lastName].filter(Boolean).join(" ");
        const newCl = {...newClientF, name:fullName, id:"cl_"+Date.now(), createdAt:new Date().toISOString().split("T")[0]};
        saveClient(newCl);
        setBkF(f=>({...f, clientId:newCl.id, notes:f.notes||newCl.address||""}));
        setShowNewClient(false);
        setNewClientF({name:"",lastName:"",phone:"",email:"",address:"",city:"",notes:""});
      }

      return (
        <div className="ovl" onClick={onClose}>
          <div className="modal" style={{maxWidth:560,maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div className="modal-t">{bkF.id?(lang==="ru"?"✏️ Редактировать заявку":"✏️ Edit Booking"):(lang==="ru"?"+ Новая заявка":"+ New Booking")}</div>

            {/* ── Client selector + quick-add ── */}
            <div style={{marginBottom:10}}>
              <label className="lbl">👤 {lang==="ru"?"Клиент":"Client"}</label>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <select className="inp" style={{flex:1}} value={bkF.clientId} onChange={e=>setBkF(f=>({...f,clientId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Выберите клиента —":"— Select client —"}</option>
                  {bkClients.map(c=><option key={c.id} value={c.id}>{c.name}{c.phone?` · ${c.phone}`:""}</option>)}
                </select>
                <button onClick={()=>setShowNewClient(x=>!x)}
                  style={{padding:"7px 11px",borderRadius:8,fontSize:12,cursor:"pointer",flexShrink:0,
                    border:`1px solid ${showNewClient?"var(--acc)":"var(--bdr)"}`,
                    background:showNewClient?"var(--acc)18":"var(--s2)",color:showNewClient?"var(--acc)":"var(--mu)"}}>
                  {showNewClient?"✕":`+ ${lang==="ru"?"Новый":"New"}`}
                </button>
              </div>
              {/* Inline new client form */}
              {showNewClient&&(
                <div style={{background:"var(--s2)",border:"1px solid var(--acc)30",borderRadius:10,padding:12,marginTop:8}}>
                  <div style={{fontSize:10,color:"var(--acc)",fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>
                    ✦ {lang==="ru"?"Быстрое создание клиента":"Quick Create Client"}
                  </div>
                  <div className="fr">
                    <div className="fg"><label className="lbl">{lang==="ru"?"Имя *":"First Name *"}</label>
                      <input className="inp" value={newClientF.name} onChange={e=>setNewClientF(f=>({...f,name:e.target.value}))} placeholder={lang==="ru"?"Имя":"First name"}/>
                    </div>
                    <div className="fg"><label className="lbl">{lang==="ru"?"Фамилия":"Last Name"}</label>
                      <input className="inp" value={newClientF.lastName} onChange={e=>setNewClientF(f=>({...f,lastName:e.target.value}))} placeholder={lang==="ru"?"Фамилия":"Last name"}/>
                    </div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label className="lbl">{lang==="ru"?"Телефон":"Phone"}</label>
                      <input className="inp" value={newClientF.phone} onChange={e=>setNewClientF(f=>({...f,phone:e.target.value}))} placeholder="+1 (512) 000-0000"/>
                    </div>
                    <div className="fg"><label className="lbl">Email</label>
                      <input className="inp" value={newClientF.email} onChange={e=>setNewClientF(f=>({...f,email:e.target.value}))} placeholder="jane@email.com"/>
                    </div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label className="lbl">📍 {lang==="ru"?"Адрес уборки":"Cleaning Address"}</label>
                      <input className="inp" value={newClientF.address} onChange={e=>setNewClientF(f=>({...f,address:e.target.value}))} placeholder="123 Main St, Austin TX"/>
                    </div>
                    <div className="fg"><label className="lbl">{lang==="ru"?"Город":"City"}</label>
                      <input className="inp" value={newClientF.city} onChange={e=>setNewClientF(f=>({...f,city:e.target.value}))} placeholder="Austin"/>
                    </div>
                  </div>
                  <button className="btn btn-p" style={{marginTop:4}} onClick={createAndSelectClient}>
                    ✓ {lang==="ru"?"Создать и выбрать":"Create & Select"}
                  </button>
                </div>
              )}
            </div>

            {/* Cleaner */}
            <div className="fg" style={{marginBottom:10}}>
              <label className="lbl">🧹 {lang==="ru"?"Клинер":"Cleaner"}</label>
              <select className="inp" value={bkF.cleanerId} onChange={e=>setBkF(f=>({...f,cleanerId:e.target.value}))}>
                <option value="">{lang==="ru"?"— Не назначен —":"— Unassigned —"}</option>
                {cleaners.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            {/* Date + Time + Status */}
            <div className="fr">
              <div className="fg"><label className="lbl">📅 {lang==="ru"?"Дата *":"Date *"}</label>
                <input className="inp" type="date" value={bkF.date} onChange={e=>setBkF(f=>({...f,date:e.target.value}))}/>
              </div>
              <div className="fg"><label className="lbl">🕐 {lang==="ru"?"Время":"Time"}</label>
                <input className="inp" type="time" value={bkF.time} onChange={e=>setBkF(f=>({...f,time:e.target.value}))}/>
              </div>
              <div className="fg"><label className="lbl">{lang==="ru"?"Статус":"Status"}</label>
                <select className="inp" value={bkF.status} onChange={e=>setBkF(f=>({...f,status:e.target.value}))}>
                  {Object.entries(STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* Frequency */}
            <div className="fg" style={{marginBottom:10}}>
              <label className="lbl">🔄 {lang==="ru"?"Частота":"Frequency"}</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(FREQ_LABELS).map(([k,v])=>{
                  const discPct=(bkSettings.freqDiscounts||{})[k]||0;
                  return (
                    <button key={k} onClick={()=>setBkF(f=>({...f,frequency:k}))}
                      style={{padding:"5px 12px",borderRadius:7,fontSize:11,cursor:"pointer",position:"relative",
                        border:`1px solid ${bkF.frequency===k?"var(--acc)":"var(--bdr)"}`,
                        background:bkF.frequency===k?"var(--acc)18":"transparent",
                        color:bkF.frequency===k?"var(--acc)":"var(--mu)"}}>
                      {v}
                      {discPct>0&&<span style={{marginLeft:5,fontSize:9,color:"var(--gr)",fontWeight:700}}>-{discPct}%</span>}
                    </button>
                  );
                })}
              </div>
              {bkF.frequency!=="once"&&(bkSettings.freqDiscounts||{})[bkF.frequency]>0&&(
                <div style={{fontSize:10,color:"var(--gr)",marginTop:4}}>
                  ✓ {lang==="ru"?"Скидка за регулярность":"Recurring discount"}: -{(bkSettings.freqDiscounts||{})[bkF.frequency]}%
                </div>
              )}
            </div>

            {/* Pricing block */}
            <div style={{background:"var(--s2)",borderRadius:11,padding:13,marginBottom:10}}>
              <div style={{fontSize:10,color:"var(--mu)",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>
                💰 {lang==="ru"?"Расчёт стоимости":"Price Calculation"}
              </div>
              <div className="fr" style={{marginBottom:8}}>
                <div className="fg"><label className="lbl">{lang==="ru"?"Спальни":"Bedrooms"}</label>
                  <select className="inp" value={bkF.beds} onChange={e=>setBkF(f=>({...f,beds:+e.target.value}))}>
                    {[0,1,2,3,4,5,6,7,8,9].map(n=><option key={n} value={n}>{n===0?"Studio":`${n} bd`}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Ванные":"Bathrooms"}</label>
                  <select className="inp" value={bkF.baths} onChange={e=>setBkF(f=>({...f,baths:+e.target.value}))}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} ba</option>)}
                  </select>
                </div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Тип уборки":"Clean Type"}</label>
                  <select className="inp" value={bkF.cleanType} onChange={e=>setBkF(f=>({...f,cleanType:e.target.value}))}>
                    {(bkSettings.cleanTypes||[]).map(ct=><option key={ct.id} value={ct.id}>{ct.label}</option>)}
                  </select>
                </div>
                <div className="fg"><label className="lbl">👥 {lang==="ru"?"Клинеров":"Cleaners"}</label>
                  <select className="inp" value={bkF.cleanerCount||1} onChange={e=>setBkF(f=>({...f,cleanerCount:+e.target.value}))}>
                    {[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              {/* Addons */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {(bkSettings.addons||[]).map(a=>{
                  const on=(bkF.addons||[]).includes(a.id);
                  return (
                    <button key={a.id} onClick={()=>setBkF(f=>({...f,addons:on?(f.addons||[]).filter(x=>x!==a.id):[...(f.addons||[]),a.id]}))}
                      style={{padding:"4px 10px",borderRadius:6,fontSize:11,cursor:"pointer",
                        border:`1px solid ${on?"var(--acc)":"var(--bdr)"}`,
                        background:on?"var(--acc)18":"transparent",color:on?"var(--acc)":"var(--mu)"}}>
                      {a.label} <span style={{opacity:.7}}>+{bkSettings.currency}{a.price}</span>
                    </button>
                  );
                })}
              </div>
              {/* Price + Duration — editable overrides */}
              <div style={{paddingTop:10,borderTop:"1px solid var(--bdr)"}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:6}}>
                  {/* Price */}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                      <span style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.4}}>{lang==="ru"?"Стоимость уборки":"Cleaning price"}</span>
                      {bkF.priceOverride!=null&&<span style={{fontSize:9,color:"var(--acc)",background:"var(--acc)15",padding:"1px 5px",borderRadius:3}}>✎ {lang==="ru"?"вручную":"manual"}</span>}
                    </div>
                    <div style={{display:"flex",width:"fit-content"}}>
                      <span style={{padding:"7px 8px",background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:"7px 0 0 7px",fontSize:13,color:"var(--mu)",flexShrink:0}}>$</span>
                      <input type="number" min="0" value={bkF.priceOverride!=null?bkF.priceOverride:autoPrice}
                        onChange={e=>setBkF(f=>({...f,priceOverride:+e.target.value}))}
                        className="inp" style={{borderRadius:"0 7px 7px 0",borderLeft:"none",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"var(--acc)",width:90,textAlign:"center"}}/>
                    </div>
                    {bkF.priceOverride!=null&&<button onClick={()=>setBkF(f=>({...f,priceOverride:null}))}
                      style={{fontSize:9,color:"var(--mu)",background:"none",border:"none",cursor:"pointer",marginTop:3,padding:0}}>
                      ↺ {lang==="ru"?"авто $":"auto $"}{autoPrice}
                    </button>}
                  </div>
                  <div style={{width:1,alignSelf:"stretch",background:"var(--bdr)",flexShrink:0,margin:"0 2px"}}/>
                  {/* Duration */}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                      <span style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.4}}>{lang==="ru"?"Длительность":"Duration"}</span>
                      {bkF.durOverride!=null&&<span style={{fontSize:9,color:"var(--bl)",background:"var(--bl)15",padding:"1px 5px",borderRadius:3}}>✎ {lang==="ru"?"вручную":"manual"}</span>}
                    </div>
                    <div style={{display:"flex",width:"fit-content"}}>
                      <input type="number" min="0.5" max="24" step="0.5"
                        value={bkF.durOverride!=null?bkF.durOverride:autoDur}
                        onChange={e=>setBkF(f=>({...f,durOverride:+e.target.value}))}
                        className="inp" style={{borderRadius:"7px 0 0 7px",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:"var(--bl)",width:72,textAlign:"center"}}/>
                      <span style={{padding:"7px 8px",background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:"0 7px 7px 0",fontSize:13,color:"var(--mu)",borderLeft:"none",flexShrink:0}}>{lang==="ru"?"ч":"h"}</span>
                    </div>
                    {bkF.durOverride!=null&&<button onClick={()=>setBkF(f=>({...f,durOverride:null}))}
                      style={{fontSize:9,color:"var(--mu)",background:"none",border:"none",cursor:"pointer",marginTop:3,padding:0}}>
                      ↺ {lang==="ru"?"авто":"auto"} {autoDur}{lang==="ru"?"ч":"h"}
                    </button>}
                  </div>
                </div>
                <div style={{fontSize:10,color:"var(--mu)"}}>
                  {lang==="ru"?"База":"Base"}: ${calcPrice(bkF.beds,bkF.baths,bkF.cleanType,[])} × {(bkSettings.cleanTypes||[]).find(x=>x.id===bkF.cleanType)?.mult||1}
                </div>
              </div>
            </div>

            {/* ── Tips + Parking ── */}
            <div style={{background:"var(--s2)",borderRadius:11,padding:13,marginBottom:10}}>
              <div style={{fontSize:10,color:"var(--mu)",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>
                ✦ {lang==="ru"?"Чаевые и доп. расходы":"Tips & Extra Charges"}
              </div>
              <div className="fr" style={{alignItems:"flex-end",gap:8}}>
                {/* Tips */}
                <div style={{flex:2}}>
                  <label className="lbl">🙏 {lang==="ru"?"Чаевые (Tip)":"Tips"}</label>
                  <div style={{display:"flex",gap:0}}>
                    <input type="number" min="0" value={bkF.tip||""} onChange={e=>setBkF(f=>({...f,tip:+e.target.value||0}))}
                      className="inp" placeholder="0"
                      style={{borderRadius:"7px 0 0 7px",borderRight:"none",textAlign:"center",width:70}}/>
                    <select value={bkF.tipType||"$"} onChange={e=>setBkF(f=>({...f,tipType:e.target.value}))}
                      className="inp" style={{borderRadius:"0 7px 7px 0",width:60,padding:"7px 4px",flexShrink:0}}>
                      <option value="$">$</option>
                      <option value="pct">%</option>
                    </select>
                  </div>
                  {bkF.tip>0&&bkF.tipType==="pct"&&(
                    <div style={{fontSize:10,color:"var(--gr)",marginTop:3}}>=  {bkSettings.currency}{tipAmt}</div>
                  )}
                  {/* Quick tip % buttons */}
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    {[10,15,18,20].map(pct=>(
                      <button key={pct} onClick={()=>setBkF(f=>({...f,tip:pct,tipType:"pct"}))}
                        style={{padding:"3px 7px",borderRadius:5,fontSize:10,cursor:"pointer",
                          border:`1px solid ${bkF.tip===pct&&bkF.tipType==="pct"?"var(--gr)":"var(--bdr)"}`,
                          background:bkF.tip===pct&&bkF.tipType==="pct"?"var(--gr)18":"transparent",
                          color:bkF.tip===pct&&bkF.tipType==="pct"?"var(--gr)":"var(--mu)"}}>
                        {pct}%
                      </button>
                    ))}
                    <button onClick={()=>setBkF(f=>({...f,tip:0,tipType:"$"}))}
                      style={{padding:"3px 7px",borderRadius:5,fontSize:10,cursor:"pointer",
                        border:"1px solid var(--bdr)",background:"transparent",color:"var(--mu)"}}>
                      {lang==="ru"?"сброс":"clear"}
                    </button>
                  </div>
                </div>
                {/* Parking */}
                <div style={{flex:1}}>
                  <label className="lbl">🅿️ {lang==="ru"?"Парковка":"Parking"}</label>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:12,color:"var(--mu)"}}>$</span>
                    <input type="number" min="0" value={bkF.parking||""} onChange={e=>setBkF(f=>({...f,parking:+e.target.value||0}))}
                      className="inp" placeholder="0" style={{textAlign:"center"}}/>
                  </div>
                </div>
              </div>

              {/* Sales Tax */}
              <div className="fg" style={{marginTop:10}}>
                <label className="lbl">🏛 {lang==="ru"?"Sales Tax":"Sales Tax"}</label>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <select className="inp" style={{width:90,flexShrink:0}} value={bkF.salesTax||0}
                    onChange={e=>setBkF(f=>({...f,salesTax:+e.target.value}))}>
                    <option value={0}>{lang==="ru"?"Нет":"None"} — 0%</option>
                    {Array.from({length:20},(_,i)=>i+1).map(n=>(
                      <option key={n} value={n}>{n}%</option>
                    ))}
                  </select>
                  {bkF.salesTax>0&&(
                    <span style={{fontSize:12,color:"var(--mu)"}}>
                      = <span style={{color:"var(--acc)",fontWeight:600}}>{bkSettings.currency}{taxAmt}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Total line */}
              {(tipAmt>0||bkF.parking>0||taxAmt>0)&&(
                <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:10,marginTop:8,borderTop:"1px solid var(--bdr)"}}>
                  <span style={{fontSize:11,color:"var(--mu)",flex:1,lineHeight:1.6}}>
                    {bkSettings.currency}{price}
                    {tipAmt>0&&<span style={{color:"var(--gr)"}}> + {bkSettings.currency}{tipAmt} tip</span>}
                    {bkF.parking>0&&<span style={{color:"var(--bl)"}}> + {bkSettings.currency}{bkF.parking} parking</span>}
                    {taxAmt>0&&<span style={{color:"#f0a500"}}> + {bkSettings.currency}{taxAmt} tax</span>}
                  </span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"var(--acc)"}}>
                    = {bkSettings.currency}{total}
                  </span>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="fg" style={{marginBottom:10}}>
              <label className="lbl">💳 {lang==="ru"?"Способ оплаты":"Payment Method"}</label>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {PAYMENT_METHODS.map(pm=>(
                  <button key={pm.k} onClick={()=>setBkF(f=>({...f,paymentMethod:pm.k}))}
                    style={{padding:"5px 11px",borderRadius:7,fontSize:11,cursor:"pointer",
                      border:`1px solid ${bkF.paymentMethod===pm.k?"var(--acc)":"var(--bdr)"}`,
                      background:bkF.paymentMethod===pm.k?"var(--acc)18":"transparent",
                      color:bkF.paymentMethod===pm.k?"var(--acc)":"var(--mu)"}}>
                    {pm.ico} {pm.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="fg" style={{marginBottom:10}}>
              <label className="lbl">📝 {lang==="ru"?"Заметки":"Notes"}</label>
              <input className="inp" value={bkF.notes} onChange={e=>setBkF(f=>({...f,notes:e.target.value}))} placeholder={lang==="ru"?"Особые пожелания, ключи, домашние животные...":"Special requests, key access, pets..."}/>
            </div>

            <div className="ma">
              <button className="btn btn-g" onClick={onClose}>{lang==="ru"?"Отмена":"Cancel"}</button>
              {bkF.id&&<button className="btn btn-d" onClick={()=>{deleteBooking(bkF.id);onClose();}}>🗑</button>}
              <button className="btn btn-p" onClick={()=>{
                if (!bkF.date) return;
                saveBooking({...bkF, id:bkF.id||"bk_"+Date.now(), price, tipAmt, total});
                onClose();
              }}>{lang==="ru"?"Сохранить":"Save"}</button>
            </div>
          </div>
        </div>
      );
    };

    // ── Booking Quick Popup ──
    const BookingPopup = ({bk,onClose}) => {
      const cl  = bkClients.find(c=>c.id===bk.clientId);
      const emp = emps.find(e=>e.id===bk.cleanerId);
      const ct  = (bkSettings.cleanTypes||[]).find(x=>x.id===bk.cleanType);
      const sc  = STATUS_COLORS[bk.status]||"var(--mu)";
      const dur = bk.durOverride||calcDuration(bk.beds,bk.baths,bk.cleanType,bk.cleanerCount);
      const displayPrice = bk.total||bk.price;
      const isCC = bk.paymentMethod==="cc";

      const [log, setLog] = useState(bk.log||[]);
      const [showLog, setShowLog] = useState(false);
      const [showChecklist, setShowChecklist] = useState(false);
      const [checklist, setChecklist] = useState(bk.checklist||[
        {id:"c1",text:lang==="ru"?"Кухня":"Kitchen",done:false},
        {id:"c2",text:lang==="ru"?"Ванная":"Bathroom",done:false},
        {id:"c3",text:lang==="ru"?"Спальня":"Bedroom",done:false},
        {id:"c4",text:lang==="ru"?"Гостиная":"Living room",done:false},
        {id:"c5",text:lang==="ru"?"Полы":"Floors",done:false},
        {id:"c6",text:lang==="ru"?"Окна":"Windows",done:false},
      ]);
      const [chargeConfirm, setChargeConfirm] = useState(false);

      function addLog(action) {
        const entry = {at:new Date().toLocaleString("ru"),action};
        const newLog = [entry,...log];
        setLog(newLog);
        saveBooking({...bk, log:newLog});
      }

      function changeStatus(s) {
        saveBooking({...bk,status:s});
        addLog(`${lang==="ru"?"Статус изменён на":"Status changed to"}: ${STATUS_LABELS[s]}`);
        onClose();
      }

      function saveChecklist(cl2) {
        setChecklist(cl2);
        saveBooking({...bk,checklist:cl2});
      }

      const PM_ICO = {cc:"💳",cash:"💵",zelle:"📲",venmo:"📱",check:"📝"};
      const ACTIONS = [
        ...(isCC?[{
          label:lang==="ru"?"💳 Снять оплату":"💳 Charge Card",
          color:"#22c55e",tc:"#fff",
          onClick:()=>setChargeConfirm(true)
        }]:[]),
        {
          label:lang==="ru"?"📋 Чеклист уборки":"📋 Cleaning Checklist",
          color:"var(--acc)",tc:"#fff",
          onClick:()=>setShowChecklist(x=>!x)
        },
        {
          label:lang==="ru"?"📜 Лог событий":"📜 Booking Log",
          color:"var(--s2)",tc:"var(--tx)",border:true,
          onClick:()=>setShowLog(x=>!x)
        },
        {
          label:lang==="ru"?"➕ В воронку CRM":"➕ Add to CRM Funnel",
          color:"var(--s2)",tc:"var(--tx)",border:true,
          onClick:()=>{
            const exists = (p?.contacts||[]).find(c=>c.phone===cl?.phone||c.email===cl?.email);
            if(!cl) return;
            if(!exists) {
              setPartners(ps=>ps.map(x=>x.id===pid?{...x,contacts:[...(x.contacts||[]),{
                id:"c_"+Date.now(),name:cl.name,phone:cl.phone||"",email:cl.email||"",
                address:cl.address||"",city:cl.city||"",tags:["Cleaner-Client"],
                createdAt:new Date().toISOString().split("T")[0],history:[]
              }]}:x));
              addLog(lang==="ru"?"Добавлен в CRM":"Added to CRM");
              alert(lang==="ru"?`${cl.name} добавлен в CRM`:`${cl.name} added to CRM`);
            } else {
              alert(lang==="ru"?"Контакт уже есть в CRM":"Contact already in CRM");
            }
          }
        },
        {
          label:lang==="ru"?"📩 Отправить квитанцию":"📩 Send Receipt",
          color:"var(--s2)",tc:"var(--tx)",border:true,
          onClick:()=>{
            addLog(lang==="ru"?"Квитанция отправлена":"Receipt sent");
            alert(lang==="ru"?`Квитанция отправлена на ${cl?.email||cl?.phone||"клиента"}`:`Receipt sent to ${cl?.email||cl?.phone||"client"}`);
          }
        },
      ];

      const doneCount = checklist.filter(x=>x.done).length;

      return (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:200}} onClick={onClose}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            background:"var(--s1)",border:"1px solid var(--bdr2)",borderRadius:16,
            width:340,maxHeight:"88vh",overflowY:"auto",
            boxShadow:"0 20px 60px #00000050"}} onClick={e=>e.stopPropagation()}>

            {/* Header */}
            <div style={{padding:"18px 18px 14px",borderBottom:"1px solid var(--bdr)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <Av name={cl?.name||"?"} color={cleanerColor(bk.cleanerId)} style={{width:42,height:42,fontSize:16,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:1}}>{cl?.name||(lang==="ru"?"Клиент не указан":"No client")}</div>
                  <div style={{fontSize:11,color:"var(--mu)",display:"flex",gap:8,flexWrap:"wrap"}}>
                    {cl?.phone&&<span>📞 {cl.phone}</span>}
                    {cl?.city&&<span>📍 {cl.city}</span>}
                  </div>
                </div>
                <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"var(--mu)",lineHeight:1,flexShrink:0}}>×</button>
              </div>
            </div>

            {/* Details */}
            <div style={{padding:"12px 18px",borderBottom:"1px solid var(--bdr)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 14px",fontSize:12}}>
                {[
                  ["📅",lang==="ru"?"Дата":"Date", `${bk.date} · ${bk.time}`],
                  ["🔄",lang==="ru"?"Частота":"Freq", FREQ_LABELS[bk.frequency]||"—"],
                  ["🛏",lang==="ru"?"Размер":"Size", `${bk.beds===0?"Studio":`${bk.beds}bd`} / ${bk.baths}ba`],
                  ["🧹",lang==="ru"?"Тип":"Type", ct?.label||"—"],
                  ["⏱",lang==="ru"?"Длит.":"Duration", `${dur}${lang==="ru"?"ч":"h"}`],
                  ["👤",lang==="ru"?"Клинер":"Cleaner", emp?.name||(lang==="ru"?"Не назначен":"Unassigned")],
                ].map(([ico,lbl,val])=>(
                  <div key={lbl}>
                    <div style={{fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.4,marginBottom:1}}>{ico} {lbl}</div>
                    <div style={{fontWeight:500}}>{val}</div>
                  </div>
                ))}
              </div>
              {bk.notes&&<div style={{fontSize:11,color:"var(--mu)",marginTop:10,padding:"6px 10px",background:"var(--s2)",borderRadius:7}}>📝 {bk.notes}</div>}
            </div>

            {/* Price + status + payment */}
            <div style={{padding:"10px 18px",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,padding:"3px 9px",borderRadius:5,background:sc+"20",color:sc,fontWeight:600}}>{STATUS_LABELS[bk.status]}</span>
              {bk.paymentMethod&&<span style={{fontSize:12}}>{PM_ICO[bk.paymentMethod]||""} <span style={{fontSize:10,color:"var(--mu)"}}>{bk.paymentMethod?.toUpperCase()}</span></span>}
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"var(--acc)",marginLeft:"auto"}}>{bkSettings.currency}{displayPrice}</span>
              {bk.tipAmt>0&&<span style={{fontSize:10,color:"var(--gr)"}}>+${bk.tipAmt} tip</span>}
            </div>

            {/* Quick status change */}
            <div style={{padding:"10px 18px",borderBottom:"1px solid var(--bdr)"}}>
              <div style={{fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.4,marginBottom:7}}>{lang==="ru"?"Изменить статус":"Change Status"}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {Object.entries(STATUS_LABELS).map(([k,v])=>(
                  <button key={k} onClick={()=>changeStatus(k)}
                    style={{padding:"4px 10px",borderRadius:6,fontSize:10,cursor:"pointer",
                      border:`1px solid ${bk.status===k?STATUS_COLORS[k]:"var(--bdr)"}`,
                      background:bk.status===k?STATUS_COLORS[k]+"20":"transparent",
                      color:bk.status===k?STATUS_COLORS[k]:"var(--mu)",fontWeight:bk.status===k?700:400}}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Charge confirm */}
            {chargeConfirm&&(
              <div style={{margin:"0 18px 10px",padding:12,background:"#22c55e15",border:"1px solid #22c55e40",borderRadius:10}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>💳 {lang==="ru"?"Подтвердить снятие":"Confirm charge"} {bkSettings.currency}{displayPrice}?</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{addLog(`💳 ${lang==="ru"?"Оплата снята":"Payment charged"}: $${displayPrice}`);setChargeConfirm(false);}}
                    style={{flex:1,padding:"7px 0",background:"#22c55e",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:12}}>
                    ✓ {lang==="ru"?"Снять $":"Charge $"}{displayPrice}
                  </button>
                  <button onClick={()=>setChargeConfirm(false)}
                    style={{padding:"7px 12px",background:"transparent",border:"1px solid var(--bdr)",borderRadius:7,cursor:"pointer",fontSize:12,color:"var(--mu)"}}>
                    {lang==="ru"?"Отмена":"Cancel"}
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{padding:"10px 18px",display:"flex",flexDirection:"column",gap:6}}>
              {/* Edit / Delete top row */}
              <div style={{display:"flex",gap:6,marginBottom:2}}>
                <button onClick={()=>{setBkF({...bk,priceOverride:bk.priceOverride??null,durOverride:bk.durOverride??null});onClose();setBkForm(true);}}
                  style={{flex:1,padding:"9px 0",background:"var(--acc)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12}}>
                  ✏️ {lang==="ru"?"Редактировать":"Edit"}
                </button>
                <button onClick={()=>{changeStatus("cancelled");}}
                  style={{flex:1,padding:"9px 0",background:"#ef444415",color:"#ef4444",border:"1px solid #ef444430",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12}}>
                  🚫 {lang==="ru"?"Отменить":"Cancel"}
                </button>
              </div>
              {ACTIONS.map((a,i)=>(
                <button key={i} onClick={a.onClick}
                  style={{width:"100%",padding:"9px 14px",textAlign:"left",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:12,
                    background:a.color,color:a.tc,border:a.border?"1px solid var(--bdr)":"none",
                    display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  {a.label}
                  <span style={{opacity:.5,fontSize:14}}>›</span>
                </button>
              ))}
            </div>

            {/* Checklist */}
            {showChecklist&&(
              <div style={{margin:"0 18px 12px",background:"var(--s2)",borderRadius:10,padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:11,fontWeight:700}}>📋 {lang==="ru"?"Чеклист":"Checklist"}</span>
                  <span style={{fontSize:10,color:"var(--gr)",fontWeight:600}}>{doneCount}/{checklist.length}</span>
                </div>
                {checklist.map(item=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7,cursor:"pointer"}}
                    onClick={()=>saveChecklist(checklist.map(c=>c.id===item.id?{...c,done:!c.done}:c))}>
                    <div style={{width:18,height:18,borderRadius:4,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                      background:item.done?"var(--gr)":"transparent",border:`2px solid ${item.done?"var(--gr)":"var(--bdr)"}`}}>
                      {item.done&&<span style={{color:"#fff",fontSize:11,lineHeight:1}}>✓</span>}
                    </div>
                    <span style={{fontSize:12,textDecoration:item.done?"line-through":"none",color:item.done?"var(--mu)":"var(--tx)"}}>{item.text}</span>
                  </div>
                ))}
                {doneCount===checklist.length&&checklist.length>0&&(
                  <div style={{textAlign:"center",fontSize:11,color:"var(--gr)",fontWeight:600,paddingTop:6}}>✅ {lang==="ru"?"Всё готово!":"All done!"}</div>
                )}
              </div>
            )}

            {/* Log */}
            {showLog&&(
              <div style={{margin:"0 18px 12px",background:"var(--s2)",borderRadius:10,padding:12}}>
                <div style={{fontSize:11,fontWeight:700,marginBottom:8}}>📜 {lang==="ru"?"Лог":"Log"}</div>
                {log.length===0&&<div style={{fontSize:11,color:"var(--mu)"}}>{lang==="ru"?"Нет событий":"No events"}</div>}
                {log.map((e,i)=>(
                  <div key={i} style={{fontSize:10,display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                    <span style={{color:"var(--mu)",flexShrink:0}}>{e.at}</span>
                    <span>{e.action}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      );
    };

    // ── Week Calendar ──
    const WeekCalendar = () => {
      const hours = Array.from({length:11},(_,i)=>i+7); // 7am-5pm
      return (
        <div style={{overflowX:"auto"}}>
          {/* Day headers */}
          <div style={{display:"grid",gridTemplateColumns:"50px repeat(7,1fr)",gap:0,marginBottom:4,minWidth:600}}>
            <div/>
            {weekDates.map(d=>{
              const ds=getDateStr(d);
              const cnt=getDayBks(ds).length;
              const isToday=ds===today;
              return (
                <div key={ds} style={{textAlign:"center",padding:"6px 4px",borderRadius:8,
                  background:isToday?"var(--acc)15":"transparent",marginBottom:4}}>
                  <div style={{fontSize:10,color:isToday?"var(--acc)":"var(--mu)",fontWeight:600}}>{DAY_NAMES_SHORT[d.getDay()]}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:isToday?"var(--acc)":"var(--tx)"}}>{d.getDate()}</div>
                  {cnt>0&&<div style={{fontSize:9,color:"var(--mu)"}}>{cnt} {lang==="ru"?"заяв":"bk"}</div>}
                </div>
              );
            })}
          </div>
          {/* Hour rows */}
          <div style={{display:"grid",gridTemplateColumns:"50px repeat(7,1fr)",minWidth:600,border:"1px solid var(--bdr)",borderRadius:10,overflow:"hidden"}}>
            {hours.map(hr=>(
              <>
                <div key={`h${hr}`} style={{padding:"4px 6px",fontSize:10,color:"var(--mu)",borderBottom:"1px solid var(--bdr)",background:"var(--s2)",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                  {hr}:00
                </div>
                {weekDates.map(d=>{
                  const ds = getDateStr(d);
                  const hourBks = getDayBks(ds).filter(b=>{
                    const bh=parseInt((b.time||"00").split(":")[0]);
                    return bh===hr;
                  });
                  return (
                    <div key={ds+hr} style={{minHeight:44,borderLeft:"1px solid var(--bdr)",borderBottom:"1px solid var(--bdr)",
                      padding:"2px 3px",position:"relative",cursor:"pointer"}}
                      onClick={()=>{
                        const t=`${String(hr).padStart(2,"0")}:00`;
                        setBkF({...defBkF,date:ds,time:t});setBkForm(true);
                      }}>
                      {hourBks.map(bk=>{
                        const cl=bkClients.find(c=>c.id===bk.clientId);
                        const cc=cleanerColor(bk.cleanerId);
                        return (
                          <div key={bk.id+ds} onClick={e=>{e.stopPropagation();setPopupBk(bk);}}
                            style={{fontSize:9,padding:"2px 4px",borderRadius:4,background:cc+"22",
                              color:cc,border:`1px solid ${cc}40`,marginBottom:2,cursor:"pointer",
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.4}}>
                            {bk._recurring?"🔄 ":""}{bk.time} {cl?.name||"?"}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      );
    };

    // ── Month Calendar ──
    const MonthCalendar = () => {
      const firstDay=new Date(yr,mo,1).getDay(), days=new Date(yr,mo+1,0).getDate();
      const cells=[]; for(let i=0;i<firstDay;i++)cells.push(null); for(let d=1;d<=days;d++)cells.push(d);
      return (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
            {DAY_NAMES_SHORT.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:"var(--mu)",padding:"3px 0",fontWeight:600}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {cells.map((day,i)=>{
              if(!day) return <div key={i}/>;
              const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const dayBks=getDayBks(ds);
              const isToday=ds===today;
              return (
                <div key={i} style={{minHeight:72,background:isToday?"var(--acc)12":"var(--s1)",
                  border:`1px solid ${isToday?"var(--acc)":"var(--bdr)"}`,borderRadius:8,padding:"5px 6px",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--acc)30"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=isToday?"var(--acc)":"var(--bdr)"}
                  onClick={()=>{setBkF({...defBkF,date:ds});setBkForm(true);}}>
                  <div style={{fontSize:12,fontWeight:isToday?700:500,color:isToday?"var(--acc)":"var(--tx)",marginBottom:3}}>{day}</div>
                  {dayBks.slice(0,3).map(bk=>{
                    const cl=bkClients.find(c=>c.id===bk.clientId);
                    const cc=cleanerColor(bk.cleanerId);
                    return (
                      <div key={bk.id} onClick={e=>{e.stopPropagation();setPopupBk(bk);}}
                        style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:cc+"25",color:cc,
                          marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer",border:`1px solid ${cc}30`}}>
                        {bk.time} {cl?.name||"?"}
                      </div>
                    );
                  })}
                  {dayBks.length>3&&<div style={{fontSize:8,color:"var(--mu)"}}>+{dayBks.length-3}</div>}
                </div>
              );
            })}
          </div>
        </>
      );
    };

    // ── Settings ──
    const SettingsPanel = () => {
      const SIZE = SETT_SIZE;
      const lm  = settLM,  setLM  = setSettLM;
      const ldm = settLDM, setLDM = setSettLDM;
      const lt  = settLT,  setLT  = setSettLT;
      const la  = settLA,  setLA  = setSettLA;
      const lfd = settLFD, setLFD = setSettLFD;
      const p1  = settP1,  setP1  = setSettP1;
      const p2  = settP2,  setP2  = setSettP2;

      function autoFillMatrix() {
        const totalRooms1 = p1.beds + p1.baths;
        const totalRooms2 = p2.beds + p2.baths;
        if (totalRooms1 === totalRooms2) return;
        const pricePerRoom = (p2.price - p1.price) / (totalRooms2 - totalRooms1);
        const durPerRoom   = (p2.dur   - p1.dur)   / (totalRooms2 - totalRooms1);
        const basePrice    = p1.price - (p1.beds + p1.baths) * pricePerRoom;
        const baseDur      = p1.dur   - (p1.beds + p1.baths) * durPerRoom;

        const newM  = Array.from({length:SIZE},(_,r)=>Array.from({length:SIZE},(_,c)=>
          Math.max(0, Math.round(basePrice + r*pricePerRoom + (c+1)*pricePerRoom))
        ));
        const newDM = Array.from({length:SIZE},(_,r)=>Array.from({length:SIZE},(_,c)=>
          Math.max(0, Math.round((baseDur + r*durPerRoom + (c+1)*durPerRoom)*10)/10)
        ));
        setLM(newM);
        setLDM(newDM);
        saveBkSettings({matrix:newM, durMatrix:newDM});
        setSettSaved(true);
        setTimeout(()=>setSettSaved(false), 3000);
      }

      const BL = ["Studio","1 bd","2 bd","3 bd","4 bd","5 bd","6 bd","7 bd","8 bd","9 bd"];
      const HL = ["1 ba","2 ba","3 ba","4 ba","5 ba","6 ba","7 ba","8 ba","9 ba","10 ba"];

      const tabs = [
        ["smart",   lang==="ru"?"⚡ Автонастройка":"⚡ Smart Setup"],
        ["matrix",  lang==="ru"?"💰 Матрица цен":"💰 Price Matrix"],
        ["dur",     lang==="ru"?"⏱ Матрица времени":"⏱ Duration Matrix"],
        ["disc",    lang==="ru"?"🏷 Скидки":"🏷 Discounts"],
        ["types",   lang==="ru"?"Типы уборки":"Clean Types"],
        ["addons",  lang==="ru"?"Доп услуги":"Add-ons"],
      ];

      return (
        <>
          <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
            {tabs.map(([k,v])=>(
              <button key={k} onClick={()=>setSettTab(k)} style={{padding:"5px 11px",borderRadius:7,fontSize:11,cursor:"pointer",
                border:`1px solid ${settingsTab===k?"var(--acc)":"var(--bdr)"}`,
                background:settingsTab===k?"var(--acc)18":"transparent",
                color:settingsTab===k?"var(--acc)":"var(--mu)"}}>
                {v}
              </button>
            ))}
          </div>

          {/* ── SMART SETUP ── */}
          {settingsTab==="smart"&&(
            <div>
              {/* Header */}
              <div style={{background:"var(--acc)10",border:"1px solid var(--acc)30",borderRadius:12,padding:14,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>⚡ {lang==="ru"?"Умная настройка цен":"Smart Price Setup"}</div>
                <div style={{fontSize:11,color:"var(--mu)",lineHeight:1.5}}>
                  {lang==="ru"
                    ?"Введи 2 ориентира по каждому типу уборки — система рассчитает цены и множители автоматически."
                    :"Enter 2 anchor points per clean type — system auto-calculates prices and multipliers."}
                </div>
              </div>

              {/* Type sub-tabs */}
              {(()=>{
                const smartTypes = [
                  {id:"standard",  label:lang==="ru"?"🧹 Стандарт":"🧹 Standard",  color:"var(--bl)"},
                  {id:"deep",      label:lang==="ru"?"🧽 Дип клининг":"🧽 Deep Clean", color:"#8b5cf6"},
                  {id:"moveinout", label:lang==="ru"?"📦 Мув ин/аут":"📦 Move In/Out", color:"#f59e0b"},
                  {id:"airbnb",    label:"🏠 AirBnB",                              color:"#ef4444"},
                ];

                const curType = settSmartTab;
                const isStandard = curType === "standard";

                // Get anchors for current type
                const p1 = isStandard ? settP1 : typeAnchors[curType]?.p1 || {beds:1,baths:1,price:120,dur:1.5};
                const p2 = isStandard ? settP2 : typeAnchors[curType]?.p2 || {beds:2,baths:2,price:180,dur:3.0};
                const setP1 = v => isStandard ? setSettP1(v) : setTypeAnchors(a=>({...a,[curType]:{...a[curType],p1:typeof v==="function"?v(a[curType].p1):v}}));
                const setP2 = v => isStandard ? setSettP2(v) : setTypeAnchors(a=>({...a,[curType]:{...a[curType],p2:typeof v==="function"?v(a[curType].p2):v}}));

                // Calc preview
                const totalRooms1 = p1.beds + p1.baths;
                const totalRooms2 = p2.beds + p2.baths;
                const valid = totalRooms1 !== totalRooms2;
                const priceStep = valid ? Math.round((p2.price-p1.price)/(totalRooms2-totalRooms1)) : 0;
                const durStep   = valid ? Math.round((p2.dur-p1.dur)/(totalRooms2-totalRooms1)*10)/10 : 0;

                // For non-standard: compute multiplier vs standard matrix
                function getMultiplier() {
                  if (!valid) return null;
                  const stdP1 = settLM[p1.beds]?.[p1.baths-1] || 1;
                  const stdP2 = settLM[p2.beds]?.[p2.baths-1] || 1;
                  const m1 = stdP1 > 0 ? p1.price / stdP1 : 1;
                  const m2 = stdP2 > 0 ? p2.price / stdP2 : 1;
                  return Math.round(((m1+m2)/2)*100)/100;
                }

                function handleCalc() {
                  if (!valid) return;
                  if (isStandard) {
                    autoFillMatrix();
                  } else {
                    const mult = getMultiplier();
                    if (!mult) return;
                    // Also fill type-specific durMatrix via mult on standard dur
                    const newTypes = settLT.map(t => t.id === curType ? {...t, mult} : t);
                    // If airbnb doesn't exist yet, add it
                    const exists = newTypes.find(t=>t.id===curType);
                    const finalTypes = exists ? newTypes : [...newTypes, {
                      id:curType,
                      label: curType==="airbnb"?"Airbnb":curType==="deep"?(lang==="ru"?"Глубокая":"Deep Clean"):(lang==="ru"?"Переезд":"Move In/Out"),
                      mult
                    }];
                    setSettLT(finalTypes);
                    saveBkSettings({cleanTypes: finalTypes});
                    setTypeSaved(s=>({...s,[curType]:true}));
                    setTimeout(()=>setTypeSaved(s=>({...s,[curType]:false})), 3000);
                  }
                }

                const typeColor = smartTypes.find(t=>t.id===curType)?.color||"var(--acc)";
                const curMult = settLT.find(t=>t.id===curType)?.mult;
                const savedNow = isStandard ? settSaved : typeSaved[curType];

                return (
                  <>
                    {/* Sub-tab buttons */}
                    <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
                      {smartTypes.map(({id,label,color})=>(
                        <button key={id} onClick={()=>setSettSmartTab(id)}
                          style={{padding:"6px 12px",borderRadius:8,fontSize:11,cursor:"pointer",fontWeight:600,
                            border:`2px solid ${settSmartTab===id?color:"var(--bdr)"}`,
                            background:settSmartTab===id?color+"20":"transparent",
                            color:settSmartTab===id?color:"var(--mu)"}}>
                          {label}
                          {id!=="standard"&&settLT.find(t=>t.id===id)&&(
                            <span style={{marginLeft:5,fontSize:9,opacity:.7}}>×{settLT.find(t=>t.id===id)?.mult}</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Non-standard info banner */}
                    {!isStandard&&(
                      <div style={{background:typeColor+"12",border:`1px solid ${typeColor}30`,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:11}}>
                        <span style={{color:typeColor,fontWeight:700}}>
                          {curType==="deep"?(lang==="ru"?"Глубокая уборка":"Deep Clean"):
                           curType==="moveinout"?(lang==="ru"?"Переезд (Мув ин/аут)":"Move In/Out"):
                           "AirBnB"}
                        </span>
                        <span style={{color:"var(--mu)",marginLeft:6}}>
                          {lang==="ru"
                            ?"— введи 2 примера цены. Система рассчитает множитель относительно Стандарта."
                            :"— enter 2 price examples. System calculates multiplier vs Standard."}
                        </span>
                        {curMult&&<span style={{marginLeft:8,padding:"2px 8px",borderRadius:4,background:typeColor+"20",color:typeColor,fontWeight:700}}>
                          {lang==="ru"?"Текущий множитель":"Current mult"}: ×{curMult}
                        </span>}
                      </div>
                    )}

                    {/* Anchor inputs */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                      {[{p:p1,setP:setP1,label:lang==="ru"?"📍 Ориентир 1":"📍 Anchor 1",color:"var(--bl)"},
                        {p:p2,setP:setP2,label:lang==="ru"?"📍 Ориентир 2":"📍 Anchor 2",color:typeColor}]
                        .map(({p,setP,label,color})=>(
                        <div key={label} style={{background:"var(--s2)",borderRadius:11,padding:12,border:`1px solid ${color}25`}}>
                          <div style={{fontSize:11,fontWeight:700,color,marginBottom:9}}>{label}</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                            <div>
                              <label className="lbl">{lang==="ru"?"Спален":"Beds"}</label>
                              <select className="inp" value={p.beds} onChange={e=>setP(x=>({...x,beds:+e.target.value}))}>
                                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} bd</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="lbl">{lang==="ru"?"Ванных":"Baths"}</label>
                              <select className="inp" value={p.baths} onChange={e=>setP(x=>({...x,baths:+e.target.value}))}>
                                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} ba</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="lbl">💰 {lang==="ru"?"Цена $":"Price $"}</label>
                              <input type="number" className="inp" value={p.price}
                                onChange={e=>setP(x=>({...x,price:+e.target.value}))} style={{textAlign:"center"}}/>
                            </div>
                            <div>
                              <label className="lbl">⏱ {lang==="ru"?"Время ч":"Hours"}</label>
                              <input type="number" step="0.1" className="inp" value={p.dur}
                                onChange={e=>setP(x=>({...x,dur:+e.target.value}))} style={{textAlign:"center"}}/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Preview */}
                    <div style={{background:"var(--s2)",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:11}}>
                      <div style={{fontWeight:600,color:"var(--tx)",marginBottom:5}}>{lang==="ru"?"Предпросмотр:":"Preview:"}</div>
                      {!valid
                        ? <span style={{color:"#ef4444"}}>{lang==="ru"?"Ориентиры должны отличаться по кол-ву комнат":"Anchors must differ in room count"}</span>
                        : <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                            <span>📈 {lang==="ru"?"Шаг цены":"Price step"}: <b style={{color:"var(--acc)"}}>+${priceStep}</b> {lang==="ru"?"за комнату":"per room"}</span>
                            <span>⏱ {lang==="ru"?"Шаг времени":"Duration step"}: <b style={{color:"var(--bl)"}}>+{durStep}h</b> {lang==="ru"?"за комнату":"per room"}</span>
                            {!isStandard&&settLM[1]?.[0]>0&&(
                              <span>✖ {lang==="ru"?"Множитель":"Multiplier"}: <b style={{color:typeColor}}>×{getMultiplier()}</b> {lang==="ru"?"от Стандарта":"vs Standard"}</span>
                            )}
                          </div>
                      }
                    </div>

                    {/* Success */}
                    {savedNow&&(
                      <div style={{background:"#22c55e15",border:"1px solid #22c55e40",borderRadius:10,padding:"9px 14px",marginBottom:10,
                        display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#22c55e",fontWeight:600}}>
                        ✅ {isStandard
                          ? (lang==="ru"?"Матрица рассчитана и сохранена!":"Matrix calculated and saved!")
                          : (lang==="ru"?"Множитель сохранён!":"Multiplier saved!")}
                        {isStandard&&<button onClick={()=>setSettTab("matrix")}
                          style={{marginLeft:"auto",fontSize:11,background:"#22c55e",color:"#fff",border:"none",borderRadius:6,padding:"3px 10px",cursor:"pointer"}}>
                          {lang==="ru"?"Смотреть →":"View →"}
                        </button>}
                      </div>
                    )}

                    {/* Calc button */}
                    <button style={{width:"100%",padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",
                      background:typeColor,color:"#fff",border:"none",borderRadius:9}}
                      onClick={handleCalc}>
                      ⚡ {isStandard
                        ? (lang==="ru"?"Рассчитать всю матрицу (9×10)":"Calculate Full Matrix (9×10)")
                        : (lang==="ru"?`Рассчитать множитель и сохранить`:`Calculate Multiplier & Save`)}
                    </button>

                    {/* Post-calc preview grid */}
                    {isStandard&&settLM[1]?.[0]>0&&(
                      <div style={{marginTop:12,background:"var(--s2)",borderRadius:10,padding:12}}>
                        <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.4}}>
                          {lang==="ru"?"Результат — стандартная уборка:":"Result — Standard Clean:"}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                          {[[1,1],[2,1],[2,2],[3,2]].map(([b,ba])=>{
                            const pr=settLM[b]?.[ba-1]||0;
                            const dr=settLDM[b]?.[ba-1]||0;
                            return (
                              <div key={`${b}-${ba}`} style={{background:"var(--s1)",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                                <div style={{fontSize:9,color:"var(--mu)"}}>{b}bd/{ba}ba</div>
                                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--acc)",fontSize:14}}>${pr}</div>
                                <div style={{fontSize:9,color:"var(--bl)"}}>{dr}h</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {!isStandard&&settLT.find(t=>t.id===curType)&&settLM[1]?.[0]>0&&(
                      <div style={{marginTop:12,background:"var(--s2)",borderRadius:10,padding:12}}>
                        <div style={{fontSize:10,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.4}}>
                          {lang==="ru"?"Результат — цены с множителем:":"Result — Prices with multiplier:"}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                          {[[1,1],[2,1],[2,2],[3,2]].map(([b,ba])=>{
                            const mult=settLT.find(t=>t.id===curType)?.mult||1;
                            const pr=Math.round((settLM[b]?.[ba-1]||0)*mult);
                            const dr=Math.round((settLDM[b]?.[ba-1]||0)*mult*10)/10;
                            return (
                              <div key={`${b}-${ba}`} style={{background:"var(--s1)",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                                <div style={{fontSize:9,color:"var(--mu)"}}>{b}bd/{ba}ba</div>
                                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:typeColor,fontSize:14}}>${pr}</div>
                                <div style={{fontSize:9,color:"var(--bl)"}}>{dr}h</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}



          {/* ── PRICE MATRIX ── */}
          {settingsTab==="matrix"&&(
            <div>
              <div style={{fontSize:11,color:"var(--mu)",marginBottom:10}}>
                {lang==="ru"?"Базовая цена (Standard). Тип уборки применяет множитель.":"Base price (Standard). Clean type applies multiplier."}
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr>
                    <th style={{padding:"5px 8px",fontSize:10,color:"var(--mu)",textAlign:"left",minWidth:60}}>{lang==="ru"?"Сп\\Ван":"Bd\\Ba"}</th>
                    {HL.map((h,ci)=><th key={ci} style={{padding:"5px 8px",color:"var(--bl)",textAlign:"center",minWidth:68}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{lm.map((row,ri)=>(
                    <tr key={ri}>
                      <td style={{padding:"4px 8px",color:"var(--acc)",fontWeight:600}}>{BL[ri]}</td>
                      {row.map((v,ci)=>(
                        <td key={ci} style={{padding:2}}>
                          <div style={{display:"flex",alignItems:"center",gap:1}}>
                            <span style={{fontSize:10,color:"var(--mu)"}}>$</span>
                            <input type="number" value={v} onChange={e=>{const m=lm.map(r=>[...r]);m[ri][ci]=+e.target.value;setLM(m);}}
                              style={{width:58,padding:"3px 4px",borderRadius:5,border:"1px solid var(--bdr)",background:"var(--s2)",color:"var(--tx)",fontSize:11,textAlign:"center"}}/>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <button className="btn btn-p" style={{marginTop:12}} onClick={()=>saveBkSettings({matrix:lm})}>{lang==="ru"?"Сохранить":"Save"}</button>
            </div>
          )}

          {/* ── DURATION MATRIX ── */}
          {settingsTab==="dur"&&(
            <div>
              <div style={{fontSize:11,color:"var(--mu)",marginBottom:10}}>
                {lang==="ru"?"Базовое время (часы, 1 клинер, Standard). При 2 клинерах делится пополам.":"Base duration (hours, 1 cleaner, Standard). With 2 cleaners it's halved."}
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr>
                    <th style={{padding:"5px 8px",fontSize:10,color:"var(--mu)",textAlign:"left",minWidth:60}}>{lang==="ru"?"Сп\\Ван":"Bd\\Ba"}</th>
                    {HL.map((h,ci)=><th key={ci} style={{padding:"5px 8px",color:"var(--bl)",textAlign:"center",minWidth:68}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{ldm.map((row,ri)=>(
                    <tr key={ri}>
                      <td style={{padding:"4px 8px",color:"var(--acc)",fontWeight:600}}>{BL[ri]}</td>
                      {row.map((v,ci)=>(
                        <td key={ci} style={{padding:2}}>
                          <input type="number" step="0.1" min="0" value={v} onChange={e=>{const m=ldm.map(r=>[...r]);m[ri][ci]=+e.target.value;setLDM(m);}}
                            style={{width:58,padding:"3px 4px",borderRadius:5,border:"1px solid var(--bdr)",background:"var(--s2)",color:"var(--tx)",fontSize:11,textAlign:"center"}}/>
                        </td>
                      ))}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <button className="btn btn-p" style={{marginTop:12}} onClick={()=>saveBkSettings({durMatrix:ldm})}>{lang==="ru"?"Сохранить":"Save"}</button>
            </div>
          )}

          {/* ── FREQUENCY DISCOUNTS ── */}
          {settingsTab==="disc"&&(
            <div>
              <div style={{fontSize:11,color:"var(--mu)",marginBottom:14}}>
                {lang==="ru"?"Скидка применяется автоматически при выборе регулярности.":"Discount applies automatically when a recurring frequency is selected."}
              </div>
              {[
                ["weekly",   lang==="ru"?"Каждую неделю":"Weekly"],
                ["biweekly", lang==="ru"?"Раз в 2 нед":"Every 2 weeks"],
                ["monthly",  lang==="ru"?"Раз в 4 нед":"Every 4 weeks"],
              ].map(([k,label])=>{
                const pct=lfd[k]||0;
                const exampleBase=120;
                const discounted=Math.round(exampleBase*(1-pct/100));
                return (
                  <div key={k} style={{background:"var(--s2)",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{label}</div>
                      <div style={{fontSize:10,color:"var(--mu)",marginTop:2}}>
                        {lang==="ru"?"Пример: $120":"Example: $120"} → <span style={{color:"var(--gr)",fontWeight:600}}>${discounted}</span>
                        {pct>0&&<span style={{color:"var(--gr)"}}> (-{pct}%)</span>}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <input type="number" min="0" max="50" value={pct}
                        onChange={e=>setLFD(f=>({...f,[k]:+e.target.value}))}
                        style={{width:60,padding:"6px 8px",borderRadius:7,border:"1px solid var(--bdr)",background:"var(--s1)",color:"var(--tx)",fontSize:14,fontWeight:700,textAlign:"center"}}/>
                      <span style={{fontSize:12,color:"var(--mu)"}}>%</span>
                    </div>
                  </div>
                );
              })}
              <button className="btn btn-p" style={{marginTop:6}} onClick={()=>saveBkSettings({freqDiscounts:lfd})}>{lang==="ru"?"Сохранить скидки":"Save Discounts"}</button>
            </div>
          )}

          {/* ── CLEAN TYPES ── */}
          {settingsTab==="types"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {lt.map((ct,i)=>(
                <div key={ct.id} style={{background:"var(--s2)",borderRadius:9,padding:"10px 14px",display:"flex",gap:10,alignItems:"center"}}>
                  <input className="inp" value={ct.label} onChange={e=>{const a=[...lt];a[i]={...a[i],label:e.target.value};setLT(a);}} style={{flex:1}}/>
                  <span style={{fontSize:12,color:"var(--mu)"}}>×</span>
                  <input type="number" step="0.1" min="0.5" max="5" value={ct.mult}
                    onChange={e=>{const a=[...lt];a[i]={...a[i],mult:+e.target.value};setLT(a);}}
                    style={{width:60,padding:"4px 6px",borderRadius:5,border:"1px solid var(--bdr)",background:"var(--s1)",color:"var(--tx)",fontSize:12}}/>
                  <span style={{fontSize:11,color:"var(--gr)"}}>→ {bkSettings.currency}{Math.round((lm?.[2]?.[1]||140)*ct.mult)}</span>
                </div>
              ))}
              <button className="btn btn-p" onClick={()=>saveBkSettings({cleanTypes:lt})}>{lang==="ru"?"Сохранить":"Save"}</button>
            </div>
          )}

          {/* ── ADD-ONS ── */}
          {settingsTab==="addons"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {la.map((a,i)=>(
                <div key={a.id} style={{background:"var(--s2)",borderRadius:9,padding:"10px 14px",display:"flex",gap:10,alignItems:"center"}}>
                  <input className="inp" value={a.label} onChange={e=>{const ar=[...la];ar[i]={...ar[i],label:e.target.value};setLA(ar);}} style={{flex:1}}/>
                  <span style={{fontSize:12,color:"var(--mu)"}}>$</span>
                  <input type="number" value={a.price} onChange={e=>{const ar=[...la];ar[i]={...ar[i],price:+e.target.value};setLA(ar);}}
                    style={{width:65,padding:"4px 6px",borderRadius:5,border:"1px solid var(--bdr)",background:"var(--s1)",color:"var(--tx)",fontSize:12}}/>
                  <button className="btn btn-d btn-sm" onClick={()=>setLA(la.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-g" onClick={()=>setLA([...la,{id:"a_"+Date.now(),label:"",price:0}])}>+ {lang==="ru"?"Добавить":"Add"}</button>
                <button className="btn btn-p" onClick={()=>saveBkSettings({addons:la})}>{lang==="ru"?"Сохранить":"Save"}</button>
              </div>
            </div>
          )}
        </>
      );
    };

    // ── Reports ──
    const Reports = () => {
      const [period,setPeriod]=useState("month");
      const now=new Date(), nowStr=now.toISOString().split("T")[0];
      const monthStr=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
      const weekAgo=new Date(now); weekAgo.setDate(weekAgo.getDate()-7);
      const filtered = bookings.filter(b=>{
        if (period==="week") return b.date>=getDateStr(weekAgo)&&b.date<=nowStr;
        if (period==="month") return b.date?.startsWith(monthStr);
        return true;
      });
      const revenue=filtered.reduce((s,b)=>s+(b.price||0),0);
      const avgRevenue=filtered.length?Math.round(revenue/filtered.length):0;
      const byStatus={pending:0,confirmed:0,done:0,cancelled:0};
      filtered.forEach(b=>{ if(byStatus[b.status]!==undefined) byStatus[b.status]++; });
      const byFreq={once:0,weekly:0,biweekly:0,monthly:0};
      filtered.forEach(b=>{ if(byFreq[b.frequency]!==undefined) byFreq[b.frequency]++; });
      const byCleanType={}; filtered.forEach(b=>{byCleanType[b.cleanType]=(byCleanType[b.cleanType]||0)+1;});
      // Top cleaners
      const cleanerStats={}; filtered.filter(b=>b.cleanerId).forEach(b=>{cleanerStats[b.cleanerId]=(cleanerStats[b.cleanerId]||0)+1;});
      const topCleaners=Object.entries(cleanerStats).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,cnt])=>({emp:emps.find(e=>e.id===id),cnt}));

      return (
        <>
          {/* Period selector */}
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {[["week",lang==="ru"?"Эта неделя":"This week"],["month",lang==="ru"?"Этот месяц":"This month"],["all",lang==="ru"?"Всё время":"All time"]].map(([k,v])=>(
              <button key={k} onClick={()=>setPeriod(k)} style={{padding:"5px 12px",borderRadius:7,fontSize:12,cursor:"pointer",
                border:`1px solid ${period===k?"var(--acc)":"var(--bdr)"}`,background:period===k?"var(--acc)18":"transparent",color:period===k?"var(--acc)":"var(--mu)"}}>
                {v}
              </button>
            ))}
          </div>
          {/* Stats grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:18}}>
            {[
              {l:lang==="ru"?"Выручка":"Revenue",      v:`$${revenue}`,              c:"var(--acc)"},
              {l:lang==="ru"?"Заявок":"Bookings",       v:filtered.length,            c:"var(--bl)"},
              {l:lang==="ru"?"Средний чек":"Avg check", v:`$${avgRevenue}`,           c:"var(--gr)"},
              {l:lang==="ru"?"Выполнено":"Completed",   v:byStatus.done||0,           c:"#22c55e"},
              {l:lang==="ru"?"Ожидают":"Pending",        v:byStatus.pending||0,       c:"#f0a500"},
              {l:lang==="ru"?"Отменено":"Cancelled",     v:byStatus.cancelled||0,     c:"#ef4444"},
            ].map(s=>(
              <div key={s.l} style={{background:"var(--s1)",border:`1px solid ${s.c}20`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontSize:10,color:"var(--mu)",marginBottom:3,textTransform:"uppercase",letterSpacing:.4}}>{s.l}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,flexWrap:"wrap"}}>
            {/* Frequency breakdown */}
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>🔄 {lang==="ru"?"По частоте":"By Frequency"}</div>
              {Object.entries(FREQ_LABELS).map(([k,v])=>{
                const cnt=byFreq[k]||0; const pct=filtered.length?Math.round(cnt/filtered.length*100):0;
                return (
                  <div key={k} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span>{v}</span><span style={{fontWeight:600}}>{cnt} <span style={{color:"var(--mu)",fontWeight:400}}>({pct}%)</span></span>
                    </div>
                    <div style={{height:4,borderRadius:2,background:"var(--s3)"}}>
                      <div style={{height:4,borderRadius:2,background:"var(--acc)",width:`${pct}%`,transition:"width .4s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Top cleaners */}
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>🧹 {lang==="ru"?"Топ клинеры":"Top Cleaners"}</div>
              {topCleaners.length===0&&<div style={{color:"var(--mu)",fontSize:12}}>{lang==="ru"?"Нет данных":"No data"}</div>}
              {topCleaners.map(({emp,cnt},i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <Av name={emp?.name||"?"} color={cleanerColor(emp?.id)} style={{width:28,height:28,fontSize:11}}/>
                  <span style={{flex:1,fontSize:12}}>{emp?.name||"?"}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--bl)"}}>{cnt}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    };

    // ── Cleaners tab (full profiles) ──
    const CleanersTab = () => {
      const monthStr2 = `${yr}-${String(mo+1).padStart(2,"0")}`;
      const defCl = {name:"",phone:"",email:"",address:"",city:"",notes:"",status:"active",daysOff:[],workStart:"08:00",workEnd:"18:00",color:""};
      const [clF2, setClF2] = useState(defCl);
      const [search, setSearch] = useState("");

      const cleaners = emps.filter(e=>e.status!=="fired");
      const filtered = cleaners.filter(c=>{
        const q=search.toLowerCase();
        return !q||(c.name||"").toLowerCase().includes(q)||(c.email||"").toLowerCase().includes(q)||(c.phone||"").includes(q);
      });

      function saveCleaner(data) {
        const exists = emps.find(e=>e.id===data.id);
        setPartners(ps=>ps.map(x=>x.id===pid?{...x,
          employees:exists?(x.employees||[]).map(e=>e.id===data.id?{...e,...data}:e):[...(x.employees||[]),data]
        }:x));
      }

      // Color = custom if set, else auto by index
      function getCleanerColor(c) {
        if (c.color) return c.color;
        const idx = emps.findIndex(e=>e.id===c.id);
        return CLEANER_COLORS[Math.abs(idx)%CLEANER_COLORS.length]||"#94a3b8";
      }

      const PALETTE = ["#3b82f6","#a855f7","#22c55e","#f0a500","#ec4899","#06b6d4","#ef4444","#84cc16","#f97316","#8b5cf6","#14b8a6","#f43f5e"];
      const DAYS = lang==="ru"?["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]:["Su","Mo","Tu","We","Th","Fr","Sa"];

      return (
        <>
          {showCrForm&&(
            <div className="ovl" onClick={()=>{setCrForm(false);setEditCrId(null);}}>
              <div className="modal" style={{maxWidth:500}} onClick={e=>e.stopPropagation()}>
                <div className="modal-t">{editCrId?(lang==="ru"?"✏️ Профиль клинера":"✏️ Cleaner Profile"):(lang==="ru"?"+ Новый клинер":"+ New Cleaner")}</div>
                <div className="fr">
                  <div className="fg"><label className="lbl">{lang==="ru"?"Имя *":"Name *"}</label>
                    <input className="inp" value={clF2.name} onChange={e=>setClF2(f=>({...f,name:e.target.value}))} placeholder="Jane Smith"/>
                  </div>
                  <div className="fg"><label className="lbl">{lang==="ru"?"Телефон":"Phone"}</label>
                    <input className="inp" value={clF2.phone||""} onChange={e=>setClF2(f=>({...f,phone:e.target.value}))} placeholder="+1 (512) 000-0000"/>
                  </div>
                </div>
                <div className="fr">
                  <div className="fg"><label className="lbl">Email</label>
                    <input className="inp" value={clF2.email||""} onChange={e=>setClF2(f=>({...f,email:e.target.value}))} placeholder="jane@email.com"/>
                  </div>
                  <div className="fg"><label className="lbl">{lang==="ru"?"Город":"City"}</label>
                    <input className="inp" value={clF2.city||""} onChange={e=>setClF2(f=>({...f,city:e.target.value}))} placeholder="Austin"/>
                  </div>
                </div>
                <div className="fg"><label className="lbl">📍 {lang==="ru"?"Адрес":"Address"}</label>
                  <input className="inp" value={clF2.address||""} onChange={e=>setClF2(f=>({...f,address:e.target.value}))} placeholder="123 Main St"/>
                </div>
                {/* Color picker */}
                <div className="fg">
                  <label className="lbl">🎨 {lang==="ru"?"Цвет в календаре":"Calendar color"}</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4,alignItems:"center"}}>
                    {PALETTE.map(col=>(
                      <button key={col} onClick={()=>setClF2(f=>({...f,color:f.color===col?"":col}))}
                        style={{width:24,height:24,borderRadius:"50%",background:col,cursor:"pointer",
                          border:`3px solid ${clF2.color===col?"var(--tx)":"transparent"}`,
                          outline:`2px solid ${clF2.color===col?col:"transparent"}`,transition:"all .15s"}}>
                      </button>
                    ))}
                    <button onClick={()=>setClF2(f=>({...f,color:""}))}
                      style={{fontSize:10,padding:"2px 8px",borderRadius:5,cursor:"pointer",border:"1px solid var(--bdr)",background:"transparent",color:"var(--mu)"}}>
                      {lang==="ru"?"авто":"auto"}
                    </button>
                  </div>
                </div>
                <div className="fr">
                  <div className="fg"><label className="lbl">🕐 {lang==="ru"?"Нач. работы":"Work Start"}</label>
                    <input className="inp" type="time" value={clF2.workStart||"08:00"} onChange={e=>setClF2(f=>({...f,workStart:e.target.value}))}/>
                  </div>
                  <div className="fg"><label className="lbl">🕐 {lang==="ru"?"Конец работы":"Work End"}</label>
                    <input className="inp" type="time" value={clF2.workEnd||"18:00"} onChange={e=>setClF2(f=>({...f,workEnd:e.target.value}))}/>
                  </div>
                  <div className="fg"><label className="lbl">{lang==="ru"?"Статус":"Status"}</label>
                    <select className="inp" value={clF2.status||"active"} onChange={e=>setClF2(f=>({...f,status:e.target.value}))}>
                      <option value="active">{lang==="ru"?"Активен":"Active"}</option>
                      <option value="inactive">{lang==="ru"?"Неактивен":"Inactive"}</option>
                    </select>
                  </div>
                </div>
                <div className="fg">
                  <label className="lbl">{lang==="ru"?"Выходные дни":"Days Off"}</label>
                  <div style={{display:"flex",gap:5,marginTop:4}}>
                    {DAYS.map((d,i)=>{
                      const on=(clF2.daysOff||[]).includes(i);
                      return (
                        <button key={i} onClick={()=>setClF2(f=>({...f,daysOff:on?(f.daysOff||[]).filter(x=>x!==i):[...(f.daysOff||[]),i]}))}
                          style={{padding:"4px 8px",borderRadius:6,fontSize:11,cursor:"pointer",
                            border:`1px solid ${on?"var(--acc)":"var(--bdr)"}`,
                            background:on?"var(--acc)18":"transparent",color:on?"var(--acc)":"var(--mu)"}}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Заметки":"Notes"}</label>
                  <input className="inp" value={clF2.notes||""} onChange={e=>setClF2(f=>({...f,notes:e.target.value}))} placeholder={lang==="ru"?"Особенности, навыки...":"Skills, notes..."}/>
                </div>
                <div className="ma">
                  <button className="btn btn-g" onClick={()=>{setCrForm(false);setEditCrId(null);}}>{lang==="ru"?"Отмена":"Cancel"}</button>
                  <button className="btn btn-p" onClick={()=>{
                    if(!clF2.name.trim()) return;
                    saveCleaner({...clF2,id:editCrId||"emp_"+Date.now(),type:"employee",partnerId:pid,sections:["booking","tasks","schedule"],role:lang==="ru"?"Клинер":"Cleaner",createdAt:new Date().toISOString().split("T")[0]});
                    setCrForm(false);setEditCrId(null);
                  }}>{lang==="ru"?"Сохранить":"Save"}</button>
                </div>
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
            <input className="inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="ru"?"Поиск клинеров...":"Search cleaners..."} style={{flex:1}}/>
            <button className="btn btn-p" onClick={()=>{setClF2({name:"",phone:"",email:"",address:"",city:"",notes:"",status:"active",daysOff:[],workStart:"08:00",workEnd:"18:00",color:""});setEditCrId(null);setCrForm(true);}}>
              + {lang==="ru"?"Клинер":"Cleaner"}
            </button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {!filtered.length&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"var(--mu)",padding:40}}>🧹 {lang==="ru"?"Клинеров нет":"No cleaners"}</div>}
            {filtered.map(c=>{
              const cc = getCleanerColor(c);
              const cBks = bookings.filter(b=>b.cleanerId===c.id&&b.date?.startsWith(monthStr2));
              const monthEarn = cBks.reduce((s,b)=>s+(b.price||0),0);
              const todayBks2 = bookings.filter(b=>b.cleanerId===c.id&&b.date===today);
              const daysOffStr = (c.daysOff||[]).sort((a,b)=>a-b).map(i=>DAYS[i]).join(", ");
              return (
                <div key={c.id} style={{background:"var(--s1)",border:`1px solid ${cc}30`,borderLeft:`3px solid ${cc}`,borderRadius:10,padding:16}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
                    <Av name={c.name} color={cc} style={{width:44,height:44,fontSize:17,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                        {c.name}
                        <span style={{width:10,height:10,borderRadius:"50%",background:cc,display:"inline-block",flexShrink:0}}/>
                        <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,marginLeft:"auto",
                          background:c.status==="active"?"var(--gr)20":"var(--mu)15",
                          color:c.status==="active"?"var(--gr)":"var(--mu)"}}>
                          {c.status==="active"?(lang==="ru"?"Активен":"Active"):(lang==="ru"?"Неактивен":"Inactive")}
                        </span>
                      </div>
                      {c.phone&&<div style={{fontSize:11,color:"var(--mu)"}}>{c.phone}</div>}
                      {c.email&&<div style={{fontSize:11,color:"var(--mu)"}}>{c.email}</div>}
                    </div>
                    <button className="btn btn-g btn-sm" onClick={()=>{
                      const ec=emps.find(x=>x.id===c.id);
                      if(ec) setClF2({name:ec.name||"",phone:ec.phone||"",email:ec.email||"",address:ec.address||"",city:ec.city||"",notes:ec.notes||"",status:ec.status||"active",daysOff:ec.daysOff||[],workStart:ec.workStart||"08:00",workEnd:ec.workEnd||"18:00",color:ec.color||""});
                      setEditCrId(c.id);setCrForm(true);
                    }}>✏️</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                    {[
                      {l:lang==="ru"?"Сегодня":"Today",  v:todayBks2.length, c:"var(--acc)"},
                      {l:lang==="ru"?"Месяц":"Month",    v:cBks.length,      c:"var(--bl)"},
                      {l:lang==="ru"?"Выручка":"Revenue",v:`$${monthEarn}`,  c:"var(--gr)"},
                    ].map(s=>(
                      <div key={s.l} style={{background:"var(--s2)",borderRadius:7,padding:"6px 8px",textAlign:"center"}}>
                        <div style={{fontSize:8,color:"var(--mu)",textTransform:"uppercase"}}>{s.l}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:s.c}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:"var(--mu)",display:"flex",gap:10,flexWrap:"wrap"}}>
                    {c.workStart&&<span>🕐 {c.workStart}–{c.workEnd}</span>}
                    {daysOffStr&&<span>🗓 {lang==="ru"?"Выходные:":"Off:"} {daysOffStr}</span>}
                    {c.city&&<span>📍 {c.city}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    };

    // ── Clients tab ──
    const ClientsTab = () => {
      const filtered=bkClients.filter(c=>{
        const q=clientSearch.toLowerCase();
        return !q||(c.name||"").toLowerCase().includes(q)||(c.phone||"").includes(q)||(c.email||"").toLowerCase().includes(q);
      });

      return (
        <>
          {showClForm&&(
            <div className="ovl" onClick={()=>{setClForm(false);setEditClId(null);}}>
              <div className="modal" onClick={e=>e.stopPropagation()}>
                <div className="modal-t">{editClId?(lang==="ru"?"✏️ Редактировать":"✏️ Edit"):(lang==="ru"?"+ Новый клиент":"+ New Client")}</div>
                <div className="fr">
                  <div className="fg"><label className="lbl">{lang==="ru"?"Имя *":"Name *"}</label><input className="inp" value={clF.name} onChange={e=>setClF(f=>({...f,name:e.target.value}))} placeholder="Jane Smith"/></div>
                  <div className="fg"><label className="lbl">{lang==="ru"?"Телефон":"Phone"}</label><input className="inp" value={clF.phone} onChange={e=>setClF(f=>({...f,phone:e.target.value}))} placeholder="+1 (512) 000-0000"/></div>
                </div>
                <div className="fr">
                  <div className="fg"><label className="lbl">Email</label><input className="inp" value={clF.email} onChange={e=>setClF(f=>({...f,email:e.target.value}))} placeholder="jane@email.com"/></div>
                  <div className="fg"><label className="lbl">📍 {lang==="ru"?"Город":"City"}</label><input className="inp" value={clF.city} onChange={e=>setClF(f=>({...f,city:e.target.value}))} placeholder="Austin"/></div>
                </div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Адрес уборки":"Cleaning address"}</label><input className="inp" value={clF.address} onChange={e=>setClF(f=>({...f,address:e.target.value}))} placeholder="123 Main St, Austin TX"/></div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Заметки":"Notes"}</label><input className="inp" value={clF.notes} onChange={e=>setClF(f=>({...f,notes:e.target.value}))} placeholder={lang==="ru"?"Особенности...":"Special requests..."}/></div>
                <div className="ma">
                  <button className="btn btn-g" onClick={()=>{setClForm(false);setEditClId(null);}}>{lang==="ru"?"Отмена":"Cancel"}</button>
                  <button className="btn btn-p" onClick={()=>{
                    if(!clF.name.trim()) return;
                    saveClient({...clF,id:editClId||"cl_"+Date.now(),createdAt:new Date().toISOString().split("T")[0]});
                    setClForm(false);setEditClId(null);
                  }}>{lang==="ru"?"Сохранить":"Save"}</button>
                </div>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
            <input className="inp" value={clientSearch} onChange={e=>setClientSearch(e.target.value)} placeholder={lang==="ru"?"Поиск...":"Search..."} style={{flex:1}}/>
            <button className="btn btn-p" onClick={()=>{setClF({name:"",phone:"",email:"",address:"",city:"",notes:""});setEditClId(null);setClForm(true);}}>
              + {lang==="ru"?"Клиент":"Client"}
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {!filtered.length&&<div style={{textAlign:"center",color:"var(--mu)",padding:36,fontSize:13}}>👤 {lang==="ru"?"Клиентов нет":"No clients"}</div>}
            {filtered.map(c=>{
              const cBks=bookings.filter(b=>b.clientId===c.id);
              const total=cBks.reduce((s,b)=>s+(b.price||0),0);
              const last=[...cBks].sort((a,b)=>(b.date||"").localeCompare(a.date||""))[0];
              return (
                <div key={c.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:10,padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
                  <Av name={c.name} color="var(--bl)"/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14}}>{c.name}</div>
                    <div style={{fontSize:11,color:"var(--mu)",display:"flex",gap:10,flexWrap:"wrap"}}>
                      {c.phone&&<span>📞 {c.phone}</span>}
                      {c.city&&<span>📍 {c.city}</span>}
                      {last&&<span>🕐 {lang==="ru"?"Посл.":"Last"}: {last.date}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--acc)"}}>${total}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{cBks.length} {lang==="ru"?"уборок":"cleanings"}</div>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <button className="btn btn-g btn-sm" onClick={()=>{setClF({name:c.name||"",phone:c.phone||"",email:c.email||"",address:c.address||"",city:c.city||"",notes:c.notes||""});setEditClId(c.id);setClForm(true);}}>✏️</button>
                    <button className="btn btn-p btn-sm" onClick={()=>{setBkF({...defBkF,clientId:c.id,notes:c.address||""});setBkForm(true);}}>+ {lang==="ru"?"Запись":"Book"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    };

    // ── Stats bar ──
    const todayBks = bookings.filter(b=>b.date===today);
    const monthStr = `${yr}-${String(mo+1).padStart(2,"0")}`;
    const monthBks = bookings.filter(b=>b.date?.startsWith(monthStr));
    const monthRev = monthBks.reduce((s,b)=>s+(b.price||0),0);

    // ── Cleaners sidebar (right panel on calendar) ──
    const cleanersList = [{id:"",name:lang==="ru"?"Все":"All",cnt:bookings.filter(b=>b.date?.startsWith(monthStr)).length}];
    emps.filter(e=>e.status!=="fired").forEach(e=>{
      cleanersList.push({id:e.id,name:e.name,cnt:bookings.filter(b=>b.cleanerId===e.id&&b.date?.startsWith(monthStr)).length,color:cleanerColor(e.id)});
    });

    return (
      <>
        {popupBk&&<BookingPopup bk={popupBk} onClose={()=>setPopupBk(null)}/>}
        {showBkForm&&<BookingForm onClose={()=>setBkForm(false)}/>}

        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:14}}>
          {[
            {l:lang==="ru"?"Сегодня":"Today",   v:todayBks.length,  c:"var(--acc)"},
            {l:lang==="ru"?"Месяц":"Month",     v:monthBks.length,  c:"var(--bl)"},
            {l:lang==="ru"?"Выручка":"Revenue", v:`$${monthRev}`,   c:"var(--gr)"},
            {l:lang==="ru"?"Клиентов":"Clients",v:bkClients.length, c:"var(--pu)"},
          ].map(s=>(
            <div key={s.l} style={{background:"var(--s1)",border:`1px solid ${s.c}20`,borderRadius:9,padding:"10px 13px"}}>
              <div style={{fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5}}>{s.l}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:s.c,marginTop:2}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Page title from sidebar sub-nav */}
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          {tab==="calendar"&&<>📅 {lang==="ru"?"Календарь":"Calendar"}</>}
          {tab==="cleaners"&&<>🧹 {lang==="ru"?"Клинеры":"Cleaners"}</>}
          {tab==="clients"&&<>👤 {lang==="ru"?"Клиенты":"Clients"}</>}
          {tab==="reports"&&<>📊 {lang==="ru"?"Отчёты":"Reports"}</>}
          {tab==="settings"&&<>⚙️ {lang==="ru"?"Настройки":"Settings"}</>}
        </div>

        {/* Mobile-only horizontal sub-tab bar */}
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14,
          scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}
          className="mob-tabs-bar">
          {[
            {k:"calendar", ico:"📅", l:lang==="ru"?"Календарь":"Calendar"},
            {k:"cleaners", ico:"🧹", l:lang==="ru"?"Клинеры":"Cleaners"},
            {k:"clients",  ico:"👤", l:lang==="ru"?"Клиенты":"Clients"},
            {k:"reports",  ico:"📊", l:lang==="ru"?"Отчёты":"Reports"},
            {k:"settings", ico:"⚙️", l:lang==="ru"?"Настройки":"Settings"},
          ].map(s=>(
            <button key={s.k} onClick={()=>setTab(s.k)}
              style={{flexShrink:0,padding:"6px 12px",borderRadius:20,fontSize:12,cursor:"pointer",
                fontWeight:tab===s.k?700:400,whiteSpace:"nowrap",
                border:`1.5px solid ${tab===s.k?"var(--acc)":"var(--bdr)"}`,
                background:tab===s.k?"var(--acc)":"transparent",
                color:tab===s.k?"#fff":"var(--mu)"}}>
              {s.ico} {s.l}
            </button>
          ))}
        </div>

        {tab==="calendar"&&(
          <div style={{display:"flex",gap:14}}>
            {/* Calendar main area */}
            <div style={{flex:1,minWidth:0}}>
              {/* Calendar controls */}
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
                <button className="btn btn-g btn-sm" onClick={()=>{
                  const d=new Date(viewDate);
                  calView==="week"?d.setDate(d.getDate()-7):d.setMonth(d.getMonth()-1);
                  setViewDate(d);
                }}>‹</button>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,minWidth:160,textAlign:"center"}}>
                  {calView==="week"
                    ? `${weekDates[0].getDate()} – ${weekDates[6].getDate()} ${MONTH_NAMES[weekDates[6].getMonth()]} ${weekDates[6].getFullYear()}`
                    : `${MONTH_NAMES[mo]} ${yr}`}
                </span>
                <button className="btn btn-g btn-sm" onClick={()=>{
                  const d=new Date(viewDate);
                  calView==="week"?d.setDate(d.getDate()+7):d.setMonth(d.getMonth()+1);
                  setViewDate(d);
                }}>›</button>
                <button className="btn btn-g btn-sm" onClick={()=>setViewDate(new Date())}>{lang==="ru"?"Сегодня":"Today"}</button>
                <div style={{marginLeft:"auto",display:"flex",gap:4}}>
                  {[["week",lang==="ru"?"Неделя":"Week"],["month",lang==="ru"?"Месяц":"Month"]].map(([k,v])=>(
                    <button key={k} onClick={()=>setCalView(k)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,cursor:"pointer",
                      border:`1px solid ${calView===k?"var(--acc)":"var(--bdr)"}`,background:calView===k?"var(--acc)18":"transparent",
                      color:calView===k?"var(--acc)":"var(--mu)"}}>
                      {v}
                    </button>
                  ))}
                </div>
                <button className="btn btn-p" onClick={()=>{setBkF(defBkF);setBkForm(true);}}>+ {lang==="ru"?"Заявка":"Booking"}</button>
              </div>
              {calView==="week"?<WeekCalendar/>:<MonthCalendar/>}
            </div>

            {/* Right panel: Cleaners */}
            <div style={{width:190,flexShrink:0}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:8,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5}}>
                {lang==="ru"?"Клинеры":"Providers"}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {cleanersList.map(c=>(
                  <button key={c.id} onClick={()=>setCleanerFilter(cleanerFilter===c.id&&c.id!==""?"":c.id)}
                    style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:8,cursor:"pointer",
                      border:`1px solid ${cleanerFilter===c.id&&c.id!==""?(c.color||"var(--acc)"):"var(--bdr)"}`,
                      background:cleanerFilter===c.id&&c.id!==""?(c.color||"var(--acc)")+"15":"transparent",
                      textAlign:"left",width:"100%"}}>
                    {c.id?<span style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>:<span style={{fontSize:12}}>👁</span>}
                    <span style={{fontSize:12,flex:1,color:"var(--tx)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                    <span style={{fontSize:10,color:"var(--mu)",background:"var(--s3)",borderRadius:10,padding:"1px 5px"}}>{c.cnt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab==="cleaners"&&<CleanersTab/>}
        {tab==="clients"&&<ClientsTab/>}
        {tab==="reports"&&<Reports/>}
        {tab==="settings"&&<SettingsPanel/>}
      </>
    );
  };


  const Training = () => {
    const pid      = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
    const p        = getPartner(pid)||{lessons:[],assignments:[],employees:[],departments:[],branches:[]};
    const lessons  = p?.lessons||[];
    const assigns  = p?.assignments||[];
    const emps     = p?.employees||[];
    const depts    = p?.departments||[];
    const brs      = p?.branches||[];
    const isHR     = isEmp && (currentUser.role||"").toLowerCase().includes("hr");
    const canAdmin = isSA||isPartner||isHR;

    const [tab,     setTab]     = useState(isEmp&&!isHR ? "my" : "lessons");
    const [lsnView, setLsnView] = useState(null);   // open lesson id
    const [quizAns, setQuizAns] = useState({});     // {qIdx: answerIdx}
    const [quizDone,setQuizDone]= useState(false);
    const [lF, setLF] = useState({title:"",deptId:"",branchId:"",type:"video",url:"",content:"",duration:"",quiz:[]});
    const [aF, setAF] = useState({lessonId:"",employeeId:""});
    const [lModal, setLModal] = useState(false);
    const [aModal, setAModal] = useState(false);
    const [qF, setQF] = useState({question:"",options:["","","",""],correct:0});

    // ── CRUD ──
    function saveLesson() {
      if (!lF.title.trim()) return;
      const item = {...lF, id:"lsn_"+Date.now(), createdAt: new Date().toISOString().split("T")[0]};
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,lessons:[...(x.lessons||[]),item]}:x));
      setLF({title:"",deptId:"",branchId:"",type:"video",url:"",content:"",duration:"",quiz:[]});
      setLModal(false);
    }

    function deleteLesson(id) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,
        lessons:(x.lessons||[]).filter(l=>l.id!==id),
        assignments:(x.assignments||[]).filter(a=>a.lessonId!==id)
      }:x));
    }

    function assignLesson() {
      if (!aF.lessonId||!aF.employeeId) return;
      const exists = assigns.find(a=>a.lessonId===aF.lessonId&&a.employeeId===aF.employeeId);
      if (exists) { setAModal(false); return; }
      const item = {...aF, id:"asgn_"+Date.now(), status:"not_started", assignedAt:new Date().toISOString().split("T")[0], completedAt:null, quizScore:null};
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,assignments:[...(x.assignments||[]),item]}:x));
      setAF({lessonId:"",employeeId:""});
      setAModal(false);
    }

    function updateAssign(id, patch) {
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,
        assignments:(x.assignments||[]).map(a=>a.id===id?{...a,...patch}:a)
      }:x));
    }

    function addQuizQ() {
      if (!qF.question.trim()) return;
      setLF(f=>({...f,quiz:[...(f.quiz||[]),{...qF,id:"q_"+Date.now()}]}));
      setQF({question:"",options:["","","",""],correct:0});
    }

    // ── HELPERS ──
    const myAssigns = assigns.filter(a=>a.employeeId===currentUser.id);
    const getAssign = (lsnId,empId)=>assigns.find(a=>a.lessonId===lsnId&&a.employeeId===empId);

    function statusBdg(st) {
      if (st==="completed") return <Bdg cls="b-gr">{t.completed}</Bdg>;
      if (st==="in_progress") return <Bdg cls="b-yw">{t.inProgress}</Bdg>;
      return <Bdg cls="b-mu">{t.notStarted}</Bdg>;
    }

    function progressPct(empId) {
      const myA = assigns.filter(a=>a.employeeId===empId);
      if (!myA.length) return 0;
      return Math.round((myA.filter(a=>a.status==="completed").length/myA.length)*100);
    }

    function CirclePct({pct,size=52,stroke=4,color="var(--acc)"}) {
      const r=( size-stroke*2)/2, circ=2*Math.PI*r, off=circ-(pct/100)*circ;
      return (
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bdr2)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
            style={{transition:"stroke-dashoffset .4s"}}/>
          <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
            style={{fill:"var(--tx)",fontSize:size*.22,fontWeight:700,transform:"rotate(90deg)",transformOrigin:"50% 50%"}}>
            {pct}%
          </text>
        </svg>
      );
    }

    // ── LESSON VIEWER ──
    if (lsnView) {
      const lsn = lessons.find(l=>l.id===lsnView);
      if (!lsn) { setLsnView(null); return null; }
      const assign = isEmp ? getAssign(lsnView,currentUser.id) : null;

      function handleStart() {
        if (assign && assign.status==="not_started")
          updateAssign(assign.id,{status:"in_progress"});
      }

      function handleComplete() {
        if (!assign) return;
        if (lsn.type==="quiz") {
          const score = (lsn.quiz||[]).reduce((s,q,i)=>(quizAns[i]===q.correct?s+1:s),0);
          const pct   = Math.round((score/(lsn.quiz||[]).length)*100);
          updateAssign(assign.id,{status:"completed",completedAt:new Date().toISOString().split("T")[0],quizScore:pct});
          setQuizDone(true);
        } else {
          updateAssign(assign.id,{status:"completed",completedAt:new Date().toISOString().split("T")[0]});
          setLsnView(null);
        }
      }

      const dept   = depts.find(d=>d.id===lsn.deptId);
      const branch = brs.find(b=>b.id===lsn.branchId);

      return (
        <div style={{maxWidth:820,margin:"0 auto"}}>
          {/* Back */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,cursor:"pointer",color:"var(--mu)",fontSize:13}}
            onClick={()=>{setLsnView(null);setQuizAns({});setQuizDone(false);}}>
            ← {lang==="ru"?"Назад к урокам":"Back to lessons"}
          </div>

          {/* Header */}
          <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:14,padding:20,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>{lsn.title}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                  {dept   && <span style={{fontSize:11,color:dept.color,background:dept.color+"18",borderRadius:5,padding:"2px 8px"}}>{dept.icon} {dept.name}</span>}
                  {branch && <span style={{fontSize:11,color:"var(--mu)",background:"var(--s2)",borderRadius:5,padding:"2px 8px"}}>📍 {branch.name}</span>}
                  <Bdg cls="b-bl">{lsn.type==="video"?"▶ Video":lsn.type==="quiz"?"📝 Quiz":lsn.type==="pdf"?"📄 PDF":"📖 Text"}</Bdg>
                  {lsn.duration&&<Bdg cls="b-mu">⏱ {lsn.duration} {lang==="ru"?"мин":"min"}</Bdg>}
                </div>
              </div>
              {assign&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <CirclePct pct={assign.status==="completed"?100:assign.status==="in_progress"?50:0}/>
                  {statusBdg(assign.status)}
                </div>
              )}
            </div>
            {/* Action buttons */}
            {assign&&!quizDone&&(
              <div style={{display:"flex",gap:8,marginTop:12}}>
                {assign.status==="not_started"&&(
                  <button className="btn btn-p" onClick={handleStart}>{IC.play} {t.startLesson}</button>
                )}
                {assign.status==="in_progress"&&(
                  <button className="btn btn-p" onClick={handleComplete}>{IC.check2} {t.markComplete}</button>
                )}
                {assign.status==="completed"&&(
                  <div style={{display:"flex",alignItems:"center",gap:8,color:"var(--gr)",fontSize:13,fontWeight:600}}>
                    {IC.check2} {t.completed}
                    {assign.quizScore!=null&&<Bdg cls="b-gr">Score: {assign.quizScore}%</Bdg>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quiz done screen */}
          {quizDone&&(
            <div style={{background:"var(--s1)",border:"1px solid var(--gr)30",borderRadius:14,padding:32,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:48,marginBottom:12}}>{IC.award}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"var(--gr)",marginBottom:8}}>
                {lang==="ru"?"Урок завершён!":"Lesson Complete!"}
              </div>
              <div style={{fontSize:14,color:"var(--mu)",marginBottom:16}}>
                {lang==="ru"?"Результат теста:":"Quiz score:"} <strong style={{color:"var(--acc)"}}>{assigns.find(a=>a.lessonId===lsnView&&a.employeeId===currentUser.id)?.quizScore}%</strong>
              </div>
              <button className="btn btn-p" onClick={()=>{setLsnView(null);setQuizAns({});setQuizDone(false);}}>
                {lang==="ru"?"← Вернуться к урокам":"← Back to lessons"}
              </button>
            </div>
          )}

          {/* Content */}
          {!quizDone&&(
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:14,padding:20}}>
              {/* VIDEO */}
              {lsn.type==="video"&&lsn.url&&(()=>{
                const ytId = lsn.url.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)?.[1];
                return ytId ? (
                  <div style={{position:"relative",paddingBottom:"56.25%",height:0,borderRadius:10,overflow:"hidden"}}>
                    <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}} allowFullScreen title={lsn.title}/>
                  </div>
                ) : <a href={lsn.url} target="_blank" rel="noreferrer" className="btn btn-bl">{IC.play} {lang==="ru"?"Открыть видео":"Open video"}</a>;
              })()}
              {/* PDF */}
              {lsn.type==="pdf"&&lsn.url&&(
                <div>
                  <a href={lsn.url} target="_blank" rel="noreferrer" className="btn btn-bl" style={{marginBottom:12}}>📄 {lang==="ru"?"Открыть документ":"Open document"}</a>
                  {lsn.url.toLowerCase().includes(".pdf")&&(
                    <iframe src={lsn.url} style={{width:"100%",height:600,borderRadius:10,border:"1px solid var(--bdr)"}} title={lsn.title}/>
                  )}
                </div>
              )}
              {/* TEXT */}
              {(lsn.type==="text"||lsn.type==="video")&&lsn.content&&(
                <div style={{fontSize:14,lineHeight:1.8,color:"var(--tx)",whiteSpace:"pre-wrap",marginTop:lsn.type==="video"?16:0}}>
                  {lsn.content}
                </div>
              )}
              {/* QUIZ */}
              {lsn.type==="quiz"&&(
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:16}}>
                    📝 {lang==="ru"?"Тест":"Quiz"} — {(lsn.quiz||[]).length} {lang==="ru"?"вопросов":"questions"}
                  </div>
                  {(lsn.quiz||[]).map((q,qi)=>(
                    <div key={q.id||qi} style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:14,marginBottom:12}}>
                      <div style={{fontWeight:600,marginBottom:10}}>{qi+1}. {q.question}</div>
                      {(q.options||[]).filter(o=>o.trim()).map((opt,oi)=>(
                        <label key={oi} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:8,marginBottom:5,cursor:"pointer",
                          background:quizAns[qi]===oi?"var(--acc)15":"transparent",
                          border:`1px solid ${quizAns[qi]===oi?"var(--acc)40":"var(--bdr)"}`}}>
                          <input type="radio" name={`q${qi}`} checked={quizAns[qi]===oi} onChange={()=>setQuizAns(a=>({...a,[qi]:oi}))} style={{accentColor:"var(--acc)"}}/>
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  {assign?.status==="in_progress"&&(
                    <button className="btn btn-p" onClick={handleComplete} style={{marginTop:8}}>
                      {IC.check2} {lang==="ru"?"Отправить ответы":"Submit answers"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // ── TABS ──
    const tabs = canAdmin
      ? [{id:"lessons",label:t.allLessons},{id:"assign",label:t.assignees},{id:"progress",label:t.progressTab}]
      : [{id:"my",label:t.myLessons}];

    return (
      <>
        {/* Tab bar */}
        <div style={{display:"flex",gap:6,marginBottom:18,borderBottom:"1px solid var(--bdr)",paddingBottom:10}}>
          {tabs.map(tb=>(
            <button key={tb.id} className={`btn ${tab===tb.id?"btn-p":"btn-g"}`}
              style={{fontSize:12}} onClick={()=>setTab(tb.id)}>
              {tb.label}
            </button>
          ))}
          {canAdmin&&tab==="lessons"&&(
            <button className="btn btn-p" style={{marginLeft:"auto",fontSize:12}}
              onClick={()=>setLModal(true)}>{IC.plus} {t.addLesson}</button>
          )}
          {canAdmin&&tab==="assign"&&(
            <button className="btn btn-p" style={{marginLeft:"auto",fontSize:12}}
              onClick={()=>setAModal(true)}>{IC.assign} {t.assignLesson}</button>
          )}
        </div>

        {/* ── TAB: ALL LESSONS ── */}
        {tab==="lessons"&&(()=>{
          // Group lessons by department (like TalentLMS sections)
          const grouped = [];
          // 1) lessons with a dept
          depts.forEach(dept=>{
            const dLessons = lessons.filter(l=>l.deptId===dept.id);
            if (dLessons.length>0) grouped.push({key:dept.id, label:dept.name, icon:dept.icon, color:dept.color, items:dLessons});
          });
          // 2) lessons without dept
          const ungrouped = lessons.filter(l=>!l.deptId);
          if (ungrouped.length>0) grouped.push({key:"other", label:lang==="ru"?"Общие уроки":"General", icon:"📚", color:"var(--mu)", items:ungrouped});

          function LessonCard({lsn}) {
            const dept   = depts.find(d=>d.id===lsn.deptId);
            const branch = brs.find(b=>b.id===lsn.branchId);
            const aCount = assigns.filter(a=>a.lessonId===lsn.id).length;
            const doneC  = assigns.filter(a=>a.lessonId===lsn.id&&a.status==="completed").length;
            return (
              <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:13,cursor:"pointer",transition:"border-color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--bdr2)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bdr)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <Bdg cls="b-bl" style={{fontSize:10}}>{lsn.type==="video"?"▶ Video":lsn.type==="quiz"?"📝 Quiz":lsn.type==="pdf"?"📄 PDF":"📖 Text"}</Bdg>
                  <div style={{display:"flex",gap:4}}>
                    {lsn.duration&&<span style={{fontSize:10,color:"var(--mu)"}}>⏱{lsn.duration}{lang==="ru"?"м":"m"}</span>}
                    {canAdmin&&<button className="btn btn-d btn-sm" style={{padding:"1px 5px"}} onClick={e=>{e.stopPropagation();deleteLesson(lsn.id);}}>{IC.trash}</button>}
                  </div>
                </div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:6,lineHeight:1.3}} onClick={()=>setLsnView(lsn.id)}>{lsn.title}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:11,color:"var(--mu)"}}>{aCount}{lang==="ru"?" назн.":" assigned"} · {doneC}{lang==="ru"?" готово":" done"}</div>
                  <button className="btn btn-p btn-sm" style={{padding:"3px 8px"}} onClick={()=>setLsnView(lsn.id)}>{IC.play}</button>
                </div>
              </div>
            );
          }

          return (
            <div>
              {grouped.length===0&&(
                <div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
                  <div style={{marginBottom:8,opacity:.4,display:"flex",justifyContent:"center"}}>{IC.training}</div>
                  <div>{t.noLessons}</div>
                </div>
              )}
              {grouped.map(group=>(
                <div key={group.key} style={{marginBottom:20}}>
                  {/* Section header */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:`2px solid ${group.color}30`}}>
                    <div style={{width:36,height:36,borderRadius:9,background:group.color+"18",border:`1px solid ${group.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                      {group.icon}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:group.color}}>{group.label}</div>
                      <div style={{fontSize:11,color:"var(--mu)"}}>{group.items.length} {lang==="ru"?"уроков":"lessons"} · {assigns.filter(a=>group.items.some(l=>l.id===a.lessonId)&&a.status==="completed").length} {lang==="ru"?"завершено":"completed"}</div>
                    </div>
                  </div>
                  {/* Lesson cards grid */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
                    {group.items.map(lsn=><LessonCard key={lsn.id} lsn={lsn}/>)}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── TAB: ASSIGNMENTS ── */}
        {tab==="assign"&&(
          <div className="card">
            <div className="tw">
              <table>
                <thead><tr>
                  <th>{lang==="ru"?"Сотрудник":"Employee"}</th>
                  <th>{lang==="ru"?"Урок":"Lesson"}</th>
                  <th>{lang==="ru"?"Статус":"Status"}</th>
                  <th>{lang==="ru"?"Назначен":"Assigned"}</th>
                  <th>{lang==="ru"?"Завершён":"Completed"}</th>
                  <th>{lang==="ru"?"Балл":"Score"}</th>
                </tr></thead>
                <tbody>
                  {assigns.map(a=>{
                    const emp = emps.find(e=>e.id===a.employeeId);
                    const lsn = lessons.find(l=>l.id===a.lessonId);
                    return (
                      <tr key={a.id}>
                        <td><div className="flex-c"><Av name={emp?.name}/><span>{emp?.name||"—"}</span></div></td>
                        <td style={{fontSize:12}}>{lsn?.title||"—"}</td>
                        <td>{statusBdg(a.status)}</td>
                        <td style={{fontSize:11,color:"var(--mu)"}}>{a.assignedAt}</td>
                        <td style={{fontSize:11,color:"var(--mu)"}}>{a.completedAt||"—"}</td>
                        <td>{a.quizScore!=null?<Bdg cls={a.quizScore>=70?"b-gr":"b-rd"}>{a.quizScore}%</Bdg>:"—"}</td>
                      </tr>
                    );
                  })}
                  {!assigns.length&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--mu)",padding:24}}>{t.noAssignments}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: PROGRESS ── */}
        {tab==="progress"&&(()=>{
          // Build last-30-days activity chart across all employees
          const today = new Date();
          const days30 = Array.from({length:30},(_,i)=>{
            const d = new Date(today); d.setDate(d.getDate()-29+i);
            return d.toISOString().split("T")[0];
          });
          const activityData = days30.map(day=>({
            day: day.slice(8), // DD
            date: day,
            completed: assigns.filter(a=>a.completedAt===day&&a.status==="completed").length,
            started:   assigns.filter(a=>a.assignedAt===day).length,
          }));
          const hasActivity = activityData.some(d=>d.completed>0||d.started>0);

          return (
            <div>
              {/* Activity chart */}
              <div className="card" style={{marginBottom:20}}>
                <div className="card-hd">
                  <div className="card-t">{lang==="ru"?"Активность за 30 дней":"Activity — Last 30 Days"}</div>
                  <div style={{display:"flex",gap:14}}>
                    {[["var(--gr)",lang==="ru"?"Завершили урок":"Completed"],["var(--bl)",lang==="ru"?"Назначено":"Assigned"]].map(([c,l])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--mu)"}}>
                        <div style={{width:9,height:9,borderRadius:2,background:c}}/>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
                {hasActivity ? (
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={activityData} barGap={1} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false}/>
                      <XAxis dataKey="day" tick={{fill:"#576070",fontSize:10}} axisLine={false} tickLine={false}
                        interval={4}/>
                      <YAxis tick={{fill:"#576070",fontSize:10}} axisLine={false} tickLine={false} allowDecimals={false} width={20}/>
                      <Tooltip
                        contentStyle={{background:"var(--s2)",border:"1px solid var(--bdr2)",borderRadius:9,fontSize:12,color:"var(--tx)"}}
                        labelFormatter={(_,p)=>p?.[0]?.payload?.date||""}
                        formatter={(v,n)=>[v, n==="completed"?(lang==="ru"?"Завершили":"Completed"):(lang==="ru"?"Назначено":"Assigned")]}/>
                      <Bar dataKey="completed" fill="var(--gr)" radius={[3,3,0,0]} maxBarSize={18}/>
                      <Bar dataKey="started"   fill="var(--bl)" radius={[3,3,0,0]} maxBarSize={18}/>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{height:100,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--mu)",fontSize:12}}>
                    {lang==="ru"?"Активности пока нет — назначьте уроки сотрудникам":"No activity yet — assign lessons to employees"}
                  </div>
                )}
              </div>

              {/* Employee cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                {emps.map(emp=>{
                  const myA  = assigns.filter(a=>a.employeeId===emp.id);
                  const done = myA.filter(a=>a.status==="completed").length;
                  const prog = myA.filter(a=>a.status==="in_progress").length;
                  const pct  = progressPct(emp.id);
                  const dept = depts.find(d=>d.id===emp.deptId);
                  // Mini activity dots — last 14 days
                  const dots14 = days30.slice(-14).map(day=>({
                    date:day,
                    active: assigns.some(a=>a.employeeId===emp.id&&(a.completedAt===day||a.assignedAt===day))
                  }));
                  return (
                    <div key={emp.id} style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                        <Av name={emp.name} color={dept?.color} size="av-lg"/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{emp.name}</div>
                          <div style={{fontSize:11,color:"var(--mu)"}}>{emp.role}</div>
                          {dept&&<div style={{fontSize:10,color:dept.color,marginTop:1}}>{dept.icon} {dept.name}</div>}
                        </div>
                        <CirclePct pct={pct} size={48} color={pct===100?"var(--gr)":"var(--acc)"}/>
                      </div>
                      {/* Progress bar */}
                      <div style={{height:3,background:"var(--s3)",borderRadius:2,marginBottom:8}}>
                        <div style={{height:"100%",width:pct+"%",background:pct===100?"var(--gr)":"var(--acc)",borderRadius:2,transition:"width .5s"}}/>
                      </div>
                      {/* Stats row */}
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--mu)",marginBottom:10}}>
                        <span>{done}/{myA.length} {lang==="ru"?"уроков":"lessons"}</span>
                        {prog>0&&<span style={{color:"var(--acc)"}}>{prog} {lang==="ru"?"в работе":"in progress"}</span>}
                        {pct===100&&myA.length>0&&<span style={{color:"var(--gr)",display:"flex",alignItems:"center",gap:3}}>{IC.award} {t.certificate}</span>}
                      </div>
                      {/* Activity dots — last 14 days */}
                      <div>
                        <div style={{fontSize:9,color:"var(--mu2)",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>{lang==="ru"?"Активность (14 дней)":"Activity (14 days)"}</div>
                        <div style={{display:"flex",gap:3}}>
                          {dots14.map(d=>(
                            <div key={d.date} title={d.date}
                              style={{flex:1,height:8,borderRadius:2,background:d.active?"var(--gr)":"var(--s3)",opacity:d.active?1:.5,transition:"background .2s"}}/>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!emps.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"var(--mu)"}}>{lang==="ru"?"Нет сотрудников":"No employees"}</div>}
              </div>
            </div>
          );
        })()}

        {/* ── TAB: MY LESSONS (employee view) ── */}
        {tab==="my"&&(
          <>
            {/* My progress summary */}
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16,marginBottom:18,display:"flex",alignItems:"center",gap:20}}>
              <CirclePct pct={progressPct(currentUser.id)} size={64} color={progressPct(currentUser.id)===100?"var(--gr)":"var(--acc)"}/>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>{lang==="ru"?"Мой прогресс":"My Progress"}</div>
                <div style={{fontSize:12,color:"var(--mu)",marginTop:3}}>
                  {myAssigns.filter(a=>a.status==="completed").length} / {myAssigns.length} {lang==="ru"?"уроков завершено":"lessons completed"}
                </div>
                {progressPct(currentUser.id)===100&&myAssigns.length>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:5,color:"var(--gr)",fontSize:12,marginTop:4,fontWeight:600}}>
                    {IC.award} {lang==="ru"?"Все уроки пройдены!":"All lessons completed!"}
                  </div>
                )}
              </div>
            </div>

            {/* Lesson cards */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {myAssigns.map(a=>{
                const lsn  = lessons.find(l=>l.id===a.lessonId);
                if (!lsn) return null;
                const dept = depts.find(d=>d.id===lsn.deptId);
                return (
                  <div key={a.id} style={{background:"var(--s1)",border:`1px solid ${a.status==="completed"?"var(--gr)30":"var(--bdr)"}`,borderRadius:11,padding:14,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:10,background:a.status==="completed"?"var(--gr)15":"var(--s2)",border:`1px solid ${a.status==="completed"?"var(--gr)30":"var(--bdr)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:a.status==="completed"?"var(--gr)":"var(--mu)"}}>
                      {a.status==="completed" ? IC.check2 : IC.play}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{lsn.title}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {dept&&<span style={{fontSize:10,color:dept.color}}>{dept.icon} {dept.name}</span>}
                        <Bdg cls="b-mu" style={{fontSize:10}}>{lsn.type==="video"?"▶":lsn.type==="quiz"?"📝":lsn.type==="pdf"?"📄":"📖"} {lsn.type}</Bdg>
                        {lsn.duration&&<span style={{fontSize:10,color:"var(--mu)"}}>⏱ {lsn.duration}{lang==="ru"?"м":"m"}</span>}
                        {a.quizScore!=null&&<Bdg cls={a.quizScore>=70?"b-gr":"b-rd"}>{a.quizScore}%</Bdg>}
                      </div>
                    </div>
                    {statusBdg(a.status)}
                    <button className={`btn ${a.status==="completed"?"btn-g":"btn-p"} btn-sm`}
                      onClick={()=>{setLsnView(lsn.id);if(a.status==="not_started")updateAssign(a.id,{status:"in_progress"});}}>
                      {a.status==="completed" ? (lang==="ru"?"Повторить":"Review") : a.status==="in_progress" ? t.continueLesson : t.startLesson}
                    </button>
                  </div>
                );
              })}
              {!myAssigns.length&&(
                <div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
                  <div style={{marginBottom:8,opacity:.4,display:"flex",justifyContent:"center"}}>{IC.training}</div>
                  <div>{lang==="ru"?"Вам пока не назначено ни одного урока":"No lessons assigned to you yet"}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── LESSON CREATE MODAL ── */}
        {lModal&&(
          <div className="ovl" onClick={()=>setLModal(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.addLesson}</div>
              <div className="fg">
                <label className="lbl">{t.lessonTitle}</label>
                <input className="inp" value={lF.title} onChange={e=>setLF(f=>({...f,title:e.target.value}))} placeholder={lang==="ru"?"Стандарты уборки офиса":"Office Cleaning Standards"}/>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.lessonType}</label>
                  <select className="inp" value={lF.type} onChange={e=>setLF(f=>({...f,type:e.target.value}))}>
                    <option value="video">▶ Video (YouTube)</option>
                    <option value="text">📖 {lang==="ru"?"Текст / Стандарт":"Text / Standard"}</option>
                    <option value="pdf">📄 PDF / Документ</option>
                    <option value="quiz">📝 {lang==="ru"?"Тест":"Quiz"}</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">⏱ {t.lessonDuration}</label>
                  <input type="number" className="inp" value={lF.duration} onChange={e=>setLF(f=>({...f,duration:e.target.value}))} placeholder="15"/>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">🏢 {t.lessonDept}</label>
                  <select className="inp" value={lF.deptId} onChange={e=>setLF(f=>({...f,deptId:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Не указан —":"— Not set —"}</option>
                    {depts.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">📍 {t.lessonBranch}</label>
                  <select className="inp" value={lF.branchId} onChange={e=>setLF(f=>({...f,branchId:e.target.value}))}>
                    <option value="">{lang==="ru"?"— Не указан —":"— Not set —"}</option>
                    {brs.map(b=><option key={b.id} value={b.id}>🏙️ {b.name}</option>)}
                  </select>
                </div>
              </div>
              {(lF.type==="video"||lF.type==="pdf")&&(
                <div className="fg">
                  <label className="lbl">{t.lessonUrl}</label>
                  <input className="inp" value={lF.url} onChange={e=>setLF(f=>({...f,url:e.target.value}))} placeholder={lF.type==="video"?"https://youtube.com/watch?v=...":"https://..."}/>
                </div>
              )}
              {(lF.type==="text"||lF.type==="video")&&(
                <div className="fg">
                  <label className="lbl">{t.lessonContent}</label>
                  <textarea className="inp" value={lF.content} onChange={e=>setLF(f=>({...f,content:e.target.value}))} style={{minHeight:100}} placeholder={lang==="ru"?"Введите текст урока или стандарты...":"Enter lesson text or standards..."}/>
                </div>
              )}
              {lF.type==="quiz"&&(
                <div className="fg">
                  <label className="lbl">📝 {lang==="ru"?"Вопросы теста":"Quiz questions"}</label>
                  {(lF.quiz||[]).map((q,i)=>(
                    <div key={q.id} style={{background:"var(--s2)",borderRadius:8,padding:10,marginBottom:8,fontSize:12}}>
                      <div style={{fontWeight:600,marginBottom:4}}>{i+1}. {q.question}</div>
                      {q.options.filter(o=>o).map((o,j)=>(
                        <div key={j} style={{color:j===q.correct?"var(--gr)":"var(--mu)",fontSize:11}}>
                          {j===q.correct?"✓":"·"} {o}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:8,padding:12}}>
                    <input className="inp" value={qF.question} onChange={e=>setQF(f=>({...f,question:e.target.value}))} placeholder={lang==="ru"?"Вопрос...":"Question..."} style={{marginBottom:8}}/>
                    {qF.options.map((opt,i)=>(
                      <div key={i} style={{display:"flex",gap:6,marginBottom:5,alignItems:"center"}}>
                        <input type="radio" name="correct" checked={qF.correct===i} onChange={()=>setQF(f=>({...f,correct:i}))} style={{accentColor:"var(--gr)",flexShrink:0}}/>
                        <input className="inp" value={opt} onChange={e=>setQF(f=>{const o=[...f.options];o[i]=e.target.value;return{...f,options:o};})} placeholder={`${lang==="ru"?"Вариант":"Option"} ${i+1}`} style={{padding:"5px 8px",fontSize:12}}/>
                      </div>
                    ))}
                    <button className="btn btn-g btn-sm" onClick={addQuizQ}>{IC.plus} {t.quizAddQ}</button>
                  </div>
                </div>
              )}
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setLModal(false)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={saveLesson}>{t.create}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ASSIGN MODAL ── */}
        {aModal&&(
          <div className="ovl" onClick={()=>setAModal(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.assignLesson}</div>
              <div className="fg">
                <label className="lbl">{lang==="ru"?"Урок":"Lesson"}</label>
                <select className="inp" value={aF.lessonId} onChange={e=>setAF(f=>({...f,lessonId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Выберите урок —":"— Select lesson —"}</option>
                  {lessons.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="lbl">{t.assignTo}</label>
                <select className="inp" value={aF.employeeId} onChange={e=>setAF(f=>({...f,employeeId:e.target.value}))}>
                  <option value="">{lang==="ru"?"— Выберите сотрудника —":"— Select employee —"}</option>
                  {emps.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setAModal(false)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={assignLesson}>{t.assignLesson}</button>
              </div>
            </div>
          </div>
        )}
      </>
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

    const defaultCatInc = lang==="ru"
      ? ["Выручка от услуг","Абонентская оплата","Другой доход"]
      : ["Service Revenue","Subscription","Other Income"];
    const defaultCatExp = lang==="ru"
      ? ["Зарплата","Аренда","Маркетинг","Расходные материалы","Налоги","Страховка","Оборудование","Другой расход"]
      : ["Payroll","Rent","Marketing","Supplies","Taxes","Insurance","Equipment","Other Expense"];

    const CAT_INC = [...defaultCatInc, ...(p?.pnlCatsInc||[])];
    const CAT_EXP = [...defaultCatExp, ...(p?.pnlCatsExp||[])];

    const [showCatMgr, setShowCatMgr] = useState(false);
    const [newCat, setNewCat] = useState({type:"expense", name:""});

    function addCategory() {
      if (!newCat.name.trim()) return;
      const field = newCat.type==="income" ? "pnlCatsInc" : "pnlCatsExp";
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,[field]:[...(x[field]||[]),newCat.name.trim()]}:x));
      setNewCat(f=>({...f,name:""}));
    }
    function delCategory(type, name) {
      const field = type==="income" ? "pnlCatsInc" : "pnlCatsExp";
      setPartners(ps=>ps.map(x=>x.id===pid?{...x,[field]:(x[field]||[]).filter(c=>c!==name)}:x));
    }

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

        {/* Category manager panel */}
        {showCatMgr&&canEdit&&(
          <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:12,padding:16,marginBottom:16}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12}}>
              ⚙️ {lang==="ru"?"Управление категориями":"Manage Categories"}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:14}}>
              {[{type:"income",label:lang==="ru"?"Категории доходов":"Income Categories",cats:CAT_INC,defaults:defaultCatInc},
                {type:"expense",label:lang==="ru"?"Категории расходов":"Expense Categories",cats:CAT_EXP,defaults:defaultCatExp}
              ].map(({type,label,cats,defaults})=>(
                <div key={type}>
                  <div style={{fontSize:11,fontWeight:600,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {cats.map(c=>(
                      <div key={c} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:"var(--s2)",borderRadius:7,fontSize:12}}>
                        <span style={{flex:1}}>{c}</span>
                        {!defaults.includes(c)&&(
                          <button onClick={()=>delCategory(type,c)} style={{background:"none",border:"none",color:"var(--mu)",cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>×</button>
                        )}
                        {defaults.includes(c)&&<span style={{fontSize:9,color:"var(--mu2)",letterSpacing:.3}}>BASE</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div className="lang-toggle" style={{display:"flex"}}>
                <button className={`lang-btn ${newCat.type==="income"?"act":""}`} onClick={()=>setNewCat(f=>({...f,type:"income"}))}>{lang==="ru"?"Доход":"Income"}</button>
                <button className={`lang-btn ${newCat.type==="expense"?"act":""}`} onClick={()=>setNewCat(f=>({...f,type:"expense"}))}>{lang==="ru"?"Расход":"Expense"}</button>
              </div>
              <input className="inp" value={newCat.name} onChange={e=>setNewCat(f=>({...f,name:e.target.value}))}
                placeholder={lang==="ru"?"Название категории...":"Category name..."} style={{flex:1,padding:"6px 10px",fontSize:12}}
                onKeyDown={e=>{if(e.key==="Enter")addCategory();}}/>
              <button className="btn btn-p btn-sm" onClick={addCategory}>{IC.plus} {lang==="ru"?"Добавить":"Add"}</button>
            </div>
          </div>
        )}

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
              <Tooltip contentStyle={{background:"var(--s2)",border:"1px solid var(--bdr2)",borderRadius:9,fontSize:12,color:"var(--tx)"}}
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
                  {pnlF.category==="__new__" ? (
                    <div style={{display:"flex",gap:6}}>
                      <input className="inp" autoFocus
                        placeholder={lang==="ru"?"Новая категория...":"New category name..."}
                        value={pnlF._newCat||""}
                        onChange={e=>setPnlF(f=>({...f,_newCat:e.target.value}))}
                        onKeyDown={e=>{
                          if (e.key==="Enter"&&pnlF._newCat?.trim()) {
                            const name=pnlF._newCat.trim();
                            const field=pnlF.type==="income"?"pnlCatsInc":"pnlCatsExp";
                            setPartners(ps=>ps.map(x=>x.id===pid?{...x,[field]:[...(x[field]||[]),name]}:x));
                            setPnlF(f=>({...f,category:name,_newCat:""}));
                          }
                        }}/>
                      <button className="btn btn-p btn-sm" style={{flexShrink:0}} onClick={()=>{
                        const name=pnlF._newCat?.trim();
                        if (!name) return;
                        const field=pnlF.type==="income"?"pnlCatsInc":"pnlCatsExp";
                        setPartners(ps=>ps.map(x=>x.id===pid?{...x,[field]:[...(x[field]||[]),name]}:x));
                        setPnlF(f=>({...f,category:name,_newCat:""}));
                      }}>{IC.check2}</button>
                      <button className="btn btn-g btn-sm" style={{flexShrink:0}} onClick={()=>setPnlF(f=>({...f,category:"",_newCat:""}))}>×</button>
                    </div>
                  ) : (
                    <select className="inp" value={pnlF.category} onChange={e=>setPnlF(f=>({...f,category:e.target.value}))}>
                      <option value="">{lang==="ru"?"— Выберите —":"— Select —"}</option>
                      {(pnlF.type==="income"?CAT_INC:CAT_EXP).map(c=><option key={c}>{c}</option>)}
                      <option value="__new__">✚ {lang==="ru"?"Добавить новую...":"Add new..."}</option>
                    </select>
                  )}
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
    performance:t.performance, chat:t.chat, kb:t.kb, pnl:t.pnl, training:t.training, crm:t.crm, hrcards:t.hrcards, booking:t.booking,
  };

  const allWsPages = ALL_SECTIONS.map(s=>({key:s.id,icon:s.icon,label:sectionLabels[s.id]||s.id,sec:t.workspace}));
  const wsPages    = ALL_SECTIONS.filter(s=>myAccess.includes(s.id)).map(s=>({key:s.id,icon:s.icon,label:sectionLabels[s.id]||s.id,sec:t.workspace}));
  const navPages   = viewPartner ? wsPages
    : isSA ? [...allWsPages, {key:"partners",icon:IC.partners,label:t.partners,sec:"Nova Launch System"}]
    : wsPages;
  const pageMap   = {dashboard:<Dashboard/>,partners:<SAPartners/>,departments:<Employees/>,branches:<Branches/>,tasks:<Tasks/>,schedule:<Schedule/>,salary:<Salary/>,performance:<Performance/>,chat:<Chat/>,kb:<KnowledgeBase/>,pnl:<PnL/>,training:<Training/>, crm:<CRM/>, hrcards:<HRCards/>, booking:<Booking/>};

  const activePid = viewPartner?.id||(isSA?"nce_main":isEmp?currentUser.partnerId:currentUser?.id);
  const activePart= getPartner(activePid);
  const pendingT  = (activePart?.tasks||[]).filter(x=>x.status!=="done").length;
  // Total unread across all accessible chat channels
  const totalUnread = (() => {
    if (!currentUser) return 0;
    const pid = viewPartner?.id||(isSA?"nce_main":activePart?.id||"sa");
    const allCh = [
      {id:"general"},{id:"cleaners"},{id:"managers"},{id:"announcements"},
      ...(activePart?.departments||[]).map(d=>({id:"dept_"+d.id})),
    ];
    return allCh.reduce((sum,ch)=>sum+countUnread(pid+"_"+ch.id),0);
  })();

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
            {(()=>{
              const logoSrc = viewPartner?.logoUrl || (isPartner?partners.find(p=>p.id===currentUser.id)?.logoUrl:null);
              return logoSrc ? (
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <img src={logoSrc} alt="logo" style={{height:34,maxWidth:90,objectFit:"contain",borderRadius:6}}/>
                  <div>
                    <div className="sb-logo-name" style={{fontSize:12}}>{brandName}<span style={{color:brandColor}}>.</span></div>
                    <div className="sb-logo-sub">{t.appSub}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="sb-logo-name">{brandName}<span style={{color:brandColor}}>.</span></div>
                  <div className="sb-logo-sub">{t.appSub}</div>
                </>
              );
            })()}
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
                {navPages.filter(p=>p.sec===sec).map(p=>{
                  if (p.key==="booking") {
                    const BK_SUBS = [
                      {k:"calendar",  ico:"📅", l:lang==="ru"?"Календарь":"Calendar"},
                      {k:"cleaners",  ico:"🧹", l:lang==="ru"?"Клинеры":"Cleaners"},
                      {k:"clients",   ico:"👤", l:lang==="ru"?"Клиенты":"Clients"},
                      {k:"reports",   ico:"📊", l:lang==="ru"?"Отчёты":"Reports"},
                      {k:"settings",  ico:"⚙️", l:lang==="ru"?"Настройки":"Settings"},
                    ];
                    const isActive = page==="booking";
                    return (
                      <div key={p.key}>
                        <button className={`nb ${isActive?"act":""}`} onClick={()=>{
                          if (!isActive) { setPage("booking"); setBkExpanded(true); }
                          else setBkExpanded(x=>!x);
                          setKbView(null);
                        }}>
                          <span className="ni">{p.icon}</span>{p.label}
                          <span style={{marginLeft:"auto",fontSize:10,color:"var(--mu)",transition:"transform .2s",
                            display:"inline-block",transform:bkExpanded&&isActive?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                        </button>
                        {isActive&&bkExpanded&&(
                          <div style={{marginLeft:12,borderLeft:"2px solid var(--bdr)",paddingLeft:4,marginBottom:4}}>
                            {BK_SUBS.map(s=>(
                              <button key={s.k} onClick={()=>{setBookingTab(s.k);}}
                                style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"5px 10px",borderRadius:6,
                                  fontSize:12,cursor:"pointer",border:"none",textAlign:"left",
                                  background:bookingTab===s.k?"var(--acc)15":"transparent",
                                  color:bookingTab===s.k?"var(--acc)":"var(--mu)",fontWeight:bookingTab===s.k?600:400}}>
                                <span style={{fontSize:13}}>{s.ico}</span>{s.l}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <button key={p.key} className={`nb ${page===p.key?"act":""}`} onClick={()=>{setPage(p.key);setKbView(null);}}>
                      <span className="ni">{p.icon}</span>{p.label}
                      {p.key==="tasks"&&pendingT>0&&<span className="cnt">{pendingT}</span>}
                      {p.key==="chat"&&totalUnread>0&&<span className="cnt" style={{background:"#ef4444",color:"#fff"}}>{totalUnread>99?"99+":totalUnread}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            {/* Language toggle */}
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              <div className="lang-toggle" style={{flex:1,justifyContent:"center",display:"flex"}}>
                <button className={`lang-btn ${lang==="ru"?"act":""}`} onClick={()=>setLang("ru")}>RU</button>
                <button className={`lang-btn ${lang==="en"?"act":""}`} onClick={()=>setLang("en")}>EN</button>
              </div>
              <div className="lang-toggle" style={{flex:1,justifyContent:"center",display:"flex"}}>
                <button className={`lang-btn ${theme==="dark"?"act":""}`} onClick={()=>setTheme("dark")} title={lang==="ru"?"Тёмная":"Dark"}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>
                <button className={`lang-btn ${theme==="light"?"act":""}`} onClick={()=>setTheme("light")} title={lang==="ru"?"Светлая":"Light"}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
              </div>
            </div>
            <button className="btn btn-g btn-sm" style={{width:"100%",justifyContent:"center"}}
              onClick={()=>{localStorage.removeItem("nls_page");setCurrentUser(null);setViewPartner(null);setPage("dashboard");setDoc(doc(db,"app","data"),{session:null},{merge:true}).catch(console.error);}}>
              ⏏ {IC.logout} {t.logout}
            </button>
          </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          {navPages.slice(0,5).map(p=>(
            <button key={p.key} className={`mob-nb ${page===p.key?"act":""}`} onClick={()=>{setPage(p.key);setKbView(null);}}
              style={{position:"relative"}}>
              <span className="mi" style={{position:"relative"}}>
                {p.icon}
                {p.key==="chat"&&totalUnread>0&&(
                  <span style={{position:"absolute",top:-4,right:-6,minWidth:16,height:16,
                    background:"#ef4444",color:"#fff",borderRadius:8,fontSize:9,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",lineHeight:1}}>
                    {totalUnread>99?"99+":totalUnread}
                  </span>
                )}
                {p.key==="tasks"&&pendingT>0&&(
                  <span style={{position:"absolute",top:-4,right:-6,minWidth:16,height:16,
                    background:"var(--acc)",color:"#000",borderRadius:8,fontSize:9,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",lineHeight:1}}>
                    {pendingT}
                  </span>
                )}
              </span>
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
                  onClick={()=>{localStorage.removeItem("nls_page");setCurrentUser(null);setViewPartner(null);setPage("dashboard");setModal(null);}}>
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
                <div className="fg"><label className="lbl">{t.logo} (emoji)</label><input className="inp" value={pF.logo} onChange={e=>setPF(p=>({...p,logo:e.target.value}))} placeholder="💎"/></div>
                <div className="fg"><label className="lbl">{lang==="ru"?"Логотип (URL картинки)":"Logo image URL"}</label><input className="inp" value={pF.logoUrl||""} onChange={e=>setPF(p=>({...p,logoUrl:e.target.value}))} placeholder="https://...logo.png"/></div>
              </div>
              <div className="fr">
                <div className="fg" style={{flex:2}}>
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
              <div className="modal-t">{dF._editId?(lang==="ru"?"✏️ Редактировать отдел":"✏️ Edit Department"):t.newDept}</div>
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

        {modal==="task"&&(()=>{
          const pid2 = viewPartner?.id||(isSA?"nce_main":currentUser?.id);
          const p2   = getPartner(pid2)||{employees:[],departments:[]};
          const depts2 = p2.departments||[];
          // Filter employees by selected dept
          const deptEmps = tF.deptId
            ? (p2.employees||[]).filter(e=>e.deptId===tF.deptId&&e.status!=="fired")
            : (p2.employees||[]).filter(e=>e.status!=="fired");
          return (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-t">{t.newTask}</div>
              <div className="fg">
                <label className="lbl">{t.taskTitle} *</label>
                <input className="inp" value={tF.title} onChange={e=>setTF(p=>({...p,title:e.target.value}))} placeholder={lang==="ru"?"Название задачи...":"Task title..."}/>
              </div>
              <div className="fg">
                <label className="lbl">{lang==="ru"?"Описание (необязательно)":"Description (optional)"}</label>
                <input className="inp" value={tF.description||""} onChange={e=>setTF(p=>({...p,description:e.target.value}))} placeholder={lang==="ru"?"Детали задачи...":"Task details..."}/>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">🏢 {lang==="ru"?"Отдел":"Department"}</label>
                  <select className="inp" value={tF.deptId} onChange={e=>setTF(p=>({...p,deptId:e.target.value,assigneeId:""}))}>
                    <option value="">{lang==="ru"?"— Все отделы —":"— All departments —"}</option>
                    {depts2.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.assignee}</label>
                  <select className="inp" value={tF.assigneeId} onChange={e=>{
                    const emp = (p2.employees||[]).find(x=>x.id===e.target.value);
                    setTF(p=>({...p,assigneeId:e.target.value,deptId:p.deptId||(emp?.deptId||"")}));
                  }}>
                    <option value="">{lang==="ru"?"— Не назначен —":"— Unassigned —"}</option>
                    {deptEmps.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="fr">
                <div className="fg">
                  <label className="lbl">{t.priority}</label>
                  <select className="inp" value={tF.priority} onChange={e=>setTF(p=>({...p,priority:e.target.value}))}>
                    <option value="high">🔴 {t.high}</option>
                    <option value="medium">🟡 {t.medium}</option>
                    <option value="low">🟢 {t.low}</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="lbl">{t.due}</label>
                  <input className="inp" type="date" value={tF.due} onChange={e=>setTF(p=>({...p,due:e.target.value}))}/>
                </div>
              </div>
              <div className="ma">
                <button className="btn btn-g" onClick={()=>setModal(null)}>{t.cancel}</button>
                <button className="btn btn-p" onClick={createTask}>{t.create}</button>
              </div>
            </div>
          </div>
          );
        })()}

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

export default function App() {
  return <ErrorBoundary><AppInner/></ErrorBoundary>;
}

  /* ══════════════════════════════════════════════════════
     HR STAFF CARDS — карточки сотрудников (внутри HR отдела)
  ══════════════════════════════════════════════════════ */
