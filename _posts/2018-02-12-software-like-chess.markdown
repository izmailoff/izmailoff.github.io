---
layout: post
title:  "Software Is Like Chess"
date:   2018-02-12 01:00:00 +0800
categories: [Musings]
---

## Start
My memory is a bit blurry on this, but I remember that one of the convincing arguments for me to get into programming was from a friend. When I was trying to explain to him the beauty of chess and how fun it is to play, he said that you should try programming: you solve interesting problems with a lot of depth and complexity and you also get paid well for it. We studied business at that time, so money-time association was always ready to trigger as well as the concern of future employment occupied our brains when we didn't think of girls. So I started coding and never looked back.

Time has passed and I still do software development and play chess. They have lots of similarities and some differences. Let's take a look...

## Rules
When you play chess you are given certain set of rules you can't bend, like legal moves you can make and how the game ends. You also have a clear problem statement at hand - win by checkmating opponent's king. In software you also have lots of rules. Speaking of hard rules, those are the ones imposed by mathematics and physics like algorithmic complexity or propagation delay of a medium. You can't bend those, at least as far as we know. You win by completing development of a piece of software that works for all intents and purposes. I don't know how you draw. Maybe by delivering a project that doesn't get much usage. Anyway, when we develop a product or play chess we don't usually start by thinking of how to make a draw, so let's leave it at that.

## Strategy and Planning
> Even a poor plan is better than no plan at all.
[Mikhail Chigorin]

> It is not a move, even the best move, that you must seek, but a realisable plan.
[Znosko-Borovsky]

In chess you can't just go ahead and deliver a checkmate in one move. Neither you can produce a project with one line of code. It takes strategy and planning to come up with a sequence of steps that will bring you to your goal. And plans don't always go as intended. There are always opposing forces. In chess an opponent has his own plan and is determined to stop your plan or bring his to execution faster than you do. In software development you see lots of impediments like unclear/changing requirements, blocked work due to missing dependency, limitations of environment, organization, and competition.

> The tactician knows what to do when there is something to do; whereas the strategian knows what to do when there is nothing to do.
[Gerald Abrahams]

Once you make a plan for your game or project it's almost never direct. Instead, it usually has subgoals that should bring you closer to your target. Those logically make sense but taken out of context might look completely unrelated. For example, you need to refactor your code, write a helper function, setup unit test framework or battle with some library because it doesn't work as you expect. Similarly you might make a plan to castle, occupy center or key squares, exchange pieces, protect your hanging pieces or grab more space. These subtasks can be quite complex and take many moves to accomplish and many times you might lose the big picture when tackling these problems. Software development has a term ['Yack Shaving'](https://en.wiktionary.org/wiki/yak_shaving) to refer to an activity which seems to be very remote and unrelated to what you are trying to accomplish. I like this proverb:

> When you're up to your neck in alligators, it's hard to remember that your initial objective was to drain the swamp.

## Tactics
Let's say you came up with a plan on how to win. That doesn't yet give you a clear path. Strategy is a high-level overview of things to be done, a big picture - an architecture diagram or user stories that make up a core product. It's where you plan to go without knowing exactly how. As they say: "devil is in the details". Tactics in chess is purely logical reasoning and calculation to achieve one of the strategic goals. Same in software - it's the algorithms, logic in functions and modules, exact instructions, expressions and decisions that make a certain part of your program do what you intend it to do. While strategy is more intuitive and relies a lot on a rule of thumb, tactics are very precise and logical.

Both tactics and strategy go hand in hand. Imagine if you are executing great tactics in writing beautiful functions without any notion of architecture in mind. Those functions might not be useful at all or not be optimized to serve your need. Similarly in chess if you are executing a mind blowing combination to win a pawn while your king is being mated by force. You need strategy to guide your tactics, but you also need to consult tactics when building your strategy. You might have great strategy that falls short because implementation/execution details are at odds with it.

> The scheme of a game is played on positional lines; the decision of it, as a rule, is effected by combinations.
[Reti]

## Time
Regular software just like a regular game of chess requires one to make decisions in a limited amount of time. Every tactical step on the way to the target is usually timeboxed. Time pressure affects how we make decisions under uncertainty. Most of the time the decision we make is not the final one to make. When you do make a final decision it's usually either when you decide to cut out a version of your product or you see a forced win in a game. We can't possibly forsee all implications of our decisions when making a move or designing a software module. A horizon effect known in chess engines is when machine searches a tree of possibilities to a certain depth, say 10 moves, and picks the best way to proceed at that level. It might fail to notice that a move or two afterwards, what seemed to be a great position based on evaluation algorithm, leads to a lost game. Techniques like iterative deepening allow search algorithm to proceed further if situation calls for it (your king is in danger, although you are winning material). When designing architecture or writing code it's not always possible to forsee all problems ahead of time as well.

## Mistakes
It's quite common to talk about chess game tree complexity of around $$10^{120}$$ ([Wikipedia](https://en.wikipedia.org/wiki/Chess)). It's not feasible to find the absolutely best move in a rich position when complexity of search is higher than number of atoms in the observable universe [(ref)](https://en.wikipedia.org/wiki/Shannon_number). The number of states of a typical program is even higher. Although partial correctness of an algorithm can be shown, total correctness doesn't have a general solution yet due to the halting problem. See more on this here: [Correctness](https://en.wikipedia.org/wiki/Correctness_(computer_science)) and here: [Halting Problem](https://en.wikipedia.org/wiki/Halting_problem). Thus, software is designed with practical considerations driven by most likely states a program might go through and is usually prone to bugs.

## Takebacks
There are no takebacks allowed in chess unless you agree to make an exception in a friendly game. Every chess move has to be considered very carefully and can become a fatal mistake. If you play with your chess computer, you, of course, could have as many takebacks as you like until you get sick of trying all possible lines and give up that is. Software is not exactly like that. When TDD is applied to software development we usually write a function that we know doesn't work and we prove it using a unit test. We fix the function to handle some scenarios and iterate again by trying to prove it wrong again. This resembles chess analysis when a player is either exploring a new idea to try in the opening or analyzing a game that already happened to search for improvements and mistakes. It's usually agreed upon, although not proven, that if both white and black play without mistakes a game should end in a draw. That's basically saying if they chose perfect moves they will never make any mistakes and the property of the game is such that you can't win by force (not proven) unlike "Connect Four" where first player can [force a win](https://en.wikipedia.org/wiki/Connect_Four). When we write software we almost never write code in one go. We iterate, improve, fix errors, try it out until it works as desired. Chess analysis is very similar, but not a chess game itself. I would argue that although we do iterate when writing software we still think hard and try to get things as correct as we can from the first shot, otherwise the price to pay is time spent debugging and testing later in the process. Once we release a product there are almost no takebacks and errors can lead to serious issues, although there are many cases where things are more forgiving.

## Patterns
It's often said that chess masters are great at recognizing patterns on the board and finding solutions based on previously seen games. In fact, tactics training in chess involves presentation of vairous tactical motifs to teach a player to recognize those when they arise. Some examples of tactics can be found [here](https://en.wikipedia.org/wiki/Chess_tactic). As you become very familiar with certain tactical patterns, I believe, they move from System 1 to System 2 [(see Thinking Fast and Slow)](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) and become automatic to recognize. The same is true of many other skills we learn including programming. We learn to use loops to iterate over collections of things and structure code in functions, modules or classes. We learn algorithmic patterns and basic building logical blocks of any software program. We learn to think in patterns as it helps a lot to focus on actual bigger problem and subconsciously handle minutia details.

There comes a time once in a while to break out of patterns and think creatively. We have lots of examples at hand in both worlds where "breaking rules" sometimes allows us to create something of great value. Sometimes that's how new patterns are born!

## Libraries
Chess has a vast collection of opening and endgame databases. Opening book is a collection of known debuts with their variants and subvariants, some analyzed to around move thirty. Endgame tablebases are precalculated for up to seven pieces and precisely answer the question whether a certain position can be won by force. Thus, if you look at chess you see that precise theory is expanding from both sides - start and end of the game. Computationally speaking, it should not be possible for these two ends to meet due to huge number of possible positions in between those explored ends unless some forced variants or tricks can be found. The middle game is for anyone to explore, hence this famous remark:

> Play the opening like a book, the middle game like a magician, and the endgame like a machine.
[Rudolf Spielmann]

What can be said about programming in this sense? It also has predefined patterns we can reuse in forms of libraries, protocols, algorithms, frameworks, databases, tools, operating systems and so on. We can rely on them to work like a clockwork and it's up to us to define the meat of the application we are building, just like the middlegame. This is where creativity takes place. If I were to rephrase Spielmann's quote above I would say:

> Build your application on a solid foundation with tools known to work. Reuse excellent algorithms and libraries. Follow best practices, and let your imagination and experience help you write beatiful code for things that aren't solved yet.
[Yours truly]

## Theory
There are thousands of books written on chess theory. Some are iconic masterpieces covering various openings, strategic play, middle game, end game and tactics. Theory of chess openings was developed over many centuries of hard human work. Until recent professional players have been still analyzing openings looking for new ways to outwit their opponents and surprise them with a new move. Some openings have been analyzed to the very end leading to a draw. Recently Google's AlphaZero machine learning based chess engine has become the [strongest playing computer](https://www.chess.com/news/view/google-s-alphazero-destroys-stockfish-in-100-game-match) up to date. What's interesting about it in context of theory is that it wasn't given any heuristics or opening book, yet it learned to play openings just like from a book. It might redefine opening theory in the future.

## Art, Sport, Science or Craft?
Software and chess incorporate multiple attributes of human endeavours. They have a scientific approach of investigating the nature of the problem in a systematic ways. However, the way we apply our knowledge and skills in these domains are more of a practical nature. Thus chess is a game, sport, and a fight. Programming becomes engineering endeavour and a craft since it takes lots of practice and knowledge to come up with great solutions. I think both activities when done at the highest level can achieve artistic heights.

> Chess is everything: art, science, and sport.
[Anatoly Karpov]

For more on relation of art to programming please check [this](http://delivery.acm.org/10.1145/370000/361612/a1974-knuth.pdf) great article from Donald Knuth. If you prefer text to PDF you can also read it [here](http://www.paulgraham.com/knuth.html) (credit to Paul Graham).

## Hard or Easy?
Is playing chess or programming is hard? You would see an array of varying answers to this. I think it's as hard as we are willing to engage into it. You can play a much weaker opponent almost on autopilot mode without getting much tired or stressed. The same goes for programming - if you are writing a primitive program and you have a clear idea of how to do it it's not very taxing. Once you start doing deep analysis in your head calculating long chess variation or trying to understand how a complex algorithm works it starts to get really hard no matter how much you are used to it. You can always push your cognitive capacity to the limit. I think it has to do with the abovementioned System 1 and System 2 being engaged to varying degrees subject to task's difficulty at hand. We are known to be lazy and will always conserve energy whenever we can. Like with any other activity, we decide how much effort we have to put into it and that in turn decides whether it's easy or hard.

## Fun
So is it fun to play chess or code? When we face a hard problem and find a solution to it there is that rewarding feeling of happiness and ease in the end. It gets frustrating sometimes when things don't go our way or get out of our control. Nonetheless, programming and chess are exciting if you do them right and stay inspired.

## Tradeoffs
Chess just like programming is all about tradeoffs. When we grab space in chess we might leave too much access for enemy pieces. If we lush out with a winning attack we must believe that sacrificing pieces and giving away control in other areas of the board are less important. We might exchange a bishop for a knight to get some strategical or tactical advantage. When programming we often choose between simplicity and performance optimization. We can tradeoff space for speed. We can choose simple and dynamically typed language to implement things fast but sacrifice performance or correctness. Many times it's a hard choice between quality of code and deadlines. Precision/recall tradeoff is another famous example from machine learning field.

Understanding and applying tradeoffs in chess, programming and life is a sign of true mastery.

## Decision Making
When an expert player takes a look at a chess position a few moves almost immediately pop up in his head. He usually ends up chosing one of those candidates. Sometimes the best move is not so obvious and we have to find it analytically, but we are pretty good at recognizing the patterns without putting effort into it. We have similar experience with engineering problems. We can come up with a few design or architectural patterns quickly. Sometimes we can clearly see those will work, othertimes it take meticulous effort to prove oneself right or wrong. Intuition and analytical thinking go hand in hand in programming, chess and hopefully in our lives too.

## Model of Life
In his famous book "How Life Imitates Chess: Making the Right Moves, from the Board to the Boardroom" Garry Kasparov discusses decision making similarities and going only forward thinking of chess and life. Chess has been compared to life many times and has been used as a drosophila of AI for quite some time. I think programming is related to the types of processes that we go through in our daily life as well like: understanding a problem, coming up with initial idea, analyzing that idea to see if it works, producing a final solution. The great skill one can learn from programming is the power of abstraction. We can break down a big problem into small manageable pieces and construct solution out of little building blocks. The valuable decision making skills from chess can be also applied when dealing with analytical problems or even with uncertainty. Can we translate chess or coding skills to other domains? I think there is a limit there, but if we build a character by playing chess or programming it stays forever.

## Conclusion
Why did I decide to compare chess and programming? I felt like there is a lot of similarity between two. You can find these similarities between many things like chess and Tai Chi Chuan as in Josh Waitzkin's book "The Art of Learning: An Inner Journey to Optimal Performance". If you watch UFC matches, the fights are sometimes compared to chess games when it comes to grapling. I can see that myself too: you make small improvements in your position while making opponent's position worse. You might have to give up something like an arm or leg to get something else like a neck. There are lots of things that can be found to be common when talking about mastery or essence of human activity. I think just picking two of them like programming and chess and comparing them might give us insights and feel for those endeavours. We might learn to reapply our knowledge, aproaches, vocabulary and even emotions to other fields. Even more importantly we might learn more about ourselves.


