const hive = require('hive-driver');
const fs = require('fs');


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
        host: 'localhost',
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


    const showTablesOperation = await session.executeStatement(
        'SELECT marque,nbportes,situationfamiliale,count(*) as nombre_ventes FROM lake_gr7.immatriculation_processed INNER JOIN lake_gr7.client_processed ON trim(immatriculation_processed.immatriculation) = trim(client_processed.immatriculation) GROUP BY marque,nbportes,situationfamiliale', { runAsync: true }
    );


    await utils.waitUntilReady(showTablesOperation, false, () => { });
    await utils.fetchAll(showTablesOperation);
    await showTablesOperation.close();

    let result = utils.getResult(showTablesOperation).getValue();

    JSONparsing(JSON.parse(JSON.stringify(result)));
    await session.close();
    await client.close();

}).catch(error => {
    console.log(error);
});

function JSONparsing(datatest) {

    var dataJson = {
        name: "Concessionaire_(Identify)_(HK)",
        children: [

        ]
    };
    const transformedJson = datatest.reduce((acc, json) => {
        let found = acc.find(a => a.name === json.marque.trim().toLowerCase());
        if (!found) {
            found = {
                "name": json.marque.trim().toLowerCase(),
                "children": []
            };
            acc.push(found);
        }

        const portesFound = found.children.find(c => c.name === `${json.nbportes} portes`);
        if (!portesFound) {
            found.children.push({
                "name": `${json.nbportes} portes`,
                "children": [
                    {
                        "name": json.situationfamiliale,
                        "size": json.nombre_ventes
                    }
                ]
            });
        } else {
            const situationFound = portesFound.children.find(c => c.name === json.situationfamiliale);
            if (!situationFound) {
                portesFound.children.push({
                    "name": json.situationfamiliale,
                    "size": json.nombre_ventes
                });
            } else {
                situationFound.size += json.nombre_ventes;
            }
        }

        return acc;
    }, []);

    dataJson.children = transformedJson


//    console.log('json parsing ', JSON.stringify(dataJson));*/
    fs.writeFile('../Client/flare.json', JSON.stringify(dataJson), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File created successfully.');
    });

}





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

{
                "marque": "Volvo ",
                "nbportes": 5,
                "situationfamiliale": "EN COUPLE ",
                "nombre_ventes": 11718
},

SELECT marque,count(*), COUNT(*) as nombre_ventes
FROM lake_gr7.immatriculation_processed
JOIN lake_gr7.client_processed immatriculation ON lake_gr7.immatriculation_processed.immatriculation = lake_gr7.client_processed.immatriculation
GROUP BY marque, lake_gr7.client_processed.situationfamiliale;

SELECT lake_gr7.immatriculation_processed.nbportes, lake_gr7.client_processed.situationfamiliale,count(*) as nombre_ventes
FROM lake_gr7.immatriculation_processed
INNER JOIN lake_gr7.client_processed
ON immatriculation_processed.immatriculation = client_processed.immatriculation
GROUP BY lake_gr7.immatriculation_processed.nbportes, lake_gr7.client_processed.situationfamiliale;

SELECT marque,nbportes,situationfamiliale,count(*) as nombre_ventes
FROM immatriculation_processed
JOIN client_processed
ON immatriculation_processed.immatriculation = client_processed.immatriculation
GROUP BY marque,nbportes,situationfamiliale;

SELECT marque,nbportes,situationfamiliale,count(*) as nombre_ventes FROM immatriculation_processed  FULL JOIN client_processed ON trim(immatriculation_processed.immatriculation) = client_processed.immatriculation GROUP BY marque,nbportes,situationfamiliale;

SELECT COUNT(*) as lignes FROM immatriculation_processed;

    {
                "id": " 63a8b87031c5145b757c6f9b ",
                "immatriculation": "3352 BH 16 ",
                "marque": "BMW ",
                "nom": "M5 ",
                "puissance": 507,
                "longueur": "tres longue ",
                "nbplaces": 5,
                "nbportes": 5,
                "couleur": "noir ",
                "occasion": "true ",
                "prix": 66360
        }

        {
                "clientid": 4,
                "age": "25 ",
                "sexe": "F ",
                "taux": "1017 ",
                "situationfamiliale": "EN COUPLE ",
                "nbenfantsacharge": "1 ",
                "deuxieme_voiture": "FALSE ",      
                "immatriculation": "2600 NK 11"    
        }
    const showTablesOperation = await session.executeStatement(
        'SELECT marque,count(*) as nombre_ventes FROM lake_gr7.immatriculation_processed GROUP BY marque', { runAsync: true }
    );
+--------------+-------------------+
|    marque    |   nombre_ventes   |
+--------------+-------------------+
| Audi         | 291643            |
| BMW          | 295130            |
| Dacia        | 13960             |
| Daihatsu     | 21899             |
| Fiat         | 76542             |
| Ford         | 75757             |
| Jaguar       | 188823            |
| Kia          | 22091             |
| Lancia       | 12498             |
| Mercedes     | 150006            |
| Mini         | 15938             |
| Nissan       | 68574             |
| Peugeot      | 96108             |
| Renault      | 251355            |
| Saab         | 84442             |
| Seat         | 21592             |
| Skoda        | 33089             |
| Volkswagen   | 155820            |
| Volvo        | 124731            |
+--------------+-------------------+
19 rows selected (409.707 seconds)
SELECT nbportes, marque, COUNT(*) as nombre_ventes FROM lake_gr7.immatriculation_processed GROUP BY nbportes, marque;
+-----------+--------------+----------------+
| nbportes  |    marque    | nombre_ventes  |
+-----------+--------------+----------------+
| 5         | Audi         | 291643         |
| 5         | BMW          | 295130         |
| 5         | Dacia        | 13960          |
| 3         | Daihatsu     | 21899          |
| 5         | Fiat         | 76542          |
| 5         | Ford         | 75757          |
| 5         | Jaguar       | 188823         |
| 5         | Kia          | 22091          |
| 3         | Lancia       | 12498          |
| 5         | Mercedes     | 150006         |
| 5         | Mini         | 15938          |
| 5         | Nissan       | 68574          |
| 5         | Peugeot      | 96108          |
| 5         | Renault      | 251355         |
| 5         | Saab         | 84442          |
| 5         | Seat         | 21592          |
| 5         | Skoda        | 33089          |
| 3         | Volkswagen   | 97032          |
| 5         | Volkswagen   | 58788          |
| 5         | Volvo        | 124731         |
+-----------+--------------+----------------+
20 rows selected (405.037 seconds)

SELECT marque,nbportes,situationfamiliale,count(*) as nombre_ventes FROM immatriculation_processed INNER JOIN client_processed ON trim(immatriculation_processed.immatriculation) = trim(client_processed.immatriculation) GROUP BY marque,nbportes,situationfamiliale;

+--------------+-----------+---------------------+----------------+
|    marque    | nbportes  | situationfamiliale  | nombre_ventes  |
+--------------+-----------+---------------------+----------------+
| Audi         | 5         | CELIBATAIRE         | 20621          |
| Audi         | 5         | EN COUPLE           | 7847           |
| Audi         | 5         | MARIE               | 71             |
| Audi         | 5         | SEUL                | 212            |
| BMW          | 5         | CELIBATAIRE         | 3802           |
| BMW          | 5         | DIVORCEE            | 7              |
| BMW          | 5         | EN COUPLE           | 23457          |
| BMW          | 5         | MARIE               | 252            |
| BMW          | 5         | SEUL                | 1281           |
| Dacia        | 5         | CELIBATAIRE         | 1360           |
| Dacia        | 5         | EN COUPLE           | 1              |
| Dacia        | 5         | SEUL                | 12             |
| Daihatsu     | 3         | CELIBATAIRE         | 1329           |
| Daihatsu     | 3         | EN COUPLE           | 787            |
| Daihatsu     | 3         | MARIE               | 12             |
| Daihatsu     | 3         | SEUL                | 17             |
| Fiat         | 5         | CELIBATAIRE         | 5              |
| Fiat         | 5         | DIVORCEE            | 9              |
| Fiat         | 5         | EN COUPLE           | 6527           |
| Fiat         | 5         | MARIE               | 73             |
| Fiat         | 5         | SEUL                | 919            |
| Ford         | 5         | CELIBATAIRE         | 8              |
| Ford         | 5         | DIVORCEE            | 11             |
| Ford         | 5         | EN COUPLE           | 6630           |
| Ford         | 5         | MARIE               | 66             |
| Ford         | 5         | SEUL                | 900            |
| Jaguar       | 5         | CELIBATAIRE         | 14             |
| Jaguar       | 5         | DIVORCEE            | 20             |
| Jaguar       | 5         | EN COUPLE           | 16238          |
| Jaguar       | 5         | MARIE               | 180            |
| Jaguar       | 5         | SEUL                | 2286           |
| Kia          | 5         | CELIBATAIRE         | 1362           |
| Kia          | 5         | EN COUPLE           | 838            |
| Kia          | 5         | MARIE               | 12             |
| Kia          | 5         | SEUL                | 10             |
| Lancia       | 3         | CELIBATAIRE         | 755            |
| Lancia       | 3         | EN COUPLE           | 450            |
| Lancia       | 3         | MARIE               | 3              |
| Lancia       | 3         | SEUL                | 4              |
| Mercedes     | 5         | CELIBATAIRE         | 4497           |
| Mercedes     | 5         | DIVORCEE            | 6              |
| Mercedes     | 5         | EN COUPLE           | 9601           |
| Mercedes     | 5         | MARIE               | 96             |
| Mercedes     | 5         | SEUL                | 586            |
| Mini         | 5         | CELIBATAIRE         | 998            |
| Mini         | 5         | EN COUPLE           | 565            |
| Mini         | 5         | MARIE               | 7              |
| Mini         | 5         | SEUL                | 10             |
| Nissan       | 5         | CELIBATAIRE         | 1366           |
| Nissan       | 5         | DIVORCEE            | 6              |
| Nissan       | 5         | EN COUPLE           | 4937           |
| Nissan       | 5         | MARIE               | 42             |
| Nissan       | 5         | SEUL                | 422            |
| Peugeot      | 5         | CELIBATAIRE         | 5936           |
| Peugeot      | 5         | EN COUPLE           | 3603           |
| Peugeot      | 5         | MARIE               | 30             |
| Peugeot      | 5         | SEUL                | 63             |
| Renault      | 5         | CELIBATAIRE         | 5079           |
| Renault      | 5         | DIVORCEE            | 13             |
| Renault      | 5         | EN COUPLE           | 18109          |
| Renault      | 5         | MARIE               | 164            |
| Renault      | 5         | SEUL                | 1546           |
| Saab         | 5         | CELIBATAIRE         | 11             |
| Saab         | 5         | DIVORCEE            | 14             |
| Saab         | 5         | EN COUPLE           | 7271           |
| Saab         | 5         | MARIE               | 71             |
| Saab         | 5         | SEUL                | 1020           |
| Seat         | 5         | CELIBATAIRE         | 3              |
| Seat         | 5         | DIVORCEE            | 4              |
| Seat         | 5         | EN COUPLE           | 1850           |
| Seat         | 5         | MARIE               | 22             |
| Seat         | 5         | SEUL                | 254            |
| Skoda        | 5         | CELIBATAIRE         | 4              |
| Skoda        | 5         | DIVORCEE            | 2              |
| Skoda        | 5         | EN COUPLE           | 3070           |
| Skoda        | 5         | MARIE               | 38             |
| Skoda        | 5         | SEUL                | 177            |
| Volkswagen   | 3         | CELIBATAIRE         | 5892           |
| Volkswagen   | 3         | EN COUPLE           | 3583           |
| Volkswagen   | 3         | MARIE               | 40             |
| Volkswagen   | 3         | SEUL                | 66             |
| Volkswagen   | 5         | CELIBATAIRE         | 5817           |
| Volkswagen   | 5         | EN COUPLE           | 13             |
| Volkswagen   | 5         | SEUL                | 55             |
| Volvo        | 5         | CELIBATAIRE         | 8              |
| Volvo        | 5         | DIVORCEE            | 8              |
| Volvo        | 5         | EN COUPLE           | 11718          |
| Volvo        | 5         | MARIE               | 125            |
| Volvo        | 5         | SEUL                | 647            |
+--------------+-----------+---------------------+----------------+
89 rows selected (320.457 seconds)
    

*/