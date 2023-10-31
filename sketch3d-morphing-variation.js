let numbersMatrix = [
    1 + 2 + 4 + 16 + 32 + 64, 4 + 32, 1 + 4 + 8 + 16 + 64, 1 + 4 + 8 + 32 + 64, // 0, 1, 2, 3
    2 + 4 + 8 + 32, 1 + 2 + 8 + 32 + 64, 1 + 2 + 8 + 16 + 32 + 64, // 4, 5, 6
    1 + 4 + 32, 1 + 2 + 4 + 8 + 16 + 32 + 64, 1 + 2 + 4 + 8 + 32 + 64 // 7, 8, 9
];

let posX = []; // Array to store X coordinates of the points
let posY = []; // Array to store Y coordinates of the points
let posZ = []; // Array to store Z coordinates of the points
let colR = []; // Array to store red color values for the points
let colG = []; // Array to store green color values for the points
let colB = []; // Array to store blue color values for the points
let rotX = []; // Rotation on the X axe

let posXBis = []; // Array to store X coordinates of the points
let posYBis = []; // Array to store Y coordinates of the points
let posZBis = []; // Array to store Z coordinates of the points
let colRBis = []; // Array to store red color values for the points
let colGBis = []; // Array to store green color values for the points
let colBBis = []; // Array to store blue color values for the points
let rotXBis = []; // Rotation on the X axe

let typeOfElement = [] // Type of element to draw (or not)
let iPosInPool = 0

let nb1 = 0
let nb2 = 9
let nb3 = 0

let iFrame = 0
let rotG = 0

function preload() {
   
}

function setup() {
    createCanvas(800, 800, WEBGL);

    setSegments(0, 2, 20, 400, 200, 20)
    setSegments(0, 4, 20, 400, 200, 20)
    setSegments(0, 6, 20, 400, 200, 20)
}

function draw() {
    // Your draw code here
    background(50);

    ambientLight(255, 60, 60);
    pointLight(255, 255, 255, 100, 100, 100);

    // Call the method to draw points with squares
    push();
    //rotateX(rotG);
    rotateY(0.05 * rotG);
    //rotateY(-PI/8);
    rotG = rotG + 0.1
    drawPointsWithSquares();
    pop();

    let changeNeeded = false

    if (!isInTransition) {
        iFrame = 0;
        if (nb1 != 4) {
            nb1 = floor(random(10))
            changeNeeded = true
        }
        if (nb2 != 0) {
            nb2 = floor(random(10))
            changeNeeded = true
        }
        if (nb3 != 4) {
            nb3 = floor(random(10))
            changeNeeded = true
        }
        if (changeNeeded) {
            currentStep = 0;

            // Does a snapshot of the current position, and tell the update loop to transition from these positions 
            // to the normal one (set just after)
            prepareTransition(30);

            iPosInPool = 0; // Start again from 0

            // As we will morph, they will be the target of the update morphing.
            setSegments(nb1, 0, 20, 200, 30, rotG + 200)
            setSegments(nb2, 2, 20, 200, 30, rotG + 200)
            setSegments(nb3, 4, 20, 200, 30, rotG + 200)
        }
    }
}

function drawPointsWithSquares() {
    if (isInTransition) {
        // From bis to normal
        for (let iDraw = 0; iDraw < iPosInPool; ++iDraw) {
            let currentType = typeOfElement[iDraw];

            if (currentType != 0) {
                let r = colR[iDraw] * 255; // Scale color values to 0-255

                normalMaterial();
                push();
                translate(currentStep * posX[iDraw] + (1 - currentStep) * posXBis[iDraw], currentStep * posY[iDraw] + (1 - currentStep) * posYBis[iDraw], currentStep * posZ[iDraw] + (1 - currentStep) * posZBis[iDraw]);
                rotateX(currentStep * rotX[iDraw] + (1 - currentStep) * rotXBis[iDraw]);
                ambientMaterial(r);
                box(4); // Adjust the size of the square as needed
                pop();
            }
        }

        currentStep += transitionSteps;
        if (currentStep >= 1) {
            // Done
            isInTransition = false;
        }

    }
    else {
        for (let i = 0; i < iPosInPool; i++) {
            let x = posX[i];
            let y = posY[i];
            let z = posZ[i];
            let r = colR[i] * 255; // Scale color values to 0-255
            let g = colG[i] * 255;
            let b = colB[i] * 255;


            normalMaterial();
            push();
            translate(x, y, z);
            rotateX(rotX[i]);
            ambientMaterial(r);
            box(4); // Adjust the size of the square as needed
            pop();
        }
    }
}

let maxPoints = 0

// Size is somehow not used.
function setSegments(number, relPosition, nbOfPointsPerSegment, size, relPosY, segPosZ) {
    // Segments
    //   _
    //  | |
    //   -
    //  | |
    //   -

    maxPoints = nbOfPointsPerSegment * 7;

    // We always show all segments, but not with the same color and depth

    // 1
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {
        if ((numbersMatrix[number] & 1) !== 0) {
            posX[iPosInPool] = 1 + relPosition * (nbOfPointsPerSegment + 8) + iPoint;
            posY[iPosInPool] = - (nbOfPointsPerSegment + 1) + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + nbOfPointsPerSegment / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 2 left up |
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {
        if ((numbersMatrix[number] & 2) !== 0) {
            posX[iPosInPool] = relPosition * (nbOfPointsPerSegment + 8);
            posY[iPosInPool] = -(1 + iPoint) + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + iPoint / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 4 left up |
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {

        if ((numbersMatrix[number] & 4) !== 0) {
            posX[iPosInPool] = nbOfPointsPerSegment + 1 + relPosition * (nbOfPointsPerSegment + 8);
            posY[iPosInPool] = -(1 + iPoint) + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + iPoint / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 8, central -
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {

        if ((numbersMatrix[number] & 8) !== 0) {
            posX[iPosInPool] = 1 + relPosition * (nbOfPointsPerSegment + 8) + iPoint;
            posY[iPosInPool] = relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 16, left bottom |
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {


        if ((numbersMatrix[number] & 16) !== 0) {
            posX[iPosInPool] = relPosition * (nbOfPointsPerSegment + 8);
            posY[iPosInPool] = 1 + iPoint + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + iPoint / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 32, right bottom |
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {

        if ((numbersMatrix[number] & 32) !== 0) {
            posX[iPosInPool] = nbOfPointsPerSegment + 1 + relPosition * (nbOfPointsPerSegment + 8);
            posY[iPosInPool] = 1 + iPoint + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + iPoint / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }

    // 64, bottom -
    for (let iPoint = 0; iPoint < nbOfPointsPerSegment; iPoint++) {

        if ((numbersMatrix[number] & 64) !== 0) {
            posX[iPosInPool] = 1 + relPosition * (nbOfPointsPerSegment + 8) + iPoint;
            posY[iPosInPool] = nbOfPointsPerSegment + 1 + relPosY;

            //posX[iPosInPool] *= 0.25;
            //posY[iPosInPool] *= 0.25;

            posZ[iPosInPool] = segPosZ + nbOfPointsPerSegment / 4;

            typeOfElement[iPosInPool] = 1;
            colR[iPosInPool] = 1;
            colG[iPosInPool] = 1;
            colB[iPosInPool] = 1;
            rotX[iPosInPool] = 0;

            iPosInPool++;
        }
    }
    if (iPosInPool < maxPoints) {
        for (let iElements = iPosInPool; iElements < maxPoints; iElements++) {
            posX[iElements] = 1000;
            posY[iElements] = 1000;
            posZ[iElements] = -100;

            colR[iElements] = 0;
            colG[iElements] = 0;
            colB[iElements] = 0;

            rotX[iElements] = 0;
        }
    }
}

let isInTransition = false;
let transitionSteps = 10;
let currentStep = 0;
let maxTransitionSteps = 10;

function prepareTransition(nbOfSteps) {
    for (let iElements = 0; iElements < iPosInPool; iElements++) {
        posXBis[iElements] = posX[iElements];
        posYBis[iElements] = posY[iElements];
        posZBis[iElements] = posZ[iElements];

        colRBis[iElements] = colR[iElements];
        colGBis[iElements] = colG[iElements];
        colBBis[iElements] = colB[iElements];

        rotXBis[iElements] = rotX[iElements];
    }
    // If we have more origin points that taget points, we still need to save them
    if (iPosInPool < maxPoints) {
        for (let iElements = iPosInPool; iElements < maxPoints; iElements++) {
            posXBis[iElements] = 1000;
            posYBis[iElements] = 1000;
            posZBis[iElements] = -100;

            colRBis[iElements] = 0;
            colGBis[iElements] = 0;
            colBBis[iElements] = 0;

            rotXBis[iElements] = 0;
        }
    }
    isInTransition = true;

    maxTransitionSteps = nbOfSteps;
    transitionSteps = 1 / maxTransitionSteps;
    currentStep = 0;
}