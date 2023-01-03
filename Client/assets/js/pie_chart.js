// A $( document ).ready() block.
$(document).ready(function () {
    getPieChart();


    /*Events Listener*/
    $( "#pie-chart-sexe" ).change(function() {
        getPieChart();
    });
});

const getPieChartData = async () => {

    const sexe = $('#pie-chart-sexe').val();
    const response = await fetch('http://localhost:8080/?sexe=' + sexe);
    const data = await response.json();
    return data;
    /*.then(response => response.text())
    .then(data => {
        data = JSON.parse(data)
        return data;
    });*/
}

const getPieChart = async () => {
    let data = await getPieChartData();


    data = data.map(obj => {
        return {...obj, color: getRandomHexColor()};
    });

    console.log(data);

    const total = data.reduce((sum, d) => sum + d.value, 0);


    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const pieChart = d3.select('#pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = pieChart.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color);

    /* arcs.append('text')
         .attr('transform', d => `translate(${arc.centroid(d)})`)
         .attr('text-anchor', 'middle')
         .text(d => `${d.data.name} (${(d.data.value / total * 100).toFixed(1)}%)`);*/


    let infos_html = '';

    data.map(info => {
        infos_html += `
            <div style="text-align: center;display: flex;align-content: center;flex-direction: column;align-items: center;margin: 0 10px">
                <div style="width: 20px;height: 20px;background-color: ${info.color} "></div>
                <div>${info.name} (${(info.value / total * 100).toFixed(1)}%)</div>
            </div>`;
    })

    let html = `<div style="display: flex;justify-content: center;">${infos_html}</div>`;

    $('#pie-chart-footer').append(html);

}

const getRandomHexColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

