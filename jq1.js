// Our Javascript will go here.
        var box = {};
        box.length = 45;
        box.height = 30;
        box.width  = 28;

        var mouse;
        var objects = [];

        var raycaster;
        var mouse = new THREE.Vector2(), INTERSECTED;
        var radius = 100, theta = 0;

        raycaster = new THREE.Raycaster();

        var scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );
        scene.add( new THREE.AmbientLight( 0x505050 ) );

        // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        var frustumSize = 1000;
        var aspect = window.innerWidth / window.innerHeight;
        var camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 );

        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        controls      = new THREE.OrbitControls(camera, renderer.domElement);

        var geometry = new THREE.PlaneGeometry( 1500, 2500, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0x42f456, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );

        plane.rotateX(1.5708);
        plane.position.y = -20;
        scene.add( plane );

        camera.position.x = 100;
        camera.position.y = 1000;
        camera.position.z = -150;

        camera.rotation.x = -1.57;
        camera.rotation.z = 1.59;
        camera.rotation.y = 0.10;

        const axes = new THREE.AxesHelper(1000);
        scene.add(axes);
        
        var group = new THREE.Group();
        
        var newGroup   = [];
        var totalCases = 0;

        var projector = new THREE.Projector();

        var targetList = [];

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////

        // function onDocumentMouseMove( event ) {
        //     event.preventDefault();
        //     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // }

        function animate() {
            requestAnimationFrame( animate );

            // render();

            renderer.render( scene, camera );

        }

        function onDocumentMouseDown( event ){

            // event.preventDefault();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
            projector.unprojectVector( vector, camera );

            var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

            // console.log(targetList.length);

            // var intersects = raycaster.intersectObjects( newGroup[0].children );
            var intersects = raycaster.intersectObjects( targetList );

            if ( intersects.length > 0 ) {
                console.log(intersects[0].object);
                var selected = intersects[0].object;
                if(selected["type"] == "Mesh" && selected["name"] != ""){

                    switch (event.which) {
                        case 1:
                            console.log('Left Mouse button pressed.');
                                       
                            $("#dialog p").html('<img src="images/case.jpeg" height="225" width="300" alt="">');
                            console.log(selected["name"]);
                            $("#dialog").dialog("open");
                            break;
                        case 2:
                            console.log('Middle Mouse button pressed.');
                            break;
                        case 3:
                            console.log('Right Mouse button pressed.');
                            $("#dialog p").html('<img src="images/stack.jpeg" height="225" width="300" alt="">');
                            console.log(selected["name"]);
                            $("#dialog").dialog("open");
                            break;
                        default:
                            console.log('You have a strange Mouse!');
                    }


                }
            }
        }

        function render() {
            // find intersections
            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects( scene.children );
            if ( intersects.length > 0 ) {
                if ( INTERSECTED != intersects[ 0 ].object ) {
                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex( 0xff0000 );
                }
            } else {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = null;
            }
            renderer.render( scene, camera );
        }

        function stackCreate() {

            topStackCreate(112);
            mediumStackCreate(56);
            lowStackCreate(48);

        }
        
        function modifyStack(stackId, lamina_top, lamina_medium, lamina_low){
            paintTopLamina(stackId, lamina_top);
            paintMediumLamina(stackId, lamina_top, lamina_medium);
            paintLowLamina(stackId, lamina_top, lamina_medium, lamina_low);
        }

        function topStackCreate(lamina_top) {

            var noof              = lamina_top;
            var count             = 0;

            var lamina_top_levels = 8;
            var lamina_top_rows   = 14;
            var lamina_top_cols   = 2;            
            
            loop1:
            for (let i = 0; i < lamina_top_levels; i++) {
                loop2:    
                for ( var j = 0; j < lamina_top_cols; j++ ) {
                    loop3:
                    for ( var k = 0; k < lamina_top_rows; k++ ) {

                        var geometry = new THREE.BoxGeometry( box.width, box.height, box.length );
                        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                        var edges    = new THREE.EdgesGeometry( geometry );

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } ) );
                        
                        group.add(line);

                        line.position.x   = - (k * box.width);
                        line.position.y   =   (i * box.height);
                        line.position.z   =   (j * box.length);

                        object.position.x = - (k * box.width);
                        object.position.y =   (i * box.height);
                        object.position.z =   (j * box.length);
                        
                        object.name = totalCases;
                        object.visible = false;
                        group.add(object);

                        objects.push( object );
                        count++;totalCases++;

                        if(count >= noof){
                            break loop1;
                        }                            

                    }

                }

            }

        }
        
        function mediumStackCreate(lamina_medium) {

            var noof              = lamina_medium;
            var count             = 0;
            var countBreakSupport = 22;
            var lowLevelSupport   = false;

            var lamina_medium_levels = 6;
            var lamina_medium_rows   = 11;
            var lamina_medium_cols   = 2;         
            
            loop1:
            for (let i = 4; i < lamina_medium_levels; i++) {
                loop2:    
                for ( var j = 0; j < lamina_medium_cols; j++ ) {
                    loop3:
                    for ( var k = 0; k < lamina_medium_rows; k++ ) {

                        if(count >= noof){
                            break loop1;
                        }

                        var geometry = new THREE.BoxGeometry( box.width, box.height, box.length );
                        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                        var edges    = new THREE.EdgesGeometry( geometry );

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } ) );
                        
                        group.add(line);

                        line.position.x   = - (k * box.width) - 42;
                        line.position.y   =   (i * box.height);
                        line.position.z   =   (j * box.length);

                        object.position.x = - (k * box.width) - 42;
                        object.position.y =   (i * box.height);
                        object.position.z =   (j * box.length);
                        
                        object.name = totalCases;
                        object.visible = false;
                        group.add( object );                        
                        objects.push( object );
                        count++;totalCases++;

                        if(count >= noof){
                            break loop1;
                        }

                        if(count - countBreakSupport == 0 || count % ((countBreakSupport * 2) + 6) == 0){                            
                            var diff = noof - count;
                            // alert(diff);
                            if(diff > 6)
                                mediumSupportStackCreate(6);
                            else if(diff > 0 && diff <= 6)
                                mediumSupportStackCreate(diff);
                        }               

                    }

                }

            }

            // width — Width of the sides on the X axis. Default is 1.
            // height — Height of the sides on the Y axis. Default is 1.
            // depth — Depth of the sides on the Z axis. Default is 1.
            
            // support boxes
            function mediumSupportStackCreate(num){
        
                if(num > 3){

                    for (let i = 0; i < 3; i++) {

                        var geometry = new THREE.BoxGeometry( box.length, box.height, box.width );
                        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                        var edges    = new THREE.EdgesGeometry( geometry ); 

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } ) );
                        group.add( line );
                        

                        line.position.x   = - 4.5;
                        if(!lowLevelSupport)
                            line.position.y   =   (4 * box.height);
                        else
                            line.position.y   =   (4 * box.height) + box.height;
                        line.position.z   = - (7.5) + (i*box.width + 2);

                        object.position.x = - 4.5;
                        if(!lowLevelSupport)
                            object.position.y   =   (4 * box.height);
                        else
                            object.position.y   =   (4 * box.height) + box.height;
                        object.position.z = - (7.5) + (i*box.width + 2);


                        object.name = totalCases;
                        object.visible = false;
                        group.add( object );                        
                        objects.push( object );

                        count++;totalCases++;
                        if(count >= noof){
                            break;
                        }
                    }

                    for (let j = 0; j < (num - 3); j++) {

                        var geometry = new THREE.BoxGeometry( box.length, box.height, box.width );
                        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                        var edges    = new THREE.EdgesGeometry( geometry );

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } ) );
                        group.add( line );

                        line.position.x   = - 5.5 - 46 - ( 11 * box.width );
                        if(!lowLevelSupport)
                            line.position.y   =   (4 * box.height);
                        else
                            line.position.y   =   (4 * box.height) + box.height;
                        line.position.z   = - (7.5) + (j * box.width + 2);

                        object.position.x = - 5.5 - 46 - ( 11 * box.width );
                        if(!lowLevelSupport)
                            object.position.y   =   (4 * box.height);
                        else
                            object.position.y   =   (4 * box.height) + box.height;
                        object.position.z = - (7.5) + (j * box.width + 2);

                        object.name = totalCases;
                        object.visible = false;
                        group.add( object );                        
                        objects.push( object );  

                        count++;totalCases++;
                        if(count >= noof){
                            break;
                        }
                    }

                }else if(num <= 3){

                    for (let i = 0; i < num; i++) {

                        var geometry = new THREE.BoxGeometry( box.length, box.height, box.width );
                        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                        var edges    = new THREE.EdgesGeometry( geometry );

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } ) );
                        group.add( line );


                        line.position.x   = - 5.5;
                        if(!lowLevelSupport)
                            line.position.y   =  (4 * box.height);
                        else
                            line.position.y   =  (4 * box.height) + box.height;
                        line.position.z   = - (7.5) + (i*box.width + 2);

                        object.position.x = - 5.5;
                        if(!lowLevelSupport)
                            object.position.y   = (4 * box.height);
                        else
                            object.position.y   = (4 * box.height) + box.height;
                        object.position.z = - (7.5) + (i*box.width + 2);

                        object.name = totalCases;
                        object.visible = false;
                        group.add( object );                        
                        objects.push( object );

                        count++;totalCases++;
                        if(count >= noof){
                            break;
                        } 
                    }

                }

                lowLevelSupport = true;

            }

        }
        
        function lowStackCreate(lamina_low){

            var noof              = lamina_low;
            var count             = 0;

            var lamina_low_levels = 1;
            var lamina_low_rows   = 13;
            var lamina_low_cols   = 2;            
            
            loop1:
            for (let i = 0; i < lamina_low_levels; i++) {
                loop2:    
                for ( var j = 0; j < lamina_low_cols; j++ ) {
                    loop3:
                    for ( var k = 0; k < lamina_low_rows; k++ ) {

                        var geometry = new THREE.BoxGeometry( box.width, box.height, box.length );
                        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                        var edges    = new THREE.EdgesGeometry( geometry );

                        var object   = new THREE.Mesh( geometry, material );  
                        var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } ) );
                        group.add( line );

                        line.position.x   = - (k * box.width) - 11;
                        line.position.y   =   (i * box.height + 6 * box.height);
                        line.position.z   =   (j * box.length);

                        object.position.x = - (k * box.width) - 11;
                        object.position.y =   (i * box.height + 6 * box.height);
                        object.position.z =   (j * box.length);
                        
                        object.name = totalCases;
                        object.visible = false;
                        group.add( object );                        
                        objects.push( object );
                        count++;totalCases++;

                        if(count >= noof){
                            break loop1;
                        }                            
                        
                        if(count > 25 && noof <= 48){
                            finalLaminaCreate(noof - count);
                        }
                    }

                }

            }
            
            function finalLaminaCreate(num){
                var lamina_low_levels = 1;
                var lamina_low_rows   = 11;
                var lamina_low_cols   = 2;            
                
                loop1:
                for (let i = 0; i < lamina_low_levels; i++) {
                    loop2:    
                    for ( var j = 0; j < lamina_low_cols; j++ ) {
                        loop3:
                        for ( var k = 0; k < lamina_low_rows; k++ ) {

                            var geometry = new THREE.BoxGeometry( box.width, box.height, box.length );
                            var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                            var edges    = new THREE.EdgesGeometry( geometry );

                            var object   = new THREE.Mesh( geometry, material );  
                            var line     = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } ) );
                            group.add( line );

                            line.position.x   = - (k * box.width) - box.width - 14;
                            line.position.y   =   (i * box.height + 7 * box.height);
                            line.position.z   =   (j * box.length);

                            object.position.x = - (k * box.width) - box.width - 14;
                            object.position.y =   (i * box.height + 7 * box.height);
                            object.position.z =   (j * box.length);

                            object.name = totalCases;
                            object.visible = false;
                            group.add( object );                        
                            objects.push( object );
                            count++;totalCases++;

                            if(count >= noof){
                                break loop1;
                            }                            
                            
                        }

                    }

                }
            }

        }

        function paintTopLamina(stackId, lamina_top) {
            for (let i = 0; i < lamina_top; i++) {
                newGroup[stackId].getObjectByName(i).visible = true;
                newGroup[stackId].getObjectByName(i).material.color.setHex( 0xce4321 );
            }
        }

        function paintMediumLamina(stackId, lamina_top, lamina_medium) {
            for (let i = lamina_top; i < lamina_medium + lamina_top; i++) {
                newGroup[stackId].getObjectByName(i).visible = true;
                newGroup[stackId].getObjectByName(i).material.color.setHex( 0x41f4df );
            }
        }

        function paintLowLamina(stackId, lamina_top, lamina_medium, lamina_low) {
            for (let i = lamina_top + lamina_medium; i < lamina_top + lamina_medium + lamina_low; i++) {
                newGroup[stackId].getObjectByName(i).visible = true;
                newGroup[stackId].getObjectByName(i).material.color.setHex( 0xf1f442 );
            }
        }

        function cloneStack(number, cubesPerStackArray){

            var loader = new THREE.FontLoader();

            loader.load( 'https://s3.amazonaws.com/uploadsfreecreatives/fonts/helvetiker_regular.typeface.json', function ( font ) {

                console.log("cloneStack");

                // var theText   = "anilrocksmamu007";
                // createText(theText, 0, 100, 0);

                function createText(theText, x, y, z){
                    var hash = document.location.hash.substr( 1 );
                    if ( hash.length !== 0 ) {
                        theText = hash;
                    }
                    var geometry = new THREE.TextGeometry( theText, {
                        font: font,
                        size: 40,
                        height: 20,
                        curveSegments: 2
                    });
                    geometry.computeBoundingBox();
                    var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
                    var materials = [
                        new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
                        new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
                    ];

                    var mesh      = new THREE.Mesh( geometry, materials );
                    mesh.position.x = x;
                    mesh.position.y = y;
                    mesh.position.z = z;
                    mesh.rotation.y = Math.PI / 2;
                    scene.add(mesh);
                    // animate();
                }


                for (let i = 0; i < newGroup.length; i++) {
                    scene.remove( newGroup[i] );
                }
                newGroup = [];

                if(number <= 28){
                    for (let i = 0; i < number; i++) {
                        newGroup[i] = group.clone();
                        for (let j = 0; j < group.children.length; j++) {
                            newGroup[i].children[j].material = group.children[j].material.clone();
                        }

                        if( i < 7 ){
                            newGroup[i].translateX( (1) * 500);
                            newGroup[i].translateZ( (i + 1) * 100 + (i * 20));

                            var theText   = i+1;
                            var output    = createText(theText, 500, 350, (i + 1) * 100 + (i * 20) + 50);


                            scene.add(newGroup[i]);

                        } else if( i >= 7 && i < 14 ){
                            newGroup[i].translateX( - (1) * 150);
                            newGroup[i].translateZ( (i + 1 - 7) * 100 + ( (i - 7) * 20));

                            var theText = i+1;
                            var output    = createText(theText, -500, 350, (i + 1 - 7) * 100 + ( (i - 7) * 20) + 70);

                            scene.add(newGroup[i]);
                        } else if( i >= 14 && i < 21){
                            newGroup[i].translateX( - (1) * 150);
                            newGroup[i].translateZ( -( (i + 1 - 14) * 100 + ( (i - 14) * 20)));

                            var theText = i+1;
                            var output    = createText(theText, -500, 350, -( (i + 1 - 14) * 100 + ( (i - 14) * 20)) + 70);

                            scene.add(newGroup[i]);
                        } else if( i >= 21 && i < 28){
                            newGroup[i].translateX( (1) * 500);
                            newGroup[i].translateZ( -( (i + 1 - 21) * 100 + ( (i - 21) * 20)));

                            var theText = i+1;
                            var output    = createText(theText, 500, 350, -( (i + 1 - 21) * 100 + ( (i - 21) * 20)) + 70);

                            scene.add(newGroup[i]);
                        }

                    }
                }else{
                    alert("Stack number exceeded");
                }

                // for (var i = 0; i < newGroup.length; i++) {
                    for (var j = 0; j < newGroup[0].children.length; j++) {
                        // console.log(newGroup[i].children[j]);
                        if (newGroup[0].children[j]["type"] == "Mesh")
                            targetList.push(newGroup[0].children[j]);
                    }
                // }

                for (var i=0;i<cubesPerStackArray.length;i++)
                {
                    console.log("modifyStack");
                    modifyStack(cubesPerStackArray[i][0]-1, cubesPerStackArray[i][1], cubesPerStackArray[i][2], cubesPerStackArray[i][3]);
                }

            });

        }

        animate();
