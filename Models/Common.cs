using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StripePayment.Models
{
    public class Common
    {
        
    }
    public class Message
    {
        public string msg { get; set; }
        public bool Success = true;
        public bool Info { get; set; }
        public bool Warning { get; set; }
        public dynamic Data { get; set; }
        public string Detail = "Request processed successfully";
        public static string DeleteError = "009 Unable to processe this request.";
        public static string ErrorMessage = "Something went wrong. Please try again";
    }
    public  class PaymentObj
    {
        public string Token { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string unitCount { get; set; }
        public string colour { get; set; }
        public string shippingAdress { get; set; }
        public string shippingAdress1 { get; set; }
        public string shippingCity { get; set; }
        public string shippingState { get; set; }
        public string shippingZipCode { get; set; }
        public string totalPrice { get; set; }
        public string shippingCharge { get; set; }
        public string totalAmountShipping { get; set; }
        public string phoneNumber { get; set; }


    }
}