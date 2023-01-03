const express = require('express');
const cors = require('cors');
const hive = require("hive-driver");

const app = express();
app.use(cors());

/*HIVE VARIABLES*/
const {TCLIService, TCLIService_types} = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

const port = 10000;
const host = '127.0.0.1';
const hive_username = 'oussama';
const hive_password = 'samiasamia';
/**/

app.get('/', (req, res) => {
    const sql = 'SELECT marque as name,count(*) as value FROM lake_gr7.immatriculation_processed INNER JOIN lake_gr7.client_processed ON trim(immatriculation_processed.immatriculation) = trim(client_processed.immatriculation) WHERE sexe LIKE \'%M%\' GROUP BY marque,sexe';

    client.connect(
        {
            host: host,
            port: port
        },
        new hive.connections.TcpConnection(),
        new hive.auth.PlainTcpAuthentication({
            username: hive_username,
            password: hive_password
        })
    ).then(async client => {
        const session = await client.openSession({
            client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
        });
        const response = await session.getInfo(
            TCLIService_types.TGetInfoType.CLI_DBMS_VER
        );

        const useDBOperation = await session.executeStatement(
            'USE lake_gr7', {runAsync: true}
        );
        const showTablesOperation = await session.executeStatement(
            sql, {runAsync: true}
        );
        await utils.waitUntilReady(useDBOperation, false, () => {
        });
        await useDBOperation.close();

        await utils.waitUntilReady(showTablesOperation, false, () => {
        });
        await utils.fetchAll(showTablesOperation);
        await showTablesOperation.close();

        const result = utils.getResult(showTablesOperation).getValue();


        res.send(JSON.stringify(result));


        await session.close();
        await client.close();
    });
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
