import initDB from "../../helper/initDB";
import User from "../../helper/Modal/User";




initDB()

export default async(req,res)=>{

    const {id} = req.body;


    const currentUser = await User.findById(id);

    let currentLeftUserId = currentUser.LeftTeamId;
    let currentRightUserId = currentUser.RightTeamId;


    const leftStack = [];
    let leftPeopleBusiness = 0;
    let totalLeftPeople = 0;

    if(currentLeftUserId !== "null") leftStack.push(currentLeftUserId);

    while(leftStack.length > 0) {
        const findingUsersId = leftStack.pop();
        const foundUser = await User.findOne(findingUsersId);

        if(!foundUser) continue;

        leftPeopleBusiness += foundUser.PurchasedPackagePrice;
        totalLeftPeople += 1;

        if(foundUser.LeftTeamId !== "null") leftStack.push(foundUser.LeftTeamId);
        if(foundUser.RightTeamId !== "null") leftStack.push(foundUser.LeftRightId);
    }


    const rightStack = [];
    let rightPeopleBussiness = 0;
    let totalRightPeople = 0;

    if(currentRightUserId !== "null") rightStack.push(currentLeftUserId);

    while(rightStack.length > 0) {
        const findingUsersId = rightStack.pop();
        const foundUser = await User.findOne(findingUsersId);

        if(!foundUser) continue;

        rightPeopleBussiness += foundUser.PurchasedPackagePrice;
        totalRightPeople += 1;

        if(foundUser.LeftTeamId !== "null") rightStack.push(foundUser.LeftTeamId);
        if(foundUser.RightTeamId !== "null") rightStack.push(foundUser.LeftRightId);
    }


    res.json({
        LeftPeople: totalLeftPeople,
        RightPeople: totalRightPeople,
        LeftPeopleBusiness: leftPeopleBusiness,
        RightPeopleBusiness: rightPeopleBussiness,
    });
}