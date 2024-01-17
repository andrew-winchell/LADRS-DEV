define([
    "js/modules/mapConfiguration.js",
    "js/modules/layers.js",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Multipoint",
    "esri/Graphic"
], (mapConfiguration, layerConfiguration, Point, Polyline, Multipoint, Graphic) => {

    const mapView = mapConfiguration.mapView;
    const aamLyr = layerConfiguration.aamLyr;

    function nextTableRow(vertice) {
        let point = new Point({
            x: vertice[0],
            y: vertice[1],
            z: vertice[2],
            spatialReference: mapView.spatialReference
        });

        let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
        let nextPoint = nextRow.insertCell(0);
        let nextX = nextRow.insertCell(1);
        let nextY = nextRow.insertCell(2);
        let nextZ = nextRow.insertCell(3);
        let nextFix = nextRow.insertCell(4);

        nextPoint.innerHTML = nextRow.rowIndex;
        nextX.innerHTML = point.longitude.toFixed(6);
        nextY.innerHTML = point.latitude.toFixed(6);
        nextZ.innerHTML = (point.z * 3.281).toFixed(0);
        nextFix.innerHTML = vertice[3];

        nextX.setAttribute("contentEditable", "true");
        nextY.setAttribute("contentEditable", "true");
        nextZ.setAttribute("contentEditable", "true");
    }

    function drawPrelimPath(points, lineColor, elevationProfile) {
        mapView.graphics.removeAll();

        let polyline = new Polyline({
            hasZ: true,
            spatialReference: mapView.spatialReference,
            paths: points
        });

        let graphic = new Graphic({
            geometry: polyline,
            symbol: {
                type: "simple-line",
                color: lineColor,
                width: "3",
                style: "short-dash"
            }
        });

        mapView.graphics.add(graphic);
        elevationProfile.input = graphic;
    }

    function saveNewRoute(points) {
        let multipoint = new Multipoint({
            points: points.map(point => point.slice(0,3)),
            spatialReference: mapView.spatialReference
        });

        let multipointGraphic = new Graphic({
            geometry: multipoint,
            attributes: {
                "NAME": ,
                "DEP_FAC": ,
                "ARR_FAC": , 
                "COLOR": lineColor,
                "FIX": points.map(point => point[3]).join(",")
            }
        });

        const edits = {
            addFeatures: [multipointGraphic]
        };

        aamLyr.applyEdits(edits)
            .then((results) => {
                console.log(results);
            });
    }


    return {
        nextTableRow: nextTableRow,
        drawPrelimPath: drawPrelimPath,
        saveNewRoute: saveNewRoute
    }
})