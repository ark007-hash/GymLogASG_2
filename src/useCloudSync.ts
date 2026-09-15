import { useEffect, useState, useRef } from 'react';
import { auth, db, provider, signInWithPopup, signOut as fbSignOut } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export function useCloudSync(
  history: any, setHistory: any,
  currentWorkout: any, setCurrentWorkout: any,
  schedule: any, setSchedule: any,
  customPresets: any, setCustomPresets: any
) {
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        setIsSyncing(true);
        const docRef = doc(db, 'users', u.uid);
        getDoc(docRef).then(snap => {
          if (snap.exists()) {
             const data = snap.data();
             if (data.history) setHistory(data.history);
             if (data.currentWorkout !== undefined) setCurrentWorkout(data.currentWorkout);
             if (data.schedule) setSchedule(data.schedule);
             if (data.customPresets) setCustomPresets(data.customPresets);
          } else {
             // If no cloud data, push local data immediately
             setDoc(docRef, { history, currentWorkout, schedule, customPresets, updatedAt: new Date().toISOString() });
          }
          setLastSynced(new Date());
          setIsSyncing(false);
          isInitialLoad.current = false;
        }).catch(err => {
          console.error("Failed to load cloud data", err);
          setIsSyncing(false);
        });
      }
    });
    return unsubscribe;
  }, []); // Run once on mount

  // Sync to cloud on changes
  useEffect(() => {
    if (!user || isInitialLoad.current) return;
    const sync = async () => {
       setIsSyncing(true);
       try {
         await setDoc(doc(db, 'users', user.uid), {
           history,
           currentWorkout,
           schedule,
           customPresets,
           updatedAt: new Date().toISOString()
         }, { merge: true });
         setLastSynced(new Date());
       } catch (err) {
         console.error("Sync failed", err);
       }
       setIsSyncing(false);
    }
    const timeout = setTimeout(sync, 3000); // Debounce sync by 3 seconds
    return () => clearTimeout(timeout);
  }, [history, currentWorkout, schedule, customPresets, user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  
  const logout = async () => {
    await fbSignOut(auth);
    isInitialLoad.current = true; // reset for next login
  };

  return { user, login, logout, isSyncing, lastSynced };
}
