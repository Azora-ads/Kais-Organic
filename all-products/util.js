const se = new URLSearchParams(window.location.search);
var keywordsString = se.get('category');
var keywordsArray = [];

var sortValue = se.get('sort');
var searchTxt = se.get('search');
var pageRecent = se.get('previous');
var currentPage = se.get('page');

if (!currentPage) {
    currentPage=1;
}else{
    if (currentPage<0) {
        currentPage=1
    }else if(currentPage==0) {
        currentPage=1;
    }
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


var searchInput = document.getElementById('search-input');
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        search();
    }
});

if (searchTxt) {
    searchInput.value = searchTxt;
}

function search() {
    if (keywordsString) {
        if (sortValue) {
            window.location.href = '/all-products/?category=' + keywordsString + '&sort=' + sortValue + '&search=' + searchInput.value;
        } else {
            window.location.href = '/all-products/?category=' + keywordsString + '&search=' + searchInput.value;
        }
    } else {
        if (sortValue) {
            window.location.href = '/all-products/?sort=' + sortValue + '&search=' + searchInput.value;
        } else {
            window.location.href = '/all-products/?search=' + searchInput.value;
        }
    }
}

var sortPosition = 0;

if (sortValue) {
    var selectElement = document.getElementById("sort-option");

    var selectedValue = sortValue;

    var niceSelect = document.querySelector('.nice-select');
    var options = niceSelect.querySelectorAll('.option');

    for (var i = 0; i < options.length; i++) {
        if (options[i].innerText === selectedValue) {
            sortPosition = i;
            options[i].click();
            document.body.click();

            break;
        }
    }


}

if (keywordsString) {
    keywordsArray = keywordsString.split(',').map(keyword => keyword.trim());
}


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

function applyFilter() {

    var totch = document.getElementById('checkbox-layout').childElementCount;
    var stringChecks = "";

    var shopSelector = document.querySelector('.tp-shop-selector');

    var selectedOption = shopSelector.querySelector('.current');

    var selectedValue = selectedOption.getAttribute('data-value');
    var selectedText = selectedOption.innerText;

    for (let j = 0; j < totch; j++) {
        if (document.getElementById('flexCheckDefault' + j).checked) {
            if (stringChecks == "") {
                stringChecks = document.getElementById('checkid' + j).textContent.toLowerCase();
            } else {
                stringChecks += "," + document.getElementById('checkid' + j).textContent.toLowerCase();
            }
        }
    }
    if (searchTxt) {
        window.location.href = '/all-products/?category=' + stringChecks + '&sort=' + selectedText + '&search=' + searchTxt;
    } else {
        window.location.href = '/all-products/?category=' + stringChecks + '&sort=' + selectedText;
    }

}

const firebaseConfig = decryptConfig({ "YXBpS2V5": "QUl6YVN5Q1YxWjgtRVpXZFV3UG5zQWlQclJuNmhTY2J0OV9Bbkhz", "YXV0aERvbWFpbg==": "a2Fpc29ubGluZS5maXJlYmFzZWFwcC5jb20=", "cHJvamVjdElk": "a2Fpc29ubGluZQ==", "c3RvcmFnZUJ1Y2tldA==": "a2Fpc29ubGluZS5hcHBzcG90LmNvbQ==", "bWVzc2FnaW5nU2VuZGVySWQ=": "MTAzODM4NDU2NjEyNg==", "YXBwSWQ=": "MToxMDM4Mzg0NTY2MTI2OndlYjowYTJkYWIyMmE5MGM3NTAwNjZiYjdm", "bWVhc3VyZW1lbnRJZA==": "Ry0zMzZTVEtDNUhR" });
const app = firebase.initializeApp(firebaseConfig);


const wishlistGet = app.firestore();
wishlistGet.collection("site/tos/wishlists").doc(uniqueDeviceId)
    .get()
    .then((doc) => {
        const data = doc.data();
        wishlistArray = data.docids;
    }).catch(error => {

    });


const firestore1 = firebase.firestore();

const categoriesRef = firestore1.collection("site/tos/categories");

const categoryWrapper = document.getElementById('category-wrapper');
var categoryswiper = new Swiper('.inner-category-active', {
    // Optional parameters
    loop: false,
    slidesPerView: 7,
    spaceBetween: 20,
    autoplay: {
        delay: 3500,
        disableOnInteraction: true,
    },
    breakpoints: {
        '1400': {
            slidesPerView: 7,
        },
        '1200': {
            slidesPerView: 6,
        },
        '992': {
            slidesPerView: 5,
        },
        '768': {
            slidesPerView: 4,
        },
        '576': {
            slidesPerView: 3,
        },
        '0': {
            slidesPerView: 2,
        },
    },
});
var i = 0;
categoriesRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            var catSwiper = document.createElement('div');
            catSwiper.className = "swiper-slide";
            var catItem = document.createElement('div');
            catItem.classList.add('category__item', 'mb-30');
            var catthumb = document.createElement('div');
            catthumb.classList.add('category__thumb', 'fix', 'mb-15');
            var linkcat = document.createElement('a');
            linkcat.href = "/all-products/?category=" + data.category;
            var imgcat = document.createElement('img');
            imgcat.src = data.thumbnail;
            if (sortValue) {
                if (searchTxt) {
                    imgcat.setAttribute("onclick", "window.location.href = '/all-products/?category=" + data.category + "&sort=" + sortValue + "&search=" + searchTxt + "'");
                } else {
                    imgcat.setAttribute("onclick", "window.location.href = '/all-products/?category=" + data.category + "&sort=" + sortValue + "'");
                }
            } else {
                if (searchTxt) {
                    imgcat.setAttribute("onclick", "window.location.href = '/all-products/?category=" + data.category + "&search=" + searchTxt + "'");
                } else {
                    imgcat.setAttribute("onclick", "window.location.href = '/all-products/?category=" + data.category + "'");
                }
            }
            linkcat.appendChild(imgcat);
            catthumb.appendChild(imgcat);
            var catcont = document.createElement('div');
            catcont.className = 'category__content';
            var cattit = document.createElement('h5');
            cattit.className = 'category__title';
            var linkcattit = document.createElement('a');
            linkcattit.href = "/all-products/?category=" + data.category;
            linkcattit.textContent = data.caption;
            cattit.appendChild(linkcattit);
            catcont.appendChild(cattit);
            catItem.appendChild(catthumb);
            catItem.appendChild(catcont);
            catSwiper.appendChild(catItem)


            categoryWrapper.appendChild(catSwiper);
            categoryswiper.update();


            // Create a div element with the "form-check" class
            const formCheckDiv = document.createElement('div');
            formCheckDiv.classList.add('form-check');

            // Create an input element for the checkbox
            const checkboxInput = document.createElement('input');
            checkboxInput.setAttribute('type', 'checkbox');
            checkboxInput.classList.add('form-check-input');
            checkboxInput.id = 'flexCheckDefault' + i;
            checkboxInput.setAttribute('value', '');


            // Create a label element for the checkbox
            const label = document.createElement('label');
            label.classList.add('form-check-label');
            label.setAttribute('for', 'flexCheckDefault' + i);
            label.id = 'checkid' + i;

            if (keywordsArray.includes(data.category.toLowerCase())) {
                checkboxInput.checked = 'true';
            }

            label.textContent = data.category;
            label.style.textTransform = 'capitalize'

            // Append the input and label elements to the div
            formCheckDiv.appendChild(checkboxInput);
            formCheckDiv.appendChild(label);

            // Append the div to a specified parent element (replace 'parentElement' with the actual parent element)
            document.getElementById('checkbox-layout').appendChild(formCheckDiv);

            i = i + 1;
        });
    })
    .catch((error) => {
        console.error("Error retrieving Categories: ", error);
    });



const firestore2 = firebase.firestore();
var mainProductsRef = firestore2.collection('site/tos/products');

var startTitle = (pageRecent) ? pageRecent : 0;

if (searchTxt) {
    keywordsArray.push(searchTxt.trim());
}
if (keywordsArray.length > 0) {
    mainProductsRef = mainProductsRef.where('keywords', 'array-contains-any', keywordsArray);
}
if (sortPosition == 2) {
    mainProductsRef = mainProductsRef.orderBy('price', 'desc');

} else if (sortPosition == 1) {
    mainProductsRef = mainProductsRef.orderBy('price');
} else {

}
var firstTitle = pageRecent;
var lastTitle = "0"
mainProductsRef
    .orderBy('title')
    .startAfter(startTitle)
    .limit(40)
    .get()
    .then(querySnapshot => {
        document.getElementById('buffer').style.display='none';
        querySnapshot.forEach(doc => {
            var data = doc.data();

            lastTitle = data.title;

            document.getElementById('link-previous').href = "javascript:goNext('" + lastTitle + "','previous')";
            document.getElementById('link-next').href = "javascript:goNext('" + lastTitle + "','next')";

            // Create the outermost div with class 'col-lg-12'
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-lg-12');

            // Create the div with class 'tplist__product'
            const tplistProductDiv = document.createElement('div');
            tplistProductDiv.classList.add('tplist__product', 'd-flex', 'align-items-center', 'justify-content-between', 'mb-20');

            // Create the div with class 'tplist__product-img'
            const tplistProductImgDiv = document.createElement('div');
            tplistProductImgDiv.classList.add('tplist__product-img');

            // Create the 'a' tags for the images

            const imgOneLink = document.createElement('a');
            imgOneLink.href = '/shop-details/?productid='+doc.id+"&l="+"0";
            imgOneLink.className = 'tplist__product-img-one';
            const imgOne = document.createElement('img');
            imgOne.style.maxWidth = '200px';
            imgOne.style.margin = '0 10px;';
            imgOne.src = data.images[0];
            imgOne.alt = '';
            imgOneLink.appendChild(imgOne);

            const imgTwoLink = document.createElement('a');
            imgTwoLink.href ='/shop-details/?productid='+doc.id+"&l="+"0"
            imgTwoLink.className = 'tplist__product-img-two';
            const imgTwo = document.createElement('img');
            imgTwo.style.maxWidth = '200px';
            imgTwo.style.margin = '0 10px;';
            imgTwo.src = data.images[0];
            imgTwo.alt = '';
            imgTwoLink.appendChild(imgTwo);

            // Create the 'div' with class 'tpproduct__info bage'
            const tpproductInfoDiv = document.createElement('div');
            tpproductInfoDiv.classList.add('tpproduct__info', 'bage');

            // Create the 'span' for the hot badge
            const hotBadgeSpan = document.createElement('span');
            hotBadgeSpan.classList.add('tpproduct__info-hot', 'bage__hot');
            hotBadgeSpan.textContent = data.label;
            if (data.label=="") {
                hotBadgeSpan.style.display = 'none';
            }

            // Append the hot badge to the tpproductInfoDiv
            tpproductInfoDiv.appendChild(hotBadgeSpan);

            // Append the images and info divs to tplistProductImgDiv
            tplistProductImgDiv.appendChild(imgOneLink);
            tplistProductImgDiv.appendChild(imgTwoLink);
            tplistProductImgDiv.appendChild(tpproductInfoDiv);

            // Create the div with class 'tplist__content'
            const tplistContentDiv = document.createElement('div');
            tplistContentDiv.classList.add('tplist__content');

            // Create the 'span' for the quantity
            const quantitySpan = document.createElement('span');
            quantitySpan.textContent = data.varients[0].label;
            for (let j = 1; j < data.varients.length; j++) {
                quantitySpan.textContent = quantitySpan.textContent+" , "+data.varients[j].label;
            }

            // Create the 'h4' for the product title
            const productTitleLink = document.createElement('a');
            productTitleLink.href = '/shop-details/?productid='+doc.id+"&l="+"0";
            const productTitleH4 = document.createElement('h4');
            productTitleH4.classList.add('tplist__content-title');
            productTitleH4.appendChild(productTitleLink);
            productTitleLink.textContent = data.title;

            // Create the 'ul' for the content info
            const contentInfoUl = document.createElement('ul');
            contentInfoUl.classList.add('tplist__content-info');

            contentInfoUl.innerHTML = data.advantages;

            // Append the elements to the tplistContentDiv
            tplistContentDiv.appendChild(quantitySpan);
            tplistContentDiv.appendChild(productTitleH4);
            tplistContentDiv.appendChild(contentInfoUl);

            // Create the div with class 'tplist__price justify-content-end'
            const tplistPriceDiv = document.createElement('div');
            tplistPriceDiv.classList.add('tplist__price', 'justify-content-end');

            // Create the 'h3' for the count
            const countH3 = document.createElement('h3');
            countH3.classList.add('tplist__count', 'mb-15');
            countH3.textContent = "₹"+data.varients[0].price;
            countH3.style.fontSize='25px';

            if(!data.varients[0].offerprice==""){
                countH3.innerHTML = "₹"+data.varients[0].offerprice + "<del class='del-data'>"+"₹"+data.varients[0].price+"</del>"
            }

            // Create the button for 'Add to cart'
            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('tp-btn-2', 'mb-10');
            addToCartButton.textContent = 'Add to cart';
            addToCartButton.setAttribute('onclick','addToCart("'+doc.id+'",1,0,this)');
            addToCartButton.id="add-cart-btn";

            // Create the div for 'tplist__shopping'
            const tplistShoppingDiv = document.createElement('div');
            tplistShoppingDiv.className = 'tplist__shopping';

            // Create the button for 'wishlist'
            const wishlistButton = document.createElement('button');
            wishlistButton.className = `${(wishlistArray.includes(doc.id) ? 'wishlist-btn-active':'wishlist-btn')}`;
            wishlistButton.addEventListener('click', function () {
                addToWishlist(doc.id,wishlistButton); // Assuming addToWishlist is a function that takes an argument
            });
            const wishlistIcon = document.createElement('i');
            wishlistIcon.className = 'icon-heart icons';
            wishlistButton.innerHTML = wishlistIcon.outerHTML + `${(wishlistArray.includes(doc.id) ? 'Wishlisted':'Wishlist')}`;

            // Append the count, button, and wishlist button to tplistPriceDiv
            tplistPriceDiv.appendChild(countH3);
            tplistPriceDiv.appendChild(addToCartButton);
            tplistPriceDiv.appendChild(tplistShoppingDiv);
            tplistShoppingDiv.appendChild(wishlistButton);

            // Append tplistProductImgDiv, tplistContentDiv, and tplistPriceDiv to tplistProductDiv
            tplistProductDiv.appendChild(tplistProductImgDiv);
            tplistProductDiv.appendChild(tplistContentDiv);
            tplistProductDiv.appendChild(tplistPriceDiv);

            // Append tplistProductDiv to colDiv
            colDiv.appendChild(tplistProductDiv);

            // Append colDiv to the body
            document.getElementById('main-product-lists').appendChild(colDiv);
            document.getElementById('empty-list').style.display='none';
        });
    })
    .catch(error => {
        document.getElementById('error-alert').style.top='50px';
        console.error('Error getting products: ', error);
    });

    
    document.getElementById('curr').textContent=currentPage;
function goNext(newTitle,page) {
    const currentUrl = new URL(window.location.href);
    const newPrevious = newTitle;
    if (page=="previous") {
        currentPage = currentPage-1;
    }else{
        currentPage = currentPage+1;
    }
    currentUrl.searchParams.set('page', currentPage);    
    currentUrl.searchParams.set('previous', newPrevious);
    window.location.href = '/all-products/' + currentUrl.search+"#product-area";
}


function addToWishlist(id, element) {

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
                    element.className = 'wishlist-btn';
                    element.innerHTML = '<i class="icon-heart icons"></i> Wishlist'
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
                element.className = 'wishlist-btn-active';
                element.innerHTML = '<i class="icon-heart icons"></i> Wishlisted'
                    
            })
            .catch((error) => {

            });
    }
}