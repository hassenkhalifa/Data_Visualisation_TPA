$(document).ready(function () {

});

async function JSONparsing(datatest) {

    /*datatest = [
        {
            "nbenfantsacharge": "0 ",
            "nbplaces": 5,
            "couleur": "blanc ",
            "nombre_ventes": 17922
        },
        {
            "nbenfantsacharge": "1 ",
            "nbplaces": 5,
            "couleur": "blanc ",
            "nombre_ventes": 6595
        },
        {
            "nbenfantsacharge": "2 ",
            "nbplaces": 5,
            "couleur": "blanc ",
            "nombre_ventes": 6531
        },
        {
            "nbenfantsacharge": "3 ",
            "nbplaces": 5,
            "couleur": "blanc ",
            "nombre_ventes": 4479
        },
        {
            "nbenfantsacharge": "4 ",
            "nbplaces": 5,
            "couleur": "blanc ",
            "nombre_ventes": 3900
        },
        {
            "nbenfantsacharge": "0 ",
            "nbplaces": 5,
            "couleur": "bleu ",
            "nombre_ventes": 17868
        },
        {
            "nbenfantsacharge": "1 ",
            "nbplaces": 5,
            "couleur": "bleu ",
            "nombre_ventes": 6635
        },
        {
            "nbenfantsacharge": "2 ",
            "nbplaces": 5,
            "couleur": "bleu ",
            "nombre_ventes": 6683
        },
        {
            "nbenfantsacharge": "3 ",
            "nbplaces": 5,
            "couleur": "bleu ",
            "nombre_ventes": 4693
        },
        {
            "nbenfantsacharge": "4 ",
            "nbplaces": 5,
            "couleur": "bleu ",
            "nombre_ventes": 3968
        },
        {
            "nbenfantsacharge": "0 ",
            "nbplaces": 5,
            "couleur": "gris ",
            "nombre_ventes": 17753
        },
        {
            "nbenfantsacharge": "1 ",
            "nbplaces": 5,
            "couleur": "gris ",
            "nombre_ventes": 6721
        },
        {
            "nbenfantsacharge": "2 ",
            "nbplaces": 5,
            "couleur": "gris ",
            "nombre_ventes": 6539
        },
        {
            "nbenfantsacharge": "3 ",
            "nbplaces": 5,
            "couleur": "gris ",
            "nombre_ventes": 4732
        },
        {
            "nbenfantsacharge": "4 ",
            "nbplaces": 5,
            "couleur": "gris ",
            "nombre_ventes": 3979
        },
        {
            "nbenfantsacharge": "0 ",
            "nbplaces": 5,
            "couleur": "noir ",
            "nombre_ventes": 17878
        },
        {
            "nbenfantsacharge": "1 ",
            "nbplaces": 5,
            "couleur": "noir ",
            "nombre_ventes": 6670
        },
        {
            "nbenfantsacharge": "2 ",
            "nbplaces": 5,
            "couleur": "noir ",
            "nombre_ventes": 6545
        },
        {
            "nbenfantsacharge": "3 ",
            "nbplaces": 5,
            "couleur": "noir ",
            "nombre_ventes": 4607
        },
        {
            "nbenfantsacharge": "4 ",
            "nbplaces": 5,
            "couleur": "noir ",
            "nombre_ventes": 4000
        },
        {
            "nbenfantsacharge": "0 ",
            "nbplaces": 5,
            "couleur": "rouge ",
            "nombre_ventes": 17524
        },
        {
            "nbenfantsacharge": "1 ",
            "nbplaces": 5,
            "couleur": "rouge ",
            "nombre_ventes": 6578
        },
        {
            "nbenfantsacharge": "2 ",
            "nbplaces": 5,
            "couleur": "rouge ",
            "nombre_ventes": 6561
        },
        {
            "nbenfantsacharge": "3 ",
            "nbplaces": 5,
            "couleur": "rouge ",
            "nombre_ventes": 4567
        },
        {
            "nbenfantsacharge": "4 ",
            "nbplaces": 5,
            "couleur": "rouge ",
            "nombre_ventes": 3925
        }
    ];*/

    var dataJson = {
        name: "Nombres d'enfants pris en charge",
        children: []
    };
    const transformedJson = datatest.reduce((acc, json) => {
        let found = acc.find(a => a.name === `${json.nbenfantsacharge} enfants en charge`);
        if (!found) {
            found = {
                name: `${json.nbenfantsacharge} enfants en charge`,
                children: []
            };
            acc.push(found);
        }

        const placesFound = found.children.find(c => c.name === `${json.nbplaces} places`);
        if (!placesFound) {
            found.children.push({
                name: `${json.nbplaces} places`,
                children: [
                    {
                        name: json.couleur,
                        value: json.nombre_ventes
                    }
                ]
            });
        } else {
            const colorFound = placesFound.children.find(c => c.name === json.couleur);
            if (!colorFound) {
                placesFound.children.push({
                    name: json.couleur,
                    value: json.nombre_ventes
                });
            } else {
                colorFound.size += json.nombre_ventes;
            }
        }

        return acc;
    }, []);

    dataJson.children = transformedJson;

    return [dataJson]

}


const getTreeMapData = async () => {
    let response = await fetch('http://localhost:8080/treemap');
    let data = await response.json();
    //console.log(data);
    let dataJson = await JSONparsing(data)
   // console.log(dataJson);

    return dataJson;
    var dataSet = [
        {
            name: "Galaxies",
            children: [
                {
                    name: "Elliptical",
                    children: [
                        {
                            name: "IC 1101",
                            children: [
                                {
                                    name: "test",
                                    value: 4000000
                                }
                            ]
                        },
                        {name: "Hercules A", value: 1500000},
                        {name: "A2261-BCG", value: 1000000},
                        {name: "ESO 306-17", value: 1000000},
                        {name: "ESO 444-46", value: 402200},
                    ]
                },
                {
                    name: "Spiral",
                    children: [
                        {name: "Rubin's Galaxy", value: 832000},
                        {name: "Comet Galaxy", value: 600000},
                        {name: "Condor Galaxy", value: 522000},
                        {name: "Tadpole Galaxy", value: 280000},
                        {name: "Andromeda Galaxy", value: 220000}
                    ]
                }
            ]
        }
    ];



}

anychart.onDocumentReady(async function () {
    // The JS treemapping code will be written here.

    var dataSet = await getTreeMapData();

    console.log(dataSet);

    // create the treemap chart and set the data
    var chart = anychart.treeMap(dataSet, "as-tree");

    // set the chart title
    chart.title("Le nombre de vente d'une couleur par nombre de places et nombre d'enfants");

    // set the container id for the chart
    chart.container("treemap");
    chart.maxDepth(2);

    chart.normal().fill('#B46FC2');
    chart.hovered().fill('#44008B', 0.8);
    chart.selected().fill('#0A0068', 0.8);
    chart.selected().hatchFill("forward-diagonal", '#282147', 2, 20);

    // set a custom color scale
    var customColorScale = anychart.scales.linearColor();
    customColorScale.colors(['#37B8F7', '#ffcc00']);
    chart.colorScale(customColorScale);
    chart.colorRange().enabled(true);
    chart.colorRange().length('90%');

    // format the labels
    chart.labels().useHtml(true);
    chart.labels().format(
        "<span style='font-size: 24px; color: #00076f'>{%name}</span><br>{%value}"
    );

    // format the tooltips
    chart.tooltip().format(
        "Scale: {%value} ventes"
    );

    // sort in ascending order
    chart.sort("asc");

    // initiate drawing the chart
    chart.draw();
});