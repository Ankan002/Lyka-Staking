import initDB from "../../../helper/initDB";
import User from "../../../helper/Modal/User";
import PackageHistory from "../../../helper/Modal/History/PackageHistory";

initDB()

export default async(req,res)=>{

    const {id} = req.body;
    const getUserData = await User.findById(id)

    const leftUser = getUserData.LeftTeamId
    const rightUser = getUserData.RightTeamId

    var leftUserAmount = 0
    var rightUserAmount = 0

    if (leftUser !== "null") {

        const findLeftUserData = await User.findById(leftUser)
        leftUserAmount = leftUserAmount + Number(findLeftUserData.MainWallet)
        
    }

    if (rightUser !== "null") {

        const findLeftUserData = await User.findById(rightUser)
        rightUserAmount = rightUserAmount + Number(findLeftUserData.MainWallet)
        
    }

    var totalBothSideIncome = leftUserAmount + rightUserAmount // this is total business of both sides




    // Now We Will Calculate Total Turnover --------------------------------------------------->



    var totalTurnOver = 0


    const totOver = await PackageHistory.find()

    totOver.map((hit)=>{
        return totalTurnOver = totalTurnOver + Number(hit.PackagePrice)
    })

    // Now We Will Calculate Total Users --------------------------------------------------->

    var totalMyUsers = await User.find()


    // Now We Will Calculate How Many Topups Happens Today --------------------------------------------------->


    var todayDate = new Date()

    console.log(todayDate)

    var dst = todayDate.getDate()

    var aajKaDate = todayDate.getFullYear()+"-"+todayDate.getMonth()+1+"-"+dst

    console.log(aajKaDate)

    const todayTopOvers = await PackageHistory.find({created_on: {
        $gte: new Date(5, 1, 2023), 
        $lt: new Date(5, 1, 2023)
    }})

    var TodayEarning = 0

    console.log(todayTopOvers)

    todayTopOvers.map((hit)=>{
        
        console.log("came here")

        return TodayEarning = TodayEarning + Number(hit.PackagePrice)
    })


    // Now We Will Calculate Total Transactions --------------------------------------------------->



    return res.json({
        UserData:getUserData,
        TotalSideBusiness:totalBothSideIncome.toFixed(0),
        TotalBuinsessTurnover:totalTurnOver.toFixed(0),
        TotalUsers:totalMyUsers.length,
        TodayTopups:TodayEarning,
        ThisWeekTopups:TodayEarning,
        AllTransactions:totOver,
        AllDeposits:totOver

    })












}