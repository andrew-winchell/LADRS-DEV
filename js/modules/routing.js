define([
    "esri/geometry/Point"
], (Point) => {

    function nextTableRow(vertice, mapView) {
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


    return {
        nextTableRow: nextTableRow
    }
})