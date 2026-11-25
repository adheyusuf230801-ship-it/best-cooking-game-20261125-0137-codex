[![make.fun bounty](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Leaderboard rank](https://make.fun/badge/best-cooking-game-20261125-0137/adheyusuf230801-ship-it/best-cooking-game-20261125-0137-codex/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/adheyusuf230801-ship-it/best-cooking-game-20261125-0137-codex/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

# Sizzle Panic! — a rush-hour cooking game

You are the cook at a diner counter in the lunch rush. Order tickets land on the board with ingredient stacks and patience bars; build each dish on the plate from the counter bins, grill the patty, bacon and egg and catch them in the golden window before they burn, click the matching ticket to serve for coins and tips, chain combos, chase Daily Specials at double pay, and survive the 150-second shift with your three stars. Original art drawn in code, procedural WebAudio sounds, no libraries, no network.

## Play

```sh
node serve.ts
```

then open http://localhost:8080 — or open game/index.html directly in a desktop browser. Mouse: click bins, grill slots, tickets and the trash. Keys: 1-8 add ingredients, Space serves a matching ticket, Backspace clears the plate, P pauses, M mutes, Enter starts.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

copies game/ and screenshots/ to the output directory and writes its dossier.json with vendor/makefun-game.ts.

Built for make.fun — referral code: 1k2ycn9n
