import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Minus, Plus, Check, X, ChevronDown, ChevronUp, Timer, Pencil, MessageSquare } from 'lucide-react';
import { ExerciseDef, LoggedSet, ExerciseType } from './types';

export function RestTimer({ 
  defaultTime = 90, 
  soundEnabled = true, 
  vibrateEnabled = true,
  timerStyle = 'banner'
}: { 
  defaultTime?: number, 
  soundEnabled?: boolean, 
  vibrateEnabled?: boolean,
  timerStyle?: 'compact' | 'banner' | 'current' | 'classic'
}) {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isActive, setIsActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const alarmIntervalRef = useRef<any>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setShowNotification(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (showNotification) {
      const playAlarm = () => {
        if (soundEnabled) {
          try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
              const ctx = new AudioContext();
              const playBeep = (timeOffset: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime + timeOffset);
                
                gain.gain.setValueAtTime(0, ctx.currentTime + timeOffset);
                gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + timeOffset + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.4);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(ctx.currentTime + timeOffset);
                osc.stop(ctx.currentTime + timeOffset + 0.5);
              };

              playBeep(0);
              playBeep(0.15);
            }
          } catch (e) {
            console.warn('Audio not supported', e);
          }
        }
        
        if (vibrateEnabled && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      };

      playAlarm();
      alarmIntervalRef.current = setInterval(playAlarm, 2000);
    } else {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }
    }
    
    return () => {
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    };
  }, [showNotification, soundEnabled, vibrateEnabled]);

  const dismissAlarm = () => {
    setShowNotification(false);
    setTimeLeft(defaultTime);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isBanner = timerStyle === 'banner' || timerStyle === 'classic';

  if (isBanner) {
    if (isCollapsed) {
      return (
        <div className="w-full bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 px-4 py-2 z-40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Timer size={15} className={isActive ? "text-blue-500 animate-pulse" : "text-neutral-500"} />
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Rest</span>
            <span className={`font-mono text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-neutral-300'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={() => setIsCollapsed(false)} 
            className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center"
            title="Expand Timer"
            aria-label="Expand Timer"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      );
    }

    return (
      <div className="w-full bg-[#171717]/95 backdrop-blur-md border-t border-neutral-800 px-4 py-3 rounded-t-2xl z-40 flex items-center justify-between shadow-2xl">
        {showNotification ? (
          <div className="flex items-center justify-between w-full text-emerald-400 font-bold animate-pulse px-1">
            <span className="text-sm font-black">Rest complete!</span>
            <button onClick={dismissAlarm} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg transition-colors">
              Dismiss
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTimeLeft(t => Math.max(15, t - 15))}
                className="p-1 text-neutral-400 hover:text-white transition-colors active:scale-95 text-lg font-bold"
                title="-15s"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight min-w-[62px] text-center select-none">
                {formatTime(timeLeft)}
              </span>
              <button 
                onClick={() => setTimeLeft(t => t + 15)}
                className="p-1 text-neutral-400 hover:text-white transition-colors active:scale-95 text-lg font-bold"
                title="+15s"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
              <div className="flex flex-col text-[10px] font-black uppercase tracking-wider text-sky-400 leading-tight select-none ml-1">
                <span>REST</span>
                <span>TIMER</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => setIsActive(!isActive)}
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                title={isActive ? 'Pause' : 'Start'}
              >
                {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
              </button>
              <button
                onClick={() => { setIsActive(false); setShowNotification(false); setTimeLeft(defaultTime); }}
                className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
                title="Reset Timer"
              >
                <RotateCcw size={19} strokeWidth={2.2} />
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Minimize Timer"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 px-4 py-2 z-40 flex items-center justify-between text-xs font-medium">
      {showNotification ? (
        <div className="flex items-center justify-between w-full text-emerald-400 font-bold animate-pulse">
          <span>Rest complete!</span>
          <button onClick={dismissAlarm} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
            Dismiss
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Timer size={15} className={isActive ? "text-blue-500 animate-pulse" : "text-neutral-500"} />
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Rest</span>
            <span className={`font-mono text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-neutral-300'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && (
              <button 
                onClick={() => setTimeLeft(t => Math.max(15, t - 15))}
                className="text-neutral-500 hover:text-white px-1.5 py-1 rounded font-mono text-[10px]"
              >
                -15s
              </button>
            )}
            {!isActive && (
              <button 
                onClick={() => setTimeLeft(t => t + 15)}
                className="text-neutral-500 hover:text-white px-1.5 py-1 rounded font-mono text-[10px]"
              >
                +15s
              </button>
            )}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-2 rounded-lg font-bold flex items-center justify-center transition-colors ${
                isActive 
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                  : 'border border-blue-500 text-blue-400 hover:bg-blue-500/10 shadow-sm'
              }`}
              title={isActive ? 'Pause' : 'Start'}
            >
              {isActive ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              onClick={() => { setIsActive(false); setShowNotification(false); setTimeLeft(defaultTime); }}
              className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface ExerciseCardProps {
  key?: string | number;
  exercise: ExerciseDef;
  sessionData: LoggedSet[];
  previousData: LoggedSet[] | null;
  onUpdateSet: (index: number, set: LoggedSet) => void;
  onUpdateAllSets?: (sets: LoggedSet[]) => void;
  readOnly?: boolean;
  enableWarmup?: boolean;
  exerciseNote?: string;
  onUpdateExerciseNote?: (note: string) => void;
  onUpdateExerciseDef?: (updated: ExerciseDef) => void;
}

export function ExerciseCard({ exercise, sessionData, previousData, onUpdateSet, onUpdateAllSets, readOnly, enableWarmup, exerciseNote, onUpdateExerciseNote, onUpdateExerciseDef }: ExerciseCardProps) {
  const [showNoteBox, setShowNoteBox] = useState(Boolean(exerciseNote));
  const [isEditingDef, setIsEditingDef] = useState(false);
  const [editName, setEditName] = useState(exercise.name);
  const [editSets, setEditSets] = useState(exercise.sets);
  const [editTarget, setEditTarget] = useState(exercise.target);
  const [editType, setEditType] = useState<ExerciseType>(exercise.type);

  // Ensure we have enough sets initialized, accounting for warm-ups and target sets
  const numTargetSets = exercise.sets;
  const numWarmupSets = sessionData.filter(s => s?.isWarmup).length;
  const totalExpectedSets = numTargetSets + numWarmupSets;
  
  const sets = Array.from({ length: Math.max(sessionData.length, totalExpectedSets) }, (_, i) => {
    return sessionData[i] || { weight: '', reps: '', duration: '', completed: false };
  });

  const handleAddWarmup = () => {
    if (!onUpdateAllSets) return;
    const newSets = [...sets];
    const firstWorkingSetIdx = newSets.findIndex(s => !s.isWarmup);
    const insertIdx = firstWorkingSetIdx === -1 ? newSets.length : firstWorkingSetIdx;
    
    newSets.splice(insertIdx, 0, { weight: '', reps: '', duration: '', completed: false, isWarmup: true });
    onUpdateAllSets(newSets);
  };
  
  const handleRemoveSet = (index: number) => {
    if (!onUpdateAllSets || readOnly) return;
    const newSets = sets.filter((_, i) => i !== index);
    onUpdateAllSets(newSets);
  };

  const allCompleted = sets.length > 0 && sets.every(s => s.completed);

  return (
    <div className="mb-8 pb-8 border-b border-neutral-800 last:border-b-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 mr-2">
          {isEditingDef ? (
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl space-y-3 mb-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm outline-none font-bold"
                placeholder="Exercise Name"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Sets</label>
                  <input
                    type="number"
                    value={editSets}
                    onChange={e => setEditSets(parseInt(e.target.value) || 1)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block mb-1">Target</label>
                  <input
                    type="text"
                    value={editTarget}
                    onChange={e => setEditTarget(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm outline-none"
                    placeholder="e.g. 10 reps"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 uppercase block mb-1">Type</label>
                <select
                  value={editType}
                  onChange={e => setEditType(e.target.value as ExerciseType)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm outline-none"
                >
                  <option value="resistance">Weight</option>
                  <option value="bodyweight">Bodyweight</option>
                  <option value="duration">Time</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingDef(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateExerciseDef?.({
                      name: editName.trim() || exercise.name,
                      sets: editSets,
                      target: editTarget,
                      type: editType
                    });
                    setIsEditingDef(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-xl text-white tracking-tight">{exercise.name}</h3>
              {!readOnly && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsEditingDef(true)}
                    className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
                    title="Edit Exercise"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setShowNoteBox(!showNoteBox)}
                    className={`p-1.5 rounded-lg border transition-colors ${showNoteBox ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-800'}`}
                    title="Toggle Exercise Note"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {enableWarmup && !readOnly && (
            <button onClick={handleAddWarmup} className="text-[11px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-800 transition-colors font-bold uppercase tracking-wider flex items-center gap-1">
              <Plus size={12} /> Warm-up
            </button>
          )}
          <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg">
            {exercise.sets} sets × {exercise.target}
          </span>
        </div>
      </div>

      <div className="text-xs text-neutral-400 mb-4">
        <div className="text-neutral-500 font-medium mb-1">Last time:</div>
        {previousData ? (
          <div className="text-neutral-300">
            {previousData.filter(s => !s.isWarmup).map((s, i) => {
              return (
              <span key={i} className="mr-3 inline-block">
                {i+1}: {exercise.type === 'bodyweight' ? (
                  <strong className="text-white">{s.reps || '0'} reps</strong>
                ) : (
                  <><strong className="text-white">{s.weight || '0'} kg</strong> × {s.reps || '0'}</>
                )}
              </span>
            )})}
          </div>
        ) : (
          <div className="text-neutral-500 italic">No previous log</div>
        )}
      </div>

      <div className="space-y-4">
        {sets.map((set, i) => {
          let workingSetNum = 0;
          for (let j = 0; j <= i; j++) {
            if (!sets[j].isWarmup) workingSetNum++;
          }
          
          return (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className={`font-bold text-[11px] uppercase tracking-wider ${set.isWarmup ? 'text-orange-500' : 'text-neutral-500'}`}>
                {set.isWarmup ? 'Warm-up' : `Set ${workingSetNum}`}
              </div>
              {set.isWarmup && !readOnly && !set.completed && (
                <button onClick={() => handleRemoveSet(i)} className="text-red-500 hover:text-red-400 p-1">
                  <Minus size={14} />
                </button>
              )}
            </div>
            
            {exercise.type === 'resistance' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl focus-within:border-neutral-600 transition-colors">
                  <input
                    type="number"
                    inputMode="decimal"
                    disabled={readOnly || set.completed}
                    value={set.weight}
                    onChange={e => onUpdateSet(i, { ...set, weight: e.target.value })}
                    className="w-full bg-transparent p-3 text-white font-semibold text-base outline-none pr-8 placeholder:text-neutral-600 disabled:opacity-50"
                    placeholder="Weight"
                  />
                  <span className="absolute right-3 text-neutral-500 text-sm font-medium">kg</span>
                </div>
                <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl focus-within:border-neutral-600 transition-colors">
                  <input
                    type="number"
                    inputMode="numeric"
                    disabled={readOnly || set.completed}
                    value={set.reps}
                    onChange={e => onUpdateSet(i, { ...set, reps: e.target.value })}
                    className="w-full bg-transparent p-3 text-white font-semibold text-base outline-none placeholder:text-neutral-600 disabled:opacity-50"
                    placeholder="Reps"
                  />
                </div>
              </div>
            ) : exercise.type === 'bodyweight' ? (
              <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl focus-within:border-neutral-600 transition-colors">
                <input
                  type="number"
                  inputMode="numeric"
                  disabled={readOnly || set.completed}
                  value={set.reps}
                  onChange={e => onUpdateSet(i, { ...set, reps: e.target.value })}
                  className="w-full bg-neutral-900 p-3 text-white font-semibold text-base outline-none pr-12 placeholder:text-neutral-600 disabled:opacity-50"
                  placeholder="Reps"
                />
                <span className="absolute right-3 text-neutral-500 text-sm font-medium">reps</span>
              </div>
            ) : exercise.type === 'cardio' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    disabled={readOnly || set.completed}
                    value={set.duration}
                    onChange={e => onUpdateSet(i, { ...set, duration: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white font-semibold text-base outline-none placeholder:text-neutral-600 disabled:opacity-50"
                    placeholder="Duration e.g. 20m"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    disabled={readOnly || set.completed}
                    value={set.distance || ''}
                    onChange={e => onUpdateSet(i, { ...set, distance: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white font-semibold text-base outline-none placeholder:text-neutral-600 disabled:opacity-50"
                    placeholder="Distance e.g. 3km"
                  />
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  disabled={readOnly || set.completed}
                  value={set.duration}
                  onChange={e => onUpdateSet(i, { ...set, duration: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white font-semibold text-base outline-none placeholder:text-neutral-600 disabled:opacity-50"
                  placeholder="Duration / Time"
                />
              </div>
            )}
          </div>
          );
        })}
      </div>
      
      {showNoteBox && (
        <div className="mt-4">
          <input
            type="text"
            autoFocus
            disabled={readOnly}
            value={exerciseNote || ''}
            onChange={e => onUpdateExerciseNote?.(e.target.value)}
            onBlur={() => {
              if (!exerciseNote || exerciseNote.trim() === '') {
                setShowNoteBox(false);
              }
            }}
            placeholder="Add exercise note (e.g. form felt great, increase weight next time)..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-700 transition-colors disabled:opacity-50"
          />
        </div>
      )}
      
      {!readOnly && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              const checked = !allCompleted;
              if (onUpdateAllSets) {
                onUpdateAllSets(sets.map(s => ({ ...s, completed: checked })));
              } else {
                sets.forEach((set, i) => onUpdateSet(i, { ...set, completed: checked }));
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              allCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${allCompleted ? 'bg-white text-emerald-600' : 'bg-neutral-800 text-transparent'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
            <span>Completed</span>
          </button>
        </div>
      )}
    </div>
  );
}

