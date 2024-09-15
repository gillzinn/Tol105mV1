/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á "mousedown" og "mousemove" atburðum
//
//    Hjálmtýr Hafsteinsson, september 2024
/////////////////////////////////////////////////////////////////

var gl;
var canvas

var mouseX;             // Old value of x-coordinate  
var movement = false;   // Do we move the paddle?

var locPosition;
var locColor;
var bufferIdA;
var bufferIdB;
var colorA = vec4(1.0, 0.0, 0.0, 1.0);
var colorB = vec4(0.0, 1.0, 0.0, 1.0);
var colorC = vec4(0.0, 0.0, 1.0, 1.0);


var locBox;
// Núverandi staðsetning miðju ferningsins
var box = vec2( 0.0, 0.0 );

// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;

// Ferningurinn er upphaflega í miðjunni
var verticesS = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);


var hradi1 = 0.0;
var hradi2 = 0.0;
var hradi3 = 0.0;




var speed = 1;



var score = 0;

var vertices = [vec2( -0.1, -1 ), vec2(  0.1, -1 ), vec2(  0.0, -0.90 ), 
    vec2(-0.02, -0.9), vec2(0.02, -0.9), vec2(0.02, -0.86), vec2(0.02, -0.86), vec2(-0.02, -0.86), vec2(-0.02, -0.9),
    vec2(  1.3, 0.7 ), vec2(  1.45, 0.7 ) , vec2(  1.45,  0.8 ), vec2(  1.45, 0.8 ), vec2(  1.3, 0.8 ), vec2(  1.3, 0.7 ), 
    vec2(  2.0, 0.5 ), vec2(  2.15, 0.5 ), vec2(  2.15,  0.6 ), vec2(  2.15, 0.6 ), vec2(  2.0, 0.6 ), vec2(  2.0, 0.5 ),
    vec2(  2.3, 0.3 ),  vec2(  2.45, 0.3 ),  vec2(  2.45,  0.4 ), vec2(  2.45, 0.4 ), vec2(  2.3, 0.4 ), vec2(  2.3, 0.3 ),
    vec2(-0.02, -1.3), vec2(0.02, -1.3), vec2(0.02, -1.26), vec2(0.02, -1.26), vec2(-0.02, -1.26), vec2(-0.02, -1.3),
    vec2(-0.02, -1.7), vec2(0.02, -1.7), vec2(0.02, -1.66), vec2(0.02, -1.66), vec2(-0.02, -1.66), vec2(-0.02, -1.7)
];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //dX = Math.random()*0.1-0.05;
    //dY = Math.random()*0.1-0.05;

    dX1 = -0.005;
    dX2 = -0.015;
    dX3 = -0.010;
    dX4 = -0.020;
    dX5 = -0.025;

    dX = [dX1, dX2, dX3, dX4, dX5];
    dY = 0.02;

    hradi1 = dX[Math.floor(Math.random() * 5)];
    hradi2 = dX[Math.floor(Math.random() * 5)];
    hradi3 = dX[Math.floor(Math.random() * 5)];



    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    
    // Define two VBOs and load the data into the GPU
    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    

    // Get location of shader variable vPosition
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    locBox = gl.getUniformLocation( program, "boxPos" );
    
    
    

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        mouseX = e.offsetX;
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            var xmove = 2*(e.offsetX - mouseX)/canvas.width;
            mouseX = e.offsetX;
            for(i=0; i<3; i++) {
                vertices[i][0] += xmove;

            }
            if(vertices[3][1] == -0.9) {
                for(i=3; i<9; i++) {
                    vertices[i][0] += xmove;
                }
            }

            if(vertices[27][1] == -0.9) {
                for(i=27; i<33; i++) {
                    vertices[i][0] += xmove;
                }
            }

            if(vertices[33][1] == -0.9) {
                for(i=33; i<39; i++) {
                    vertices[i][0] += xmove;
                }
            }
           
            gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        }
    } );

    document.getElementById("slider").onchange = function(event) {
        speed =  event.target.value;
    };

    


    render();
}


function render() {
    setTimeout(function() {
        window.requestAnimFrame(render);
        gl.clear( gl.COLOR_BUFFER_BIT );

        

        // færa skot1 upp
        for(i=3; i<9; i++) {
            vertices[i][1] += dY;
        }

        // færa skot2 upp
        for(i=27; i<33; i++) {
            vertices[i][1] += dY;
        }

        // færa skot3 upp
        for(i=33; i<39; i++) {
            vertices[i][1] += dY;
        }

        
        
        // færa fugl 1 til vinstri
        for(i=9; i<15; i++) {
            vertices[i][0] += hradi1*speed;
        }
        // færa fugl 2 til vinstri
        for(i=15; i<21; i++) {
            vertices[i][0] += hradi2*speed;
        }
        // færa fugl 3 til vinstri
        for(i=21; i<27; i++) {
            vertices[i][0] += hradi3*speed
        }

        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        

        // færa skot1 aftur niður
        if (vertices[3][1] > 1) {
            vertices[3][1] = -0.9;
            vertices[4][1] = -0.9;
            vertices[5][1] = -0.86;

            vertices[6][1] = -0.86;
            vertices[7][1] = -0.86;
            vertices[8][1] = -0.9;

            


            vertices[3][0] = vertices[1][0]-0.08;
            vertices[4][0] = vertices[0][0]+0.08;
            vertices[5][0] = vertices[0][0] + 0.08;

            vertices[6][0] = vertices[0][0]+0.08;
            vertices[7][0] = vertices[1][0]-0.08;
            vertices[8][0] = vertices[1][0]-0.08;

            

            
        } 

        // færa skot2 aftur niður
        if (vertices[27][1] > 1) {
            vertices[27][1] = -0.9;
            vertices[28][1] = -0.9;
            vertices[29][1] = -0.86;

            vertices[30][1] = -0.86;
            vertices[31][1] = -0.86;
            vertices[32][1] = -0.9;

            vertices[27][0] = vertices[1][0]-0.08;
            vertices[28][0] = vertices[0][0]+0.08;
            vertices[29][0] = vertices[0][0] + 0.08;

            vertices[30][0] = vertices[0][0]+0.08;
            vertices[31][0] = vertices[1][0]-0.08;
            vertices[32][0] = vertices[1][0]-0.08;

        }

        // færa skot3 aftur niður
        if (vertices[33][1] > 1) {
            vertices[33][1] = -0.9;
            vertices[34][1] = -0.9;
            vertices[35][1] = -0.86;

            vertices[36][1] = -0.86;
            vertices[37][1] = -0.86;
            vertices[38][1] = -0.9;

            vertices[33][0] = vertices[1][0]-0.08;
            vertices[34][0] = vertices[0][0]+0.08;
            vertices[35][0] = vertices[0][0] + 0.08;

            vertices[36][0] = vertices[0][0]+0.08;
            vertices[37][0] = vertices[1][0]-0.08;
            vertices[38][0] = vertices[1][0]-0.08;

        }


        
        // færa fugl1 aftur til hægri
        if (vertices[3][0] < -1.45) {
            vertices[3][0] =  1.3;
            vertices[4][0] = 1.375;
            vertices[5][0] = 1.45;

            hradi1 = dX[Math.floor(Math.random() * 5)];

        }

        // færa fugl1 aftur til hægri
        if (vertices[9][0] < -1.45) {
            vertices[9][0] =  1.3;
            vertices[10][0] = 1.45;
            vertices[11][0] = 1.45;
            vertices[12][0] = 1.45;
            vertices[13][0] = 1.3;
            vertices[14][0] = 1.3;
            
            hradi1 = dX[Math.floor(Math.random() * 5)]*speed;
        
        }


        // færa fugl2 aftur til hægri
        if (vertices[15][0] < -1.45) {
            vertices[15][0] =  1.3;
            vertices[16][0] = 1.45;
            vertices[17][0] = 1.45;
            vertices[18][0] = 1.45;
            vertices[19][0] = 1.3;
            vertices[20][0] = 1.3;

            hradi2 = dX[Math.floor(Math.random() * 5)]*speed;

        }

        // færa fugl3 aftur til hægri
        if (vertices[21][0] < -1.45) {
            vertices[21][0] =  1.3;
            vertices[22][0] = 1.45;
            vertices[23][0] = 1.45;
            vertices[24][0] = 1.45;
            vertices[25][0] = 1.3;
            vertices[26][0] = 1.3;

            hradi3 = dX[Math.floor(Math.random() * 5)]*speed;

        }


        // Athuga hvort skot1 hitti fugl 1
        if( ( vertices[9][0] < vertices[3][0] && vertices[4][0] < vertices[11][0]  ) && ( (vertices[9][1] -0.01) < vertices[6][1] && vertices[6][1] < ( vertices[11][1] + 0.01)) ) {
            
            score++;
            vertices[9][0] =  1.3;
            vertices[10][0] = 1.45;
            vertices[11][0] = 1.45;
            vertices[12][0] = 1.45;
            vertices[13][0] = 1.3;
            vertices[14][0] = 1.3;

            hradi1 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }


        
        
        // Athuga hvort skot1 hitti fugl 2
        if( ( vertices[15][0] < vertices[3][0] && vertices[4][0] < vertices[17][0]  ) && ( (vertices[15][1] -0.01) < vertices[6][1] && vertices[6][1] < ( vertices[17][1] + 0.01)) ) {
            
            score++;
            vertices[15][0] =  1.3;
            vertices[16][0] = 1.45;
            vertices[17][0] = 1.45;
            vertices[18][0] = 1.45;
            vertices[19][0] = 1.3;
            vertices[20][0] = 1.3;

            hradi2 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;


        }

        // Athuga hvort skot1 hitti fugl 3
        if( ( vertices[21][0] < vertices[3][0] && vertices[4][0] < vertices[23][0]  ) && ( (vertices[21][1] -0.01) < vertices[6][1] && vertices[6][1] < ( vertices[23][1] + 0.01)) ) {
            
            score++;
            vertices[21][0] =  1.3;
            vertices[22][0] = 1.45;
            vertices[23][0] = 1.45;
            vertices[24][0] = 1.45;
            vertices[25][0] = 1.3;
            vertices[26][0] = 1.3;

            hradi3 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;
            


        }

        // Athuga hvort skot2 hitti fugl 1
        if( ( vertices[9][0] < vertices[27][0] && vertices[28][0] < vertices[11][0]  ) && ( (vertices[9][1] -0.01) < vertices[29][1] && vertices[29][1] < ( vertices[11][1] + 0.01)) ) {
            
            score++;
            vertices[9][0] =  1.3;
            vertices[10][0] = 1.45;
            vertices[11][0] = 1.45;
            vertices[12][0] = 1.45;
            vertices[13][0] = 1.3;
            vertices[14][0] = 1.3;

            hradi1 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        // Athuga hvort skot2 hitti fugl 2
        if( ( vertices[15][0] < vertices[27][0] && vertices[28][0] < vertices[17][0]  ) && ( (vertices[15][1] -0.01) < vertices[29][1] && vertices[29][1] < ( vertices[17][1] + 0.01)) ) {
            
            score++;
            vertices[15][0] =  1.3;
            vertices[16][0] = 1.45;
            vertices[17][0] = 1.45;
            vertices[18][0] = 1.45;
            vertices[19][0] = 1.3;
            vertices[20][0] = 1.3;

            hradi2 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        // Athuga hvort skot2 hitti fugl 3
        if( ( vertices[21][0] < vertices[27][0] && vertices[28][0] < vertices[23][0]  ) && ( (vertices[21][1] -0.01) < vertices[29][1] && vertices[29][1] < ( vertices[23][1] + 0.01)) ) {
            
            score++;
            vertices[21][0] =  1.3;
            vertices[22][0] = 1.45;
            vertices[23][0] = 1.45;
            vertices[24][0] = 1.45;
            vertices[25][0] = 1.3;
            vertices[26][0] = 1.3;

            hradi3 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        // Athuga hvort skot3 hitti fugl 1
        if( ( vertices[9][0] < vertices[33][0] && vertices[34][0] < vertices[11][0]  ) && ( (vertices[9][1] -0.01) < vertices[35][1] && vertices[35][1] < ( vertices[11][1] + 0.01)) ) {
            
            score++;
            vertices[9][0] =  1.3;
            vertices[10][0] = 1.45;
            vertices[11][0] = 1.45;
            vertices[12][0] = 1.45;
            vertices[13][0] = 1.3;
            vertices[14][0] = 1.3;

            hradi1 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        // Athuga hvort skot3 hitti fugl 2
        if( ( vertices[15][0] < vertices[33][0] && vertices[34][0] < vertices[17][0]  ) && ( (vertices[15][1] -0.01) < vertices[35][1] && vertices[35][1] < ( vertices[17][1] + 0.01)) ) {
            
            score++;
            vertices[15][0] =  1.3;
            vertices[16][0] = 1.45;
            vertices[17][0] = 1.45;
            vertices[18][0] = 1.45;
            vertices[19][0] = 1.3;
            vertices[20][0] = 1.3;

            hradi2 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        // Athuga hvort skot3 hitti fugl 3
        if( ( vertices[21][0] < vertices[33][0] && vertices[34][0] < vertices[23][0]  ) && ( (vertices[21][1] -0.01) < vertices[35][1] && vertices[35][1] < ( vertices[23][1] + 0.01)) ) {
            
            score++;
            vertices[21][0] =  1.3;
            vertices[22][0] = 1.45;
            vertices[23][0] = 1.45;
            vertices[24][0] = 1.45;
            vertices[25][0] = 1.3;
            vertices[26][0] = 1.3;

            hradi3 = dX[Math.floor(Math.random() * 3)];

            document.getElementById("score").textContent = score;

        }

        if(score == 5) {
            
            alert("You win! Your score is: " + score);
            score = 0;
            cancelAnimationFrame(render);
        }	


        console.log(score);
        gl.drawArrays( gl.TRIANGLES, 0,39 );
        
        
    }, 5); 
        
    
    

    

 

    
}


