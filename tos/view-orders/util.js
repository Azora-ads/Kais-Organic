const firebaseConfig = {
    apiKey: "AIzaSyCV1Z8-EZWdUwPnsAiPrRn6hScbt9_AnHs",
    databaseURL: "https://kaisonline-default-rtdb.asia-southeast1.firebasedatabase.app",
    authDomain: "kaisonline.firebaseapp.com",
    projectId: "kaisonline",
    storageBucket: "kaisonline.appspot.com",
    messagingSenderId: "1038384566126",
    appId: "1:1038384566126:web:0a2dab22a90c750066bb7f",
    measurementId: "G-336STKC5HQ"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ordersRef = db.ref('Orders');

var allDataArray = [];

function setStatus(id,isAccept) {
    const ordersUpdateRef = db.ref('Orders/'+id);
    var data ={};
    if(isAccept){
        data = {status:"0"}
    }else{
        data = {status:"403"}
    }
    ordersUpdateRef.update(data)
    .then(() => {
        location.reload();
    })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
}

var positionCounter = 0;

var mainList = document.getElementById('child-lists');
ordersRef.on('child_added',function(ndata){
    positionCounter = positionCounter+1;
    var udata = ndata.val();
    var recData = {
        orderId: udata.orderId,
        data: udata.data,
        userid: udata.userid,
        name: udata.name,
        address1: udata.address1,
        address2: udata.address2,
        address3: udata.address3,
        email: udata.email,
        phone: udata.phone,
        status: udata.status
    };
    allDataArray.push(recData);
    var mainListTemplate = `
                    <div class="child" id="child-${udata.orderId}" style="${(udata.status == "0")? 'background: rgba(0, 255, 34, 0.295);opacity:0.3;' : (udata.status == "403")? 'background: rgba(255, 0, 0, 0.295);opacity:0.3;': 'background:#FFFFFF; opacity:1;'}">
                        <h6>Order ID : ${udata.orderId}</h6>
                        <label>User Id : <span>${udata.userid}</span></label>
                        <h6>Name : <span>${udata.name}</span></h6>
                        <h6>Address : <br>
                            Line1 : <span>${udata.address1}</span><br>
                            Line2 : <span>${udata.address2}</span><br>
                            Town/City : <span>${udata.address3}</span> 
                        </h6>
                        <h6>Email <span>${udata.email}</span></h6>
                        <h6>Phone Number <span>${udata.phone}</span></h6>
                        <div class="product-details" style="overflow-x: scroll; width:fit-content; margin-top:20px;">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Image</th>
                                        <th>Title</th>
                                        <th>Label</th>
                                        <th>Price/unit</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody id="table-body-${udata.orderId}">
                                    
                                </tbody>
                            </table>
                            <div style="height: 30px;"></div>
                            <h5>Sub Total&nbsp; : &nbsp;<span id="sub-tot-${udata.orderId}">0.00</span></h5>
                            <h5>GST (8%)&nbsp; : &nbsp;<span id="gst-${udata.orderId}">0.00</span></h5>
                            <h5>Total Amount&nbsp; : &nbsp;<span id="tot-amount-${udata.orderId}">0.00</span></h5>
                            <button style="background: #2196F3;" onclick="printReceipt('${positionCounter}')">Print Reciept</button><br>
                            <div style="height: 20px;"></div>
                            <button onclick="setStatus('${udata.orderId}',true)">Accept Order</button>
                            <button style="background: #D32F2F;" onclick="setStatus('${udata.orderId}',false)">Reject Order</button>
                        </div>
                    </div>
    `;
    mainList.innerHTML = mainListTemplate + mainList.innerHTML;
    var sublist = document.getElementById('table-body-'+udata.orderId);
    var arrayList = udata.data;
    var sum_tot = 0;
    var sum_gst = 0;
    var tot_amount = 0;
    for (let i = 0; i < arrayList.length; i++) {
        var sublistTemplate = `
        <tr>
            <td><a href="/shop-details/?productid=${arrayList[i].productid}&l=${arrayList[i].productLabelId}">${arrayList[i].productid}</a></td>
            <td><img src="${arrayList[i].imageUrl}" alt="" style="width:50px; height:50px; object-fit:cover;"></td>
            <td>${arrayList[i].productTitle}</td>
            <td>${arrayList[i].label} (${arrayList[i].productLabelId})</td>
            <td>₹${arrayList[i].price}</td>
            <td>${arrayList[i].quantity}</td>
            <td>₹${Number(arrayList[i].price)*Number(arrayList[i].quantity)}</td>
        </tr>
        `;
        sublist.innerHTML = sublistTemplate+sublist.innerHTML;
        sum_tot = sum_tot + Number(arrayList[i].price);
        sum_gst = (sum_tot/100)*8;
        tot_amount = sum_gst+sum_tot;
        document.getElementById('sub-tot-'+udata.orderId).textContent = "₹"+sum_tot;
        document.getElementById('gst-'+udata.orderId).textContent = "₹"+sum_gst;
        document.getElementById('tot-amount-'+udata.orderId).textContent = "₹"+tot_amount;
    }
});

function printReceipt(position) {
    localStorage.setItem('recdata', JSON.stringify(allDataArray[position-1]));
    window.location.href='invoice/';
}