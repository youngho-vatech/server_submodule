
import Order from '../../models/order.js';
import Task from '../../models/task.js';
import users from '../../models/user.js';
// resolver에서 mutation을 정의하고 구현하는 걸 보니 가장 중요한 부분이 아닐까 싶다. service 단이라고 생각하자
const resolvers = {
    Query: {
        // 주문 목록
        orders: async (_, args) => {
            try {
                if (args.hi == "icecream") {
                    return await Order.find({ "hi": { $eq: "icecream" } })
                }
                else if (args.hi == "etc") {
                    return await Order.find({ "hi": { $eq: "etc" } })
                }
                else {
                    return await Order.find({ "hi": { $nin: ["icecream", "etc"] } })
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        // 나의 주문
        orderMine: async (_, args) => {
            try {
                const user = await users.findById(args._id)
                const word = user.username

                return await Order.find({ "username": { $eq: word } })
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        // 게시글 목록
        tasks: async (_, args) => {
            try {
                let tasks = await Task.find();
                if (tasks.length == 0) return null;
                return tasks;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        // 유저 목록
        user: async (_, args) => {
            const word = args.word;
            const category = args.category;
            const result = []
            if (category == 1) {
                if (word == "") return result
                return await users.find({ "username": { $regex: word } }).sort({ "username": 1 })
            }
            else {
                if (word == "") return result
                return await users.find({ "username": { $regex: word }, "position": { $eq: "주문자" } }).sort({ "username": 1 })
            }

        },
        // 모든 유저 검색
        allUsers: async (_, args) => {
            try {
                return users.find().sort({ "username": 1 })
            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 내 정보
        me: async (_, args) => {
            return await users.findById(args.userid)
        },
        // 주문 정보
        howmany: async (_, args) => {
            const number = [0, 0, 0, 0];
            const people = await users.find()
            for (let i = 0; i < people.length; i++) {
                if (people[i].status === "주문완료") {
                    number[0]++;
                }
                else if (people[i].status === "주문취소") {
                    number[1]++;
                }
                else if (people[i].status === "주문포기") {
                    number[2]++;
                }
                else {
                    number[3]++;
                }
            }
            return number;

        },
        // 가격 정보
        howmuch: async (_, args) => {
            let sum = 0;
            const orders = await Order.find();
            console.log(orders.length)
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].menu === "아메리카노") {

                    sum += 2000;
                }
                else if (orders[i].menu === "카페라떼") {

                    sum += 2500;
                }
                else if (orders[i].menu === "바닐라라떼") {

                    sum += 3000;
                }
                else if (orders[i].menu === "카페모카") {

                    sum += 3000;
                }
                else if (orders[i].menu === "아시나요") {

                    sum += 3000;
                }
                else if (orders[i].menu === "돼지콘") {

                    sum += 3000;
                }
                else if (orders[i].menu === "브라보") {

                    sum += 3000;
                }
                else if (orders[i].menu === "녹차마루") {

                    sum += 3000;
                }
                else if (orders[i].menu === "아이스티") {

                    sum += 2000;
                }
                else if (orders[i].menu === "망고 요거트 스무디") {

                    sum += 3400;
                }
                else if (orders[i].menu === "딸기 요거트 스무디") {

                    sum += 3400;
                }
                else if (orders[i].menu === "플레인 요거트 스무디") {

                    sum += 3400;
                }
            }
            return sum;
        },
        // 커피 종류별 현황
        includedCoffee: async (_, args) => {
            const menu = args.menu;
            const hi = args.hi;
            return await Order.find({ "menu": { $eq: menu }, "hi": { $eq: hi } }).sort({ "username": 1 })
        },
        // 커피 주문자 현황
        includedOrdermen: async (_, args) => {
            return await users.find({ "position": { $eq: "주문자" } }).sort({ "username": 1 })
        },
        // 휴가자 현황
        includedVacation: async (_, args) => {
            return await users.find({ "position": { $eq: "휴가자" } }).sort({ "username": 1 })
        },
        // 미주문자 현황
        includedNothing: async (_, args) => {
            const result = users.find({ "status": { $eq: "대기중" }, "position": { $ne: "휴가자" } }).sort({ "username": 1 })
            return result
        },
        // 영수증
        receipt: async (_, args) => {
            const orders = await Order.find()
            const orderV = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let mention = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].menu === "아메리카노" && orders[i].hi === "hot") {
                    orderV[0]++;
                }
                else if (orders[i].menu === "아메리카노" && orders[i].hi === "ice") {
                    orderV[1]++;
                }
                else if (orders[i].menu === "카페라떼" && orders[i].hi === "hot") {
                    orderV[2]++;
                }
                else if (orders[i].menu === "카페라떼" && orders[i].hi === "ice") {
                    orderV[3]++;
                }
                else if (orders[i].menu === "바닐라라떼" && orders[i].hi === "hot") {
                    orderV[4]++;
                }
                else if (orders[i].menu === "바닐라라떼" && orders[i].hi === "ice") {
                    orderV[5]++;
                }
                else if (orders[i].menu === "카페모카" && orders[i].hi === "hot") {
                    orderV[6]++;
                }
                else if (orders[i].menu === "카페모카" && orders[i].hi === "ice") {
                    orderV[7]++;
                }
                else if (orders[i].menu === "아시나요" && orders[i].hi === "icecream") {
                    orderV[8]++;
                }
                else if (orders[i].menu === "돼지콘" && orders[i].hi === "icecream") {
                    orderV[9]++;
                }
                else if (orders[i].menu === "브라보" && orders[i].hi === "icecream") {
                    orderV[10]++;
                }
                else if (orders[i].menu === "녹차마루" && orders[i].hi === "icecream") {
                    orderV[11]++;
                }
                else if (orders[i].menu === "아이스티" && orders[i].hi === "etc") {
                    orderV[12]++;
                }
                else if (orders[i].menu === "망고 요거트 스무디" && orders[i].hi === "etc") {
                    orderV[13]++;
                }
                else if (orders[i].menu === "딸기 요거트 스무디" && orders[i].hi === "etc") {
                    orderV[14]++;
                }
                else if (orders[i].menu === "플레인 요거트 스무디" && orders[i].hi === "etc") {
                    orderV[15]++;
                }
            }

            for (let i = 0; i < orderV.length; i++) {
                if (orderV[i] != 0 && i == 0) {
                    mention[i] = "hot 아메리카노 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 1) {
                    mention[i] = "ice 아메리카노 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 2) {
                    mention[i] = "hot 카페라떼 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 3) {
                    mention[i] = "ice 카페라떼 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 4) {
                    mention[i] = "hot 바닐라라떼 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 5) {
                    mention[i] = "ice 바닐라라떼 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 6) {
                    mention[i] = "hot 카페모카 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 7) {
                    mention[i] = "ice 카페모카 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 8) {
                    mention[i] = "아시나요 : " + orderV[i] + "개"
                }
                else if (orderV[i] != 0 && i == 9) {
                    mention[i] = "돼지콘 : " + orderV[i] + "개"
                }
                else if (orderV[i] != 0 && i == 10) {
                    mention[i] = "브라보 : " + orderV[i] + "개"
                }
                else if (orderV[i] != 0 && i == 11) {
                    mention[i] = "녹차마루 : " + orderV[i] + "개"
                }
                else if (orderV[i] != 0 && i == 12) {
                    mention[i] = "아이스티 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 13) {
                    mention[i] = "망고 요거트 스무디 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 14) {
                    mention[i] = "딸기 요거트 스무디 : " + orderV[i] + "잔"
                }
                else if (orderV[i] != 0 && i == 15) {
                    mention[i] = "플레인 요거트 스무디 : " + orderV[i] + "잔"
                }
            }
            return mention
        },
        // 커피 별 주문자 현황
        receiptUser: async (_, args) => {
            let start = new Date();
            const cmenu = args.cmenu

            let result = ""
            if (cmenu == 0) {
                const orders0 = await Order.find({ "menu": { $eq: "아메리카노" }, "hi": { $eq: "hot" } }).sort({ "username": 1 })

                for (let i = 0; i < orders0.length; i++) {
                    if (i == orders0.length - 1) {
                        result += orders0[i].username
                    }
                    else {
                        result += orders0[i].username + ", "
                    }

                }
                
                return result
            }

            else if (cmenu == 1) {
                const orders1 = await Order.find({ "menu": { $eq: "아메리카노" }, "hi": { $eq: "ice" } }).sort({ "username": 1 })
                for (let i = 0; i < orders1.length; i++) {
                    if (i == orders1.length - 1) {
                        result += orders1[i].username
                    }
                    else {
                        result += orders1[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 2) {
                const orders2 = await Order.find({ "menu": { $eq: "카페라떼" }, "hi": { $eq: "hot" } }).sort({ "username": 1 })
                for (let i = 0; i < orders2.length; i++) {
                    if (i == orders2.length - 1) {
                        result += orders2[i].username
                    }
                    else {
                        result += orders2[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 3) {
                const orders3 = await Order.find({ "menu": { $eq: "카페라떼" }, "hi": { $eq: "ice" } }).sort({ "username": 1 })
                for (let i = 0; i < orders3.length; i++) {
                    if (i == orders3.length - 1) {
                        result += orders3[i].username
                    }
                    else {
                        result += orders3[i].username + ", "
                    }

                }
                return result

            }
            else if (cmenu == 4) {
                const orders4 = await Order.find({ "menu": { $eq: "바닐라라떼" }, "hi": { $eq: "hot" } }).sort({ "username": 1 })
                for (let i = 0; i < orders4.length; i++) {
                    if (i == orders4.length - 1) {
                        result += orders4[i].username
                    }
                    else {
                        result += orders4[i].username + ", "
                    }

                }
                return result

            }
            else if (cmenu == 5) {
                const orders5 = await Order.find({ "menu": { $eq: "바닐라라떼" }, "hi": { $eq: "ice" } }).sort({ "username": 1 })
                for (let i = 0; i < orders5.length; i++) {
                    if (i == orders5.length - 1) {
                        result += orders5[i].username
                    }
                    else {
                        result += orders5[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 6) {
                const orders6 = await Order.find({ "menu": { $eq: "카페모카" }, "hi": { $eq: "hot" } }).sort({ "username": 1 })
                for (let i = 0; i < orders6.length; i++) {
                    if (i == orders6.length - 1) {
                        result += orders6[i].username
                    }
                    else {
                        result += orders6[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 7) {
                const orders7 = await Order.find({ "menu": { $eq: "카페모카" }, "hi": { $eq: "ice" } }).sort({ "username": 1 })
                for (let i = 0; i < orders7.length; i++) {
                    if (i == orders7.length - 1) {
                        result += orders7[i].username
                    }
                    else {
                        result += orders7[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 8) {
                const orders8 = await Order.find({ "menu": { $eq: "아시나요" }, "hi": { $eq: "icecream" } }).sort({ "username": 1 })
                for (let i = 0; i < orders8.length; i++) {
                    if (i == orders8.length - 1) {
                        result += orders8[i].username
                    }
                    else {
                        result += orders8[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 9) {
                const orders9 = await Order.find({ "menu": { $eq: "돼지콘" }, "hi": { $eq: "icecream" } }).sort({ "username": 1 })
                for (let i = 0; i < orders9.length; i++) {
                    if (i == orders9.length - 1) {
                        result += orders9[i].username
                    }
                    else {
                        result += orders9[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 10) {
                const orders10 = await Order.find({ "menu": { $eq: "브라보" }, "hi": { $eq: "icecream" } }).sort({ "username": 1 })
                for (let i = 0; i < orders10.length; i++) {
                    if (i == orders10.length - 1) {
                        result += orders10[i].username
                    }
                    else {
                        result += orders10[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 11) {
                const orders11 = await Order.find({ "menu": { $eq: "녹차마루" }, "hi": { $eq: "icecream" } }).sort({ "username": 1 })
                for (let i = 0; i < orders11.length; i++) {
                    if (i == orders11.length - 1) {
                        result += orders11[i].username
                    }
                    else {
                        result += orders11[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 12) {
                const orders12 = await Order.find({ "menu": { $eq: "아이스티" }, "hi": { $eq: "etc" } }).sort({ "username": 1 })
                for (let i = 0; i < orders12.length; i++) {
                    if (i == orders12.length - 1) {
                        result += orders12[i].username
                    }
                    else {
                        result += orders12[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 13) {
                const orders13 = await Order.find({ "menu": { $eq: "망고 요거트 스무디" }, "hi": { $eq: "etc" } }).sort({ "username": 1 })
                for (let i = 0; i < orders13.length; i++) {
                    if (i == orders13.length - 1) {
                        result += orders13[i].username
                    }
                    else {
                        result += orders13[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 14) {
                const orders14 = await Order.find({ "menu": { $eq: "딸기 요거트 스무디" }, "hi": { $eq: "etc" } }).sort({ "username": 1 })
                for (let i = 0; i < orders14.length; i++) {
                    if (i == orders14.length - 1) {
                        result += orders14[i].username
                    }
                    else {
                        result += orders14[i].username + ", "
                    }

                }
                return result
            }
            else if (cmenu == 15) {
                const orders15 = await Order.find({ "menu": { $eq: "플레인 요거트 스무디" }, "hi": { $eq: "etc" } }).sort({ "username": 1 })
                for (let i = 0; i < orders15.length; i++) {
                    if (i == orders15.length - 1) {
                        result += orders15[i].username
                    }
                    else {
                        result += orders15[i].username + ", "
                    }

                }
                return result
            }

            let end = new Date()
            console.log(end - start, "밀리초")


            return result

        }

    },
    Mutation: {
        // 주문 생성
        createOrder: async (_, args) => {
            try {
                const us = await users.findById(args._id)
                const confirm = us.status
                if (confirm === "주문완료") throw new Error("이미 주문 하셨습니다.");

                const username = us.username
                const menu = args.menu;
                const hi = args.hi
                const order = new Order({ username, menu, hi });

                await users.findByIdAndUpdate(args._id, { status: "주문완료" });
                const result = await order.save();

                return result;
            } catch (e) {
                throw new Error('Error: ', e);
            }
        },
        // 주문 제거
        removeOrder: async (_, args) => {
            try {
                await users.findByIdAndUpdate(args.userid, { status: "주문취소" });
                const removedorder = await Order.findByIdAndRemove(args.orderid).exec()
                return removedorder
            } catch (e) {
                throw new Error('Error: ', e)
            }
        },
        // 주문 업데이트
        updateOrder: async (_, { userid, orderid, menu, hi }, { user }) => {
            try {
                await users.findByIdAndUpdate(userid, { status: "주문완료" });
                const updatedOrder = await Order.findByIdAndUpdate(orderid, {
                    $set: { menu, hi }
                }).exec()
                return updatedOrder
            } catch (e) {
                throw new Error('Error: ', e)
            }
        },
        // 주문 포기
        giveupOrder: async (_, args) => {
            await users.findByIdAndUpdate(args.userid, { status: "주문포기" });
            return "주문을 포기하셨습니다."
        },
        // 구매 확정
        confirmOrders: async (_, args) => {

            await Order.deleteMany({});
            await Task.deleteMany({});
            await users.updateMany({ $set: { "status": "대기중", "position": "주문자" } });

            return "완료 처리 되었습니다. 맛있게 드세요!"
        },
        // 게시글 생성
        createTask: async (_, { userid, title }) => {
            try {
                const isthere = await Task.find()
                if (isthere.length != 0) {
                    throw new Error
                }
                const us = await users.findById(userid);
                const creater = us.username;
                const task = new Task({
                    creater,
                    title
                })
                const result = await task.save();
                await users.findByIdAndUpdate(userid, { position: "결제자" })

                return result;
            } catch (e) {
                throw new Error('Error: 이미 다른 주문이 진행중입니다. 주문이 완료되면 그때 다시 시도해주세요', e);
            }
        },
        // 게시글 제거
        removeTask: async (_, { _id, userid }) => {
            try {
                const removedTask = await Task.findByIdAndRemove(_id).exec()
                await users.findByIdAndUpdate(userid, { position: "주문자" })
                return removedTask
            } catch (e) {
                throw new Error('Error: ', e)
            }
        },
        // 게시글 업데이트
        updateTask: async (_, { _id, title }, { user }) => {
            try {

                const updatedTask = await Task.findByIdAndUpdate(_id, {
                    $set: { title }
                }).exec()
                return updatedTask
            } catch (e) {
                throw new Error('Error: ', e)
            }
        },
        // 유저 등록
        registerUser: async (_, args) => {
            try {
                const username = args.username;
                const user = new users({
                    username
                })
                const re = await users.find({ "username": { $eq: username } })
                if (re.length != 0) throw new Error("이미 있는 유저입니다.");

                return await user.save();
            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 휴가자 등록
        updatePosition: async (_, args) => {
            try {
                const ids = args.ids;
                for (let i = 0; i < ids.length; i++) {

                    await users.findByIdAndUpdate(ids[i], { $set: { "position": "휴가자" } })

                }

                return "휴가자 등록이 완료 되었습니다."

            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 유저이름 수정
        updateUser: async (_, { _id, username }) => {
            try {

                return await users.findByIdAndUpdate(_id, { $set: { username } }).exec()
            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 주문자로 수정
        getbackUser: async (_, args) => {
            try {
                const ids = args.ids;
                for (let i = 0; i < ids.length; i++) {

                    await users.findByIdAndUpdate(ids[i], { $set: { "position": "주문자" } })

                }
                return "해당 인원은 주문자로 다시 바뀌었습니다."

            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 대기중으로 수정
        getbackStatus: async (_, args) => {
            try {
                const id = args._id;

                await users.findByIdAndUpdate(id, { $set: { "status": "대기중" } })


                return "해당 인원은 주문포기에서 대기중으로 다시 바뀌었습니다."

            } catch (error) {
                throw new Error(error.message)
            }
        },
        // 유저 삭제
        deleteUser: async (_, args) => {
            const arr = args.ids
            console.log(args.ids)
            for (let i = 0; i < arr.length; i++) {

                const removedUser = await users.findByIdAndRemove(arr[i]).exec()
            }

            return "선택한 유저가 모두 삭제 되었습니다."
        }
    }
};

export default resolvers;