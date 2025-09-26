import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const cookieName = 'SESSIONID';
    let sid = req.cookies?.[cookieName];
    if (!sid) {
      sid = uuidv4();
      res.cookie(cookieName, sid, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }
    req.sessionId = sid;
    next();
  }
}
