import initDB from "../../../helper/initDB";
import RankBonusHistory from "../../../helper/Modal/History/RankBonusHistory";
import User from "../../../helper/Modal/User";
import PackageHistory from "../../../helper/Modal/History/PackageHistory";
import RankEligibilityClaim from "src/helper/Modal/History/RankEligibilityClaim";


initDB()

export default async(req,res)=>{

    const {id} = req.body;
   

    var myDate = new Date()

    var myDay = 1
    var myDay2 = myDate.getDate()
    var myMonth = myDate.getMonth()
    var myMonth2 = myDate.getMonth()+1
    var myYear = myDate.getFullYear()

    var start = new Date(myYear, myMonth, myDay);
    var end = new Date(myYear, myMonth2, myDay2);

    console.log(start)
    console.log(end)

    var TotalBusiness = 0
    

    // const RankBonusHistoryData = await RankBonusHistory.find({UpperLineUserId:id,created_on: {$gte: start, $lt: end}})
    const RankBonusHistoryData = await PackageHistory.find({created_on: {$gte: start, $lt: end}})

    console.log(RankBonusHistoryData)



    RankBonusHistoryData.map((hit)=>{
        return TotalBusiness = TotalBusiness + Number(hit.PackagePrice)
    })


    console.log(TotalBusiness)


    
    
    const findMainUserPackage = await User.findById(id)
    
    
    const mainUserPackagePrice = Number(findMainUserPackage.PurchasedPackagePrice)

    console.log("pack price is => "+mainUserPackagePrice)
    
    const rankEligibleForThatPackage = await RankEligibilityClaim.find({PackageOwnPrice:mainUserPackagePrice})
    console.log(rankEligibleForThatPackage)
    console.log("it is comided here")

    


    
    const memberEligible = rankEligibleForThatPackage.length // this is the count of eligible 

    // here we are calculating estimated tokens 

    var percantage = 0
    var star = ""

    if (mainUserPackagePrice == 500) {
        percantage = 1
        star = "1 Star Eligible"
    }else if (mainUserPackagePrice == 1000) {
        percantage = 1
        star = "2 Star Eligible"

    }else if (mainUserPackagePrice == 2500) {
        percantage = 0.5
        star = "3 Star Eligible"

    }else if (mainUserPackagePrice == 5000) {
        percantage = 0.3
        star = "4 Star Eligible"

    }else if (mainUserPackagePrice == 10000) {
        percantage = 0.2
        star = "5 Star Eligible"

    }else if (mainUserPackagePrice == 25000) {
        percantage = 0.1
        star = "6 Star Eligible"

    }else if (mainUserPackagePrice == 50000) {
        percantage = 0.1
        star = "7 Star Eligible"

    }else if (mainUserPackagePrice == 100000) {
        percantage = 0.1
        star = "8 Star Eligible"

    }


    console.log(percantage)


    var est1 = Number(TotalBusiness) * percantage /100



    const esDate = new Date(start)










    
    
    res.json({companyBusiness:TotalBusiness,memberEligibleForRank:memberEligible,estimatedToken:est1,fromDate:`1/${esDate.getMonth()+1}/${esDate.getFullYear()}`,toDate:`1/${esDate.getMonth()+1}/${esDate.getFullYear()}`,packageStar:star})


}