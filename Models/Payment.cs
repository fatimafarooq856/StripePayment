using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StripePayment.Models
{
    public class Payment
    {
        public Message AddPayment(PaymentObj paymentDetail)
        {
            Message message = new Message();
            try
            {
                StripeConfiguration.ApiKey = "Your stripe Api key";
                var customerOptions = new CustomerCreateOptions
                {
                    Email = paymentDetail.email,
                    Description = "Customer for Techartly",
                    Source = paymentDetail.Token,
                    Name = paymentDetail.name,
                    Phone = paymentDetail.phoneNumber
                };
                var custservice = new CustomerService();
                Customer customer = custservice.Create(customerOptions);
                var shippingoptions = new ChargeShippingOptions
                {
                    Address = new AddressOptions()
                    {
                        City = paymentDetail.shippingCity,
                        State = paymentDetail.shippingState,
                        PostalCode = paymentDetail.shippingZipCode,
                        Line1 = paymentDetail.shippingAdress,
                        Line2 = paymentDetail.shippingAdress1,
                    },
                    Name = paymentDetail.name

                };

                var options = new ChargeCreateOptions
                {
                    Amount = (long)Convert.ToDouble(paymentDetail.totalAmountShipping) * 100,
                    Customer = customer.Id,
                    Currency = "USD",
                    Description = "Buy Hear It up",
                    ReceiptEmail = paymentDetail.email,
                    Shipping = shippingoptions,
                    Metadata = new Dictionary<string, string>()
                    {
                        {"Phone No", paymentDetail.phoneNumber },
                        {"Shipping Fee", paymentDetail.shippingCharge },
                        {"Net Fee", paymentDetail.totalPrice},
                        {"Quantity",paymentDetail.unitCount},
                        {"SKU", paymentDetail.colour }
                    }
                };
                message.Data = new ChargeService().Create(options);
            }
            catch (Exception ex)
            {
                message.Success = false;
                message.Detail = String.IsNullOrEmpty(ex.Message) ? Message.ErrorMessage : ex.Message;
            }
            return message;
        }
    }
}