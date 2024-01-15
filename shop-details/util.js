
const se = new URLSearchParams(window.location.search);
var id = se.get('productid');
var labelID = se.get('l');
var deviceId = window.navigator.userAgent.replace(/\D/g, '');
var keywordsString = [];
var wishlistCounter = 0;
var startTitle = "0";

if (!labelID) {
    labelID = 0;
}


function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const uniqueDeviceId = getOrCreateDeviceId();


wishlistArray = [];


document.getElementById('btn-sh').addEventListener('click', async () => {
    if (navigator.canShare) {
        navigator.share({
          title: "Page Title",
          text: "brief description",
          url: window.location.href,
        });
    }
});
function refreshPage(id, pos) {
    window.location.href = "/shop-details/?productid=" + id + "&l=" + pos;
}

if (!id) {
    window.location.href = '/NOPRODUCTFOUND';
} else {


    function decryptConfig(encryptedConfig) {
        let decryptedConfig = {};

        for (const encryptedKey in encryptedConfig) {
            if (encryptedConfig.hasOwnProperty(encryptedKey)) {
                const key = atob(encryptedKey);
                const value = atob(encryptedConfig[encryptedKey]);
                decryptedConfig[key] = value;
            }
        }

        return decryptedConfig;
    }


    const firebaseConfig = decryptConfig({ "YXBpS2V5": "QUl6YVN5Q1YxWjgtRVpXZFV3UG5zQWlQclJuNmhTY2J0OV9Bbkhz", "YXV0aERvbWFpbg==": "a2Fpc29ubGluZS5maXJlYmFzZWFwcC5jb20=", "cHJvamVjdElk": "a2Fpc29ubGluZQ==", "c3RvcmFnZUJ1Y2tldA==": "a2Fpc29ubGluZS5hcHBzcG90LmNvbQ==", "bWVzc2FnaW5nU2VuZGVySWQ=": "MTAzODM4NDU2NjEyNg==", "YXBwSWQ=": "MToxMDM4Mzg0NTY2MTI2OndlYjowYTJkYWIyMmE5MGM3NTAwNjZiYjdm", "bWVhc3VyZW1lbnRJZA==": "Ry0zMzZTVEtDNUhR" });
    const app = firebase.initializeApp(firebaseConfig);

    const wishlistGet = app.firestore();
    wishlistGet.collection("site/tos/wishlists").doc(uniqueDeviceId)
        .get()
        .then((doc) => {
            const data = doc.data();
            wishlistArray = data.docids;
            if (wishlistArray.includes(id)) {
                document.getElementById('btn-wl').className = 'wishlist-btn-active';
                document.getElementById('btn-wl').innerHTML = '<i class="icon-heart"></i> WISHLISTED';
            } else {
                document.getElementById('btn-wl').className = 'wishlist-btn';
                document.getElementById('btn-wl').innerHTML = '<i class="icon-heart"></i> ADD TO WISHLIST';
            }
        }).catch(error => {

        });

    //Fetch Title
    const firestore1 = app.firestore();
    const productDetailsRef = firestore1.collection("site/tos/products").doc(id);
    productDetailsRef.get()
        .then((doc) => {
            const data = doc.data();
            if (data == null) {
                window.location.href = '/NOPRODUCTFOUND';
            } else {
                document.getElementById('buffer').style.display = 'none';

                document.getElementById('title-txt').textContent = data.title;
                const maxWidth = window.innerWidth;

                startTitle = (maxWidth > 994) ? data.title : 0;
                document.getElementById('cat-txt').textContent = data.categories;
                document.getElementById('adv-txt').innerHTML = data.advantages;
                document.getElementById('product-description').innerHTML = data.description;
                if (data.label == "") {
                    document.getElementById('label-txt-cont').style.display = 'none';
                } else {
                    document.getElementById('label-txt-cont').innerHTML = data.label;
                }
                keywordsString = data.keywords;
                if (data.varients[labelID].offerprice == "") {
                    document.getElementById('price-txt').textContent = "₹" + data.varients[labelID].price;
                    document.getElementById('spec-price-txt').style.display = 'none';
                } else {
                    document.getElementById('price-txt').textContent = "₹" + data.varients[labelID].offerprice;
                    document.getElementById('spec-price-txt').textContent = "₹" + data.varients[labelID].price;
                }
                var mainThumb = document.getElementById('nav-tabContents');
                var navTabLayout = document.getElementById('nav-tab');

                var imageArray = data.images;
                for (let i = 0; i < imageArray.length; i++) {
                    var div1 = document.createElement('div');
                    div1.classList.add('tab-pane', 'fade', 'show', 'w-img');
                    if (i == 0) {
                        div1.classList.add('active');
                    }
                    div1.id = "nav-" + i;
                    div1.setAttribute('role', 'tabpanel');
                    div1.setAttribute('aria-labelledby', 'nav-' + i + '-tab');
                    div1.setAttribute('tabindex', '0');
                    var img1 = document.createElement('img');
                    img1.src = imageArray[i];
                    img1.style.maxWidth = '400px';
                    img1.style.margin='0 20px';
                    img1.style.height = '400px';
                    img1.style.objectFit = 'contain';
                    img1.style.margin = '0 10px';
                    img1.alt = "";
                    div1.appendChild(img1);
                    mainThumb.appendChild(div1);

                    var button1 = document.createElement('button');
                    button1.classList.add('nav-link');
                    if (i == 0) {
                        button1.classList.add('active');
                    }
                    button1.id = 'nav-' + i + '-tab';
                    button1.setAttribute('data-bs-toggle', 'tab');
                    button1.setAttribute('data-bs-target', '#nav-' + i + '');
                    button1.setAttribute('role', 'tab');
                    button1.setAttribute('aria-controls', 'nav-' + i + '');
                    button1.setAttribute('aria-selected', 'true');
                    button1.type = 'button';
                    var img2 = document.createElement('img');
                    img2.src = imageArray[i];
                    img2.alt = "";
                    button1.appendChild(img2);
                    navTabLayout.appendChild(button1);
                }
                var varientsArray = data.varients;
                var buttonLists = document.getElementById('button-lists');
                for (let k = 0; k < varientsArray.length; k++) {
                    var button2 = document.createElement('button');
                    button2.textContent = varientsArray[k].label + " : " + varientsArray[k].price;
                    button2.id = 'varient-btn-' + k;

                    button2.setAttribute("onclick", "refreshPage('" + doc.id + "','" + k + "')");
                    if (k == labelID) {
                        button2.style.background = '#859A00';
                        button2.style.color = '#FFFFFF';
                    }
                    buttonLists.appendChild(button2);
                }

                document.getElementById('show-more-btn').href = '/all-products/?category=' + data.keywords + '#product-area';
                const firestore2 = firebase.firestore();
                const collectionRef = firestore2.collection('site/tos/products');

                var relatedPr = document.getElementById('related-pr');
                for (let j = 0; j < keywordsString.length; j++) {
                    for (let i = 0; i < keywordsString.length; i++) {
                        if(keywordsString[i].length>25 || keywordsString[i]=="" || keywordsString[i] == keywordsString[j]){
                            keywordsString.splice(i,1);
                        }
                    }                    
                }
                console.log(keywordsString)
                collectionRef
                    .where('categories', 'in', keywordsString)
                    .orderBy('title')
                    .startAfter(startTitle)
                    .limit(4)
                    .get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            // Access the data from each document
                            const data = doc.data();
                            // Create the outer div
                            var productItemDiv = document.createElement("div");
                            productItemDiv.className = "tpsidebar__product-item";

                            // Create the thumbnail div
                            var productThumbDiv = document.createElement("div");
                            productThumbDiv.className = "tpsidebar__product-thumb p-relative";

                            // Create the image element and set its attributes
                            var imgElement = document.createElement("img");
                            imgElement.src = data.images[0];
                            imgElement.alt = "";

                            // Create the info div
                            var infoDiv = document.createElement("div");
                            infoDiv.className = "tpsidebar__info bage";

                            // Create the span element for the "HOT" badge
                            var hotSpan = document.createElement("span");
                            hotSpan.className = "tpproduct__info-hot bage__hot";
                            hotSpan.textContent = data.label;

                            // Append the hotSpan to the infoDiv
                            infoDiv.appendChild(hotSpan);

                            // Append the imgElement and infoDiv to the productThumbDiv
                            productThumbDiv.appendChild(imgElement);
                            productThumbDiv.appendChild(infoDiv);

                            // Create the content div
                            var productContentDiv = document.createElement("div");
                            productContentDiv.className = "tpsidebar__product-content";

                            // Create the category span
                            var categorySpan = document.createElement("span");
                            categorySpan.className = "tpproduct__product-category";

                            // Create the anchor element for the category link
                            var categoryLink = document.createElement("a");
                            categoryLink.href = "/shop-details/?productid=" + doc.id;
                            categoryLink.textContent = data.title;

                            // Append the categoryLink to the categorySpan
                            categorySpan.appendChild(categoryLink);

                            // Create the title heading
                            var titleHeading = document.createElement("h4");
                            titleHeading.className = "tpsidebar__product-title";

                            // Create the anchor element for the title link
                            var titleLink = document.createElement("a");
                            titleLink.href = "shop-details-3.html";
                            titleLink.textContent = data.description;

                            // Append the titleLink to the titleHeading
                            titleHeading.appendChild(titleLink);

                            // Create the price div
                            var priceDiv = document.createElement("div");
                            priceDiv.className = "tpproduct__price";

                            if (data.offerprice == "") {
                                var priceSpan = document.createElement("span");
                                priceSpan.textContent = "₹" + data.varients[0].price;
                            } else {
                                var priceSpan = document.createElement("span");
                                priceSpan.textContent = "₹" + data.varients[0].offerprice;

                                var delElement = document.createElement("del");
                                delElement.style.marginLeft = '10px';
                                delElement.textContent = "₹" + data.varients[0].price;
                            }


                            // Append the priceSpan and delElement to the priceDiv
                            priceDiv.appendChild(priceSpan);
                            priceDiv.appendChild(delElement);

                            // Append the categorySpan, titleHeading, and priceDiv to the productContentDiv
                            productContentDiv.appendChild(categorySpan);
                            productContentDiv.appendChild(titleHeading);
                            productContentDiv.appendChild(priceDiv);

                            // Append the productThumbDiv and productContentDiv to the productItemDiv
                            productItemDiv.appendChild(productThumbDiv);
                            productItemDiv.appendChild(productContentDiv);

                            // Append the productItemDiv to the document body or any other container you want
                            relatedPr.appendChild(productItemDiv);

                        });
                    })
                    .catch(error => {
                        console.error('Error getting documents: ', error);
                        document.getElementById('error-alert').style.top = '50px';
                    });
            }
        }).catch(error => {
            console.error('Error getting documents: ', error);
            document.getElementById('error-alert').style.top = '50px';
        });


}


function addToWishlist(id) {

    if (wishlistArray.includes(id)) {
        const indexToRemove = wishlistArray.indexOf(id);
        if (indexToRemove !== -1) {
            wishlistArray.splice(indexToRemove, 1);
            const wishlistRef = firebase.firestore();
            const data = {
                docids: wishlistArray,
            };
            wishlistRef.collection("site/tos/wishlists").doc(uniqueDeviceId)
                .set(data, { merge: true })
                .then((docRef) => {
                    document.getElementById('btn-wl').className = 'wishlist-btn';
                    document.getElementById('btn-wl').innerHTML = '<i class="icon-heart"></i> ADD TO WISHLIST';
                })
                .catch((error) => {

                });
        }

    } else {
        wishlistArray.push(id);
        const wishlistRef = firebase.firestore();
        const data = {
            docids: wishlistArray,
        };
        wishlistRef.collection("site/tos/wishlists").doc(uniqueDeviceId)
            .set(data, { merge: true })
            .then((docRef) => {
                document.getElementById('btn-wl').className = 'wishlist-btn-active';
                document.getElementById('btn-wl').innerHTML = '<i class="icon-heart"></i> WISHLISTED';

            })
            .catch((error) => {

            });
    }
}