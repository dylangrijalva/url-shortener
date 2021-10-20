import { AddressInfo } from 'net';
import initializeServer from './app';

initializeServer().then(server => {
    const info = (server.address() as AddressInfo);
    console.log(`Server up and running on http://${info.address}:${info.port}🚀`);
}).catch(err => {
    console.error(err);
});