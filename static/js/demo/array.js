dddd
function arrayDemo() {
    var colors = ['red', 'green', 'blue']
    console.log("Join:" + colors.join('||'));

    var item_add = colors.push('black'); //在数组面前添加元素，数组长度加加一，返回该元素
    console.log(colors);

    var item_p = colors.pop(); //返回数组的最后一项，数组长度减小
    console.log(item_p);

    var item_s = colors.shift();
    console.log(item_s);
    console.log(colors);

    //重新排序方法
    var aNum = [23, 34, 1, 90, 56, 48, 76]
    console.log(aNum.reverse());
    //	正常排序
    console.log(aNum.sort());
    console.log(aNum.sort(compare));

    //contact
    colors.concat('baby', ['brown', 'pink']);
    //slice(),f返回的项目不包括末尾位置的项，slice不影响原始数组
    console.log(colors.splice(1, 3));
    console.log(colors);
    //位置方法indexOf lastIndexOf,都包括两个参数：要查找的项和查找的起点，起点参数选填，不传则从数组第一项开始查找
    var aNum2 = [1, 2, 4, 0, 4, 5, 23, 6, 1, 8]
    console.log(aNum2.lastIndexOf(0)); //并没有从尾部开始查找
    console.log(aNum2.indexOf(5));



}

function compare(val1, val2) {
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
}

arrayDemo();
