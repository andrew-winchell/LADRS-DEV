define([
    ""
], () => {

    function nextTableRow(point, mapView) {
        console.log(point);

        let vertice = [[point[0], point[1], point[2]]];

        let point = new Multipoint({
            points: vertice,
            spatialReference: mapView.spatialReference
        });

        let mapPt = point.getPoint(0);

        let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
        let nextPoint = nextRow.insertCell(0);
        let nextX = nextRow.insertCell(1);
        let nextY = nextRow.insertCell(2);
        let nextZ = nextRow.insertCell(3);
        let nextFix = nextRow.insertCell(4);

        nextPoint.innerHTML = nextRow.rowIndex;
        nextX.innerHTML = point[0].toFixed(6);
        nextY.innerHTML = point[1].toFixed(6);
        nextZ.innerHTML = point[2];
        nextFix.innerHTML = point[3];

        nextX.setAttribute("contentEditable", "true");
        nextY.setAttribute("contentEditable", "true");
        nextZ.setAttribute("contentEditable", "true");
    }


    return {
        nextTableRow: nextTableRow
    }
})