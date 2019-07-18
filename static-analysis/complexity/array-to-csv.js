/// Takes a 2D array (array of arrays) and makes it into a .csv file
var fs = require('fs');
function convert (array, filePath) {
    var csvContent = '';
    for (var line of array) {
        for (var i = 0; i < line.length; i++) {
            csvContent += line[i];
            if (i < line.length - 1) csvContent += ',';
        }
        csvContent += '\n';
    }
    var csvStream = fs.createWriteStream(filePath);
    csvStream.write(csvContent);
    csvStream.end();
    console.log('Done: ' + filePath);
}

module.exports = convert;
