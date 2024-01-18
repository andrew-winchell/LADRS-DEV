define([
    "js/modules/mapConfiguration.js",
    "js/modules/layers.js",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Multipoint",
    "esri/Graphic",
    "esri/geometry/geometryEngine"
], (mapConfiguration, layerConfiguration, Point, Polyline, Multipoint, Graphic, geometryEngine) => {

    // Pull variables from other modules as needed
    const mapView = mapConfiguration.mapView;
    const aamLyr = layerConfiguration.layers.aamLyr;

    function nextTableRow(vertice) {
        // Create a point object with the easting/northing to be able to grab the decimal lat/long
        let point = new Point({
            x: vertice[0],
            y: vertice[1],
            z: vertice[2],
            spatialReference: mapView.spatialReference
        });

        // Create the table row and cells
        let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
        let nextPoint = nextRow.insertCell(0);
        let nextX = nextRow.insertCell(1);
        let nextY = nextRow.insertCell(2);
        let nextZ = nextRow.insertCell(3);
        let nextFix = nextRow.insertCell(4);

        // Popuplate the table cells
        nextPoint.innerHTML = nextRow.rowIndex;
        nextX.innerHTML = point.longitude.toFixed(6);
        nextY.innerHTML = point.latitude.toFixed(6);
        nextZ.innerHTML = (point.z * 3.281).toFixed(0);
        nextFix.innerHTML = vertice[3];

        // Make the X/Y/Z cells editabled in case they need to move slightly and change altitude
        nextX.setAttribute("contentEditable", "true");
        nextY.setAttribute("contentEditable", "true");
        nextZ.setAttribute("contentEditable", "true");
    }

    function drawPrelimPath(points, lineColor, elevationProfile) {
        // Clear any existing graphics from the view
        mapView.graphics.removeAll();

        // Create a polyline geometry using the points array
        let polyline = new Polyline({
            hasZ: true,
            spatialReference: mapView.spatialReference,
            paths: points
        });

        // Create a new graphic in the view using the polyline geometry
        let graphic = new Graphic({
            geometry: polyline,
            symbol: {
                type: "simple-line",
                color: lineColor,
                width: "3",
                style: "short-dash"
            }
        });

        // Add the graphic to the view
        mapView.graphics.add(graphic);
        
        // Set the graphic as the line for the elevation profile
        elevationProfile.input = graphic;
    }

    function saveNewRoute(points, lineColor) {
        // Create a new multipoint geometry using the X/Y/Z from the points array
        let multipoint = new Multipoint({
            points: points.map(point => point.slice(0,3)),
            spatialReference: mapView.spatialReference
        });

        // Create a multipoint graphic using the geometry and set the attributes of the graphic
        let multipointGraphic = new Graphic({
            geometry: multipoint,
            attributes: {
                "NAME": $("#route-name")[0].value, // pull from route save modal
                "DEP_FAC": $("#route-dep")[0].value, // pull from route save modal
                "ARR_FAC": $("#route-arr")[0].value, // pull from route save modal
                "COLOR": lineColor,
                "FIX": points.map(point => point[3]).join(","), // comma delimited list of fixes including blanks
                "PROGRAM": "Supernal"
            }
        });

        // Assign the graphic as an add feature
        const edits = {
            addFeatures: [multipointGraphic]
        };

        console.log(aamLyr);
        // Send the edits to the server and then update the view
        aamLyr.applyEdits(edits)
            .then((results) => {
                let oid = results.addFeatureResults[0].objectId;

                // Add a unique value info for the new feature
                //updateRenderer(oid, true);

                // Start array of oid's to display
                let selectedArr = [oid];
                
                // Add any additional selected oid's to the array
                for (let i of $("#existing-routes")[0].selectedItems) {
                    selectedArr.push(i.value);
                }

                // Create the expression that has the oid's wrapped in quotes and joined by a comma
                let expression = "Program = 'Supernal' AND OBJECTID IN (" + selectedArr.map(oid => `'${oid}'`).join(",") + ")";
                aamLyr.definitionExpression = expression;

                // Delete the current list of existing routes
                $("#existing-routes").empty();
                // Repopulate existing routes list with new values after 1 second delay
                setTimeout(() => {
                    populateExistingRoutes();
                }, 1000);
            });
    }

    function populateExistingRoutes() {
        const query = {
            where: "PROGRAM = 'Supernal'",
            outFields: ["FID", "NAME"],
            hasZ: true,
            returnGeometry: true
        };

        aamLyr.queryFeatures(query)
            .then((results) => {
                for (let feature of results.features) {
                    let line = new Polyline({
                        paths: [feature.geometry.points],
                        hasZ: true,
                        spatialReference: mapView.spatialReference
                    });

                    let distance = geometryEngine.geodesicLength(line, "nautical-miles").toFixed(2);

                    $("#existing-routes").append(
                        "<calcite-list-item value='" + feature.attributes.FID + "' label='" + feature.attributes.NAME + "' description='Distance: " + distance + " nautical miles'></calcite-list-item>"
                    );
                }
                $("#existing-routes")[0].loading = false;
            });
    }

    function updateRenderer(objectId, routeSelected) {
        let lineColor, geom, routeBufferName;
    }

    return {
        nextTableRow: nextTableRow,
        drawPrelimPath: drawPrelimPath,
        saveNewRoute: saveNewRoute,
        populateExistingRoutes: populateExistingRoutes
    }
})