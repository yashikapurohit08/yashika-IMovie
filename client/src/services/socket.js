import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Connected to live seat server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [Socket.IO] Disconnected from server');
    });
  }
  return socket;
}

export function joinShowRoom(showId) {
  const s = getSocket();
  if (s && showId) {
    s.emit('join_show', { showId });
  }
}

export function leaveShowRoom(showId) {
  const s = getSocket();
  if (s && showId) {
    s.emit('leave_show', { showId });
  }
}

export function emitSeatHold(showId, seats, userOrSessionId) {
  const s = getSocket();
  if (s) {
    s.emit('seat_hold_request', { showId, seats, userOrSessionId });
  }
}

export function emitSeatRelease(showId, seats, userOrSessionId) {
  const s = getSocket();
  if (s) {
    s.emit('seat_release_request', { showId, seats, userOrSessionId });
  }
}
