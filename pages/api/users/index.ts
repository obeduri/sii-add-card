// pages/api/users/index.ts
// GET all users, POST create user

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
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

// GET /api/users - Get all users with their credit cards
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { include } = req.query;
  
  const users = await prisma.user.findMany({
    include: {
      creditCards: include === 'cards' || include === 'true',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.status(200).json(users);
}

// POST /api/users - Create a new user
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
    },
    include: {
      creditCards: true,
    },
  });

  return res.status(201).json(user);
}
