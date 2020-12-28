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
};

let mouseDown = 0;
let runCount = 0;
let showerCounter = 0;
let spread = 0;
let increaseSpread = true;
let blastQueue = [];
let rendering = false;
let flipping = false;

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

    !rendering && startQueue();
};

//////////////////////////
//// click listeners /////
//////////////////////////

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

document.body.addEventListener('mouseup', e => {        
    console.log('addEventLister mouseUp',mouseDown);
    if (mouseDown){
        --mouseDown;
    }
});

document.querySelectorAll('.button-container')[0].addEventListener('click', e => {
    if (e.target.children[0] && e.target.children[0].dataset.color){
        selectedColor = e.target.children[0].dataset.color;
    } 
});

document.querySelectorAll('.lightbulb-container')[0].addEventListener('click', e => {
    let isLightbulb = e.target.classList.contains('bulb') || e.target.classList.contains('bulb-inner') || e.target.classList.contains('bulb-base');
    let lightbulbContainerClassList;

    if (isLightbulb){
        // console.log('is lightbulb');
        console.log(e);
        // debugger;
        if (e.target.parentElement.classList.contains('lightbulb')){
            lightbulbContainerClassList = e.target.parentElement.classList;
        }
        else if (e.target.parentElement.parentElement.classList.contains('lightbulb')){
            lightbulbContainerClassList = e.target.parentElement.parentElement.classList;
        }
        else if (e.target.parentElement.parentElement.parentElement.classList.contains('lightbulb')){
            lightbulbContainerClassList = e.target.parentElement.parentElement.parentElement.classList;
        }
        
        for (let i = 0; i < Object.keys(colorPalette).length; i++){
            if (lightbulbContainerClassList.contains(Object.keys(colorPalette)[i])){
                lightbulbContainerClassList.remove(Object.keys(colorPalette)[i]);
                lightbulbContainerClassList.add(selectedColor);
                break;
            }
        }


    } 
});

////////
//////// tv
////////

var canvas = document.createElement('canvas');
c = canvas.getContext('2d');

var imageData = c.createImageData(canvas.width, canvas.height);
document.querySelectorAll('.television .inner-container')[0].appendChild(canvas);

(function loop() {
    
    for (var i = 0, a = imageData.data.length; i < a; i++) {
        imageData.data[i] = (Math.random() * 255)|0;
    }

    // canvas.width = innerWidth;
    // canvas.height = innerHeight;
    
    c.putImageData(imageData, 0, 0);
    requestAnimationFrame(loop);
    
})();

document.querySelectorAll('.television .dial')[0].addEventListener('click', e => {
    document.querySelectorAll('.television')[0].classList.add('display_on');

    setTimeout(function(){
        document.querySelectorAll('.television.display_on')[0].classList.add('static_none');
    }, 1500);
});

// document.querySelectorAll('.card:not(flipped)')[0].addEventListener('click',e => {
//     document.querySelectorAll('.card')[0].classList.add('flipping');
//     setTimeout(function(){
//         document.querySelectorAll('.card')[0].classList.remove('flipping');
//         document.querySelectorAll('.card')[0].classList.add('flipped');
//     }, 600);
// });

//////////////////////////
/////// card flip ////////
//////////////////////////
let cards = [
    {
        type:'comedy',
        title:'LSI',
        contentTitle: 'comedy',
        content: '<ul><li>+Charisma</li><li>+Wisdom</li><li>+Intelligence</li></ul>'
    },
    {
        type:'code',
        title:'code',
        contentTitle: 'code',
        content: '<div class="link"><a href="github.com/joefitz12">Github</a><div>'
    },
    {
        type:'games',
        title: 'games',
        contentTitle: 'games',
        content: '<div class="link"><a href="boardgamegeek.com">BoardGameGeek</a></div>'
    }
];

document.querySelectorAll('.draw-deck')[0].addEventListener('click', e => {
    if (!flipping){
        let cardIndex = document.querySelectorAll('.card').length;
        let title = cards[cardIndex].title;
        let content = cards[cardIndex].content;
        let contentTitle = cards[cardIndex].contentTitle;
        var cardType = cards[cardIndex].type;
        
        var newCard = document.createElement('div');
        newCard.classList.add(cardType,'card');
        var cardHtml = 
            `<div class='container_inner'>
                <div class='back'>
                    <div class='background'>
                        <div class='container title-container'>
                            <span class='title'>card</span>
                        </div>
                    </div>
                    <div class='background background_transparent'>

                    </div>
                </div>
                <div class='front'>
                    <span class='title'>${title}</span>
                    <div class='polygon background'></div>
                    <div class='polygon angle'></div>
                    <div class='polygon angle2'></div>
                    <span class='title content-title'>${contentTitle}</span>
                    <div class='container text-container'>
                        ${content}
                    </div>
                </div>
            </div>`;

        newCard.innerHTML = cardHtml;

        

        newCard.classList.add('flipping');
        console.log(cardIndex, cards.length);
        if (cardIndex == cards.length - 1){
            document.querySelectorAll('.draw-deck')[0].classList.add('display_none');
        }
        setTimeout(function(){
            newCard.classList.remove('flipping');
            if (document.querySelectorAll('.top_card').length) {document.querySelectorAll('.top_card')[0].classList.remove('top_card');}
            newCard.classList.add('flipped','top_card');

        }, 600);

        document.querySelectorAll('.cards.container')[0].append(newCard);

        flipping = false;
    }
   
});

//////////////////////////
/// keyboard listeners ///
//////////////////////////
document.body.addEventListener('keydown', e => {
    if (e.key == '1'){
        document.querySelectorAll('.button-container')[0].children[0].children[1].classList.add('hover');
        selectedColor = document.querySelectorAll('.button-container')[0].children[0].children[1].dataset.color;
    }
    if (e.key == '2'){
        document.querySelectorAll('.button-container')[0].children[1].children[1].classList.add('hover');
        selectedColor = document.querySelectorAll('.button-container')[0].children[1].children[1].dataset.color;
    }
    if (e.key == '3'){
        document.querySelectorAll('.button-container')[0].children[2].children[1].classList.add('hover');
        selectedColor = document.querySelectorAll('.button-container')[0].children[2].children[1].dataset.color;
    }
    if (e.key == '4'){
        document.querySelectorAll('.navigation')[0].children[2].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[3].children[0].dataset.color;
    }
    if (e.key == '5'){
        document.querySelectorAll('.navigation')[0].children[4].classList.add('hover');
        selectedColor = document.querySelectorAll('.navigation')[0].children[4].children[0].dataset.color;
    }
});

document.body.addEventListener('keyup', e => {
    if (e.key == '1'){
        document.querySelectorAll('.button-container')[0].children[0].classList.remove('hover');
    }
    if (e.key == '2'){
        document.querySelectorAll('.button-container')[1].children[0].classList.remove('hover');
    }
    if (e.key == '3'){
        document.querySelectorAll('.button-container')[2].children[0].classList.remove('hover');
    }
    if (e.key == '4'){
        document.querySelectorAll('.button-container')[0].children[1].classList.remove('hover');
    }
    if (e.key == '5'){
        document.querySelectorAll('.button-container')[1].children[1].classList.remove('hover');
    }
    if (e.key == '6'){
        document.querySelectorAll('.button-container')[2].children[1].classList.remove('hover');
    }
});
