// pages/api/cards/index.ts
// GET todas las tarjetas de crédito, POST crear tarjeta de crédito

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getCards(req, res);
      case 'POST':
        return await createCard(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
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

// GET /api/cards - Obtener todas las tarjetas de crédito
async function getCards(req: NextApiRequest, res: NextApiResponse) {
  const { userId, include } = req.query;
  
  const cards = await prisma.creditCard.findMany({
    where: userId && typeof userId === 'string' ? { userId } : undefined,
    include: {
      user: include === 'user' || include === 'true',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(cards);
}

// POST /api/cards - Crear una nueva tarjeta de crédito
async function createCard(req: NextApiRequest, res: NextApiResponse) {
  const { cardNumber, cardHolder, expiryDate, cvv, userId } = req.body;

  // Validar campos requeridos
  if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['cardNumber', 'cardHolder', 'expiryDate', 'cvv']
    });
  }

  // Validar formato de fecha de vencimiento (MM/YY)
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) {
    return res.status(400).json({ 
      error: 'Invalid expiry date format. Expected MM/YY' 
    });
  }

  // Si se proporciona userId, verificar que el usuario existe
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  }

  const card = await prisma.creditCard.create({
    data: {
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      userId: userId || null,
    },
    include: {
      user: true,
    },
  });

  return res.status(201).json(card);
}
