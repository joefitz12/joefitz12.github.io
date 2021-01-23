$(document).ready(function(){
    const setViewPort = () => {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.body.style.setProperty('--vh', `${vh}px`);
        document.querySelectorAll('.main')[0].style.setProperty('--vh', `${vh}px`);

        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vw = window.innerWidth * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.body.style.setProperty('--vw', `${vw}px`);
        document.querySelectorAll('.main')[0].style.setProperty('--vw', `${vw}px`);
    };

    setViewPort();

    // We listen to the resize event
    window.addEventListener('resize', () => {
        setViewPort();
    });
    

    let requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
    
    let cancelAnimations = (key, limit) => {
        console.log("interface.logs.animations[" + key+ "].length", interface.logs.animations[key].length);
        console.log('cancel animations limit',limit);
        while(interface.logs.animations[key].length > limit){
            let animationToCancel = interface.logs.animations[key].shift().id;
            cancelAnimationFrame(animationToCancel);
        }
        // console.log("interface.logs.animations[" + key+ "].length", interface.logs.animations[key].length);
    };

    document.body.addEventListener('mouseup', e => {   
        // console.log('addEventLister mouseUp',mouseDown);
        if (interface.mouseDown){
            interface.mouseDown--;
        }
    });

    document.body.addEventListener('touchend', e => {   
        if (interface.mouseDown){ interface.mouseDown--; }
        // console.log('interface.mouseDown', interface.mouseDown);
    });
    

    ///////////////////////////////
    ///////// controller //////////
    ///////////////////////////////
    document.querySelectorAll('.button-container')[0].addEventListener('click', e => {
        if (e.target.children[0] && e.target.children[0].dataset.color){
            interface.selectedColor = e.target.children[0].dataset.color;
        } 
    });

    document.querySelectorAll('.button-container')[0].addEventListener('touchstart', e => {
        if (e.target.children[0] && e.target.children[0].dataset.color){
            interface.selectedColor = e.target.children[0].dataset.color;
            e.target.classList.add('hover');
        } 
    });

    // unclicks button when another is selected
    document.querySelectorAll('.button-container')[0].addEventListener('touchend', e => {
        if (e.target.children[0] && e.target.children[0].dataset.color){
            e.target.classList.remove('hover');
        } 
    });

    ///////////////////////////////
    ///////// vines //////////
    ///////////////////////////////
    const handleVineCreation = (e) => {
        if ( !interface.mouseDown ) { interface.mouseDown++; }
        let mainCanvas = document.getElementById('canvas-main');
        mainCanvas.getContext("2d").imageSmoothingQuality = 'high';
        
        // instantiating growthSpeed
        let growthSpeed = 1.5;

        // instantiating sizeModifier
        let leafSizeModifier = interface.leaves.sizeModifier;
        let vineSizeModifier = interface.vines.sizeModifier;
    
        // look up the size the canvas is being displayed
        let width = mainCanvas.clientWidth;
        let height = mainCanvas.clientHeight;
    
        // If it's resolution does not match change it
        if (mainCanvas.width !== width || mainCanvas.height !== height) {
            mainCanvas.width = width;
            mainCanvas.height = height;
        }
    
        let startingX = e.layerX ? e.layerX : e.touches[0].clientX;
        let startingY = e.layerY ? e.layerY : e.touches[0].clientY - 176;

        // console.log('startingX', startingX);
        // console.log('startingY', startingY);
        // debugger;

        // instantiating final and starting angle variables for vine animation
        let finalAngle;
        let startingAngle;
        let selectedQuadrant;

        // instantiating 
        let deltaX;
        let deltaY;

        let setTrajectory = () => {
            let quadrants = [3, 4];
            selectedQuadrant = quadrants[parseInt(Math.random() * 2)];
            // console.log('selectedQuadrant',selectedQuadrant);

            if (selectedQuadrant == 3){
                deltaX = deltaX * -1;
                deltaY = deltaY * -1;
            }
            else if (selectedQuadrant == 4){
                deltaY = deltaY * -1;
            }

            finalAngle = Math.atan2(deltaY, deltaX) - Math.PI;
            startingAngle = finalAngle;
        };

        // doing triangle math
        let radius = 15 * vineSizeModifier;
        // deltaX = parseInt(radius * Math.random() + 1);
        deltaX = parseInt((radius / 5) * Math.random() + 1);
        // let deltaX = 8;
        // console.log('deltaX',deltaX);
        deltaY = parseInt(Math.pow( Math.pow(radius,2) - Math.pow(deltaX,2), 0.5));
        // let deltaY = 12;
        // console.log('deltaY',deltaY);
        // let startingAngle = Math.atan2(deltaX, deltaY);
        setTrajectory();
        // console.log('finalAngle',finalAngle);
        // console.log('startingAngle',startingAngle);

        //// original method /////
        // let startingAngle = verticalVineGrowth ? -3 * Math.PI / 2 : Math.PI;
        // let finalAngle = startingAngle;

        // console.log('startingAngle',startingAngle);
        // console.log('finalAngle',finalAngle);

        // instantiating variable to save animation processes
        let leafCreator;
    
        let animateLeaf = () => {
            let percentage = 0;
            let leafStartingX = startingX;
            let leafStartingY = startingY;
            let switchSide = interface.vines.invertVineGrowth;
    
            let createLeaf = () => {
                let leaf = mainCanvas.getContext("2d");
                let leafColor = interface.colorPalette[interface.selectedColor];

                // console.log('leafColor', leafColor);
                // if (interface.logs.animations.leaves.length > 1000){
                //     cancelAnimations('leaves');
                // }
                
                leaf.beginPath();
                leaf.strokeStyle = leafColor;
                leaf.shadowColor = leafColor;
                leaf.fillStyle = leafColor;
    
                if (switchSide){
                    leaf.moveTo(leafStartingX, leafStartingY);
                    leaf.quadraticCurveTo(leafStartingX + (percentage * 7 * leafSizeModifier), leafStartingY - (percentage * 18 * leafSizeModifier), leafStartingX + (percentage * 30 * leafSizeModifier), leafStartingY);
                    leaf.stroke();
                    leaf.moveTo(leafStartingX, leafStartingY);
                    leaf.quadraticCurveTo(leafStartingX + (percentage * 10 * leafSizeModifier), leafStartingY + (percentage * 15 * leafSizeModifier), leafStartingX + (percentage * 30 * leafSizeModifier), leafStartingY);
                    leaf.stroke();
                }
                else {
                    leaf.moveTo(leafStartingX, leafStartingY);
                    leaf.quadraticCurveTo(leafStartingX - (percentage * 8 * leafSizeModifier), leafStartingY - (percentage * 18 * leafSizeModifier), leafStartingX - (percentage * 30 * leafSizeModifier), leafStartingY);
                    leaf.stroke();
                    leaf.moveTo(leafStartingX, leafStartingY);
                    leaf.quadraticCurveTo(leafStartingX - (percentage * 10 * leafSizeModifier), leafStartingY + (percentage * 15 * leafSizeModifier), leafStartingX - (percentage * 30 * leafSizeModifier), leafStartingY);
                    leaf.stroke();
                }
                
                leaf.fill();
                leaf.closePath();
            
                if (percentage < 1){
                    percentage += 0.018;
                    switchSide = switchSide ? switchSide : switchSide;
                    
                    // debugging this
                    leafCreator = requestAnimationFrame(createLeaf);
                    interface.logs.animations.leaves.push({
                        id: leafCreator,
                        percentage: percentage
                    });
                }
                else {
                    interface.logs.leaves.count++;
                }
                
                if (!interface.mouseDown) {
                    // cancelAnimations('leaves', 5);
                } 
            };
    
            leafCreator = requestAnimationFrame(createLeaf);
            interface.logs.animations.leaves.push({
                id: leafCreator,
                percentage: percentage
            });
        };
        
    
        // instantiating variable to save animation processes
        let vineCreator;
    
        let createVine = () => {
            let invertThisVine = interface.vines.invertVineGrowth;
            let vine = mainCanvas.getContext("2d");
            let vineColor;

            vineColor = interface.colorPalette["green-light"];
            
            /// switches vine color randomly
            // if (interface.logs.vines.count % 3 == 0){
            //     vineColor = interface.colorPalette["green-light"];
            //     // console.log('vine color 0');
            // }
            // else if (interface.logs.vines.count % 3 == 1){
            //     vineColor = interface.colorPalette['green-light_20%-light'];
            //     // console.log('vine color 1');

            // }
            // else if (interface.logs.vines.count % 3 == 2){
            //     vineColor = interface.colorPalette['green-light_20%-dark'];
            //     // console.log('vine color 2');
            // }

            vine.beginPath();
            vine.lineWidth = 1;
            vine.strokeStyle = vineColor;
            vine.shadowColor = vineColor;
            vine.shadowBlur = 1;
            vine.lineCap = "round";

            if (!invertThisVine) {
                // console.log('if !invertThisVine');
                vine.arc(startingX + deltaX, startingY + deltaY, radius, startingAngle, finalAngle, false);
            }
            else {
                // console.log('else !invertThisVine');
                vine.arc(startingX + deltaX, startingY + deltaY, radius, startingAngle, finalAngle, true);
            }
    
            vine.stroke();
    
            // stop animation on mouseup
            if (!interface.mouseDown) {
                // console.log(vine);
                vine.closePath();
                interface.logs.vines.count++;
                cancelAnimationFrame(vineCreator);
                // cancelAnimations('leaves', 5);
                return;
            }
            
            if (!invertThisVine && finalAngle <= (startingAngle + Math.PI)) {
                finalAngle += ( Math.PI / (16 / growthSpeed) );
                // console.log('if');
            }
            else if (!invertThisVine) {
                interface.vines.invertVineGrowth  = true;
                startingX += (2 * deltaX);
                startingY += (2 * deltaY);
                finalAngle = startingAngle;
                animateLeaf();
                // console.log('if2');
            }
            else if (invertThisVine && finalAngle >= (startingAngle - Math.PI)){
                finalAngle -= ( Math.PI / (16 / growthSpeed));
                // console.log('if3');
            }
            else if (invertThisVine){
                interface.vines.invertVineGrowth = false;
                startingX += (2 * deltaX);
                startingY += (2 * deltaY);
                finalAngle = startingAngle;
                animateLeaf();
                // console.log('if4');
            }
    
            vineCreator = requestAnimationFrame(createVine);
        };
    
    
        vineCreator = requestAnimationFrame(createVine);
    };

    document.getElementById('canvas-main').addEventListener('mousedown', e => {
        handleVineCreation(e);
    });

    document.getElementById('canvas-main').addEventListener('touchstart', e => {
        if ( !interface.mouseDown ) { interface.mouseDown++; }
        handleVineCreation(e);
    });

    document.getElementById('canvas-main').addEventListener('touchmove', e => {
        e.preventDefault();
        interface.canvas.touches.push(e);
    });

    document.getElementById('canvas-main').addEventListener('touchend', e => {
        e.preventDefault();
        // console.log("it's over", e);
        // if (interface.canvas.touches.length && interface.canvas.touches[0].touches[0].clientX > interface.canvas.touches[interface.canvas.touches.length - 1].touches[0].clientX){
        //     // handleCardFlip(e);
        //     if (interface.canvas.containers.length > interface.canvas.focus_index - 1){
        //         document.querySelectorAll(interface.canvas.containers[interface.canvas.focus_index])[0].classList.remove('mobile_focus');
        //         interface.canvas.focus_index++;
        //         document.querySelectorAll(interface.canvas.containers[interface.canvas.focus_index])[0].classList.add('mobile_focus');
        //     }
        // }
        // else if (interface.canvas.touches.length && interface.canvas.touches[0].touches[0].clientX < interface.canvas.touches[interface.canvas.touches.length - 1].touches[0].clientX){
        //     // handleCardFlip(e);
        //     if (interface.canvas.focus_index > 0){
        //         document.querySelectorAll(interface.canvas.containers[interface.canvas.focus_index])[0].classList.remove('mobile_focus');
        //         interface.canvas.focus_index--;
        //         document.querySelectorAll(interface.canvas.containers[interface.canvas.focus_index])[0].classList.add('mobile_focus');
        //     }  
        // }
        interface.canvas.touches = [];
        // handleCardFlip(e);
    });

    document.getElementById('canvas-main').addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    ///////////////////////////////////////
    ////////////// lightbulb //////////////
    ///////////////////////////////////////
    const handleLightbulbEngagement = (e) => {
        e.stopPropagation();
        let isLightbulb = e.target.classList.contains('bulb') || e.target.classList.contains('bulb-inner') || e.target.classList.contains('bulb-base');
        if (!isLightbulb){ return; }
        let lightbulb;
        let lightbulbContainerClassList;
        let parent = e.target.parentElement;
        let grandParent = e.target.parentElement.parentElement;
        let greatGrandParent = e.target.parentElement.parentElement.parentElement;
        let parentClassList = parent.classList;
        let grandparentClassList = grandParent.classList;
        let greatGrandParentClassList = greatGrandParent.classList;

    
        // console.log('is lightbulb');
        // console.log(e);
        // debugger;
        if (parentClassList.contains('lightbulb')){
            lightbulb = parent;
            lightbulbContainerClassList = parentClassList;
        }
        else if (grandparentClassList.contains('lightbulb')){
            lightbulb = grandParent;
            lightbulbContainerClassList = grandparentClassList;
            // adds clicked class to rotate container to trigger animation
        }
        else if (greatGrandParentClassList.contains('lightbulb')){
            lightbulb = greatGrandParent;
            lightbulbContainerClassList = greatGrandParentClassList;
        }

        if (!lightbulb.classList.contains('clicked')){ lightbulb.classList.add('clicked'); }
        // else { console.log ('nope');}

        setTimeout(function(){
            lightbulb.classList.remove('clicked');
        }, 1000);
        
        for (let i = 0; i < Object.keys(interface.colorPalette).length; i++){
            if (lightbulbContainerClassList.contains(Object.keys(interface.colorPalette)[i])){
                lightbulbContainerClassList.remove(Object.keys(interface.colorPalette)[i]);
                lightbulbContainerClassList.add(interface.selectedColor);
                break;
            }
        }
    };
    
    document.querySelectorAll('.lightbulb-container')[0].addEventListener('click', e => {
        handleLightbulbEngagement(e);
    });

    document.querySelectorAll('.lightbulb-container')[0].addEventListener('touchstart', e => {
        handleLightbulbEngagement(e);
    });
    
    /////////////////////
    //////// tv /////////
    /////////////////////
    
    let createStatic = (cb) => {
        let canvas = document.createElement('canvas');
        c = canvas.getContext('2d');
        
        let imageData = c.createImageData(canvas.width, canvas.height);
        document.querySelectorAll('.television .inner-container')[0].appendChild(canvas);

        let staticAnimation;
        
        let loop = () => {
            for (var i = 0, a = imageData.data.length; i < a; i++) {
                imageData.data[i] = (Math.random() * 255)|0;
            }
            
            c.putImageData(imageData, 0, 0);

            if (interface.static.animate){
                staticAnimation = requestAnimationFrame(loop);
                interface.logs.animations.static.push(staticAnimation);
            }
        };

        staticAnimation = requestAnimationFrame(loop);
        interface.logs.animations.static.push(staticAnimation);

        if (cb){
            cb();
        }
    };
    
    
    document.querySelectorAll('.television .dial')[0].addEventListener('click', e => {
        try {
            if (document.querySelectorAll('.static_none').length < 1){
                createStatic( () => {
                    document.querySelectorAll('.television')[0].classList.add('display_on');
        
                    setTimeout(function(){
                        document.querySelectorAll('.television.display_on')[0].classList.add('static_none');
                        interface.static.animate = false;
                        // cancelAnimations('static',0);
                    }, 1500);
                });
            }
        } catch (error) {
            throw error;
        }
    });
    
    //////////////////////////
    /////// card flip ////////
    //////////////////////////
    const selectCard = () => {
        let eligibleCards = interface.cards.data.filter(card => card.flipped != true);
        let selectedCard = eligibleCards[parseInt(Math.random() * eligibleCards.length)];
        selectedCard.flipped = true;
        return selectedCard;
    };

    let handleCardFlip = (e) => {
        if (!interface.cards.flipping){
            interface.cards.flipping = true;
            let cardIndex = document.querySelectorAll('.card').length;
            let card = selectCard();

            let newCard = document.createElement('div');
            newCard.classList.add(card.type,'card');

            // instantiating modifier variables
            let title_length = '';

            if (card.title.length > 10){
                title_length = 'title_long';
            }

            let cardHtml = 
                `<div class='container_inner'>
                    <div class='back'>
                        <div class='background'>
                            <div class='container title-container'>
                                <span class='title'>flip</span>
                            </div>
                        </div>
                        <div class='background background_transparent'>
    
                        </div>
                    </div>
                    <div class='front'>
                        <span class='title ${title_length}'>${card.title}</span>
                        <div class='polygon background'></div>
                        <div class='polygon angle'></div>
                        <div class='polygon angle2'></div>
                        <div class='container text-container'>
                            <p>
                                ${card.content}
                            </p>
                        </div>
                        <a class='card-link' target="_blank" href="${card.link}">go to</a>
                    </div>
                </div>`;
    
            newCard.innerHTML = cardHtml;
    
            
    
            newCard.classList.add('flipping');
            // console.log(cardIndex, cards.length);
            if (cardIndex == interface.cards.data.length - 1){
                document.querySelectorAll('.draw-deck')[0].classList.add('opacity_zero');
                document.querySelectorAll('.draw-deck_under-screen')[0].classList.remove('display_none');
            }
            setTimeout(function(){
                newCard.classList.remove('flipping');
                if (document.querySelectorAll('.top_card').length) {document.querySelectorAll('.top_card')[0].classList.remove('top_card');}
                newCard.classList.add('flipped','top_card');
                interface.cards.flipping = false;
            }, 600);
    
            document.querySelectorAll('.cards.container')[0].append(newCard);
        }
    };

    document.querySelectorAll('.draw-deck')[0].addEventListener('click', e => {
        e.preventDefault();
        handleCardFlip(e);
    });

    document.querySelectorAll('.draw-deck')[0].addEventListener('touchmove', e => {
        e.preventDefault();
        interface.cards.touches.push(e);
    });

    document.querySelectorAll('.draw-deck')[0].addEventListener('touchend', e => {
        e.preventDefault();
        // console.log("it's over", e);
        if (interface.cards.touches.length && interface.cards.touches[0].touches[0].clientX > interface.cards.touches[interface.cards.touches.length - 1].touches[0].clientX){
            handleCardFlip(e);
            interface.cards.touches = [];
        }  
        // handleCardFlip(e);
    });
});