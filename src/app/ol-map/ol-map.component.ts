import { Component, OnInit } from '@angular/core';

import OlMap from 'ol/map';
import OlSource from 'ol/source/osm';
import OlLayer from 'ol/layer/tile';
import OlView from 'ol/view';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import KML from 'ol/format/KML';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit {
  map: OlMap;
  constructor() { }

  ngOnInit() {
    var vector = new HeatmapLayer({
      source: new VectorSource({
        url: 'https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml',
        format: new KML({
          extractStyles: false
        })
      }),
      blur: parseInt('20', 10),
      radius: parseInt('20', 10)
    });

    vector.getSource().on('addfeature', function (event) {
      // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
      // standards-violating <magnitude> tag in each Placemark.  We extract it from
      // the Placemark's name instead.
      var name = event.feature.get('name');
      var magnitude = parseFloat(name.substr(2));
      event.feature.set('weight', magnitude - 5);
    });
    var raster = new OlLayer({
      preload: Infinity,
      source: new OlSource()
    });

    this.map = new OlMap({
      target: 'map',
      layers: [raster, vector],
      view: new OlView({
        center: [0, 0],
        zoom: 3,
        minZoom: 3,
      }),
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true
    });
  }
x}
