
const nse = new URLSearchParams(window.location.search);

//document.getElementById('cart-qnty-1')
document.getElementById('cart-qnty-1').textContent = 0;
document.getElementById('cart-qnty-2').textContent = 0;


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

var uDeviceId = getOrCreateDeviceId();



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

var myCarts = [];

var myCartsPrices = [];

var fbConfig = decryptConfig({ "YXBpS2V5": "QUl6YVN5Q1YxWjgtRVpXZFV3UG5zQWlQclJuNmhTY2J0OV9Bbkhz", "YXV0aERvbWFpbg==": "a2Fpc29ubGluZS5maXJlYmFzZWFwcC5jb20=", "cHJvamVjdElk": "a2Fpc29ubGluZQ==", "c3RvcmFnZUJ1Y2tldA==": "a2Fpc29ubGluZS5hcHBzcG90LmNvbQ==", "bWVzc2FnaW5nU2VuZGVySWQ=": "MTAzODM4NDU2NjEyNg==", "YXBwSWQ=": "MToxMDM4Mzg0NTY2MTI2OndlYjowYTJkYWIyMmE5MGM3NTAwNjZiYjdm", "bWVhc3VyZW1lbnRJZA==": "Ry0zMzZTVEtDNUhR" });

let unAssigned = { databaseURL: "https://kaisonline-default-rtdb.asia-southeast1.firebasedatabase.app" }
Object.assign(fbConfig, unAssigned);

const cartApp = firebase.initializeApp(fbConfig, 'secondary');

const cartDB = cartApp.database();
const cartRef = cartDB.ref(uDeviceId + '/MyCarts');


var i = 0;

var cartLists = document.getElementById('cart-lists');

function fetchInitialData() {
    cartRef.once('value')
        .then(function (snapshot) {
            i = 0;
            document.getElementById('cart-qnty-1').textContent = i;
            document.getElementById('cart-qnty-2').textContent = i;

            snapshot.forEach(function (childSnapshot) {
                i = i + 1;
                document.getElementById('cart-qnty-1').textContent = i;
                document.getElementById('cart-qnty-2').textContent = i;
                var returnData = childSnapshot.val();

                if (nse.get('productid') == returnData.prid && nse.get('l') == returnData.labelid) {
                    document.getElementById('add-cart-btn').textContent = 'Added';
                }
                const cartlistRef = cartApp.firestore();
                cartlistRef.collection("site/tos/products").doc(returnData.prid)
                    .get()
                    .then((doc) => {
                        const data = doc.data();
                        var cartlistTemplate = `
                    <li id="child-${doc.id}-${returnData.labelid}">
                        <div class="tpcart__item">
                           <div class="tpcart__img">
                              <img src="${data.images[0]}" alt="">
                              <div class="tpcart__del">
                                 <button onclick="removeFromCart('${doc.id}','${returnData.labelid}')"><i class="icon-x-circle"></i></button>
                              </div>
                           </div>
                           <div class="tpcart__content">
                              <span class="tpcart__content-title"><a href="/shop-details/?productid=${doc.id}&l=${returnData.labelid}">(${data.varients[returnData.labelid].label}) ${data.title}</a>
                              </span>
                              <div class="tpcart__cart-price">
                                 <span class="quantity" id="quantity-${doc.id}-${returnData.labelid}">${returnData.quantity} x</span>
                                 <span class="new-price">₹${(data.varients[returnData.labelid].offerprice == "") ? data.varients[returnData.labelid].price : data.varients[returnData.labelid].offerprice}</span>
                              </div>
                           </div>
                        </div>
                     </li>
                    `;
                        let newObjectPrice = {
                            id: doc.id,
                            labelid: returnData.labelid,
                            price: (data.varients[returnData.labelid].offerprice == "") ? data.varients[returnData.labelid].price : data.varients[returnData.labelid].offerprice,
                            qty: returnData.quantity
                        }
                        myCartsPrices.push(newObjectPrice);
                        var subt = 0;
                        for (let j = 0; j < myCartsPrices.length; j++) {
                            subt = subt + (Number(myCartsPrices[j].price) * Number(myCartsPrices[j].qty))
                        }
                        document.getElementById('total-price-navbar').textContent = '₹' + subt;
                        cartLists.innerHTML = cartlistTemplate + cartLists.innerHTML;
                    })
                    .catch((error) => {

                    });
            });
        })
        .catch(function (error) {
            console.error('Error fetching initial data:', error);
        });
}

fetchInitialData();

function removeFromCart(docid, la) {
    const delChildRef = cartRef.child(docid + "?" + la);
    delChildRef.remove()
        .then(() => {
            for (let i = 0; i < myCartsPrices.length; i++) {
                if (myCartsPrices[i].id == docid && myCartsPrices[i].labelid == la) {
                    myCartsPrices.splice(i, 1);
                    document.getElementById('child-' + docid + '-' + la).style.display = 'none';
                    document.getElementById('cart-qnty-1').textContent = Number(document.getElementById('cart-qnty-1').textContent) - 1;
                    document.getElementById('cart-qnty-2').textContent = Number(document.getElementById('cart-qnty-2').textContent) - 1;
                }
        
            }
        })
        .catch((error) => {
            console.error(`Error removing item: ${error.message}`);
        });
}

function addToCart(id, qty, labelid, self) {
    subt= 0;
    cartRef
        .child(id + "?" + labelid)
        .set({
            prid: id,
            quantity: qty,
            labelid: labelid
        });
    i = 0;
    cartRef.on('child_added', function (childSnapshot) {
        self.textContent = "Added";
        var returnData = childSnapshot.val();
        cartLists.innerHTML='';
        document.getElementById('cart-button').click();
        const cartlistRef = firebase.firestore();
                cartlistRef.collection("site/tos/products").doc(returnData.prid)
                    .get()
                    .then((doc) => {
                        const data = doc.data();
                        var cartlistTemplate = `
                    <li id="child-${doc.id}-${returnData.labelid}">
                        <div class="tpcart__item">
                           <div class="tpcart__img">
                              <img src="${data.images[0]}" alt="">
                              <div class="tpcart__del">
                                 <button onclick="removeFromCart('${doc.id}','${returnData.labelid}')"><i class="icon-x-circle"></i></button>
                              </div>
                           </div>
                           <div class="tpcart__content">
                              <span class="tpcart__content-title"><a href="/shop-details/?productid=${doc.id}&l=${returnData.labelid}">(${data.varients[returnData.labelid].label}) ${data.title}</a>
                              </span>
                              <div class="tpcart__cart-price">
                                 <span class="quantity" id="quantity-${doc.id}-${returnData.labelid}">${returnData.quantity} x</span>
                                 <span class="new-price">₹${(data.varients[returnData.labelid].offerprice == "") ? data.varients[returnData.labelid].price : data.varients[returnData.labelid].offerprice}</span>
                              </div>
                           </div>
                        </div>
                     </li>
                    `;
                    if (!myCarts.includes(returnData.prid + "?" + returnData.labelid)) {
                        let newObjectPrice = {
                            id: doc.id,
                            labelid: returnData.labelid,
                            price: (data.varients[returnData.labelid].offerprice == "") ? data.varients[returnData.labelid].price : data.varients[returnData.labelid].offerprice,
                            qty: returnData.quantity
                        }
                        myCartsPrices.push(newObjectPrice);
                    }
                    var subt = 0;
                        for (let j = 0; j < myCartsPrices.length; j++) {
                            subt = subt + (Number(myCartsPrices[j].price) * Number(myCartsPrices[j].qty))
                        }
                        document.getElementById('total-price-navbar').textContent = '₹' + subt;
                    cartLists.innerHTML = cartlistTemplate + cartLists.innerHTML;

                        
                    })
                    .catch((error) => {

                    });
        
        document.getElementById('total-price-navbar').textContent = '₹' + subt;
        if (!myCarts.includes(returnData.prid + "?" + returnData.labelid)) {
            document.getElementById('cart-button').click();
            myCarts.push(returnData.prid + "?" + returnData.labelid);
            document.getElementById('cart-qnty-1').textContent = myCarts.length;
            document.getElementById('cart-qnty-2').textContent = myCarts.length;
        }


    });
    cartRef.on('child_changed', function (childSnapshot) {
        var returnData = childSnapshot.val();
        document.getElementById('cart-button').click();
        document.getElementById('cart-qnty-1').textContent = myCarts.length;
        document.getElementById('cart-qnty-2').textContent = myCarts.length;
        document.getElementById('quantity-' + returnData.prid + '-' + returnData.labelid).textContent = returnData.quantity + " x";

        for (let i = 0; i < myCartsPrices.length; i++) {
            if (returnData.prid == myCartsPrices[i].id && returnData.labelid == myCartsPrices[i].labelid) {
                myCartsPrices[i].qty = returnData.quantity;
            }
        }
        var subt = 0;
        for (let j = 0; j < myCartsPrices.length; j++) {
            subt = subt + (Number(myCartsPrices[j].price) * Number(myCartsPrices[j].qty))
        }
        document.getElementById('total-price-navbar').textContent = '₹' + subt;
    });

}