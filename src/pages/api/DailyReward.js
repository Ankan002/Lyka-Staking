import initDB from '../../helper/initDB'
import PackageHistory from '../../helper/Modal/History/PackageHistory'
import DailyBonus from '../../helper/Modal/History/DailyBonus'
import LykaFastBonus from '../../helper/Modal/Bonus/LykaFastBonus'
import User from '../../helper/Modal/User'
import LykaFastBonusHis from '../../helper/Modal/History/LykaFastBonusHis'
import RenewalPurchasePackage from '../../helper/Modal/Renewal/RenewalPurchasePackage'
import RebuyBonus from '../../helper/Modal/Bonus/RebuyBonus'

initDB()

export default async (req, res) => {

  var list = []

  const findPackage = await PackageHistory.find()


  if (findPackage.length == 0) {
    return res.json("no any user found")
  }

  findPackage.map(hit => {
    return list.push({ id: hit.PackageOwner, price: hit.PackagePrice, name: hit.PackageName })
  })

  for (let i = 0; i < list.length; i++) {
    const myOldWallet = await User.findById(list[i].id)

    const investedAmount = list[i].price

    var findFastBonus = await LykaFastBonus.find({ FastBonusCandidate: list[i].id })

    const findRenewalBonus = await RenewalPurchasePackage.findOne({PackageOwner:list[i].id})


    var per = 0.3

    var FindMainUserReferals = []


   
    if (findFastBonus.length !== 0) {
      var totLenght = findFastBonus[0].ReferLength

      const findMainUser = findFastBonus[0].FastBonusCandidate

      const findUserPackage = await PackageHistory.findOne({PackageOwner:findMainUser})


      const MainUserPackagePrice = findUserPackage.PackagePrice 

  

      FindMainUserReferals = await User.find({UpperlineUser:findMainUser,PurchasedPackagePrice:  { $gte: Number(MainUserPackagePrice) } })




      if (FindMainUserReferals.length == 2 || FindMainUserReferals.length == 3) {
        per = 1
     
      }else if(FindMainUserReferals.length == 4 || FindMainUserReferals.length == 5){
        per = 2
       
      }else if(FindMainUserReferals.length == 6 || FindMainUserReferals.length == 7){
        per = 3
    
      }else if(FindMainUserReferals.length == 8 || FindMainUserReferals.length == 9){
        per = 4
        
      }else if(FindMainUserReferals.length >= 10){
        per = 5
      
      }

      



      if (findRenewalBonus==null) {      
        
      }else if(findRenewalBonus!==null&&findRenewalBonus.DirectReferalDone == "false"){
       
        per = 0.3
      }else if(findRenewalBonus.DirectReferalDone == "false"){
     
        per = 0.3
      }else{
       
      }


    }



    var finalCal = (Number(investedAmount) * per) / 100

    var refDef = finalCal*3/100


    var myWallete = myOldWallet.MainWallet

    var finalWallete = Number(myWallete) + Number(finalCal)

    await User.findByIdAndUpdate({ _id: list[i].id }, { MainWallet: finalWallete })

    const upperlineUserData = await User.findById(myOldWallet.UpperlineUser)

    if (Number(myOldWallet.PurchasedPackagePrice) > 0) {

      console.log("came to create record ===> ")
      const GiveReawdToUpperUpper = await RebuyBonus({
        BonusOwner:upperlineUserData._id,
        ReferSentFromId:myOldWallet._id,
        ReferSentFromUserId:myOldWallet.UserName,
        ReferGetFromId:upperlineUserData._id,
        ReferGetFromUserId:upperlineUserData.UserName,
        PackName:upperlineUserData.PurchasedPackageName,
        EarnedRewardCoins:refDef
      }).save()
    }




    if (findRenewalBonus!==null&& findRenewalBonus.DirectReferalDone == "true") {

      if (FindMainUserReferals.length >= 2 ) {
        const createRecord = await LykaFastBonusHis({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()




      } else {
        const createRecord = await DailyBonus({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()


        // const GiveReawdToUpperUpper = await RebuyBonus({
        //   BonusOwner:upperlineUserData._id,
        //   ReferSentFromId:myOldWallet._id,
        //   ReferSentFromUserId:myOldWallet.UserName,
        //   ReferGetFromId:upperlineUserData._id,
        //   ReferGetFromUserId:upperlineUserData.UserName,
        //   PackName:upperlineUserData.PurchasedPackageName,
        //   EarnedRewardCoins:refDef
        // }).save()
      }


    }else{
      if (FindMainUserReferals.length >= 2 ) {
        const createRecord = await LykaFastBonusHis({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()
      } else {
        const createRecord = await DailyBonus({
          BonusOwner: list[i].id,
          FormPackage: list[i].name,
          PackagePercantage: per,
          Amount: finalCal
        }).save()
      }
    }


    console.log('done')
  }

  res.json(list)
}