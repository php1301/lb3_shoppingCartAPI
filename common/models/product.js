'use strict';
const Promise = require('bluebird')
const _ = require('lodash')
const validator = require('validator')
module.exports = function (Product) {
    Product.afterRemote("find", async ctx => {
        const instance_products = ctx.result
        // for (let i = 0; i < instance_products.length; i++) {
        //     const instance__product = instance_products[i];
        //     const instance_category = await instance__product.category.get()
        //     // console.log(instance_products)
        //     instance_products[i].__data.categoryName = instance_category.__data.name
        // }
        //C1: map + Promise.all
        // const queries = instance_products.map(inst => {
        //     inst.category.get()
        // })
        // await Promise.all(queries)
        //     .then(res => {
        // for (let i = 0; i < res.length; i++) {
        //     // const element = res[i];
        //     instance_products[i].__data.categoryName = res[i].__data.name
        // }
        //                 let _instance_products = instance_products.map((instance_products, i) => {
        //                     return {
        //                         ...instance_products.data,
        //                         // ..._instance_products.data,
        //                         categoryName: res[i].__data.name
        //                     }
        //                 })
        //                 ctx.result = _instance_products
        //             })
        //     })
        // };
        //C2: promise.map
        //         await Promise.map(instance_products, instance_product => instance_product.category.get())
        //             .then(res => {
        //                 let _instance_products = instance_products.map((instance_products, i) => {
        //                     return {
        //                         ...instance_products.data,
        //                         categoryName: res[i].__data.name
        //                     }
        //                 })
        //                 ctx.result = _instance_products
        //             })
        //     })
        // };
        //c3 promise.each
        await Promise.each(instance_products, instance_product => {
            return instance_product.category.get()
                .then(instance__category => {
                    return instance_product.__data.categoryName = instance__category.__data.name
                })
        })
        ctx.result = instance_products
    })
    Product.afterRemote("findById", async ctx => {
        const instance__product = ctx.result
        const instance__category = await instance__product.category.get() //category lay tu relation
        // ctx.result.__data.categoryName = instance__category.name
        _.set(ctx, "result.__data.categoryName", instance__category.__data.name)
    })
    Product.beforeRemote("create", (ctx, instance, next) => {
        const name = _.get(ctx, "req.body.name", "")
        const image = _.get(ctx, "req.body.image", "")
        const categoryId = _.get(ctx, "req.body.categoryId", "")
        const price = _.get(ctx, "req.body.price", "")
        let errors = {}
        if (validator.isEmpty(name)) errors.name = "Phải nhập tên sản phẩm"
        if (validator.isEmpty(image)) errors.image = "Phải có ảnh"
        if (validator.isEmpty(categoryId)) errors.categoryId = "Phải có category"
        if (!_.isNumber(price)) errors.price = "Gia tien phai la con so"
        else if (price < 0) {
            errors.price = "gia tien phai >=0"
        }
        if (_.isEmpty(errors)) return next();
        throw errors
    })
}
//post la method create
//get la find, get byId = findbyid