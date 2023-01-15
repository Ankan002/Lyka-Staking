import initDB from "../../../helper/initDB";
import RebuyBonus from "../../../helper/Modal/Bonus/RebuyBonus";



export default async(req,res)=>{

    const {id} = req.body;

    const getAllData = await RebuyBonus.find({BonusOwner:id})

    res.json(getAllData)

}