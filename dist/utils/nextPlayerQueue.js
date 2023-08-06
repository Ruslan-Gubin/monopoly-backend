export const nextPlayerQueue = (players, player_id, isDouble) => {
    const current = players.findIndex(player => player === player_id);
    if (isDouble) {
        return players[current];
    }
    return current + 1 >= players.length ? players[0] : players[current + 1];
};
