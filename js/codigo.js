$(document).ready(function(){
			var malo = $(".malo");
			var nave = $("#nave");
			var fondo = $("main");
			var rayoMalo = 0;
			var tope = fondo.width() - nave.width();
			var puntos = 0;
			var creaEnemigo = 0;
			var colisionan = false;
			var navepos = nave.position();
			var fondopos = fondo.position();
			var imgMalo = ['malo1.png','malo2.png','malo3.png','malo4.png','malo5.png'];
			var NumMalo = 0;

			//****************************************************************************

			$(".gameOver").hide();
			var centrarDiv = parseInt(fondo.css("width").replace("px","") /2) - (parseInt($(".contenedorEnergia").css("width").replace("px","") / 2));			
			$(".contenedorEnergia").css("left", centrarDiv)
			$("#nave , .malo").hide();

			function iniciar()
			{
				nave.show();
				malo.show();
				fondo.css("animation-play-state","running");
			  	nave.css("top",fondo.height() - nave.height());
			  	nave.css("left", (fondo.width()/2 - nave.width()/2) +"px");

			  	fondo.append("<div class='rayo_malo'></div");
			  	var maloPos = malo.position();
			  	$('.rayo_malo').css("top",maloPos.top + malo.outerHeight());
			  	$('.rayo_malo').css("left",maloPos.left + (malo.outerWidth() /2));

			  	var left = 0;

			 	var crea_Malo = setInterval(function(){
			 		left = 0;
			  		creaEnemigo++;
			  		fondo.append('<img class="malo" data-dispara="no" id="malo'+creaEnemigo+'" src="img/'+imgMalo[Math.floor((Math.random() * 4) + 1)]+'" />');
			  		left += Math.floor((Math.random() * 500) + 50);
			  		console.log(left + "--->" +fondo.width());
			  		if (left > fondo.width()) { left = "10"; }
			  		$("#malo"+creaEnemigo).css("left",left.toString()+"px");
			  		if(!$('.rayo_malo').is(':visible'))
			  		{
			  			$('.rayo_malo').show();
			  			posicionaMalo();
			  		}
			  		},3000);

			  	var energia = $(".energia"); 

		  		var mueve_malo = setInterval(function(){
			  		$(".malo").css("top","+=10");
			  		var fondoTope = parseInt(fondo.css("height").replace("px",""))-parseInt(fondo.css("margin").replace("px",""))
			  		$(".malo").each(function(){
			  			if ($(this).css("top").replace("px","") >= fondoTope )
						{
							$(this).remove();
							energia.css("width","-=30")
							comprobar_Energia();									
						}
		  		});
				
		  	},400);	 

		  	var mueve_rayo_malo = setInterval(function(){
		  		if ($('.rayo_malo').length >= 0)
		  		{
			  		$('.rayo_malo').css("top","+=10");
			  		colisionan = colision($('#nave'),$('.rayo_malo'),"esBuena");
			  		if (colisionan)
			  		{
			  			energia.animate({"width":"-=20"});
			  			posicionaMalo();
			  			if (parseInt(energia.css("width").replace("px","")) < 180 )
			  			{
			  				energia.css("background-color","red");
			  			}

			  			$("#nave").css("filter","opacity(50%)");
			  			setTimeout(function(){
			  				$("#nave").css("filter","opacity(100%)");},150);
			  				
						comprobar_Energia();		  		
			  		}

			  		if ($('.rayo_malo').css("top").replace("px","") > fondo.height()-10)
			  		{
			  			posicionaMalo();
			  		}

			  		$(".malo").each(function(){
				  		if ($(this).css("top").replace("px","") > fondo.outerHeight() - 400)
				  		{
			  			    	NumMalo = Math.round(Math.random() * (($(".malo").length) - 1) + 1);
			  					$("rayo_malo").css("top", $("#malo" + NumMalo).css("top"));
			  					$("#rayo_malo").show();
			  			}
			  		});
		  		}
		  		
		  	},20); 		


			}	 

		  	//****************************************************************************

		  	function colision(elem1, elem2, tipoNave) 
			{
				var elem1Pos = elem1.position();
				var elem2Pos = elem2.position();
				var topelem1 = elem1.width();
				switch (tipoNave)
				{
					case "esMala":
						if (elem2Pos.left > elem1Pos.left && elem2Pos.top < elem1Pos.top && elem2Pos.left < elem1Pos.left + topelem1)
						{
							return true;
						}
					break;
					case "esBuena":
						if (elem2Pos.left > elem1Pos.left && elem2Pos.top > elem1Pos.top && elem2Pos.left < elem1Pos.left + topelem1)
						{
							return true;
						}
					break;

				}				
			}

			//****************************************************************************
		  	
		  	function posicionaMalo ()
		  	{
		  		$(".malo").each(function(){
			  				var TopRayo =parseInt($(this).css("top").replace("px","")) + 50 + "px";
			  				var leftRayo = $(this).position().left + ($(this).width()/2);
			  				$('.rayo_malo').css({"top":TopRayo,"left":leftRayo  + "px"});			  				  		 			
		  		});	 	
		  	}


		  	function comprobar_Energia()
		  	{
		  		if (parseInt(energia.css("width").replace("px","")) <= 0)
			  			{
			  				clearInterval(mueve_rayo_malo);
			  				clearInterval(mueve_malo);
			  				clearInterval(crea_Malo);
			  				$(".malo").remove();
			  				$("#nave").remove();
			  				$(".rayo_malo").remove();
			  				$(".gameOver").show();
			  				fondo.css("animation-play-state","paused");
			  			}
		  	}		  	

		  	//****************************************************************************

		  	function controlar_Colision_Malos()
		  	{
		  		if ($("#rayo").length >= 0)
						{
							$("#rayo").animate({"top":"-=10"},10);
							if ($("#rayo").css("top").replace("px","") > $("main").css("top").replace("px",""))
							{
								$(".malo").each(function(){
									colisionan = colision($(this),$("#rayo"),"esMala");
									if (colisionan)
									{
										$("#rayo").remove();
										$(".rayo_malo").hide();
										++puntos;
										$(".puntos").html(puntos);
										$(this).attr("src","img/explosion.png");
										$(this).fadeOut();
										//setTimeout(function(){$(this).remove();},200);
										colisionan = false;
								}
								});							
							}
							else
							{
								$("#rayo").remove();
							}
						}			
		  	}

		  	//****************************************************************************

		  	$(".btniniciar").click(function(){
		  		$(this).hide();
		  		iniciar();
		  	});

		  	$(document).keydown(function(e){
		  		
		  		switch (e.keyCode)
		  		{
		  			case 39:
			  			if (navepos.left < tope)
				  			{
			  					nave.animate({left: "+=20"}, 0);
			  					navepos = nave.position();
				  			}
		  			break;
		  			case 37:
		  				nave.attr("src","img/naveleft.png");
			  			if (navepos.left >= 0)
			  				{
			  					nave.animate({left: "-=20"}, 0);
			  					navepos = nave.position();
			  				}
			  		break;
			  		case 32:
			  			if (!rayo)
			  			{
			  				fondo.append("<div id='rayo'></div>");
			  				var rayo = $("#rayo");
			  				rayoTop = navepos.top - rayo.height();
			  				rayoLeft = navepos.left + (nave.width() /2) - (rayo.width() /2);
			  				rayo.css({left: rayoLeft, top: rayoTop });
			  				var rayoPos = rayo.position();
			  				var disparar = setInterval(function(){
			  						controlar_Colision_Malos();
			  				},30);	
			  			}	  			
			  		break;
		  		} 		
		  	});

		});
