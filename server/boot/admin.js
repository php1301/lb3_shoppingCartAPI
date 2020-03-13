const _ = require('lodash')
module.exports = app => {
    const Account = app.models.Account;
    const Role = app.models.Role
    const RoleMapping = app.models.RoleMapping

    let account
    Account.findOne({ where: { email: "trunghieu@gmail.com" } })
        .then(account => {
            if (account) 
            return Promise.resolve(account)
            return Account.create({
                 email: "trunghieu@gmail.com", 
                 password: "trunghieu", 
                 phone: "01231313134", 
                 address: "13 rrm" })
        })
        .then(_account => {
            account = _account
            return Role.findOne({ where: { name: "admin" } })
        })
        .then(role => {
            if (role)
            return Promise.resolve(role)
            return Role.create({
                name: "admin"
            })
        })
        .then(role => {
            RoleMapping.findOrCreate(
                {   
                    // principalType: RoleMapping.USER,
                    roleId: role.id,
                    principalId: account.id,

                },
                {
                    principalType: RoleMapping.USER,
                    roleId: role.id,
                    principalId: account.id
                })
        })
        .catch(err => console.log(err))
}
// tim theo email
// tim theo role
// xong tao bang principal trung gian