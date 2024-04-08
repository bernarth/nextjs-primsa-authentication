import { NextResponse } from 'next/server';
import bycript from 'bcrypt';
import db from '@/libs/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const userEmailFound = await db.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (userEmailFound) {
      return NextResponse.json({
        message: 'Email already exist'
      }, {
        status: 400
      })
    }
    const usernameFound = await db.user.findUnique({
      where: {
        username: data.username
      }
    });

    if (usernameFound) {
      return NextResponse.json({
        message: 'Username already exist'
      }, {
        status: 400
      })
    }

    const hashedPassword = await bycript.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword
      }
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({
      message: error.message
    }, {
      status: 500
    });
  }
}