const MOVIES_DATA = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

let body = d3.select('body');

// Define a tooltip
let tooltip = body
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

let heading = body.append('heading');
  heading
      .append('h1')
      .attr('id', 'title')
      .text('Top Highest Grossing Movies');
  heading
      .append('h3')
      .attr('id', 'desciprion')
      .text('Top 95 Highest Grossing Movies by Revenue');

let width = 1000;
let height = 600;

// Create svg
let svg = body
    .append('svg')
    .attr('width', width )
    .attr('height', height )

// Fetching the data
d3.json(MOVIES_DATA)
    .then(data => callback(data))
    .catch(err => console.log(err));

let color = d3.scaleOrdinal().range(['#ecab95', '#eaba68', '#aacecf', '#f3d1c6', '#5ba0a9', '#fbeeaa', '#a30196']);

const callback = (data) => {

    let hierarchy = d3
        .hierarchy(data)
        .sum((a) => {
            return a.value;
        })
        .sort((a, b) => {
            return b.value - a.value;
        });

    let createTreeMap = d3.treemap()
                            .size([width, height])
                            .paddingInner(2);
    
    createTreeMap(hierarchy);
    
    // Create the blocks
    let block = svg
        .selectAll('g')
        .data(hierarchy.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', (d) => {
            console.log
            return `translate( ${d.x0}, ${d.y0})`
        });
    
    block.append('rect')
            .attr('class', 'title')
            .attr('fill', (d) => {
                return color(d.data.category);
            })
            .attr('width', (d) => {
                return d.x1 - d.x0;
            })
            .attr('height', (d) => {
                return d.y1 - d.y0;
            })
            .attr('data-name', (d) => {
                return d.data.name;
            })
            .attr('data-category', (d) => {
                return d.data.category;
            })
            .attr('data-value', (d) => {
                return d.data.value;
            })
            .on('mousemove', (event, d) => {
                tooltip.style('opacity', 0.9);
                tooltip
                  .html(`
                    Name: ${d.data.name}
                    <br />
                    Category: ${d.data.category}
                    <br>
                    Value: ${d.data.value}`
                  )
                  .attr('data-value', d.data.value)
                  .style('left', event.pageX + 5 + 'px')
                  .style('top', event.pageY - 70 + 'px');
              })
              .on('mouseout', () => {
                tooltip.style('opacity', 0);
              });
    
    //Add text to the blocks
    block.append('text')
            .attr('class', 'tile-text')
            .selectAll('tspan')
            .data((d) => {
                return d.data.name.split(/(?=[A-Z][^A-Z])/g);
            })
            .enter()
            .append('tspan')
            .attr('x', 6)
            .attr('y', (d, i) => {
                return 15 + i * 12;
            })
            .text((d) => {
                return d;
            });

    // Create a legend
    let categories = hierarchy
            .leaves()
            .map((nodes) => {
            return nodes.data.category
            })
            .filter((category, index, self) => {
                return self.indexOf(category) === index;
            });

    let legend_Width = 350
    let legend_Y = 10;
    let legend_X = 20;
    let rect_size = 15;
    let x_spacing = 150;
    let v_spacing = 15;
    let x_padding = 5;
    let y_padding = -2;
    let legendElemsPerRow = Math.floor(legend_Width / x_spacing);

    let legendElem = body
        .append('svg')
        .attr('id', 'legend')
        .attr('width', legend_Width)
        .append('g')
        .attr('transform', `translate(${legend_X}, ${legend_Y})`)
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
        let x = (i % legendElemsPerRow) * x_spacing;
        let y = Math.floor(i / legendElemsPerRow) * rect_size + v_spacing * Math.floor(i / legendElemsPerRow);
        return (
            `translate(${x}, ${y})`
        );
        });

    legendElem
        .append('rect')
        .attr('width', rect_size)
        .attr('height', rect_size)
        .attr('class', 'legend-item')
        .attr('fill', (d) => {
        return color(d);
        });

    legendElem
        .append('text')
        .attr('x', rect_size + x_padding)
        .attr('y', rect_size + y_padding)
        .text(function (d) {
        return d;
        });

}