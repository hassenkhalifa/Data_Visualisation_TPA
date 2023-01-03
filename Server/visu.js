const hive = require('hive-driver');
const express = require('express');
const PORT = 8080;


const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);
const utils = new hive.HiveUtils(
    TCLIService_types
);

client.connect(
    {
        host: '127.0.0.1',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication({
        username: 'oussama',
        password: 'samiasamia'
    })
).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    const response = await session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    );

    const useDBOperation = await session.executeStatement(
        'USE lake_gr7', { runAsync: true }
    );
    const showTablesOperation = await session.executeStatement(
        'SELECT * FROM catalogue_complete_hdfs_h_ext LIMIT 3', { runAsync: true }
    );
    await utils.waitUntilReady(useDBOperation, false, () => {});
    await useDBOperation.close();
    
    await utils.waitUntilReady(showTablesOperation, false, () => {});
    await utils.fetchAll(showTablesOperation);
    await showTablesOperation.close();
    
    const result = utils.getResult(showTablesOperation).getValue();
    
    console.log(JSON.stringify(result, null, '\t'));

    await session.close();
    await client.close();

}).catch(error => {
    console.log(error);
});




/*
pour crée un utilisateur dans la vm 
sudo -i
useradd -ou 0 -g 0 admin
passwd admin
hassenkhalifa
hassenkhalifa

ajouter dans le vagrant file
  config.vm.network "forwarded_port", guest: 10000, host: 10000, protocol: "tcp" , auto_correct: true
  config.vm.network "forwarded_port", guest: 10000, host: 10000, protocol: "udp" , auto_correct: true
*/