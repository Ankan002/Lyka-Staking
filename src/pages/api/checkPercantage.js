import initDB from '../../helper/initDB'
import RankEligibilityBonusFill from '../../helper/Modal/Bonus/RankEligibilityBonusFill'
import PackageHistory from '../../helper/Modal/History/PackageHistory'




initDB()

export default async (req, res) => {

  const { id } = req.body
    
  var num = 0

  const findData = await RankEligibilityBonusFill.find({ UpperLineUserId: id })

  for (let index = 0; index < findData.length; index++) {
    num = num + Number(findData[index].BusinessAmount)
  }

  const findPack = await PackageHistory.findOne({ PackageOwner: id })
  console.log(findPack)

  if (findPack !== null) {
    console.log(findPack.PackagePrice)

    var getPercantage

    if (Number(findPack.PackagePrice) == 500) {

        getPercantage = 5000
      
    }else if(Number(findPack.PackagePrice) == 1000) {

        getPercantage = 10000

    }else if(Number(findPack.PackagePrice) == 2500) {

        getPercantage = 25000
      
    }else if(Number(findPack.PackagePrice) == 5000) {

        getPercantage = 100000
      
    }else if(Number(findPack.PackagePrice) == 10000) {

        getPercantage = 500000
      
    }else if(Number(findPack.PackagePrice) == 25000) {

        getPercantage = 1000000
      
    }else if(Number(findPack.PackagePrice) == 50000) {

        getPercantage = 2500000
      
    }else if(Number(findPack.PackagePrice) == 50000) {

        getPercantage = 10000000
      
    }

   return res.send({goal:getPercantage,crWall:num})
  }

 return res.send({goal:getPercantage,crWall:num})
}
