import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface GroupMember {
  userId: string;
  name: string;
  count: number;
  lastUpdated: number;
}

export interface GroupData {
  id: string;
  name: string;
  targetCount: number;
  members: Record<string, Omit<GroupMember, 'userId'>>;
}

// Local storage fallback key
const MOCK_GROUP_KEY = 'tasbeehly_mock_group';

export async function createGroup(groupName: string, creatorName: string, creatorId: string): Promise<string> {
  const groupId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const groupData: GroupData = {
    id: groupId,
    name: groupName,
    targetCount: 10000,
    members: {
      [creatorId]: {
        name: creatorName,
        count: 0,
        lastUpdated: Date.now()
      }
    }
  };

  try {
    const groupRef = doc(db, 'groups', groupId);
    await setDoc(groupRef, groupData);
  } catch (e) {
    console.warn('Firestore failed, writing group to local storage mock:', e);
    localStorage.setItem(MOCK_GROUP_KEY, JSON.stringify(groupData));
  }

  return groupId;
}

export async function joinGroup(groupId: string, memberName: string, memberId: string): Promise<GroupData | null> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const snap = await getDoc(groupRef);
    
    if (snap.exists()) {
      const data = snap.data() as GroupData;
      data.members[memberId] = {
        name: memberName,
        count: 0,
        lastUpdated: Date.now()
      };
      await setDoc(groupRef, data);
      return data;
    }
  } catch (e) {
    console.warn('Firestore join failed, looking up in local mock:', e);
    const saved = localStorage.getItem(MOCK_GROUP_KEY);
    if (saved) {
      const data = JSON.parse(saved) as GroupData;
      if (data.id === groupId) {
        data.members[memberId] = {
          name: memberName,
          count: 0,
          lastUpdated: Date.now()
        };
        localStorage.setItem(MOCK_GROUP_KEY, JSON.stringify(data));
        return data;
      }
    }
  }
  return null;
}

export async function updateGroupMemberCount(groupId: string, memberId: string, count: number) {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const snap = await getDoc(groupRef);
    if (snap.exists()) {
      const data = snap.data() as GroupData;
      if (data.members[memberId]) {
        data.members[memberId].count = count;
        data.members[memberId].lastUpdated = Date.now();
        await updateDoc(groupRef, {
          [`members.${memberId}`]: data.members[memberId]
        });
      }
    }
  } catch (e) {
    console.warn('Firestore update count failed, updating in local mock:', e);
    const saved = localStorage.getItem(MOCK_GROUP_KEY);
    if (saved) {
      const data = JSON.parse(saved) as GroupData;
      if (data.id === groupId && data.members[memberId]) {
        data.members[memberId].count = count;
        data.members[memberId].lastUpdated = Date.now();
        localStorage.setItem(MOCK_GROUP_KEY, JSON.stringify(data));
      }
    }
  }
}

export function subscribeToGroup(groupId: string, onUpdate: (data: GroupData) => void, onError: (err: any) => void) {
  try {
    const groupRef = doc(db, 'groups', groupId);
    return onSnapshot(groupRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as GroupData);
      }
    }, onError);
  } catch (e) {
    console.warn('Firestore subscribe failed, using polling fallback on local mock');
    const interval = setInterval(() => {
      const saved = localStorage.getItem(MOCK_GROUP_KEY);
      if (saved) {
        const data = JSON.parse(saved) as GroupData;
        if (data.id === groupId) {
          onUpdate(data);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }
}
