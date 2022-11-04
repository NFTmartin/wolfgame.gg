//////////////////////////////////////
//Main Javascript code for WOLFGAME.gg
//////////////////////////////////////

import "https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js"

// Create a variable for the API endpoint. In this example, we're accessing Xano's API
let xanoUrl = new URL('https://xtbc-tszb-uv6h.f2.xano.io/api:8LJ-JoNQ');
let clicked_id;

let community = document.getElementById("Community-selecter");
let searchbox = document.getElementById("searchbox");
let color_overlay = document.getElementById("Color-overlay");
let overlay_tokenId = document.getElementById("tokenId-selecter");
let overlay_ens = document.getElementById("ens-selecter");
let overlay_raw = document.getElementById("raw-selecter");
let overlay_socials = document.getElementById("socials-selecter");
let overlay_resources = document.getElementById("resources-selecter");
let checkbox_search_clear = document.getElementById("clear-selecter");

let welcome_screen = document.getElementById("welcome-screen");
let dont_bother_check = document.getElementById("dont-bother-again-check");
let i_agree_button = document.getElementById("i-agree-button");

let community_value = community.value;
let tokenId_value = overlay_tokenId.checked;

// welcome screen hide on-click
i_agree_button.addEventListener("click", function(){ 
    //sets cookie to hide welcome screen in the future
   if (dont_bother_check.checked === true) {
    setCookie('hideWelcome', true, 1)
    console.log(getCookie('hideWelcome'))
   } else {
    setCookie('hideWelcome', false, 1)
   }
   welcome_screen.style.display = 'block';
   pz.resume();
});

// detect change in cummunity selection
community.addEventListener("change", function(){ 
    console.log('community changed to:' + community.value)
    getLandData(community.value)
});

//detect search input change
searchbox.addEventListener("input", function(){ 
    console.log('search'+searchbox.value)
    search(searchbox.value)
    console.log('search'+searchbox.value)
});

//detect clear-search checked-status change
checkbox_search_clear.addEventListener("click", function(){ 
    $('.div-overlay-search-color').css( 'display', 'none');
});

// detect change in color-overlay selection
color_overlay.addEventListener("change", function(){ 
    console.log(color_overlay.value)
    setVisibilityColor();
});

// detect change in data-overlay selection
overlay_tokenId.addEventListener("click", function(){ 
    console.log(overlay_tokenId.checked)
    setVisibilityData(overlay_tokenId, ".text-token-id");
});

overlay_ens.addEventListener("click", function(){ 
    console.log(overlay_tokenId.checked)
    setVisibilityData(overlay_ens, ".text-overlay-ens-holder");
});

overlay_raw.addEventListener("click", function(){ 
    console.log(overlay_tokenId.checked)
    setVisibilityData(overlay_raw, ".text-overlay-raw-holder");
});

overlay_socials.addEventListener("click", function(){ 
    console.log(overlay_tokenId.checked)
    setVisibilityData(overlay_socials, ".text-overlay-social-handle");
});

overlay_resources.addEventListener("click", function(){ 
    console.log(overlay_tokenId.checked)
    setVisibilityData(overlay_resources, ".text-token-id");
});

//nav on-click events
let aboutButton = document.getElementById("aboutLink");
aboutButton.addEventListener("click", function(){ 
    console.log('about clicked')
    //aboutButton.style.display = 'flex';
    $('.about-screen-v2').css( 'display', 'flex');
});

let aboutCloseButton = document.getElementById("aboutCloseButton");
aboutCloseButton.addEventListener("click", function(){ 
    console.log('about closed')
    //aboutCloseButton.style.display = 'none';
    $('.about-screen-v2').css( 'display', 'none');
});

//working with cookies
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

//checking stored cookies on page load
function checkCookies(){
    console.log('check cookies started')
    // - hide welcome
    console.log(getCookie('hideWelcome'))
    if (getCookie('hideWelcome') === "false" || getCookie('hideWelcome') === ""){
        welcome_screen.style.display = 'flex';
        console.log('welcome set to flex')
    } else {
        //pz.resume();
    }
}

//site functions
function setVisibilityData(checkboxElement, className) {
    setNewUrl ();

    if (checkboxElement.checked == false) {
        $(className).css( 'display', 'none');
        console.log('value: '+checkboxElement.checked);
        console.log('set to hidden');
    } else if (checkboxElement.checked == true) {
        $(className).css( 'display', 'block');
        console.log('value: '+checkboxElement.checked);
        console.log('set to vissible');
    }
}
function setVisibilityColor() {
    setNewUrl ();

    if (color_overlay.value == 0) {
        $('.div-overlay-color').css( 'display', 'none');
        console.log('value: 0');
        console.log('set to hidden');
    } else if (color_overlay.value == 1) {
        $('.div-grid-item-wg-color').css( 'display', 'block');
        $('.div-overlay-color').css( 'display', 'block');
        $('.div-overlay-owner-color').css( 'display', 'block');
        $('.div-overlay-resources-color').css( 'display', 'none');
        console.log('value: 1');
        console.log('set to owner');
    } else if (color_overlay.value == 2) {
        $('.div-grid-item-wg-color').css( 'display', 'block');
        $('.div-overlay-color').css( 'display', 'block');
        $('.div-overlay-resources-color').css( 'display', 'block');
        $('.div-overlay-owner-color').css( 'display', 'none');
        console.log('value: 2');
        console.log('set to resources');
    }
}

function getNewUrl () {
    return window.location.protocol + "//" + window.location.host + window.location.pathname + '?com=' + community.value + '&color=' + color_overlay.value + '&tID=' + overlay_tokenId.checked + '&ens=' + overlay_ens.checked + '&raw=' + overlay_raw.checked +'&social=' + overlay_socials.checked + '&res=' + overlay_resources.checked + '&cID=' + clicked_id;
}

function setNewUrl () {
    let newurl = getNewUrl();
    window.history.pushState({ path: newurl }, '', newurl);
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function openDetailsWindow(){
    // to do
}

function search(searchQuery){
    removeElementsByClass('search-result-item');
    //deletes old search results
    if (checkbox_search_clear.checked == true) {
        $('.div-overlay-search-color').css( 'display', 'none');
        console.log('result cleared, checked:'+checkbox_search_clear.checked)
    }

    let request = new XMLHttpRequest();
    let url;
    //let url = xanoUrl.toString() + '/searchLand' + '?searchQuery=' + searchQuery + '&type=com';
    if (searchQuery.startsWith("c")){
        url = xanoUrl.toString() + '/searchLand' + '?searchQuery=' + searchQuery.trimStart("c") + '&type=com';
        console.log(url)
    } else if (searchQuery.startsWith("#")){
        url = xanoUrl.toString() + '/searchLand' + '?searchQuery=' + searchQuery.trimStart("#") + '&type=id';
        console.log(url)
    } else {
        url = xanoUrl.toString() + '/searchLand' + '?searchQuery=' + searchQuery.trimStart("#") + '&type=id';
        console.log(url)
    }
    console.log(url)

    request.open('GET', url, true)
    console.log('request opened')
    console.log(request)

    request.onload = function() {
        console.log('request loaded')
        // Store what we get back from the Xano API as a variable called 'data' and converts it to a javascript object
        let data = JSON.parse(this.response)
        console.log(data)
        removeElementsByClass('search-result-item');

        if (data.length === 0){
            console.log('array is empty')
            $('.search-result-item-no-result').css( 'display', 'flex');

        } else {
            // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
            if (request.status >= 200 && request.status < 400) {
                $('.search-result-item-no-result').css( 'display', 'none');

                // Map a variable called cardContainer to the Webflow element called "Cards-Container"
                const searchResultContainer = document.getElementById("searchResults")

                // This is called a For Loop. This goes through each object being passed back from the Xano API and does something.
                // Specifically, it says "For every element in Data (response from API), call each individual item restaurant"
                data.forEach(landID => {
                    //console.log(landID)
                    const resultstyle = document.getElementById('searchResultSample')
                    // Copy the card and it's style
                    const resultcard = resultstyle.cloneNode(true)

                    resultcard.setAttribute('id', landID.tokenId);
                    resultcard.className = "search-result-item";
                    resultcard.style.display = 'block';

                    resultcard.addEventListener('click', function() {
                        console.log('result clicked:'+landID.tokenId)
                        //deletes old search results
                        if (checkbox_search_clear.checked == true) {
                            $('.div-overlay-search-color').css( 'display', 'none');
                            console.log('result cleared')
                        }

                        //if needed changes community, and highlights the search result
                        if(community.value != landID.community){
                            getLandData(landID.community);
                            
                            setTimeout(function(){
                                console.log('dom loaded');
                                community.value = landID.community;
                                $('.div-overlay-color').css( 'display', 'block');
                                $('.div-overlay-resources-color').css( 'display', 'none');
                                $('.div-overlay-owner-color').css( 'display', 'none');
                                console.log('search'+landID.tokenId)
                                let selecter = document.getElementById('search'+landID.tokenId)
                                console.log('selecter: '+selecter)
                                selecter.style.display = 'block'
                              }, 1000);
                            
                        } else {
                            console.log('dom loaded');
                            community.value = landID.community;
                            $('.div-overlay-color').css( 'display', 'block');
                            $('.div-overlay-resources-color').css( 'display', 'none');
                            $('.div-overlay-owner-color').css( 'display', 'none');
                            console.log('search'+landID.tokenId)
                            let selecter = document.getElementById('search'+landID.tokenId)
                            console.log('selecter: '+selecter)
                            selecter.style.display = 'block'
                        }
                       
                    }); 

                    const img = resultcard.getElementsByTagName('IMG')[0]
                    img.src = landID.editedUrlWebp;
    
                    const tokenIdText = resultcard.querySelector("div.search-result-text-wrapper > div.search-result-tokenid")
                    tokenIdText.textContent = 'TOKENID #'+landID.tokenId;

                    const communityText = resultcard.querySelector("div.search-result-text-wrapper > div.search-result-community")
                    communityText.textContent = 'Community: '+landID.community;

                    searchResultContainer.appendChild(resultcard);
                });
            }
        }
    }
    request.send();
}

function getLandData(communityNumber) {
    removeElementsByClass('div-grid-item-wg-data');
    removeElementsByClass('div-grid-item-wg-color');
    // set community number header above map
    const community_text = document.getElementById('community-text')
    community_text.textContent = 'Community:'+communityNumber;

    let request = new XMLHttpRequest();
    let url = xanoUrl.toString() + '/wg_land' + '?com=' + communityNumber;

    request.open('GET', url, true)

    request.onload = function() {

        // Store what we get back from the Xano API as a variable called 'data' and converts it to a javascript object
        let data = JSON.parse(this.response)

        // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
        if (request.status >= 200 && request.status < 400) {
            // Map a variable called cardContainer to the Webflow element called "Cards-Container"
            const landDataContainer = document.getElementById("land-data-container")
            const landColorContainer = document.getElementById("land-color-container")

            // This is called a For Loop. This goes through each object being passed back from the Xano API and does something.
            // Specifically, it says "For every element in Data (response from API), call each individual item restaurant"
            data.forEach(landID => {
                
                // For each restaurant, create a div called card and style with the "Sample Card" class
                const imgstyle = document.getElementById('data_sample')
                const datastyle = document.getElementById('color_sample')
                // Copy the card and it's style
                const imgcard = imgstyle.cloneNode(true)
                const datacard = datastyle.cloneNode(true)

                imgcard.setAttribute('id', 'img'+landID.tokenId);
                imgcard.className = "div-grid-item-wg-data";
                imgcard.style.display = 'block';
                //datacard.style.zIndex = 200000-landID.tokenId;

                datacard.setAttribute('id', 'data'+landID.tokenId);
                datacard.className = "div-grid-item-wg-color";
                datacard.style.display = 'block';
                //colorcard.style.zIndex = 200000-landID.tokenId;

                

                console.log('land loaded');

                clicked_id = landID.tokenId;

                // action when land is pressed
                imgcard.addEventListener('click', function() {
                    console.log(landID.tokenId)
                    //let cID = String(landID.tokenId);
                    //console.log(cID);
                    clicked_id = landID.tokenId;
                    console.log(clicked_id);
                    setNewUrl ();
                });  
                
                datacard.addEventListener('click', function() {
                    console.log(landID.tokenId)
                    //let cID = String(landID.tokenId);
                    //console.log(cID);
                    clicked_id = landID.tokenId;
                    console.log(clicked_id);
                    setNewUrl ();
                }); 
                
                // background img
                const img = imgcard.getElementsByTagName('IMG')[0]
                img.src = landID.png550x550x10qUrl; // using Xano's template engine to re-size the pictures down and make them a box
                
                // overlay-data
                const tokenIdText = datacard.querySelector("div.div-overlay-data > div.text-token-id")
                tokenIdText.textContent = 'TOKENID #'+landID.tokenId;

                const ensNameText = datacard.querySelector("div.div-overlay-data > div.div-holder-text-wrapper > div.text-overlay-ens-holder")
                ensNameText.textContent = landID.__owners[0].ENSname;

                const rawAddresText = datacard.querySelector("div.div-overlay-data > div.div-holder-text-wrapper > div.text-overlay-raw-holder")
                rawAddresText.textContent = landID.__owners[0].Ethereum_address;

                const socialsText = datacard.querySelector("div.div-overlay-data > div.div-holder-text-wrapper > div.text-overlay-raw-holder")
                rawAddresText.textContent = landID.__owners[0].Ethereum_address;


                // overlay-color
                const colorGreen = datacard.querySelector("div.div-overlay-color > div.div-overlay-resources-color > div.div-overlay-resources-green")
                colorGreen.style.backgroundColor = landID.greenColorValue;

                const colorGrey = datacard.querySelector("div.div-overlay-color > div.div-overlay-resources-color > div.div-overlay-resources-grey")
                colorGrey.style.backgroundColor = landID.greyColorValue;
                
                const colorBlue = datacard.querySelector("div.div-overlay-color > div.div-overlay-resources-color > div.div-overlay-resources-blue")
                colorBlue.style.backgroundColor = landID.blueColorValue;

                const colorBrown = datacard.querySelector("div.div-overlay-color > div.div-overlay-resources-color > div.div-overlay-resources-brown")
                colorBrown.style.backgroundColor = landID.brownColorValue;

                const colorOwner = datacard.querySelector("div.div-overlay-color > div.div-overlay-owner-color")
                colorOwner.style.backgroundColor = landID.__owners[0].Occupation_color;

                const colorSearch = datacard.querySelector("div.div-overlay-color > div.div-overlay-search-color")
                colorSearch.setAttribute('id', 'search'+landID.tokenId)
                colorSearch.style.backgroundColor = 'rgba(176, 29, 24, 0.9)'
                colorSearch.style.display = 'none'

                $('.div-overlay-color').css( 'display', 'none');
                $('.text-overlay-social-handle').css( 'display', 'none');

                // add card to map
                landDataContainer.appendChild(imgcard);
                landColorContainer.appendChild(datacard);
            })
        }
    }

    // Send Restaurant request to API
    request.send();
}

(function() {
    checkCookies();
    setNewUrl ();
    getLandData(community_value);  

})();

/*//////////
panzoom code
//////////*/
//import "https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js"

let draggableMap = document.getElementById('scene')

// and forward it it to panzoom.
let pz = panzoom(draggableMap,{
    zoomSpeed: 0.2, // 6.5% per mouse wheel event
    maxZoom: 1.1,
    minZoom: 0.075,
    smoothScroll: false,
    zoomDoubleClickSpeed: 1, 
    initialX: 220,
    initialY: 172,
    initialZoom: 0.75,
    //bounds: true,
    //boundsPadding: 0.15,
    
});
//pz.pause();

function pausePan(e) {
e.preventDefault();
pz.pause();
}

function resumePan(e) {
e.preventDefault();
pz.resume();
}