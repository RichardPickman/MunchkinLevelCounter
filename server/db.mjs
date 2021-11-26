import mongodb from 'mongodb';


export const createConnection = (uri) => {
    return new Promise(function (resolve, reject) {
        const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        client.connect(function (error, client) {
            if (error) {
                console.log('connection error', error);
                reject(error);
            }

            console.log('connecting established');
            resolve(client);
        });
    });
};