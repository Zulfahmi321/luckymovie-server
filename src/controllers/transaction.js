const createTransaction = async(req,res)=>{
    try {
        const userId = req.userPayload.id
        const {data} = await postTransaction(req.body,userId)
        res.status(200).json({
            data,
            message:"Trasaction sucessfully created,please make a payment"
        })
    } catch (error) {
        const status =  error.status || 500
        res.status(status).json({
            error:error.message
        })
    }
}

module.exports = {createTransaction}