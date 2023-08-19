import { Response } from 'express-serve-static-core';
import { IRequestParams, IRequestBody } from '../types/IRequestRespons/index.js';
import {  ConnectService } from '../service/index.js';
import { logger } from '../utils/index.js';

export class ConnectController {
  constructor(private connectService: ConnectService) {}

  /** Соединяеся с сервером */
  connectServer = async (req: IRequestParams<{}>, res: Response<{ success: boolean } | string | {error: string, errorMessage: unknown}>) => {
    try {
      const connect = await this.connectService.connect();
      res.status(201).json(connect);
    } catch (error) {
      logger.error('Failed to get dice:', error);
      res.status(500).json({ error: 'Failed to get dice', errorMessage: error });
    }
  };
 
}