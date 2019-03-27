
	//handle the first turn where the AI must play a hand including 3 of clubs
	function handleFirstAITurn()
	{
		var bestPlay = false;
		
		lastPlayerComment = "So it begins!";
		
		//try to play a full house with 3 clubs if we have it
		if((bestPlay == false) && (fullHouseHand.length>0))
		{
			
			if(((fullHouseHand[0][0].number == "3") && (fullHouseHand[0][0].suit == "Clubs")) || ((fullHouseHand[0][3].number == "3") && (fullHouseHand[0][3].suit == "Clubs")))
			{
				
				tableRule = "fullhouse";
				bestPlay = true;				
				for (var k = 0; k < 5; k++)
				{
					attemptedHand[attemptedHandCount] = new card(fullHouseHand[0][k].number,fullHouseHand[0][k].suit);
					attemptedHandCount++;
				}
						
			}
		}
		
		//try to play a straight with 3 clubs if we have it
		if((bestPlay == false) && (straightHand.length>0))
		{
			//alert("The lowest straight starts with " + straightHand[0][0].number + " of " + straightHand[0][0].suit);
			if((straightHand[0][0].number == "3") && (straightHand[0][0].suit == "Clubs"))
			{
				tableRule = "straight";
				bestPlay = true;				
				for (var k = 0; k < 5; k++)
				{
					attemptedHand[attemptedHandCount] = new card(straightHand[0][k].number,straightHand[0][k].suit);
					attemptedHandCount++;
				}
				
			}
		}
				
		//try to play a double with 3 clubs if we have it
		if((bestPlay == false) && (doubleHand.length>0))
		{
			if((doubleHand[0][0].number == "3") && (doubleHand[0][0].suit == "Clubs"))
			{
				tableRule = "double";
				bestPlay = true;				
				for (var k = 0; k < 2; k++)
				{
					attemptedHand[attemptedHandCount] = new card(doubleHand[0][k].number,doubleHand[0][k].suit);
					attemptedHandCount++;
				}
					
			}
		}
				
		//else fall back to a single 3
		if(bestPlay==false)
		{
			tableRule = "single";
			attemptedHand[attemptedHandCount] = new card("3","Clubs");
			attemptedHandCount++;
			
		}
	}

	function handleStandardEmptyTable()
	{
		
		bestPlay = false;
				
		/////////////////////////////
		//instant win special casing
		/////////////////////////////
		//experimental high card instant win plays
		
		if(highestDoubleOwnedBy(currentPlayer))
		{
			//player has the highest double in the game, and a single card to end on
			if((doubleHand.length>0) && (playerHand[currentPlayer].length==3))
			{
				bestPlay = true;
				experimentalDoubleJump++;
			}
			//player has the highest double in the game, and another double to follow up with
			else if((doubleHand.length==2) && (playerHand[currentPlayer].length==4))
			{
				if(playerHand[currentPlayer][0].value != playerHand[currentPlayer][3].value)
				{
					bestPlay = true;
					experimentalDoubleJump++;
				}
			}
		
			//some kind of experimental high double play seems to be viable
			if(bestPlay==true)
			{
				tableRule = "double";
				for (var k = 0; k < 2; k++)
				{
					attemptedHand[attemptedHandCount] = new card(doubleHand[doubleHand.length-1][k].number,doubleHand[doubleHand.length-1][k].suit);
					attemptedHandCount++;
				}
			}
			
		}			
		
		if((highestCardOwnedBy(currentPlayer)) && (bestPlay==false))
		{
			//if we only have 2 cards, win with the highest and play our remainder
			if ((playerHand[currentPlayer].length==2) && (doubleHand.length==0))
			{
				bestPlay = true;
				experimentalSingleJump++;
			}
			else if((doubleHand.length>0) && (playerHand[currentPlayer].length==3))
			{
				if(playerHand[currentPlayer][0].value==playerHand[currentPlayer][1].value)
				{
					bestPlay = true;
					experimentalDoubleJump++;
				}
			}
			
			//if we successfully managed to do some kind of experimental high roller play
			if(bestPlay==true)
			{
				attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][playerHand[currentPlayer].length-1].number,playerHand[currentPlayer][playerHand[currentPlayer].length-1].suit);
				attemptedHandCount++;
				HandlePlayerComment("highplay");
				tableRule = "single";
			}
			
		}
			
		
		
		
		///////////////////////////
		//regular play continues
		///////////////////////////
		//full house is the rarerst hand, so we should lead with that as there is less chance of other players being able to play on it
		if((bestPlay == false) && (fullHouseHand.length>0))
		{
			//special personality behaviour
			//if(playerPersonality[currentPlayer]=="conservative")
			if(1==1)
			{
				if((fullHouseHand[0][0].number!="2") && (fullHouseHand[0][4].number!="2"))
				{
					HandlePlayerComment("highplay");
					tableRule = "fullhouse";
					bestPlay = true;				
					for (var k = 0; k < 5; k++)
					{
						attemptedHand[attemptedHandCount] = new card(fullHouseHand[0][k].number,fullHouseHand[0][k].suit);
						attemptedHandCount++;
					}
				}
				else
				{
					//conservativePlay++;
					conservativeFullHouse++;
				}
			}
			//default / standard personality behaviour
			else
			{
				HandlePlayerComment("highplay");
				tableRule = "fullhouse";
				bestPlay = true;				
				for (var k = 0; k < 5; k++)
				{
					attemptedHand[attemptedHandCount] = new card(fullHouseHand[0][k].number,fullHouseHand[0][k].suit);
					attemptedHandCount++;
				}
			}
			
				
		}
		
		//okay, we don't have a full house, but we can still get rid of 5 cards, that's pretty good
		if((bestPlay == false) && (straightHand.length>0))
		{
			HandlePlayerComment("highplay");
			tableRule = "straight";
			bestPlay = true;				
			for (var k = 0; k < 5; k++)
			{
				attemptedHand[attemptedHandCount] = new card(straightHand[0][k].number,straightHand[0][k].suit);
				attemptedHandCount++;
			}
		}
						
		//well, maybe we can get rid of at least 2 cards
		if((bestPlay == false) && (doubleHand.length>0))
		{
			
			//check our lowest double, and if it is lower than Q, play that
			//this will prevent us leading with high doubles on the open table, because 
			//arguably that is a bad play when we could rather get rid of a low single
			//that is, unless of course, our lowest double is lower than our lowest single/card
			//alert(singleHand.length);
			
			//if ((singleHand.length==0) || ((doubleHand[0][0].value < 11) && (playerHand[currentPlayer][0].value <= doubleHand[0][0].value)))
			
			//11 J
			//12 Q
			//13 K
			//14 A
			//15 2
			//if our lowest double is higher than 10,10
			//AND our lowest single is smaller than 10
			//we should pass up the chance to play such high doubles 
			//and play that low single instead 
			var tempDontPlay = false;
			if(doubleHand[0][0].value > 10)
			{
				if(singleHand.length>0)
				{
					if(singleHand[0].value < 10)
					{
						tempDontPlay = true;
						doubleDodge++;
					}
				}
			}
			
			if(tempDontPlay==false)
			{
				tableRule = "double";
				bestPlay = true;				
				for (var k = 0; k < 2; k++)
				{
					attemptedHand[attemptedHandCount] = new card(doubleHand[0][k].number,doubleHand[0][k].suit);
					attemptedHandCount++;
				}
				
				if(attemptedHand[0].value <= 7)
					HandlePlayerComment("lowplay")
				else if(attemptedHand[0].value <= 11)
					HandlePlayerComment("mediumplay")
				else
					HandlePlayerComment("highplay");
			}
					
		}
				
		//well, fuck. no worries, let's just fall back to our lowest single
		if(bestPlay==false)
		{
			tableRule = "single";
			
			if((activePlayers==2) && (playerHand[lastPlayer].length == 1))
			{
				//scrap the above plan. It's time to D-D-D-DUEL! Play our highest card!
				attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][playerHand[currentPlayer].length-1].number,playerHand[currentPlayer][playerHand[currentPlayer].length-1].suit);
				attemptedHandCount++;
				duelMaster++;
				//testMode = false;
			}
			else
			{
				attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][0].number,playerHand[currentPlayer][0].suit);
				attemptedHandCount++;
			}
			
			bestPlay = true;
			if(attemptedHand[0].value <= 7)
				HandlePlayerComment("lowplay")
			else if(attemptedHand[0].value <= 11)
				HandlePlayerComment("mediumplay")
			else
				HandlePlayerComment("highplay");
		}
	}
	
	function handleSnowmanAITurn()
	{
	
		bestPlay = false;
		
		
		
		if(tableRule=="single")
		{
			//experimental high play
			//[disabled]if we have the highest card and a 5 card trick, 
			//or if we only have a double left
			//jump straight to playing our highest card
			if(highestCardOwnedBy(currentPlayer))
			{
				
				//the newly "highest card" still needs to be higher than what is currently on the table
				if(((highCard.value == tableHand[0].value) && (highCard.suitValue > tableHand[0].suitValue)) || (highCard.value > tableHand[0].value))
				{				
					//alert("high card can beat table");
					//if we only have 2 cards, win with the highest and play our remainder
					if (playerHand[currentPlayer].length==2)
					{
						bestPlay = true;
						experimentalSingleJump++;
					}
					//else if((straightHand.length>0) || (fullHouseHand.length>0))
					//{
					//	bestPlay = true;
					//	experimentalFiveJump++;
					//}
					else if((doubleHand.length>0) && (playerHand[currentPlayer].length==3))
					{
						if(playerHand[currentPlayer][0].value==playerHand[currentPlayer][1].value)
						{
							bestPlay = true;
							experimentalDoubleJump++;
						}
					}
				
				}
				//if(fullHouseHand.length>0)
				//if(doubleHand.length>0)
			}
			
			//DUEL MODE if there are only 2 players left
			
			if(bestPlay==false)
			{
				if((activePlayers==2) && (playerHand[lastPlayer].length ==1))
				{
					highCard = new card(playerHand[currentPlayer][playerHand[currentPlayer].length-1].number,playerHand[currentPlayer][playerHand[currentPlayer].length-1].suit);
					if(((highCard.value == tableHand[0].value) && (highCard.suitValue > tableHand[0].suitValue)) || (highCard.value > tableHand[0].value))
					{
						bestPlay = true;
						duelMaster++;
					}
				}
			}
			
			
			
			//if we successfully managed to do some kind of experimental high roller play
			if(bestPlay==true)
			{
				attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][playerHand[currentPlayer].length-1].number,playerHand[currentPlayer][playerHand[currentPlayer].length-1].suit);
				attemptedHandCount++;
				HandlePlayerComment("highplay");
			}
			
			
			
			
			
			
			//alert(tableHand[0].value + " was played by " + playerNames[tableOwnership] + " and the last player was " +playerNames[lastPlayer]);
			//this clause makes the AI "agreeable" by not beating a K,A,2 played by the immediately preceeding player
			//the goal being to save my high cards for future use and letting the previous player "win" so I can play on their low followup
			//while this HELPS that one player (and me), it hurts the other 2 players, so it is overall more effective a strategy
			//else if((tableOwnership==lastPlayer) && (tableHand[0].value>=13) && (playerHand[currentPlayer].length>2) && (activePlayers==4))
			//{
			//	convenientPass++;
			//}
			
			//regular play
			else
			{
				for (var i = 0; i < singleHand.length; i++)
				{
					if(bestPlay==false)
					{
						
						//hangback code, wait till we have the highest card(s) to play 2s and As
						/*if ((singleHand[i].value >= 14) && (highestCardOwnedBy(currentPlayer)==false))
						{
							experimentalHangback++;
						}
						else*/ if((singleHand[i].value == tableHand[0].value) && (singleHand[i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(singleHand[i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
				
				//attempt to improve doubleSaver AI
				//we might not have any "single" cards left as our hand is now just
				//unbroken doubles. In this case, we still need to try win and not 
				//be stuck passing forever, so wait till we have the highest card, then 
				//play it. That should then give us an opportunity to start playing our 
				//doubles again, or simply win.
				if(bestPlay==false)
				//if(singleHand.length == 0)
				{
					
					//if(playerHand[currentPlayer].length == 2)
					if(highestCardOwnedBy(currentPlayer))
					{
						//alert("hey");
						if(((highCard.value == tableHand[0].value) && (highCard.suitValue > tableHand[0].suitValue)) || (highCard.value > tableHand[0].value))
						{
							doubleBreak++;
							attemptedHand[attemptedHandCount] = new card(highCard.number,highCard.suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
				
				
				
			}
		}
		
		else if(tableRule=="double")
		{
			if(doubleHand.length>0)
			{
				for (var i = 0; i < doubleHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("mediumplay");
						}
						else if(doubleHand[i][0].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
							
			}
		}
		else if(tableRule=="straight")
		{
			if(straightHand.length>0)
			{
				for (var i = 0; i < straightHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						else if(straightHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						
					}
				}
								
			}
		}
		else if(tableRule=="fullhouse")
		{
			if(fullHouseHand.length>0)
			{
				for (var i = 0; i < fullHouseHandCount; i++)
				{
					if(bestPlay==false)
					{
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							
							if((fullHouseHand[i][0].number!="2") && (fullHouseHand[i][4].number!="2"))
							{
								HandlePlayerComment("highplay");
								bestPlay = true;
								for (var k = 0; k < 5; k++)
								{
									attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
									attemptedHandCount++;
								}
							}
							else
							{
								conservativeFullHouse++;
							}
						}
						/*
						//regular full house code
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						*/
					}
				}
			}
		}
		else if(tableRule=="empty")
		{
			handleStandardEmptyTable();
		}
				
		if(bestPlay == true)
		{
			turnsPassed = 0;
			if((attemptedHandCount==playerHand[currentPlayer].length) && (gameWon==false))
				HandlePlayerComment("winningPlay");
			if(attemptedHandCount==playerHand[currentPlayer].length)
			{
				playerPosition[playerPosition.length] = playerNames[currentPlayer];
				//if((activePlayers==1) && (playerPosition.length ==3))
					//playerPosition[playerPosition.length] = playerNames[lastPlayer];
					//alert(activePlayers +";"+playerPosition.length);
			}
		}
		
		else if(bestPlay == false)
		{
			//I gotta pass
			playerPasses[currentPlayer]++;
			HandlePlayerComment("pass");
			waitForInput = true;
			turnsPassed++;
		}
		
	}
	
	function handleDoubleSaverAITurn()
	{
	
		bestPlay = false;
		
		
		
		if(tableRule=="single")
		{
			{
				for (var i = 0; i < singleHand.length; i++)
				{
					if(bestPlay==false)
					{
						if((singleHand[i].value == tableHand[0].value) && (singleHand[i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(singleHand[i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
				
				//attempt to improve doubleSaver AI
				//we might not have any "single" cards left as our hand is now just
				//unbroken doubles. In this case, we still need to try win and not 
				//be stuck passing forever, so wait till we have the highest card, then 
				//play it. That should then give us an opportunity to start playing our 
				//doubles again, or simply win.
				if(bestPlay==false)
				//if(singleHand.length == 0)
				{
					//if(playerHand[currentPlayer].length == 2)
					if(highestCardOwnedBy(currentPlayer))
					{
						//alert("hey");
						if(((highCard.value == tableHand[0].value) && (highCard.suitValue > tableHand[0].suitValue)) || (highCard.value > tableHand[0].value))
						{
							doubleBreak++;
							attemptedHand[attemptedHandCount] = new card(highCard.number,highCard.suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
				
				
				
			}
		}
		
		else if(tableRule=="double")
		{
			if(doubleHand.length>0)
			{
				for (var i = 0; i < doubleHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("mediumplay");
						}
						else if(doubleHand[i][0].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
							
			}
		}
		else if(tableRule=="straight")
		{
			if(straightHand.length>0)
			{
				for (var i = 0; i < straightHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						else if(straightHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						
					}
				}
								
			}
		}
		else if(tableRule=="fullhouse")
		{
			if(fullHouseHand.length>0)
			{
				for (var i = 0; i < fullHouseHandCount; i++)
				{
					if(bestPlay==false)
					{
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
								attemptedHandCount++;
							}
						}
					}
				}
			}
		}
		else if(tableRule=="empty")
		{
			handleStandardEmptyTable();
		}
				
		if(bestPlay == true)
		{
			turnsPassed = 0;
		}
		
		else if(bestPlay == false)
		{
			//I gotta pass
			playerPasses[currentPlayer]++;
			HandlePlayerComment("pass");
			waitForInput = true;
			turnsPassed++;
		}
		
	}
	
	
	
	
	
	
	
	
	
	function handleConservativeAITurn()
	{
	
		bestPlay = false;
		
		
		
		if(tableRule=="single")
		{
			{
				for (var i = 0; i < singleHand.length; i++)
				{
					if(bestPlay==false)
					{
						if((singleHand[i].value == tableHand[0].value) && (singleHand[i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(singleHand[i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
		}
		
		else if(tableRule=="double")
		{
			if(doubleHand.length>0)
			{
				for (var i = 0; i < doubleHandCount; i++)
				{
					if(bestPlay==false)
					{
						if(doubleHand[i][1].number=="2")
						{
							conservativePlay++;
						}
						else if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("mediumplay");
						}
						else if(doubleHand[i][0].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
							
			}
		}
		else if(tableRule=="straight")
		{
			if(straightHand.length>0)
			{
				for (var i = 0; i < straightHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						else if(straightHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						
					}
				}
								
			}
		}
		else if(tableRule=="fullhouse")
		{
			if(fullHouseHand.length>0)
			{
				for (var i = 0; i < fullHouseHandCount; i++)
				{
					if(bestPlay==false)
					{
						
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							
							if((fullHouseHand[i][0].number!="2") && (fullHouseHand[i][4].number!="2"))
							{
								HandlePlayerComment("highplay");
								bestPlay = true;
								for (var k = 0; k < 5; k++)
								{
									attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
									attemptedHandCount++;
								}
							}
							else
							{
								//conservativePlay++;
								conservativeFullHouse++;
							}
						}
					}
				}
			}
		}
		else if(tableRule=="empty")
		{
			handleStandardEmptyTable();
		}
				
		if(bestPlay == true)
		{
			turnsPassed = 0;
		}
		
		else if(bestPlay == false)
		{
			//I gotta pass
			playerPasses[currentPlayer]++;
			HandlePlayerComment("pass");
			waitForInput = true;
			turnsPassed++;
		}
		
	}
	
	
	
	
	
	
	function handleHangbackAITurn()
	{
	
		bestPlay = false;
		
		if(tableRule=="single")
		{
			//active duel mode
			/*
			if(activePlayers==2)
			{
				for (var i = playerHand[currentPlayer].length-1; i >= 0; i--)
				{
					if(bestPlay==false)
					{
						if((playerHand[currentPlayer][i].value == tableHand[0].value) && (playerHand[currentPlayer][i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(playerHand[currentPlayer][i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
			
			*/
			
			//experimental high play
			//if we have the highest card and a 5 card trick, 
			//or if we only have a double left
			//jump straight to playing our highest card
			if(highestCardOwnedBy(currentPlayer))
			{
				//the newly "highest card" still needs to be higher than what is currently on the table
				if(((highCard.value == tableHand[0].value) && (highCard.suitValue > tableHand[0].suitValue)) || (highCard.value > tableHand[0].value))
				{				
					//if we only have 2 cards, win with the highest and play our remainder
					if (playerHand[currentPlayer].length==2)
					{
						bestPlay = true;
						//testMode = false;
						experimentalSingleJump++;
					}
					else if((straightHand.length>0) || (fullHouseHand.length>0))
					{
						bestPlay = true;
						experimentalFiveJump++;
						//testMode = false;
					}
					else if((doubleHand.length>0) && (playerHand[currentPlayer].length==3))
					{
						if(playerHand[currentPlayer][0].value==playerHand[currentPlayer][1].value)
						{
							bestPlay = true;
							experimentalDoubleJump++;
							//testMode = false;
						}
					}
				
				}
				//if(fullHouseHand.length>0)
				//if(doubleHand.length>0)
			}
			
			//if we successfully managed to do some kind of experimental high roller play
			if(bestPlay==true)
			{
				attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][playerHand[currentPlayer].length-1].number,playerHand[currentPlayer][playerHand[currentPlayer].length-1].suit);
				attemptedHandCount++;
				HandlePlayerComment("highplay");
			}
			
			//alert(tableHand[0].value + " was played by " + playerNames[tableOwnership] + " and the last player was " +playerNames[lastPlayer]);
			//this clause makes the AI "agreeable" by not beating a K,A,2 played by the immediately preceeding player
			//the goal being to save my high cards for future use and letting the previous player "win" so I can play on their low followup
			//while this HELPS that one player (and me), it hurts the other 2 players, so it is overall more effective a strategy
			else if((tableOwnership==lastPlayer) && (tableHand[0].value>=13) && (playerHand[currentPlayer].length>2) && (activePlayers==4))
			{
				convenientPass++;
			}
			//play normally (low)
			else
			{
				for (var i = 0; i < singleHand.length; i++)
				{
					if(bestPlay==false)
					{
						
						//hangback code, wait till we have the highest card(s) to play 2s and As
						if ((singleHand[i].value >= 14) && (highestCardOwnedBy(currentPlayer)==false))
						{
							experimentalHangback++;
						}
						
						//improved doubleSaver code now inserted into boss 						
						else if((singleHand[i].value == tableHand[0].value) && (singleHand[i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(singleHand[i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
		}
		
		//occasionally for some reason it seems like I have to click the OK button twice after some players play doubles 
		else if(tableRule=="double")
		{
			if(doubleHand.length>0)
			{
				for (var i = 0; i < doubleHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("mediumplay");
						}
						else if(doubleHand[i][0].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
							
			}
		}
		else if(tableRule=="straight")
		{
			if(straightHand.length>0)
			{
				for (var i = 0; i < straightHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						else if(straightHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						
					}
				}
								
			}
		}
		else if(tableRule=="fullhouse")
		{
			if(fullHouseHand.length>0)
			{
				for (var i = 0; i < fullHouseHandCount; i++)
				{
					if(bestPlay==false)
					{
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
								attemptedHandCount++;
							}
						}
					}
				}
			}
		}
		else if(tableRule=="empty")
		{
			handleStandardEmptyTable();
		}
				
		if(bestPlay == true)
		{
			turnsPassed = 0;
		}
		
		else if(bestPlay == false)
		{
			//I gotta pass
			playerPasses[currentPlayer]++;
			HandlePlayerComment("pass");
			waitForInput = true;
			turnsPassed++;
		}
		
	}
	
	
	
	
	
	
	function handleAgreeableAITurn()
	{
	
		bestPlay = false;
		
		if(tableRule=="single")
		{
			//active duel mode
			/*
			if(activePlayers==2)
			{
				for (var i = playerHand[currentPlayer].length-1; i >= 0; i--)
				{
					if(bestPlay==false)
					{
						if((playerHand[currentPlayer][i].value == tableHand[0].value) && (playerHand[currentPlayer][i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(playerHand[currentPlayer][i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
			
			*/
			
			
			
			//alert(tableHand[0].value + " was played by " + playerNames[tableOwnership] + " and the last player was " +playerNames[lastPlayer]);
			//this clause makes the AI "agreeable" by not beating a K,A,2 played by the immediately preceeding player
			//the goal being to save my high cards for future use and letting the previous player "win" so I can play on their low followup
			//while this HELPS that one player (and me), it hurts the other 2 players, so it is overall more effective a strategy
			if((tableOwnership==lastPlayer) && (tableHand[0].value>=13) && (playerHand[currentPlayer].length>2) && (activePlayers==4))
			{
				convenientPass++;
			}
			//play normally (low)
			else
			{
				for (var i = 0; i < singleHand.length; i++)
				{
					if(bestPlay==false)
					{
						//improved doubleSaver code now inserted into boss 						
						if((singleHand[i].value == tableHand[0].value) && (singleHand[i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(singleHand[i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(singleHand[i].number,singleHand[i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
		}
		
		//occasionally for some reason it seems like I have to click the OK button twice after some players play doubles 
		else if(tableRule=="double")
		{
			if(doubleHand.length>0)
			{
				for (var i = 0; i < doubleHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("mediumplay");
						}
						else if(doubleHand[i][0].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
							attemptedHandCount++;
							attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
							attemptedHandCount++;
							bestPlay = true;
							HandlePlayerComment("highplay");
						}
					}
				}
							
			}
		}
		else if(tableRule=="straight")
		{
			if(straightHand.length>0)
			{
				for (var i = 0; i < straightHandCount; i++)
				{
					if(bestPlay==false)
					{
						if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						else if(straightHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
								attemptedHandCount++;
							}
						}
						
					}
				}
								
			}
		}
		else if(tableRule=="fullhouse")
		{
			if(fullHouseHand.length>0)
			{
				for (var i = 0; i < fullHouseHandCount; i++)
				{
					if(bestPlay==false)
					{
						if(fullHouseHand[i][0].value > tableHand[0].value)
						{
							HandlePlayerComment("highplay");
							bestPlay = true;
							for (var k = 0; k < 5; k++)
							{
								attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
								attemptedHandCount++;
							}
						}
					}
				}
			}
		}
		else if(tableRule=="empty")
		{
			handleStandardEmptyTable();
		}
				
		if(bestPlay == true)
		{
			turnsPassed = 0;
		}
		
		else if(bestPlay == false)
		{
			//I gotta pass
			playerPasses[currentPlayer]++;
			HandlePlayerComment("pass");
			waitForInput = true;
			turnsPassed++;
		}
		
	}
	
	
	
	
	
	
	
	
	//shit burnout AI
	function handleAIEmptyTable()
	{
		bestPlay = false;
		
		//find out what the "lowest" of all our hand options are
		var bestValue = 50;
		var straightValue = 50;
		var fullHouseValue = 50;
		var doubleValue = 50;
		var singleValue = 50;
		
		if(straightHand.length>0)
			straightValue = straightHand[0][0].value;
		if(fullHouseHand.length>0)
			fullHouseValue = fullHouseHand[0][0].value;
		if(doubleHand.length>0)
			doubleValue = doubleHand[0][0].value;
		
		//but what to do with this info... currently... nothing, lol!
		
		//full house is the rarerst hand, so we should lead with that as there is less chance of other players being able to play on it
		if((bestPlay == false) && (fullHouseHand.length>0))
		{
			HandlePlayerComment("highplay");
			tableRule = "fullhouse";
			bestPlay = true;				
			for (var k = 0; k < 5; k++)
			{
				attemptedHand[attemptedHandCount] = new card(fullHouseHand[0][k].number,fullHouseHand[0][k].suit);
				attemptedHandCount++;
			}
				
		}
		
		//okay, we don't have a full house, but we can still get rid of 5 cards, that's pretty good
		if((bestPlay == false) && (straightHand.length>0))
		{
			HandlePlayerComment("highplay");
			tableRule = "straight";
			bestPlay = true;				
			for (var k = 0; k < 5; k++)
			{
				attemptedHand[attemptedHandCount] = new card(straightHand[0][k].number,straightHand[0][k].suit);
				attemptedHandCount++;
			}
		}
						
		//well, maybe we can get rid of at least 2 cards
		if((bestPlay == false) && (doubleHand.length>0))
		{
			tableRule = "double";
			bestPlay = true;				
			for (var k = 0; k < 2; k++)
			{
				attemptedHand[attemptedHandCount] = new card(doubleHand[0][k].number,doubleHand[0][k].suit);
				attemptedHandCount++;
			}
			
			if(attemptedHand[0].value <= 7)
				HandlePlayerComment("lowplay")
			else if(attemptedHand[0].value <= 11)
				HandlePlayerComment("mediumplay")
			else
				HandlePlayerComment("highplay");
			
		}
				
		//well, fuck. no worries, let's just fall back to our lowest single
		if(bestPlay==false)
		{
			tableRule = "single";
			
			attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][0].number,playerHand[currentPlayer][0].suit);
			attemptedHandCount++;
			bestPlay = true;
			if(attemptedHand[0].value <= 7)
				HandlePlayerComment("lowplay")
			else if(attemptedHand[0].value <= 11)
				HandlePlayerComment("mediumplay")
			else
				HandlePlayerComment("highplay");
		}
	}
	
	//shit burnour AI main turn
	function handleAITurn()
	{
		//if(highestCardOwnedBy(currentPlayer))
		//	alert("this guy has the highest card in the game");
		
		if(playerPersonality[currentPlayer]=="agreeable")
			handleAgreeableAITurn()
		else if(playerPersonality[currentPlayer]=="doubleSaver")
			handleDoubleSaverAITurn()
		else if(playerPersonality[currentPlayer]=="conservative")
			handleConservativeAITurn()
		else if(playerPersonality[currentPlayer]=="hangback")
			handleHangbackAITurn()
		else if(playerPersonality[currentPlayer]=="snowman")
			handleSnowmanAITurn()
		else
		{
		
			//we still need to distinguish between playing on an empty table
			
			//and playing to beat what's ON the table
			
			//alert("It is the AI turn, and we need to play a " + tableRule);
			
			//we don't NEED to clear attemptedHand DO WE?? I think this only triggers if there is no attempted hand or whatever
			
			//currently the single implmentation will wreck straights, doubles, etc. it just looks for any single card
			//later we need to form a deck of unused singles, and try draw from those
			
			//attemptedHand = [];
			//attemptedHandCount = [];
			
			//var bestPlay = false;
			bestPlay = false;
			
			if(tableRule=="single")
			{
				for (var i = 0; i < playerHand[currentPlayer].length; i++)
				{
					if(bestPlay==false)
					{
						if((playerHand[currentPlayer][i].value == tableHand[0].value) && (playerHand[currentPlayer][i].suitValue > tableHand[0].suitValue))
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
							
						}
						else if(playerHand[currentPlayer][i].value > tableHand[0].value)
						{
							attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][i].number,playerHand[currentPlayer][i].suit);
							attemptedHandCount++;
							bestPlay = true;
							
							if(attemptedHand[0].value <= 7)
								HandlePlayerComment("lowplay")
							else if(attemptedHand[0].value <= 11)
								HandlePlayerComment("mediumplay")
							else
								HandlePlayerComment("highplay");
						}
					}
				}
			}
			
			//occasionally for some reason it seems like I have to click the OK button twice after some players play doubles 
			else if(tableRule=="double")
			{
				if(doubleHand.length>0)
				{
					for (var i = 0; i < doubleHandCount; i++)
					{
						if(bestPlay==false)
						{
							if((doubleHand[i][1].value == tableHand[1].value) && (doubleHand[i][1].suitValue > tableHand[1].suitValue))
							{
								attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
								attemptedHandCount++;
								attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
								attemptedHandCount++;
								bestPlay = true;
								HandlePlayerComment("mediumplay");
							}
							else if(doubleHand[i][0].value > tableHand[0].value)
							{
								attemptedHand[attemptedHandCount] = new card(doubleHand[i][0].number,doubleHand[i][0].suit);
								attemptedHandCount++;
								attemptedHand[attemptedHandCount] = new card(doubleHand[i][1].number,doubleHand[i][1].suit);
								attemptedHandCount++;
								bestPlay = true;
								HandlePlayerComment("highplay");
							}
						}
					}
								
				}
			}
			else if(tableRule=="straight")
			{
				if(straightHand.length>0)
				{
					for (var i = 0; i < straightHandCount; i++)
					{
						if(bestPlay==false)
						{
							if((straightHand[i][0].value == tableHand[0].value) && (straightHand[i][0].suitValue > tableHand[0].suitValue))
							{
								HandlePlayerComment("highplay");
								bestPlay = true;
								for (var k = 0; k < 5; k++)
								{
									attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
									attemptedHandCount++;
								}
							}
							else if(straightHand[i][0].value > tableHand[0].value)
							{
								HandlePlayerComment("highplay");
								bestPlay = true;
								for (var k = 0; k < 5; k++)
								{
									attemptedHand[attemptedHandCount] = new card(straightHand[i][k].number,straightHand[i][k].suit);
									attemptedHandCount++;
								}
							}
							
						}
					}
									
				}
			}
			else if(tableRule=="fullhouse")
			{
				if(fullHouseHand.length>0)
				{
					for (var i = 0; i < fullHouseHandCount; i++)
					{
						if(bestPlay==false)
						{
							if(fullHouseHand[i][0].value > tableHand[0].value)
							{
								HandlePlayerComment("highplay");
								bestPlay = true;
								for (var k = 0; k < 5; k++)
								{
									attemptedHand[attemptedHandCount] = new card(fullHouseHand[i][k].number,fullHouseHand[i][k].suit);
									attemptedHandCount++;
								}
							}
						}
					}
				}
			}
			else if(tableRule=="empty")
			{
				
				handleAIEmptyTable();
				
				// I must have won the last round or am playing by default, let's just throw out our lowest card
				//	todo: calculate optimal hand plays later
				/*attemptedHand[attemptedHandCount] = new card(playerHand[currentPlayer][0].number,playerHand[currentPlayer][0].suit);
				attemptedHandCount++;
				tableRule = "single";
				bestPlay = true;
				if(attemptedHand[0].value <= 7)
					HandlePlayerComment("lowplay")
				else if(attemptedHand[0].value <= 11)
					HandlePlayerComment("mediumplay")
				else
					HandlePlayerComment("highplay");
				*/
			}
			
			
			
			
			if(bestPlay == true)
			{
				//HandlePlayerComment("lowplay");
				turnsPassed = 0;
			}
			
			else if(bestPlay == false)
			{
				//I gotta pass
				playerPasses[currentPlayer]++;
				HandlePlayerComment("pass");
				//incrementTurn();
				waitForInput = true;
				turnsPassed++;
			}
		
		
		}
	}