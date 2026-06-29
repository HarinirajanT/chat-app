const DB_KEY = 'harini_chat_demo_v1';

const SEED_USERS = [
  {
    _id: 'user-alice',
    fullName: 'Alice Kumar',
    username: 'alice',
    password: 'demo123',
    gender: 'female',
    profilePic: 'https://avatar.iran.liara.run/public/girl?username=alice',
  },
  {
    _id: 'user-bob',
    fullName: 'Bob Sharma',
    username: 'bob',
    password: 'demo123',
    gender: 'male',
    profilePic: 'https://avatar.iran.liara.run/public/boy?username=bob',
  },
  {
    _id: 'user-charlie',
    fullName: 'Charlie Menon',
    username: 'charlie',
    password: 'demo123',
    gender: 'male',
    profilePic: 'https://avatar.iran.liara.run/public/boy?username=charlie',
  },
];

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const db = { users: [...SEED_USERS], messages: [] };
  saveDb(db);
  return db;
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function currentUser() {
  return JSON.parse(localStorage.getItem('chat-user') || 'null');
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function demoFetch(path, options = {}) {
  await delay();
  const db = loadDb();
  const user = currentUser();
  const method = (options.method || 'GET').toUpperCase();

  if (path === '/api/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const match = db.users.find(
      (u) => u.username === body.username && u.password === body.password
    );
    if (!match) throw new Error('Invalid username or password');
    return publicUser(match);
  }

  if (path === '/api/auth/signup' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    if (db.users.some((u) => u.username === body.username)) {
      throw new Error('Username already exists');
    }
    const newUser = {
      _id: `user-${Date.now()}`,
      fullName: body.fullName,
      username: body.username,
      password: body.password,
      gender: body.gender,
      profilePic: `https://avatar.iran.liara.run/public/${body.gender === 'female' ? 'girl' : 'boy'}?username=${body.username}`,
    };
    db.users.push(newUser);
    saveDb(db);
    return publicUser(newUser);
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    return { message: 'Logged out' };
  }

  if (path === '/api/users' && method === 'GET') {
    if (!user) throw new Error('Not authorized');
    return db.users.filter((u) => u._id !== user._id).map(publicUser);
  }

  const messagesMatch = path.match(/^\/api\/messages\/([^/]+)$/);
  if (messagesMatch && method === 'GET') {
    if (!user) throw new Error('Not authorized');
    const otherId = messagesMatch[1];
    return db.messages.filter(
      (m) =>
        (m.senderId === user._id && m.receiverId === otherId) ||
        (m.senderId === otherId && m.receiverId === user._id)
    );
  }

  const sendMatch = path.match(/^\/api\/messages\/send\/([^/]+)$/);
  if (sendMatch && method === 'POST') {
    if (!user) throw new Error('Not authorized');
    const body = JSON.parse(options.body || '{}');
    const newMessage = {
      _id: `msg-${Date.now()}`,
      senderId: user._id,
      receiverId: sendMatch[1],
      message: body.message,
      createdAt: new Date().toISOString(),
    };
    db.messages.push(newMessage);
    saveDb(db);
    window.dispatchEvent(new CustomEvent('demo-new-message', { detail: newMessage }));
    return newMessage;
  }

  throw new Error(`Demo API: unhandled ${method} ${path}`);
}

export function createDemoSocket(userId) {
  const listeners = new Map();

  const handler = (event) => {
    const msg = event.detail;
    if (msg.receiverId === userId) {
      listeners.get('newMessage')?.forEach((cb) => cb(msg));
    }
  };

  window.addEventListener('demo-new-message', handler);

  return {
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
      if (event === 'getOnlineUsers') {
        setTimeout(() => cb(['user-alice', 'user-bob', 'user-charlie']), 100);
      }
    },
    off(event, cb) {
      listeners.get(event)?.delete(cb);
    },
    close() {
      window.removeEventListener('demo-new-message', handler);
      listeners.clear();
    },
  };
}
