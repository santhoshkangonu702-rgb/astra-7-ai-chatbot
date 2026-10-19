import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Bell,
  BellRing,
  Sparkles,
  Loader2,
  Trash2,
  CheckSquare,
  Square,
  Sliders,
  Flag
} from 'lucide-react';
import { api } from '../../services/api';

interface Milestone {
  day: number;
  title: string;
  description: string;
}

interface ScheduleBlock {
  dayRange: string;
  focus: string;
  tasks: string[];
}

interface PlanTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  targetDay: number;
  completed: boolean;
}

interface Reminder {
  id: string;
  title: string;
  type: 'task' | 'deadline' | 'study' | 'milestone';
  time: string;
  recurring: 'none' | 'daily' | 'weekly';
  active: boolean;
}

export const SmartPlannerPower: React.FC = () => {
  const [goalPrompt, setGoalPrompt] = useState('');
  const [timeframeDays, setTimeframeDays] = useState(20);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planResult, setPlanResult] = useState<{
    projectGoal: string;
    timeframeDays: number;
    milestones: Milestone[];
    dailySchedule: ScheduleBlock[];
    taskList: PlanTask[];
    estimatedSuccessRate: number;
  } | null>(null);

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 'rem-1',
      title: 'Review Project Architecture & Specs',
      type: 'deadline',
      time: 'Tomorrow, 10:00 AM',
      recurring: 'none',
      active: true
    },
    {
      id: 'rem-2',
      title: 'Daily 30-min Deep Study Session',
      type: 'study',
      time: 'Every day at 7:00 PM',
      recurring: 'daily',
      active: true
    }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderType, setNewReminderType] = useState<Reminder['type']>('task');
  const [newReminderRecurring, setNewReminderRecurring] = useState<Reminder['recurring']>('none');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const sampleGoals = [
    { text: 'Complete my Final Year Computer Science Project in 20 days', days: 20 },
    { text: 'Prepare for GRE Quantitative & Verbal sections in 45 days', days: 45 },
    { text: 'Launch my e-commerce brand and first 5 products in 15 days', days: 15 },
    { text: 'Write and publish my research paper draft in 30 days', days: 30 }
  ];

  const handleGeneratePlan = async (promptToUse: string, daysToUse: number) => {
    const p = promptToUse.trim();
    if (!p) return;
    setIsPlanning(true);
    try {
      const data = await api.generateSmartPlan(p, daysToUse);
      setPlanResult(data);
    } catch (err) {
      console.error('Smart planner error:', err);
    } finally {
      setIsPlanning(false);
    }
  };

  const toggleTask = (taskId: string) => {
    if (!planResult) return;
    setPlanResult({
      ...planResult,
      taskList: planResult.taskList.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    });
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      setNotificationMsg('Browser notifications are not supported in this environment; fallback in-app alerts are active.');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      setNotificationMsg('Smart notifications enabled! You will receive timely deadline alerts.');
    } else {
      setNotificationMsg('Permission denied; in-app notification alerts will be used as a graceful fallback.');
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    const item: Reminder = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle.trim(),
      type: newReminderType,
      time: 'Scheduled in Astra Reminders',
      recurring: newReminderRecurring,
      active: true
    };
    setReminders([item, ...reminders]);
    setNewReminderTitle('');

    // If notification permission is granted, dispatch test notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('Astra Reminder Created', {
          body: item.title,
          icon: '/icon.png'
        });
      } catch (e) {
        // ignore in-iframe restriction
      }
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Astra Smart Planner & Reminders
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30">
                Timeline & Alerts
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Transform target deadlines into structured milestones, daily schedules, and active reminders.
            </p>
          </div>
        </div>

        {/* Notification Permission Banner */}
        <button
          onClick={requestNotificationPermission}
          className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell className="w-3.5 h-3.5 text-violet-500" />
          <span>{notificationPermission === 'granted' ? 'Alerts Active' : 'Enable System Alerts'}</span>
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-xs text-violet-700 dark:text-violet-300 flex items-center justify-between">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Goal & Days Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Enter Your Project Goal & Target Timeframe
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={goalPrompt}
            onChange={e => setGoalPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGeneratePlan(goalPrompt, timeframeDays)}
            placeholder="e.g. I need to complete my research project, launch my portfolio, or prepare for exams..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap font-medium">Days:</span>
            <input
              type="number"
              min={1}
              max={365}
              value={timeframeDays}
              onChange={e => setTimeframeDays(Number(e.target.value) || 20)}
              className="w-20 px-3 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <button
            onClick={() => handleGeneratePlan(goalPrompt, timeframeDays)}
            disabled={isPlanning || !goalPrompt.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isPlanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Schedule</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Goal Presets */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-slate-400 py-1 font-medium">Try:</span>
          {sampleGoals.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoalPrompt(sample.text);
                setTimeframeDays(sample.days);
                handleGeneratePlan(sample.text, sample.days);
              }}
              className="text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors truncate max-w-[280px]"
            >
              {sample.text}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Results */}
      {planResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Metric Header */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-slate-400">Target Timeline</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {planResult.projectGoal} ({planResult.timeframeDays} Days)
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                🎯 {planResult.estimatedSuccessRate}% Estimated Feasibility
              </span>
              <span className="text-slate-500">
                {planResult.taskList.filter(t => t.completed).length}/{planResult.taskList.length} Tasks Done
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Flag className="w-4 h-4 text-violet-500" />
                <span>Target Milestones</span>
              </h3>
              <div className="space-y-3">
                {planResult.milestones.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-3">
                    <div className="px-2.5 py-1 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs shrink-0 font-mono">
                      Day {m.day}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Schedule Phases */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Phase Breakdown</span>
              </h3>
              <div className="space-y-3">
                {planResult.dailySchedule.map((block, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                        {block.dayRange}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {block.focus}
                      </span>
                    </div>
                    <ul className="space-y-1 pl-1">
                      {block.tasks.map((t, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-violet-400" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Actionable Task List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Project Task Checklist</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planResult.taskList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 line-through opacity-70'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-violet-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400">
                      Day {task.targetDay}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      task.priority === 'high'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Reminders Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-violet-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Reminders
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {reminders.length} Active Reminders
          </span>
        </div>

        {/* Add Reminder Form */}
        <form onSubmit={handleAddReminder} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newReminderTitle}
            onChange={e => setNewReminderTitle(e.target.value)}
            placeholder="Add reminder (e.g. Study calculus at 6 PM, Review code PR)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-400 font-medium"
          />
          <select
            value={newReminderType}
            onChange={e => setNewReminderType(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="task">Task</option>
            <option value="deadline">Deadline</option>
            <option value="study">Study Session</option>
            <option value="milestone">Milestone</option>
          </select>
          <select
            value={newReminderRecurring}
            onChange={e => setNewReminderRecurring(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button
            type="submit"
            disabled={!newReminderTitle.trim()}
            className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Reminder</span>
          </button>
        </form>

        {/* Reminder List */}
        <div className="space-y-2">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {rem.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="capitalize">{rem.type}</span>
                    <span>•</span>
                    <span>{rem.time}</span>
                    {rem.recurring !== 'none' && (
                      <>
                        <span>•</span>
                        <span className="text-violet-500 font-medium capitalize">{rem.recurring}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Delete Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
