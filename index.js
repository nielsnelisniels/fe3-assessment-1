//Bepaal de grote voor de barchart
var margin = {top: 20, right: 10, bottom: 100, left:50},
    width = 700 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;



//Selecteert de body, om SVG eraan te linken
var svg = d3.select("body") 
    .append("svg") // .append voegt de opgegeven inhoud toe aan het einde van de geselecteerde elementen.
      .attr ({ //specificeert de width en height van SVG
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
      })
    .append("g") //g wordt gebruikt om svg vormen te groeperen
      .attr("transform","translate(" + margin.left + "," + margin.right + ")"); 



// Defineer de x en y schaal
var xScale = d3.scale.ordinal() //ordinal, omdat we tekst gebruiken
    .rangeRoundBands([0,width], 0.2, 0.2); //Range loopt van 0 tot maximale width, met ruimte van 0.2 ertussen.

var yScale = d3.scale.linear() //linear, omdat we data gebruiken
    .range([height, 0]); //in svg 0 is de top, height is maximale height en staat aan de onderkant van svg. Nu groeien de bars naar boven 



// defineer de x as en y as
var xAxis = d3.svg.axis()
    .scale(xScale) 
    .orient("bottom"); //De x-as wordt hier weergegeven beneden.

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left"); //De y-as wordt hier weergegeven op de linker zeide. 




//Laad de .csv data in
d3.csv("data.csv", function(error,data) {  
  if(error) console.log("Error: data not loaded!"); //Als data niet wordt geladen, deze zin.


  data.forEach(function(d) { //forEach roept de fuctie op voor elk element in de array. 
    d.gdp = +d.gdp; //Ook, geeft top cijfer weer op eerste waarde.       
  });

    
    
    
  // sorteer de "aantal mensen" waardes
  data.sort(function(a,b) {
    return b.gdp - a.gdp; //Return stopt data executie van de functie en "returns" de waarde van die functie.
  });

    
    
    
  // Specificeer het domein van de x en y schaal
  xScale.domain(data.map(function(d) { return d.country; }) );
  yScale.domain([0, d3.max(data, function(d) { return d.gdp; } ) ]);

  svg.selectAll('rect') //Selecteer alle scalable vector graphic
    .data(data)
    .enter() //Hier wordt 1 bar gemaakt van elke stukje data in het .csv bestand
    .append('rect') //voegt vierkant canvas toe waar tabel in wordt weergegeven
    .attr("height", 0) //0 zorgt voor de hoogte van de oorsprong van de bars. Beginnen nu op 0, dus recht op de x-as 
    .attr("y", height) //transitie in de lengte begint op 0 gaat naar maximum, anders groeien ze van boven naar beneden
    .transition().duration(3000) // transition zorgt voor beweging, de bars stijgen omhoog. Duration: van 0 naar 100 in 3000 miliseconden
    .delay( function(d,i) { return i * 200; }) // voor vertraging op het einde. Soepele beweging.
    
    .attr({
      "x": function(d) { return xScale(d.country); }, //geeft de landnamen op de x-as weer
      "y": function(d) { return yScale(d.gdp); }, //geeft de waardes op de y-as weer
      "width": xScale.rangeBand(),
      "height": function(d) { return  height - yScale(d.gdp); }
    })
    .style("fill", function(d,i) { return 'rgb(200, 200, ' + ((i * 30) + 100) + ')'}); // kleur van de bars. i * 30 zorgt voor het verschill in contrast van de kleur. Hoe minder hoe lichter.  


        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')



            .text(function(d){
                return d.gdp;
            })
            .attr({
                "x": function(d){ return xScale(d.country) +  xScale.rangeBand()/2; }, // /2 zet het label in het midden van de bar, centreren.
                "y": function(d){ return yScale(d.gdp)+ 12; }, //12px padding vanaf de hoogte van de bar tussen de cijfers
                "font-family": 'sans-serif',
                "font-size": '8px', // veranderd de grote van de cijfers binnen de bars.
                "font-weight": 'bold',
                "fill": 'white', // tekst in bar wit gemaakt
                "text-anchor": 'middle' //anchor point tekst in het midden van woord, zodat het nu ook in het midden van de bar staat.
            });

    
    
    
    
    // Tekend xAxis en positioneert het label
    svg.append("g") 
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)" )
        .style("text-anchor", "end")
        .attr("font-size", "10px");

    
    
    

    // Tekend yAxis en positioneert het label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("People in Millions");
});




//Bronnen
//https://bl.ocks.org/jamesleesaunders/f32a8817f7724b17b7f1
//https://bl.ocks.org/mbostock/3885304
//http://bl.ocks.org/mbostock/3943967
//http://bl.ocks.org/phoebebright/3061203


//Niels Pasteuning @nielsnelisniels