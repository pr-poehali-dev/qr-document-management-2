import { RegisteredUser } from '@/types/users';

const STORAGE_KEY = 'qr_system_users';
const NIKITOVSKY_BLOCK_KEY = 'nikitovsky_block_until';

export const getRegisteredUsers = (): RegisteredUser[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const nikitovsky: RegisteredUser = {
      id: 'nikitovsky-master',
      name: 'Никитовский',
      role: 'nikitovsky',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([nikitovsky]));
    return [nikitovsky];
  }
  return JSON.parse(data);
};

export const saveUser = (user: RegisteredUser): void => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const findUserByName = (name: string): RegisteredUser | undefined => {
  const users = getRegisteredUsers();
  return users.find(u => u.name.toLowerCase() === name.toLowerCase());
};

export const getAllUsersByRole = (role: string): RegisteredUser[] => {
  const users = getRegisteredUsers();
  return users.filter(u => u.role === role);
};

export const setNikirovskyBlock = (): void => {
  const blockUntil = Date.now() + 2 * 60 * 60 * 1000;
  localStorage.setItem(NIKITOVSKY_BLOCK_KEY, blockUntil.toString());
};

export const getNikirovskyBlockTime = (): number | null => {
  const blockUntil = localStorage.getItem(NIKITOVSKY_BLOCK_KEY);
  if (!blockUntil) return null;
  const time = parseInt(blockUntil);
  if (Date.now() > time) {
    localStorage.removeItem(NIKITOVSKY_BLOCK_KEY);
    return null;
  }
  return time;
};

export const clearNikirovskyBlock = (password: string): boolean => {
  if (password === '2025') {
    localStorage.removeItem(NIKITOVSKY_BLOCK_KEY);
    return true;
  }
  return false;
};
