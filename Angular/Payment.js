app.controller("PaymentController", function ($scope, $compile) {  
   
    $scope.payment = {
        fName: "",
        lName: "",
        name: "",
        email: "",
        phoneNumber: "352121765",
        shippingAdress: "abc",
        shippingCity: "abc",
        shippingAdress1: "abc",
        shippingState: "punjab",
        shippingZipCode: "94107",
        sameAdresses: true,
        billingAdress: "",
        billingCity: "",
        billingAdress1: "",
        billingState: "",
        billingZipCode: "",
        cardNumber: "5105105105105100",
        cardExpiry: "05/2022",
        cardCvc: "444",
        price: "25",
        shippingCharge: "30",
        unitCount: 1,
        totalPrice: "25",
        colour: "Platinum",
        totalAmountShipping: "",
        Token: ""
    };
    
    var validCard, validCVC, validExpiry = true;
    $scope.PayPayment = function (elem) {
        $scope.payment.billingZipCode = $scope.payment.shippingZipCode;
        $scope.payment.billingState = $scope.payment.shippingState;
        $scope.payment.billingAdress1 = $scope.payment.shippingAdress1;
        $scope.payment.billingCity = $scope.payment.shippingCity;
        Stripe.setPublishableKey("Your publishable Key");
        validCard = Stripe.card.validateCardNumber($scope.payment.cardNumber);
        validCVC = Stripe.card.validateCVC($scope.payment.cardCvc);
        validExpiry = Stripe.card.validateExpiry($scope.payment.cardExpiry);
        if (validCard === false) {
            alert("Invalid Card Number");          
            return;
        }
        if (validCVC === false) {
            alert("Invalid CVC");           
            return;
        }        
        if (validExpiry === false) {
            alert("Invalid Card Expiry");           
            return;
        }
        else {
            var expiry = $scope.payment.cardExpiry.split('/');
            if (expiry !== null && expiry.length > 0) {
                $scope.payment.totalAmountShipping = $scope.payment.totalPrice;
                $scope.payment.totalAmountShipping = Math.round($scope.payment.totalAmountShipping * 100) / 100;
                Stripe.card.createToken({
                    number: $scope.payment.cardNumber,
                    cvc: $scope.payment.cardCvc,
                    exp_month: expiry[0],
                    exp_year: expiry[1],
                    address_zip: $scope.payment.billingZipCode,
                    address_state: $scope.payment.billingState,
                    address_city: $scope.payment.billingCity,
                    address_line1: $scope.payment.billingAdress,
                    address_line2: $scope.payment.billingAdress1,
                    name: $scope.payment.fName + " " + $scope.payment.lName

                }, stripeResponseHandler);
            }
        }
    };
    function Post(url, data, e, isBlockUI) {
        return $.ajax({
            method: "Post",
            url: url,
            data: data,
            success: function (d) {
                //if ($.type(d) == "string")
                //     AccessDenied();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ErrorMessage(errorMsg);
            }
        });
    }
    function stripeResponseHandler(status, response) {
        // Grab the form: 
        if (response.error) { // Problem!
            } else { // Token was created!
           
            // Get the token ID: 
            var token = response.id;
            $scope.payment.Token = response.id;
            $scope.payment.name = $scope.payment.fName + " " + $scope.payment.lName;
            if ($scope.dumyPhoneNumber != "" || $scope.dumyPhoneNumber != null || $scope.dumyPhoneNumber != "null") {
                $scope.payment.phoneNumber = $scope.dumyPhoneNumber;   
            }

            Post("/Home/PaymentCharge", $scope.payment, $("#btnPayment").find("button[type=submit]")).then(function (d) {
               if (d.Success) {                    
                    if (d.Data.Status == "succeeded") { 
                        alert("Successfully paid");
                      
                    }
                    else if (d.Data.Status == "failed") {
                        alert("Your Payment charge is failed  " + d.Data.FailureCode);                       
                    }
                    else if (d.Data.Status == "pending") {
                        alert("Your Payment charge is pending"); 
                       
                    }
                }
                else {
                    alert("payment fail");
                }
            });
        }
    }
  
});

