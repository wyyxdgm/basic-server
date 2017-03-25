function demo() {
    var num = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (i == 5 && j == 5) { //
                break; //只是跳出内部循环
            }
            num++
        }
    }
    console.log(num);
}
demo();
