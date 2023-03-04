const express = require("express")
const cors = require("cors")
require("dotenv").config()

const stripe = require("stripe")(process.env.STRIPE_KEY)
const paymentROuter = express.Router()
paymentROuter.use(express.json())

paymentROuter.post("/", async (req, res) => {
  const line_items = req.body.map((item) => {
    console.log(item.name, item.pricing);
    return {

      price_data: {
        currency: 'INR',
        product_data: {
          images: [item.image],
          name: item.name,
        },
        unit_amount: item.pricing * 100,
      },
      quantity: 1,

    }
  })
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: `${process.env.RES_URL}/paymentPage/Success`,
    cancel_url: `${process.env.RES_URL}/paymentPage/cancel`,
  });
  res.send({ url: session.url });
})

paymentROuter.post('/create-checkout-session', async (req, res) => {
  // const session = await stripe.checkout.sessions.create({
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: 'INR',
  //         product_data: {
  //           name: 'T-shirt',
  //         },
  //         unit_amount: 2000,
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   mode: 'payment',
  //   success_url: `${process.env.RES_URL}/success.html`,
  //   cancel_url: `${process.env.RES_URL}/cancel.html`,
  // });

  // res.send({url: session.url});
});

module.exports = paymentROuter