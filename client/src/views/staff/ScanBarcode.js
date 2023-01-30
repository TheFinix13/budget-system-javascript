import React, { useState } from "react";
import { product } from '../../data/api';
import axios from 'axios';
import Notifications from "components/Notification/Notification";
import 'boxicons';
import { BiBarcodeReader } from "react-icons/bi";
import LoadingOverlay from 'react-loading-overlay';
import { useAuth } from "contexts/AuthContext";
//import Barcode from "components/Scanner/Barcode";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    Row,
    Col,
    Input, FormGroup
} from "reactstrap";

function Sale({ cart, setCart }) {
    //let symbol = "₦";
    const [selling_price, setSellingPrice] = useState(0);

    const [scannerInput, setScannerInput] = useState('');
    const [currentProduct, setCurrentProduct] = useState({});

    const [notificationStatus, setNotificationStatus] = useState(false)
    const [notificationDetails, setNotificationDetails] = useState({ msg: "", type: "" });
    const { userDetail } = useAuth();

    const [requestLoading, setRequestLoading] = useState(false);



    function addScanned(x) {
        setRequestLoading(true);
        let y;
        let temp = x ? x : currentProduct;
        // eslint-disable-next-line 
        y = x ? null : () => { setCurrentProduct(x) };
        let toBuy = temp.toBuy ? temp.toBuy : 1;


        if (toBuy <= temp.variations[temp.key].quantity) {
            let cartItem = {
                product_id: temp._id,
                product_name: temp.product_name,
                quantity: toBuy,
                variation: temp.variations[temp.key].variation,
                price: selling_price > 0 ? selling_price : temp.variations[temp.key].selling_price
            };
            const found = (cart.findIndex(x => x.variation === cartItem.variation && x.product_id === cartItem.product_id));

            //checking if item already exist in cart
            if (found > -1) {
                let newCart = [...cart];
                newCart[found].quantity = cartItem.quantity;
                newCart[found].price = cartItem.price;
                setCart(newCart);

                setNotificationDetails({ msg: "Item already already exist in cart, updated with new quantity", type: "info" });
                setNotificationStatus(true);
            } else {
                setCart([...cart, cartItem]);
                setCurrentProduct({ ...temp, toBuy: 1 });

                setNotificationDetails({ msg: "Item Added to Cart Successfully", type: "success" });
                setNotificationStatus(true);
            }

            setSellingPrice(0);
        } else {
            setNotificationDetails({ msg: "Not Enough Items on Stock", type: "danger" });
            setNotificationStatus(true);
        }
        setRequestLoading(false);

    }



    async function scanBarcode(e) {
        e.preventDefault();
        setRequestLoading(true);

        let id;
        if (userDetail.type === 'staff') { id = userDetail.store } else {
            id = userDetail._id;
        }

        await axios.get(product.scanBarcode + "/" + id + "/" + scannerInput).then((response) => {
            if (response.data.status === true) {
                //setCurrentProduct({ ...response.data.data, key: response.data.key });
                addScanned({ ...response.data.data, key: response.data.key });
                //console.log({ ...response.data.data, key: response.data.key })
            }
            else {
                setNotificationDetails({ msg: "Error finding scanned item!", type: "danger" });
                setNotificationStatus(true);
            }
        }).catch((error) => {
            setNotificationDetails({ msg: error.response.data.msg, type: "danger" });
            setNotificationStatus(true);
        })
        setRequestLoading(false);
    }


    return (
        <>
            {notificationStatus === true ? <Notifications details={notificationDetails} /> : null}
            <div className="content">

                <Row>
                    <Col md="12">
                        <LoadingOverlay active={requestLoading} spinner text='Loading your request...'>

                            <Card>

                                <Col sm="12" style={{ overflowX: "auto" }}>

                                    <Row>
                                        <Col className="pr-md-1" md="6" style={{ 'textAlign': 'center' }}>
                                            <div>Barcode Scanner Input</div>
                                            <BiBarcodeReader size={200} color='primary' />
                                            <FormGroup>
                                                <label>Scanned Input</label>
                                                <Input
                                                    placeholder="1277392103"
                                                    type="text"
                                                    onChange={(e) => setScannerInput(e.target.value)}
                                                />
                                            </FormGroup>
                                            <Button onClick={(e) => scanBarcode(e)} className="btn-fill" style={{ marginBottom: "5px", padding: '10px' }} color="primary" type="submit">
                                                Find Product<BiBarcodeReader size={30} />
                                            </Button>
                                        </Col>

                                        <Col className="pr-md-1" md="6" style={{ 'textAlign': 'center', overflowX: "auto" }}>
                                            {Object.keys(currentProduct).length > 0 ?

                                                <CardBody >
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <Button onClick={() => addScanned()} className="btn-fill" style={{ width: "100%", marginTop: "15px" }} color="primary" type="submit">
                                                                Change Data
                                                            </Button><hr />
                                                        </div>


                                                        <div className="pull-left col-6">

                                                            <h6 className="title">Quantity to Sell:  </h6>
                                                            <Input
                                                                placeholder="5"
                                                                type="number"
                                                                // value={currentProduct.toBuy ? currentProduct.toBuy : 1}
                                                                onChange={(e) => setCurrentProduct({ ...currentProduct, toBuy: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="pull-right col-6">
                                                            <h6 className="title">Different Price? </h6>
                                                            <Input
                                                                placeholder="5"
                                                                type="number"
                                                                value={selling_price}
                                                                onChange={(e) => setSellingPrice(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="card-description" style={{ textAlign: 'left' }}>
                                                        <div>
                                                            <span>Product Name:  {currentProduct.product_name} </span>
                                                        </div>
                                                        <div>
                                                            <span>Brand Name:  {currentProduct.brand} </span>
                                                        </div>





                                                        <hr />

                                                        <Col className="pr-md-1" md="12" >
                                                            <FormGroup>
                                                                {console.log(currentProduct)}
                                                                Variation : {currentProduct.variations[currentProduct.key].variation} <br />
                                                                Model: {currentProduct.variations[currentProduct.key].model} <br />
                                                                Selling Price: {currentProduct.variations[currentProduct.key].selling_price.toLocaleString()}<br />
                                                                Available Quantity: {currentProduct.variations[currentProduct.key].quantity}
                                                            </FormGroup>
                                                        </Col>



                                                    </div>

                                                </CardBody>

                                                :

                                                <div style={{ padding: "100px" }}>
                                                    <h4>Scan an item to show details</h4>
                                                </div>
                                            }

                                        </Col>




                                    </Row>
                                </Col>

                            </Card>


                        </LoadingOverlay>
                    </Col>


                </Row>
            </div>
        </>
    );
}

export default Sale;
