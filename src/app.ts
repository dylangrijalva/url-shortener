import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotnev from 'dotenv-safe';
import morgan from 'morgan';

import { Server } from 'http';

export default async (): Promise<Server> => {
	dotnev.config();

	const PORT = process.env.PORT;

	const app: Application = express();

	app.use(express.json());
	app.use(helmet());
	app.use(cors());
	app.use(morgan('dev'));
	app.use(express.static('./public'));

	return app.listen(PORT);
};
