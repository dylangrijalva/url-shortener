import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotnev from 'dotenv-safe';
import morgan from 'morgan';
import { MongoClient, Collection } from 'mongodb';
import { UrlDoc } from './types';
import nanoid from 'nanoid';

import { Server } from 'http';

export default async (): Promise<Server> => {
	dotnev.config();

	const dbUrl: string = process.env.DATABASE_URL || 'mongodb://guest:guestlocalhost:27017';
	const client = new MongoClient(dbUrl);

	await client.connect();
	console.log('Connected succesfully to the database ✅');

	const collection: Collection<UrlDoc> = client.db('db').collection('urls');

	const PORT = process.env.PORT;
	const app: Application = express();

	app.use(express.json());
	app.use(helmet());
	app.use(cors());
	app.use(morgan('dev'));
	app.use(express.static('./public'));

	app.get('/all', async (req: Request, res: Response) => {
		const docs = await collection.find().toArray();
		return res.status(200).json(docs);
	});

	app.get('/:urlIdentifier', async (req: Request, res: Response) => {
		const { urlIdentifier } = req.params;
		if (urlIdentifier) {
			const urlDoc = await collection.findOne({ urlIdentifier });
			if (urlDoc) {
				return res.redirect(urlDoc.url);
			}
		}

		return res.redirect('/');
	});

	app.post('/url', async (req: Request, res: Response) => {
		let { id, url } = req.body;

		if (!id) {
			id = nanoid.nanoid(8);
		}

		if (!url) {
			return res.status(400).json({
				message: 'You must provide a valid url',
				status: 400,
			});
		} else {
			var urlDoc = await collection.findOne({ urlIdentifier: id });
			if (urlDoc) {
				return res.status(409).json({
					message: 'A url with the same identifier already exists',
					status: 409,
				});
			}
		}

		const newUrlDoc: UrlDoc = {
			url,
			urlIdentifier: id
		}

		await collection.insertOne(newUrlDoc);

		return res.status(201).json(newUrlDoc);
	});

	return app.listen(PORT);
};
