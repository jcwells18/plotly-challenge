function getPlot(id) {
    //read json file
    d3.json("samples.json").then((data)=>{
        console.log(data)

        //map wash frequency
        var wfreq = data.metadata.map(d =>d.wfreq)
        console.log(`Washing Frequency: ${wfreq}`)

        //filter for sample values
        var samples = data.samples.filter(s=>s.id.toString() === id)[0];

        console.log(samples);

        //grab top 10 sample values to plot
        var sampleValues = samples.sample_values.slice(0,10).reverse();

        //grab top 10 otu ids to plot
        var idValues = samples.otu_ids.slice(0,10).reverse();

        //format otu ids for plot
        var OTUids = idValues.map(d=>"OTU" + d)

        console.log(`OTU IDS': ${OTUids}`)

        //labels
        var labels = samples.otu_labels.slice(0,10);

        console.log(`Sample Values: ${sampleValues}`)
        console.log(`ID Values: ${idValues}`)

        //create trace for bar chart
        var trace1 = {
            x: sampleValues,
            y: OTUids,
            text: labels,
            type: "bar",
            orientation: "h",
        };

        //create layout to set plots
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20,
            }
        };

        //plot bar plot
        Plotly.newPlot("bar",[trace1],layout);


        //create trace for bubble chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
            },
            text: samples.otu_labels
        };

        //create layout for bubble chart
        var layout = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1300
        };

        //create bubble chart
        Plotly.newPlot("bubble",[trace2],layout);

        //create trace for pie chart
        var trace3 = [{
            domain: {x: [0,1], y: [0,1]},
            value: parseFloat(wfreq),
            title: {text: "Weekly Washing Frequency"},
            type: 'indicator',
            mode: "gauge+number",
            gauge: {axis: {
                range: [null,9]},
                steps: [
                    {range: [0,2], color: "yellow"},
                    {range: [2,4], color: "cyan"},
                    {range: [4,6], color: "teal"},
                    {range: [6,8], color: "lime"},
                    {range: [8,9], color: "green"},

                ]}

            }

        ];

        var layout3 = {
        width: 700,
        height: 600,
    };
    Plotly.newPlot("gauge",[trace3], layout3);
    });
}

function getInfo(id){
    //read json file
    d3.json("samples.json").then((data)=>{

        var metadata = data.metadata;

        console.log(metadata)

        //filter metadata by id
        var result = metadata.filter( m=>m.id.toString() === id)[0];

        //select demo to pull data
        var demoInfo = d3.select("#sample-metadata");

        //empty before getting new id
        demoInfo.html("");

        Object.entries(result).forEach((key) =>{
            demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
    }

function newOption(id){
    getPlot(id);
    getInfo(id);
}

function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        console.log(data)

    //grab ID for dropdown menu
    data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
    });
    //call the functions to display data and the plots to plot

    getPlot(data.names[0]);
    getInfo(data.names[0]);
    });
}
init();