
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

function decryptConfig(encryptedConfig) {
    let decryptedConfig = {};

    for (const encryptedKey in encryptedConfig) {
        if (encryptedConfig.hasOwnProperty(encryptedKey)) {
            const key = atob(encryptedKey);
            const value = atob(encryptedConfig[encryptedKey]); // Base64 decode the value
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
    }).catch(error => {

    });


const db = app.firestore();

const headerRef = db.collection("site/tos/headerslides");

const headerSwiper = document.getElementById('header-swiper');
var sliderswiper = new Swiper('.slider-active', {
    loop: true,
    slidesPerView: 1,
    fade: true,
    effect: "fade",
    autoplay: {
        delay: 4000,
        disableOnInteraction: true,
    },
    navigation: {
        nextEl: '.tpslider__arrow-prv',
        prevEl: '.tpslider__arrow-nxt',
    },
    pagination: {
        el: ".slider-pagination",
        clickable: true,
    },
});
headerRef.get()
    .then((querySnapshot) => {
        document.getElementById('buffer').style.display='none';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            var swiperSlide = document.createElement('div');
            swiperSlide.classList.add('swiper-slide');

            var tpslider = document.createElement('div');
            tpslider.classList.add('tpslider', 'pt-90', 'pb-0', 'grey-bg');
            tpslider.setAttribute('data-background', '/assets/img/slider/shape-bg.jpg');

            var container = document.createElement('div');
            container.classList.add('container');
            container.style.setProperty('--bs-gutter-x', '0px');

            var row = document.createElement('div');
            row.classList.add('row', 'align-items-center');

            var leftColumn = document.createElement('div');
            leftColumn.classList.add('col-xxl-5', 'col-lg-6', 'col-md-6', 'col-12', 'col-sm-6');

            var tpsliderContent = document.createElement('div');
            tpsliderContent.classList.add('tpslider__content', 'pt-20');
            tpsliderContent.style.margin = '0px 20px';

            var subTitle = document.createElement('span');
            subTitle.classList.add('tpslider__sub-title', 'mb-35','res-center-text');
            subTitle.innerHTML = data.caption;
            subTitle.style.color = 'rgb(255, 174, 0)';

            var title = document.createElement('h2');
            title.classList.add('tpslider__title', 'mb-30','res-center-text');
            title.innerHTML = data.title;

            var paragraph = document.createElement('p');
            paragraph.className ='res-center-text';
            paragraph.innerHTML = data.description;

            var button = document.createElement('div');
            button.classList.add('tpslider__btn');
            button.className = 'res-center-layout';

            var link = document.createElement('a');
            link.classList.add('tp-btn');
            link.href = '/shop-details/?productid=' + data.productid + "&l=0";
            link.textContent = data.button;


            var rightColumn = document.createElement('div');
            rightColumn.classList.add('col-xxl-7', 'col-lg-6', 'col-md-6', 'col-12', 'col-sm-6');

            var tpsliderThumb = document.createElement('div');
            tpsliderThumb.classList.add('tpslider__thumb', 'p-relative', 'pt-2');
            tpsliderThumb.style.height = '100%';
            tpsliderThumb.style.display = 'flex';
            tpsliderThumb.style.justifyContent = 'center';


            var img = document.createElement('img');
            img.classList.add('tpslider__thumb-img');
            img.src = data.image;
            img.alt = '';
            img.style.maxHeight = '340px';
            img.style.position = 'relative';
            img.style.objectFit='contain';

            var tpsliderShape = document.createElement('div');
            tpsliderShape.classList.add('tpslider__shape', 'd-none', 'd-md-block');

            for (var i = 1; i <= 4; i++) {
                var shapeImg = document.createElement('img');
                shapeImg.classList.add('tpslider__shape-' + i);
                shapeImg.src = '/assets/img/slider/slider-shape-' + i + '.png';
                shapeImg.alt = 'shape';
                tpsliderShape.appendChild(shapeImg);
            }

            tpsliderThumb.appendChild(img);
            tpsliderThumb.appendChild(tpsliderShape);

            rightColumn.appendChild(tpsliderThumb);


            button.appendChild(link);
            tpsliderContent.appendChild(subTitle);
            tpsliderContent.appendChild(title);
            tpsliderContent.appendChild(paragraph);
            tpsliderContent.appendChild(button);
            leftColumn.appendChild(tpsliderContent);
            row.appendChild(leftColumn);
            row.appendChild(rightColumn);


            container.appendChild(row);
            tpslider.appendChild(container);
            swiperSlide.appendChild(tpslider);

            headerSwiper.appendChild(swiperSlide);


            sliderswiper.update();
        });
    })
    .catch((error) => {
        console.error("Error retrieving products: ", error);
    });



const categoriesRef = db.collection("site/tos/categories");

const categoryWrapper = document.getElementById('category-wrapper');
var categoryswiper = new Swiper('.category-active', {
    loop: false,
    slidesPerView: 8,
    spaceBetween: 20,
    autoplay: {
        delay: 3500,
        disableOnInteraction: true,
    },
    breakpoints: {
        '1400': {
            slidesPerView: 8,
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
            imgcat.setAttribute("onclick", "window.location.href = '/all-products/?category=" + data.category + "'");
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
            document.getElementById('buffer').style.display = 'none';

        });
    })
    .catch((error) => {
        document.getElementById('error-alert').style.top = '50px';
        console.error("Error retrieving Categories: ", error);
    });
const offerRef = db.collection("site/tos/offers");
const offerWrapper = document.getElementById('offer-wrapper');
var tpproductswiper = new Swiper('.tpproduct-active', {
    // Optional parameters
    loop: true,
    slidesPerView: 6,
    spaceBetween: 20,
    observer: true,
    observeParents: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: true,
    },
    breakpoints: {
        '1200': {
            slidesPerView: 4,
        },
        '992': {
            slidesPerView: 3,
        },
        '768': {
            slidesPerView: 2,
        },
        '576': {
            slidesPerView: 1,
        },
        '0': {
            slidesPerView: 1,
        },
    },
    // Navigation arrows
    navigation: {
        nextEl: '.tpproduct-btn__nxt',
        prevEl: '.tpproduct-btn__prv',
    },
});


offerRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const firestore1 = app.firestore();
            const productDetailsRef = firestore1.collection("site/tos/products").doc(data.productid);
            productDetailsRef.get()
                .then((doc) => {
                    const data = doc.data();
                    var offerProductTemplate = `
                    <div class="swiper-slide">
                        <div class="tpproduct p-relative">
                           <div class="tpproduct__thumb p-relative text-center">
                              <a href="/shop-details/?productid=${doc.id}&l=0"><img src="${data.images[0]}" alt=""></a>
                              <div class="tpproduct__info bage">
                                 <span class="tpproduct__info-hot bage__hot">${data.label}</span>
                              </div>
                              <div class="tpproduct__shopping">
                                 <button class="tpproduct__shopping-wishlist"><i
                                       class="${(wishlistArray.includes(doc.id)) ? 'icon-heart icons active' : 'icon-heart icons'} wi-${doc.id}" onclick="addToWishlist('${doc.id}',this)"></i></button>
                              </div>
                           </div>
                           <div class="tpproduct__content">
                              <span class="tpproduct__content-weight">
                                 <a href="/shop-details/?productid=${doc.id}&l=0" style="text-transform:capitalize;">${data.categories}</a>
                              </span>
                              <h4 class="tpproduct__title">
                                 <a href="shop-details/">${data.title}</a>
                              </h4>
                              <div class="tpproduct__price">
                                 <span>₹${(data.varients[0].offerprice == "") ? data.varients[0].price : data.varients[0].offerprice}</span>
                                 <del>${(data.varients[0].offerprice == "") ? "" : "₹" + data.varients[0].price}</del>
                              </div>
                           </div>
                           <div class="tpproduct__hover-text">
                              <div class="tpproduct__hover-btn d-flex justify-content-center mb-10">
                                 <button class="tp-btn-2" onclick="addToCart('${doc.id}',1,0,this)">Add to cart</button>
                              </div>
                           </div>
                        </div>
                     </div>
                    `;
                    offerWrapper.innerHTML = offerProductTemplate + offerWrapper.innerHTML;


                });

            tpproductswiper.update();

        });
    })
    .catch((error) => {
        console.error("Error retrieving Offer Products: ", error);
    });


const allProductRef = db.collection("site/tos/products");
const allproductWrapper = document.getElementById('allp-wrapper');

var allproductswiper = new Swiper('.tpproduct-active-all', {
    // Optional parameters
    loop: false,
    slidesPerView: 6,
    spaceBetween: 20,
    observer: true,
    observeParents: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: true,
    },
    breakpoints: {
        '1200': {
            slidesPerView: 4,
        },
        '992': {
            slidesPerView: 3,
        },
        '768': {
            slidesPerView: 2,
        },
        '576': {
            slidesPerView: 1,
        },
        '0': {
            slidesPerView: 1,
        },
    },
    // Navigation arrows
    navigation: {
        nextEl: '.tpproduct-btn__nxt',
        prevEl: '.tpproduct-btn__prv',
    },
});

allProductRef
    .limit(10)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            var allProductsTemplate = `
                                    <div class="swiper-slide">
                                       <div class="tpproduct p-relative">
                                          <div class="tpproduct__thumb p-relative text-center">
                                             <a href="/shop-details/?productid=${doc.id}&l=0"><img src="${data.images[0]}" alt="" style="height:200px; object-fit:contain;"></a>
                                             <a class="tpproduct__thumb-img" href="/shop-details/?productid=${doc.id}&l=0"></a>
                                             <div class="tpproduct__info bage">${(data.label=="")? '': '<span class="tpproduct__info-hot bage__hot">'+data.label+'</span>'}
                                                
                                             </div>
                                             <div class="tpproduct__shopping">
                                                <button class="tpproduct__shopping-wishlist"><i
                                                      class="${(wishlistArray.includes(doc.id)) ? 'icon-heart icons active' : 'icon-heart icons'} wi-${doc.id}" onclick="addToWishlist('${doc.id}',this)"></i></button>
                                             </div>
                                          </div>
                                          <div class="tpproduct__content">
                                             <span class="tpproduct__content-weight">
                                                <a href="/shop-details/?productid=${doc.id}&l=0" style="text-transform:capitalize;">${data.categories}</a>
                                             </span>
                                             <h4 class="tpproduct__title">
                                                <a href="/shop-details/?productid=${doc.id}&l=0">${data.title}</a>
                                             </h4>
                                             <div class="tpproduct__price">
                                             <span>₹${(data.varients[0].offerprice == "") ? data.varients[0].price : data.varients[0].offerprice}</span>
                                             <del>${(data.varients[0].offerprice == "") ? "" : "₹" + data.varients[0].price}</del>
                                             </div>
                                          </div>
                                          <div class="tpproduct__hover-text">
                                             <div class="tpproduct__hover-btn d-flex justify-content-center mb-10">
                                                <button class="tp-btn-2"  onclick="addToCart('${doc.id}',1,0,this)">Add to cart</button>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
              `;

            allproductWrapper.innerHTML = allProductsTemplate + allproductWrapper.innerHTML;
            allproductswiper.update();
        });
    })
    .catch((error) => {
        console.error("Error retrieving Offer Products: ", error);
    });


const blogRef = db.collection("site/tos/blog");
const blogWrapper = document.getElementById('blog-wrapper');

var tpblogswiper = new Swiper('.tpblog-active', {
    // Optional parameters
    loop: false,
    slidesPerView: 4,
    spaceBetween: 20,
    autoplay: {
        delay: 5000,
        disableOnInteraction: true,
    },
    breakpoints: {
        '1200': {
            slidesPerView: 4,
        },
        '992': {
            slidesPerView: 3,
        },
        '768': {
            slidesPerView: 2,
        },
        '576': {
            slidesPerView: 2,
        },
        '0': {
            slidesPerView: 1,
        },
    },
});

blogRef
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            var blogTemplate = `
              <div class="swiper-slide">
              <div class="tpblog__item">
                 <div class="tpblog__thumb fix">
                    <a href="/about-us/"><img src="${data.image}" alt=""></a>
                 </div>
                 <div class="tpblog__wrapper">

                    <h4 class="tpblog__title"><a href="/about-us/">${data.title}</a></h4>
                    <p style="overflow-x:hidden;">${data.description}</p>
                    <div class="tpblog__details">
                       <a href="/about-us/">GO TO ABOUT-US <i class="icon-chevrons-right"></i> </a>
                    </div>
                 </div>
              </div>
           </div>
              `;

            blogWrapper.innerHTML = blogTemplate + blogWrapper.innerHTML;
            tpblogswiper.update();
        });
    })
    .catch((error) => {
        console.error("Error retrieving Offer Products: ", error);
    });

function addToWishlist(id, element) {

    var allElem = document.querySelector('wi-'+id);

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
                    element.className = 'icon-heart icons wi-'+id;
                    allElem.className = 'icon-heart icons wi-'+id;
                        
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
                element.className = 'icon-heart icons active wi-'+id;
                allElem.className = 'icon-heart icons active wi-'+id;
                    
            })
            .catch((error) => {

            });
    }
}