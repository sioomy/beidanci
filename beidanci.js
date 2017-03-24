/**
 * author:功夫熊猫
 * qq:11600053
 * email:sioomy@qq.com
 * 2016年12月27
 */
var file = process.argv[2];

if(typeof(file) == 'undefined'){
	console.log("请输入要解析的文件名!");	
	process.exit();
}

console.log("开始解析单词");

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream(file)
});


var words = [];

var max = 0;

var last_word = 0;
rl.on('line', (line) => {
	
	if(/^[^\s]+\s.*/.test(line)){//包含单词的行
		var obj={};
		var arr = line.split(" ");
		obj.key = arr[0];
		var text = line.replace(/^[^\s]+\s/,"");
		obj.val = text;
		words.push(obj);
	}else if(words.length!=0){
		var obj = words[words.length-1];
		obj.val +="\n"+line;
	}

}).on('close', () => {
    console.log("解析完毕!\n输入[回车]->保留该单词，[1或'+回车]->扔掉熟悉的单词,[2或/或？+回车]->提示选项,[空格+回车]恢复上次扔掉的单词,[print+回车]输出剩余单词。");
	//console.log(words);
	console.log("词库中单词数:"+words.length);
	max = words.length;

	//打乱顺序
	var word_randam = [];
	while(words.length>0){
		var index = Math.floor(Math.random()*words.length);
		var obj = words.splice(index,1)[0];
		word_randam.push(obj);
	}
	words = word_randam;

	begin();
})


var obj_bak = "";

function begin(idx){

	
	//console.log(index,obj);
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	if (typeof(idx)=="undefined"){
		var index = Math.floor(Math.random()*words.length);
	}else{
		var index = idx;
	}
	var obj = words[index];
	rl.question('单词：[ \033[1;32;40m'+obj.key+"\033[0m ]                 "+"池中剩余("+words.length+":"+Math.floor(words.length/max*100)+"%)\n", (answer) => {
	  // TODO: Log the answer in a database
	  //console.log('Thank you for your valuable feedback:', answer);
	  
		if(answer=="1"||answer=="'"){
			//console.log("	[ \033[1;32;40m"+obj[0].key+" \033[0m  ]被保留\n");
			obj_bak = words.splice(index,1)[0];
			console.log("	[扔掉]：\033[1;31;40m"+obj.val+"\033[0m\n");
			
	  	}else if(answer=="2"||answer=="?"||answer=="/"){
			var means = [];
			means.push(obj);
			means.push(words[Math.floor(Math.random()*words.length)]);
			means.push(words[Math.floor(Math.random()*words.length)]);
			means.push(words[Math.floor(Math.random()*words.length)]);
			console.log(" [提示选项]\033[1;33;40m\n")
			while(means.length>0){
				var idx = Math.floor(Math.random()*means.length);
				var obj1 = means.splice(idx,1)[0];
				console.log("	("+(4-means.length)+")."+obj1.val+"\n");
			}
			console.log("\033[0m");
			rl.close();
			begin(index);
			return;
		}else if(answer == " "){//后悔选项,把刚才删掉的单词再加回去
			if(obj_bak != ""){
				console.log("	[恢复]：\033[1;35;40m"+obj_bak.key+"\033[0m\n");
				words.push(obj_bak);
				obj_bak = "";
			}
			rl.close();
			begin(index);
			return;
		}else if(answer == "print"){//打印剩余单词
			for(var i=0;i<words.length;i++){
				console.log('单词：[ \033[1;32;40m'+words[i].key+"\033[0m ]   \n");
				console.log("	\033[1;37;40m"+words[i].val+"\033[0m\n");
			}
			
			rl.close();
			begin(index);
			return;
		}else{
			console.log("	[保留]：\033[1;36;40m"+obj.val+"\033[0m\n");
			
		}

		
		rl.close();

	  	if(words.length!=0)
	  	begin();
		
	});


}

