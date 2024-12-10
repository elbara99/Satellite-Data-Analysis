var longitude = 36.8219;
var latitude = 33.5138;

var dataset = ee.ImageCollection('COPERNICUS/S2')
              .filterBounds(ee.Geometry.Point([longitude, latitude]))
              .filterDate('2024-12-01', '2024-12-10');//date intervalle .

print('Dataset size:', dataset.size());

if (dataset.size().getInfo() === 0) {
  print('لا توجد بيانات في هذا النطاق الزمني، جرب تواريخ أخرى');
} else {
  //  ImageCollection
  var image = dataset.median().select(['B4', 'B3', 'B2', 'B8']);
  
  var trueColor = image.select(['B4', 'B3', 'B2']);
  Map.centerObject(dataset, 8);  
  Map.addLayer(trueColor, {min: 0, max: 3000}, 'True Color');
  
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  Map.addLayer(ndvi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'NDVI');

  var evi = image.expression(
    '2.5 * ((B8 - B4) / (B8 + 6 * B4 - 7.5 * B2 + 10000))', {
      'B8': image.select('B8'),
      'B4': image.select('B4'),
      'B2': image.select('B2')
    }).rename('EVI');
  Map.addLayer(evi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'EVI');
  
  var savi = image.expression(
    '((B8 - B4) * (1 + 0.5)) / (B8 + B4 + 0.5)', {
      'B8': image.select('B8'),
      'B4': image.select('B4')
    }).rename('SAVI');
  Map.addLayer(savi, {min: -1, max: 1, palette: ['white', 'yellow', 'green']}, 'SAVI');
}
