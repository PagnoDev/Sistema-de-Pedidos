// middleware.ts (na raiz do projeto)

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Libera rota de login e login da API
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Redireciona para login se não houver token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Tenta validar o token
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// middleware funciona em todas as rotas, exceto login e login API
export const config = {
  matcher: ['/((?!login|api/login|_next|favicon.ico).*)'],
};
