import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const INIT_DEPARTMENTS = [
  { id:"sales",      name:"Отдел продаж",          icon:"💼", color:"#f0a500" },
  { id:"ops",        name:"Операционный отдел",     icon:"⚙️",  color:"#3b82f6" },
  { id:"mgmt",       name:"Отдел управления",       icon:"🏢", color:"#a855f7" },
  { id:"finance",    name:"Финансовый отдел",       icon:"💰", color:"#22c55e" },
  { id:"hr",         name:"Отдел найма",            icon:"🎯", color:"#ec4899" },
  { id:"reps",       name:"Отдел представителей",   icon:"🤝", color:"#f97316" },
  { id:"supervision",name:"Отдел супервайзинга",    icon:"👁️", color:"#06b6d4" },
  { id:"smm",        name:"Отдел SMM",              icon:"📱", color:"#8b5cf6" },
  { id:"marketing",  name:"Отдел маркетинга",       icon:"📣", color:"#ef4444" },
];

const DEPT_COLORS = ["#f0a500","#3b82f6","#a855f7","#22c55e","#ec4899","#f97316","#06b6d4","#8b5cf6","#ef4444","#14b8a6","#f59e0b","#6366f1"];

const BRANCHES = [
  { id:"austin",     name:"Austin",         isHQ:true },
  { id:"florida",    name:"Florida" },
  { id:"california", name:"California" },
  { id:"washington", name:"Washington" },
  { id:"newyork",    name:"New York" },
  { id:"nc",         name:"North Carolina" },
];

// ops = cleaning staff for schedule
const CLEANING_DEPTS = ["ops","supervision"];

const INIT_EMPLOYEES = [
  { id:1,  name:"Zalina Karimova",  dept:"mgmt",       branch:"austin",  role:"CEO / Основатель",  rate:0,  salary:0,   salaryType:"fixed", status:"active", email:"zalina@nova.team",  password:"zalina123",  type:"employee" },
  { id:2,  name:"Anna Petrov",      dept:"supervision",branch:"austin",  role:"Supervisor",         rate:22, salary:2800,salaryType:"hourly",status:"active", email:"anna@nova.team",    password:"anna123",    type:"employee" },
  { id:3,  name:"Maria Gonzalez",   dept:"ops",        branch:"austin",  role:"Cleaner",            rate:18, salary:0,   salaryType:"hourly",status:"active", email:"maria@nova.team",   password:"maria123",   type:"employee" },
  { id:4,  name:"Sofia Reyes",      dept:"ops",        branch:"florida", role:"Cleaner",            rate:18, salary:0,   salaryType:"hourly",status:"active", email:"sofia@nova.team",   password:"sofia123",   type:"employee" },
  { id:5,  name:"Elena Novak",      dept:"sales",      branch:"austin",  role:"Sales Manager",      rate:25, salary:3500,salaryType:"fixed", status:"active", email:"elena@nova.team",   password:"elena123",   type:"employee" },
  { id:6,  name:"Dmitry Volkov",    dept:"hr",         branch:"austin",  role:"HR Specialist",      rate:20, salary:3000,salaryType:"fixed", status:"active", email:"dmitry@nova.team",  password:"dmitry123",  type:"employee" },
  { id:7,  name:"Julia Kim",        dept:"finance",    branch:"austin",  role:"Bookkeeper",         rate:30, salary:4000,salaryType:"fixed", status:"active", email:"julia@nova.team",   password:"julia123",   type:"employee" },
  { id:8,  name:"Carlos Mendez",    dept:"reps",       branch:"florida", role:"Representative",     rate:19, salary:0,   salaryType:"hourly",status:"active", email:"carlos@nova.team",  password:"carlos123",  type:"employee" },
];

const INIT_CLIENTS = [
  { id:101, name:"Startup Cleaning Co", contact:"Mike Johnson", email:"mike@startupclean.com", password:"client101", city:"Dallas", plan:"Basic", status:"active", joined:"2025-01-15", type:"client" },
  { id:102, name:"Clean Pro LLC",       contact:"Sarah Davis",  email:"sarah@cleanpro.com",   password:"client102", city:"Houston",plan:"Pro",   status:"active", joined:"2025-02-01", type:"client" },
];

const INIT_TASKS = [
  { id:1, title:"Позвонить 10 потенциальным клиентам", assignee:5, dept:"sales",      priority:"high",   status:"in_progress", due:"2025-06-10", createdBy:1 },
  { id:2, title:"Провести интервью с 3 кандидатами",   assignee:6, dept:"hr",         priority:"medium", status:"todo",        due:"2025-06-12", createdBy:1 },
  { id:3, title:"Подготовить отчёт за май",            assignee:7, dept:"finance",    priority:"high",   status:"todo",        due:"2025-06-08", createdBy:1 },
  { id:4, title:"Проверить качество объекта 14",       assignee:2, dept:"supervision",priority:"medium", status:"done",        due:"2025-06-05", createdBy:2 },
  { id:5, title:"Обновить SOP уборки ванных",          assignee:3, dept:"ops",        priority:"low",    status:"todo",        due:"2025-06-15", createdBy:1 },
  { id:6, title:"Отправить предложение клиенту ABC",   assignee:5, dept:"sales",      priority:"high",   status:"done",        due:"2025-06-04", createdBy:5 },
];

const INIT_SCHEDULE = [
  { id:1, employeeId:3, date:"2025-06-09", startTime:"09:00", endTime:"13:00", address:"123 Oak St, Austin", client:"Johnson Family",   notes:"Ключ под ковриком", status:"confirmed" },
  { id:2, employeeId:3, date:"2025-06-09", startTime:"14:00", endTime:"17:00", address:"456 Elm Ave, Austin", client:"Smith Residence",  notes:"",                  status:"confirmed" },
  { id:3, employeeId:4, date:"2025-06-09", startTime:"10:00", endTime:"14:00", address:"789 Pine Rd, Miami",  client:"Davis Condo",      notes:"2 этаж, кв 4",      status:"confirmed" },
  { id:4, employeeId:2, date:"2025-06-10", startTime:"08:00", endTime:"12:00", address:"321 Maple Dr, Austin",client:"Green Office LLC",  notes:"Офис 3 этажа",      status:"pending"   },
  { id:5, employeeId:3, date:"2025-06-11", startTime:"09:00", endTime:"12:00", address:"654 Cedar Ln, Austin", client:"Brown Family",    notes:"",                  status:"confirmed" },
];

const INIT_CHAT_MSGS = {
  general:    [
    { id:1, author:1,   authorType:"employee", text:"👋 Добро пожаловать в общий чат! Здесь обсуждаем встречи и общие вопросы.", ts:"08:00" },
    { id:2, author:1,   authorType:"employee", text:"📅 Встреча команды в пятницу в 14:00 по Zoom.", ts:"08:05" },
    { id:3, author:5,   authorType:"employee", text:"Буду! Есть новости по продажам 🔥", ts:"09:10" },
  ],
  sales:      [{ id:1, author:5, authorType:"employee", text:"Закрыли 2 новых клиента сегодня 🎉", ts:"10:32" }],
  ops:        [{ id:1, author:3, authorType:"employee", text:"Объект 14 готов ✅", ts:"09:15" }],
  mgmt:       [{ id:1, author:1, authorType:"employee", text:"Встреча по стратегии в пятницу", ts:"08:00" }],
  finance:    [{ id:1, author:7, authorType:"employee", text:"Отчёт за апрель загружен", ts:"11:00" }],
  hr:         [{ id:1, author:6, authorType:"employee", text:"5 новых резюме на вакансию клинера", ts:"13:20" }],
  reps:       [{ id:1, author:8, authorType:"employee", text:"Флорида — 3 новых объекта!", ts:"14:00" }],
  supervision:[{ id:1, author:2, authorType:"employee", text:"Все объекты Austin проверены ✅", ts:"16:00" }],
  smm:        [{ id:1, author:1, authorType:"employee", text:"Нужен контент-план на июнь", ts:"09:00" }],
  marketing:  [{ id:1, author:1, authorType:"employee", text:"Запускаем рекламу в следующий вторник", ts:"10:00" }],
  clients:    [
    { id:1, author:101, authorType:"client", text:"Добрый день! Как войти в базу знаний?", ts:"11:00" },
    { id:2, author:1,   authorType:"employee", text:"Привет! Ссылка в письме, которое мы отправили при регистрации.", ts:"11:05" },
  ],
};

const INIT_KB = [
  { id:1, type:"youtube", dept:"ops",   title:"Стандарты уборки ванных",      url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", desc:"Видеоинструкция", thumb:"🛁", visibleTo:["ops","supervision","mgmt"] },
  { id:2, type:"sop",     dept:"ops",   title:"SOP: Уборка кухни",            content:"1. Обеззараживать поверхности\n2. Чистить плиту\n3. Мыть раковину до блеска\n4. Протирать фасады шкафов\n5. Пол — в последнюю очередь", thumb:"🍳", visibleTo:["ops","supervision","mgmt"] },
  { id:3, type:"sop",     dept:"hr",    title:"SOP: Онбординг нового клинера", content:"День 1:\n• Подписать 1099 контракт\n• Заполнить W-9\n• Добавить в Telegram\n\nНеделя 1:\n• Теневая уборка\n• Оценочная уборка\n• Обратная связь", thumb:"📋", visibleTo:["hr","mgmt"] },
  { id:4, type:"youtube", dept:"sales", title:"Техники закрытия сделок",      url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", desc:"Мастер-класс по продажам", thumb:"💼", visibleTo:["sales","mgmt"] },
  { id:5, type:"sop",     dept:"sales", title:"SOP: Скрипт первого звонка",   content:"1. 'Natural Cleaning Experts, добрый день!'\n2. Выяснить потребность\n3. Предложить осмотр\n4. Назвать цену\n5. Закрыть на запись", thumb:"📞", visibleTo:["sales","mgmt"] },
  { id:6, type:"sop",     dept:"finance","title":"SOP: Выплаты 1099",        content:"• Выплаты каждую пятницу\n• Zelle (основной), Venmo (альт.)\n• 1099-NEC при $600+/год\n• Срок: 31 января", thumb:"💰", visibleTo:["finance","mgmt"] },
  { id:7, type:"youtube", dept:"ops",   title:"Стандарты уборки спален",      url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", desc:"Как убирать спальни по стандарту", thumb:"🛏️", visibleTo:["ops","supervision","mgmt","clients"] },
  { id:8, type:"sop",     dept:"smm",   title:"SOP: Контент-план Instagram",  content:"Понедельник: до-после уборки\nСреда: отзывы клиентов\nПятница: видео процесса\nВоскресенье: образовательный пост", thumb:"📱", visibleTo:["smm","marketing","mgmt"] },
];

const PERF_DATA = {
  1:[{w:"W18",done:5,assigned:6},{w:"W19",done:7,assigned:8},{w:"W20",done:6,assigned:7},{w:"W21",done:8,assigned:9}],
  2:[{w:"W18",done:4,assigned:4},{w:"W19",done:5,assigned:6},{w:"W20",done:5,assigned:5},{w:"W21",done:6,assigned:6}],
  5:[{w:"W18",done:8,assigned:10},{w:"W19",done:9,assigned:10},{w:"W20",done:7,assigned:9},{w:"W21",done:10,assigned:10}],
  6:[{w:"W18",done:3,assigned:4},{w:"W19",done:4,assigned:5},{w:"W20",done:4,assigned:4},{w:"W21",done:5,assigned:5}],
  7:[{w:"W18",done:6,assigned:6},{w:"W19",done:5,assigned:6},{w:"W20",done:6,assigned:6},{w:"W21",done:7,assigned:7}],
};

/* ─────────────────────────── STYLES ─────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080b12;--s1:#0f1420;--s2:#161c2a;--s3:#1e2535;
  --bdr:#ffffff0c;--bdr2:#ffffff16;
  --tx:#e8ecf4;--mu:#5a6480;--mu2:#3d4560;
  --acc:#f0a500;--gr:#22c55e;--rd:#ef4444;--bl:#3b82f6;
}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
input,select,textarea{font-family:'DM Sans',sans-serif;}
.app{display:flex;height:100vh;overflow:hidden;}
.sidebar{width:240px;min-width:240px;background:var(--s1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;overflow:hidden;}
.s-logo{padding:18px 16px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.s-logo-txt{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;}
.s-logo-txt span{color:var(--acc);}
.s-user{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--bdr);}
.s-nav{flex:1;padding:6px 8px;overflow-y:auto;display:flex;flex-direction:column;gap:1px;}
.s-sec{font-size:10px;color:var(--mu2);text-transform:uppercase;letter-spacing:1px;padding:10px 8px 3px;font-weight:600;}
.nav-btn{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;border:none;background:none;color:var(--mu);font-size:13px;font-weight:500;width:100%;text-align:left;transition:all .15s;}
.nav-btn:hover{background:var(--s2);color:var(--tx);}
.nav-btn.active{color:var(--acc);background:var(--acc)12;}
.nav-btn .ni{width:16px;text-align:center;font-size:14px;}
.nav-btn .nbadge{margin-left:auto;background:var(--acc);color:#000;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;}
.s-foot{padding:10px 16px;border-top:1px solid var(--bdr);font-size:11px;color:var(--mu);}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{padding:13px 22px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--s1);flex-shrink:0;}
.page-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;}
.page-sub{font-size:12px;color:var(--mu);margin-top:1px;}
.content{flex:1;overflow-y:auto;padding:22px;}
.btn{padding:7px 14px;border-radius:8px;border:none;font-size:13px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px;cursor:pointer;}
.btn-prim{background:var(--acc);color:#000;}
.btn-prim:hover{background:#fbbf24;}
.btn-ghost{background:var(--s2);color:var(--tx);border:1px solid var(--bdr);}
.btn-ghost:hover{background:var(--s3);}
.btn-sm{padding:4px 10px;font-size:11px;}
.btn-danger{background:#ef444418;color:var(--rd);border:1px solid #ef444428;}
.card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:16px 18px;}
.stat-lbl{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;}
.stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;margin-top:4px;}
.stat-sub{font-size:11px;margin-top:3px;color:var(--mu);}
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:8px 12px;color:var(--mu);font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:500;border-bottom:1px solid var(--bdr);}
td{padding:11px 12px;border-bottom:1px solid var(--bdr);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--s2);}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;}
.b-gr{background:#22c55e18;color:var(--gr);}
.b-rd{background:#ef444418;color:var(--rd);}
.b-yw{background:#f0a50018;color:var(--acc);}
.b-bl{background:#3b82f618;color:var(--bl);}
.b-pu{background:#a855f718;color:#a855f7;}
.b-mu{background:#ffffff10;color:var(--mu);}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.av-lg{width:40px;height:40px;font-size:14px;}
.flex-c{display:flex;align-items:center;gap:10px;}
.ovl{position:fixed;inset:0;background:#00000088;display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
.modal{background:var(--s1);border:1px solid var(--bdr2);border-radius:16px;padding:26px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;}
.modal-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:18px;}
.form-g{margin-bottom:14px;}
.lbl{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:block;}
.inp{width:100%;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:9px 11px;color:var(--tx);font-size:13px;outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--acc);}
select.inp option{background:var(--s2);}
textarea.inp{resize:vertical;min-height:80px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.form-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.modal-act{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;}
.dept-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin-bottom:20px;}
.dept-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:16px;cursor:pointer;transition:all .15s;}
.dept-card:hover{transform:translateY(-2px);border-color:var(--bdr2);}
.task-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.task-col{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:14px;}
.task-item{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:12px;margin-bottom:8px;}
.perf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px;}
.perf-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;}
.chat-layout{display:flex;height:100%;}
.chat-sidebar{width:200px;min-width:200px;border-right:1px solid var(--bdr);padding:10px 8px;overflow-y:auto;}
.chat-ch{padding:7px 10px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:500;color:var(--mu);display:flex;align-items:center;gap:8px;transition:all .15s;}
.chat-ch:hover{background:var(--s2);color:var(--tx);}
.chat-ch.active{background:var(--acc)15;color:var(--acc);}
.chat-main{flex:1;display:flex;flex-direction:column;}
.chat-hd{padding:12px 16px;border-bottom:1px solid var(--bdr);font-weight:600;font-size:14px;}
.chat-msgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;}
.chat-bubble{background:var(--s2);border-radius:10px;padding:10px 13px;max-width:70%;}
.chat-input-area{padding:10px 14px;border-top:1px solid var(--bdr);display:flex;gap:10px;}
.chat-input{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:10px;padding:9px 13px;color:var(--tx);font-size:13px;outline:none;}
.chat-input:focus{border-color:var(--acc);}
.chat-locked{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;color:var(--mu);gap:8px;}
.kb-tabs{display:flex;gap:4px;margin-bottom:16px;background:var(--s1);border:1px solid var(--bdr);border-radius:10px;padding:4px;width:fit-content;}
.kb-tab{padding:6px 14px;border-radius:7px;border:none;background:none;color:var(--mu);font-size:13px;font-weight:500;transition:all .15s;}
.kb-tab.active{background:var(--acc);color:#000;}
.kb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;}
.kb-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;cursor:pointer;transition:all .15s;}
.kb-card:hover{border-color:var(--bdr2);transform:translateY(-1px);}
.kb-full{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:24px;white-space:pre-line;line-height:1.9;font-size:14px;color:#c0cadf;}
.kb-back{display:flex;align-items:center;gap:6px;color:var(--mu);cursor:pointer;font-size:13px;margin-bottom:16px;}
.kb-back:hover{color:var(--tx);}
.sched-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-bottom:20px;}
.sched-day{background:var(--s1);border:1px solid var(--bdr);border-radius:10px;padding:12px;min-height:120px;}
.sched-day-hd{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;}
.sched-day-date{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:8px;}
.sched-shift{background:var(--s2);border-left:3px solid var(--acc);border-radius:6px;padding:6px 8px;margin-bottom:6px;font-size:11px;}
.sched-list{display:flex;flex-direction:column;gap:10px;}
.sched-item{background:var(--s1);border:1px solid var(--bdr);border-radius:10px;padding:14px;}
.branch-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-bottom:20px;}
.branch-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:16px;cursor:pointer;transition:all .15s;}
.branch-card:hover{transform:translateY(-2px);}
.branch-hq{border-color:var(--acc)30!important;background:var(--acc)08;}
.info-box{background:var(--bl)12;border:1px solid var(--bl)25;border-radius:8px;padding:10px 14px;font-size:12px;color:#93c5fd;margin-bottom:16px;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px;}
`;

/* ─────────────────────────── HELPERS ─────────────────────────── */
const COLORS_AV = ["#f0a500","#e05c2a","#22c55e","#3b82f6","#a855f7","#ec4899","#06b6d4","#f97316"];
const avColor = name => COLORS_AV[(name||"?").charCodeAt(0) % COLORS_AV.length];
const deptOf  = (depts, id) => depts.find(d => d.id === id);
const empOf   = (emps, id)  => emps.find(e => e.id === id);
const STATUS_LABELS = { todo:"К выполнению", in_progress:"В работе", done:"Готово" };
const STATUS_COLORS = { todo:"muted", in_progress:"yellow", done:"green" };
const PRIO_COLORS   = { high:"b-rd", medium:"b-yw", low:"b-gr" };

function Av({ name="?", size="", color }) {
  const c = color || avColor(name);
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return <div className={`av ${size}`} style={{background:c+"28",color:c}}>{initials}</div>;
}
function Badge({ children, cls }) {
  return <span className={`badge ${cls||"b-mu"}`}>{children}</span>;
}

/* ─────────────────────────── LOGIN ─────────────────────────── */
function LoginScreen({ employees, clients, onLogin }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!email.trim() || !password.trim()) { setError("Введите email и пароль"); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const e = email.trim().toLowerCase();
      const user = [...employees, ...clients].find(u => u.email === e && u.password === password);
      if (user) onLogin(user);
      else { setError("Неверный email или пароль"); setLoading(false); }
    }, 600);
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",flexDirection:"column"}}>
      <div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",width:500,height:500,background:"var(--acc)",opacity:.04,borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:44,fontWeight:800,letterSpacing:-2}}>NOVA<span style={{color:"var(--acc)"}}>.</span>TEAM</div>
        <div style={{color:"var(--mu)",fontSize:14,marginTop:6}}>Платформа управления командой</div>
      </div>
      <div style={{background:"var(--s1)",border:"1px solid var(--bdr2)",borderRadius:18,padding:"30px 34px",width:400}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:19,fontWeight:700,marginBottom:4}}>Добро пожаловать</div>
        <div style={{fontSize:13,color:"var(--mu)",marginBottom:22}}>Войдите в свой аккаунт</div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Email</label>
          <input style={{width:"100%",background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:"10px 13px",color:"var(--tx)",fontSize:13,outline:"none"}}
            placeholder="your@nova.team" value={email}
            onChange={e=>{setEmail(e.target.value);setError("");}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:5}}>Пароль</label>
          <div style={{position:"relative"}}>
            <input style={{width:"100%",background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:"10px 42px 10px 13px",color:"var(--tx)",fontSize:13,outline:"none"}}
              type={showPw?"text":"password"} placeholder="••••••••" value={password}
              onChange={e=>{setPassword(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--mu)",fontSize:15,padding:2}}>{showPw?"🙈":"👁"}</button>
          </div>
        </div>
        {error && <div style={{background:"#ef444418",border:"1px solid #ef444430",borderRadius:8,padding:"9px 13px",fontSize:12,color:"var(--rd)",marginBottom:14}}>⚠️ {error}</div>}
        <button onClick={handleLogin} disabled={loading}
          style={{width:"100%",background:loading?"var(--s3)":"var(--acc)",color:loading?"var(--mu)":"#000",border:"none",borderRadius:10,padding:"11px",fontSize:14,fontWeight:600,fontFamily:"'Syne',sans-serif",cursor:loading?"not-allowed":"pointer"}}>
          {loading?"Проверяем...":"Войти →"}
        </button>
        <div style={{marginTop:18,background:"var(--s2)",borderRadius:10,border:"1px solid var(--bdr)",padding:"12px"}}>
          <div style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Быстрый вход (тест)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {employees.slice(0,4).map(e=>(
              <button key={e.id} onClick={()=>{setEmail(e.email);setPassword(e.password);setError("");}}
                style={{background:"none",border:"1px solid var(--bdr)",borderRadius:6,padding:"5px 8px",color:"var(--mu)",fontSize:11,cursor:"pointer",textAlign:"left"}}>
                {e.name.split(" ")[0]} · {e.role.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{marginTop:18,fontSize:11,color:"var(--mu2)"}}> Natural Cleaning Experts © 2025</div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function NovaTeam() {
  const [departments, setDepartments] = useState(INIT_DEPARTMENTS);
  const [employees,   setEmployees]   = useState(INIT_EMPLOYEES);
  const [clients,     setClients]     = useState(INIT_CLIENTS);
  const [tasks,       setTasks]       = useState(INIT_TASKS);
  const [schedule,    setSchedule]    = useState(INIT_SCHEDULE);
  const [chatMsgs,    setChatMsgs]    = useState(INIT_CHAT_MSGS);
  const [kb,          setKb]          = useState(INIT_KB);
  const [currentUser, setCurrentUser] = useState(null);
  const [page,        setPage]        = useState("dashboard");
  const [chatChannel, setChatChannel] = useState("general");
  const [kbView,      setKbView]      = useState(null);
  const [kbFilter,    setKbFilter]    = useState("all");
  const [modal,       setModal]       = useState(null);
  const [chatInput,   setChatInput]   = useState("");
  const chatEndRef = useRef(null);

  const isAdmin  = currentUser?.id === 1 && currentUser?.type === "employee";
  const isClient = currentUser?.type === "client";

  // Default forms
  const defEmp  = { name:"", dept:"ops", branch:"austin", role:"", rate:"18", salary:"0", salaryType:"hourly", status:"active", email:"", password:"" };
  const defCli  = { name:"", contact:"", email:"", password:"", city:"austin", plan:"Basic" };
  const defTask = { title:"", assignee:"", dept:"ops", priority:"medium", due:"", status:"todo" };
  const defKb   = { type:"sop", dept:"ops", title:"", url:"", content:"", desc:"", thumb:"📄", visibleTo:[] };
  const defDept = { name:"", icon:"🏢", color:"#3b82f6" };
  const defSched= { employeeId:"", date:"", startTime:"09:00", endTime:"13:00", address:"", client:"", notes:"", status:"confirmed" };

  const [empForm,   setEmpForm]   = useState(defEmp);
  const [cliForm,   setCliForm]   = useState(defCli);
  const [taskForm,  setTaskForm]  = useState(defTask);
  const [kbForm,    setKbForm]    = useState(defKb);
  const [deptForm,  setDeptForm]  = useState(defDept);
  const [schedForm, setSchedForm] = useState(defSched);

  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [chatMsgs, chatChannel]);

  // Visibility helpers
  const myDept    = currentUser?.dept;
  const visibleEmps  = isAdmin ? employees : employees.filter(e => e.dept === myDept);
  const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.dept === myDept || t.assignee === currentUser?.id);
  const canAccessChat = (ch) => ch === "general" || ch === "clients" || isAdmin || ch === myDept;
  const chatDepts = isAdmin ? departments : departments.filter(d => d.id === myDept);
  const cleaningEmps = employees.filter(e => CLEANING_DEPTS.includes(e.dept));

  // KB visibility: admin sees all, client sees "clients" tagged, others see their dept
  const visibleKb = isAdmin ? kb
    : isClient ? kb.filter(a => a.visibleTo?.includes("clients"))
    : kb.filter(a => a.visibleTo?.includes(myDept) || a.visibleTo?.includes("all"));

  // CRUD helpers
  function addEmployee() {
    if (!empForm.name.trim() || !empForm.email.trim() || !empForm.password.trim()) return;
    const em = empForm.email.trim().toLowerCase();
    if ([...employees, ...clients].find(u => u.email === em)) { alert("Email уже занят"); return; }
    setEmployees(p => [...p, { ...empForm, id:Date.now(), rate:Number(empForm.rate), salary:Number(empForm.salary), type:"employee" }]);
    setEmpForm(defEmp); setModal(null);
  }

  function addClient() {
    if (!cliForm.name.trim() || !cliForm.email.trim() || !cliForm.password.trim()) return;
    const em = cliForm.email.trim().toLowerCase();
    if ([...employees, ...clients].find(u => u.email === em)) { alert("Email уже занят"); return; }
    setClients(p => [...p, { ...cliForm, id:Date.now(), email:em, joined:new Date().toISOString().split('T')[0], status:"active", type:"client" }]);
    setCliForm(defCli); setModal(null);
  }

  function addTask() {
    if (!taskForm.title.trim()) return;
    setTasks(p => [...p, { ...taskForm, id:Date.now(), assignee:Number(taskForm.assignee), createdBy:currentUser.id }]);
    setTaskForm({ ...defTask, dept:myDept||"ops", assignee:String(currentUser?.id) });
    setModal(null);
  }

  function updateTaskStatus(id, status) { setTasks(p => p.map(t => t.id===id ? {...t,status} : t)); }

  function addDept() {
    if (!deptForm.name.trim()) return;
    const id = deptForm.name.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"");
    if (departments.find(d => d.id === id)) { alert("Отдел с таким ID уже существует"); return; }
    setDepartments(p => [...p, { ...deptForm, id }]);
    // Add chat channel for new dept
    setChatMsgs(p => ({ ...p, [id]:[] }));
    setDeptForm(defDept); setModal(null);
  }

  function addKbItem() {
    if (!kbForm.title.trim()) return;
    const vt = kbForm.visibleTo.length > 0 ? kbForm.visibleTo : [kbForm.dept];
    setKb(p => [...p, { ...kbForm, id:Date.now(), visibleTo:vt }]);
    setKbForm(defKb); setModal(null);
  }

  function addSchedule() {
    if (!schedForm.employeeId || !schedForm.date) return;
    setSchedule(p => [...p, { ...schedForm, id:Date.now(), employeeId:Number(schedForm.employeeId) }]);
    setSchedForm(defSched); setModal(null);
  }

  function sendChat() {
    if (!chatInput.trim() || !chatChannel) return;
    setChatMsgs(p => ({
      ...p,
      [chatChannel]: [...(p[chatChannel]||[]), {
        id:Date.now(), author:currentUser.id, authorType:currentUser.type,
        text:chatInput.trim(), ts:new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})
      }]
    }));
    setChatInput("");
  }

  function removeEmp(id) { setEmployees(p => p.filter(e => e.id !== id)); }
  function removeCli(id) { setClients(p => p.filter(c => c.id !== id)); }

  /* ──────────── LOGIN ──────────── */
  if (!currentUser) {
    return (
      <>
        <style>{S}</style>
        <LoginScreen employees={employees} clients={clients} onLogin={u => { setCurrentUser(u); setChatChannel("general"); }} />
      </>
    );
  }

  /* ──────────── DASHBOARD ──────────── */
  const Dashboard = () => {
    const myT = visibleTasks.filter(t => t.assignee === currentUser.id);
    const totalPayroll = employees.filter(e=>e.salaryType==="fixed").reduce((s,e)=>s+Number(e.salary),0);
    return (
      <>
        <div className="stats-row">
          {[
            { lbl:"Сотрудников",  val:employees.length,                                          sub:`${employees.filter(e=>e.status==="active").length} активных`, color:"var(--acc)" },
            { lbl:"Клиентов NLS", val:clients.length,                                            sub:`${clients.filter(c=>c.status==="active").length} активных`, color:"#22c55e" },
            { lbl:"Задач",        val:visibleTasks.length,                                       sub:`${visibleTasks.filter(t=>t.status==="done").length} выполнено`, color:"#3b82f6" },
            isAdmin
              ? { lbl:"Фонд зарплат", val:`$${totalPayroll.toLocaleString()}`, sub:"Фиксированных/мес", color:"#a855f7" }
              : { lbl:"Мои задачи",   val:myT.length, sub:`${myT.filter(t=>t.status==="done").length} сделано`, color:"#06b6d4" },
          ].map((s,i) => (
            <div className="stat" key={i}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="card">
            <div className="card-hd"><div className="card-title">Последние задачи</div><button className="btn btn-ghost btn-sm" onClick={()=>setPage("tasks")}>Все →</button></div>
            {visibleTasks.slice(0,5).map(t => {
              const emp = empOf(employees, t.assignee);
              return (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                  {emp && <Av name={emp.name} />}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{emp?.name}</div>
                  </div>
                  <Badge cls={`badge ${STATUS_COLORS[t.status]==="green"?"b-gr":STATUS_COLORS[t.status]==="yellow"?"b-yw":"b-mu"}`}>{STATUS_LABELS[t.status]}</Badge>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Отделы</div><button className="btn btn-ghost btn-sm" onClick={()=>setPage("departments")}>Все →</button></div>
            {departments.map(d => (
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid var(--bdr)"}}>
                <span style={{fontSize:16,width:22,textAlign:"center"}}>{d.icon}</span>
                <span style={{flex:1,fontSize:13,fontWeight:500}}>{d.name}</span>
                <span style={{fontSize:13,fontWeight:600,color:d.color}}>{employees.filter(e=>e.dept===d.id).length}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  /* ──────────── DEPARTMENTS ──────────── */
  const Departments = () => {
    const [activeD, setActiveD] = useState(null);
    const deptEmps = activeD ? employees.filter(e=>e.dept===activeD) : [];
    const d = deptOf(departments, activeD);

    if (activeD) return (
      <>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setActiveD(null)}>← Назад</button>
          <span style={{fontSize:18}}>{d?.icon}</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17}}>{d?.name}</span>
          <Badge cls="b-mu">{deptEmps.length} сотрудников</Badge>
          {isAdmin && <button className="btn btn-prim btn-sm" style={{marginLeft:"auto"}} onClick={()=>{ setEmpForm({...defEmp,dept:activeD}); setModal("emp"); }}>+ Добавить</button>}
        </div>
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Сотрудник</th><th>Роль</th><th>Email</th><th>Ставка</th><th>Зарплата</th><th>Статус</th>{isAdmin&&<th></th>}</tr></thead>
              <tbody>
                {deptEmps.map(m => (
                  <tr key={m.id}>
                    <td><div className="flex-c"><Av name={m.name} color={d?.color}/><span style={{fontWeight:500}}>{m.name}</span></div></td>
                    <td style={{color:"var(--mu)"}}>{m.role}</td>
                    <td style={{fontSize:12,color:"var(--mu)"}}>{m.email}</td>
                    <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600}}>{m.salaryType==="hourly"?`$${m.rate}/h`:"—"}</td>
                    <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600,color:"var(--gr)"}}>{m.salaryType==="fixed"?`$${m.salary}/мес`:"По часам"}</td>
                    <td><Badge cls={m.status==="active"?"b-gr":"b-rd"}>{m.status==="active"?"Активен":"Неактив."}</Badge></td>
                    {isAdmin && <td><button className="btn btn-danger btn-sm" onClick={()=>removeEmp(m.id)}>×</button></td>}
                  </tr>
                ))}
                {!deptEmps.length && <tr><td colSpan={7} style={{textAlign:"center",color:"var(--mu)",padding:24}}>Нет сотрудников</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );

    return (
      <>
        {isAdmin && (
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <button className="btn btn-prim" onClick={()=>setModal("emp")}>+ Добавить сотрудника</button>
            <button className="btn btn-ghost" onClick={()=>setModal("dept")}>+ Новый отдел</button>
          </div>
        )}
        <div className="dept-grid">
          {departments.map(d => {
            const cnt = employees.filter(e=>e.dept===d.id).length;
            return (
              <div key={d.id} className="dept-card" onClick={()=>setActiveD(d.id)}>
                <div style={{fontSize:24,marginBottom:8}}>{d.icon}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14,marginBottom:4}}>{d.name}</div>
                <div style={{fontSize:12,color:"var(--mu)",marginBottom:10}}>{cnt} сотрудников</div>
                <div style={{height:3,borderRadius:2,background:d.color,opacity:.7}} />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ──────────── BRANCHES ──────────── */
  const Branches = () => {
    const [activeBr, setActiveBr] = useState(null);
    return (
      <>
        <div className="branch-grid">
          {BRANCHES.map(b => {
            const cnt = employees.filter(e=>e.branch===b.id).length;
            return (
              <div key={b.id} className={`branch-card ${b.isHQ?"branch-hq":""} ${activeBr===b.id?"":""}` } onClick={()=>setActiveBr(b.id===activeBr?null:b.id)}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:20}}>{b.isHQ?"🏢":"🏙️"}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15}}>{b.name}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{b.isHQ?"Головной офис":"Подразделение"}</div>
                  </div>
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:b.isHQ?"var(--acc)":"var(--tx)"}}>{cnt}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>сотрудников</div>
              </div>
            );
          })}
        </div>
        {activeBr && (
          <div className="card">
            <div className="card-hd">
              <div className="card-title">{BRANCHES.find(b=>b.id===activeBr)?.name}</div>
              {isAdmin && <button className="btn btn-prim btn-sm" onClick={()=>{ setEmpForm({...defEmp,branch:activeBr}); setModal("emp"); }}>+ Добавить</button>}
            </div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Сотрудник</th><th>Отдел</th><th>Роль</th><th>Статус</th></tr></thead>
                <tbody>
                  {employees.filter(e=>e.branch===activeBr).map(m => {
                    const d = deptOf(departments, m.dept);
                    return (
                      <tr key={m.id}>
                        <td><div className="flex-c"><Av name={m.name}/><span style={{fontWeight:500}}>{m.name}</span></div></td>
                        <td><span style={{color:d?.color}}>{d?.icon} {d?.name}</span></td>
                        <td style={{color:"var(--mu)"}}>{m.role}</td>
                        <td><Badge cls={m.status==="active"?"b-gr":"b-rd"}>{m.status==="active"?"Активен":"Неактив."}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  /* ──────────── CLIENTS (NLS) ──────────── */
  const Clients = () => (
    <>
      {isAdmin && (
        <div style={{marginBottom:16}}>
          <button className="btn btn-prim" onClick={()=>setModal("client")}>+ Добавить клиента</button>
        </div>
      )}
      <div className="info-box">ℹ️ Клиенты Nova Launch System получают доступ к обучению и общему чату. Они не видят внутренние отделы.</div>
      <div className="card">
        <div className="card-hd"><div className="card-title">Клиенты Nova Launch System</div><Badge cls="b-bl">{clients.length}</Badge></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Компания</th><th>Контакт</th><th>Email</th><th>Город</th><th>Тариф</th><th>Дата</th><th>Статус</th>{isAdmin&&<th></th>}</tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td><div className="flex-c"><Av name={c.name} color="#06b6d4"/><span style={{fontWeight:500}}>{c.name}</span></div></td>
                  <td style={{color:"var(--mu)"}}>{c.contact}</td>
                  <td style={{fontSize:12,color:"var(--mu)"}}>{c.email}</td>
                  <td>{c.city}</td>
                  <td><Badge cls={c.plan==="Pro"?"b-yw":"b-bl"}>{c.plan}</Badge></td>
                  <td style={{fontSize:12,color:"var(--mu)"}}>{c.joined}</td>
                  <td><Badge cls={c.status==="active"?"b-gr":"b-rd"}>{c.status==="active"?"Активен":"Неактив."}</Badge></td>
                  {isAdmin && <td><button className="btn btn-danger btn-sm" onClick={()=>removeCli(c.id)}>×</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  /* ──────────── SALARY ──────────── */
  const Salary = () => {
    const hourlyEmps = employees.filter(e=>e.salaryType==="hourly");
    const fixedEmps  = employees.filter(e=>e.salaryType==="fixed");
    const totalFixed = fixedEmps.reduce((s,e)=>s+Number(e.salary),0);
    const totalHourly = hourlyEmps.reduce((s,e)=>s+(Number(e.rate)*40*4),0); // est 40h/week
    return (
      <>
        <div className="stats-row">
          {[
            { lbl:"Фикс. зарплат",  val:`$${totalFixed.toLocaleString()}`, sub:"В месяц",        color:"var(--gr)" },
            { lbl:"Почасовых",      val:`~$${totalHourly.toLocaleString()}`,sub:"Оценка/месяц",   color:"var(--acc)" },
            { lbl:"Сотрудников",    val:employees.length,                   sub:"Всего в системе", color:"var(--bl)" },
            { lbl:"1099 подрядч.",  val:hourlyEmps.length,                  sub:"Почасовая ставка",color:"#a855f7" },
          ].map((s,i)=>(
            <div className="stat" key={i}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="card">
            <div className="card-hd"><div className="card-title">💰 Фиксированные зарплаты</div></div>
            <table>
              <thead><tr><th>Сотрудник</th><th>Роль</th><th>Зарплата/мес</th></tr></thead>
              <tbody>
                {fixedEmps.map(e=>{
                  const d=deptOf(departments,e.dept);
                  return (
                    <tr key={e.id}>
                      <td><div className="flex-c"><Av name={e.name} color={d?.color}/><span style={{fontWeight:500}}>{e.name}</span></div></td>
                      <td style={{color:"var(--mu)"}}>{e.role}</td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"var(--gr)"}}>${Number(e.salary).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">⏱ Почасовые (1099)</div></div>
            <table>
              <thead><tr><th>Сотрудник</th><th>Ставка/час</th><th>Оценка/мес</th></tr></thead>
              <tbody>
                {hourlyEmps.map(e=>{
                  const d=deptOf(departments,e.dept);
                  return (
                    <tr key={e.id}>
                      <td><div className="flex-c"><Av name={e.name} color={d?.color}/><span style={{fontWeight:500}}>{e.name}</span></div></td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600}}>${e.rate}/h</td>
                      <td style={{color:"var(--acc)"}}>~${(e.rate*40*4).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  /* ──────────── SCHEDULE ──────────── */
  const Schedule = () => {
    const [filterEmp, setFilterEmp] = useState("all");
    const filtered = filterEmp==="all" ? schedule : schedule.filter(s=>s.employeeId===Number(filterEmp));
    const byDate = {};
    filtered.forEach(s => { if(!byDate[s.date]) byDate[s.date]=[]; byDate[s.date].push(s); });
    const dates = Object.keys(byDate).sort();
    return (
      <>
        <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
          {isAdmin && <button className="btn btn-prim" onClick={()=>setModal("schedule")}>+ Добавить смену</button>}
          <select className="inp" style={{width:"auto"}} value={filterEmp} onChange={e=>setFilterEmp(e.target.value)}>
            <option value="all">Все клинеры</option>
            {cleaningEmps.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="info-box">📅 Расписание для клинеров и супервайзеров. Каждая смена содержит адрес объекта и время.</div>
        <div className="sched-list">
          {dates.map(date => (
            <div key={date} style={{marginBottom:16}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:10,color:"var(--acc)"}}>
                📅 {new Date(date).toLocaleDateString('ru',{weekday:'long',day:'numeric',month:'long'})}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
                {byDate[date].map(s => {
                  const emp = empOf(employees, s.employeeId);
                  const d   = emp ? deptOf(departments, emp.dept) : null;
                  return (
                    <div key={s.id} className="sched-item">
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        {emp && <Av name={emp.name} color={d?.color}/>}
                        <div>
                          <div style={{fontWeight:600,fontSize:13}}>{emp?.name}</div>
                          <div style={{fontSize:11,color:"var(--mu)"}}>{emp?.role}</div>
                        </div>
                        <Badge cls={s.status==="confirmed"?"b-gr":"b-yw"} style={{marginLeft:"auto"}}>{s.status==="confirmed"?"✓ Подтв.":"Ожид."}</Badge>
                      </div>
                      <div style={{fontSize:13,fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:4}}>
                        🕐 {s.startTime} – {s.endTime}
                      </div>
                      <div style={{fontSize:12,color:"var(--mu)",marginBottom:2}}>📍 {s.address}</div>
                      <div style={{fontSize:12,color:"var(--tx)"}}>👤 {s.client}</div>
                      {s.notes && <div style={{fontSize:11,color:"var(--mu)",marginTop:6,fontStyle:"italic"}}>💬 {s.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {!dates.length && (
            <div style={{textAlign:"center",padding:48,color:"var(--mu)"}}>
              <div style={{fontSize:32,marginBottom:8}}>📅</div>
              <div>Нет смен для выбранного фильтра</div>
            </div>
          )}
        </div>
      </>
    );
  };

  /* ──────────── TASKS ──────────── */
  const Tasks = () => {
    const cols = ["todo","in_progress","done"];
    const colNames = { todo:"📋 К выполнению", in_progress:"⚡ В работе", done:"✅ Готово" };
    const colColors = { todo:"var(--mu)", in_progress:"var(--acc)", done:"var(--gr)" };
    return (
      <>
        <div style={{marginBottom:14}}>
          <button className="btn btn-prim" onClick={()=>{ setTaskForm({...defTask,dept:myDept||"ops",assignee:String(currentUser.id)}); setModal("task"); }}>+ Создать задачу</button>
        </div>
        <div className="task-cols">
          {cols.map(col => {
            const colT = visibleTasks.filter(t=>t.status===col);
            return (
              <div key={col} className="task-col">
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,color:colColors[col],marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  {colNames[col]}<span style={{marginLeft:"auto",background:"var(--s3)",color:"var(--mu)",fontSize:11,padding:"2px 8px",borderRadius:12}}>{colT.length}</span>
                </div>
                {colT.map(t => {
                  const emp = empOf(employees, t.assignee);
                  return (
                    <div key={t.id} className="task-item">
                      <div style={{fontSize:13,fontWeight:500,marginBottom:8,lineHeight:1.4}}>{t.title}</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        {emp && <div className="flex-c" style={{gap:5}}><Av name={emp.name}/><span style={{fontSize:11,color:"var(--mu)"}}>{emp.name.split(' ')[0]}</span></div>}
                        <span className={`badge ${PRIO_COLORS[t.priority]||"b-mu"}`}>{t.priority}</span>
                        {t.due && <span style={{fontSize:10,color:"var(--mu)"}}>📅 {t.due}</span>}
                      </div>
                      <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                        {col!=="todo"        && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"todo")}>← Назад</button>}
                        {col==="todo"        && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"in_progress")}>В работу →</button>}
                        {col==="in_progress" && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"done")}>✓ Готово</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ──────────── PERFORMANCE ──────────── */
  const Performance = () => (
    <div className="perf-grid">
      {visibleEmps.map(emp => {
        const data = PERF_DATA[emp.id] || [];
        const total = data.reduce((s,d)=>s+d.assigned,0);
        const done  = data.reduce((s,d)=>s+d.done,0);
        const pct   = total ? Math.round(done/total*100) : 0;
        const d = deptOf(departments, emp.dept);
        return (
          <div key={emp.id} className="perf-card">
            <div className="flex-c" style={{marginBottom:12}}>
              <Av name={emp.name} size="av-lg" color={d?.color}/>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{emp.name}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>{d?.icon} {d?.name}</div>
              </div>
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,color:pct>=80?"var(--gr)":pct>=60?"var(--acc)":"var(--rd)"||"var(--mu)"}}>{total?`${pct}%`:"—"}</div>
                <div style={{fontSize:11,color:"var(--mu)"}}>эффективность</div>
              </div>
            </div>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={data} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08"/>
                  <XAxis dataKey="w" tick={{fill:"#5a6480",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip contentStyle={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="assigned" fill="#ffffff12" radius={[3,3,0,0]} name="Назначено"/>
                  <Bar dataKey="done" fill={d?.color||"var(--acc)"} radius={[3,3,0,0]} name="Выполнено"/>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{fontSize:12,color:"var(--mu)",textAlign:"center",padding:"16px 0"}}>Данные появятся после выполнения задач</div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ──────────── CHAT ──────────── */
  const Chat = () => {
    const msgs = chatMsgs[chatChannel] || [];
    const canAccess = canAccessChat(chatChannel);
    const chName = chatChannel==="general" ? "Общий чат" : chatChannel==="clients" ? "Клиенты NLS" : deptOf(departments,chatChannel)?.name || chatChannel;
    return (
      <div className="chat-layout" style={{height:"calc(100vh - 108px)"}}>
        <div className="chat-sidebar">
          <div style={{fontSize:10,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:1,padding:"4px 2px 6px",fontWeight:600}}>Общие</div>
          {[
            { id:"general", icon:"📢", name:"Общий" },
            ...(isAdmin||isClient?[{ id:"clients", icon:"🏢", name:"Клиенты NLS" }]:[]),
          ].map(ch=>(
            <div key={ch.id} className={`chat-ch ${chatChannel===ch.id?"active":""}`} onClick={()=>setChatChannel(ch.id)}
              style={{marginBottom:ch.id==="clients"?8:2,paddingBottom:ch.id==="clients"?8:0,borderBottom:ch.id==="clients"?"1px solid var(--bdr)":"none"}}>
              <span>{ch.icon}</span><span>{ch.name}</span>
            </div>
          ))}
          {!isClient && <>
            <div style={{fontSize:10,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:1,padding:"4px 2px 6px",fontWeight:600}}>Отделы</div>
            {chatDepts.map(d=>(
              <div key={d.id} className={`chat-ch ${chatChannel===d.id?"active":""}`} onClick={()=>setChatChannel(d.id)}>
                <span>{d.icon}</span><span>{d.name.replace("Отдел ","").replace("Операционный","Ops")}</span>
              </div>
            ))}
          </>}
        </div>
        <div className="chat-main">
          <div className="chat-hd">
            {chatChannel==="general" && "📢 Общий чат"}
            {chatChannel==="clients" && "🏢 Клиенты Nova Launch System"}
            {chatChannel!=="general"&&chatChannel!=="clients" && `${deptOf(departments,chatChannel)?.icon||""} ${deptOf(departments,chatChannel)?.name||chatChannel}`}
            {!canAccess && <span style={{fontSize:12,color:"var(--rd)",marginLeft:8}}>🔒 Нет доступа</span>}
          </div>
          {canAccess ? (
            <>
              <div className="chat-msgs">
                {msgs.map(m=>{
                  const author = m.authorType==="client"
                    ? clients.find(c=>c.id===m.author)
                    : empOf(employees,m.author);
                  if(!author) return null;
                  const isMe = m.author===currentUser.id && m.authorType===currentUser.type;
                  const d = m.authorType==="employee" ? deptOf(departments,author.dept) : null;
                  const color = m.authorType==="client" ? "#06b6d4" : d?.color||"var(--acc)";
                  const displayName = m.authorType==="client" ? author.name : author.name?.split(' ')[0];
                  return (
                    <div key={m.id} style={{display:"flex",gap:10,flexDirection:isMe?"row-reverse":"row"}}>
                      <Av name={author.name||"?"} color={color}/>
                      <div className="chat-bubble" style={{background:isMe?"var(--acc)15":undefined}}>
                        <div style={{fontSize:11,fontWeight:600,color,marginBottom:4}}>{displayName} {m.authorType==="client"&&"🏢"}</div>
                        <div style={{fontSize:13,color:"#c8d0e0",lineHeight:1.5}}>{m.text}</div>
                        <div style={{fontSize:10,color:"var(--mu)",marginTop:4}}>{m.ts}</div>
                      </div>
                    </div>
                  );
                })}
                {!msgs.length && <div style={{textAlign:"center",color:"var(--mu)",padding:40,fontSize:13}}>Начните общение...</div>}
                <div ref={chatEndRef}/>
              </div>
              <div className="chat-input-area">
                <input className="chat-input" placeholder={`Написать в "${chName}"...`}
                  value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendChat(); }}}/>
                <button className="btn btn-prim" onClick={sendChat}>→</button>
              </div>
            </>
          ) : (
            <div className="chat-locked"><span style={{fontSize:36}}>🔒</span><span>Доступ закрыт</span><span style={{fontSize:12}}>Этот канал принадлежит другому отделу</span></div>
          )}
        </div>
      </div>
    );
  };

  /* ──────────── KNOWLEDGE BASE ──────────── */
  const KnowledgeBase = () => {
    const filtered = kbFilter==="all" ? visibleKb : visibleKb.filter(a=>a.type===kbFilter);

    if (kbView) {
      const a = kb.find(k=>k.id===kbView);
      if (!a) { setKbView(null); return null; }
      return (
        <>
          <div className="kb-back" onClick={()=>setKbView(null)}>← Назад к базе знаний</div>
          <div style={{maxWidth:700}}>
            <div style={{fontSize:30,marginBottom:8}}>{a.thumb}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,marginBottom:4}}>{a.title}</div>
            <div style={{fontSize:12,color:"var(--mu)",marginBottom:20,display:"flex",gap:8,flexWrap:"wrap"}}>
              <Badge cls={a.type==="youtube"?"b-rd":"b-bl"}>{a.type==="youtube"?"▶ YouTube":"📄 SOP"}</Badge>
              {isAdmin && a.visibleTo?.map(v=><Badge key={v} cls="b-mu">{deptOf(INIT_DEPARTMENTS,v)?.name || v}</Badge>)}
            </div>
            {a.type==="youtube" ? (
              <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:12,padding:24,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:8}}>▶️</div>
                <div style={{fontSize:14,marginBottom:12,color:"var(--mu)"}}>{a.desc}</div>
                <a href={a.url} target="_blank" rel="noreferrer" className="btn btn-prim" style={{textDecoration:"none"}}>Открыть на YouTube</a>
              </div>
            ) : (
              <div className="kb-full">{a.content}</div>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div className="kb-tabs">
            {[["all","Все"],["sop","SOP"],["youtube","YouTube"]].map(([val,lbl])=>(
              <button key={val} className={`kb-tab ${kbFilter===val?"active":""}`} onClick={()=>setKbFilter(val)}>{lbl}</button>
            ))}
          </div>
          {isAdmin && <button className="btn btn-prim" onClick={()=>setModal("kb")}>+ Добавить материал</button>}
        </div>
        {!isAdmin && <div className="info-box">📚 Показаны материалы для твоего отдела{isClient?" и обучения клиентов":""}.</div>}
        <div className="kb-grid">
          {filtered.map(a=>(
            <div key={a.id} className="kb-card" style={{borderColor:a.type==="youtube"?"#ef444425":undefined}} onClick={()=>setKbView(a.id)}>
              <div style={{fontSize:26,marginBottom:8}}>{a.thumb}</div>
              <div style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{a.type==="youtube"?"▶ YouTube":"📄 SOP"}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:600,marginBottom:6}}>{a.title}</div>
              <div style={{fontSize:12,color:"var(--mu)"}}>{a.desc||a.content?.slice(0,60)+"..."}</div>
            </div>
          ))}
          {!filtered.length && (
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:48,color:"var(--mu)"}}>
              <div style={{fontSize:32,marginBottom:8}}>📭</div>
              <div>Нет материалов в этой категории</div>
            </div>
          )}
        </div>
      </>
    );
  };

  /* ──────────── NAV CONFIG ──────────── */
  const pages = isClient
    ? [
        { key:"dashboard", icon:"🏠", label:"Главная", section:"Меню" },
        { key:"kb",        icon:"📚", label:"Обучение", section:"Меню" },
        { key:"chat",      icon:"💬", label:"Чат",     section:"Меню" },
      ]
    : [
        { key:"dashboard",   icon:"🏠", label:"Главная",        section:"Главное" },
        { key:"departments", icon:"🏢", label:"Отделы",         section:"Главное" },
        { key:"branches",    icon:"📍", label:"Подразделения",   section:"Главное" },
        { key:"clients",     icon:"🏆", label:"Клиенты NLS",    section:"Главное" },
        { key:"tasks",       icon:"✅", label:"Задачи",          section:"Работа" },
        { key:"schedule",    icon:"📅", label:"Расписание",      section:"Работа" },
        { key:"salary",      icon:"💵", label:"Зарплаты",        section:"Работа" },
        { key:"performance", icon:"📊", label:"Эффективность",   section:"Работа" },
        { key:"chat",        icon:"💬", label:"Чат",             section:"Общение" },
        { key:"kb",          icon:"📚", label:"База знаний",     section:"Общение" },
      ];

  const sections = [...new Set(pages.map(p=>p.section))];
  const pendingT = visibleTasks.filter(t=>t.status!=="done").length;
  const pageMap  = { dashboard:<Dashboard/>, departments:<Departments/>, branches:<Branches/>, clients:<Clients/>, tasks:<Tasks/>, schedule:<Schedule/>, salary:<Salary/>, performance:<Performance/>, chat:<Chat/>, kb:<KnowledgeBase/> };
  const pageTitles = { dashboard:"Дашборд", departments:"Отделы", branches:"Подразделения", clients:"Клиенты NLS", tasks:"Задачи", schedule:"Расписание", salary:"Зарплаты", performance:"Эффективность", chat:"Чат", kb:"База знаний" };

  return (
    <>
      <style>{S}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="s-logo">
            <div className="s-logo-txt">NOVA<span>.</span>TEAM</div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setCurrentUser(null)} title="Выйти">⏏</button>
          </div>
          <div className="s-user">
            <Av name={currentUser.name} color={isClient?"#06b6d4":deptOf(departments,currentUser.dept)?.color}/>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.name?.split(' ')[0]}</div>
              <div style={{fontSize:10,color:"var(--mu)"}}>{isClient?"Клиент NLS":currentUser.role}</div>
            </div>
          </div>
          <nav className="s-nav">
            {sections.map(sec=>(
              <div key={sec}>
                <div className="s-sec">{sec}</div>
                {pages.filter(p=>p.section===sec).map(p=>(
                  <button key={p.key} className={`nav-btn ${page===p.key?"active":""}`} onClick={()=>setPage(p.key)}>
                    <span className="ni">{p.icon}</span>{p.label}
                    {p.key==="tasks"&&pendingT>0&&<span className="nbadge">{pendingT}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="s-foot">{isAdmin&&"👑 Администратор · "}Natural Cleaning Experts</div>
        </div>

        {/* MAIN */}
        <div className="main">
          {page!=="chat" && (
            <div className="topbar">
              <div>
                <div className="page-title">{pageTitles[page]||page}</div>
                <div className="page-sub">{isClient?"Nova Launch System":isAdmin?"Полный доступ":deptOf(departments,myDept)?.name}</div>
              </div>
            </div>
          )}
          <div className="content" style={page==="chat"?{padding:0,overflow:"hidden"}:{}}>
            {pageMap[page]}
          </div>
        </div>

        {/* ── MODALS ── */}

        {/* ADD EMPLOYEE */}
        {modal==="emp" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новый сотрудник</div>
              <div className="info-box">🔐 Логин и пароль создаёт администратор. Сотрудник не может их изменить.</div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Полное имя</label><input className="inp" value={empForm.name} onChange={e=>setEmpForm(p=>({...p,name:e.target.value}))} placeholder="Anna Smith"/></div>
                <div className="form-g"><label className="lbl">Должность</label><input className="inp" value={empForm.role} onChange={e=>setEmpForm(p=>({...p,role:e.target.value}))} placeholder="Sales Manager"/></div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Email (логин)</label><input className="inp" value={empForm.email} onChange={e=>setEmpForm(p=>({...p,email:e.target.value}))} placeholder="anna@nova.team"/></div>
                <div className="form-g"><label className="lbl">Пароль</label><input className="inp" type="text" value={empForm.password} onChange={e=>setEmpForm(p=>({...p,password:e.target.value}))} placeholder="anna2025"/></div>
              </div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Отдел</label>
                  <select className="inp" value={empForm.dept} onChange={e=>setEmpForm(p=>({...p,dept:e.target.value}))}>
                    {departments.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Подразделение</label>
                  <select className="inp" value={empForm.branch} onChange={e=>setEmpForm(p=>({...p,branch:e.target.value}))}>
                    {BRANCHES.map(b=><option key={b.id} value={b.id}>{b.name}{b.isHQ?" (HQ)":""}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row3">
                <div className="form-g">
                  <label className="lbl">Тип оплаты</label>
                  <select className="inp" value={empForm.salaryType} onChange={e=>setEmpForm(p=>({...p,salaryType:e.target.value}))}>
                    <option value="hourly">Почасовая (1099)</option>
                    <option value="fixed">Фикс. зарплата</option>
                  </select>
                </div>
                {empForm.salaryType==="hourly"
                  ? <div className="form-g"><label className="lbl">Ставка $/час</label><input className="inp" type="number" value={empForm.rate} onChange={e=>setEmpForm(p=>({...p,rate:e.target.value}))}/></div>
                  : <div className="form-g"><label className="lbl">Зарплата $/мес</label><input className="inp" type="number" value={empForm.salary} onChange={e=>setEmpForm(p=>({...p,salary:e.target.value}))}/></div>
                }
                <div className="form-g">
                  <label className="lbl">Статус</label>
                  <select className="inp" value={empForm.status} onChange={e=>setEmpForm(p=>({...p,status:e.target.value}))}>
                    <option value="active">Активен</option><option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addEmployee}>Создать аккаунт</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD CLIENT */}
        {modal==="client" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новый клиент Nova Launch System</div>
              <div className="info-box">🏢 Клиент получит доступ к обучению и чату клиентов. Пароль создаёт администратор.</div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Название компании</label><input className="inp" value={cliForm.name} onChange={e=>setCliForm(p=>({...p,name:e.target.value}))} placeholder="Startup Clean Co"/></div>
                <div className="form-g"><label className="lbl">Контактное лицо</label><input className="inp" value={cliForm.contact} onChange={e=>setCliForm(p=>({...p,contact:e.target.value}))} placeholder="John Smith"/></div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Email (логин)</label><input className="inp" value={cliForm.email} onChange={e=>setCliForm(p=>({...p,email:e.target.value}))} placeholder="john@company.com"/></div>
                <div className="form-g"><label className="lbl">Пароль</label><input className="inp" type="text" value={cliForm.password} onChange={e=>setCliForm(p=>({...p,password:e.target.value}))} placeholder="john2025"/></div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Город</label><input className="inp" value={cliForm.city} onChange={e=>setCliForm(p=>({...p,city:e.target.value}))} placeholder="Dallas"/></div>
                <div className="form-g">
                  <label className="lbl">Тариф</label>
                  <select className="inp" value={cliForm.plan} onChange={e=>setCliForm(p=>({...p,plan:e.target.value}))}>
                    <option>Basic</option><option>Pro</option><option>VIP</option>
                  </select>
                </div>
              </div>
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addClient}>Создать аккаунт</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD DEPARTMENT */}
        {modal==="dept" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новый отдел</div>
              <div className="form-g"><label className="lbl">Название отдела</label><input className="inp" value={deptForm.name} onChange={e=>setDeptForm(p=>({...p,name:e.target.value}))} placeholder="Отдел логистики"/></div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Иконка (эмодзи)</label><input className="inp" value={deptForm.icon} onChange={e=>setDeptForm(p=>({...p,icon:e.target.value}))} placeholder="🚚"/></div>
                <div className="form-g">
                  <label className="lbl">Цвет</label>
                  <select className="inp" value={deptForm.color} onChange={e=>setDeptForm(p=>({...p,color:e.target.value}))}>
                    {DEPT_COLORS.map(c=><option key={c} value={c} style={{background:c}}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                {DEPT_COLORS.map(c=>(
                  <div key={c} onClick={()=>setDeptForm(p=>({...p,color:c}))}
                    style={{width:28,height:28,borderRadius:6,background:c,cursor:"pointer",border:deptForm.color===c?"2px solid white":"2px solid transparent"}}/>
                ))}
              </div>
              <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:12,marginBottom:14}}>
                <div style={{fontSize:11,color:"var(--mu)",marginBottom:6}}>Предпросмотр:</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{deptForm.icon}</span>
                  <span style={{fontWeight:600,color:deptForm.color}}>{deptForm.name||"Название отдела"}</span>
                </div>
              </div>
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addDept}>Создать отдел</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD TASK */}
        {modal==="task" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новая задача</div>
              <div className="form-g"><label className="lbl">Название задачи</label><input className="inp" value={taskForm.title} onChange={e=>setTaskForm(p=>({...p,title:e.target.value}))} placeholder="Описание задачи..."/></div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Исполнитель</label>
                  <select className="inp" value={taskForm.assignee} onChange={e=>setTaskForm(p=>({...p,assignee:e.target.value}))}>
                    <option value="">Выберите...</option>
                    {(isAdmin?employees:visibleEmps).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Отдел</label>
                  <select className="inp" value={taskForm.dept} onChange={e=>setTaskForm(p=>({...p,dept:e.target.value}))}>
                    {(isAdmin?departments:departments.filter(d=>d.id===myDept)).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Приоритет</label>
                  <select className="inp" value={taskForm.priority} onChange={e=>setTaskForm(p=>({...p,priority:e.target.value}))}>
                    <option value="high">🔴 Высокий</option><option value="medium">🟡 Средний</option><option value="low">🟢 Низкий</option>
                  </select>
                </div>
                <div className="form-g"><label className="lbl">Срок</label><input className="inp" type="date" value={taskForm.due} onChange={e=>setTaskForm(p=>({...p,due:e.target.value}))}/></div>
              </div>
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addTask}>Создать</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD SCHEDULE */}
        {modal==="schedule" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Добавить смену</div>
              <div className="form-g">
                <label className="lbl">Сотрудник (клинер / супервайзер)</label>
                <select className="inp" value={schedForm.employeeId} onChange={e=>setSchedForm(p=>({...p,employeeId:e.target.value}))}>
                  <option value="">Выберите...</option>
                  {cleaningEmps.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Дата</label><input className="inp" type="date" value={schedForm.date} onChange={e=>setSchedForm(p=>({...p,date:e.target.value}))}/></div>
                <div className="form-g">
                  <label className="lbl">Статус</label>
                  <select className="inp" value={schedForm.status} onChange={e=>setSchedForm(p=>({...p,status:e.target.value}))}>
                    <option value="confirmed">Подтверждено</option><option value="pending">Ожидание</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Начало</label><input className="inp" type="time" value={schedForm.startTime} onChange={e=>setSchedForm(p=>({...p,startTime:e.target.value}))}/></div>
                <div className="form-g"><label className="lbl">Конец</label><input className="inp" type="time" value={schedForm.endTime} onChange={e=>setSchedForm(p=>({...p,endTime:e.target.value}))}/></div>
              </div>
              <div className="form-g"><label className="lbl">Адрес объекта</label><input className="inp" value={schedForm.address} onChange={e=>setSchedForm(p=>({...p,address:e.target.value}))} placeholder="123 Oak St, Austin TX"/></div>
              <div className="form-g"><label className="lbl">Клиент</label><input className="inp" value={schedForm.client} onChange={e=>setSchedForm(p=>({...p,client:e.target.value}))} placeholder="Johnson Family"/></div>
              <div className="form-g"><label className="lbl">Заметки</label><input className="inp" value={schedForm.notes} onChange={e=>setSchedForm(p=>({...p,notes:e.target.value}))} placeholder="Ключ под ковриком..."/></div>
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addSchedule}>Добавить смену</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD KB ITEM */}
        {modal==="kb" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Добавить материал в базу знаний</div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Тип</label>
                  <select className="inp" value={kbForm.type} onChange={e=>setKbForm(p=>({...p,type:e.target.value}))}>
                    <option value="sop">📄 SOP Документ</option><option value="youtube">▶ YouTube Урок</option>
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Основной отдел</label>
                  <select className="inp" value={kbForm.dept} onChange={e=>setKbForm(p=>({...p,dept:e.target.value}))}>
                    {departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Иконка</label><input className="inp" value={kbForm.thumb} onChange={e=>setKbForm(p=>({...p,thumb:e.target.value}))}/></div>
                <div className="form-g"><label className="lbl">Название</label><input className="inp" value={kbForm.title} onChange={e=>setKbForm(p=>({...p,title:e.target.value}))} placeholder="Название материала"/></div>
              </div>
              <div className="form-g">
                <label className="lbl">Видимость (кто видит этот материал)</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                  {[...departments,{id:"clients",name:"Клиенты NLS",icon:"🏢"}].map(d=>{
                    const checked = kbForm.visibleTo.includes(d.id);
                    return (
                      <button key={d.id} onClick={()=>setKbForm(p=>({...p,visibleTo:checked?p.visibleTo.filter(v=>v!==d.id):[...p.visibleTo,d.id]}))}
                        style={{padding:"4px 10px",borderRadius:20,border:"1px solid",borderColor:checked?"var(--acc)":"var(--bdr)",background:checked?"var(--acc)18":"none",color:checked?"var(--acc)":"var(--mu)",fontSize:11,cursor:"pointer"}}>
                        {d.icon} {d.name.replace("Отдел ","")}
                      </button>
                    );
                  })}
                </div>
              </div>
              {kbForm.type==="youtube"
                ? <>
                    <div className="form-g"><label className="lbl">Ссылка YouTube</label><input className="inp" value={kbForm.url} onChange={e=>setKbForm(p=>({...p,url:e.target.value}))} placeholder="https://youtube.com/watch?v=..."/></div>
                    <div className="form-g"><label className="lbl">Описание</label><input className="inp" value={kbForm.desc} onChange={e=>setKbForm(p=>({...p,desc:e.target.value}))}/></div>
                  </>
                : <div className="form-g"><label className="lbl">Содержание SOP</label><textarea className="inp" value={kbForm.content} onChange={e=>setKbForm(p=>({...p,content:e.target.value}))} placeholder="Пропишите шаги..."/></div>
              }
              <div className="modal-act">
                <button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button>
                <button className="btn btn-prim" onClick={addKbItem}>Добавить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
