import initDB from '../../../helper/initDB'
import Package from '../../../helper/Modal/Plan'
import PackageHistory from '../../../helper/Modal/History/PackageHistory'
import ReferralHistory from '../../../helper/Modal/History/ReferralHistory'
import User from '../../../helper/Modal/User'
import LykaFastBonus from '../../../helper/Modal/Bonus/LykaFastBonus'

initDB()

export default async (req, res) => {
  const { packageId, Anount, id } = req.body

  var Lamount = Number(Anount) * 30

  const findPackage = await Package.findById(packageId)

  const findPackagePurchaseUser = await User.findById(id)

  const uplineUser = findPackagePurchaseUser.UpperlineUser

  console.log(uplineUser)

  if (uplineUser !== 'null') {
    const findUplineUserDetails = await User.findById(uplineUser)

    const lastWallete = findUplineUserDetails.MainWallet

    const PackagePercantage = (Number(findPackage.PackagePrice) * Number(findPackage.PackageReferalCommision)) / 100

    const calWallete = Number(lastWallete) + Number(PackagePercantage)

    await User.findByIdAndUpdate({ _id: uplineUser }, { MainWallet: calWallete })

    const ReferalHistory = await ReferralHistory({
      ReferralFrom: id,
      ReferralTo: uplineUser,
      ReferralCoins: calWallete,
      ReferralPercantage: findPackage.PackageReferalCommision,
      PackageName: findPackage.PackageName
    }).save()

    const uplinerCreationDate = findUplineUserDetails.createdAt

    var date = new Date(uplinerCreationDate)
    var dateToday = new Date()
    var month = date.getMonth() + 1
    var month2 = dateToday.getMonth() + 1

    var creationDate = month + '/' + date.getDate() + '/' + date.getFullYear()
    var todayDate = month2 + '/' + dateToday.getDate() + '/' + dateToday.getFullYear()

    console.log(creationDate)
    console.log(todayDate)

    const date1 = new Date(creationDate)
    const date2 = new Date(todayDate)
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    console.log(diffDays + ' days')

    if (diffDays <= 10) {
      const findData = await LykaFastBonus.find({ FastBonusCandidate: uplineUser })

      console.log(findData)

      if (findData.length !== 0) {
        const updateData = await LykaFastBonus.findByIdAndUpdate(
          { _id: findData[0]._id },
          { ReferLength: Number(findData[0].ReferLength) + 1 }
        )
      } else {
        const createLykaFastBonus = await LykaFastBonus({
          FastBonusCandidate: uplineUser,
          ReferLength: '1'
        }).save()
      }
    }
  }

  const createPackage = await PackageHistory({
    PackageName: findPackage.PackageName,
    PackagePrice: findPackage.PackagePrice,
    PaackagePeriod: findPackage.PaackagePeriod,
    PackageMaximumLimit: '300',
    LykaToken: Lamount,
    PackgeRewardWallte: '0',
    PackageOwner: id
  }).save()

  res.json('Package Created Successfully')
}
