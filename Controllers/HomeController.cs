using StripePayment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StripePayment.Controllers
{
    public class HomeController : Controller
    {
        Payment pay = new Payment();
        public ActionResult Index()
        {
            return View();
        }

               
        public ActionResult Payment()
        {
            return View();
        }
        public JsonResult PaymentCharge(PaymentObj paymentDetail) =>
           Json(pay.AddPayment(paymentDetail), JsonRequestBehavior.AllowGet);
    }
}