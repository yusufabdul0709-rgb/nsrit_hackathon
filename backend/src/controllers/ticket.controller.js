const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const BASE_FARE = 5.0;
const RATE_PER_KM = 2.0;

const bookTicket = async (req, res) => {
  try {
    const { routeId, startStop, endStop, distanceKm } = req.body;

    if (!routeId || !startStop || !endStop || !distanceKm) {
      return res.status(400).json({ message: 'Missing required booking parameters' });
    }

    // Distance-based fare calculation
    const fare = BASE_FARE + (distanceKm * RATE_PER_KM);

    // Fetch user to check balance
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Insufficient balance check - returning a specific status for UI to trigger topup animation
    if (user.balance < fare) {
      return res.status(402).json({ 
        message: 'Insufficient balance', 
        required: fare,
        currentBalance: user.balance,
        shortfall: fare - user.balance
      });
    }

    // Proceed with booking (Transaction to ensure atomicity)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct balance
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: fare } }
      });

      // 2. Generate unique QR Data payload
      const qrData = crypto.randomBytes(16).toString('hex');

      // 3. In a real scenario, we would link this to a specific Trip ID. 
      // For the hackathon, if route/trip doesn't exist, we can mock it or require the DB to have it.
      // Assuming a generic trip (ID 1) exists for the given route, or we create a dummy one.
      
      let trip = await tx.trip.findFirst({ where: { routeId } });
      
      if (!trip) {
        // Mock fallback if DB is empty for this route to avoid P2003 Foreign Key Constraint error
        // 1. Ensure a Dummy Route exists
        let route = await tx.route.findUnique({ where: { id: routeId } });
        if (!route) {
          route = await tx.route.create({
            data: {
              id: routeId, // Use the provided routeId
              name: `${startStop} to ${endStop}`,
              startStop,
              endStop
            }
          });
        }
        
        // 2. Ensure a Dummy Vehicle exists
        const dummyVehicleId = "60c72b2f9b1d8b001c8e4a50"; // Use a valid MongoDB ObjectId format
        let vehicle = await tx.vehicle.findUnique({ where: { id: dummyVehicleId } });
        if (!vehicle) {
          vehicle = await tx.vehicle.create({
            data: {
              id: dummyVehicleId,
              busNumber: "AP 31 TB 4567",
              capacity: 50
            }
          });
        }

        // 3. Create the Trip
        trip = await tx.trip.create({
          data: {
            routeId: route.id,
            vehicleId: vehicle.id,
            status: "SCHEDULED"
          }
        });
      }

      // 4. Create Ticket
      const ticket = await tx.ticket.create({
        data: {
          userId: user.id,
          tripId: trip.id,
          amount: fare,
          qrData: qrData,
          status: "VALID"
        },
        include: {
          trip: {
            include: { route: true, vehicle: true }
          }
        }
      });

      return { ticket, newBalance: updatedUser.balance };
    });

    res.status(201).json({
      message: 'Ticket booked successfully',
      ticket: result.ticket,
      newBalance: result.newBalance
    });

  } catch (error) {
    console.error('Ticket booking error:', error);
    res.status(500).json({ message: 'Internal server error while booking ticket' });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: {
        trip: {
          include: { route: true, vehicle: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  bookTicket,
  getUserTickets
};
