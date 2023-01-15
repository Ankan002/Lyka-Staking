import RankBonusHistory from 'src/helper/Modal/History/RankBonusHistory'
import initDB from '../../helper/initDB'
import GlobalBonus from '../../helper/Modal/Bonus/GlobalBonus'
import GlobalBonusHistory from '../../helper/Modal/History/GlobalBonusHistory'
import PackageHistory from '../../helper/Modal/History/PackageHistory'
import User from '../../helper/Modal/User'
import PurchasePackageInvoice from '../../helper/Modal/Invoice/PurchasePackageInvoice'
import RankEligibilityClaim from 'src/helper/Modal/History/RankEligibilityClaim'




initDB()

export default async (req, res) => {
  const users = await User.find()

  for (let index = 0; index < users.length; index++) {
    console.log(users[index]._id)
    var mainUser = users[index]._id

    var myDate = new Date()

    var myDay = 1
    var myDay2 = myDate.getDate()
    var myMonth = myDate.getMonth()
    var myMonth2 = myDate.getMonth() + 1
    var myYear = myDate.getFullYear()

    var start = new Date(myYear, myMonth, myDay);
    var end = new Date(myYear, myMonth2, myDay2);

    console.log(start)
    console.log(end)

    var TotalBusiness = 0


    var elegiblePeoples = []


    const RankBonusHistoryData = await RankEligibilityClaim.find({ created_on: { $gte: start, $lt: end } })

    RankBonusHistoryData.map((hit) => {
      return TotalBusiness = TotalBusiness + Number(hit.TotBusiness)
    })

    // RankBonusHistoryData.map((hits) => {
    //   return elegiblePeoples.push(hits.DownLineUserId)
    // })

    RankBonusHistoryData.map((hit)=>{
      return elegiblePeoples.push(hit.RankEligibilityClaimOwnerId)
    })

    // elegiblePeoples

    const memberEligible = RankBonusHistoryData.length // this is the count of eligible 


    const findMainUserPackage = await User.findById(users[index]._id)


    const mainUserPackagePrice = Number(findMainUserPackage.PurchasedPackagePrice)


    // here we are calculating estimated tokens 

    var percantage = 0

    if (mainUserPackagePrice == 500) {
      percantage = 1
    } else if (mainUserPackagePrice == 1000) {
      percantage = 1
    } else if (mainUserPackagePrice == 2500) {
      percantage = 0.5
    } else if (mainUserPackagePrice == 5000) {
      percantage = 0.3
    } else if (mainUserPackagePrice == 10000) {
      percantage = 0.2
    } else if (mainUserPackagePrice == 25000) {
      percantage = 0.1
    } else if (mainUserPackagePrice == 50000) {
      percantage = 0.1
    } else if (mainUserPackagePrice == 100000) {
      percantage = 0.1
    }


    console.log(percantage)


    var est1 = Number(TotalBusiness) * percantage / 100


    var devideIt = memberEligible / est1



    for (let index = 0; index < elegiblePeoples.length; index++) {
      const userIt = elegiblePeoples[index];

      const getUserOldWallet = await User.findById(userIt)
      console.log(getUserOldWallet)

      const userWallete = Number(getUserOldWallet.MainWallet) + Number(devideIt)


      const updateWallet = await User.findByIdAndUpdate({ _id: userIt }, { MainWallet: userWallete })



      const makeSingleHistory = await GlobalBonus({

        BonusOwner: userIt,
        Percantage: percantage


      }).save()



    }



    const makeGlobalHistory = await GlobalBonusHistory({

      Owner: mainUser,
      Coins: est1,
      Percantage: percantage

    }).save()

  }



  return res.json('Updated')



}
