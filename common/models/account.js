// 'use strict';
// const _ = require('lodash')
// const app = require('../../server/server')
// const Promise = require('bluebird')
// module.exports = function (Order) {
//     Order.observe("after save", async ctx => {
//         const OrderItem = app.models.OrderItem
//         const instance = ctx.instance
//         const products = _.get(ctx, "options.req.body.products", [])
//         if (ctx.isNewInstance) {
//             // await products.forEach(async item => {
//             //     await OrderItem.create({
//             //         orderId: instance.__data.id,
//             //         productId: item.productId,
//             //         quantity: item.quantity
//             //     })
//             // });
//             await Promise.map(products, product => {
//                 return OrderItem.create({
//                     orderId: instance.__data.id,
//                     productId: product.productId,
//                     quantity: product.quantity
//                 })
//             })
//         }
//         else {
//             //PUT orders/:id
//             await OrderProduct.destroyAll({ orderId: instance_order.id })
//             await Promise.map(products, product => {
//                 return OrderItem.create({
//                     orderId: instance.__data.id,
//                     productId: product.productId,
//                     quantity: product.quantity
//                 })
//             })
//         }
//     })
// };
'use strict';
const _ = require('lodash')
const app = require('../../server/server')
const Promise = require('bluebird')
module.exports = function (Account) {


    Account.afterRemote("prototype.__findById__orders", async ctx => {
        const OrderItem = app.models.OrderItem
        const order = ctx.result
        let totalPrice = 0
        const OrderItems = await OrderItem.find({
            where: {
                orderId: order.id
            }
        })
        for (let i = 0; i < OrderItems.length; i++) {
            const orderItem = OrderItems[i]
            //lay production
            const item = await orderItem.product.get() // so nhieu thi find, . den product nho relation
            totalPrice += orderItem.__data.quantity * item.__data.price
            //lay production name
            OrderItems[i].productName = item.__data.name
        }
        ctx.result.__data.products = OrderItems
        ctx.result.__data.totalPrice = totalPrice
    })
};
