"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { getTeam } from "@/lib/teams"
import { getProject, upsertProject, getTasks, createTask, updateTaskStatus, deleteTask } from "@/lib/projects"
import { DOMAINS } from "@/data/constants"
import type { TeamWithMembers, Project, Task, TaskStatus } from "@/lib/supabase/types"

// ── CONSTANTS ─────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "backlog",     label: "Backlog",     color: "#6b7280" },
  { id: "in_progress", label: "In Progress", color: "#fbbf24" },
  { id: "review",     label: "Review",      color: "#a78bfa" },
  { id: "done",       label: "Done",        color: "#22c55e" },
]

const STATUS_NEXT: Record<TaskStatus, TaskStatus | null> = {
  backlog: "in_progress",
  in_progress: "review",
  review: "done",
  done: null,
}

const STATUS_PREV: Record<TaskStatus, TaskStatus | null> = {
  backlog: null,
  in_progress: "backlog",
  review: "in_progress",
  done: "review",
}

// ── COMPONENT ─────────────────────────────────────────────────

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = use(params)
  const { user, signOut } = useAuth()

  const [team, setTeam] = useState<TeamWithMembers | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Edit project state
  const [editingProject, setEditingProject] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [draftDesc, setDraftDesc] = useState("")
  const [draftDomain, setDraftDomain] = useState("")
  const [draftGithub, setDraftGithub] = useState("")
  const [saving, setSaving] = useState(false)

  // New task state (per column)
  const [addingTask, setAddingTask] = useState<TaskStatus | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    Promise.all([getTeam(teamId), getProject(teamId)]).then(([t, p]) => {
      setTeam(t)
      setProject(p)
      if (p) {
        setTasks([]) // load tasks next
        getTasks(p.id).then(setTasks)
        setDraftName(p.name)
        setDraftDesc(p.description ?? "")
        setDraftDomain(p.domain ?? "")
        setDraftGithub(p.github_url ?? "")
      } else if (t) {
        // Pre-fill project name from team name
        setDraftName(t.name)
        setDraftDesc(t.description ?? "")
        setEditingProject(true)
      }
      setLoading(false)
    })
  }, [teamId])

  const isMember = team?.members.some((m) => m.user_id === user?.id)

  // ── PROJECT SAVE ─────────────────────────────────────────────

  const handleSaveProject = async () => {
    if (!draftName.trim()) return
    setSaving(true)
    const p = await upsertProject(teamId, {
      name: draftName.trim(),
      description: draftDesc.trim() || null,
      domain: draftDomain || null,
      github_url: draftGithub.trim() || null,
      stack: project?.stack ?? [],
      sdgs: project?.sdgs ?? [],
    })
    if (p) {
      setProject(p)
      const t = await getTasks(p.id)
      setTasks(t)
      setEditingProject(false)
    }
    setSaving(false)
  }

  // ── TASK OPS ─────────────────────────────────────────────────

  const handleAddTask = async (status: TaskStatus) => {
    if (!newTaskTitle.trim() || !project) return
    const task = await createTask(project.id, teamId, newTaskTitle.trim(), status)
    if (task) {
      setTasks(prev => [...prev, task])
      setNewTaskTitle("")
      setAddingTask(null)
    }
  }

  const handleMoveTask = async (task: Task, dir: "forward" | "back") => {
    const newStatus = dir === "forward" ? STATUS_NEXT[task.status] : STATUS_PREV[task.status]
    if (!newStatus) return
    // Optimistic
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    const ok = await updateTaskStatus(task.id, newStatus)
    if (!ok) {
      // Rollback
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t))
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    await deleteTask(taskId)
  }

  const tasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status)

  // ── STYLES ───────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
    borderRadius: "7px", padding: "8px 12px",
    fontFamily: "inherit", fontSize: "13px", color: "var(--sp-text)",
    outline: "none",
  }

  if (loading) {
    return (
      <div className="sp-page">
        <header className="sp-header">
          <Link href="/" className="sp-logo"><div className="sp-logo-mark">⚡</div><span className="sp-logo-name">codefest<em>.ai</em></span></Link>
          <div />
          <Link href={`/teams/${teamId}`} className="sp-hdr-link">← team</Link>
        </header>
        <main style={{ padding: "70px 2rem", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ height: "200px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "16px" }} />
        </main>
      </div>
    )
  }

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <Link href={`/teams/${teamId}`} style={{ color: "var(--sp-muted)", textDecoration: "none" }}>{team?.name}</Link>
          <span>/</span>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>project</span>
          <span>·</span>
          <span suppressHydrationWarning>{clock}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href={`/teams/${teamId}`} className="sp-hdr-link">← team</Link>
          {user ? (
            <>
              <span style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-muted)" }}>{user.email?.split("@")[0]}</span>
              <button className="sp-hdr-link" onClick={() => signOut()}>sign out</button>
            </>
          ) : (
            <Link href="/login" className="sp-hdr-link">sign in</Link>
          )}
        </div>
      </header>

      <main style={{ paddingTop: "50px", maxWidth: "1100px", margin: "0 auto", padding: "70px 1.5rem 4rem" }}>

        {/* ── PROJECT CARD ── */}
        <div style={{
          background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
          borderRadius: "14px", padding: "24px 28px", marginBottom: "24px",
        }}>
          {editingProject ? (
            /* Edit mode */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {project ? "edit project" : "set up your project"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.1em" }}>project name *</div>
                  <input style={inputStyle} value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="e.g. FoodBridge" autoFocus />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.1em" }}>github url</div>
                  <input style={inputStyle} value={draftGithub} onChange={e => setDraftGithub(e.target.value)} placeholder="https://github.com/…" />
                </div>
              </div>

              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.1em" }}>what are you building?</div>
                <textarea style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }} value={draftDesc} onChange={e => setDraftDesc(e.target.value)} placeholder="One sentence about your project…" />
              </div>

              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.1em" }}>challenge domain</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {DOMAINS.map(d => (
                    <button
                      key={d.n}
                      onClick={() => setDraftDomain(prev => prev === d.n ? "" : d.n)}
                      style={{
                        fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "4px 10px",
                        background: draftDomain === d.n ? "var(--sp-brand-dim)" : "var(--sp-surface2)",
                        border: `1px solid ${draftDomain === d.n ? "rgba(34,197,94,0.4)" : "var(--sp-border)"}`,
                        borderRadius: "6px", color: draftDomain === d.n ? "var(--sp-brand)" : "var(--sp-dim)",
                        cursor: "pointer", transition: "all 0.12s",
                      }}
                    >
                      {d.e} {d.n}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                {project && (
                  <button
                    onClick={() => { setEditingProject(false); setDraftName(project.name); setDraftDesc(project.description ?? ""); setDraftDomain(project.domain ?? ""); setDraftGithub(project.github_url ?? "") }}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "7px 14px", background: "none", border: "1px solid var(--sp-border)", borderRadius: "7px", color: "var(--sp-dim)", cursor: "pointer" }}
                  >
                    cancel
                  </button>
                )}
                <button
                  onClick={handleSaveProject}
                  disabled={!draftName.trim() || saving}
                  style={{
                    fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "7px 18px",
                    background: draftName.trim() && !saving ? "var(--sp-brand)" : "var(--sp-surface2)",
                    color: draftName.trim() && !saving ? "#000" : "var(--sp-dim)",
                    border: "none", borderRadius: "7px", fontWeight: 700,
                    cursor: draftName.trim() && !saving ? "pointer" : "not-allowed",
                  }}
                >
                  {saving ? "saving…" : project ? "save changes" : "create project →"}
                </button>
              </div>
            </div>
          ) : project ? (
            /* View mode */
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
              <div>
                {project.domain && (
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "5px" }}>
                    {DOMAINS.find(d => d.n === project.domain)?.e} {project.domain}
                  </div>
                )}
                <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>{project.name}</h1>
                {project.description && (
                  <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, maxWidth: "560px" }}>{project.description}</p>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "8px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", textDecoration: "none" }}>
                    GitHub↗
                  </a>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginBottom: "5px" }}>
                    {tasks.length} tasks · {tasksByStatus("done").length} done
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: "120px", height: "4px", background: "var(--sp-surface2)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", background: "var(--sp-brand)", borderRadius: "2px",
                      width: tasks.length ? `${(tasksByStatus("done").length / tasks.length) * 100}%` : "0%",
                      transition: "width 0.3s",
                    }} />
                  </div>
                </div>
                {isMember && (
                  <button
                    onClick={() => setEditingProject(true)}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "5px 12px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "6px", color: "var(--sp-dim)", cursor: "pointer" }}
                  >
                    edit
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* No project yet, non-member */
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--sp-muted)", fontFamily: "var(--sp-mono)", fontSize: "12px" }}>
              No project set up yet.
              {isMember && (
                <button onClick={() => setEditingProject(true)} style={{ display: "block", margin: "1rem auto 0", fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "7px 16px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "7px", fontWeight: 700, cursor: "pointer" }}>
                  + set up project
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── KANBAN BOARD ── */}
        {project && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                task board
              </div>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                click ‹ › to move tasks between columns
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", alignItems: "start" }}>
              {COLUMNS.map(col => {
                const colTasks = tasksByStatus(col.id)
                const isAdding = addingTask === col.id

                return (
                  <div key={col.id}>
                    {/* Column header */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", marginBottom: "6px",
                      background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
                      borderTop: `2px solid ${col.color}`, borderRadius: "10px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", fontWeight: 600, color: col.color }}>{col.label}</span>
                        <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", background: `${col.color}20`, color: col.color, borderRadius: "4px", padding: "1px 6px" }}>
                          {colTasks.length}
                        </span>
                      </div>
                      {isMember && (
                        <button
                          onClick={() => { setAddingTask(col.id); setNewTaskTitle("") }}
                          style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", color: "var(--sp-dim)", background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
                          title="Add task"
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Tasks */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {colTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
                            borderRadius: "9px", padding: "11px 13px",
                          }}
                        >
                          <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--sp-text)", lineHeight: 1.4, marginBottom: "8px" }}>
                            {task.title}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {/* Move buttons */}
                            <div style={{ display: "flex", gap: "3px" }}>
                              {STATUS_PREV[task.status] && (
                                <button
                                  onClick={() => handleMoveTask(task, "back")}
                                  style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "4px", padding: "2px 6px", cursor: "pointer" }}
                                  title="Move back"
                                >‹</button>
                              )}
                              {STATUS_NEXT[task.status] && (
                                <button
                                  onClick={() => handleMoveTask(task, "forward")}
                                  style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "4px", padding: "2px 6px", cursor: "pointer" }}
                                  title="Move forward"
                                >›</button>
                              )}
                            </div>
                            {/* Delete */}
                            {isMember && (
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", background: "none", border: "none", cursor: "pointer", opacity: 0.5, padding: "2px 4px" }}
                                title="Delete task"
                              >×</button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add task input */}
                      {isAdding ? (
                        <div style={{ background: "var(--sp-surface)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "9px", padding: "10px 12px" }}>
                          <input
                            style={{ ...inputStyle, fontSize: "12px", padding: "5px 8px", marginBottom: "8px" }}
                            placeholder="Task title…"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleAddTask(col.id)
                              if (e.key === "Escape") { setAddingTask(null); setNewTaskTitle("") }
                            }}
                            autoFocus
                          />
                          <div style={{ display: "flex", gap: "5px" }}>
                            <button
                              onClick={() => handleAddTask(col.id)}
                              disabled={!newTaskTitle.trim()}
                              style={{ flex: 1, fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "5px", background: newTaskTitle.trim() ? "var(--sp-brand)" : "var(--sp-surface2)", color: newTaskTitle.trim() ? "#000" : "var(--sp-dim)", border: "none", borderRadius: "5px", fontWeight: 600, cursor: newTaskTitle.trim() ? "pointer" : "not-allowed" }}
                            >
                              add
                            </button>
                            <button
                              onClick={() => { setAddingTask(null); setNewTaskTitle("") }}
                              style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "5px 8px", background: "none", border: "1px solid var(--sp-border)", borderRadius: "5px", color: "var(--sp-dim)", cursor: "pointer" }}
                            >
                              esc
                            </button>
                          </div>
                        </div>
                      ) : (
                        isMember && colTasks.length === 0 && (
                          <button
                            onClick={() => { setAddingTask(col.id); setNewTaskTitle("") }}
                            style={{
                              width: "100%", padding: "10px", background: "none",
                              border: "1px dashed var(--sp-border)", borderRadius: "9px",
                              fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)",
                              cursor: "pointer", transition: "border-color 0.15s",
                            }}
                          >
                            + add task
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l">
          <span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span>
        </div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
