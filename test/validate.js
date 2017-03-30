var ok1, ok2, ok3;
validate1() {
	//ajax('xxx',{},function(){
	//ok1=1
	//})
}
validate2() {
	//ajax
	//ok2=1
}
validate3() {
	//ajax
	//ok3=1
}

$('#v1').blur(function() {
	validate1()
})
$('#v2').blur(function() {
	validate2()
})
$('#v3').blur(function() {
	validate3()
})

function submit() {
	// $.ajax or form.submit()
}
$("#xiayibu").click(function() {
	if (ok1 && ok2 && ok3) submit();
});