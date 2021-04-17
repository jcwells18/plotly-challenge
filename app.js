function getPlot(id) {
    //read json file
    d3.json("samples.json").then((data)=>{
        console.log(data)

        //map wash frequency
        var wfreq = data.metadata.map(d =>+d.wfreq)
        console.log(`Washing Frequency: ${wfreq}`)

        //filter for sample values
        var samples = data.samples.filter(s=>s.id.toString() === id)[0];

        console.log(samples);

        //grab top 10 sample values to plot
        var sampleValues = samples.sample_values.slice(0,10).reverse();

        //grab top 10 otu ids to plot
        var idValues = samples.otu_ids.slice(0,10).reverse();

        //format otu ids for plot
        var OTUids = idValues.map(d=>"OTU " + d)

        console.log(`OTU IDS': ${OTUids}`)

        //labels for bar chart
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


        //create trace for bubble plot
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

        //create layout for bubble plot
        var layout = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1300
        };

        //create bubble plot
        Plotly.newPlot("bubble",[trace2],layout);

        console.log(wfreq)

        //create trace for gauge chart (currently not working)
        var trace3 = [{
            domain: {x: [0,1], y: [0,1]},
            type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            title: {text: "Weekly Washing Frequency"},
            gauge: {
                axis: {range: [null,9], tickwidth: 0.5, tickcolor: "black"},
                steps: [
                    {range: [0,2], color: "yellow"},
                    {range: [2,4], color: "cyan"},
                    {range: [4,6], color: "teal"},
                    {range: [6,8], color: "lime"},
                    {range: [8,9], color: "green"},

                ],}

            }

        ];

        //set layout for gauge chart
        var layout3 = {
        width: 700,
        height: 600,
        margin: {t: 0, b: 0}
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
            demoInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
        });
    });
    }
//function for selectiong new option
function newOption(id){
    getPlot(id);
    getInfo(id);
}
//function for grabbing dataset 
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        console.log(data)

    //grab ID for dropdown menu
    data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
    });
    //call functions to display data and plots
    getPlot(data.names[0]);
    getInfo(data.names[0]);
    });
}
init();