// pages/api/cards/[id].ts
// GET, PUT, DELETE tarjeta de crédito por ID

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

// GET /api/cards/[id] - Obtener tarjeta de crédito por ID
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

// PUT /api/cards/[id] - Actualizar tarjeta de crédito
async function updateCard(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { cardNumber, cardHolder, expiryDate, cvv, userId } = req.body;

  // Verificar si la tarjeta existe
  const existingCard = await prisma.creditCard.findUnique({
    where: { id },
  });

  if (!existingCard) {
    return res.status(404).json({ error: 'Credit card not found' });
  }

  // Validar formato de fecha de vencimiento si se proporciona
  if (expiryDate) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      return res.status(400).json({ 
        error: 'Invalid expiry date format. Expected MM/YY' 
      });
    }

    // Validar que el año no sea menor a 2025
    const [, year] = expiryDate.split('/').map(Number);
    if (year < 25) {
      return res.status(400).json({ 
        error: 'Expiry year cannot be below 2025' 
      });
    }
  }

  // Si se está actualizando userId, verificar que el usuario existe
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

// DELETE /api/cards/[id] - Eliminar tarjeta de crédito
async function deleteCard(id: string, res: NextApiResponse) {
  // Verificar si la tarjeta existe
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
