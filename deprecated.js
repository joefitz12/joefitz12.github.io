const $main = document.querySelectorAll('.main')[0];

let runCount = 0;
let showerCounter = 0;
let spread = 0;
let increaseSpread = true;
let blastQueue = [];
let rendering = false;

let emergency_shutdown = 0;

let setBoxShadow = (color) =>{
    let number = (arg) => {
        return parseInt(arg*Math.random()) + 1;
    };

    let sizeValue = number(9);

    return `box-shadow: 0 0 ${number(5)}px 5px ${jf.colorPalette[jf.selectedColor]};height:${sizeValue}px;width:${sizeValue}px;`;
};

let randomNumberGenerator = () => {
    spreadBlasts();
    let activeShowerCount = showerCounter;
    // console.log('showerCounter',showerCounter);
    let random = Math.round(Math.random()*10) >= 5 ? parseInt(2 * Math.random()*activeShowerCount*spread) + 1 : -1 * parseInt(2*Math.random()*activeShowerCount*spread) + 1;
    // console.log('random',random);
    return random;
};

let spreadBlasts = (cb) => {
    if (increaseSpread){
        spread += (Math.PI/8);
        if (spread == Math.PI){increaseSpread = false;}
    }
    else {
        spread -= (Math.PI/8);
        if (spread == 0){increaseSpread = true;}
    }
    
    console.log('spread',spread);
};

let gravity = (selector,x,y) => {
    y = y / 2;

    document.querySelector(selector).style.transform = `translate(${x}px,${y}px)`;
};

let translateBlast = (colorBlast) => {
    let x = randomNumberGenerator();
    let y = randomNumberGenerator();
    let selector = `#${colorBlast.colorBlastId}`;
    
    // console.log(spread);
    console.log(`x: ${x}, y: ${y}`);
    // console.log(document.querySelector(`#${colorBlast.colorId}`));
    document.querySelector(selector).style.transform = `translate(${x}px,${y}px)`;
    // document.querySelector(selector).classList.add('gravity');
    rendering = false;
    startQueue();
};

let startQueue = () => {
    if (rendering) { return; }

    for (let i = 0; i < blastQueue.length && !rendering; i++){
        // console.log(blastQueue.length);
        emergency_shutdown++;
        if (emergency_shutdown > 10000000){alert('emergency_shutdown');blastQueue = [];rendering = false;return;}
        rendering = true;
        let colorBlast = blastQueue.shift();
        // console.log('colorBlast',colorBlast);
        
        setTimeout(() => translateBlast(colorBlast), 50);
    }
};

let createBlast = (event) => {
    console.log('event', event);
    let colorBlast = document.createElement('div');
    
    runCount++;
    let positionX = event.screenX;
    // console.log(positionX);
    let positionY = event.screenY - 132;
    // console.log(positionY);
    let color = selectedColor;
    let colorBlastId = 'color_blast' + runCount;
    let boxShadow = setBoxShadow();
    console.log(boxShadow);
    colorBlast.setAttribute('id', colorBlastId);
    colorBlast.setAttribute('class',`color_blast ${color}`);
    // console.log('all info', `top:${positionY}px;left:${positionX}px;${boxShadow}`);
    colorBlast.setAttribute('style',`top:${positionY}px;left:${positionX}px;${boxShadow}`);
    // debugger;
    document.body.append(colorBlast);

    let blastData = {
        runCount,
        positionX,
        positionY,
        color,
        boxShadow,
        colorBlastId
    };
    
    blastQueue.push(blastData);

    // console.log(Object.keys(blastData));

    // console.log('rendering',rendering);

    if (!rendering){
        startQueue();
    }
};

document.body.addEventListener('mousedown', e => {
    // console.log(e.target);
    if (e.target.classList.contains('main') || e.target.parentElement.classList.contains('main') || e.target.classList.contains('color_blast')){
        ++mouseDown;
        let createBlastShower = function (){
            // console.log('addEventLister mouseDown',mouseDown);
            if (mouseDown){
                if (showerCounter > 30){
                    showerCounter = 0;
                }
                showerCounter += 1;
                // console.log('addEventListener showerCounter',showerCounter);
                createBlast(e);
                setTimeout(() => {
                    createBlastShower();
                },  50);
            }
            else {
                showerCounter = 0;
                return;
            }
        };
        
        createBlastShower();
    }
});