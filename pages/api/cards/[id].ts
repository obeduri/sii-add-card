// pages/api/cards/[id].ts
// GET, PUT, DELETE credit card by ID

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid card ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getCard(id, req, res);
      case 'PUT':
        return await updateCard(id, req, res);
      case 'DELETE':
        return await deleteCard(id, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET /api/cards/[id] - Get credit card by ID
async function getCard(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { include } = req.query;

  const card = await prisma.creditCard.findUnique({
    where: { id },
    include: {
      user: include === 'user' || include === 'true',
    },
  });

  if (!card) {
    return res.status(404).json({ error: 'Credit card not found' });
  }

  return res.status(200).json(card);
}

// PUT /api/cards/[id] - Update credit card
async function updateCard(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { cardNumber, cardHolder, expiryDate, cvv, userId } = req.body;

  // Check if card exists
  const existingCard = await prisma.creditCard.findUnique({
    where: { id },
  });

  if (!existingCard) {
    return res.status(404).json({ error: 'Credit card not found' });
  }

  // Validate expiry date format if provided
  if (expiryDate) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      return res.status(400).json({ 
        error: 'Invalid expiry date format. Expected MM/YY' 
      });
    }
  }

  // If userId is being updated, verify user exists
  if (userId !== undefined && userId !== null) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  }

  const card = await prisma.creditCard.update({
    where: { id },
    data: {
      ...(cardNumber && { cardNumber }),
      ...(cardHolder && { cardHolder }),
      ...(expiryDate && { expiryDate }),
      ...(cvv && { cvv }),
      ...(userId !== undefined && { userId: userId || null }),
    },
    include: {
      user: true,
    },
  });

  return res.status(200).json(card);
}

// DELETE /api/cards/[id] - Delete credit card
async function deleteCard(id: string, res: NextApiResponse) {
  // Check if card exists
  const card = await prisma.creditCard.findUnique({
    where: { id },
  });

  if (!card) {
    return res.status(404).json({ error: 'Credit card not found' });
  }

  await prisma.creditCard.delete({
    where: { id },
  });

  return res.status(200).json({ message: 'Credit card deleted successfully', id });
}
