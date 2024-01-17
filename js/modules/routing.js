define([
    "js/modules/mapConfiguration.js",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/Graphic"
], (mapConfiguration, Point, Polyline, Graphic) => {

    const mapView = mapConfiguration.mapView;

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


    return {
        nextTableRow: nextTableRow,
        drawPrelimPath: drawPrelimPath
    }
})