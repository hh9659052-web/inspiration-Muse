import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "inspiration-muse-v1";
const PROFILE_KEY = "inspiration-muse-profile";
const QUOTA_KEY = "inspiration-muse-quota";
const WINDOW_MS = 72 * 60 * 60 * 1000;
const DAILY_MUSE_LIMIT = 10;
const now = Date.now();

const defaultProfile = {
  likes: ["短时间完成的小实验", "有视觉反馈的成长记录"],
  dislikes: ["一上来就写完整商业计划", "没有反馈的长期打卡"],
  neutrals: ["公开社交", "职业方向探索"],
};

const seedIdeas = [
  {
    id: "seed-1",
    text: "想做一个帮摄影新手找到拍摄主题的小工具",
    createdAt: now - 9 * 60 * 60 * 1000,
    visibility: "公开",
    stage: "active",
    mood: "兴奋",
    source: "手动输入",
    progress: 33,
    notes: ["想先验证新手是否真的缺主题，而不是缺教程。"],
    tasks: [
      { id: "s1-t1", label: "写下 3 个目标用户场景", done: true },
      { id: "s1-t2", label: "找 2 个类似案例截图", done: false },
      { id: "s1-t3", label: "画出第一个输入框", done: false },
    ],
  },
  {
    id: "seed-2",
    text: "把学习过的视频教程整理成自己的技能成长路线",
    createdAt: now - 78 * 60 * 60 * 1000,
    visibility: "私密",
    stage: "cooled",
    mood: "迷茫",
    source: "冷却池",
    progress: 0,
    notes: [],
    tasks: [
      { id: "s2-t1", label: "选一个最想提升的技能", done: false },
      { id: "s2-t2", label: "收藏 1 个教程并记录原因", done: false },
    ],
  },
  {
    id: "seed-3",
    text: "做一份给独居年轻人的周末低成本项目清单",
    createdAt: now - 40 * 60 * 60 * 1000,
    visibility: "公开",
    stage: "done",
    mood: "平静",
    source: "灵感广场",
    progress: 100,
    notes: ["完成了第一版 12 个项目，并准备发成灵感故事。"],
    tasks: [
      { id: "s3-t1", label: "列出 12 个 50 元内可执行项目", done: true },
      { id: "s3-t2", label: "按室内、户外、社交、独处分类", done: true },
      { id: "s3-t3", label: "写出每个项目的第一步", done: true },
    ],
  },
];

const plazaIdeas = [
  "把城市散步路线做成声音明信片",
  "给独居年轻人的周末低成本项目清单",
  "用 7 天记录一个技能从 0 到 1 的过程",
];

const skillSuggestions = [
  { skill: "产品拆解", level: "入门 30%", action: "今天只拆一个产品的首屏和核心按钮。" },
  { skill: "视频表达", level: "新手 25%", action: "录一段 45 秒解释你的想法，不追求发布。" },
  { skill: "原型设计", level: "基础 40%", action: "先画一个输入框、一个泡泡、一个任务列表。" },
];

const statusLabels = {
  all: "全部",
  active: "保鲜",
  cooled: "冷却",
  landed: "落地",
  done: "完成",
};

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createIdeaId() {
  return `idea-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatRemaining(createdAt) {
  const remaining = createdAt + WINDOW_MS - Date.now();
  if (remaining <= 0) return "已冷却";
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}小时 ${minutes}分钟`;
}

function getIdeaStage(idea) {
  if (idea.stage === "landed" || idea.stage === "done") return idea.stage;
  return Date.now() - idea.createdAt > WINDOW_MS ? "cooled" : "active";
}

function getProgress(tasks) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100);
}

function museResponse(text) {
  const clean = text.trim() || "这个想法";
  const short = clean.length > 24 ? `${clean.slice(0, 24)}...` : clean;
  return {
    headline: `先把「${short}」变成一次小实验`,
    question: "它最想帮谁少走一步弯路？",
    actions: [
      "用一句话写清楚目标用户和使用场景。",
      "找一个最小可验证动作，控制在 15 分钟内完成。",
      "记录完成后的阻力点，不急着扩大功能。",
    ],
  };
}

function emergencyTasks(text) {
  const clean = text.trim() || "这个冷却想法";
  return [
    `重新读一遍「${clean.slice(0, 16)}」并圈出最想保留的词。`,
    "打开计时器 3 分钟，只写一个下一步动作。",
    "把这个动作改到小于 5 分钟，不写完整计划。",
  ];
}

function buildReport(idea) {
  const doneTasks = idea.tasks.filter((task) => task.done).map((task) => task.label);
  const todoTasks = idea.tasks.filter((task) => !task.done).map((task) => task.label);
  return [
    `灵感报告：${idea.text}`,
    `创建时间：${formatDate(idea.createdAt)}`,
    `可见范围：${idea.visibility}`,
    `当前状态：${statusLabels[getIdeaStage(idea)]}`,
    `完成进度：${idea.progress}%`,
    "",
    "已完成：",
    ...(doneTasks.length ? doneTasks.map((item) => `- ${item}`) : ["- 暂无"]),
    "",
    "后续可推进：",
    ...(todoTasks.length ? todoTasks.map((item) => `- ${item}`) : ["- 可发布为灵感故事"]),
    "",
    "过程记录：",
    ...(idea.notes?.length ? idea.notes.map((item) => `- ${item}`) : ["- 暂无记录"]),
  ].join("\n");
}

function loadIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedIdeas;
  } catch {
    return seedIdeas;
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function loadQuota() {
  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.date === todayKey()) return parsed;
  } catch {
    // Fall through to a fresh daily quota.
  }
  return { date: todayKey(), used: 0 };
}

function normalizeImportedIdea(idea, index) {
  const tasks = Array.isArray(idea.tasks) ? idea.tasks : [];
  return {
    id: typeof idea.id === "string" ? idea.id : `imported-${Date.now()}-${index}`,
    text: typeof idea.text === "string" && idea.text.trim() ? idea.text : "未命名灵感",
    createdAt: Number.isFinite(idea.createdAt) ? idea.createdAt : Date.now(),
    visibility: idea.visibility === "私密" ? "私密" : "公开",
    stage: ["active", "cooled", "landed", "done"].includes(idea.stage) ? idea.stage : "active",
    mood: typeof idea.mood === "string" ? idea.mood : "导入",
    source: typeof idea.source === "string" ? idea.source : "导入备份",
    progress: Number.isFinite(idea.progress) ? idea.progress : getProgress(tasks),
    notes: Array.isArray(idea.notes) ? idea.notes.filter((note) => typeof note === "string") : [],
    tasks: tasks.map((task, taskIndex) => ({
      id: typeof task.id === "string" ? task.id : `imported-task-${Date.now()}-${index}-${taskIndex}`,
      label: typeof task.label === "string" ? task.label : "未命名任务",
      done: Boolean(task.done),
    })),
  };
}

function App() {
  const [ideas, setIdeas] = useState(loadIdeas);
  const [profile, setProfile] = useState(loadProfile);
  const [quota, setQuota] = useState(loadQuota);
  const [input, setInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [preferenceInput, setPreferenceInput] = useState("");
  const [frictionInput, setFrictionInput] = useState("");
  const [visibility, setVisibility] = useState("公开");
  const [selectedId, setSelectedId] = useState(seedIdeas[0].id);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [notificationState, setNotificationState] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
  }, [quota]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const enrichedIdeas = useMemo(
    () =>
      ideas.map((idea) => {
        const computedStage = getIdeaStage(idea);
        return {
          ...idea,
          computedStage,
          progress: idea.stage === "done" ? 100 : getProgress(idea.tasks || []),
        };
      }),
    [ideas, tick]
  );

  const activeIdeas = enrichedIdeas.filter((idea) => idea.computedStage === "active");
  const cooledIdeas = enrichedIdeas.filter((idea) => idea.computedStage === "cooled");
  const landedIdeas = enrichedIdeas.filter((idea) => idea.computedStage === "landed");
  const doneIdeas = enrichedIdeas.filter((idea) => idea.computedStage === "done");
  const selectedIdea =
    enrichedIdeas.find((idea) => idea.id === selectedId) || enrichedIdeas[0] || null;
  const response = selectedIdea ? museResponse(selectedIdea.text) : null;
  const reportText = selectedIdea ? buildReport(selectedIdea) : "";
  const completionRate = ideas.length ? Math.round((doneIdeas.length / ideas.length) * 100) : 0;

  const filteredIdeas = enrichedIdeas.filter((idea) => {
    const matchesFilter = filter === "all" || idea.computedStage === filter;
    const matchesSearch =
      !search.trim() ||
      `${idea.text} ${idea.tasks.map((task) => task.label).join(" ")}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const dueSoonCount = activeIdeas.filter(
    (idea) => idea.createdAt + WINDOW_MS - Date.now() <= 6 * 60 * 60 * 1000
  ).length;
  const todayCreatedCount = enrichedIdeas.filter(
    (idea) => Date.now() - idea.createdAt < 24 * 60 * 60 * 1000
  ).length;
  const connectionCount = enrichedIdeas.reduce(
    (count, idea) => count + (idea.notes || []).filter((note) => note.includes("连接")).length,
    0
  );
  const quotaRemaining = Math.max(DAILY_MUSE_LIMIT - quota.used, 0);

  function spendMuseCredit() {
    setQuota((current) => {
      const fresh = current.date === todayKey() ? current : { date: todayKey(), used: 0 };
      return { ...fresh, used: Math.min(fresh.used + 1, DAILY_MUSE_LIMIT) };
    });
  }

  function addIdea(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (quotaRemaining <= 0) {
      setImportStatus("今日 Muse 次数已用完，可继续手动记录，明天恢复 AI 拆解额度");
      window.setTimeout(() => setImportStatus(""), 2200);
      return;
    }

    const responseForNewIdea = museResponse(text);
    const idea = {
      id: createIdeaId(),
      text,
      createdAt: Date.now(),
      visibility,
      stage: "active",
      mood: "待启动",
      source: "手动输入",
      progress: 0,
      notes: [],
      tasks: responseForNewIdea.actions.map((label) => ({
        id: createTaskId(),
        label,
        done: false,
      })),
    };

    setIdeas((current) => [idea, ...current]);
    setSelectedId(idea.id);
    setInput("");
    spendMuseCredit();
  }

  function updateIdea(id, updater) {
    setIdeas((current) =>
      current.map((idea) => (idea.id === id ? updater(idea) : idea))
    );
  }

  function toggleTask(ideaId, taskId) {
    updateIdea(ideaId, (idea) => {
      const tasks = idea.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      return { ...idea, tasks, progress: getProgress(tasks) };
    });
  }

  function addNote(event) {
    event.preventDefault();
    if (!selectedIdea || !noteInput.trim()) return;
    updateIdea(selectedIdea.id, (idea) => ({
      ...idea,
      notes: [...(idea.notes || []), noteInput.trim()],
    }));
    setNoteInput("");
  }

  function addTask(event) {
    event.preventDefault();
    if (!selectedIdea || !taskInput.trim()) return;
    updateIdea(selectedIdea.id, (idea) => {
      const tasks = [
        ...idea.tasks,
        {
          id: createTaskId(),
          label: taskInput.trim(),
          done: false,
        },
      ];
      return { ...idea, tasks, progress: getProgress(tasks) };
    });
    setTaskInput("");
  }

  function deleteIdea(id) {
    setIdeas((current) => {
      const next = current.filter((idea) => idea.id !== id);
      setSelectedId(next[0]?.id || "");
      return next;
    });
  }

  function landIdea(id) {
    updateIdea(id, (idea) => ({
      ...idea,
      stage: "landed",
      progress: Math.max(idea.progress, 10),
    }));
  }

  function finishIdea(id) {
    updateIdea(id, (idea) => ({
      ...idea,
      stage: "done",
      progress: 100,
      notes: [...(idea.notes || []), "已生成灵感报告，可发布为灵感故事。"],
      tasks: idea.tasks.map((task) => ({ ...task, done: true })),
    }));
  }

  function rescueIdea(id) {
    if (quotaRemaining <= 0) {
      setImportStatus("今日 Muse 次数已用完，冷却救援明天恢复");
      window.setTimeout(() => setImportStatus(""), 2200);
      return;
    }
    updateIdea(id, (idea) => ({
      ...idea,
      stage: "landed",
      source: "冷却救援",
      notes: [...(idea.notes || []), "通过三分钟热量转换器重新启动。"],
      tasks: emergencyTasks(idea.text).map((label) => ({
        id: createTaskId(),
        label,
        done: false,
      })),
      progress: 0,
    }));
    setSelectedId(id);
    spendMuseCredit();
  }

  function addProfileItem(type, value) {
    const clean = value.trim();
    if (!clean) return;
    setProfile((current) => ({
      ...current,
      [type]: Array.from(new Set([...(current[type] || []), clean])),
    }));
  }

  function removeProfileItem(type, value) {
    setProfile((current) => ({
      ...current,
      [type]: (current[type] || []).filter((item) => item !== value),
    }));
  }

  function addPreference(event) {
    event.preventDefault();
    addProfileItem("likes", preferenceInput);
    setPreferenceInput("");
  }

  function addFriction(event) {
    event.preventDefault();
    addProfileItem("dislikes", frictionInput);
    setFrictionInput("");
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setIdeas(seedIdeas);
    setSelectedId(seedIdeas[0].id);
    setSearch("");
    setFilter("all");
  }

  async function copyReport() {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyStatus("报告已复制");
    } catch {
      setCopyStatus("复制失败，可手动选择报告文本");
    }
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      product: "Inspiration Muse",
      ideas: enrichedIdeas,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inspiration-muse-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importData(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const imported = Array.isArray(payload) ? payload : payload.ideas;
      if (!Array.isArray(imported)) {
        throw new Error("Invalid backup format");
      }
      const normalized = imported.map(normalizeImportedIdea);
      setIdeas(normalized);
      setSelectedId(normalized[0]?.id || "");
      setImportStatus(`已导入 ${normalized.length} 个泡泡`);
    } catch {
      setImportStatus("导入失败，请选择灵感缪斯导出的 JSON 文件");
    }
    window.setTimeout(() => setImportStatus(""), 2200);
  }

  function requestConnection(plazaIdea) {
    const targetId = selectedIdea?.id;
    if (!targetId) return;
    updateIdea(targetId, (idea) => ({
      ...idea,
      notes: [
        ...(idea.notes || []),
        `已向灵感广场发起连接：${plazaIdea}`,
      ],
    }));
    setConnectionStatus("连接请求已写入当前泡泡记录");
    window.setTimeout(() => setConnectionStatus(""), 1800);
  }

  async function requestNotifications() {
    if (typeof Notification === "undefined") {
      setNotificationState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
    if (permission === "granted") {
      new Notification("灵感缪斯提醒已开启", {
        body: "当前版本会在页面打开时标记临近冷却的泡泡；后台推送需要后端和 Service Worker。",
      });
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="灵感缪斯工作台">
        <aside className="left-rail">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span />
            </div>
            <div>
              <h1>灵感缪斯</h1>
              <p>把一闪而过的想法推进成可执行的小行动。</p>
            </div>
          </div>

          <form className="capture-panel" onSubmit={addIdea}>
            <label htmlFor="idea-input">此刻脑中最混乱的想法</label>
            <textarea
              id="idea-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="例如：我想做一个帮新手找到摄影主题的工具..."
              rows={5}
            />
            <div className="capture-actions">
              <div className="segmented" aria-label="可见范围">
                {["公开", "私密"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={visibility === item ? "is-active" : ""}
                    onClick={() => setVisibility(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button className="primary-action" type="submit">
                投入泡泡
              </button>
            </div>
          </form>

          <div className="metrics-strip">
            <div>
              <strong>{activeIdeas.length}</strong>
              <span>保鲜中</span>
            </div>
            <div>
              <strong>{cooledIdeas.length}</strong>
              <span>待救援</span>
            </div>
            <div>
              <strong>{completionRate}%</strong>
              <span>完成率</span>
            </div>
          </div>

          <div className="ops-panel">
            <button type="button" onClick={requestNotifications}>
              开启冷却提醒
            </button>
            <button type="button" onClick={exportData}>
              导出数据
            </button>
            <label className="file-action">
              导入备份
              <input type="file" accept="application/json,.json" onChange={importData} />
            </label>
            <p>
              {importStatus ||
              (notificationState === "granted"
                ? `提醒已授权，${dueSoonCount} 个泡泡临近冷却。`
                : "当前用本地提醒入口验证召回流程。")}
            </p>
            <div className="quota-meter">
              <span>Muse 今日额度</span>
              <strong>
                {quota.used}/{DAILY_MUSE_LIMIT}
              </strong>
              <div>
                <i style={{ width: `${(quota.used / DAILY_MUSE_LIMIT) * 100}%` }} />
              </div>
            </div>
          </div>
        </aside>

        <section className="muse-stage">
          <div className="stage-header">
            <div>
              <p className="eyebrow">72 小时灵感保鲜</p>
              <h2>今天先推动一个泡泡</h2>
            </div>
            <button className="quiet-action" type="button" onClick={resetDemo}>
              重置示例
            </button>
          </div>

          <div className="today-strip" aria-label="今日变化">
            <div>
              <strong>{todayCreatedCount}</strong>
              <span>24小时内新泡泡</span>
            </div>
            <div>
              <strong>{dueSoonCount}</strong>
              <span>6小时内冷却</span>
            </div>
            <div>
              <strong>{connectionCount}</strong>
              <span>连接请求记录</span>
            </div>
          </div>

          <div className="visual-field">
            <div className="muse-statue" aria-hidden="true">
              <div className="halo" />
              <div className="head" />
              <div className="body" />
              <div className="hand left" />
              <div className="hand right" />
            </div>

            <div className="bubble-layer" aria-label="灵感泡泡列表">
              {activeIdeas.slice(0, 6).map((idea, index) => (
                <button
                  key={idea.id}
                  className={`idea-bubble bubble-${index % 6} ${
                    selectedIdea?.id === idea.id ? "is-selected" : ""
                  } ${idea.createdAt + WINDOW_MS - Date.now() <= 6 * 60 * 60 * 1000 ? "is-due" : ""}`}
                  type="button"
                  onClick={() => setSelectedId(idea.id)}
                >
                  <span>{idea.text}</span>
                  <small>{formatRemaining(idea.createdAt)}</small>
                </button>
              ))}
              {activeIdeas.length === 0 && (
                <div className="empty-state">当前没有保鲜泡泡，先投入一个想法。</div>
              )}
            </div>
          </div>
        </section>

        <aside className="right-rail">
          {selectedIdea && response ? (
            <section className="detail-panel">
              <div className="panel-headline">
                <span className={`status-dot ${selectedIdea.computedStage}`} />
                <div>
                  <p>
                    {selectedIdea.visibility}泡泡 · {statusLabels[selectedIdea.computedStage]} ·{" "}
                    {formatDate(selectedIdea.createdAt)}
                  </p>
                  <h3>{selectedIdea.text}</h3>
                </div>
              </div>
              <div className="countdown-box">
                <span>剩余保鲜时间</span>
                <strong>{formatRemaining(selectedIdea.createdAt)}</strong>
              </div>
              <div className="muse-response">
                <p className="eyebrow">Muse 助手</p>
                <h4>{response.headline}</h4>
                <p>{response.question}</p>
              </div>
              <div className="task-list">
                {selectedIdea.tasks.map((task) => (
                  <label key={task.id} className="task-row">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(selectedIdea.id, task.id)}
                    />
                    <span>{task.label}</span>
                  </label>
                ))}
              </div>
              <form className="task-form" onSubmit={addTask}>
                <input
                  value={taskInput}
                  onChange={(event) => setTaskInput(event.target.value)}
                  placeholder="新增一个最小行动"
                />
                <button type="submit">添加</button>
              </form>
              <div className="progress-track" aria-label={`进度 ${selectedIdea.progress}%`}>
                <span style={{ width: `${selectedIdea.progress}%` }} />
              </div>
              <form className="note-form" onSubmit={addNote}>
                <input
                  value={noteInput}
                  onChange={(event) => setNoteInput(event.target.value)}
                  placeholder="记录一次阻力、反馈或完成证据"
                />
                <button type="submit">记录</button>
              </form>
              <div className="detail-actions">
                {selectedIdea.computedStage === "cooled" ? (
                  <button type="button" onClick={() => rescueIdea(selectedIdea.id)}>
                    3分钟救援
                  </button>
                ) : (
                  <button type="button" onClick={() => landIdea(selectedIdea.id)}>
                    生成落地板
                  </button>
                )}
                <button type="button" onClick={() => finishIdea(selectedIdea.id)}>
                  标记完成
                </button>
                <button
                  className="danger-action"
                  type="button"
                  onClick={() => deleteIdea(selectedIdea.id)}
                >
                  删除泡泡
                </button>
              </div>
              <div className="report-card">
                <div className="report-head">
                  <div>
                    <p className="eyebrow">灵感报告</p>
                    <h4>完成后可发布为灵感故事</h4>
                  </div>
                  <button type="button" onClick={copyReport}>
                    复制
                  </button>
                </div>
                <pre>{reportText}</pre>
                {copyStatus && <span className="copy-status">{copyStatus}</span>}
              </div>
            </section>
          ) : (
            <section className="detail-panel empty-detail">选择一个泡泡查看推进建议。</section>
          )}
        </aside>
      </section>

      <section className="bottom-grid">
        <div className="surface-section library-section">
          <div className="section-heading">
            <p className="eyebrow">泡泡库</p>
            <h2>管理全部灵感</h2>
          </div>
          <div className="library-tools">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索想法或任务"
            />
            <div className="filter-tabs">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={filter === key ? "is-active" : ""}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="idea-table">
            {filteredIdeas.map((idea) => (
              <button
                key={idea.id}
                type="button"
                className={selectedIdea?.id === idea.id ? "is-active" : ""}
                onClick={() => setSelectedId(idea.id)}
              >
                <span>{idea.text}</span>
                <small>
                  {statusLabels[idea.computedStage]} · {idea.progress}% ·{" "}
                  {formatRemaining(idea.createdAt)}
                </small>
              </button>
            ))}
            {filteredIdeas.length === 0 && <p className="muted">没有匹配的泡泡。</p>}
          </div>
        </div>

        <div className="surface-section">
          <div className="section-heading">
            <p className="eyebrow">冷却泡泡</p>
            <h2>低门槛救援池</h2>
          </div>
          <div className="compact-list">
            {cooledIdeas.map((idea) => (
              <article key={idea.id} className="compact-item">
                <div>
                  <strong>{idea.text}</strong>
                  <span>进入冷却后只给 3 个极小任务，避免重新写大计划。</span>
                </div>
                <button type="button" onClick={() => rescueIdea(idea.id)}>
                  救援
                </button>
              </article>
            ))}
            {cooledIdeas.length === 0 && <p className="muted">暂无冷却泡泡。</p>}
          </div>
        </div>

        <div className="surface-section">
          <div className="section-heading">
            <p className="eyebrow">落地看板</p>
            <h2>正在推进</h2>
          </div>
          <div className="compact-list">
            {landedIdeas.map((idea) => (
              <article key={idea.id} className="compact-item">
                <div>
                  <strong>{idea.text}</strong>
                  <span>{idea.progress}% 已完成</span>
                </div>
                <button type="button" onClick={() => finishIdea(idea.id)}>
                  完成
                </button>
              </article>
            ))}
            {landedIdeas.length === 0 && <p className="muted">还没有落地中的泡泡。</p>}
          </div>
        </div>

        <div className="surface-section">
          <div className="section-heading">
            <p className="eyebrow">技能泡泡</p>
            <h2>先补最短板</h2>
          </div>
          <div className="skill-stack">
            {skillSuggestions.map((item) => (
              <article key={item.skill} className="skill-item">
                <strong>{item.skill}</strong>
                <span>{item.level}</span>
                <p>{item.action}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="surface-section profile-section">
          <div className="section-heading">
            <p className="eyebrow">偏好泡泡</p>
            <h2>减少精神阻力</h2>
          </div>
          <form className="profile-form" onSubmit={addPreference}>
            <input
              value={preferenceInput}
              onChange={(event) => setPreferenceInput(event.target.value)}
              placeholder="添加让你有能量的人或事"
            />
            <button type="submit">加入喜欢</button>
          </form>
          <form className="profile-form" onSubmit={addFriction}>
            <input
              value={frictionInput}
              onChange={(event) => setFrictionInput(event.target.value)}
              placeholder="添加容易消耗你的阻力点"
            />
            <button type="submit">加入不喜欢</button>
          </form>
          <div className="profile-groups">
            <div>
              <strong>喜欢</strong>
              {(profile.likes || []).map((item) => (
                <button key={item} type="button" onClick={() => removeProfileItem("likes", item)}>
                  {item}
                </button>
              ))}
            </div>
            <div>
              <strong>不喜欢</strong>
              {(profile.dislikes || []).map((item) => (
                <button key={item} type="button" onClick={() => removeProfileItem("dislikes", item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-section">
          <div className="section-heading">
            <p className="eyebrow">灵感广场</p>
            <h2>轻量社交预览</h2>
          </div>
          <div className="plaza-list">
            {plazaIdeas.map((idea) => (
              <button key={idea} type="button" onClick={() => requestConnection(idea)}>
                <span>{idea}</span>
                <small>请求连接</small>
              </button>
            ))}
          </div>
          {connectionStatus && <p className="connection-status">{connectionStatus}</p>}
        </div>
      </section>
    </main>
  );
}

export default App;
