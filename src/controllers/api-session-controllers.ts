import { sessionService } from '../service/sessionService.js';
import { authController } from './api-auth-controlers.js';
import * as types from '../types/sessionTypes/index.js';


class SessionController {

  async wsSession(ws: any, req: any) { 

    ws.on('message', (msq: string) => {
      const message: types.ISessionMessageWs = JSON.parse(msq);
      console.log(message)  
      
      switch (message.method) {
        case 'connection':
          sessionService.connectedSession(ws, message)  
          authController.setAuthOnline(true, message.id) 
          break;
          case 'createSession':
            sessionService.createSession(ws, message)
          break;
          case 'removeSession':
            sessionService.removeSession(ws, message)
          break;
          case 'joinSession':
            sessionService.joinSession(ws, message.body)
          break;
          case 'outSession':
            sessionService.outSession(ws, message.body)  
          break;
          case 'disconect':  
            authController.setAuthOnline(false, message.body.id)
            sessionService.disconectUser(ws, message.body)
          break;
          case 'close':
            // ws.close();  
          break;
      }

    });
  }

}

export const sessionController = new SessionController();




