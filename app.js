$(document).ready(function(){
    if (!window.jf){
        window.jf = {};
    }
    const $main = document.querySelectorAll('.main')[0];

    jf.selectedColor = 'yellow';
    
    jf.colorPalette = {
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
    
    jf.mouseDown = 0;
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
    
        !rendering && startQueue();
    };
    
    //////////////////////////
    //// click listeners /////
    //////////////////////////
    
    // document.body.addEventListener('mousedown', e => {
    //     // console.log(e.target);
    //     if (e.target.classList.contains('main') || e.target.parentElement.classList.contains('main') || e.target.classList.contains('color_blast')){
    //         ++mouseDown;
    //         let createBlastShower = function (){
    //             // console.log('addEventLister mouseDown',mouseDown);
    //             if (mouseDown){
    //                 if (showerCounter > 30){
    //                     showerCounter = 0;
    //                 }
    //                 showerCounter += 1;
    //                 // console.log('addEventListener showerCounter',showerCounter);
    //                 createBlast(e);
    //                 setTimeout(() => {
    //                     createBlastShower();
    //                 },  50);
    //             }
    //             else {
    //                 showerCounter = 0;
    //                 return;
    //             }
    //         };
            
    //         createBlastShower();
    //     }
    // });
    
    let requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
    
    let cancelAnimations = () => {
        while(jf.logs.animations.leaves.length){
            let animationToCancel = jf.logs.animations.leaves.shift();
            cancelAnimationFrame(animationToCancel);
        }
    };
    
    document.getElementById('canvas-main').addEventListener('mousedown', e => {
        if (!jf.mouseDown) { jf.mouseDown++; }
        let mainCanvas = document.getElementById('canvas-main');
        mainCanvas.getContext("2d").imageSmoothingQuality = 'high';
    
        // look up the size the canvas is being displayed
        let width = mainCanvas.clientWidth;
        let height = mainCanvas.clientHeight;
    
        // If it's resolution does not match change it
        if (mainCanvas.width !== width || mainCanvas.height !== height) {
            mainCanvas.width = width;
            mainCanvas.height = height;
        }
    
        let startingX = e.layerX;
        // console.log(positionX);
        let startingY = e.layerY;
        // createLeaf(startingX, startingY);
    
        let invertVineGrowth = false;
        let verticalVineGrowth = true;
        let startingAngle = verticalVineGrowth ? -3 * Math.PI / 2 : Math.PI;
        let finalAngle = startingAngle;
    
        let leafCreator;
        if (!window.jf.logs){
            window.jf.logs = {};
        }
    
        jf.logs.animations = {
            leaves: []
        };
    
        let animateLeaf = (cancel) => {
            let percentage = 0;
            let leafStartingX = startingX;
            let leafStartingY = startingY;
            let switchSide = invertVineGrowth;
    
            let createLeaf = () => {
                let c = document.getElementById("canvas-main");
                let ctx = c.getContext("2d");
                let leafColor = jf.colorPalette[jf.selectedColor];
                
                ctx.beginPath();
                console.log(jf.colorPalette);
                ctx.fillStyle = leafColor;
                console.log(leafColor);
    
                if (switchSide){
                    ctx.moveTo(leafStartingX, leafStartingY);
                    ctx.quadraticCurveTo(leafStartingX, leafStartingY + (percentage * 20), leafStartingX + (percentage * 30), leafStartingY);
                    ctx.stroke();
                    ctx.moveTo(leafStartingX, leafStartingY);
                    ctx.quadraticCurveTo(leafStartingX + (percentage * 10), leafStartingY - (percentage * 10), leafStartingX + (percentage * 30), leafStartingY);
                }
                else {
                    ctx.moveTo(leafStartingX, leafStartingY);
                    ctx.quadraticCurveTo(leafStartingX, leafStartingY - (percentage * 20), leafStartingX - (percentage * 30), leafStartingY);
                    ctx.stroke();
                    ctx.moveTo(leafStartingX, leafStartingY);
                    ctx.quadraticCurveTo(leafStartingX - (percentage * 10), leafStartingY + (percentage * 10), leafStartingX - (percentage * 30), leafStartingY);
                }
                
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            
                if (percentage < 1){
                    percentage += 0.01;
                    switchSide = switchSide ? switchSide : switchSide;
                }
                else if (!jf.mouseDown) {
                    cancelAnimations();
                }
            
                leafCreator = requestAnimationFrame(createLeaf);
                jf.logs.animations.leaves.push(leafCreator);
            };
    
            leafCreator = requestAnimationFrame(createLeaf);
            jf.logs.animations.leaves.push(leafCreator);
        };
        
    
        // instantiating leaf creator
        let vineCreator;
    
        let createVine = () => {
            let invertThisVine = invertVineGrowth;
            let vine = mainCanvas.getContext("2d");
            let vineColor = jf.colorPalette["green-light"];
    
            // console.log('verticalVineGrowth',verticalVineGrowth);
            
            
            vine.beginPath();
            vine.lineWidth = 1;
            vine.strokeStyle = vineColor;
            vine.shadowColor = vineColor;
            vine.shadowBlur = 1;
            if (!verticalVineGrowth){
                if (!invertThisVine) {
                    vine.arc(startingX + 15, startingY, 15, startingAngle, finalAngle, false);
                }
                else {
                    vine.arc(startingX + 15, startingY, 15, startingAngle, finalAngle, true);
                }
            }
            else {
                if (!invertThisVine) {
                    // console.log('if !invertThisVine');
                    vine.arc(startingX, startingY - 15, 15, startingAngle, finalAngle, false);
                }
                else {
                    // console.log('else !invertThisVine');
                    vine.arc(startingX, startingY - 15, 15, startingAngle, finalAngle, true);
                }
            }
    
            vine.stroke();
    
            // stop animation on mouseup
            if (!jf.mouseDown) {
                // console.log(vine);
                vine.closePath();
                cancelAnimationFrame(vineCreator);
                cancelAnimations();
                return;
            }
    
            if (!verticalVineGrowth){
                if (!invertThisVine && finalAngle <= (startingAngle + Math.PI)) {
                    finalAngle += ( Math.PI / 32);
                }
                else if (!invertThisVine) {
                    invertVineGrowth = true;
                    startingX += 30;
                    finalAngle = startingAngle;
                    animateLeaf();
                }
                else if (invertThisVine && finalAngle >= (startingAngle - Math.PI)){
                    finalAngle -= ( Math.PI / 32);
                }
                else if (invertThisVine){
                    invertVineGrowth = false;
                    startingX += 30;
                    finalAngle = startingAngle;
                    animateLeaf();
                }
            }
            else {
                if (!invertThisVine && finalAngle <= (startingAngle + Math.PI)) {
                    finalAngle += ( Math.PI / 16);
                    console.log('if');
                }
                else if (!invertThisVine) {
                    invertVineGrowth = true;
                    startingY -= 30;
                    finalAngle = startingAngle;
                    animateLeaf();
                    console.log('if2');
                }
                else if (invertThisVine && finalAngle >= (startingAngle - Math.PI)){
                    finalAngle -= ( Math.PI / 16);
                    console.log('if3');
                }
                else if (invertThisVine){
                    invertVineGrowth = false;
                    startingY -= 30;
                    finalAngle = startingAngle;
                    animateLeaf();
                    console.log('if4');
                }
            }
    
            // if (!invertThisVine && finalAngle <= (startingAngle + Math.PI)) {
            //     finalAngle += ( Math.PI / 64);
            // }
            // else if (!invertThisVine){
            //     invertVineGrowth = true;
            //     startingX += 30;
            //     finalAngle = startingAngle;
            //     animateLeaf();
            // }
            // else if (invertThisVine && finalAngle >= (startingAngle - Math.PI)){
            //     finalAngle -= ( Math.PI / 64);
            // }
            // else if (invertThisVine){
            //     invertVineGrowth = false;
            //     startingX += 30;
            //     finalAngle = startingAngle;
            //     animateLeaf();
            // }
    
            vineCreator = requestAnimationFrame(createVine);
        };
    
    
        vineCreator = requestAnimationFrame(createVine);
    });
    
    document.getElementById('canvas-main').addEventListener('mouseup', e => {   
        // console.log('addEventLister mouseUp',mouseDown);
        if (jf.mouseDown){
            jf.mouseDown--;
        }
    });
    
    document.querySelectorAll('.button-container')[0].addEventListener('click', e => {
        if (e.target.children[0] && e.target.children[0].dataset.color){
            jf.selectedColor = e.target.children[0].dataset.color;
        } 
    });
    
    document.querySelectorAll('.lightbulb-container')[0].addEventListener('click', e => {
        let isLightbulb = e.target.classList.contains('bulb') || e.target.classList.contains('bulb-inner') || e.target.classList.contains('bulb-base');
        let lightbulbContainerClassList;
    
        if (isLightbulb){
            // console.log('is lightbulb');
            // console.log(e);
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
            
            for (let i = 0; i < Object.keys(jf.colorPalette).length; i++){
                if (lightbulbContainerClassList.contains(Object.keys(jf.colorPalette)[i])){
                    lightbulbContainerClassList.remove(Object.keys(jf.colorPalette)[i]);
                    lightbulbContainerClassList.add(jf.selectedColor);
                    break;
                }
            }
    
    
        } 
    });
    
    ////////
    //////// tv
    ////////
    
    let createStatic = () => {
        let canvas = document.createElement('canvas');
        c = canvas.getContext('2d');
        
        let imageData = c.createImageData(canvas.width, canvas.height);
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
    };
    
    
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
            // console.log(cardIndex, cards.length);
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



    /////// function calls ////////
    try {
        createStatic();
    } catch (error) {
        throw error;
    }
    
});