import j from '../helper';

export default function () {
    // 2 hours 35 minutes 44 sec 999 milli
    // const val = new Date(0, 0, 0, 2, 35, 44, 999) - new Date(0, 0, 0, 0, 0, 0, 0);
    //
    // console.assert(j.getHours(val) === 2);
    // console.assert(j.getMinutes(val) === 35);
    // console.assert(j.getSeconds(val) === 44);
    // console.assert(j.getMilliseconds(val) === 999);


    // let start = new Date().getTime();
    //
    // let cur = 0;
    // while (cur <= 10000000) {
    //     cur += 1;
    //     j.getMilliseconds(999999);
    // }
    //
    // let end = new Date().getTime();
    //
    // console.log(end - start);

    let val = j.convertToMillisec(2, 35, 44, 999);

};