const createTransaction = async(req,res)=>{
    try {
   
        const {data} = await postTransaction(req.body)
    } catch (error) {
        
    }
}

module.exports = {createTransaction}