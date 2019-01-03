var arr = [],
	cnt_of_win,
	cnt_score = 0,
	score_first = 0,
	score_second = 0,
	arr_name_1 = [], // 'X', 'Name'
	arr_name_2 = [],
	tmp_restart = false,
	tmp_move = false,
	no_repeat = false,
	biggest_row_column = false, //row > column
	row,
	column,
	w;

function Restart () {
	tmp_restart = true;
	$('.btn-2').css('display','none');
	$('.overlay').css('display','none');
	Start(tmp_restart);
}

function Start(tmp_restart) {

	var name_1 = $(".start-block-name-1").val();
	var name_2 = $(".start-block-name-2").val();

	row = parseInt($(".start-text-1").val());
	column = parseInt($(".start-text-2").val());

	if(name_1 == '' || name_2 == '' || isNaN(row) == true || isNaN(column) == true){
		$('.start-block-poznamka').css('display','block');
		return;
	}
	else{$('.start-block-poznamka').css('display','none');}

	if($.trim($(".start-block-name-1").val()) == $.trim($(".start-block-name-2").val())){
		return alert('Jména musí být různá');
	}

	if(isNumber($(".start-text-1").val()) == false || isNumber($(".start-text-2").val()) == false){
		return alert('Rozsah hry musí být napsán jedním číslo');
	}

	if(row < 3 || column < 3){return alert(' Minimální číslo je 3 ');}

	$('.start-block').css('display','none');


	if(tmp_restart){//restart
		$(".hra-span").remove();
		$(".hra-wrapper-block").remove();
		score_first = 0;
		score_second = 0;
		arr_name_1 = [];
		arr_name_2 = [];
		tmp_move = false;
		no_repeat = false;
	}

	$('.btn').css('display','none');
	$('.name').css('visibility','visible');
	$('.name').css('opacity','1');

	var random_hrac = getRandomInt(2);

	if(random_hrac == 1){
		$("#symbol_1").html('Symbol: '+'X');
		arr_name_1.push('X');
		arr_name_1.push(name_1);
		$("#symbol_2").html('Symbol: '+'O');
		arr_name_2.push('O');
		arr_name_2.push(name_2);
	}else{
		$("#symbol_1").html('Symbol: '+'O');
		arr_name_1.push('O');
		arr_name_1.push(name_1);
		$("#symbol_2").html('Symbol: '+'X');
		arr_name_2.push('X');
		arr_name_2.push(name_2);
	}

	$( ".name-first-insert" ).html('Jméno: '+ name_1);
	$( ".name-second-insert" ).html('Jméno: '+ name_2);
	$( ".name-player-score" ).html('Tah: '+ cnt_score);

	if(row >= 17){$('.hra-wrapper').css('justifyContent','unset');}

	if(row <= column){

		biggest_row_column = true; //column > row

		if(row == 3 || row == 4){ //кол-во собранных знаков
			cnt_of_win = 3;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
		else if(row > 4 && row <=7){
			cnt_of_win = 4;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
		else if(row > 7){
			cnt_of_win = 5;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
	}
	else if(row > column){

		if(column == 3 || column == 4){ //кол-во собранных знаков
			cnt_of_win = 3;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
		else if(column > 4 && column <=7){
			cnt_of_win = 4;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
		else if(column > 7){
			cnt_of_win = 5;
			$(".comment-text").html('Vyhrává hráč, který jako první vytvoří nepřerušenou řadu ' + cnt_of_win + '. svých značek');
		}
	}

	var tmp_add_div = 0;

	while(tmp_add_div<row){ //создаем блоки как строки 
		$('.hra-wrapper').append('<div class="hra-wrapper-block"></div>');
		tmp_add_div++;
	}

	var array_el = $('.hra-wrapper-block');

	for(var i = 0; i < row; i++){ //create array
		arr[i] = [];

		for(var p = 0; p < column; p++){ // arr.push([i,p] + ' ');

			arr[i][p] = 0;

			if(p+1 == column){
				array_el.eq(i).append('<span class="hra-span without_border">/</span');
				break;
			}
			array_el.eq(i).append('<span class="hra-span with_border">/</span');
		}
	}

	if(row > 8 || column>9){
		$('.hra-span').css("padding","6");
	}
	if(row > 10 || column>10){
		$('.hra-span').css("padding","0");
	}
}

function getRandomInt(max){return Math.floor(Math.random() * Math.floor(max));}

$("body").on( "click", '.hra-span', function() { // add symbol

	if($(this).text() == '/'){ //если я еще не ходил в клетку

		if(tmp_move == false){
			$(this).text("X");
			tmp_move = true;

			if(arr_name_1[0] == 'X'){
				score_first++;
				$( ".name-player-score-first" ).html('Tah: '+ score_first);
			}
			else{
				score_second++;
				$( ".name-player-score-second" ).html('Tah: '+ score_second);
			}

			//check results
			var parent_position = $(this).parent().index();
			var symbol_position = $(this).index();
			let choice = 'X';

			arr[parent_position][symbol_position] = choice; //add symbol if we clicked on label like X

			check_win_string(choice);
			check_win_column(choice);

			if(row == column){
				check_diagonal_plus(choice);
				check_diagonal_plus_down(choice);
			}
			else{
				if(biggest_row_column){ // c>r
					w=0;
					chech_diag_first(choice);
					check_diag_second(choice);
				}
				else{
					w=1;
					chech_diag_first(choice);
					check_diag_second(choice);
				}
			}
			check_draw(choice);
		}
		else{
			$(this).text("O");
			tmp_move = false;

			if(arr_name_1[0] == 'O'){
				score_first++;
				$( ".name-player-score-first" ).html('Tah: '+ score_first);
			}
			else{
				score_second++;
				$( ".name-player-score-second" ).html('Tah: '+ score_second);
			}

			var parent_position_nula = $(this).parent().index();
			var symbol_position_nula = $(this).index();
			let choice = 'O';

			arr[parent_position_nula][symbol_position_nula] = choice; //add symbol if we clicked on the label like O

			check_win_string(choice);
			check_win_column(choice);
			
			if(row == column){
				check_diagonal_plus(choice);
				check_diagonal_plus_down(choice);
			}
			else{
				if(biggest_row_column){ // c>r
					w=0;
					chech_diag_first(choice);
					check_diag_second(choice);
				}
				else{
					w=1;
					chech_diag_first(choice);
					check_diag_second(choice);
				}
			}
			check_draw(choice);
		}

	}
	else{return;}
});

function check_win_string (choice) {
	let cnt = 0;

	for(let z = 0; z < row; z++){

		for(let j = 0; j < column; j++){

			if(arr[z][j] == choice){//если равно о или х
				cnt++;
			}
			else{
				cnt = 0;
			}
			if(cnt == cnt_of_win){
				return check_winner(choice);
			}
		}
		cnt = 0;
	}
}

function check_win_column (choice) {
	let cnt = 0;

	for(let z = 0; z < column; z++){
		for(let j = 0; j < row; j++){
			if(arr[j][z] == choice)
			{
				cnt++;
			}
			else{
				cnt = 0;
			}
			if(cnt == cnt_of_win){
				return check_winner(choice);
			}
		}
		cnt = 0;
	}
}

function check_diagonal_plus(choice) { //all ↗ 5x5
	var i = 0;
	var j = 0;
	let sum = 0;

	for(var cnt=0; cnt<row+column-1; cnt++){

		sum = 0;

		if(cnt<arr.length) {
        	i = cnt;
        	j = 0;
        }
        else {
        	i = arr.length-1;
        	j = (cnt+1)%arr.length;
        }
        while(i>=0 && j<arr.length)
        {
        	if(arr[i][j] == choice){
        		sum++;
        	}
        	else{
        		sum = 0;
        	}
        	if(sum == cnt_of_win){
				check_winner(choice);
			}
        	i--;
        	j++;
        }
	}
}

function chech_diag_first (choice) { //all ↗

    for(let i = 0; i < row-w; i++)
    {
    	sum = 0;

        let j = 0;
        let t = i;

        if(column < row)
        {
            while(t >= 0 && j < column)
            {
                if(arr[t][j] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
                t--;
                j++;
            }
        }
        else
        {
            while(t >= 0)
            {
                if(arr[t][j] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
                t--;
                j++;
            }
        }
    }

    for(let j= 1-w; j<column; j++) //когда упираемся в последнюю точку 7.0
    {
    	sum = 0;

        let i = row-1;
        let t = j;

        if(column > row)
        {
            while(t < column && i>=0)
            {
                if(arr[i][t] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
                t++;
                i--;
            }
        }
        else
        {
            while(t < column)
            {
                if(arr[i][t] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
                t++;
                i--;
            }
        }
    }
}

function check_diagonal_plus_down (choice) { //all ↘ 5x5
	var i = 0;
	var j = 0;
	let sum = 0;
	var was_in = false;

	for(var cnt=0; cnt<2*arr.length-1; cnt++){

		sum = 0;

		if(cnt<arr.length) {
			i = arr.length-1;//4
			j= cnt;
        }
        else {
        	j = arr.length-1;
        	i = (cnt+1)%arr.length - 1;
        }

        while(j>=0 && i<=arr.length-1 && i>=0) //i>0
        {
        	if(arr[i][j] == choice){
        		sum++;
        	}
        	else{
        		sum = 0;
        	} 
        	if(sum == cnt_of_win){
				check_winner(choice);
			}
        	i--;
        	j--;
        }
	}
}

function check_diag_second (choice) { //all ↘ 5x5

	let i = 0;
	let j = 0;
	let p = 0;
	let z = 0;

	for(let cnt = 0; cnt < column-w; cnt++){

		sum = 0;

		if(row < column){
			i = arr.length-1; // 2
			j = cnt; // 0

			while(j>=0 && i >= 0){

				if(arr[i][j] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
				j--;
				i--;
			}
		}
		else{ //column > row
			i = arr.length-1; // 7
			j = cnt; // 0

			while(j>=0){

				if(arr[i][j] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
				j--;
				i--;
			}
		}
	}
	for(let cnt = 0; cnt < row; cnt++){

		sum = 0;

		if(row < column){

			p = cnt; // 0
			z = column-1; // 7

			while(p>=0){

				if(arr[p][z] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
				z--;
				p--;
			}
		}
		else{

			z = column-1;
			p = cnt;

			while(z>=0 && p >=0){
				if(arr[p][z] == choice){
	        		sum++;
	        	}
	        	else{
	        		sum = 0;
	        	} 
	        	if(sum == cnt_of_win){
					return check_winner(choice);
				}
				p--;
				z--;
			}
		}
	}
}

function check_winner (choice) {
	if(choice == 'X'){// return alert('Win Xxxxxxxxx');
		$('.btn-2').css('display','block');
		$('.overlay').css('display','block');
		if(arr_name_1[0] == 'X'){
			no_repeat = true; // для того чтобы не повторялся алерт с ничьей
			return alert('Vyhrál: ' + arr_name_1[1]);
		}
		else{
			no_repeat = true;
			return alert('Vyhrál: ' + arr_name_2[1]);
		}
	}
	else{// return alert('Win Ooooooooo');
		$('.btn-2').css('display','block');
		$('.overlay').css('display','block');
		if(arr_name_1[0] == 'O'){
			no_repeat = true;
			return alert('Vyhrál: ' + arr_name_1[1]);
		}
		else{
			no_repeat = true;
			return alert('Vyhrál: ' + arr_name_2[1]);
		}
	}
}

function check_draw (choice) {
	let cnt_s = 0;

	for(let z = 0; z < row; z++){

		for(let j = 0; j < column; j++){

			if(arr[z][j] == 'X' || arr[z][j] == 'O'){
				cnt_s++;
			}
		}
	}
	if(cnt_s == row*column && no_repeat == false){ // если ничья
		$('.btn-2').css('display','block');
		$('.overlay').css('display','block');
		return alert('Draw');
	}
}

function isNumber(n){return !isNaN(parseFloat(n)) && isFinite(n);}