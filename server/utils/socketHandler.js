const SeatHold = require('../models/SeatHold');

let ioInstance = null;

function setupSocketIO(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Client joins a specific show room to receive real-time updates for that show
    socket.on('join_show', ({ showId }) => {
      if (showId) {
        socket.join(`show:${showId}`);
      }
    });

    socket.on('leave_show', ({ showId }) => {
      if (showId) {
        socket.leave(`show:${showId}`);
      }
    });

    // Client requests temporary seat hold while in seat selection/checkout
    socket.on('seat_hold_request', async ({ showId, seats, userOrSessionId }) => {
      try {
        if (!showId || !Array.isArray(seats) || seats.length === 0) return;

        // Broadcast to all other clients viewing the same show
        socket.to(`show:${showId}`).emit('seats_held', {
          showId,
          seats,
          userOrSessionId
        });
      } catch (err) {
        console.error('Socket seat_hold_request error:', err.message);
      }
    });

    // Client releases seats (e.g. deselected or navigated away)
    socket.on('seat_release_request', async ({ showId, seats, userOrSessionId }) => {
      try {
        if (!showId || !Array.isArray(seats)) return;

        socket.to(`show:${showId}`).emit('seats_released', {
          showId,
          seats,
          userOrSessionId
        });
      } catch (err) {
        console.error('Socket seat_release_request error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      // Disconnection cleanup handled gracefully
    });
  });

  return io;
}

function broadcastBookingUpdate(showId, bookedSeats) {
  if (ioInstance && showId) {
    ioInstance.to(`show:${showId}`).emit('seats_confirmed', {
      showId,
      bookedSeats
    });
  }
}

function broadcastCancellationUpdate(showId, releasedSeats) {
  if (ioInstance && showId) {
    ioInstance.to(`show:${showId}`).emit('seats_restored', {
      showId,
      releasedSeats
    });
  }
}

module.exports = {
  setupSocketIO,
  broadcastBookingUpdate,
  broadcastCancellationUpdate
};
