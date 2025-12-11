// pages/api/users/[id].ts
// GET, PUT, DELETE usuario por ID

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUser(id, req, res);
      case 'PUT':
        return await updateUser(id, req, res);
      case 'DELETE':
        return await deleteUser(id, res);
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

// GET /api/users/[id] - Obtener usuario por ID
async function getUser(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { include } = req.query;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      creditCards: include === 'cards' || include === 'true',
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
}

// PUT /api/users/[id] - Actualizar usuario
async function updateUser(id: string, req: NextApiRequest, res: NextApiResponse) {
  const { email, name } = req.body;

  // Verificar si el usuario existe
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Si se está actualizando el email, verificar conflictos
  if (email && email !== existingUser.email) {
    const emailConflict = await prisma.user.findUnique({
      where: { email },
    });

    if (emailConflict) {
      return res.status(409).json({ error: 'Email already in use' });
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(email && { email }),
      ...(name !== undefined && { name }),
    },
    include: {
      creditCards: true,
    },
  });

  return res.status(200).json(user);
}

// DELETE /api/users/[id] - Eliminar usuario (en cascada a tarjetas de crédito)
async function deleteUser(id: string, res: NextApiResponse) {
  // Verificar si el usuario existe
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await prisma.user.delete({
    where: { id },
  });

  return res.status(200).json({ message: 'User deleted successfully', id });
}
