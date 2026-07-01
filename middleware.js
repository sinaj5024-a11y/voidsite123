// middleware.js
export function middleware(request) {
  const url = request.nextUrl.pathname;
  
  // Блокируем все .txt файлы
  if (url.endsWith('.txt')) {
    return new Response('Доступ запрещен', { 
      status: 403 
    });
  }
  
  // Блокируем папку data
  if (url.startsWith('/data/')) {
    return new Response('Доступ запрещен', { 
      status: 403 
    });
  }
  
  return Response.next();
}

// Применяем ко всем путям, кроме API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};