// ─────────────────────────────────────────────────────────────────────────────
// Phase 7 mock data — Messaging
//
// REMOVE THIS FILE when Phase 7 backend integration lands. Pages importing
// from here should switch to real fetch calls / WebSocket subscriptions
// against the endpoints listed in each function's [API] / [WS] comment.
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms = 250) => new Promise(r => setTimeout(r, ms));

// ─── Conversation list (inbox) ───────────────────────────────────────────────
// [API] GET /conversations?userId={id}  (sorted by lastMessageAt desc)
// [WS] Listen for 'conversation:updated' to bump conversation to top
export const getConversations = async () => {
  await sleep();
  return [
    { id: 1, name: 'Gabriel A. Gordon-Mensah', avatar: null, lastMessage: 'Hey, how are you doing today?',        time: '10:30 AM',   unreadCount: 3, online: true,  pinned: true,  muted: false, archived: false, isOutgoing: false, status: null   },
    { id: 2, name: 'Sarah Johnson',            avatar: null, lastMessage: 'Thanks for your help earlier!',         time: 'Yesterday',  unreadCount: 0, online: false, pinned: false, muted: false, archived: false, isOutgoing: true,  status: 'read' },
    { id: 3, name: 'Michael Chen',             avatar: null, lastMessage: 'Can we meet tomorrow at 3pm?',          time: 'Yesterday',  unreadCount: 1, online: true,  pinned: false, muted: false, archived: false, isOutgoing: false, status: null   },
    { id: 4, name: 'Project Team',             avatar: null, lastMessage: 'Meeting scheduled for next week',       time: '2 days ago', unreadCount: 0, online: false, pinned: true,  muted: true,  archived: false, isOutgoing: false, status: null   },
    { id: 5, name: 'Emma Wilson',              avatar: null, lastMessage: 'Got it, will get back to you soon.',    time: '3 days ago', unreadCount: 0, online: false, pinned: false, muted: false, archived: false, isOutgoing: true,  status: 'delivered' },
    { id: 6, name: 'David Brown',              avatar: null, lastMessage: 'Great work on the project!',            time: '1 week ago', unreadCount: 0, online: false, pinned: false, muted: false, archived: true,  isOutgoing: false, status: null   },
  ];
};

// ─── Messages in a single thread ─────────────────────────────────────────────
// [API] GET /conversations/:id/messages?page={n}  (paginated, newest last)
// [WS] Subscribe to ws://…/conversations/:id for new message events
export const getMessagesForConversation = async (_conversationId) => {
  await sleep();
  return [
    { id: 1, text: 'Hey There!',                          sender: 'other', time: 'Today, 8:30pm', type: 'text' },
    { id: 2, text: 'How are you?',                        sender: 'other', time: 'Today, 8:30pm', type: 'text' },
    { id: 3, text: 'Hello!',                              sender: 'user',  time: 'Today, 8:33pm', type: 'text' },
    { id: 4, text: 'I am fine and how are you?',          sender: 'user',  time: 'Today, 8:34pm', type: 'text' },
    { id: 5, text: 'I am doing well, Can we meet tomorrow?', sender: 'other', time: 'Today, 8:36pm', type: 'text' },
    { id: 6, text: 'Yes Sure!',                           sender: 'user',  time: 'Today, 8:58pm', type: 'text' },
    { id: 7, text: 'Are you there?',                      sender: 'user',  time: 'Today, 9:02pm', type: 'text' },
    { id: 8, text: 'Hey',                                 sender: 'user',  time: 'Today, 9:05pm', type: 'text' },
  ];
};
