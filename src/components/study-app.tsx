"use client";

import {
  BookMarked,
  Check,
  ChevronRight,
  Cloud,
  Globe2,
  GraduationCap,
  Layers3,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCcw,
  Shuffle,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { WordWaterfall } from "@/components/word-waterfall";
import {
  getKeySentencesByLesson,
  keySentenceLessons,
  keySentences,
} from "@/data/key-sentences";
import { gradeAnswer, getExpectedAnswer, getPrompt } from "@/lib/grading";
import { lessons, vocabulary } from "@/lib/vocabulary";
import type {
  CustomSentence,
  ProgressPayload,
  StudyDirection,
  StudyMode,
  StudyStat,
  VocabularyEntry,
  WordbookItem,
} from "@/lib/types";

type SessionResponse = {
  user: {
    userId: string;
    vercelUserId: string;
    email?: string;
    name?: string;
  } | null;
};

type WordbookReviewScope = "all" | "lesson" | null;
type MainTab = "flashcards" | "sentences";

function shuffleEntries(entries: VocabularyEntry[]) {
  const next = [...entries];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function formatStat(stat?: StudyStat) {
  if (!stat) return "0 对 / 0 错";
  return `${stat.correctCount} 对 / ${stat.wrongCount} 错`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "请求失败";
}

export function StudyApp() {
  const [mainTab, setMainTab] = useState<MainTab>("flashcards");
  const [mode, setMode] = useState<StudyMode>("all");
  const [direction, setDirection] = useState<StudyDirection>("cn-to-ko");
  const [selectedLesson, setSelectedLesson] = useState(lessons[0] ?? "2과");
  const [selectedSentenceLesson, setSelectedSentenceLesson] = useState(
    keySentenceLessons[0] ?? "2과",
  );
  const [selectedWordbookLesson, setSelectedWordbookLesson] = useState(lessons[0] ?? "2과");
  const [wordbookReviewScope, setWordbookReviewScope] =
    useState<WordbookReviewScope>(null);
  const [session, setSession] = useState<SessionResponse["user"]>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [wordbook, setWordbook] = useState<WordbookItem[]>([]);
  const [stats, setStats] = useState<StudyStat[]>([]);
  const [customSentences, setCustomSentences] = useState<CustomSentence[]>([]);
  const [customSentenceForm, setCustomSentenceForm] = useState({
    korean: "",
    chinese: "",
  });
  const [customSentenceMessage, setCustomSentenceMessage] = useState("");
  const [queue, setQueue] = useState<VocabularyEntry[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [syncMessage, setSyncMessage] = useState("");
  const [rippleSignal, setRippleSignal] = useState(0);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);

  const wordbookIds = useMemo(
    () => new Set(wordbook.map((item) => item.wordId)),
    [wordbook],
  );
  const statMap = useMemo(
    () => new Map(stats.map((stat) => [stat.wordId, stat])),
    [stats],
  );

  const wordbookEntries = useMemo(
    () => vocabulary.filter((entry) => wordbookIds.has(entry.id)),
    [wordbookIds],
  );
  const wordbookPoolSignature =
    mode === "wordbook" ? wordbook.map((item) => item.wordId).join("|") : "";

  const activePool = useMemo(() => {
    if (mode === "lesson") {
      return vocabulary.filter((entry) => entry.lesson === selectedLesson);
    }
    if (mode === "wordbook") {
      if (!wordbookReviewScope) return [];
      return wordbookEntries.filter((entry) => {
        return wordbookReviewScope === "all" || entry.lesson === selectedWordbookLesson;
      });
    }
    return vocabulary;
  }, [
    mode,
    selectedLesson,
    selectedWordbookLesson,
    wordbookPoolSignature,
    wordbookReviewScope,
  ]);

  const current = queue[0] ?? null;
  const isSaved = current ? wordbookIds.has(current.id) : false;
  const visibleAnswered = Math.min(
    sessionTotal,
    answeredCount + (feedback && current ? 1 : 0),
  );
  const progressPercent = sessionTotal ? (visibleAnswered / sessionTotal) * 100 : 0;
  const sessionFinished = sessionTotal > 0 && queue.length === 0;
  const selectedSentences = useMemo(
    () => getKeySentencesByLesson(selectedSentenceLesson),
    [selectedSentenceLesson],
  );
  const selectedCustomSentences = useMemo(
    () => customSentences.filter((sentence) => sentence.lesson === selectedSentenceLesson),
    [customSentences, selectedSentenceLesson],
  );
  const sentenceLessonCounts = useMemo(() => {
    return new Map(
      keySentenceLessons.map((lesson) => [
        lesson,
        getKeySentencesByLesson(lesson).length +
          customSentences.filter((sentence) => sentence.lesson === lesson).length,
      ]),
    );
  }, [customSentences]);

  useEffect(() => {
    async function loadSession() {
      const response = await fetch("/api/auth/session");
      const data = (await response.json()) as SessionResponse;
      setSession(data.user);
      setSessionLoaded(true);
    }

    void loadSession();
  }, []);

  useEffect(() => {
    async function loadProgress() {
      if (!session) return;

      try {
        const response = await fetch("/api/progress");
        if (!response.ok) throw new Error("无法加载云端学习记录");
        const data = (await response.json()) as ProgressPayload;
        setWordbook(data.wordbook);
        setStats(data.stats);
        setSyncMessage("云端记录已同步");
      } catch (error) {
        setSyncMessage(getErrorMessage(error));
      }
    }

    void loadProgress();
  }, [session]);

  useEffect(() => {
    async function loadCustomSentences() {
      if (!session) {
        setCustomSentences([]);
        return;
      }

      try {
        const response = await fetch("/api/sentences");
        if (!response.ok) throw new Error("无法加载我的例句");
        const data = (await response.json()) as { sentences: CustomSentence[] };
        setCustomSentences(data.sentences);
      } catch (error) {
        setCustomSentenceMessage(getErrorMessage(error));
      }
    }

    void loadCustomSentences();
  }, [session]);

  useEffect(() => {
    setQueue(shuffleEntries(activePool));
    setSessionTotal(activePool.length);
    setAnsweredCount(0);
    setAnswer("");
    setFeedback(null);
  }, [activePool]);

  function selectMode(nextMode: StudyMode) {
    setMode(nextMode);
    if (nextMode === "wordbook") {
      setWordbookReviewScope(null);
    }
  }

  async function persistWordbook(wordId: string, action: "add" | "remove") {
    if (!session) {
      setSyncMessage("登录后才能同步单词本");
      return;
    }

    const previous = wordbook;
    const nextWordbook =
      action === "add"
        ? [{ wordId, note: "", createdAt: new Date().toISOString() }, ...wordbook]
        : wordbook.filter((item) => item.wordId !== wordId);
    setWordbook(nextWordbook);

    try {
      const response = await fetch("/api/wordbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, action }),
      });
      if (!response.ok) throw new Error("单词本同步失败");
      setSyncMessage(action === "add" ? "已加入单词本" : "已移出单词本");
    } catch (error) {
      setWordbook(previous);
      setSyncMessage(getErrorMessage(error));
    }
  }

  async function persistStat(wordId: string, correct: boolean) {
    if (!session) return;

    setStats((currentStats) => {
      const existing = currentStats.find((stat) => stat.wordId === wordId);
      if (!existing) {
        return [
          ...currentStats,
          {
            wordId,
            correctCount: correct ? 1 : 0,
            wrongCount: correct ? 0 : 1,
            lastSeenAt: new Date().toISOString(),
          },
        ];
      }

      return currentStats.map((stat) =>
        stat.wordId === wordId
          ? {
              ...stat,
              correctCount: stat.correctCount + (correct ? 1 : 0),
              wrongCount: stat.wrongCount + (correct ? 0 : 1),
              lastSeenAt: new Date().toISOString(),
            }
          : stat,
      );
    });

    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, correct }),
      });
      if (!response.ok) throw new Error("学习记录同步失败");
    } catch (error) {
      setSyncMessage(getErrorMessage(error));
    }
  }

  function advance() {
    if (!current) return;
    setAnsweredCount((count) => Math.min(sessionTotal, count + 1));
    setQueue((currentQueue) => currentQueue.slice(1));
    setAnswer("");
    setFeedback(null);
  }

  function restartSession() {
    setQueue(shuffleEntries(activePool));
    setSessionTotal(activePool.length);
    setAnsweredCount(0);
    setAnswer("");
    setFeedback(null);
  }

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || feedback) return;
    const correct = gradeAnswer(answer, current, direction);
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setRippleSignal((value) => value + 1);
    }
    await persistStat(current.id, correct);
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setSession(null);
    setWordbook([]);
    setStats([]);
    setCustomSentences([]);
    setCustomSentenceMessage("");
    setSyncMessage("已退出登录");
  }

  async function addCustomSentence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setCustomSentenceMessage("登录后才能保存自己的例句");
      return;
    }

    const korean = customSentenceForm.korean.trim();
    const chinese = customSentenceForm.chinese.trim();
    if (!korean || !chinese) {
      setCustomSentenceMessage("请同时填写韩文句子和中文意思");
      return;
    }

    try {
      const response = await fetch("/api/sentences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson: selectedSentenceLesson,
          korean,
          chinese,
        }),
      });
      if (!response.ok) throw new Error("保存例句失败");
      const data = (await response.json()) as { sentence: CustomSentence };
      setCustomSentences((sentences) => [data.sentence, ...sentences]);
      setCustomSentenceForm({ korean: "", chinese: "" });
      setCustomSentenceMessage("已保存到我的例句");
    } catch (error) {
      setCustomSentenceMessage(getErrorMessage(error));
    }
  }

  async function deleteCustomSentence(sentenceId: string) {
    if (!session) return;

    const previous = customSentences;
    setCustomSentences((sentences) =>
      sentences.filter((sentence) => sentence.id !== sentenceId),
    );

    try {
      const response = await fetch("/api/sentences", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sentenceId }),
      });
      if (!response.ok) throw new Error("删除例句失败");
      setCustomSentenceMessage("已删除自定义例句");
    } catch (error) {
      setCustomSentences(previous);
      setCustomSentenceMessage(getErrorMessage(error));
    }
  }

  function renderProgress() {
    if (mode === "wordbook" && !wordbookReviewScope) return null;

    return (
      <div className="progress-card" aria-label="练习进度">
        <div className="progress-copy">
          <span>{mode === "lesson" ? `${selectedLesson} 进度` : "本轮进度"}</span>
          <strong>
            {visibleAnswered}/{sessionTotal}
          </strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    );
  }

  function renderWordbookHome() {
    const lessonWordbookCount = wordbookEntries.filter(
      (entry) => entry.lesson === selectedWordbookLesson,
    ).length;

    return (
      <div className="notebook-panel">
        <div className="notebook-header">
          <div>
            <p className="eyebrow">Review</p>
            <h2>单词本</h2>
            <p>
              {sessionLoaded ? (session ? "云端保存" : "未登录") : "加载中"} · 共{" "}
              {wordbookEntries.length} 个词
            </p>
          </div>
          <div className="notebook-actions" aria-label="选择单词本复习模式">
            <button
              disabled={!wordbookEntries.length}
              onClick={() => setWordbookReviewScope("all")}
              type="button"
            >
              <Globe2 size={20} />
              <span>全局复习</span>
            </button>
            <button
              disabled={!lessonWordbookCount}
              onClick={() => setWordbookReviewScope("lesson")}
              type="button"
            >
              <Layers3 size={20} />
              <span>按课复习</span>
            </button>
          </div>
        </div>

        <div className="notebook-lesson-strip">
          {lessons.map((lesson) => {
            const count = wordbookEntries.filter((entry) => entry.lesson === lesson).length;
            return (
              <button
                className={selectedWordbookLesson === lesson ? "selected" : ""}
                key={lesson}
                onClick={() => setSelectedWordbookLesson(lesson)}
                type="button"
              >
                {lesson}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="wordbook-list notebook-list">
          {wordbookEntries.length ? (
            wordbookEntries.map((entry) => (
              <div className="wordbook-row" key={entry.id}>
                <div>
                  <strong>{entry.word}</strong>
                  <span>{entry.meaning}</span>
                </div>
                <div>
                  <span>{entry.lesson}</span>
                  <span>{entry.partOfSpeech}</span>
                  <span>{formatStat(statMap.get(entry.id))}</span>
                  <button
                    aria-label={`移除 ${entry.word}`}
                    onClick={() => void persistWordbook(entry.id, "remove")}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state compact">
              <BookMarked size={32} />
              <h2>单词本还是空的</h2>
              <p>在随机或课程闪卡中把没记牢的词加入单词本，之后可以集中复习。</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderKeySentences() {
    return (
      <section className="sentences-shell" aria-label="重点例句">
        <div className="sentences-panel">
          <div className="sentences-header">
            <div>
              <p className="eyebrow">Sentences</p>
              <h2>重点例句</h2>
              <p>
                教材固定例句 {keySentences.length} 句
                {session ? ` · 我的例句 ${customSentences.length} 句` : " · 登录后可添加我的例句"}
              </p>
            </div>
            <div className="sentences-count">
              <strong>{selectedSentences.length + selectedCustomSentences.length}</strong>
              <span>{selectedSentenceLesson}</span>
            </div>
          </div>

          <div className="sentence-lesson-tabs" aria-label="选择课程">
            {keySentenceLessons.map((lesson) => (
              <button
                className={selectedSentenceLesson === lesson ? "selected" : ""}
                key={lesson}
                onClick={() => setSelectedSentenceLesson(lesson)}
                type="button"
              >
                {lesson}
                <span>{sentenceLessonCounts.get(lesson) ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="custom-sentence-card">
            {session ? (
              <form className="custom-sentence-form" onSubmit={addCustomSentence}>
                <div>
                  <span className="sentence-source-label">我的例句 · {selectedSentenceLesson}</span>
                  <p>把课堂外想记住的句子补在这里，会跟随当前 Vercel 账号保存。</p>
                </div>
                <div className="sentence-form-grid">
                  <textarea
                    aria-label="自定义韩文句子"
                    maxLength={300}
                    onChange={(event) =>
                      setCustomSentenceForm((form) => ({
                        ...form,
                        korean: event.target.value,
                      }))
                    }
                    placeholder="输入韩文句子"
                    rows={2}
                    value={customSentenceForm.korean}
                  />
                  <textarea
                    aria-label="自定义中文意思"
                    maxLength={300}
                    onChange={(event) =>
                      setCustomSentenceForm((form) => ({
                        ...form,
                        chinese: event.target.value,
                      }))
                    }
                    placeholder="输入中文意思"
                    rows={2}
                    value={customSentenceForm.chinese}
                  />
                  <button className="primary-button" type="submit">
                    保存例句
                  </button>
                </div>
                {customSentenceMessage ? (
                  <p className="sentence-form-message">{customSentenceMessage}</p>
                ) : null}
              </form>
            ) : (
              <div className="sentence-login-state">
                <span className="sentence-source-label">我的例句</span>
                <p>登录后可以添加、保存并同步自己的韩文例句。</p>
                <a className="ghost-button" href="/api/auth/authorize">
                  <LogIn size={16} />
                  Vercel 登录
                </a>
              </div>
            )}
          </div>

          <div className="sentence-list">
            {selectedSentences.map((sentence, index) => (
              <article className="sentence-row" key={sentence.id}>
                <div className="sentence-index">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <span>{sentence.section}</span>
                  <strong>{sentence.korean}</strong>
                  {sentence.chinese ? <p>{sentence.chinese}</p> : null}
                </div>
              </article>
            ))}
            {selectedCustomSentences.length ? (
              <div className="sentence-section-title">我的例句</div>
            ) : null}
            {selectedCustomSentences.map((sentence, index) => (
              <article className="sentence-row custom" key={sentence.id}>
                <div className="sentence-index">
                  {String(selectedSentences.length + index + 1).padStart(2, "0")}
                </div>
                <div>
                  <span>自定义</span>
                  <strong>{sentence.korean}</strong>
                  <p>{sentence.chinese}</p>
                </div>
                <button
                  aria-label="删除自定义例句"
                  className="sentence-delete-button"
                  onClick={() => void deleteCustomSentence(sentence.id)}
                  type="button"
                >
                  <X size={15} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <WordWaterfall vocabulary={vocabulary} rippleSignal={rippleSignal} />
      <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">韩国语（1）词汇表</p>
          <h1>词汇闪卡</h1>
        </div>
        <div className="account">
          <div className="sync-state">
            <Cloud size={16} />
            <span>{session ? syncMessage || "已登录并可同步" : "登录后云端同步"}</span>
          </div>
          {session ? (
            <button className="ghost-button" onClick={signOut} type="button">
              <LogOut size={16} />
              退出
            </button>
          ) : (
            <a className="primary-button" href="/api/auth/authorize">
              <LogIn size={16} />
              Vercel 登录
            </a>
          )}
        </div>
      </header>

      <nav className="main-tabs" aria-label="主要功能">
        <button
          className={mainTab === "flashcards" ? "selected" : ""}
          onClick={() => setMainTab("flashcards")}
          type="button"
        >
          <Shuffle size={17} />
          闪卡
        </button>
        <button
          className={mainTab === "sentences" ? "selected" : ""}
          onClick={() => setMainTab("sentences")}
          type="button"
        >
          <Layers3 size={17} />
          重点例句
        </button>
      </nav>

      {mainTab === "flashcards" ? (
      <section className={`workspace ${controlsCollapsed ? "controls-collapsed" : ""}`}>
        <aside className={`control-panel ${controlsCollapsed ? "collapsed" : ""}`}>
          <button
            aria-label={controlsCollapsed ? "展开菜单" : "折叠菜单"}
            className="control-collapse-button"
            onClick={() => setControlsCollapsed((value) => !value)}
            type="button"
          >
            {controlsCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span>{controlsCollapsed ? "展开" : "收起"}</span>
          </button>

          <div className="control-panel-content">
          <div className="panel-section">
            <h2>练习模式</h2>
            <div className="segmented vertical mode-controls">
              <button
                className={mode === "all" ? "selected" : ""}
                onClick={() => selectMode("all")}
                type="button"
              >
                <Shuffle size={18} />
                随机闪卡
              </button>
              <button
                className={mode === "lesson" ? "selected" : ""}
                onClick={() => selectMode("lesson")}
                type="button"
              >
                <GraduationCap size={18} />
                课程单词
              </button>
              <button
                className={mode === "wordbook" ? "selected" : ""}
                onClick={() => selectMode("wordbook")}
                type="button"
              >
                <BookMarked size={18} />
                单词本
              </button>
            </div>
          </div>

          {mode === "lesson" ? (
            <div className="panel-section">
              <h2>课程</h2>
              <div className="lesson-grid lesson-dots">
                {lessons.map((lesson) => (
                  <button
                    className={selectedLesson === lesson ? "selected" : ""}
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    type="button"
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="panel-section">
            <h2>答题方向</h2>
            <div className="segmented vertical direction-controls">
              <button
                className={direction === "cn-to-ko" ? "selected" : ""}
                onClick={() => setDirection("cn-to-ko")}
                type="button"
              >
                看中文写韩文
              </button>
              <button
                className={direction === "ko-to-cn" ? "selected" : ""}
                onClick={() => setDirection("ko-to-cn")}
                type="button"
              >
                看韩文写中文
              </button>
            </div>
          </div>

          <div className="panel-section metric-row">
            <div>
              <span>词库</span>
              <strong>{vocabulary.length}</strong>
            </div>
            <div>
              <span>当前</span>
              <strong>{activePool.length || (mode === "wordbook" ? wordbookEntries.length : 0)}</strong>
            </div>
            <div>
              <span>单词本</span>
              <strong>{wordbook.length}</strong>
            </div>
          </div>
          </div>
        </aside>

        <section className="practice-area">
          <div className="flashcard-panel">
            {mode === "wordbook" && !wordbookReviewScope ? (
              renderWordbookHome()
            ) : (
              <>
                {renderProgress()}

                {current ? (
                  <>
                    <div className="card-meta">
                      <span>{current.lesson}</span>
                      <span>{current.partOfSpeech || "词性未标注"}</span>
                      <span>{formatStat(statMap.get(current.id))}</span>
                    </div>

                    <div className="flashcard">
                      <p className="prompt-label">
                        {direction === "cn-to-ko" ? "写出对应韩文" : "写出中文释义"}
                      </p>
                      <div
                        className={direction === "cn-to-ko" ? "prompt chinese" : "prompt korean"}
                      >
                        {getPrompt(current, direction)}
                      </div>
                      {current.pronunciation ? (
                        <p className="pronunciation">发音：{current.pronunciation}</p>
                      ) : null}
                    </div>

                    <form className="answer-form" onSubmit={submitAnswer}>
                      <input
                        aria-label="输入答案"
                        autoComplete="off"
                        disabled={Boolean(feedback)}
                        onChange={(event) => setAnswer(event.target.value)}
                        placeholder={direction === "cn-to-ko" ? "输入韩文" : "输入中文释义"}
                        value={answer}
                      />
                      <button
                        className="primary-button"
                        disabled={!answer || Boolean(feedback)}
                        type="submit"
                      >
                        提交
                      </button>
                    </form>

                    {feedback ? (
                      <div className={`feedback ${feedback}`}>
                        <div className="feedback-title">
                          {feedback === "correct" ? <Check size={20} /> : <X size={20} />}
                          <strong>{feedback === "correct" ? "回答正确" : "回答错误"}</strong>
                        </div>
                        <p>
                          标准答案：<span>{getExpectedAnswer(current, direction)}</span>
                        </p>
                        {current.note ? <p>备注：{current.note}</p> : null}
                        {current.hanja ? <p>汉字词/外来词：{current.hanja}</p> : null}
                      </div>
                    ) : null}

                    <div className="action-row">
                      <button
                        className="ghost-button"
                        onClick={() =>
                          void persistWordbook(current.id, isSaved ? "remove" : "add")
                        }
                        type="button"
                      >
                        <BookMarked size={16} />
                        {isSaved ? "移出单词本" : "加入单词本"}
                      </button>
                      <button className="ghost-button" onClick={advance} type="button">
                        {feedback ? <ChevronRight size={16} /> : <RefreshCcw size={16} />}
                        {feedback ? "下一张" : "跳过"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <BookMarked size={32} />
                    <h2>{sessionFinished ? "本轮练习完成" : "没有可练习的词"}</h2>
                    <p>
                      {sessionFinished
                        ? "这一轮的卡片都已经完成，不会自动重复出现。"
                        : "请切换课程、复习范围或先向单词本加入词条。"}
                    </p>
                    {sessionFinished ? (
                      <button className="primary-button" onClick={restartSession} type="button">
                        重新开始本轮
                      </button>
                    ) : null}
                    {mode === "wordbook" ? (
                      <button
                        className="ghost-button"
                        onClick={() => setWordbookReviewScope(null)}
                        type="button"
                      >
                        返回单词本
                      </button>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </section>
      ) : (
        renderKeySentences()
      )}
      </main>
    </>
  );
}
