const hive = require('hive-driver');
const { TCLIService, TCLIService_types } = hive.thrift;
const client = new hive.HiveClient(
    TCLIService,
    TCLIService_types
);

client.connect(
    {
        host: '127.0.0.1',
        port: 10000
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication({
        username: 'admin',
        password: 'hassenkhalifa'
    })
).then(async client => {
    const session = await client.openSession({
        client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10
    });
    const response = await session.getInfo(
        TCLIService_types.TGetInfoType.CLI_DBMS_VER
    );

    console.log(response.getValue());

}).catch(error => {
    console.log(error);
});

/*
pour crée un utilisateur dans la vm 
sudo -i
useradd -ou 0 -g 0 admin
passwd admin
*/