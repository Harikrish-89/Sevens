import uniqid from "uniqid";
export const createGameFromSettings = (gameSettings) => {
  return {
    Rounds: [],
    Ended: false,
    GameID: uniqid(),
    Messages: [],
    Players: new Array(12),
    Settings: {
      Decks: parseInt(gameSettings.Decks),
      MaxPoint: parseInt(gameSettings.MaxPoint),
      ResponseTime: parseInt(gameSettings.ResponseTime),
    },
    Started: false,
  };
};

export const shuffleCards = (cards) => {
  var currentIndex = cards.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
};

const getDeck = (noOfDecks) => {
  const cards = [];
  for (let i = 0; i < noOfDecks; i++) {
    for (let j = 0; j < Suits.length; j++) {
      for (let k = 0; k < Rank.length; k++) {
        const card = { Suit: Suits[j], ...Rank[k] };
        cards.push(card);
      }
    }
  }
  return cards;
};

export const Suits = ["spades", "hearts", "diams", "clubs"];

export const Rank = [
  { Description: "A", Point: 11, IsPower: true },
  { Description: "2", Point: 2, IsPower: false },
  { Description: "3", Point: 3, IsPower: false },
  { Description: "4", Point: 11, IsPower: false },
  { Description: "5", Point: 5, IsPower: false },
  { Description: "6", Point: 6, IsPower: false },
  { Description: "7", Point: 7, IsPower: true },
  { Description: "8", Point: 8, IsPower: true },
  { Description: "9", Point: 9, IsPower: false },
  { Description: "10", Point: 10, IsPower: false },
  { Description: "J", Point: 20, IsPower: true },
  { Description: "Q", point: 3, IsPower: false },
  { Description: "K", Point: 4, IsPower: false },
];

export const startGame = (game) => {
  game.Started = true;
  startRound(game, true);
};
export const startRound = (game, isFirstRound) => {
  const drawableCards = shuffleCards(getDeck(game.Settings.Decks));
  // create new round
  game.Rounds.push({
    // get players from game in first round get previous round players who has not lost yet and also player might leave in between rounds
    Players: isFirstRound
      ? game.Players
      : game.Rounds[game.Rounds.length - 1].Players.filter(
          (player) => player.Points < game.Settings.MaxPoint
        ),
    DroppedCards: [],
    DrawableCards: [],
    Ended: false,
    IsClockwise: true,
    Started: true,
    SevensDroppedCount: 0,
  });
  const latestRound = getLastRound(game);
  // add cards to players in the round
  latestRound.Players.filter(
    (player) => player.ID !== null && player.ID !== ""
  ).forEach((player) => {
    player.Cards = [];
    for (let i = 0; i < 7; i++) {
      player.Cards.push(drawableCards.pop());
    }
  });
  // get the open card
  const openCard = drawableCards.pop();
  latestRound.DroppedCards.push(openCard);
  latestRound.CurrentSuit = openCard.Suit;
  latestRound.DrawableCards = drawableCards;
  // check if open card is 7, A or J and change game hand accordingly.
  if (getLastElement(latestRound.DroppedCards).Description === "7") {
    latestRound.SevensDroppedCount++;
  } else if (
    getLastElement(latestRound.DroppedCards).Description === "A" &&
    doesRoundHaveMoreThanTwoActivePlayers(game)
  ) {
    latestRound.IsClockwise = !latestRound.IsClockwise;
  } else if (
    getLastElement(latestRound.DroppedCards).Description === "8" &&
    doesRoundHaveMoreThanTwoActivePlayers(game)
  ) {
    latestRound.IsPlayerSkipRequired = true;
  }
  //ToDo: handle J when dropped as first card. moving the hanling of J to action file makes it better as it will have to dispatch a different action
  let host = latestRound.Players.find((player) => player.IsDealer);
  findNextPlayer(game, host.ID);
};

export const DraggableTypes = {
  PLAYING_CARD: "playingCard",
};

export const isAllowedToDropCard = (playerDroppedCard, game) => {
  /* verify if card can be dropped
      1. Allow jack on anything but not on a jack
      2. If its 7 and if 7's dropped count from previous hands is greater than 0 or if 8 and when there are more than two players in the round only same rank can be dropped
      3. If there is already a J on the table only the suit chosen by the player who dropped J can be dropped now.
      4. if not all the above then you can drop same suit or rank
   */
  const cardOnTheTable = getLastElement(getLastRound(game).DroppedCards);
  return (isSeven(cardOnTheTable) &&
    getLastRound(game).SevensDroppedCount > 0) ||
    (isEight(cardOnTheTable) &&
      doesRoundHaveMoreThanTwoActivePlayers(game) &&
      getLastRound(game).IsPlayerSkipRequired)
    ? isSameRank(playerDroppedCard, cardOnTheTable)
    : playerDroppedCard.Description === "J"
    ? !(
        playerDroppedCard.Description === "J" &&
        cardOnTheTable.Description === "J"
      )
    : cardOnTheTable.Description === "J"
    ? playerDroppedCard.Suit === getLastRound(game).CurrentSuit
    : isSameRankOrSuit(playerDroppedCard, cardOnTheTable);
};

export const cardDropped = (game, playerId, playerDroppedCard) => {
  // Change the player cards and round dropped cards
  changePlayerAndRoundCards(game, playerId, playerDroppedCard);
  getLastRound(game).CurrentSuit = playerDroppedCard.Suit;
  // check if game is completed
  if (hasPlayerCompletedRound(game, playerId)) {
    cleanUpLastRound(game);
    if (hasPlayerCompletedGame(game, playerId)) {
      return { action: "FINISH_GAME", type: null };
    } else {
      return { action: "START_NEXT_ROUND", type: null };
    }
  }

  // handle when 7 or 8 or A is dropped,
  //like in the start round moving the logic to handle J will have to go to action file
  else if (playerDroppedCard.Description === "7") {
    getLastRound(game).SevensDroppedCount++;
    return { action: "CONTINUE", type: null };
  }
  if (
    getLastElement(getLastRound(game).DroppedCards).Description === "8" &&
    doesRoundHaveMoreThanTwoActivePlayers(game) // handle 8 fetch
  ) {
    getLastRound(game).IsPlayerSkipRequired = true;
    return { action: "CONTINUE", type: null };
  } else if (
    playerDroppedCard.Description === "A" &&
    doesRoundHaveMoreThanTwoActivePlayers(game)
  ) {
    getLastRound(game).IsClockwise = !getLastRound(game).IsClockwise;
    return { action: "CONTINUE", type: null };
  } else if (playerDroppedCard.Description === "J") {
    return { action: "USER_INPUT", type: "J" };
  } else {
    return { action: "CONTINUE", type: null };
  }
};

export const onCardFetch = (playerId, game) => {
  // check if the drawable cards is empty and get new from the dropped cards in the round
  if (isDrawbleCardsEmpty(game)) {
    handleStackEmpty(game);
  }
  // handle when to pick after 7 dropped.
  if (
    getLastElement(getLastRound(game).DroppedCards).Description === "7" &&
    getLastRound(game).SevensDroppedCount > 0
  ) {
    handleSevenFetch(game, playerId);
    return { action: "CONTINUE", type: null };
  } else if (
    getLastElement(getLastRound(game).DrawableCards).Description === "J" &&
    getLastElement(getLastRound(game).DroppedCards).Description !== "J"
  ) {
    drawNewCardFromStack(game, playerId);
    return { action: "USER_INPUT", type: "J" };
  } else if (
    getLastElement(getLastRound(game).DroppedCards).Description ===
      getLastElement(getLastRound(game).DrawableCards).Description ||
    getLastRound(game).CurrentSuit ===
      getLastElement(getLastRound(game).DrawableCards).Suit
  ) {
    drawNewCardFromStack(game, playerId);
    return { action: "USER_INPUT", type: "SAME_RANK_OR_SUIT" };
  } else {
    drawNewCardFromStack(game, playerId);
    return { action: "CONTINUE", type: null };
  }
};

function cleanUpLastRound(game) {
  const hasFinshedWithJ = hasFinishedWithJ(game);
  game.Rounds[game.Rounds.length - 1].Ended = true;
  game.Rounds[game.Rounds.length - 1].DroppedCards = [];
  game.Rounds[game.Rounds.length - 1].DrawableCards = [];
  game.Rounds[game.Rounds.length - 1].Players.filter(
    (player) => player.IsWaiting
  ).forEach((player) => (player.IsWaiting = false));
  game.Rounds[game.Rounds.length - 1].Players.filter(
    (player) => player.Cards !== null && player.Cards.length > 0
  ).forEach((player) => {
    player.Cards.forEach((card) => {
      player.Points = player.Points + card.Point;
    });
    // Double up the points if finished with j
    if (hasFinshedWithJ) {
      player.Points = player.Points * 2;
    }
  });

  const playerWonTheRound = game.Rounds[game.Rounds.length - 1].Players.filter(
    (player) => player.Cards === null || player.Cards.length === 0
  )[0];
  playerWonTheRound.Points = 0;
}

function hasFinishedWithJ(game) {
  return (
    getLastElement(game.Rounds[game.Rounds.length - 1].DroppedCards)
      .Description === "J"
  );
}

function doesRoundHaveMoreThanTwoActivePlayers(game) {
  return (
    getLastRound(game).Players.filter(
      (player) => player.ID !== null && player.ID !== "" && !player.IsWaiting
    ).length > 2
  );
}

function drawNewCardFromStack(game, playerId) {
  getLastRound(game)
    .Players.find((player) => player.ID === playerId)
    .Cards.push(getLastRound(game).DrawableCards.pop());
}

function handleStackEmpty(game) {
  const lastDroppedCard = getLastRound(game).DroppedCards.pop();
  getLastRound(game).DrawableCards = shuffleCards(
    getLastRound(game).DroppedCards
  );
  getLastRound(game).DroppedCards = [];
  getLastRound(game).DroppedCards.push(lastDroppedCard);
}

function handleSevenFetch(game, playerId) {
  for (let i = 0; i < getLastRound(game).SevensDroppedCount; i++) {
    const currentPlayerCards = getCurrentPlayerCards(game, playerId);
    currentPlayerCards.push(getLastRound(game).DrawableCards.pop());
    currentPlayerCards.push(getLastRound(game).DrawableCards.pop());
  }
  getLastRound(game).SevensDroppedCount = 0;
}

function getCurrentPlayerCards(game, playerId) {
  return getLastRound(game).Players.find((player) => player.ID === playerId)
    .Cards;
}

export function changePlayerAndRoundCards(game, playerId, playerDroppedCard) {
  getCurrentPlayer(game, playerId).Cards = getCurrentPlayer(
    game,
    playerId
  ).Cards.filter(
    (card) =>
      !(
        card.Suit === playerDroppedCard.Suit &&
        card.Description === playerDroppedCard.Description
      )
  );
  getLastRound(game).DroppedCards.push(playerDroppedCard);
}

export function hasPlayerCompletedRound(game, playerId) {
  return (
    getLastRound(game).Players.find((player) => player.ID === playerId).Cards
      .length === 0
  );
}

export function findNextPlayer(game, playerId) {
  // current player has played
  let currentPlayerIndex = getLastRound(game).Players.findIndex(
    (player) => player.ID === playerId
  );
  getLastRound(game).Players[currentPlayerIndex].IsPlayingHand = false;
  // find who has to play for next hand
  if (getLastRound(game).IsClockwise) {
    currentPlayerIndex = currentPlayerIndex % getLastRound(game).Players.length;
    while (
      isNotAnActivePlayer(getLastRound(game), currentPlayerIndex, playerId)
    ) {
      currentPlayerIndex =
        currentPlayerIndex === getLastRound(game).Players.length - 1
          ? 0
          : currentPlayerIndex + 1;
    }
  } else {
    currentPlayerIndex =
      currentPlayerIndex === 0
        ? getLastRound(game).Players.length - 1
        : currentPlayerIndex;
    while (
      isNotAnActivePlayer(getLastRound(game), currentPlayerIndex, playerId)
    ) {
      currentPlayerIndex =
        currentPlayerIndex === 0
          ? getLastRound(game).Players.length - 1
          : currentPlayerIndex - 1;
    }
  }
  getLastRound(game).Players[currentPlayerIndex].IsPlayingHand = true;
}

function isNotAnActivePlayer(latestRound, index, playerId) {
  return (
    latestRound.Players[index].ID === null ||
    latestRound.Players[index].ID === "" ||
    latestRound.Players[index].ID === playerId ||
    latestRound.Players[index].FailedToPlayCount >= 5 ||
    latestRound.Players[index].IsWaiting
  );
}

export function getLastRound(game) {
  return getLastElement(game.Rounds);
}

export function getCurrentPlayer(game, playerId) {
  return getLastRound(game).Players.find((player) => player.ID === playerId);
}

function isDrawbleCardsEmpty(game) {
  return (
    getLastRound(game).DrawableCards.length === 0 ||
    getLastRound(game).DrawableCards < getLastRound(game).SevensDroppedCount
  );
}

function isEight(droppedCard) {
  return droppedCard.Description === "8";
}

function isSeven(droppedCard) {
  return droppedCard.Description === "7";
}

function isSameRankOrSuit(playerDroppedCard, cardOnTheTable) {
  return (
    isSameRank(playerDroppedCard, cardOnTheTable) ||
    cardOnTheTable.Suit === playerDroppedCard.Suit
  );
}

function isSameRank(playerDroppedCard, cardOnTheTable) {
  return playerDroppedCard.Description === cardOnTheTable.Description;
}

export function getLastElement(array) {
  return array[array.length - 1];
}

export function handlePlayerNotResponding(playerId, game) {
  const player = getCurrentPlayer(game, playerId);
  if (player.FailedToPlayCount >= 5) {
    const playerIndex = getLastRound(game).Players.findIndex(
      (player) => player.ID === playerId
    );
    getLastRound(game).Players.splice(playerIndex, 1);
  } else {
    player.FailedToPlayCount++;
  }
  findNextPlayer(game, playerId);
}

export function chooseSuit(suitString) {
  let suit = null;
  if (suitString === "spades") {
    suit = "♠";
  } else if (suitString === "hearts") {
    suit = "♥";
  } else if (suitString === "diams") {
    suit = "♦";
  } else if (suitString === "clubs") {
    suit = "♣";
  }
  return suit;
}

export function skipPlayer(game, playerId) {
  findNextPlayer(game, playerId);
  getLastRound(game).IsPlayerSkipRequired = false;
}

export const removePlayer = (game, playerId) => {
  const playerIndex =
    game.Rounds &&
    game.Rounds.length > 0 &&
    getLastRound(game).Players.findIndex((player) => player.ID === playerId);
  playerIndex && getLastRound(game).Players.splice(playerIndex, 1);
  const gamePlayerIndex = game.Players.findIndex(
    (player) => player.ID === playerId
  );
  gamePlayerIndex && game.Players.splice(gamePlayerIndex, 1);
};

function hasPlayerCompletedGame(game, playerId) {
  return getLastRound(game)
    .Players.filter((player) => player.ID !== playerId)
    .filter((player) => player.ID !== null && player.ID !== "")
    .every((player) => player.Points >= game.Settings.MaxPoint);
}
