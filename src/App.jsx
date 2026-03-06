import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const DEPARTMENTS = [
  { id:"sales",      name:"Отдел продаж",          icon:"💼", color:"#f0a500" },
  { id:"ops",        name:"Операционный отдел",     icon:"⚙️",  color:"#3b82f6" },
  { id:"mgmt",       name:"Отдел управления",       icon:"🏢", color:"#a855f7" },
  { id:"finance",    name:"Финансовый отдел",       icon:"💰", color:"#22c55e" },
  { id:"hr",         name:"Отдел найма",            icon:"🎯", color:"#ec4899" },
  { id:"reps",       name:"Отдел представителей",   icon:"🤝", color:"#f97316" },
  { id:"supervision",name:"Отдел супервайзинга",    icon:"👁️", color:"#06b6d4" },
];

const BRANCHES = [
  { id:"austin",     name:"Austin",         isHQ:true },
  { id:"florida",    name:"Florida" },
  { id:"california", name:"California" },
  { id:"washington", name:"Washington" },
  { id:"newyork",    name:"New York" },
  { id:"nc",         name:"North Carolina" },
];

const INIT_EMPLOYEES = [
  { id:1,  name:"Zalina Karimova",   dept:"mgmt",       branch:"austin",   role:"CEO / Основатель", rate:0,  status:"active", avatar:"ZK", email:"zalina@nova.team",   password:"zalina123"   },
  { id:2,  name:"Anna Petrov",       dept:"supervision",branch:"austin",   role:"Supervisor",        rate:22, status:"active", avatar:"AP", email:"anna@nova.team",     password:"anna123"     },
  { id:3,  name:"Maria Gonzalez",    dept:"ops",        branch:"austin",   role:"Cleaner",           rate:18, status:"active", avatar:"MG", email:"maria@nova.team",    password:"maria123"    },
  { id:4,  name:"Sofia Reyes",       dept:"ops",        branch:"florida",  role:"Cleaner",           rate:18, status:"active", avatar:"SR", email:"sofia@nova.team",    password:"sofia123"    },
  { id:5,  name:"Elena Novak",       dept:"sales",      branch:"austin",   role:"Sales Manager",     rate:25, status:"active", avatar:"EN", email:"elena@nova.team",    password:"elena123"    },
  { id:6,  name:"Dmitry Volkov",     dept:"hr",         branch:"austin",   role:"HR Specialist",     rate:20, status:"active", avatar:"DV", email:"dmitry@nova.team",   password:"dmitry123"   },
  { id:7,  name:"Julia Kim",         dept:"finance",    branch:"austin",   role:"Bookkeeper",        rate:30, status:"active", avatar:"JK", email:"julia@nova.team",    password:"julia123"    },
  { id:8,  name:"Carlos Mendez",     dept:"reps",       branch:"florida",  role:"Representative",    rate:19, status:"active", avatar:"CM", email:"carlos@nova.team",   password:"carlos123"   },
];

const INIT_TASKS = [
  { id:1, title:"Позвонить 10 потенциальным клиентам",    assignee:5, dept:"sales",      priority:"high",   status:"in_progress", due:"2025-06-10", createdBy:1 },
  { id:2, title:"Провести интервью с 3 кандидатами",      assignee:6, dept:"hr",         priority:"medium", status:"todo",        due:"2025-06-12", createdBy:1 },
  { id:3, title:"Подготовить отчёт за май",               assignee:7, dept:"finance",    priority:"high",   status:"todo",        due:"2025-06-08", createdBy:1 },
  { id:4, title:"Проверить качество уборки на объекте 14",assignee:2, dept:"supervision",priority:"medium", status:"done",        due:"2025-06-05", createdBy:2 },
  { id:5, title:"Обновить SOP по уборке ванных комнат",   assignee:3, dept:"ops",        priority:"low",    status:"todo",        due:"2025-06-15", createdBy:1 },
  { id:6, title:"Отправить предложение клиенту ABC",      assignee:5, dept:"sales",      priority:"high",   status:"done",        due:"2025-06-04", createdBy:5 },
  { id:7, title:"Закрыть вакансию супервайзера",          assignee:6, dept:"hr",         priority:"high",   status:"in_progress", due:"2025-06-20", createdBy:1 },
  { id:8, title:"Провести встречу с командой Флориды",    assignee:8, dept:"reps",       priority:"medium", status:"todo",        due:"2025-06-18", createdBy:1 },
];

const INIT_CHAT_MSGS = {
  general:    [
    { id:1, author:1, text:"👋 Добро пожаловать в общий чат Natural Cleaning Experts! Здесь обсуждаем общие вопросы компании, встречи и важные новости.", ts:"08:00" },
    { id:2, author:1, text:"📅 Напоминаю: общая встреча команды в эту пятницу в 14:00 по Zoom. Ссылку пришлю в четверг.", ts:"08:05" },
    { id:3, author:5, text:"Поняла, буду! Есть важные новости по продажам 🔥", ts:"09:10" },
    { id:4, author:2, text:"Принято, спасибо за напоминание!", ts:"09:15" },
  ],
  sales:      [{ id:1, author:5, text:"Привет команда! Сегодня закрыли 2 новых клиента 🎉", ts:"10:32" }, { id:2, author:1, text:"Отлично! Так держать!", ts:"10:45" }],
  ops:        [{ id:1, author:3, text:"Объект 14 готов, всё чисто", ts:"09:15" }, { id:2, author:2, text:"Принято, спасибо!", ts:"09:20" }],
  mgmt:       [{ id:1, author:1, text:"Встреча по стратегии в пятницу в 14:00", ts:"08:00" }],
  finance:    [{ id:1, author:7, text:"Отчёт за апрель загружен в систему", ts:"11:00" }],
  hr:         [{ id:1, author:6, text:"Получили 5 новых резюме на вакансию клинера", ts:"13:20" }],
  reps:       [{ id:1, author:8, text:"Флорида — 3 новых объекта на этой неделе!", ts:"14:00" }],
  supervision:[{ id:1, author:2, text:"Все объекты Austin проверены ✅", ts:"16:00" }],
};

const INIT_KB = [
  { id:1, type:"youtube", dept:"ops",   title:"Стандарты уборки ванных комнат",    url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", desc:"Видеоинструкция по стандартам", thumb:"🛁" },
  { id:2, type:"sop",     dept:"ops",   title:"SOP: Уборка кухни",                 content:"1. Обеззараживать поверхности\n2. Чистить плиту\n3. Мыть раковину до блеска\n4. Протирать фасады шкафов\n5. Пол — в последнюю очередь", thumb:"🍳" },
  { id:3, type:"sop",     dept:"hr",    title:"SOP: Онбординг нового клинера",      content:"День 1:\n• Подписать 1099 контракт\n• Заполнить W-9\n• Добавить в Telegram\n\nНеделя 1:\n• Теневая уборка с супервайзером\n• Оценочная уборка\n• Обратная связь", thumb:"📋" },
  { id:4, type:"youtube", dept:"sales", title:"Техники закрытия сделок",           url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", desc:"Мастер-класс по продажам в клининге", thumb:"💼" },
  { id:5, type:"sop",     dept:"sales", title:"SOP: Скрипт первого звонка",        content:"1. Приветствие: 'Natural Cleaning Experts, добрый день!'\n2. Выяснить потребность\n3. Предложить осмотр\n4. Назвать примерную цену\n5. Закрыть на запись", thumb:"📞" },
  { id:6, type:"sop",     dept:"finance","title":"SOP: Выплаты 1099-подрядчикам", content:"• Выплаты каждую пятницу\n• Метод: Zelle (основной), Venmo (альт.)\n• 1099-NEC при $600+/год\n• Срок отправки: 31 января", thumb:"💰" },
];

const PERF_DATA = {
  1: [{ w:"W18",done:5,assigned:6 },{ w:"W19",done:7,assigned:8 },{ w:"W20",done:6,assigned:7 },{ w:"W21",done:8,assigned:9 },{ w:"W22",done:5,assigned:6 }],
  2: [{ w:"W18",done:4,assigned:4 },{ w:"W19",done:5,assigned:6 },{ w:"W20",done:5,assigned:5 },{ w:"W21",done:6,assigned:6 },{ w:"W22",done:4,assigned:5 }],
  5: [{ w:"W18",done:8,assigned:10},{ w:"W19",done:9,assigned:10},{ w:"W20",done:7,assigned:9 },{ w:"W21",done:10,assigned:10},{ w:"W22",done:8,assigned:8}],
  6: [{ w:"W18",done:3,assigned:4 },{ w:"W19",done:4,assigned:5 },{ w:"W20",done:4,assigned:4 },{ w:"W21",done:5,assigned:5 },{ w:"W22",done:3,assigned:4 }],
  7: [{ w:"W18",done:6,assigned:6 },{ w:"W19",done:5,assigned:6 },{ w:"W20",done:6,assigned:6 },{ w:"W21",done:7,assigned:7 },{ w:"W22",done:6,assigned:6 }],
};

/* ─────────────────────────── STYLES ─────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#080b12;--s1:#0f1420;--s2:#161c2a;--s3:#1e2535;
  --bdr:#ffffff0c;--bdr2:#ffffff16;
  --tx:#e8ecf4;--mu:#5a6480;--mu2:#3d4560;
  --acc:#f0a500;--acc2:#e05c2a;
  --gr:#22c55e;--rd:#ef4444;--bl:#3b82f6;--pu:#a855f7;--pk:#ec4899;--or:#f97316;--cy:#06b6d4;
}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;font-size:14px;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
input,select,textarea{font-family:'DM Sans',sans-serif;}

.app{display:flex;height:100vh;overflow:hidden;}

/* LOGIN */
.login{display:flex;align-items:center;justify-content:center;height:100vh;background:var(--bg);flex-direction:column;gap:32px;}
.login-logo{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;letter-spacing:-2px;}
.login-logo span{color:var(--acc);}
.login-sub{color:var(--mu);font-size:15px;margin-top:-20px;}
.login-card{background:var(--s1);border:1px solid var(--bdr);border-radius:16px;padding:32px;width:420px;}
.login-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:20px;}
.login-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.login-opt{background:var(--s2);border:1px solid var(--bdr);border-radius:10px;padding:14px;text-align:left;color:var(--tx);transition:all .15s;}
.login-opt:hover{border-color:var(--acc)50;background:var(--s3);}
.login-opt.admin{border-color:var(--acc)40;background:var(--acc)10;}
.login-opt-name{font-weight:600;font-size:13px;}
.login-opt-role{font-size:11px;color:var(--mu);margin-top:3px;}
.login-opt-dept{font-size:11px;color:var(--acc);margin-top:2px;}

/* SIDEBAR */
.sidebar{width:240px;min-width:240px;background:var(--s1);border-right:1px solid var(--bdr);display:flex;flex-direction:column;overflow:hidden;}
.s-logo{padding:20px 18px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.s-logo-txt{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;}
.s-logo-txt span{color:var(--acc);}
.s-user{display:flex;align-items:center;gap:8px;padding:12px 18px;border-bottom:1px solid var(--bdr);}
.s-nav{flex:1;padding:8px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:1px;}
.s-sec{font-size:10px;color:var(--mu2);text-transform:uppercase;letter-spacing:1px;padding:12px 8px 4px;font-weight:600;}
.nav-btn{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;border:none;background:none;color:var(--mu);font-size:13px;font-weight:500;width:100%;text-align:left;transition:all .15s;}
.nav-btn:hover{background:var(--s2);color:var(--tx);}
.nav-btn.active{color:var(--acc);background:var(--acc)12;}
.nav-btn .ni{width:16px;text-align:center;font-size:14px;}
.nav-btn .badge{margin-left:auto;background:var(--acc);color:#000;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;}
.s-foot{padding:12px 18px;border-top:1px solid var(--bdr);font-size:11px;color:var(--mu);}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{padding:14px 24px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--s1);flex-shrink:0;}
.page-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;}
.page-sub{font-size:12px;color:var(--mu);margin-top:1px;}
.content{flex:1;overflow-y:auto;padding:24px;}

/* BUTTONS */
.btn{padding:7px 14px;border-radius:8px;border:none;font-size:13px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px;}
.btn-prim{background:var(--acc);color:#000;}
.btn-prim:hover{background:#fbbf24;}
.btn-ghost{background:var(--s2);color:var(--tx);border:1px solid var(--bdr);}
.btn-ghost:hover{background:var(--s3);}
.btn-sm{padding:4px 10px;font-size:11px;}
.btn-danger{background:#ef444418;color:var(--rd);border:1px solid #ef444428;}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;}
.card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;}

/* STATS */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:16px 18px;}
.stat-lbl{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;}
.stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;margin-top:4px;}
.stat-sub{font-size:11px;margin-top:3px;}

/* TABLE */
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:8px 12px;color:var(--mu);font-size:11px;text-transform:uppercase;letter-spacing:.5px;font-weight:500;border-bottom:1px solid var(--bdr);}
td{padding:11px 12px;border-bottom:1px solid var(--bdr);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:var(--s2);}

/* BADGES */
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;}
.b-gr{background:#22c55e18;color:var(--gr);}
.b-rd{background:#ef444418;color:var(--rd);}
.b-yw{background:#f0a50018;color:var(--acc);}
.b-bl{background:#3b82f618;color:var(--bl);}
.b-pu{background:#a855f718;color:var(--pu);}
.b-mu{background:#ffffff10;color:var(--mu);}

/* AVATAR */
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.av-lg{width:40px;height:40px;font-size:14px;}
.flex-c{display:flex;align-items:center;gap:10px;}

/* MODAL */
.ovl{position:fixed;inset:0;background:#00000088;display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
.modal{background:var(--s1);border:1px solid var(--bdr2);border-radius:16px;padding:26px;width:500px;max-width:95vw;max-height:90vh;overflow-y:auto;}
.modal-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:18px;}
.form-g{margin-bottom:14px;}
.lbl{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:block;}
.inp{width:100%;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:9px 11px;color:var(--tx);font-size:13px;outline:none;transition:border-color .15s;}
.inp:focus{border-color:var(--acc);}
select.inp option{background:var(--s2);}
textarea.inp{resize:vertical;min-height:80px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.modal-act{display:flex;gap:8px;justify-content:flex-end;margin-top:20px;}

/* DEPT PAGE */
.dept-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:24px;}
.dept-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;cursor:pointer;transition:all .15s;}
.dept-card:hover{transform:translateY(-2px);border-color:var(--bdr2);}
.dept-card.selected{border-color:var(--acc)60;background:var(--acc)08;}
.dept-icon{font-size:26px;margin-bottom:10px;}
.dept-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;margin-bottom:4px;}
.dept-count{font-size:12px;color:var(--mu);}
.dept-bar{height:3px;border-radius:2px;margin-top:12px;opacity:.6;}

/* TASKS */
.task-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.task-col{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:14px;}
.task-col-hd{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.task-item{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:12px;margin-bottom:8px;transition:all .15s;}
.task-item:hover{border-color:var(--bdr2);}
.task-title{font-size:13px;font-weight:500;margin-bottom:8px;line-height:1.4;}
.task-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.prio-high{color:var(--rd);}
.prio-medium{color:var(--acc);}
.prio-low{color:var(--gr);}

/* PERFORMANCE */
.perf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:16px;}
.perf-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;}
.perf-score{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;}
.perf-label{font-size:12px;color:var(--mu);margin-top:2px;}

/* CHAT */
.chat-layout{display:flex;height:100%;gap:0;}
.chat-sidebar{width:200px;min-width:200px;border-right:1px solid var(--bdr);padding:12px 10px;overflow-y:auto;}
.chat-ch{padding:7px 10px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--mu);display:flex;align-items:center;gap:8px;transition:all .15s;}
.chat-ch:hover{background:var(--s2);color:var(--tx);}
.chat-ch.active{background:var(--acc)15;color:var(--acc);}
.chat-main{flex:1;display:flex;flex-direction:column;}
.chat-hd{padding:14px 18px;border-bottom:1px solid var(--bdr);font-weight:600;font-size:14px;}
.chat-msgs{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:10px;}
.chat-msg{display:flex;gap:10px;}
.chat-bubble{background:var(--s2);border-radius:10px;padding:10px 13px;max-width:70%;}
.chat-author{font-size:11px;font-weight:600;margin-bottom:4px;}
.chat-text{font-size:13px;line-height:1.5;color:#c8d0e0;}
.chat-ts{font-size:10px;color:var(--mu);margin-top:4px;}
.chat-input-area{padding:12px 16px;border-top:1px solid var(--bdr);display:flex;gap:10px;}
.chat-input{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:10px;padding:10px 14px;color:var(--tx);font-size:13px;outline:none;}
.chat-input:focus{border-color:var(--acc);}
.chat-locked{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;color:var(--mu);gap:8px;}

/* KB */
.kb-tabs{display:flex;gap:4px;margin-bottom:18px;background:var(--s1);border:1px solid var(--bdr);border-radius:10px;padding:4px;width:fit-content;}
.kb-tab{padding:6px 14px;border-radius:7px;border:none;background:none;color:var(--mu);font-size:13px;font-weight:500;transition:all .15s;}
.kb-tab.active{background:var(--acc);color:#000;}
.kb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
.kb-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;cursor:pointer;transition:all .15s;}
.kb-card:hover{border-color:var(--bdr2);transform:translateY(-1px);}
.kb-type{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;}
.kb-yt{background:var(--rd)18;border-color:#ef444425!important;}
.kb-sop{background:var(--bl)08;}
.kb-full{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:24px;white-space:pre-line;line-height:1.9;font-size:14px;color:#c0cadf;}
.kb-back{display:flex;align-items:center;gap:6px;color:var(--mu);cursor:pointer;font-size:13px;margin-bottom:16px;}
.kb-back:hover{color:var(--tx);}

/* BRANCHES */
.branch-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-bottom:24px;}
.branch-card{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;padding:18px;cursor:pointer;transition:all .15s;}
.branch-card:hover{transform:translateY(-2px);border-color:var(--bdr2);}
.branch-card.active{border-color:var(--acc)60;}
.branch-hq{background:var(--acc)10;border-color:var(--acc)30!important;}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--bdr2);border-radius:3px;}

/* TOOLTIP CUSTOM */
.recharts-tooltip-wrapper .recharts-default-tooltip{background:var(--s2)!important;border:1px solid var(--bdr)!important;border-radius:8px!important;}
`;

/* ─────────────────────────── HELPERS ─────────────────────────── */
const deptOf = id => DEPARTMENTS.find(d => d.id === id);
const empOf  = (emps, id) => emps.find(e => e.id === id);
const COLORS_AV = ["#f0a500","#e05c2a","#22c55e","#3b82f6","#a855f7","#ec4899","#06b6d4","#f97316"];
const avColor = name => COLORS_AV[name.charCodeAt(0) % COLORS_AV.length];

function Av({ name, size="", color }) {
  const c = color || avColor(name);
  return <div className={`av ${size}`} style={{background:c+"28",color:c}}>{name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>;
}

function Badge({ children, color }) {
  const map = { green:"b-gr", red:"b-rd", yellow:"b-yw", blue:"b-bl", purple:"b-pu", muted:"b-mu" };
  return <span className={`badge ${map[color]||"b-mu"}`}>{children}</span>;
}

const PRIO_COLORS = { high:"b-rd", medium:"b-yw", low:"b-gr" };
const STATUS_LABELS = { todo:"К выполнению", in_progress:"В работе", done:"Готово" };
const STATUS_COLORS = { todo:"muted", in_progress:"yellow", done:"green" };


/* ─────────────────────────── LOGIN SCREEN ─────────────────────────── */
function LoginScreen({ employees, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!email.trim() || !password.trim()) { setError("Введите email и пароль"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = employees.find(e => e.email === email.trim().toLowerCase() && e.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Неверный email или пароль");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",flexDirection:"column",gap:0}}>
      {/* Background glow */}
      <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:400,background:"var(--acc)",opacity:.04,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none"}} />

      <div style={{textAlign:"center",marginBottom:32,position:"relative"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:44,fontWeight:800,letterSpacing:-2,lineHeight:1}}>
          NOVA<span style={{color:"var(--acc)"}}>.</span>TEAM
        </div>
        <div style={{color:"var(--mu)",fontSize:14,marginTop:8}}>Платформа управления командой</div>
      </div>

      <div style={{background:"var(--s1)",border:"1px solid var(--bdr2)",borderRadius:18,padding:"32px 36px",width:400,position:"relative"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:6}}>Добро пожаловать</div>
        <div style={{fontSize:13,color:"var(--mu)",marginBottom:24}}>Войдите в свой аккаунт</div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:6}}>Email</label>
          <input
            style={{width:"100%",background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:"11px 14px",color:"var(--tx)",fontSize:14,outline:"none",transition:"border-color .15s"}}
            placeholder="your@nova.team"
            value={email}
            onChange={e=>{ setEmail(e.target.value); setError(""); }}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            onFocus={e=>e.target.style.borderColor="var(--acc)"}
            onBlur={e=>e.target.style.borderColor="var(--bdr)"}
          />
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,color:"var(--mu)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:6}}>Пароль</label>
          <div style={{position:"relative"}}>
            <input
              style={{width:"100%",background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:10,padding:"11px 44px 11px 14px",color:"var(--tx)",fontSize:14,outline:"none",transition:"border-color .15s"}}
              type={showPw?"text":"password"}
              placeholder="••••••••"
              value={password}
              onChange={e=>{ setPassword(e.target.value); setError(""); }}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              onFocus={e=>e.target.style.borderColor="var(--acc)"}
              onBlur={e=>e.target.style.borderColor="var(--bdr)"}
            />
            <button onClick={()=>setShowPw(p=>!p)}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--mu)",fontSize:16,cursor:"pointer",padding:2}}>
              {showPw?"🙈":"👁"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{background:"#ef444418",border:"1px solid #ef444430",borderRadius:8,padding:"10px 14px",fontSize:13,color:"var(--rd)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{width:"100%",background:loading?"var(--s3)":"var(--acc)",color:loading?"var(--mu)":"#000",border:"none",borderRadius:10,padding:"12px",fontSize:15,fontWeight:600,fontFamily:"'Syne',sans-serif",cursor:loading?"not-allowed":"pointer",transition:"all .2s",letterSpacing:.3}}>
          {loading ? "Проверяем..." : "Войти →"}
        </button>

        <div style={{marginTop:20,padding:"14px",background:"var(--s2)",borderRadius:10,border:"1px solid var(--bdr)"}}>
          <div style={{fontSize:11,color:"var(--mu)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Тестовые аккаунты</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {employees.slice(0,4).map(e=>(
              <button key={e.id} onClick={()=>{ setEmail(e.email); setPassword(e.password); setError(""); }}
                style={{background:"none",border:"1px solid var(--bdr)",borderRadius:6,padding:"5px 8px",color:"var(--mu)",fontSize:11,cursor:"pointer",textAlign:"left",transition:"all .15s"}}
                onMouseOver={e2=>e2.target.style.color="var(--tx)"}
                onMouseOut={e2=>e2.target.style.color="var(--mu)"}
              >
                {e.name.split(" ")[0]} · {e.email.split("@")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:20,fontSize:12,color:"var(--mu2)"}}>
        Natural Cleaning Experts © 2025
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */
export default function NovaTeam() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage]               = useState("dashboard");
  const [employees, setEmployees]     = useState(INIT_EMPLOYEES);
  const [tasks, setTasks]             = useState(INIT_TASKS);
  const [chatMsgs, setChatMsgs]       = useState(INIT_CHAT_MSGS);
  const [kb, setKb]                   = useState(INIT_KB);
  const [chatChannel, setChatChannel] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [kbView, setKbView]           = useState(null);
  const [kbFilter, setKbFilter]       = useState("all");

  // Modals
  const [modal, setModal] = useState(null);
  const [empForm, setEmpForm] = useState({ name:"", dept:"ops", branch:"austin", role:"", rate:"18", status:"active" });
  const [taskForm, setTaskForm] = useState({ title:"", assignee:"", dept:"ops", priority:"medium", due:"", status:"todo" });
  const [kbForm, setKbForm]   = useState({ type:"sop", dept:"ops", title:"", url:"", content:"", desc:"", thumb:"📄" });
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const isAdmin = currentUser?.dept === "mgmt" && currentUser?.id === 1;

  const visibleDepts = isAdmin ? DEPARTMENTS : DEPARTMENTS.filter(d => d.id === currentUser?.dept);
  const visibleEmps  = isAdmin ? employees : employees.filter(e => e.dept === currentUser?.dept);
  const visibleTasks = isAdmin ? tasks : tasks.filter(t => t.dept === currentUser?.dept || t.assignee === currentUser?.id);
  const chatDepts    = isAdmin ? DEPARTMENTS : DEPARTMENTS.filter(d => d.id === currentUser?.dept);
  const canAccessChannel = (ch) => ch === "general" || isAdmin || ch === currentUser?.dept;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMsgs, chatChannel]);

  /* LOGIN SCREEN */
  if (!currentUser) {
    return (
      <>
        <style>{S}</style>
        <LoginScreen employees={employees} onLogin={(user) => { setCurrentUser(user); setChatChannel("general"); }} />
      </>
    );
  }

  /* UTILS */
  function addEmployee() {
    if (!empForm.name.trim()) return;
    const newEmp = { ...empForm, id: Date.now(), rate: Number(empForm.rate) };
    setEmployees(p => [...p, newEmp]);
    setEmpForm({ name:"", dept:"ops", branch:"austin", role:"", rate:"18", status:"active" });
    setModal(null);
  }

  function addTask() {
    if (!taskForm.title.trim()) return;
    setTasks(p => [...p, { ...taskForm, id:Date.now(), assignee:Number(taskForm.assignee), createdBy:currentUser.id }]);
    setTaskForm({ title:"", assignee:"", dept:currentUser.dept, priority:"medium", due:"", status:"todo" });
    setModal(null);
  }

  function updateTaskStatus(id, status) { setTasks(p => p.map(t => t.id===id ? {...t,status} : t)); }

  function sendChat() {
    if (!chatInput.trim() || !chatChannel) return;
    setChatMsgs(p => ({
      ...p,
      [chatChannel]: [...(p[chatChannel]||[]), { id:Date.now(), author:currentUser.id, text:chatInput.trim(), ts:new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'}) }]
    }));
    setChatInput("");
  }

  function addKbItem() {
    if (!kbForm.title.trim()) return;
    setKb(p => [...p, { ...kbForm, id:Date.now() }]);
    setKbForm({ type:"sop", dept:"ops", title:"", url:"", content:"", desc:"", thumb:"📄" });
    setModal(null);
  }

  function removeEmp(id) { setEmployees(p => p.filter(e => e.id !== id)); }

  /* PAGES */

  // ── DASHBOARD ──
  const Dashboard = () => {
    const myTasks = visibleTasks.filter(t => t.assignee === currentUser.id);
    const totalDone = tasks.filter(t=>t.status==="done").length;
    const activeBranch = [...new Set(employees.map(e=>e.branch))].length;
    return (
      <>
        <div className="stats-row" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
          {[
            { lbl:"Сотрудников", val:visibleEmps.length, sub:"В твоих отделах", color:"var(--acc)" },
            { lbl:"Задач всего",  val:visibleTasks.length, sub:`${visibleTasks.filter(t=>t.status==="done").length} выполнено`, color:"var(--gr)" },
            { lbl:"В работе",     val:visibleTasks.filter(t=>t.status==="in_progress").length, sub:"Активных задач", color:"var(--bl)" },
            isAdmin
              ? { lbl:"Подразделения", val:activeBranch, sub:"Из 6 городов", color:"var(--pu)" }
              : { lbl:"Мои задачи",    val:myTasks.length, sub:`${myTasks.filter(t=>t.status==="done").length} сделано`, color:"var(--cy)" },
          ].map((s,i) => (
            <div className="stat" key={i}>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="stat-sub" style={{color:"var(--mu)"}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Recent tasks */}
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
                  <Badge color={STATUS_COLORS[t.status]}>{STATUS_LABELS[t.status]}</Badge>
                </div>
              );
            })}
          </div>

          {/* Team by dept */}
          <div className="card">
            <div className="card-hd"><div className="card-title">Отделы</div></div>
            {visibleDepts.map(d => {
              const count = employees.filter(e=>e.dept===d.id).length;
              return (
                <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--bdr)"}}>
                  <span style={{fontSize:18,width:24,textAlign:"center"}}>{d.icon}</span>
                  <span style={{flex:1,fontSize:13,fontWeight:500}}>{d.name}</span>
                  <span style={{fontSize:13,fontWeight:600,color:d.color}}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // ── DEPARTMENTS ──
  const Departments = () => {
    const [view, setView] = useState("departments"); // departments | members
    const [activeDept, setActiveDept] = useState(null);

    const deptMembers = activeDept ? employees.filter(e=>e.dept===activeDept) : [];

    if (view === "members" && activeDept) {
      const d = deptOf(activeDept);
      return (
        <>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setView("departments")}>← Отделы</button>
            <span style={{fontSize:18}}>{d?.icon}</span>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18}}>{d?.name}</span>
            <Badge color="muted">{deptMembers.length} сотрудников</Badge>
          </div>
          {isAdmin && <div style={{marginBottom:16}}><button className="btn btn-prim" onClick={()=>{ setEmpForm(p=>({...p,dept:activeDept})); setModal("emp"); }}>+ Добавить</button></div>}
          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Сотрудник</th><th>Роль</th><th>Подразделение</th><th>Ставка/ч</th><th>Статус</th>{isAdmin&&<th></th>}</tr></thead>
                <tbody>
                  {deptMembers.map(m=>(
                    <tr key={m.id}>
                      <td><div className="flex-c"><Av name={m.name} color={d?.color} /><div><div style={{fontWeight:500}}>{m.name}</div></div></div></td>
                      <td style={{color:"var(--mu)"}}>{m.role}</td>
                      <td>{BRANCHES.find(b=>b.id===m.branch)?.name}</td>
                      <td style={{fontFamily:"'Syne',sans-serif",fontWeight:600}}>{m.rate?`$${m.rate}/h`:"—"}</td>
                      <td><Badge color={m.status==="active"?"green":"red"}>{m.status==="active"?"Активен":"Неактив."}</Badge></td>
                      {isAdmin&&<td><button className="btn btn-danger btn-sm" onClick={()=>removeEmp(m.id)}>×</button></td>}
                    </tr>
                  ))}
                  {deptMembers.length===0&&<tr><td colSpan={6} style={{textAlign:"center",color:"var(--mu)",padding:24}}>Нет сотрудников в этом отделе</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {isAdmin && <div style={{marginBottom:16}}><button className="btn btn-prim" onClick={()=>setModal("emp")}>+ Добавить сотрудника</button></div>}
        <div className="dept-grid">
          {visibleDepts.map(d => {
            const cnt = employees.filter(e=>e.dept===d.id).length;
            return (
              <div key={d.id} className="dept-card" onClick={()=>{ setActiveDept(d.id); setView("members"); }}>
                <div className="dept-icon">{d.icon}</div>
                <div className="dept-name">{d.name}</div>
                <div className="dept-count">{cnt} {cnt===1?"сотрудник":"сотрудников"}</div>
                <div className="dept-bar" style={{background:d.color}} />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // ── BRANCHES ──
  const Branches = () => {
    const [activeBr, setActiveBr] = useState(null);
    const brMembers = activeBr ? employees.filter(e=>e.branch===activeBr) : [];
    const br = BRANCHES.find(b=>b.id===activeBr);

    return (
      <>
        <div className="branch-grid">
          {BRANCHES.map(b => {
            const cnt = employees.filter(e=>e.branch===b.id).length;
            return (
              <div key={b.id} className={`branch-card ${b.isHQ?"branch-hq":""} ${activeBr===b.id?"active":""}`} onClick={()=>setActiveBr(b.id===activeBr?null:b.id)}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:22}}>{b.isHQ?"🏢":"🏙️"}</span>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>{b.name}</div>
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
              <div className="card-title">{br?.name} {br?.isHQ?"🏢":""}</div>
              {isAdmin&&<button className="btn btn-prim btn-sm" onClick={()=>{ setEmpForm(p=>({...p,branch:activeBr})); setModal("emp"); }}>+ Добавить</button>}
            </div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Сотрудник</th><th>Отдел</th><th>Роль</th><th>Статус</th></tr></thead>
                <tbody>
                  {brMembers.map(m=>{
                    const d=deptOf(m.dept);
                    return (
                      <tr key={m.id}>
                        <td><div className="flex-c"><Av name={m.name} /><span style={{fontWeight:500}}>{m.name}</span></div></td>
                        <td><span style={{color:d?.color}}>{d?.icon} {d?.name}</span></td>
                        <td style={{color:"var(--mu)"}}>{m.role}</td>
                        <td><Badge color={m.status==="active"?"green":"red"}>{m.status==="active"?"Активен":"Неактив."}</Badge></td>
                      </tr>
                    );
                  })}
                  {brMembers.length===0&&<tr><td colSpan={4} style={{textAlign:"center",color:"var(--mu)",padding:24}}>Нет сотрудников</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  };

  // ── TASKS ──
  const Tasks = () => {
    const cols = ["todo","in_progress","done"];
    const colNames = { todo:"📋 К выполнению", in_progress:"⚡ В работе", done:"✅ Готово" };
    const colColors = { todo:"var(--mu)", in_progress:"var(--acc)", done:"var(--gr)" };

    return (
      <>
        <div style={{marginBottom:16,display:"flex",gap:8}}>
          <button className="btn btn-prim" onClick={()=>{ setTaskForm(p=>({...p,dept:currentUser.dept,assignee:String(currentUser.id)})); setModal("task"); }}>+ Создать задачу</button>
        </div>
        <div className="task-cols">
          {cols.map(col => {
            const colTasks = visibleTasks.filter(t=>t.status===col);
            return (
              <div key={col} className="task-col">
                <div className="task-col-hd" style={{color:colColors[col]}}>
                  {colNames[col]}
                  <span style={{marginLeft:"auto",background:"var(--s3)",color:"var(--mu)",fontSize:11,padding:"2px 8px",borderRadius:12}}>{colTasks.length}</span>
                </div>
                {colTasks.map(t => {
                  const emp = empOf(employees, t.assignee);
                  const d = deptOf(t.dept);
                  return (
                    <div key={t.id} className="task-item">
                      <div className="task-title">{t.title}</div>
                      <div className="task-meta">
                        {emp && <div className="flex-c" style={{gap:5}}><Av name={emp.name} style={{width:20,height:20,fontSize:9}} /><span style={{fontSize:11,color:"var(--mu)"}}>{emp.name.split(' ')[0]}</span></div>}
                        <Badge color={PRIO_COLORS[t.priority]||"muted"}>{t.priority}</Badge>
                        {t.due && <span style={{fontSize:10,color:"var(--mu)"}}>📅 {t.due}</span>}
                      </div>
                      <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                        {col!=="todo"       && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"todo")}>← Назад</button>}
                        {col!=="in_progress"&& col!=="done" && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"in_progress")}>В работу →</button>}
                        {col!=="done"       && <button className="btn btn-ghost btn-sm" onClick={()=>updateTaskStatus(t.id,"done")}>✓ Готово</button>}
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

  // ── PERFORMANCE ──
  const Performance = () => {
    return (
      <>
        <div style={{marginBottom:6,fontSize:13,color:"var(--mu)"}}>Эффективность сотрудников — выполнение задач по неделям</div>
        <div className="perf-grid" style={{marginTop:16}}>
          {visibleEmps.filter(e=>PERF_DATA[e.id]).map(emp => {
            const data = PERF_DATA[emp.id] || [];
            const total = data.reduce((s,d)=>s+d.assigned,0);
            const done  = data.reduce((s,d)=>s+d.done,0);
            const pct   = total ? Math.round(done/total*100) : 0;
            const d = deptOf(emp.dept);
            return (
              <div key={emp.id} className="perf-card">
                <div className="flex-c" style={{marginBottom:14}}>
                  <Av name={emp.name} size="av-lg" color={d?.color} />
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{emp.name}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{d?.icon} {d?.name}</div>
                  </div>
                  <div style={{marginLeft:"auto",textAlign:"right"}}>
                    <div className="perf-score" style={{color:pct>=80?"var(--gr)":pct>=60?"var(--acc)":"var(--rd)"}}>{pct}%</div>
                    <div className="perf-label">эффективность</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={data} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="w" tick={{fill:"#5a6480",fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:8,color:"var(--tx)",fontSize:12}} />
                    <Bar dataKey="assigned" fill="#ffffff12" radius={[3,3,0,0]} name="Назначено" />
                    <Bar dataKey="done"     fill={d?.color||"var(--acc)"} radius={[3,3,0,0]} name="Выполнено" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{display:"flex",gap:12,marginTop:8,fontSize:11}}>
                  <span style={{color:"var(--mu)"}}>Назначено: <b style={{color:"var(--tx)"}}>{total}</b></span>
                  <span style={{color:"var(--mu)"}}>Выполнено: <b style={{color:d?.color||"var(--acc)"}}>{done}</b></span>
                </div>
              </div>
            );
          })}
          {visibleEmps.filter(e=>!PERF_DATA[e.id]).map(emp => {
            const d=deptOf(emp.dept);
            return (
              <div key={emp.id} className="perf-card">
                <div className="flex-c" style={{marginBottom:14}}>
                  <Av name={emp.name} size="av-lg" color={d?.color} />
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{emp.name}</div>
                    <div style={{fontSize:11,color:"var(--mu)"}}>{d?.icon} {d?.name}</div>
                  </div>
                  <div style={{marginLeft:"auto",textAlign:"right"}}>
                    <div className="perf-score" style={{color:"var(--mu)"}}>—</div>
                    <div className="perf-label">нет данных</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--mu)",textAlign:"center",padding:"20px 0"}}>Данные появятся после выполнения задач</div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // ── CHAT ──
  const Chat = () => {
    const msgs = chatMsgs[chatChannel] || [];
    const canAccess = canAccessChannel(chatChannel);
    const chName = chatChannel==="general" ? "Общий чат" : deptOf(chatChannel)?.name;

    return (
      <div className="chat-layout" style={{height:"calc(100vh - 110px)"}}>
        <div className="chat-sidebar">
          <div style={{fontSize:11,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:1,padding:"4px 2px 6px",fontWeight:600}}>Общие</div>
          <div className={`chat-ch ${chatChannel==="general"?"active":""}`} onClick={()=>setChatChannel("general")}
            style={{marginBottom:8,paddingBottom:10,borderBottom:"1px solid var(--bdr)"}}>
            <span>📢</span>
            <span style={{fontSize:12,fontWeight:600}}>Общий</span>
          </div>
          <div style={{fontSize:11,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:1,padding:"4px 2px 6px",fontWeight:600}}>Отделы</div>
          {chatDepts.map(d => (
            <div key={d.id} className={`chat-ch ${chatChannel===d.id?"active":""}`} onClick={()=>setChatChannel(d.id)}>
              <span>{d.icon}</span>
              <span style={{fontSize:12}}>{d.name.replace("Отдел ","").replace("Операционный","Ops").replace("Финансовый","Finance")}</span>
            </div>
          ))}
        </div>

        <div className="chat-main">
          {chatChannel && (
            <div className="chat-hd">
              {chatChannel==="general"
                ? <span>📢 Общий чат <span style={{fontSize:11,color:"var(--mu)",fontWeight:400,marginLeft:6}}>— виден всем сотрудникам</span></span>
                : <span>{deptOf(chatChannel)?.icon} {deptOf(chatChannel)?.name}</span>}
              {!canAccess && <span style={{fontSize:12,color:"var(--rd)",marginLeft:8}}>🔒 Доступ ограничен</span>}
            </div>
          )}

          {canAccess ? (
            <>
              <div className="chat-msgs">
                {msgs.map(m => {
                  const emp = empOf(employees, m.author);
                  if (!emp) return null;
                  const isMe = m.author === currentUser.id;
                  const d=deptOf(emp.dept);
                  return (
                    <div key={m.id} className="chat-msg" style={{flexDirection:isMe?"row-reverse":"row"}}>
                      <Av name={emp.name} color={d?.color} />
                      <div className="chat-bubble" style={{background:isMe?"var(--acc)15":undefined}}>
                        <div className="chat-author" style={{color:d?.color||"var(--acc)"}}>{emp.name.split(' ')[0]}</div>
                        <div className="chat-text">{m.text}</div>
                        <div className="chat-ts">{m.ts}</div>
                      </div>
                    </div>
                  );
                })}
                {msgs.length===0 && <div style={{textAlign:"center",color:"var(--mu)",padding:40,fontSize:13}}>Начните общение в этом канале...</div>}
                <div ref={chatEndRef} />
              </div>
              <div className="chat-input-area">
                <input className="chat-input" placeholder={`Написать в ${chName}...`}
                  value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendChat(); } }} />
                <button className="btn btn-prim" onClick={sendChat}>→</button>
              </div>
            </>
          ) : (
            <div className="chat-locked">
              <span style={{fontSize:36}}>🔒</span>
              <span style={{fontSize:14,fontWeight:600}}>Доступ закрыт</span>
              <span style={{fontSize:12}}>Этот канал принадлежит другому отделу</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── KNOWLEDGE BASE ──
  const KnowledgeBase = () => {
    const filtered = kbFilter==="all" ? kb : kb.filter(a=>a.type===kbFilter);
    const visible = isAdmin ? filtered : filtered.filter(a=>a.dept===currentUser.dept||a.dept==="all");

    if (kbView) {
      const a = kb.find(k=>k.id===kbView);
      if (!a) { setKbView(null); return null; }
      return (
        <>
          <div className="kb-back" onClick={()=>setKbView(null)}>← Назад к базе знаний</div>
          <div style={{maxWidth:700}}>
            <div style={{fontSize:32,marginBottom:8}}>{a.thumb}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,marginBottom:4}}>{a.title}</div>
            <div style={{fontSize:12,color:"var(--mu)",marginBottom:20}}>
              <Badge color="blue">{a.type==="youtube"?"YouTube":"SOP Документ"}</Badge>
              <span style={{marginLeft:8}}>{deptOf(a.dept)?.name}</span>
            </div>
            {a.type==="youtube" ? (
              <div>
                <div style={{background:"var(--s2)",border:"1px solid var(--bdr)",borderRadius:12,padding:24,textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:40,marginBottom:8}}>▶️</div>
                  <div style={{fontSize:14,marginBottom:12}}>{a.desc}</div>
                  <a href={a.url} target="_blank" rel="noreferrer" className="btn btn-prim" style={{textDecoration:"none"}}>Открыть на YouTube</a>
                </div>
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:10}}>
          <div className="kb-tabs">
            {[["all","Все"],["sop","SOP Документы"],["youtube","YouTube Уроки"]].map(([val,lbl])=>(
              <button key={val} className={`kb-tab ${kbFilter===val?"active":""}`} onClick={()=>setKbFilter(val)}>{lbl}</button>
            ))}
          </div>
          {isAdmin && <button className="btn btn-prim" onClick={()=>setModal("kb")}>+ Добавить материал</button>}
        </div>
        <div className="kb-grid">
          {visible.map(a => (
            <div key={a.id} className={`kb-card ${a.type==="youtube"?"kb-yt":"kb-sop"}`} onClick={()=>setKbView(a.id)}>
              <div style={{fontSize:28,marginBottom:10}}>{a.thumb}</div>
              <div className="kb-type">{a.type==="youtube"?"▶ YouTube":"📄 SOP"}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:600,marginBottom:6}}>{a.title}</div>
              <div style={{fontSize:12,color:"var(--mu)"}}>{a.desc || a.content?.slice(0,60)+"..."}</div>
              <div style={{marginTop:12,fontSize:11,color:"var(--mu)"}}>
                <Badge color="blue">{deptOf(a.dept)?.name}</Badge>
              </div>
            </div>
          ))}
          {visible.length===0 && (
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:48,color:"var(--mu)"}}>
              <div style={{fontSize:32,marginBottom:8}}>📭</div>
              <div>Нет материалов в этой категории</div>
            </div>
          )}
        </div>
      </>
    );
  };

  const PAGE_COMPONENTS = { dashboard:<Dashboard/>, departments:<Departments/>, branches:<Branches/>, tasks:<Tasks/>, performance:<Performance/>, chat:<Chat/>, kb:<KnowledgeBase/> };
  const PAGE_TITLES = { dashboard:"Дашборд", departments:"Отделы", branches:"Подразделения", tasks:"Задачи", performance:"Эффективность", chat:"Чат", kb:"База знаний" };
  const PAGE_ICONS  = { dashboard:"🏠", departments:"🏢", branches:"📍", tasks:"✅", performance:"📊", chat:"💬", kb:"📚" };

  const pendingTasks = visibleTasks.filter(t=>t.status!=="done").length;

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
            <Av name={currentUser.name} color={deptOf(currentUser.dept)?.color} />
            <div>
              <div style={{fontSize:13,fontWeight:600}}>{currentUser.name.split(' ')[0]}</div>
              <div style={{fontSize:10,color:"var(--mu)"}}>{currentUser.role}</div>
            </div>
          </div>
          <nav className="s-nav">
            <div className="s-sec">Главное</div>
            {["dashboard","departments","branches"].map(p=>(
              <button key={p} className={`nav-btn ${page===p?"active":""}`} onClick={()=>setPage(p)}>
                <span className="ni">{PAGE_ICONS[p]}</span>{PAGE_TITLES[p]}
              </button>
            ))}
            <div className="s-sec">Работа</div>
            <button className={`nav-btn ${page==="tasks"?"active":""}`} onClick={()=>setPage("tasks")}>
              <span className="ni">✅</span>Задачи{pendingTasks>0&&<span className="badge">{pendingTasks}</span>}
            </button>
            {["performance","chat","kb"].map(p=>(
              <button key={p} className={`nav-btn ${page===p?"active":""}`} onClick={()=>setPage(p)}>
                <span className="ni">{PAGE_ICONS[p]}</span>{PAGE_TITLES[p]}
              </button>
            ))}
          </nav>
          <div className="s-foot">
            {isAdmin && "👑 Администратор"}<br/>
            Natural Cleaning Experts
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          {page !== "chat" && (
            <div className="topbar">
              <div>
                <div className="page-title">{PAGE_ICONS[page]} {PAGE_TITLES[page]}</div>
                <div className="page-sub">
                  {page==="chat" ? "Внутренние каналы" : `${isAdmin?"Все отделы":deptOf(currentUser.dept)?.name}`}
                </div>
              </div>
            </div>
          )}
          <div className="content" style={page==="chat"?{padding:0,overflow:"hidden"}:{}}>
            {PAGE_COMPONENTS[page]}
          </div>
        </div>

        {/* MODALS */}

        {/* ADD EMPLOYEE */}
        {modal==="emp" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новый сотрудник</div>
              <div className="form-g"><label className="lbl">Полное имя</label><input className="inp" value={empForm.name} onChange={e=>setEmpForm(p=>({...p,name:e.target.value}))} placeholder="Anna Smith" /></div>
              <div className="form-g"><label className="lbl">Должность</label><input className="inp" value={empForm.role} onChange={e=>setEmpForm(p=>({...p,role:e.target.value}))} placeholder="Sales Manager" /></div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Отдел</label>
                  <select className="inp" value={empForm.dept} onChange={e=>setEmpForm(p=>({...p,dept:e.target.value}))}>
                    {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Подразделение</label>
                  <select className="inp" value={empForm.branch} onChange={e=>setEmpForm(p=>({...p,branch:e.target.value}))}>
                    {BRANCHES.map(b=><option key={b.id} value={b.id}>{b.name}{b.isHQ?" (HQ)":""}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Ставка $/час</label><input className="inp" type="number" value={empForm.rate} onChange={e=>setEmpForm(p=>({...p,rate:e.target.value}))} /></div>
                <div className="form-g">
                  <label className="lbl">Статус</label>
                  <select className="inp" value={empForm.status} onChange={e=>setEmpForm(p=>({...p,status:e.target.value}))}>
                    <option value="active">Активен</option><option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>
              <div className="modal-act"><button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button><button className="btn btn-prim" onClick={addEmployee}>Добавить</button></div>
            </div>
          </div>
        )}

        {/* ADD TASK */}
        {modal==="task" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Новая задача</div>
              <div className="form-g"><label className="lbl">Название задачи</label><input className="inp" value={taskForm.title} onChange={e=>setTaskForm(p=>({...p,title:e.target.value}))} placeholder="Описание задачи..." /></div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Исполнитель</label>
                  <select className="inp" value={taskForm.assignee} onChange={e=>setTaskForm(p=>({...p,assignee:e.target.value}))}>
                    <option value="">Выберите...</option>
                    {visibleEmps.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Отдел</label>
                  <select className="inp" value={taskForm.dept} onChange={e=>setTaskForm(p=>({...p,dept:e.target.value}))}>
                    {visibleDepts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
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
                <div className="form-g"><label className="lbl">Срок</label><input className="inp" type="date" value={taskForm.due} onChange={e=>setTaskForm(p=>({...p,due:e.target.value}))} /></div>
              </div>
              <div className="modal-act"><button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button><button className="btn btn-prim" onClick={addTask}>Создать</button></div>
            </div>
          </div>
        )}

        {/* ADD KB */}
        {modal==="kb" && (
          <div className="ovl" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="modal-title">Добавить материал</div>
              <div className="form-row">
                <div className="form-g">
                  <label className="lbl">Тип</label>
                  <select className="inp" value={kbForm.type} onChange={e=>setKbForm(p=>({...p,type:e.target.value}))}>
                    <option value="sop">📄 SOP Документ</option><option value="youtube">▶ YouTube Урок</option>
                  </select>
                </div>
                <div className="form-g">
                  <label className="lbl">Отдел</label>
                  <select className="inp" value={kbForm.dept} onChange={e=>setKbForm(p=>({...p,dept:e.target.value}))}>
                    {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-g"><label className="lbl">Эмодзи иконка</label><input className="inp" value={kbForm.thumb} onChange={e=>setKbForm(p=>({...p,thumb:e.target.value}))} /></div>
                <div className="form-g"><label className="lbl">Название</label><input className="inp" value={kbForm.title} onChange={e=>setKbForm(p=>({...p,title:e.target.value}))} placeholder="Название материала" /></div>
              </div>
              {kbForm.type==="youtube"
                ? <div className="form-g"><label className="lbl">Ссылка YouTube</label><input className="inp" value={kbForm.url} onChange={e=>setKbForm(p=>({...p,url:e.target.value}))} placeholder="https://youtube.com/watch?v=..." /><div className="form-g" style={{marginTop:10}}><label className="lbl">Описание</label><input className="inp" value={kbForm.desc} onChange={e=>setKbForm(p=>({...p,desc:e.target.value}))} /></div></div>
                : <div className="form-g"><label className="lbl">Содержание SOP</label><textarea className="inp" value={kbForm.content} onChange={e=>setKbForm(p=>({...p,content:e.target.value}))} placeholder="Пропишите шаги и стандарты..." style={{minHeight:120}} /></div>
              }
              <div className="modal-act"><button className="btn btn-ghost" onClick={()=>setModal(null)}>Отмена</button><button className="btn btn-prim" onClick={addKbItem}>Добавить</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
