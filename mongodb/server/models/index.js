import mongoose from 'mongoose';

const {DB_USER, DB_PASSWORD, DB_NAME} = process.env;

// 로컬 주소 : mongodb://${DB_USER}:${DB_PASSWORD}@localhost:27017/${DB_NAME}?authSource=admin
const MONGO_URL = `mongodb+srv://admin:1234@cluster0.rnsm9.mongodb.net/miniPJT?retryWrites=true&w=majority`;


// 몽고디비 연결
export default function () {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,      // 이걸 적지 않으면 deprecatedError가 발생, 심각한 오류는 아니긴 하다고 함 이왕이면 써주는 것이 나음
        useUnifiedTopology: true,    // 똑같음
        useFindAndModify: false
    }).then(() => {
        console.log('MongoDB Connected')
    }).catch(err => {
        console.log(err);
    });
}