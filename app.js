const $main = document.querySelectorAll('.main')[0];

let selectedColor = 'yellow';

let colorPalette = {
    'green-light':   '#a6d6b8',
    'green-dark':    '#6a9a8a',
    'yellow':        '#fac557',
    'yellow-vibrant':'#ffb400',
    'red':           '#f06339',
    'pink':          '#F6A6A4',
    'cream':         '#f9ebc8',
    'purple':        '#353450',
    'purple-dark':   '#2C0E37',
}

let mouseDown = 0;
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

    return `box-shadow: 0 0 ${number(5)}px 5px ${colorPalette[selectedColor]};height:${sizeValue}px;width:${sizeValue}px;`;
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
    document.body.appendChild(colorBlast);

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

    !rendering && startQueue();
};

document.body.addEventListener('mousedown', e => {
    // console.log(e.target);
    if (e.target.classList.contains('main')){
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

document.body.addEventListener('mouseup', e => {        
    console.log('addEventLister mouseUp',mouseDown);
    if (mouseDown){
        --mouseDown;
    }
});



document.body.addEventListener('keydown', e => {
    if (e.key == '1'){
        document.querySelectorAll('.navigation')[0].children[0].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[0].children[0].dataset.color;
    }
    if (e.key == '2'){
        document.querySelectorAll('.navigation')[0].children[1].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[1].children[0].dataset.color;
    }
    if (e.key == '3'){
        document.querySelectorAll('.navigation')[0].children[2].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[2].children[0].dataset.color;
    }
    if (e.key == '4'){
        document.querySelectorAll('.navigation')[0].children[3].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[3].children[0].dataset.color;
    }
    if (e.key == '5'){
        document.querySelectorAll('.navigation')[0].children[4].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[4].children[0].dataset.color;
    }
});

document.body.addEventListener('keyup', e => {
    if (e.key == '1'){
        document.querySelectorAll('.navigation')[0].children[0].classList.remove('hover');
    }
    if (e.key == '2'){
        document.querySelectorAll('.navigation')[0].children[1].classList.remove('hover');
    }
    if (e.key == '3'){
        document.querySelectorAll('.navigation')[0].children[2].classList.remove('hover');
    }
    if (e.key == '4'){
        document.querySelectorAll('.navigation')[0].children[3].classList.remove('hover');
    }
    if (e.key == '5'){
        document.querySelectorAll('.navigation')[0].children[4].classList.remove('hover');
    }
});

document.querySelectorAll('.navigation')[0].addEventListener('click', e => {
    if (e.target.children[0] && e.target.children[0].dataset.color){
        selectedColor = e.target.children[0].dataset.color;
    } 
});